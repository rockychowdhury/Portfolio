"use client";

export function MetricsSkeleton() {
  return (
    <div className="flex flex-wrap items-start gap-12 md:gap-20 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
         <div key={i} className="flex flex-col">
            <div className="h-12 w-24 bg-white/5 rounded-md mb-2" />
            <div className="h-3 w-16 bg-white/5 rounded-sm" />
         </div>
      ))}
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="flex justify-between items-end px-2">
        <div className="h-6 w-48 bg-white/5 rounded-md" />
        <div className="h-12 w-24 bg-white/5 rounded-md" />
      </div>
      <div className="rounded-[2rem] bg-secondary/5 p-10 border border-white/5 h-[280px]" />
    </div>
  );
}

export function LanguagesSkeleton() {
  return (
    <div className="rounded-3xl bg-[#0a1120] p-10 border border-white/5 h-full animate-pulse flex flex-col">
       <div className="h-7 w-48 bg-white/5 rounded-md mb-10" />
       <div className="flex flex-col gap-6 mb-8">
         {[1, 2, 3, 4, 5].map((i) => (
           <div key={i} className="flex items-center gap-4">
             <div className="w-24 h-4 bg-white/5 rounded-sm shrink-0" />
             <div className="flex-grow h-5 bg-white/5 rounded-full" />
           </div>
         ))}
       </div>
       <div className="mt-auto pt-4 flex items-center gap-4">
         <div className="w-24 shrink-0" />
         <div className="flex-grow flex justify-between">
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex flex-col items-center gap-2">
               <div className="h-2 w-px bg-white/5" />
               <div className="h-2 w-4 bg-white/5 rounded-sm" />
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}

export function PinnedReposSkeleton() {
  return (
    <div className="mt-12 md:mt-24 animate-pulse">
      <div className="flex items-end justify-between mb-12">
        <div className="h-10 w-64 bg-white/5 rounded-md" />
        <div className="h-3 w-32 bg-white/5 rounded-sm hidden sm:block" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-[2rem] bg-secondary/5 p-10 border border-white/5 h-[320px] flex flex-col justify-between">
            <div>
              <div className="h-3 w-16 bg-white/5 rounded-sm mb-8" />
              <div className="h-8 w-3/4 bg-white/5 rounded-md mb-4" />
              <div className="h-4 w-full bg-white/5 rounded-md mb-2" />
              <div className="h-4 w-2/3 bg-white/5 rounded-md mb-6" />
            </div>
            <div className="h-8 w-full bg-white/5 rounded-sm pt-6 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
