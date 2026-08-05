"use client";

export function MetricsSkeleton() {
  return (
    <div className="flex flex-wrap items-start gap-12 md:gap-20 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
         <div key={i} className="flex flex-col">
            <div className="h-12 w-24 bg-secondary/10 rounded-md mb-2" />
            <div className="h-3 w-16 bg-secondary/10 rounded-sm" />
         </div>
      ))}
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="flex justify-between items-end px-2">
        <div className="h-6 w-48 bg-secondary/10 rounded-md" />
        <div className="h-12 w-24 bg-secondary/10 rounded-md" />
      </div>
      <div className="rounded-[2rem] bg-secondary/10 p-10 border border-border/10 h-[280px]" />
    </div>
  );
}

export function LanguagesSkeleton() {
  return (
    <div className="rounded-[2rem] bg-secondary/10 p-8 md:p-10 border border-border/10 h-full animate-pulse flex flex-col">
       <div className="h-7 w-48 bg-secondary/10 rounded-md mb-10" />
       <div className="flex flex-col gap-6 mb-8">
         {[1, 2, 3].map((i) => (
           <div key={i} className="flex items-center gap-4">
             <div className="w-24 h-4 bg-secondary/10 rounded-sm shrink-0" />
             <div className="flex-grow h-5 bg-secondary/10 rounded-full" />
           </div>
         ))}
       </div>
    </div>
  );
}

export function PinnedReposSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-4 w-32 bg-secondary/10 rounded-sm mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-border/10">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-secondary/10 rounded-md" />
            <div className="h-4 w-12 bg-secondary/10 rounded-sm" />
          </div>
          <div className="h-3 w-24 bg-secondary/10 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
