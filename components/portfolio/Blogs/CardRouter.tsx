"use client";

import { IBlog } from "@/lib/db/models/Blog";
import CardA_Hero from "./cards/CardA_Hero";
import CardB_DarkQuote from "./cards/CardB_DarkQuote";
import CardC_Platform from "./cards/CardC_Platform";
import CardD_Minimal from "./cards/CardD_Minimal";
import CardE_WideBanner from "./cards/CardE_WideBanner";
import CardF_Micro from "./cards/CardF_Micro";
import CardG_Overlay from "./cards/CardG_Overlay";

interface CardRouterProps {
  blog: IBlog;
  index: number;
  onTagClick: (tag: string) => void;
}

export default function CardRouter({ blog, index, onTagClick }: CardRouterProps) {
  // Logic to decide which template to use
  
  // 1. Lead Hero (First featured item)
  if (blog.is_featured && index === 0) {
    return <CardA_Hero blog={blog} onTagClick={onTagClick} isPriority />;
  }

  // 2. Overlay Template (Featured/Medium Visual Break)
  if (blog.thumbnail_url && (blog.platform === "Medium" || index % 8 === 4)) {
    return <CardG_Overlay blog={blog} onTagClick={onTagClick} />;
  }

  // 3. Template F: Micro (Used frequently for high density)
  if (index % 5 === 2 || (blog.platform === "Hashnode" && !blog.thumbnail_url)) {
    return <CardF_Micro blog={blog} onTagClick={onTagClick} />;
  }

  // 4. Template B: Dark Quote
  const isLinkedInNoImage = blog.platform === "LinkedIn" && !blog.thumbnail_url;
  if (isLinkedInNoImage || index % 6 === 5) {
    return <CardB_DarkQuote blog={blog} onTagClick={onTagClick} />;
  }

  // 5. Template C: Platform (YouTube)
  if (blog.platform === "YouTube") {
    return <CardC_Platform blog={blog} onTagClick={onTagClick} />;
  }

  // 6. Template A: Hero (Primary template for any content WITH an image)
  if (blog.thumbnail_url) {
    return <CardA_Hero blog={blog} onTagClick={onTagClick} />;
  }

  // 6. Template D: Minimal (Fallback for text-only items)
  return <CardD_Minimal blog={blog} onTagClick={onTagClick} />;
}
