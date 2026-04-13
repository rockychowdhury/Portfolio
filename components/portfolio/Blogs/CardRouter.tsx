"use client";

import { IBlog } from "@/lib/db/models/Blog";
import CardA_Hero from "./cards/CardA_Hero";
import CardB_DarkQuote from "./cards/CardB_DarkQuote";
import CardC_Platform from "./cards/CardC_Platform";
import CardD_Minimal from "./cards/CardD_Minimal";
import CardE_WideBanner from "./cards/CardE_WideBanner";

interface CardRouterProps {
  blog: IBlog;
  index: number;
  onTagClick: (tag: string) => void;
}

export default function CardRouter({ blog, index, onTagClick }: CardRouterProps) {
  // Logic to decide which template to use
  
  // 1. Template E: Wide banner (Reserved for first featured item)
  if (blog.is_featured && index === 0) {
    return <CardE_WideBanner blog={blog} onTagClick={onTagClick} />;
  }

  // 2. Template C: Platform (YouTube/Video focus always uses Template C)
  if (blog.platform === "YouTube") {
    return <CardC_Platform blog={blog} onTagClick={onTagClick} />;
  }

  // 3. Template B: Dark Quote (Every 4th card for rhythm, or LinkedIn without image)
  const isLinkedInNoImage = blog.platform === "LinkedIn" && !blog.thumbnail_url;
  if (isLinkedInNoImage || index % 4 === 3) {
    return <CardB_DarkQuote blog={blog} onTagClick={onTagClick} />;
  }

  // 4. Template A: Hero (Primary template for any content WITH an image)
  if (blog.thumbnail_url) {
    return <CardA_Hero blog={blog} onTagClick={onTagClick} />;
  }

  // 5. Template D: Minimal (Fallback for text-only items)
  return <CardD_Minimal blog={blog} onTagClick={onTagClick} />;
}
