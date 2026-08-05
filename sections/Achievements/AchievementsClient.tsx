"use client";

import { useEffect, useState } from "react";
import { AchievementsMarquee } from "@/sections/Achievements/AchievementsMarquee";
import { IAchievement } from "@/types/achievement";

export default function AchievementsClient({ initialData }: { initialData: IAchievement[] }) {
  if (!initialData || initialData.length === 0) {
    return null;
  }

  return <AchievementsMarquee achievements={initialData} />;
}
