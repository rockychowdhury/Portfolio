"use client";

import { ICertification } from "@/lib/db/models/Certification";
import BentoHeroCell from "./BentoHeroCell";
import BentoCertCard from "./BentoCertCard";

interface Props {
  data: ICertification[];
}

export default function BentoGrid({ data }: Props) {
  // We expect item 1 (Order 1) to be the Education entry
  const heroItem = data.find(item => item.type === "education");
  const certItems = data.filter(item => item.type === "certification");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-6 lg:gap-8">
      {/* Hero Cell: Spans 2x2 on larger screens */}
      {heroItem && <BentoHeroCell item={heroItem} />}

      {/* Certification Cells: Staggered around the hero */}
      {certItems.map((item, index) => (
        <BentoCertCard 
          key={item._id} 
          item={item} 
          index={index} 
        />
      ))}
    </div>
  );
}
