"use client";

import FloatingCard from "./FloatingCard";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCloudProps {
  testimonials: ITestimonial[];
  isPaused?: boolean;
}

export default function FloatingCloud({ testimonials, isPaused = false }: FloatingCloudProps) {
  // We'll use 6 tracks for desktop, 2-3 for mobile
  // Each track has a specific configuration for rotation, offset, and safer spacing in the middle
  const tracks = [
    { offset: "mt-0", rotation: -1.5, hideMobile: false },
    { offset: "mt-32", rotation: 2, hideMobile: true },
    { offset: "mt-12", rotation: -2, hideMobile: false, isCenter: true }, // track next to center
    { offset: "mt-48", rotation: 1.5, hideMobile: false, isCenter: true }, // track next to center
    { offset: "mt-20", rotation: -1, hideMobile: true },
    { offset: "mt-40", rotation: 2.5, hideMobile: false },
  ];

  return (
    <div className="relative flex justify-center md:justify-between w-full max-w-[1700px] mx-auto px-4 pointer-events-none min-h-[700px] md:min-h-[1000px]">
      {tracks.map((track, trackIdx) => {
        // Distribute testimonials across tracks
        // To make it look "unordered", we use the track index to filter
        const trackTestimonials = testimonials.filter((_, idx) => idx % tracks.length === trackIdx);

        return (
          <div 
            key={trackIdx}
            className={`relative flex flex-col items-center flex-1 transition-all pointer-events-auto 
              ${track.offset} 
              ${track.hideMobile ? 'hidden lg:flex' : 'flex'}
              ${track.isCenter ? 'gap-48 md:gap-80' : 'gap-12 md:gap-32'}
            `}
          >
            {/* Vertical Track Line */}
            <div className="absolute inset-y-0 left-1/2 -z-10 w-px border-l border-dashed border-border/20" />
            
            {trackTestimonials.map((t, i) => (
              <div key={`${t.name}-${i}`} className="relative">
                <FloatingCard 
                  testimonial={t} 
                  index={i + trackIdx} 
                  rotation={track.rotation * (i % 2 === 0 ? 1 : -1)}
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
