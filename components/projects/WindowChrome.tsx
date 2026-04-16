// components/projects/WindowChrome.tsx
import { ReactNode } from "react";
import clsx from "clsx";

interface WindowChromeProps {
  children: ReactNode;
  url?: string;
  className?: string;
  showOverlays?: boolean;
}

export function WindowChrome({ children, url, className, showOverlays = true }: WindowChromeProps) {
  return (
    <div
      className={clsx(
        "group relative rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-700 ring-1 ring-white/5",
        className
      )}
    >
      {/* Hardware highlight on top bezel */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent z-30" aria-hidden />

      {/* Title bar */}
      <div className="relative flex items-center gap-2 px-5 py-3 bg-linear-to-b from-[#111] to-[#0a0a0a] border-b border-white/5 z-20">
        {/* Traffic lights */}
        <div className="flex gap-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>

        {/* URL / address bar */}
        {url && (
          <div className="flex-1 px-4">
            <div className="flex items-center gap-2 bg-white/[0.02] rounded-full px-4 py-1 max-w-sm mx-auto border border-white/5 transition-all duration-700 group-hover:bg-white/[0.04]">
              <svg
                className="w-2.5 h-2.5 text-white/10 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-white/20 text-[9px] font-mono tracking-wider truncate">
                {url.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        )}
        
        {/* Decorative corner detail */}
        <div className="w-12 h-1 bg-white/[0.03] rounded-full hidden md:block" />
      </div>

      {/* Content area with screen-like recess */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#050505]">
        {showOverlays && (
          <>
            {/* Inner shadow to simulate screen depth */}
            <div className="absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
          </>
        )}
        
        {children}

        {showOverlays && (
          <>
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
               <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out" />
            </div>
            
            {/* Subtle scanline/vignette overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 z-15 pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}

