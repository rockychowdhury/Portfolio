/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from "cheerio";
import {
  ILeetCodeProfile,
  ICodeforcesProfile,
  ICodeChefProfile,
} from "@/lib/db/models/ProblemSolvingProfile";
import { IGitHubProfile as IGitHubStats } from "@/lib/db/models/GitHubProfile";
import { fetchWithTimeout } from "../utils";

// ── PROBLEM SOLVING FETCHERS ──────────────────────────────────────────────────

export async function fetchLeetCodeProfile(username: string): Promise<ILeetCodeProfile | null> {
  try {
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          userCalendar { totalActiveDays submissionCalendar }
          tagProblemCounts {
            advanced { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            fundamental { tagName problemsSolved }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount rating globalRanking topPercentage
        }
        userContestRankingHistory(username: $username) {
          attended rating
        }
      }
    `;

    const response = await fetchWithTimeout("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
      timeout: 10000,
    });

    const body = await response.json();
    if (body.errors || !body.data?.matchedUser) return null;

    const matchedUser = body.data.matchedUser;
    const acSubmissionNum = matchedUser.submitStats.acSubmissionNum;

    const solvedInfo = {
      all: acSubmissionNum.find((s: any) => s.difficulty === "All")?.count || 0,
      easy: acSubmissionNum.find((s: any) => s.difficulty === "Easy")?.count || 0,
      medium: acSubmissionNum.find((s: any) => s.difficulty === "Medium")?.count || 0,
      hard: acSubmissionNum.find((s: any) => s.difficulty === "Hard")?.count || 0,
    };

    const tags = [
      ...(matchedUser.tagProblemCounts.advanced || []),
      ...(matchedUser.tagProblemCounts.intermediate || []),
      ...(matchedUser.tagProblemCounts.fundamental || []),
    ]
      .sort((a: any, b: any) => b.problemsSolved - a.problemsSolved)
      .slice(0, 6)
      .map((t: any) => t.tagName);

    let heatmap = {};
    try {
      heatmap = JSON.parse(matchedUser.userCalendar.submissionCalendar || "{}");
    } catch (e) {}

    let ratingGraph: number[] = [];
    if (body.data.userContestRankingHistory) {
      ratingGraph = body.data.userContestRankingHistory
        .filter((c: any) => c.attended)
        .map((c: any) => Math.round(c.rating));
    }

    const currentRating = Math.round(body.data.userContestRanking?.rating || 0);
    const maxRating =
      ratingGraph.length > 0 ? Math.max(...ratingGraph, currentRating) : currentRating;

    return {
      handle: username,
      solved: solvedInfo,
      totalActiveDays: matchedUser.userCalendar.totalActiveDays || 0,
      longestStreak: 0,
      contests: {
        attended: body.data.userContestRanking?.attendedContestsCount || 0,
        rating: currentRating,
        maxRating: maxRating,
        globalRanking: body.data.userContestRanking?.globalRanking || 0,
        topPercentage: body.data.userContestRanking?.topPercentage || 0,
      },
      topTags: tags,
      heatmap: heatmap,
      ratingGraph: ratingGraph,
    };
  } catch (error) {
    console.error("LeetCode Fetch Error", error);
    return null;
  }
}

export async function fetchCodeforcesProfile(username: string): Promise<ICodeforcesProfile | null> {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetchWithTimeout(`https://codeforces.com/api/user.info?handles=${username}`, { timeout: 10000 }),
      fetchWithTimeout(`https://codeforces.com/api/user.rating?handle=${username}`, { timeout: 10000 }),
      fetchWithTimeout(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=5000`, {
        timeout: 10000,
      }),
    ]);

    const info = await infoRes.json();
    const ratingData = await ratingRes.json();
    const statusData = await statusRes.json();

    if (info.status !== "OK" || !info.result || info.result.length === 0) return null;

    const user = info.result[0];
    const contests = ratingData.status === "OK" ? ratingData.result : [];

    let totalSolved = 0;
    if (statusData.status === "OK") {
      const solvedSet = new Set();
      statusData.result.forEach((sub: any) => {
        if (sub.verdict === "OK") {
          solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      });
      totalSolved = solvedSet.size;
    }

    let bestRank: number | null = null;
    let ratingGraph: number[] = [];
    if (contests && contests.length > 0) {
      bestRank = Math.min(...contests.map((c: any) => c.rank));
      ratingGraph = contests.map((c: any) => c.newRating);
    }

    return {
      handle: username,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      title: user.rank || "Unrated",
      totalContests: contests.length,
      bestRank,
      totalSolved,
      ratingGraph,
    };
  } catch (error) {
    console.error("Codeforces Fetch Error", error);
    return null;
  }
}

export async function fetchCodeChefProfile(username: string): Promise<ICodeChefProfile | null> {
  try {
    const response = await fetchWithTimeout(`https://www.codechef.com/users/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000,
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const ratingText = $(".rating-number").first().text();
    const rating = parseInt(ratingText) || 0;
    if (rating === 0) return null; // Scraper likely failed or user not found

    const highestRatingMatch = html.match(/Highest Rating (\d+)/i);
    const maxRating = highestRatingMatch ? parseInt(highestRatingMatch[1]) : rating;

    let stars = 1;
    if (rating >= 2500) stars = 7;
    else if (rating >= 2200) stars = 6;
    else if (rating >= 2000) stars = 5;
    else if (rating >= 1800) stars = 4;
    else if (rating >= 1600) stars = 3;
    else if (rating >= 1400) stars = 2;

    const solvedMatch =
      html.match(/Fully Solved \((\d+)\)/i) || html.match(/Problems Solved: (\d+)/i);
    const totalSolved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    const contestsMatch =
      html.match(/Contests \((.*?)\)/i) || html.match(/Contests Participated: (\d+)/i);
    const totalContests = contestsMatch
      ? parseInt(contestsMatch[1].replace(/[^0-9]/g, ""))
      : 0;

    let ratingGraph: number[] = [];
    try {
      const allRatingsMatch = html.match(/var all_rating = (.*?);/);
      if (allRatingsMatch && allRatingsMatch[1]) {
        const ratingData = JSON.parse(allRatingsMatch[1]);
        ratingGraph = ratingData.map((d: any) => parseInt(d.rating));
      }
    } catch (e) {}

    return {
      handle: username,
      rating,
      maxRating,
      stars,
      totalContests,
      totalSolved,
      ratingGraph,
    };
  } catch (error) {
    console.error("CodeChef Fetch Error", error);
    return null;
  }
}

// ── GITHUB & WAKATIME FETCHERS ────────────────────────────────────────────────

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function fetchGitHubStats(username: string): Promise<IGitHubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          followers { totalCount }
          repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
            totalCount
            nodes {
              stargazerCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges { size node { name color } }
              }
            }
          }
          pullRequests(states: MERGED) { totalCount }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { contributionCount date }
              }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name description url stargazerCount forkCount pushedAt
                primaryLanguage { name color }
                repositoryTopics(first: 5) { nodes { topic { name } } }
              }
            }
          }
        }
      }
    `;

    const res = await fetchWithTimeout(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      timeout: 10000,
    });

    const json = await res.json();
    if (json.errors || !json.data?.user) return null;

    const user = json.data.user;

    // Aggregates
    let totalStars = 0;
    const langMap: Record<string, { size: number; color: string }> = {};

    user.repositories.nodes.forEach((repo: any) => {
      totalStars += repo.stargazerCount;
      repo.languages?.edges?.forEach((edge: any) => {
        const name = edge.node.name;
        if (!langMap[name]) langMap[name] = { size: 0, color: edge.node.color };
        langMap[name].size += edge.size;
      });
    });

    const totalLangSize = Object.values(langMap).reduce((sum, l) => sum + l.size, 0);
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 6)
      .map(([name, data]) => ({
        name,
        color: data.color,
        size: data.size,
        percentage: totalLangSize > 0 ? Math.round((data.size / totalLangSize) * 100) : 0,
      }));

    // Heatmap & Streak
    const calendar = user.contributionsCollection.contributionCalendar;
    const heatmap: { date: string; count: number }[] = [];
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        heatmap.push({ date: day.date, count: day.contributionCount });
        if (day.contributionCount > 0) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      });
    });

    for (let i = heatmap.length - 1; i >= 0; i--) {
      if (heatmap[i].count > 0) currentStreak++;
      else if (i === heatmap.length - 1) continue;
      else break;
    }

    const pinned = user.pinnedItems.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage
        ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color }
        : null,
      topics: repo.repositoryTopics?.nodes.map((n: any) => n.topic.name) || [],
      pushedAt: repo.pushedAt,
    }));

    return {
      handle: username,
      metrics: {
        repos: user.repositories.totalCount,
        stars: totalStars,
        commits: calendar.totalContributions,
        followers: user.followers.totalCount,
        prs: user.pullRequests.totalCount,
      },
      heatmap,
      streak: { current: currentStreak, longest: longestStreak },
      languages,
      pinned,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("GitHub Fetch Error", error);
    return null;
  }
}
