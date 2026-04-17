export interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;          // Short tagline shown in the list
  longDescription?: string;     // Full description (used in modal/detail view)
  thumbnail: string;            // Static image URL (fallback / og image)
  skills: string[];             // e.g. ["FastAPI", "PostgreSQL", "Redis"]
  githubLink?: string;
  liveLink?: string;
  previewLink?: string;         // Short video preview URL
  videoLink?: string;           // YouTube details video URL
  isFeatured: boolean;
  order: number;                // Controls display order, ascending
  createdAt?: Date | string;
}
