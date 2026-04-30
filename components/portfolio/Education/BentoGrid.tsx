"use client";

import { ICertification } from "@/lib/db/models/Certification";
import BentoCertCard from "./BentoCertCard";

interface Props {
  data: ICertification[];
  isVisible?: boolean;
}

export default function BentoGrid({ data, isVisible }: Props) {
  // Sort: Education first, then certifications by order
  const sortedData = [...data].sort((a, b) => {
    if (a.type === "education") return -1;
    if (b.type === "education") return 1;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {sortedData.map((item, index) => (
        <BentoCertCard 
          key={item._id} 
          item={item} 
          index={index} 
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}
