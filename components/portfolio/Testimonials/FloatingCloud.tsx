"use client";

import FloatingCard from "./FloatingCard";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCloudProps {
  testimonials: ITestimonial[];
  isPaused?: boolean;
}

export default function FloatingCloud({ testimonials, isPaused = false }: FloatingCloudProps) {
  // We use 6 tracks for desktop to create a wide "cloud" feel
  // Offsets and rotations are carefully picked to look unorganized but balanced
  const tracks = [
    { offset: "mt-12", rotation: -2, hideMobile: false },
    { offset: "mt-44", rotation: 3, hideMobile: true },
    { offset: "mt-0", rotation: -1, hideMobile: false, isCenter: true }, 
    { offset: "mt-56", rotation: 1.5, hideMobile: false, isCenter: true },
    { offset: "mt-24", rotation: -2.5, hideMobile: true },
    { offset: "mt-64", rotation: 2, hideMobile: false }, // Further down on the right to fix the gap
  ];


  return (
    <div className="relative flex justify-center md:justify-between w-full max-w-[1400px] mx-auto px-6 pointer-events-none min-h-[800px] md:min-h-[1100px] overflow-visible">
      {tracks.map((track, trackIdx) => {
        // Find testimonials assigned to this track
        const trackIndices = [trackIdx, trackIdx + tracks.length];
        const trackTestimonials = trackIndices
          .map(idx => testimonials[idx])
          .filter(Boolean);

        return (
          <div 
            key={trackIdx}
            className={`relative flex flex-col items-center flex-1 transition-all pointer-events-auto 
              ${track.offset} 
              ${track.hideMobile ? 'hidden lg:flex' : 'flex'}
              ${track.isCenter ? 'gap-64 md:gap-96' : 'gap-16 md:gap-40'}
            `}
          >
            {/* Subtle Vertical Guide Line (Purely visual/debug-like) */}
            <div className="absolute inset-y-0 left-1/2 -z-10 w-px bg-gradient-to-b from-transparent via-border/10 to-transparent" />
            
            {trackTestimonials.map((t, i) => (
              <div key={`${t.name}-${i}`} className="relative">
                <FloatingCard 
                  testimonial={t} 
                  index={trackIdx * 2 + i} 
                  rotation={track.rotation * (i % 2 === 0 ? 1 : -1.2)}
                  isPaused={isPaused}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
