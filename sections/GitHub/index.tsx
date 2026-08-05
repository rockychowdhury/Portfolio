import { getGitHubProfile } from "@/lib/db/data/github";
import GitHubClient from "./GitHubClient";

export default async function GitHubSection() {
  const data = await getGitHubProfile();
  return <GitHubClient initialData={data} />;
}
