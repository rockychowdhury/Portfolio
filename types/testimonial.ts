export interface ITestimonial {
  _id?: string;
  name: string;
  role: string;
  relationship: "Colleague" | "Mentor" | "Classmate" | "Collaborator" | "Client";
  avatar_url?: string;
  quote: string;
  platform: "LinkedIn" | "Direct" | "Email" | "GitHub";
  linkedin_url?: string;
  is_approved: boolean;
  submitted_at: Date;
  approved_at?: Date;
}
