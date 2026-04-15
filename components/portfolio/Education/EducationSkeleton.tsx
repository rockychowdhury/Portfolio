"use client";

import React from "react";

const SkeletonCard = () => (
  <div className="h-full bg-card/40 backdrop-blur-xl p-8 flex flex-col justify-between animate-pulse rounded-[2.5rem] border border-border/50">
    <div className="flex justify-between items-center mb-8">
      <div className="h-4 w-32 bg-muted/20 rounded-full" />
      <div className="h-8 w-24 bg-muted/20 rounded-full" />
    </div>
    
    <div className="aspect-[1.4/1] w-full mb-10 rounded-[2.5rem] bg-muted/10 border border-border/10" />
    
    <div className="mb-8 flex-1 px-1">
      <div className="h-8 w-full bg-muted/20 rounded-lg mb-4" />
      <div className="h-8 w-2/3 bg-muted/20 rounded-lg mb-6" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-muted/20 rounded-xl" />
        <div className="h-3 w-40 bg-muted/20 rounded" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-16 bg-muted/10 rounded-md" />
        <div className="h-6 w-20 bg-muted/10 rounded-md" />
        <div className="h-6 w-14 bg-muted/10 rounded-md" />
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-8 border-t border-border/10">
      <div className="h-3 w-32 bg-muted/10 rounded" />
      <div className="h-10 w-28 bg-muted/20 rounded-2xl" />
    </div>
  </div>
);

export const EducationSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
