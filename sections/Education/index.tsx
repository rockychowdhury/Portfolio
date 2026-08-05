import { getEducation } from "@/lib/db/data/education";
import EducationClient from "./EducationClient";

export default async function EducationSection() {
  const education = await getEducation();
  return <EducationClient initialData={education} />;
}
