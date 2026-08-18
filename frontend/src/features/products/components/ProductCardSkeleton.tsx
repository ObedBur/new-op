import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-[1.75rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm animate-pulse flex flex-col">
      {/* Aspect ratio block for the image equivalent (aspect-[4/5] on mobile, taller on desktop) */}
      <div className="w-full aspect-[4/5] sm:aspect-square bg-slate-200 dark:bg-white/10 relative p-4 flex flex-col justify-between">
        
        {/* Top Badges Skeleton */}
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20" />
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20" />
        </div>
        
        {/* Bottom content overlaid on image in original card */}
        <div className="mt-auto space-y-2">
          {/* Title and price lines */}
          <div className="w-3/4 h-5 rounded-md bg-slate-300 dark:bg-white/20" />
          <div className="w-1/2 h-5 rounded-md bg-slate-300 dark:bg-white/20" />
          
          {/* Store info line */}
          <div className="w-1/3 h-4 rounded-md bg-slate-300 dark:bg-white/20 mt-2" />
        </div>

      </div>

      {/* Button section (typically absolute at bottom or flex-end) */}
      <div className="p-3 bg-white dark:bg-[#1a1a1a]">
        <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
};
