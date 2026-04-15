"use client";

import React from "react";
import { motion } from "framer-motion";

export const JourneySkeleton = () => {
  return (
    <div className="flex flex-row gap-16 opacity-50">
      {[1, 2, 3].map((group) => (
        <div key={group} className="flex flex-col gap-6 shrink-0 min-w-[300px]">
          {/* Month Header Skeleton */}
          <div className="flex items-center gap-4 py-2 opacity-20">
            <div className="w-32 h-3 bg-muted/20 rounded" />
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center py-2 animate-pulse">
                <div className="w-10 flex justify-center shrink-0">
                  <div className="w-1.5 h-7 rounded-full bg-muted/20" />
                </div>
                <div className="flex items-center gap-4 w-full">
                  <div className="shrink-0 w-4.5 h-4.5 rounded-full bg-muted/20" />
                  <div className="h-4 w-40 bg-muted/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
