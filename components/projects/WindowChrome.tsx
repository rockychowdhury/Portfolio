import { ReactNode, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface WindowChromeProps {
  children: ReactNode;
  url?: string;
  className?: string;
  showOverlays?: boolean;
  hideChrome?: boolean;
}

export function WindowChrome({ children, url, className, showOverlays = true, hideChrome = false }: WindowChromeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={clsx(
        "group relative rounded-[1.5rem] overflow-hidden border border-foreground/5 bg-background shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700",
        className
      )}
    >
      {/* Title bar - Clean Browser Style */}
      {!hideChrome && (
        <div className="relative flex items-center h-9 px-4 bg-secondary/30 backdrop-blur-md border-b border-foreground/5 z-20">
        {/* Traffic lights */}
        <div className="flex gap-2.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
        </div>

        {/* URL / address bar - Centered Capsule */}
        {url && (
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-4 bg-secondary/50 rounded-full px-5 py-0.5 min-w-[240px] border border-foreground/[0.03] transition-all duration-700 pointer-events-auto group-hover:bg-secondary/80 group-hover:border-foreground/10 group-hover:min-w-[280px]">
              <span className="text-foreground/30 text-[9px] font-medium tracking-tight truncate max-w-[200px]">
                {url.replace(/^https?:\/\//, "")}
              </span>
              <button 
                onClick={handleCopy}
                className="ml-auto p-1 rounded-md hover:bg-foreground/10 transition-colors pointer-events-auto group/copy"
                title="Copy URL"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check className="size-3 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Copy className="size-3 text-foreground/20 group-hover/copy:text-foreground/40 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        )}
        
        {/* Right side Featured Badge */}
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-foreground text-background transition-transform duration-500 group-hover:scale-105 shadow-sm">
           <div className="size-1 rounded-full bg-background/30 animate-pulse" />
           <span className="text-[8px] font-medium uppercase tracking-[0.1em]">Featured</span>
        </div>
      </div>
      )}

      {/* Content area */}
      <div className={clsx(
        "relative w-full overflow-hidden bg-background",
        hideChrome ? "h-full" : "aspect-video"
      )}>
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
    </motion.div>
  );
}



