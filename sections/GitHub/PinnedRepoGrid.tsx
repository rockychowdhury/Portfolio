"use client";

import { motion } from "framer-motion";
import PinnedRepoCard from "./PinnedRepoCard";

interface PinnedRepoGridProps {
  repos: any[];
}

export default function PinnedRepoGrid({ repos }: PinnedRepoGridProps) {
  const showcaseRepos = repos.slice(0, 2);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
      {showcaseRepos.map((repo, idx) => (
        <PinnedRepoCard key={repo.name} repo={repo} index={idx} />
      ))}
    </div>
  );
}
