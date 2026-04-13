import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ProblemSolvingProfile from '@/lib/db/models/ProblemSolvingProfile';
import { 
  fetchLeetCodeProfile, 
  fetchCodeforcesProfile, 
  fetchCodeChefProfile, 
  fetchGitHubProfile 
} from '@/lib/api/platforms/fetchers';

export const revalidate = 0; // Dynamic route

export async function GET() {
  try {
    await connectDB();

    // Try to find existing profile
    const existingProfile = await ProblemSolvingProfile.findOne({});

    const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

    // If no existing profile, we MUST await the fetch to return something
    if (!existingProfile) {
      console.log('No profile found, fetching immediately...');
      const newProfile = await updateProfile();
      return NextResponse.json(newProfile);
    }

    // Check if it's stale (older than 1 hour)
    const now = Date.now();
    const lastUpdated = new Date(existingProfile.lastUpdated).getTime();
    
    if (now - lastUpdated > REFRESH_INTERVAL_MS) {
      console.log('Profile is stale, triggering background refresh...');
      // Fire and forget (in standard Node runs this survives response)
      updateProfile(existingProfile).catch(err => console.error("Background update failed:", err));
    }

    // Return cached immediately for speed
    const fresh = await updateProfile(existingProfile); return NextResponse.json(fresh);

  } catch (error) {
    console.error('Problem solving stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem solving stats' },
      { status: 500 }
    );
  }
}

async function updateProfile(existingProfile?: any) {
  // Parallel fetch from all platforms
  const [leetcode, codeforces, codechef, github] = await Promise.all([
    fetchLeetCodeProfile(process.env.LEETCODE_USERNAME || 'Rocky20809'),
    fetchCodeforcesProfile(process.env.CODEFORCES_USERNAME || '__Cipher__'),
    fetchCodeChefProfile(process.env.CODECHEF_USERNAME || 'rocky20809'),
    fetchGitHubProfile(process.env.GITHUB_USERNAME || 'rockychowdhury')
  ]);

  const profileData = {
    leetcode: leetcode || existingProfile?.leetcode || {
      handle: process.env.LEETCODE_USERNAME,
      solved: { all: 0, easy: 0, medium: 0, hard: 0 },
      totalActiveDays: 0,
      longestStreak: 0,
      contests: { attended: 0, rating: 0, maxRating: 0, globalRanking: 0, topPercentage: 0 },
      topTags: [],
      heatmap: {},
      ratingGraph: []
    },
    codeforces: codeforces || existingProfile?.codeforces || {
      handle: process.env.CODEFORCES_USERNAME,
      rating: 0, maxRating: 0, title: 'Unrated', totalContests: 0, bestRank: null, totalSolved: 0, ratingGraph: []
    },
    codechef: codechef || existingProfile?.codechef || {
      handle: process.env.CODECHEF_USERNAME,
      rating: 0, maxRating: 0, stars: 1, totalContests: 0, totalSolved: 0, ratingGraph: []
    },
    github: github || existingProfile?.github || {
      handle: process.env.GITHUB_USERNAME,
      repos: 0, followers: 0, contributions: 0, topLanguage: '', heatmap: {}
    },
    lastUpdated: new Date()
  };

  // Upsert into DB
  const doc = await ProblemSolvingProfile.findOneAndUpdate(
    {}, 
    { $set: profileData }, 
    { new: true, upsert: true }
  );

  return doc;
}
