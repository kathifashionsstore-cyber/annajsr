import React from 'react';

const ProfileStorySection = ({
  number,
  title,
  paragraphs = [],
  highlights = [],
  quote = '',
  image,
  imageAlt = '',
  imagePosition = 'left',
  variant = 'square-gallery' // 'square-gallery' | 'diagonal-arch' | 'top-arch'
}) => {
  const isImageLeft = imagePosition === 'left';

  // Render photo container based on unique variant while maintaining strict 1:1 aspect ratio
  const render1to1Photo = () => {
    if (variant === 'diagonal-arch') {
      return (
        <div className="relative w-full max-w-[480px] mx-auto aspect-square select-none group">
          {/* Offset Outer Terracotta Outline Frame (1:1 Ratio) */}
          <div 
            className={`absolute -top-3 -left-3 w-full h-full border-2 border-[#A84F43] rounded-[50px_0_50px_0] z-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 ${
              isImageLeft ? '' : 'left-auto -right-3'
            }`} 
            aria-hidden="true"
          />

          {/* 1:1 Photo Frame with Diagonal Rounded Corners */}
          <div className="w-full h-full aspect-square overflow-hidden rounded-[50px_0_50px_0] border border-[#DDD7CE] bg-[#F8F6F1] relative z-10 shadow-lg">
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-full aspect-square object-cover object-top transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#111111]/05 pointer-events-none" />
          </div>

          {/* Floating Tag */}
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#A84F43] uppercase font-bold">
            <span>[ FIG {number} • 1:1 ASPECT ]</span>
            <span className="text-[#5F5F5F]/70">CORPORATE LEADERSHIP</span>
          </div>
        </div>
      );
    }

    if (variant === 'top-arch') {
      return (
        <div className="relative w-full max-w-[480px] mx-auto aspect-square select-none group">
          {/* Dotted Backdrop Ring */}
          <div 
            className="absolute -top-5 -left-5 w-full h-full bg-[radial-gradient(#A84F43_2.5px,transparent_2.5px)] [background-size:16px_16px] rounded-t-full opacity-60 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* 1:1 Photo Frame with Top Dome Arch */}
          <div className="w-full h-full aspect-square overflow-hidden rounded-t-full border-2 border-[#DDD7CE] bg-[#F8F6F1] relative z-10 shadow-xl">
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-full aspect-square object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay Title Tag on Image */}
            <div className="absolute bottom-4 left-6 right-6 text-white font-serif text-lg italic font-light drop-shadow">
              "{title}"
            </div>
          </div>

          {/* Floating Tag */}
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#A84F43] uppercase font-bold">
            <span>[ FIG {number} • 1:1 ARCH ]</span>
            <span className="text-[#5F5F5F]/70">PUBLIC IMPACT</span>
          </div>
        </div>
      );
    }

    // Default: 'square-gallery'
    return (
      <div className="relative w-full max-w-[480px] mx-auto aspect-square select-none group">
        {/* Terracotta Offset Backdrop Box (1:1 Ratio) */}
        <div 
          className={`absolute -bottom-4 -right-4 w-full h-full bg-[#A84F43]/15 border border-[#A84F43]/30 z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2 ${
            isImageLeft ? '' : '-right-auto -left-4'
          }`} 
          aria-hidden="true"
        />

        {/* 1:1 Gallery Photo Frame */}
        <div className="w-full h-full aspect-square overflow-hidden border-2 border-[#111111] bg-[#F8F6F1] relative z-10 shadow-md">
          {/* Gallery Corner Ticks (+) */}
          <span className="absolute top-2 left-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>
          <span className="absolute top-2 right-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>
          <span className="absolute bottom-2 left-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>
          <span className="absolute bottom-2 right-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>

          <img
            src={image}
            alt={imageAlt || title}
            className="w-full h-full aspect-square object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#111111]/05 pointer-events-none" />
        </div>

        {/* Floating Tag */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#A84F43] uppercase font-bold">
          <span>[ FIG {number} • 1:1 GALLERY ]</span>
          <span className="text-[#5F5F5F]/70">FOUNDATION</span>
        </div>
      </div>
    );
  };

  return (
    <section className="profile-story border-b border-[#DDD7CE]/60 relative overflow-hidden bg-[#FFFFFF] py-20 md:py-28">
      
      {/* Giant Editorial Watermark Number */}
      <div 
        className={`absolute top-4 font-serif font-bold text-[140px] sm:text-[200px] text-[#A98760]/08 leading-none select-none pointer-events-none z-0 ${
          isImageLeft ? 'right-6 sm:right-16' : 'left-6 sm:left-16'
        }`}
        aria-hidden="true"
      >
        {number}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center profile-story-grid">
          
          {/* 1:1 Photo Container */}
          <div className={`lg:col-span-5 profile-story-media ${isImageLeft ? 'order-1' : 'order-1 lg:order-2'}`}>
            {render1to1Photo()}
          </div>

          {/* Content Container */}
          <div className={`lg:col-span-7 profile-story-content ${isImageLeft ? 'order-2' : 'order-2 lg:order-1'} flex flex-col gap-6`}>
            
            <div>
              <span className="profile-story-number uppercase font-mono font-bold block text-[#A84F43]">
                STORY {number}
              </span>

              <h2 className="profile-story-title text-edi-heading mt-2">
                {title}
              </h2>
            </div>

            {/* Optional Highlight Quote */}
            {quote && (
              <blockquote className="border-l-2 border-[#A84F43] pl-4 py-1 font-serif text-xl sm:text-2xl italic text-[#181818] font-light leading-relaxed my-1">
                "{quote}"
              </blockquote>
            )}

            {/* Paragraphs */}
            <div className="flex flex-col gap-4 text-editorial-body text-[#5F5F5F] font-sans font-medium">
              {paragraphs.map((pText, idx) => (
                <p key={idx}>{pText}</p>
              ))}
            </div>

            {/* Key Takeaway Badges */}
            {highlights && highlights.length > 0 && (
              <div className="pt-4 border-t border-[#DDD7CE]/50 flex flex-wrap gap-2.5 mt-2">
                {highlights.map((hText, hIdx) => (
                  <span 
                    key={hIdx} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F6F1] border border-[#DDD7CE] text-[#806346] font-sans text-xs font-bold uppercase tracking-wider rounded-none shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 bg-[#A84F43] rounded-full shrink-0" />
                    <span>{hText}</span>
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileStorySection;
