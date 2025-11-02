// components/Loader.tsx
import { cn } from "@/lib/utils";
import { StoreIcon } from "lucide-react";
import React from "react";

const Loader = ({ loading }: { loading: boolean }) => {
  const bars = Array.from({ length: 7 });

  return (
    <div>
      <div className={cn("fixed inset-0 w-full h-full flex items-end z-10 pointer-events-none", loading ? 'loading' : '')}>
        {bars.map((bar, index) => (
          <div key={index} style={{ transitionDelay: `${index * 0.1}s` }} className={cn('bg-primary loader-bar h-[0%] flex-1 transition-all duration-500')}></div>
        ))}
      </div>
      <div className={cn("fixed w-full h-full opacity-0 z-20 pointer-events-none transition-opacity duration-500 delay-500 grid place-items-center", loading && 'opacity-100 pointer-events-auto')}>
        <div className="flex gap-x-4 items-center">
          <StoreIcon className="loading-spinner text-primary-foreground" size={40} />
          <span className="text-primary-foreground uppercase text-xl lg:text-4xl font-black">Loading...</span>
        </div>
      </div>
    </div>
  );
};
export default Loader;
