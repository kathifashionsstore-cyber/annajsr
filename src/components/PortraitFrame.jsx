import React from 'react';

const PortraitFrame = ({ src, alt = "JSR Annamayya Portrait", className = "" }) => {
  return (
    <div className={`relative w-full max-w-[450px] aspect-[4/5] mx-auto select-none ${className}`}>
      
      {/* 1. Large Muted Beige Organic Shape (Behind) */}
      <div 
        className="absolute top-4 -left-6 w-full h-[98%] bg-edi-beige/40 rounded-sm z-0 pointer-events-none"
        style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
      ></div>

      {/* 2. Thin Outlined Circle (Behind) */}
      <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full border border-edi-accent/30 pointer-events-none z-0"></div>

      {/* 3. Small Cream or Gold Rectangular Element (Behind) */}
      <div className="absolute -top-4 -right-4 w-12 h-16 bg-edi-accent/20 border border-edi-accent/10 z-0 pointer-events-none"></div>

      {/* 4. Subtle Vertical Line (Behind) */}
      <div className="absolute top-1/4 -left-8 w-[1px] h-32 bg-edi-border z-0 pointer-events-none"></div>

      {/* 5. Decorative Dot (Behind) */}
      <div className="absolute bottom-12 -left-12 w-3.5 h-3.5 bg-edi-accent rounded-full z-0 pointer-events-none"></div>

      {/* Main Portrait Image Wrapper */}
      <div className="relative w-full h-full overflow-hidden border border-edi-border bg-edi-cream shadow-sm z-10 rounded-sm">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        {/* Subtle 10% dark overlay as specified */}
        <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
      </div>

    </div>
  );
};

export default PortraitFrame;
