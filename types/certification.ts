export interface ICertification {
  _id?: string;
  ins_name: string;
  certificate_name: string;
  certificate_link?: string;
  preview_link?: string;
  type: "education" | "certification";
  start_date?: string;
  end_date?: string;
  issue_date?: string;
  cgpa?: string;
  description?: string;
  ins_web?: string;
  ins_logo?: string;
  order: number;
}
