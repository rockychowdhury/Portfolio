"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";

interface ProjectVideoProps {
  src: string;
  thumbnail: string;
  isActive: boolean;
  isPaused: boolean;
  onEnded: () => void;
}

const ProjectVideo = forwardRef<HTMLVideoElement, ProjectVideoProps>(
  ({ src, thumbnail, isActive, isPaused, onEnded }, ref) => {
    const videoEl = useRef<HTMLVideoElement>(null);
    const preloadLinkRef = useRef<HTMLLinkElement | null>(null);

    useImperativeHandle(ref, () => videoEl.current as HTMLVideoElement);

    // Play / Pause logic
    useEffect(() => {
      const video = videoEl.current;
      if (!video) return;

      if (isActive && !isPaused && src) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay may be blocked — fail silently
        });
      } else if (isPaused && video) {
        video.pause();
      }
    }, [isActive, isPaused, src]);

    // Resume on hover leave
    useEffect(() => {
      const video = videoEl.current;
      if (!video || !isActive) return;

      if (!isPaused && video.paused && src) {
        video.play().catch(() => {});
      }
    }, [isPaused, isActive, src]);

    // Preload next video at 80% completion
    const handleTimeUpdate = useCallback(() => {
      const video = videoEl.current;
      if (!video || !video.duration) return;

      const progress = video.currentTime / video.duration;
      if (progress >= 0.8 && !preloadLinkRef.current) {
        // We can't know the "next" video src here, but the link will be
        // managed by the parent slider — this is a placeholder hook
      }
    }, []);

    if (!src) {
      // No video — show thumbnail only
      return (
        <div className="w-full h-full relative">
          <img
            src={thumbnail}
            alt="Project preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full relative">
        {/* Thumbnail backdrop while video loads */}
        <img
          src={thumbnail}
          alt="Project preview"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Video element */}
        <video
          ref={videoEl}
          src={src}
          muted
          playsInline
          preload={isActive ? "auto" : "none"}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ willChange: "transform" }}
        />
      </div>
    );
  }
);

ProjectVideo.displayName = "ProjectVideo";

export default ProjectVideo;
