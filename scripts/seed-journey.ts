import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Achievement from "../lib/db/models/Achievement";
import dbConnect from "../lib/db/connect";

dotenv.config({ path: ".env.local" });

const STRENGTH_KEYWORDS: Record<string, number> = {
  "BSc": 5,
  "Crown": 5,
  "Trophy": 4,
  "Winner": 4,
  "Rank": 3,
  "Runner-Up": 3,
  "Selected": 3,
  "Organized": 3,
  "Conducted": 3,
  "Completion": 2,
  "Pupil": 2,
  "2*": 2,
  "30 days": 2,
  "Solved": 2,
  "Participated": 2,
};

function getStrengthFromTitle(title: string): number {
  for (const [keyword, strength] of Object.entries(STRENGTH_KEYWORDS)) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      return strength;
    }
  }
  return 2; // Default
}

async function seed() {
  await dbConnect();

  const journeyPath = path.join(process.cwd(), "docs/journey.md");
  const content = fs.readFileSync(journeyPath, "utf-8");
  const lines = content.split("\n");

  const achievements = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith("-") || trimmedLine.includes("#SMILE")) continue;

    // Regex to match: - Title - Month Year [img_url] [handle] [strength]
    // Note: The format is a bit loose in the md file. 
    // Example: - Achieved Pupil On Codeforces - May 2025 [img_url] [handle] [strength]
    
    // Attempt to extract title and date
    // Some lines: - Title - Month Year
    // Some lines: - Title - Month Year [args]
    
    const parts = trimmedLine.substring(1).split(" - ");
    if (parts.length < 2) continue;

    const titlePart = parts[0].trim();
    const dateAndExtras = parts[1].trim();

    // Split date and extras (simplified)
    const dateWords = dateAndExtras.split(" ");
    if (dateWords.length < 2) continue;

    const month = dateWords[0];
    const yearPart = dateWords[1];
    
    // year might have brackets attached if there's no space
    const yearMatch = yearPart.match(/^(\d{4})/);
    if (!yearMatch) continue;
    const year = yearMatch[1];

    const dateStr = `${month} ${year}`;
    
    // Parse sortable date
    let date_sortable;
    try {
      date_sortable = new Date(`${month} 1, ${year}`);
      if (isNaN(date_sortable.getTime())) continue;
    } catch {
      continue;
    }

    // Extract extras
    const extras = dateAndExtras.substring(month.length + year.length + 1).trim();
    
    let strength = getStrengthFromTitle(titlePart);
    let img_url = "";
    let handle = "";

    // Manual overrides from brackets
    const bracketMatches = extras.match(/\[([^\]]+)\]/g);
    if (bracketMatches) {
      for (const match of bracketMatches) {
        const val = match.slice(1, -1).trim();
        if (val === "img_url") continue; // Placeholder
        if (val === "handle") continue; // Placeholder
        if (val === "strength") continue; // Placeholder
        
        if (!isNaN(parseInt(val))) {
          strength = parseInt(val);
        } else if (val.startsWith("http")) {
          if (!handle) handle = val;
          else if (!img_url) img_url = val;
        }
      }
    }

    achievements.push({
      title: titlePart,
      date: dateStr,
      date_sortable,
      strength,
      img_url: img_url || undefined,
      handle: handle || undefined,
    });
  }

  console.log(`Found ${achievements.length} achievements. Clearing old records...`);
  await Achievement.deleteMany({});
  
  console.log("Seeding...");
  await Achievement.insertMany(achievements);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
