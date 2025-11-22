"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons
import { LucideProps } from 'lucide-react'; // Import LucideProps (still useful for props type)

interface BusinessSector {
  id: string;
  name: string;
  name_ta: string;
  icon: string; // Name of the Lucide icon
}

interface BusinessSectorCardProps {
  sector: BusinessSector;
}

export function BusinessSectorCard({ sector }: BusinessSectorCardProps) {
  const router = useRouter();
  const [displayEnglish, setDisplayEnglish] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayEnglish((prev) => !prev);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCardPress = () => {
    router.push(`/jobs/${encodeURIComponent(sector.name)}`); // Encode the category name for URL
  };

  // Dynamically get the Lucide icon component, ensure it's a valid React component
  const IconComponent = (LucideIcons[sector.icon as keyof typeof LucideIcons] || LucideIcons.Briefcase) as React.ComponentType<LucideProps>;

  return (
    <button
      onClick={handleCardPress}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2" // Responsive width
    >
      <div className="card flex flex-col items-center justify-center p-4 aspect-square">
        <div className="mb-2">
          <IconComponent className="w-12 h-12 text-[#007AFF]" />
        </div>
        <p className="text-lg font-semibold text-center">
          {displayEnglish ? sector.name : sector.name_ta}
        </p>
      </div>
    </button>
  );
}
