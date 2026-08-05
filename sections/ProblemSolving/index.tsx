import { getProblemSolvingProfile } from "@/lib/db/data/github";
import ProblemSolvingClient from "./ProblemSolvingClient";

export default async function ProblemSolvingSection() {
  const data = await getProblemSolvingProfile();
  return <ProblemSolvingClient initialData={data} />;
}
