import * as cheerio from 'cheerio';
import { ILeetCodeProfile, ICodeforcesProfile, ICodeChefProfile, IGitHubProfile } from '@/lib/db/models/ProblemSolvingProfile';

export async function fetchLeetCodeProfile(username: string): Promise<ILeetCodeProfile | null> {
  try {
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userCalendar {
            totalActiveDays
            submissionCalendar
          }
          tagProblemCounts {
            advanced { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            fundamental { tagName problemsSolved }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          topPercentage
        }
        userContestRankingHistory(username: $username) {
          attended
          rating
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
      cache: 'no-store'
    });

    const body = await response.json();
    if (body.errors || !body.data?.matchedUser) {
      return null;
    }

    const matchedUser = body.data.matchedUser;
    const acSubmissionNum = matchedUser.submitStats.acSubmissionNum;
    
    const solvedInfo = {
      all: acSubmissionNum.find((s: any) => s.difficulty === 'All')?.count || 0,
      easy: acSubmissionNum.find((s: any) => s.difficulty === 'Easy')?.count || 0,
      medium: acSubmissionNum.find((s: any) => s.difficulty === 'Medium')?.count || 0,
      hard: acSubmissionNum.find((s: any) => s.difficulty === 'Hard')?.count || 0,
    };

    const tags = [
      ...(matchedUser.tagProblemCounts.advanced || []),
      ...(matchedUser.tagProblemCounts.intermediate || []),
      ...(matchedUser.tagProblemCounts.fundamental || [])
    ].sort((a: any, b: any) => b.problemsSolved - a.problemsSolved)
     .slice(0, 6)
     .map((t: any) => t.tagName);

    let heatmap = {};
    try {
      heatmap = JSON.parse(matchedUser.userCalendar.submissionCalendar || "{}");
    } catch(e) {}

    let ratingGraph = [];
    if (body.data.userContestRankingHistory) {
      ratingGraph = body.data.userContestRankingHistory
        .filter((c: any) => c.attended)
        .map((c: any) => Math.round(c.rating));
    }

    const currentRating = Math.round(body.data.userContestRanking?.rating || 0);
    const maxRating = ratingGraph.length > 0 ? Math.max(...ratingGraph, currentRating) : currentRating;

    return {
      handle: username,
      solved: solvedInfo,
      totalActiveDays: matchedUser.userCalendar.totalActiveDays || 0,
      longestStreak: 0, // Using totalActiveDays on frontend as discussed
      contests: {
        attended: body.data.userContestRanking?.attendedContestsCount || 0,
        rating: currentRating,
        maxRating: maxRating,
        globalRanking: body.data.userContestRanking?.globalRanking || 0,
        topPercentage: body.data.userContestRanking?.topPercentage || 0,
      },
      topTags: tags,
      heatmap: heatmap,
      ratingGraph: ratingGraph
    };
  } catch (error) {
    console.error("LeetCode Fetch Error", error);
    return null;
  }
}

export async function fetchCodeforcesProfile(username: string): Promise<ICodeforcesProfile | null> {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${username}`, { cache: 'no-store' }),
      fetch(`https://codeforces.com/api/user.rating?handle=${username}`, { cache: 'no-store' }),
      fetch(`https://codeforces.com/api/user.status?handle=${username}`, { cache: 'no-store' })
    ]);

    const info = await infoRes.json();
    const ratingData = await ratingRes.json();
    const statusData = await statusRes.json();

    if (info.status !== 'OK' || !info.result || info.result.length === 0) {
      return null;
    }

    const user = info.result[0];
    const contests = ratingData.status === 'OK' ? ratingData.result : [];
    
    // Count unique solved problems
    let totalSolved = 0;
    if (statusData.status === 'OK') {
      const solvedSet = new Set();
      statusData.result.forEach((sub: any) => {
        if (sub.verdict === 'OK') {
          solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      });
      totalSolved = solvedSet.size;
    }

    let bestRank = null;
    let ratingGraph = [];
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
      totalSolved, // Add it to return object
      ratingGraph,
    };
  } catch (error) {
    console.error("Codeforces Fetch Error", error);
    return null;
  }
}

