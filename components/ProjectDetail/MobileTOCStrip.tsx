"use client";

import { useRef, useCallback } from "react";
import { TocItem } from "@/lib/extractTOC";

interface MobileTOCStripProps {
  toc: TocItem[];
}

export default function MobileTOCStrip({ toc }: MobileTOCStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (toc.length === 0) return null;

  return (
    <div className="lg:hidden sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/30 -mx-4 px-4 py-3">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {toc
          .filter((item) => item.level <= 2)
          .map((item) => (
            <button
              key={item.slug}
              onClick={() => handleClick(item.slug)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-border/50 bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground transition-all whitespace-nowrap"
            >
              {item.text}
            </button>
          ))}
      </div>
    </div>
  );
}
