import React from "react";

const FadeMask = () => (
  <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
);

export const GridPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div 
        className="absolute inset-0 h-full w-full text-foreground/[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  </div>
);

export const DotPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div 
        className="absolute inset-0 h-full w-full text-foreground/[0.08]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  </div>
);

export const SlantPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div 
        className="absolute inset-0 h-full w-full text-foreground/[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 10px)`,
        }}
      />
    </div>
  </div>
);

export const BlueprintPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div 
        className="absolute inset-0 h-full w-full text-foreground/[0.04]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1.5px, transparent 1.5px), linear-gradient(to right, currentColor 1.5px, transparent 1.5px)`,
          backgroundSize: '120px 120px',
        }}
      />
      <div 
        className="absolute inset-0 h-full w-full text-foreground/[0.02]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  </div>
);

export const TopoPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 text-foreground/[0.08]">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="topo" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M0 100 C 50 50, 150 50, 200 100 S 350 150, 400 100" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 200 C 50 150, 150 150, 200 200 S 350 250, 400 200" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 300 C 50 250, 150 250, 200 300 S 350 350, 400 300" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 150 C 70 120, 130 120, 200 150 S 330 180, 400 150" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <path d="M0 250 C 70 220, 130 220, 200 250 S 330 280, 400 250" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>
    </div>
  </div>
);

// Re-export Slant as Noise for compatibility if needed, or update consumers
export const NoisePattern = SlantPattern;

export const WavePattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="text-foreground/[0.04]">
        <defs>
          <pattern id="wave" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wave)" />
      </svg>
    </div>
  </div>
);

export const OrbitPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="text-foreground/[0.12]">
        <circle cx="50%" cy="50%" r="100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="50%" cy="50%" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="50%" cy="50%" r="300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="50%" cy="50%" r="400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="50%" cy="50%" r="500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
      </svg>
    </div>
  </div>
);
