export async function getGithubStats(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to fetch Github stats");

    const data = await res.ok ? await res.json() : null;
    
    return {
      public_repos: data?.public_repos || 0,
      followers: data?.followers || 0,
      avatar_url: data?.avatar_url || "",
      html_url: data?.html_url || "",
    };
  } catch (error) {
    console.error("Github fetch error:", error);
    return null;
  }
}

export async function getGithubRepos(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch Github repos");

    return await res.json();
  } catch (error) {
    console.error("Github repos fetch error:", error);
    return [];
  }
}
