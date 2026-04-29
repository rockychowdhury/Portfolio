"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function ProjectDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[ProjectDetail] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-6">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Something went wrong
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          README could not be loaded. The project details may be temporarily
          unavailable. You can view the README directly on GitHub or try again.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="h-11 px-6 rounded-full bg-foreground text-background font-semibold text-sm transition-all hover:opacity-90"
          >
            Try Again
          </button>

          <a
            href="/"
            className="h-11 px-6 rounded-full border border-border bg-background text-foreground font-semibold text-sm flex items-center gap-2 transition-all hover:bg-secondary"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
