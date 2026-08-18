import React from 'react';

export const FeaturedStoreSkeleton = () => {
  return (
    <div className="group relative flex flex-col rounded-[1.75rem] overflow-hidden shadow-sm animate-pulse border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a]">
      {/* Aspect ratio block simulating the store hero image + avatar + texts */}
      <div className="relative aspect-[4/5] bg-slate-200 dark:bg-white/10 w-full overflow-hidden flex flex-col">
        {/* Simulating the bottom dark gradient where text lives */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-white dark:from-[#1a1a1a] via-white/80 dark:via-[#1a1a1a]/80 to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 z-20 p-3 flex flex-col gap-3">
          {/* AVATAR + ONLINE INDICATOR */}
          <div className="flex items-center gap-2.5">
            <div className="relative shrink-0 size-10 md:size-12 rounded-full p-[2px] bg-slate-300 dark:bg-white/20">
              {/* Inner avatar hole */}
              <div className="w-full h-full rounded-full bg-slate-200 dark:bg-[#2a2a2a]" />
              {/* Online indicator hole */}
              <div className="absolute -right-0.5 -bottom-0.5 size-4 bg-slate-300 dark:bg-white/20 border-2 border-white dark:border-[#1a1a1a] rounded-full" />
            </div>

            {/* TEXT LINES */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="w-3/4 h-3.5 md:h-4 bg-slate-300 dark:bg-white/20 rounded-md" />
              <div className="w-1/2 h-2.5 md:h-3 bg-slate-300 dark:bg-white/20 rounded-md" />
            </div>
          </div>

          {/* MINIATURES ROW */}
          <div className="flex items-center gap-2">
            <div className="size-10 md:size-11 rounded-xl bg-slate-300 dark:bg-white/20 shrink-0" />
            <div className="size-10 md:size-11 rounded-xl bg-slate-300 dark:bg-white/20 shrink-0" />
            <div className="size-10 md:size-11 rounded-xl bg-slate-300 dark:bg-white/20 shrink-0 flex items-center justify-center">
              <div className="w-4 h-2.5 bg-slate-200 dark:bg-white/10 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="bg-slate-50 dark:bg-[#111] p-3 border-t border-slate-100 dark:border-white/5">
        <div className="w-full h-9 rounded-xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
};
