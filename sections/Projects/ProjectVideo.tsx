"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface ProjectVideoProps {
  src: string;
  isActive: boolean;
  onEnded: () => void;
  onLoadedMetadata?: () => void;
}

const ProjectVideo = forwardRef<HTMLVideoElement, ProjectVideoProps>(
  ({ src, isActive, onEnded, onLoadedMetadata }, ref) => {
    const videoEl = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => videoEl.current as HTMLVideoElement);

    useEffect(() => {
      const video = videoEl.current;
      if (!video || !src) return;

      if (isActive) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, [isActive, src]);

    if (!src) return null;

    return (
      <video
        ref={videoEl}
        src={src}
        muted
        playsInline
        preload={isActive ? "auto" : "none"}
        onEnded={onEnded}
        onLoadedMetadata={onLoadedMetadata}
        className="absolute inset-0 w-full h-full object-cover object-top z-10"
        style={{ willChange: "transform" }}
      />
    );
  }
);

ProjectVideo.displayName = "ProjectVideo";

export default ProjectVideo;
