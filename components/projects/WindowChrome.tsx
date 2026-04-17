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
        "group relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#050505] ring-1 ring-white/5 shadow-2xl",
        className
      )}
    >

      {/* Hardware highlight on top bezel */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent z-30" aria-hidden />
      
      {/* Futuristic Corner Readouts */}
      <div className="absolute top-1 left-8 hidden lg:block z-40 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700">
        <span className="text-[7px] font-black font-mono uppercase tracking-[0.3em] text-white">
          Secure Node // 026
        </span>
      </div>
      <div className="absolute top-1 right-8 hidden lg:block z-40 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700">
        <span className="text-[7px] font-black font-mono uppercase tracking-[0.3em] text-white">
          Relay: Active
        </span>
      </div>

      {/* Title bar - Glassmorphic */}
      <div className="relative flex items-center gap-2 px-6 py-4 bg-white/[0.03] backdrop-blur-xl border-b border-white/5 z-20">
        {/* Traffic lights */}
        <div className="flex gap-2.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
          <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
          <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* URL / address bar */}
        {url && (
          <div className="flex-1 px-4">
            <div className="flex items-center gap-2 bg-white/[0.03] rounded-full px-5 py-1.5 max-w-sm mx-auto border border-white/5 transition-all duration-700 group-hover:bg-white/[0.06] group-hover:border-white/10">
              <div className="w-1 h-1 rounded-full bg-emerald-500/50 animate-pulse" />
              <span className="text-white/30 text-[9px] font-bold font-mono tracking-widest truncate uppercase">
                {url.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        )}
        
        {/* Decorative corner detail */}
        <div className="flex items-center gap-2 opacity-20">
           <div className="w-6 h-1 bg-white/20 rounded-full" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Content area with screen-like recess */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#000]">
        {showOverlays && (
          <>
            {/* Inner shadow to simulate screen depth */}
            <div className="absolute inset-0 shadow-[inset_0_4px_40px_rgba(0,0,0,0.9)] z-10 pointer-events-none" />
            
            {/* Holographic light sweep */}
            <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
               <div className="absolute -inset-[100%] bg-linear-to-tr from-transparent via-white/[0.02] to-transparent rotate-45 translate-x-[-50%] group-hover:translate-x-[50%] transition-transform duration-2500 ease-in-out" />
            </div>
          </>
        )}
        
        {children}

        {showOverlays && (
          <>
            {/* Technical grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] z-12 pointer-events-none" />
            
            {/* Subtle scanline overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/[0.01] to-transparent bg-[size:100%_4px] z-14 pointer-events-none animate-scanline" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 z-16 pointer-events-none" />
          </>
        )}
      </div>
    </div>

  );
}

