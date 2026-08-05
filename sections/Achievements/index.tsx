import { getAchievements } from "@/lib/db/data/achievements";
import AchievementsClient from "./AchievementsClient";

export default async function AchievementsSection() {
  const data = await getAchievements();
  return <AchievementsClient initialData={data} />;
}
