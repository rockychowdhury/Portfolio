"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPreviewProps {
  src: string;
  onEnded?: () => void;
  isActive: boolean;
}

export default function VideoPreview({ src, onEnded, isActive }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(err => {
        if (err.name !== "AbortError") console.warn("Video playback failed:", err);
      });
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
        onEnded={onEnded}
      />
    </div>
  );
}