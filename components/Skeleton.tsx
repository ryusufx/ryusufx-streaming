
import React from 'react';

export const MovieSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-3">
      <div className="bg-[#31343e] rounded-md aspect-[2/3] w-full"></div>
      <div className="bg-[#31343e] h-4 w-3/4 rounded"></div>
      <div className="bg-[#31343e] h-3 w-1/2 rounded"></div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-[#31343e] h-[400px] md:h-[600px] w-full relative">
      <div className="absolute bottom-10 left-10 space-y-4 w-1/2">
        <div className="bg-[#4a4d58] h-12 w-full rounded"></div>
        <div className="bg-[#4a4d58] h-6 w-1/3 rounded"></div>
        <div className="bg-[#4a4d58] h-20 w-full rounded"></div>
      </div>
    </div>
  );
};
