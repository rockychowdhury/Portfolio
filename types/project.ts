/** Mongoose document shape — used by lib/db/models/Project.ts */
export interface IProject {
  _id?: string;
  title: string;
  description: string;         // Internal reference only — never rendered in UI
  readmeLink: string;           // Raw GitHub README URL for the details page
  thumbnail: string;            // Static image URL — shown before video loads
  githubLink: string;           // CTA — links to GitHub repo
  liveLink: string;             // CTA — "Open" button target
  videoPreviewLink: string;     // Direct video file URL (MP4/WebM) — autoplay when in focus
  youtubeLink: string;          // CTA — YouTube demo video
  order: number;                // Controls left-to-right render order (ascending)
}

/** UI DTO shape — used by components/ProjectDetail/ and components/Projects/ */
export interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;         // Internal reference only — never rendered in UI
  readmeLink: string;           // Raw GitHub README URL
  thumbnail: string;            // Static image URL
  githubLink: string;           // GitHub repo URL
  liveLink: string;             // Live site URL
  videoPreviewLink: string;     // Direct video file URL (MP4/WebM)
  youtubeLink: string;          // YouTube demo video URL
  order: number;                // Render order (ascending)
}

export interface FeatureCard {
  id: string;
  _id?: string;
  projectId: string;            // References parent project
  headline: string;             // e.g. "Real-time Queue with Redis"
  subtext: string;              // One sentence explaining impact
  image: string;                // Screenshot or diagram URL
  ctaLabel: string;             // e.g. "See how →"
  ctaLink: string;              // Link to project detail section
  order: number;
}
