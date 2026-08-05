export interface IBlog {
  _id?: string;
  title: string;
  subtitle: string;
  handle: string;
  platform: "LinkedIn" | "YouTube" | "Medium" | "Dev.to" | "Hashnode";
  thumbnail_url?: string;
  tags: string[];
  etr: number;
  is_featured: boolean;
  is_approved: boolean;
  date_added: Date;
}
