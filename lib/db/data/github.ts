import connectDB from '../connect';
import ProblemSolvingProfile from '../models/ProblemSolvingProfile';
import { IProblemSolvingProfile } from '@/types/problem-solving';
import GitHubProfile from '../models/GitHubProfile';
import { IGitHubProfile } from '@/types/github';

export async function getProblemSolvingProfile(): Promise<IProblemSolvingProfile | null> {
  await connectDB();
  const profile = await ProblemSolvingProfile.findOne().lean();
  return profile ? JSON.parse(JSON.stringify(profile)) : null;
}

export async function getGitHubProfile(): Promise<IGitHubProfile | null> {
  await connectDB();
  const profile = await GitHubProfile.findOne().lean();
  return profile ? JSON.parse(JSON.stringify(profile)) : null;
}