export async function fetchCodeChefProfile(username: string): Promise<ICodeChefProfile | null> {
  try {
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const ratingText = $('.rating-number').first().text();
    const rating = parseInt(ratingText) || 0;
    
    // Parse highest rating
    const highestRatingMatch = html.match(/Highest Rating (\d+)/i);
    const maxRating = highestRatingMatch ? parseInt(highestRatingMatch[1]) : rating;

    // Calculate stars natively if parsing fails
    let stars = 1;
    if (rating >= 2500) stars = 7;
    else if (rating >= 2200) stars = 6;
    else if (rating >= 2000) stars = 5;
    else if (rating >= 1800) stars = 4;
    else if (rating >= 1600) stars = 3;
    else if (rating >= 1400) stars = 2;

    // Fully solved problems (we sum up partial and fully solved, or just fully solved)
    const solvedMatch = html.match(/Fully Solved \((\d+)\)/i) || html.match(/Problems Solved: (\d+)/i);
    const totalSolved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    // Contests
    const contestsMatch = html.match(/Contests \((.*?)\)/i) || html.match(/Contests Participated: (\d+)/i);
    const totalContests = contestsMatch ? parseInt(contestsMatch[1].replace(/[^0-9]/g, '')) : 0;

    // Rating graph (if present in JS window.highcharts)
    let ratingGraph: number[] = [];
    try {
      const allRatingsMatch = html.match(/var all_rating = (.*?);/);
      if (allRatingsMatch && allRatingsMatch[1]) {
        const ratingData = JSON.parse(allRatingsMatch[1]);
        ratingGraph = ratingData.map((d: any) => parseInt(d.rating));
      }
    } catch(e) {}

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

export async function fetchGitHubProfile(username: string): Promise<IGitHubProfile | null> {
  try {
    const response = await fetch(`https://github.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // Contribs
    const contribText = $('h2').filter((i, el) => $(el).text().includes('contributions in the last year')).text();
    const contributions = parseInt(contribText.replace(/[^0-9]/g, '')) || 0;

    // Repos
    const reposText = $('a[href$="tab=repositories"] .Counter').first().text();
    const repos = parseInt(reposText.replace(/[^0-9]/g, '')) || 0;

    // Followers
    const followersText = $('a[href$="tab=followers"] .text-bold').first().text();
    const followers = parseInt(followersText.replace(/[^0-9]/g, '')) || 0;

    // Heatmap via graphql-like toolit. GitHub uses component for heatmap, tricky to parse.
    // Wait, GitHub API has a public endpoint for commits? It's better to just skip github heatmap if hard to get without token.
    // Actually, we can get top languages via GitHub repos REST API over time, but for scraper, let's leave it minimal.
    // For heatmap, github's svg might be readable from `https://github.com/users/${username}/contributions`
    const contribHtmlResponse = await fetch(`https://github.com/users/${username}/contributions`);
    const contribHtml = await contribHtmlResponse.text();
    const $contrib = cheerio.load(contribHtml);
    
    let heatmap: { [date: string]: number } = {};
    $contrib('td.ContributionCalendar-day').each((i, el) => {
      const date = $contrib(el).attr('data-date');
      const levelHtml = $contrib(el).text();
      let count = 0;
      if (levelHtml.toLowerCase().includes('no contributions')) {
        count = 0;
      } else {
        const match = levelHtml.match(/^(\d+)/);
        if (match) count = parseInt(match[1]);
      }
      if (date) heatmap[date] = count;
    });

    return {
      handle: username,
      repos,
      followers,
      contributions,
      topLanguage: "Unknown", // Will populate if using API, for now basic
      heatmap
    };
  } catch(error) {
    console.error("GitHub Fetch Error", error);
    return null;
  }
}
