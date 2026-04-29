"use client";

import { TocItem } from "@/lib/extractTOC";
import SidebarTOC from "./SidebarTOC";
import MobileTOCStrip from "./MobileTOCStrip";
import RenderedReadme from "./RenderedReadme";
import { ExternalLink } from "lucide-react";

interface DetailLayoutProps {
  readmeHtml: string | null;
  toc: TocItem[];
  project: {
    title: string;
    description: string;
    githubLink: string;
  };
}

export default function DetailLayout({
  readmeHtml,
  toc,
  project,
}: DetailLayoutProps) {
  // Error state: README failed to load
  if (!readmeHtml) {
    return (
      <div className="container-main py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {project.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          <div className="bg-muted/50 rounded-xl p-6 border border-border/40">
            <p className="text-sm text-muted-foreground mb-4">
              README could not be loaded. View it directly on GitHub →
            </p>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background font-semibold text-sm transition-all hover:opacity-90"
            >
              <ExternalLink className="size-3.5" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main pb-20">
      {/* Mobile TOC */}
      <MobileTOCStrip toc={toc} />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 pt-4">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block">
          <SidebarTOC toc={toc} />
        </div>

        {/* README Content */}
        <div className="min-w-0">
          <RenderedReadme html={readmeHtml} />
        </div>
      </div>
    </div>
  );
}
