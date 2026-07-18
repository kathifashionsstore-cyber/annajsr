import React from 'react';
import { portfolioData } from '../data/portfolioData';

const VisionSection = () => {
  const { vision } = portfolioData;

  return (
    <section id="vision" className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12 w-full border-b border-edi-border/60">
      
      {/* Title */}
      <div className="mb-16">
        <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-edi-accent uppercase block mb-3">
          04 / DIRECTION & IMPACT
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-light text-edi-heading">
          Vision & Leadership
        </h2>
      </div>

      {/* Grid: 2 columns on desktop, staggered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Left Column (Blocks 1 & 3) */}
        <div className="flex flex-col gap-20">
          
          {/* Block 1: Image above, text below */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm">
              <img
                src={vision[0].image}
                alt={vision[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-edi-accent font-mono font-bold">{vision[0].number}</span>
                <div className="h-[1px] w-8 bg-edi-accent/40"></div>
                <h3 className="font-serif text-2xl font-semibold text-edi-heading">{vision[0].title}</h3>
              </div>
              <p className="text-sm text-edi-body leading-relaxed max-w-md font-medium">
                {vision[0].paragraph}
              </p>
            </div>
          </div>

          {/* Block 3: Image left, text right inside its area */}
          <div className="group grid grid-cols-1 sm:grid-cols-12 gap-6 font-sans items-center">
            <div className="sm:col-span-6 aspect-[4/3] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm">
              <img
                src={vision[2].image}
                alt={vision[2].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
            </div>
            <div className="sm:col-span-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-edi-accent font-mono font-bold">{vision[2].number}</span>
                <div className="h-[1px] w-6 bg-edi-accent/40"></div>
                <h3 className="font-serif text-2xl font-semibold text-edi-heading">{vision[2].title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-edi-body leading-relaxed font-medium">
                {vision[2].paragraph}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (Blocks 2 & 4) - Staggered offset by 64px on desktop */}
        <div className="flex flex-col gap-20 lg:mt-16">
          
          {/* Block 2: Text above, image below */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="flex flex-col gap-2 order-2 sm:order-none">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-edi-accent font-mono font-bold">{vision[1].number}</span>
                <div className="h-[1px] w-8 bg-edi-accent/40"></div>
                <h3 className="font-serif text-2xl font-semibold text-edi-heading">{vision[1].title}</h3>
              </div>
              <p className="text-sm text-edi-body leading-relaxed max-w-md font-medium">
                {vision[1].paragraph}
              </p>
            </div>
            <div className="aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm order-1 sm:order-none">
              <img
                src={vision[1].image}
                alt={vision[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
            </div>
          </div>

          {/* Block 4: Large image above, short content below */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm">
              <img
                src={vision[3].image}
                alt={vision[3].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-edi-accent font-mono font-bold">{vision[3].number}</span>
                <div className="h-[1px] w-8 bg-edi-accent/40"></div>
                <h3 className="font-serif text-2xl font-semibold text-edi-heading">{vision[3].title}</h3>
              </div>
              <p className="text-sm text-edi-body leading-relaxed max-w-md font-medium">
                {vision[3].paragraph}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default VisionSection;
