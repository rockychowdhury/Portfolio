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
        "group relative rounded-[1.5rem] overflow-hidden border border-foreground/5 bg-background shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-500",
        className
      )}
    >
      {/* Title bar - Clean Browser Style */}
      <div className="relative flex items-center h-12 px-6 bg-secondary/30 backdrop-blur-md border-b border-foreground/5 z-20">
        {/* Traffic lights */}
        <div className="flex gap-2.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
        </div>

        {/* URL / address bar - Centered Capsule */}
        {url && (
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-foreground/[0.05] rounded-lg px-8 py-1.5 min-w-[300px] border border-foreground/[0.03] transition-all duration-700 pointer-events-auto group-hover:bg-foreground/[0.08]">
              <span className="text-foreground/30 text-[10px] font-medium tracking-tight truncate max-w-[250px]">
                {url.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        )}
        
        {/* Right side spacer/decorative element */}
        <div className="ml-auto w-10 h-3 bg-foreground/5 rounded-full" />
      </div>

      {/* Content area */}
      <div className="relative w-full aspect-video overflow-hidden bg-background">
        {showOverlays && (
          <>
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_1px_10px_rgba(0,0,0,0.02)] z-10 pointer-events-none" />
            
            {/* Interactive light sweep */}
            <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
               <div className="absolute -inset-[100%] bg-linear-to-tr from-transparent via-foreground/[0.02] to-transparent rotate-45 translate-x-[-50%] group-hover:translate-x-[50%] transition-transform duration-2500 ease-in-out" />
            </div>
          </>
        )}
        
        {children}

        {showOverlays && (
          <>
            {/* Very subtle technical grid - lower opacity for 'clean' look */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] z-12 pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}



