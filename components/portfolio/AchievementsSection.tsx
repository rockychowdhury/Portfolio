"use client";

import { useEffect, useState } from "react";
import { AchievementsMarquee } from "@/components/achievements/AchievementsMarquee";
import { Achievement } from "@/components/achievements/achievementsData";

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAchievements(data);
      } catch (err) {
        console.error("Error loading achievements:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  if (loading || achievements.length === 0) {
    return null; // Or a skeleton if desired
  }

  return <AchievementsMarquee achievements={achievements} />;
}
