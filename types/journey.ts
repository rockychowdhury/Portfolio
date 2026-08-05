export interface IJourney {
  _id?: string;
  title: string;
  organization: string;
  duration: string;
  description: string[];
  startDate: Date;
  icon?: string;
  type: "work" | "education" | "leadership" | "achievement";
}
