"use client";

import React from "react";

const SkeletonItem = () => (
  <div className="relative pl-12 pb-16 animate-pulse">
    {/* Circle on spine */}
    <div className="absolute left-[16.5px] top-2 w-[9px] h-[9px] rounded-full bg-muted/20" />
    
    {/* Duration */}
    <div className="mb-4 w-24 h-3 bg-muted/20 rounded" />
    
    <div className="flex items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-muted/20 shrink-0" />
      
      <div className="flex flex-col gap-2 w-full">
        {/* Title */}
        <div className="h-5 w-2/3 bg-muted/20 rounded" />
        {/* Organization */}
        <div className="h-3 w-1/3 bg-muted/10 rounded" />
      </div>
    </div>
    
    {/* Bullets */}
    <div className="mt-6 ml-14 flex flex-col gap-3">
      <div className="h-4 w-3/4 bg-muted/10 rounded" />
      <div className="h-4 w-1/2 bg-muted/10 rounded" />
      <div className="h-4 w-2/3 bg-muted/10 rounded" />
    </div>
  </div>
);

export const JourneySkeleton = () => {
  return (
    <div className="relative max-w-4xl opacity-50">
      {/* Spine line skeleton */}
      <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-muted/10" />
      
      <div className="flex flex-col">
        {[1, 2, 3].map((item) => (
          <SkeletonItem key={item} />
        ))}
      </div>
    </div>
  );
};
