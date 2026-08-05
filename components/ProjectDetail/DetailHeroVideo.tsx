"use client";

interface DetailHeroVideoProps {
  videoSrc: string;
  thumbnail: string;
  title: string;
}

import Image from "next/image";

export default function DetailHeroVideo({
  videoSrc,
  thumbnail,
  title,
}: DetailHeroVideoProps) {
  return (
    <div className="w-full flex justify-center pt-6 md:pt-10 pb-6 px-4">
      <div className="relative w-full max-w-[900px] aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-border/20">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "translateZ(0)" }}
            poster={thumbnail}
          />
        ) : (
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
