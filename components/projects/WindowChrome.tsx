// components/projects/WindowChrome.tsx
import { ReactNode } from "react";
import clsx from "clsx";

interface WindowChromeProps {
  children: ReactNode;
  url?: string;
  className?: string;
}

export function WindowChrome({ children, url, className }: WindowChromeProps) {
  return (
    <div
      className={clsx(
        "rounded-xl overflow-hidden border border-white/10 bg-[#1c1c1e] shadow-2xl transition-all duration-500",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2c] border-b border-white/5">
        {/* Traffic lights */}
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>

        {/* URL / address bar */}
        {url && (
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-md px-3 py-1.5 max-w-sm mx-auto border border-white/5">
              <svg
                className="w-3 h-3 text-white/30 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-white/40 text-[10px] font-mono truncate">
                {url.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="w-full aspect-video relative overflow-hidden bg-black">
        {children}
      </div>
    </div>
  );
}
