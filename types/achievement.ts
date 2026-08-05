export interface IAchievement {
  _id?: string;
  category: string;
  title: string;
  organization: string;
  date: string; // "MMM YYYY" format
  date_sortable: Date;
  details?: Record<string, any>;
  tags?: string[];
  img_url?: string;
  handle?: string;
  strength?: number; // 1-5
}
