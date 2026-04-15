"use client";

import { motion } from "framer-motion";
import PinnedRepoCard from "./PinnedRepoCard";

interface PinnedRepoGridProps {
  repos: any[];
}

export default function PinnedRepoGrid({ repos }: PinnedRepoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {repos.map((repo, idx) => (
        <PinnedRepoCard key={repo.name} repo={repo} index={idx} />
      ))}
    </div>
  );
}
