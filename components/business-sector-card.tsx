"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { BusinessSector } from "@/constants/business-sectors"

interface BusinessSectorCardProps {
  sector: BusinessSector;
}

export function BusinessSectorCard({ sector }: BusinessSectorCardProps) {
  const router = useRouter();
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayEnglish((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCardPress = () => {
    router.push(`/jobs/${encodeURIComponent(sector.name)}`);
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
      <button
        onClick={handleCardPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#FEFAE0] border-2 border-[#E9EDC9] hover:border-[#606C38] transition-all duration-500 hover:shadow-2xl hover:shadow-[#DDA15E]/20 hover:-translate-y-2"
      >
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#606C38]/5 via-transparent to-[#DDA15E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex flex-col items-center justify-center p-6 aspect-square">
          {/* Icon container with 3D rotation effect */}
          <div className={`mb-4 relative transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
            }`}>
            <div className="absolute inset-0 bg-[#DDA15E]/20 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FEFAE0] to-white border-2 border-[#E9EDC9] group-hover:border-[#DDA15E] transition-colors duration-300">
              <img
                src={sector.icon}
                alt={sector.name}
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Text with slide-up animation */}
          <div className="overflow-hidden">
            <p className={`text-base font-bold text-center text-[#283618] transition-all duration-500 ${isHovered ? 'translate-y-0' : ''
              }`}>
              {displayEnglish ? sector.name : sector.name_ta}
            </p>
          </div>

          {/* Job count indicator (optional - can be dynamic) */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-xs font-medium text-[#606C38] bg-[#E9EDC9] px-3 py-1 rounded-full">
              View Jobs →
            </span>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#DDA15E]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </button>
    </div>
  );
}
