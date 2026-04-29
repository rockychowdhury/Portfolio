"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TocItem } from "@/lib/extractTOC";

interface SidebarTOCProps {
  toc: TocItem[];
}

export default function SidebarTOC({ toc }: SidebarTOCProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active heading via Intersection Observer
  useEffect(() => {
    if (typeof window === "undefined" || toc.length === 0) return;

    const headingElements = toc
      .map((item) => document.getElementById(item.slug))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [toc]);

  const handleClick = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-4">
        On This Page
      </p>
      {toc.map((item) => (
        <button
          key={item.slug}
          onClick={() => handleClick(item.slug)}
          className={`block w-full text-left text-sm py-1.5 transition-all duration-200 border-l-2 hover:text-foreground ${
            activeSlug === item.slug
              ? "text-foreground font-semibold border-foreground"
              : "text-muted-foreground border-transparent hover:border-foreground/20"
          }`}
          style={{
            paddingLeft: `${(item.level - 1) * 12 + 12}px`,
          }}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );
}
