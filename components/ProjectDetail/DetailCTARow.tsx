"use client";

import { ExternalLink } from "lucide-react";
import { FaGithub, FaYoutube } from "react-icons/fa";

interface DetailCTARowProps {
  githubLink: string;
  liveLink: string;
  youtubeLink?: string;
}

export default function DetailCTARow({
  githubLink,
  liveLink,
  youtubeLink,
}: DetailCTARowProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-8 md:pb-12">
      {/* GitHub */}
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 h-11 px-6 rounded-full border border-border/60 bg-background text-foreground font-semibold text-sm transition-all hover:bg-secondary hover:shadow-md"
      >
        <FaGithub className="size-4 group-hover:rotate-12 transition-transform" />
        GitHub
      </a>

      {/* Live Preview */}
      <a
        href={liveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
      >
        <ExternalLink
          className="size-3.5 group-hover:scale-110 transition-transform"
          strokeWidth={2.5}
        />
        Live Preview
      </a>

      {/* YouTube Demo */}
      {youtubeLink && (
        <a
          href={youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 h-11 px-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg"
        >
          <FaYoutube className="size-4 group-hover:scale-110 transition-transform" />
          YouTube Demo
        </a>
      )}

      {/* Leave a Review */}
      <button
        onClick={() => {
          // Scroll to testimonials or open modal
          const testimonialsSection = document.getElementById("testimonials");
          if (testimonialsSection) {
            testimonialsSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="flex items-center gap-2 h-11 px-6 rounded-full border border-border/60 bg-background text-foreground/70 font-semibold text-sm transition-all hover:bg-secondary hover:text-foreground"
      >
        ✍️ Leave a Review
      </button>
    </div>
  );
}
