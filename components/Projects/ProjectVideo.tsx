"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface ProjectVideoProps {
  src: string;
  thumbnail: string;
  isActive: boolean;
  onEnded: () => void;
  onLoadedMetadata?: () => void;
}

const ProjectVideo = forwardRef<HTMLVideoElement, ProjectVideoProps>(
  ({ src, thumbnail, isActive, onEnded, onLoadedMetadata }, ref) => {
    const videoEl = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => videoEl.current as HTMLVideoElement);

    // Play when active
    useEffect(() => {
      const video = videoEl.current;
      if (!video || !src) return;

      if (isActive) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay may be blocked — fail silently
        });
      }
    }, [isActive, src]);

    if (!src) {
      // No video — the parent (ProjectSlider) renders a gradient placeholder
      // as the base layer, so we return nothing here.
      return null;
    }

    return (
      <div className="w-full h-full relative">
        {/* Thumbnail backdrop while video loads */}
        <img
          src={thumbnail}
          alt="Project preview"
          className="absolute inset-0 w-full h-full object-contain z-0"
        />

        {/* Video element */}
        <video
          ref={videoEl}
          src={src}
          muted
          playsInline
          preload={isActive ? "auto" : "none"}
          onEnded={onEnded}
          onLoadedMetadata={onLoadedMetadata}
          className="absolute inset-0 w-full h-full object-contain z-10"
          style={{ willChange: "transform" }}
        />
      </div>
    );
  }
);

ProjectVideo.displayName = "ProjectVideo";

export default ProjectVideo;
