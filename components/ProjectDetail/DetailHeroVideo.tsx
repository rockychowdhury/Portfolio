"use client";

interface DetailHeroVideoProps {
  videoSrc: string;
  thumbnail: string;
  title: string;
}

export default function DetailHeroVideo({
  videoSrc,
  thumbnail,
  title,
}: DetailHeroVideoProps) {
  return (
    <div className="w-full flex justify-center pt-6 md:pt-10 pb-6 px-4">
      <div className="relative w-full max-w-[900px] rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-border/20">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full aspect-video object-cover"
            poster={thumbnail}
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="w-full aspect-video object-cover"
          />
        )}
      </div>
    </div>
  );
}
