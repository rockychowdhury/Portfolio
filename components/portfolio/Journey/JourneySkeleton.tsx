"use client";

import React from "react";
import { motion } from "framer-motion";

const SkeletonItem = ({ i }: { i: number }) => (
  <div className="flex items-center py-2 animate-pulse">
    <div className="w-10 flex justify-center shrink-0">
      <div className="w-1.5 h-7 rounded-full bg-muted/20" />
    </div>
    <div className="flex items-center gap-4 w-full">
      <div className="shrink-0 w-4.5 h-4.5 rounded-full bg-muted/20" />
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-5 w-full">
        <div className="h-4 w-48 bg-muted/20 rounded" />
        <div className="h-3 w-24 bg-muted/10 rounded" />
      </div>
    </div>
  </div>
);

export const JourneySkeleton = () => {
  return (
    <div className="flex flex-col gap-8 opacity-50">
      {[1, 2].map((group) => (
        <div key={group} className="flex flex-col gap-2">
          {/* Month Header Skeleton */}
          <div className="flex items-center gap-4 py-2 opacity-20">
            <div className="w-40 h-3 bg-muted/20 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            {[1, 2, 3].map((item) => (
              <SkeletonItem key={item} i={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
