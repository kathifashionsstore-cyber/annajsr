import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { getVisionBlocks } from '../services/portfolioService';

const VisionSection = () => {
  const [vision, setVision] = useState(portfolioData.vision);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const blocks = await getVisionBlocks();
        if (blocks && blocks.length > 0) {
          setVision(blocks.map(b => ({
            id: b.id,
            number: b.number,
            title: b.title,
            paragraph: b.paragraph,
            image: b.image || b.coverImage
          })));
        }
      } catch (error) {
        console.warn("Failed to load vision blocks dynamically", error);
      }
    };
    loadDynamicData();
  }, []);


  return (
    <section id="vision" className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-12 w-full border-b border-[#DDD7CE]/60">
      
      {/* Title */}
      <div className="mb-16">
        <span className="text-section-label text-[#A98760] font-bold block mb-3">
          04 / DIRECTION & IMPACT
        </span>
        <h2 className="font-serif text-section-headline text-[#181818] font-light">
          Vision & Leadership
        </h2>
      </div>

      {/* Grid: 2 columns on desktop, staggered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Left Column (Blocks 1 & 3) */}
        <div className="flex flex-col gap-20">
          
          {/* Block 1: Image above, text below */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-[#DDD7CE] bg-[#F4EFE7] relative rounded-none shadow-sm select-none">
              <img
                src={vision[0].image}
                alt={vision[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#A98760] font-mono font-bold">{vision[0].number}</span>
                <div className="h-[1px] w-8 bg-[#A98760]/40"></div>
                <h3 className="font-serif text-card-headline text-[#181818] font-semibold">{vision[0].title}</h3>
              </div>
              <p className="text-editorial-body text-[#5F5F5F] leading-relaxed max-w-md font-medium">
                {vision[0].paragraph}
              </p>
            </div>
          </div>

          {/* Block 3: Image above, text below */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-[#DDD7CE] bg-[#F4EFE7] relative rounded-none shadow-sm select-none">
              <img
                src={vision[2].image}
                alt={vision[2].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#A98760] font-mono font-bold">{vision[2].number}</span>
                <div className="h-[1px] w-8 bg-[#A98760]/40"></div>
                <h3 className="font-serif text-card-headline text-[#181818] font-semibold">{vision[2].title}</h3>
              </div>
              <p className="text-editorial-body text-[#5F5F5F] leading-relaxed max-w-md font-medium">
                {vision[2].paragraph}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (Blocks 2 & 4) - Offset by 60px on desktop */}
        <div className="flex flex-col gap-20 lg:mt-[60px]">
          
          {/* Block 2: Image above, text below (offset) */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-[#DDD7CE] bg-[#F4EFE7] relative rounded-none shadow-sm select-none">
              <img
                src={vision[1].image}
                alt={vision[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#A98760] font-mono font-bold">{vision[1].number}</span>
                <div className="h-[1px] w-8 bg-[#A98760]/40"></div>
                <h3 className="font-serif text-card-headline text-[#181818] font-semibold">{vision[1].title}</h3>
              </div>
              <p className="text-editorial-body text-[#5F5F5F] leading-relaxed max-w-md font-medium">
                {vision[1].paragraph}
              </p>
            </div>
          </div>

          {/* Block 4: Image above, text below (offset) */}
          <div className="group flex flex-col gap-6 font-sans">
            <div className="aspect-[16/10] overflow-hidden border border-[#DDD7CE] bg-[#F4EFE7] relative rounded-none shadow-sm select-none">
              <img
                src={vision[3].image}
                alt={vision[3].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#A98760] font-mono font-bold">{vision[3].number}</span>
                <div className="h-[1px] w-8 bg-[#A98760]/40"></div>
                <h3 className="font-serif text-card-headline text-[#181818] font-semibold">{vision[3].title}</h3>
              </div>
              <p className="text-editorial-body text-[#5F5F5F] leading-relaxed max-w-md font-medium">
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
