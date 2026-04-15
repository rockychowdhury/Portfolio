"use client";

import React from "react";

const SkeletonCard = () => (
  <div className="h-full bg-card p-5 md:p-6 flex flex-col justify-between animate-pulse rounded-3xl border border-border/50">
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 w-24 bg-muted/20 rounded-full" />
      <div className="h-5 w-20 bg-muted/20 rounded-full" />
    </div>
    
    <div className="aspect-[1.4/1] w-full mb-6 rounded-2xl bg-muted/10 border border-border/10" />
    
    <div className="mb-6 flex-1">
      <div className="h-6 w-full bg-muted/20 rounded mb-3" />
      <div className="h-6 w-2/3 bg-muted/20 rounded mb-4" />
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-muted/20 rounded-full" />
        <div className="h-3 w-32 bg-muted/20 rounded" />
      </div>
      
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted/10 rounded" />
        <div className="h-3 w-full bg-muted/10 rounded" />
        <div className="h-3 w-4/5 bg-muted/10 rounded" />
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-5 border-t border-border/40">
      <div className="h-3 w-24 bg-muted/10 rounded" />
      <div className="h-8 w-32 bg-muted/20 rounded-xl" />
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
