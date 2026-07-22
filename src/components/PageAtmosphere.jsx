import React from 'react';

const PageAtmosphere = ({ variant = 'home' }) => {
  switch (variant) {
    case 'home':
      return (
        <div className="page-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Large Pale Soft Blob Upper-Left */}
          <div className="hero-soft-blob" />

          {/* Striped Circle Upper-Right */}
          <div className="decorative-striped-circle" />

          {/* Dotted Circle Bottom-Left */}
          <div className="decorative-dotted-circle">
            <div className="dotted-circle-inner" />
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="page-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Pale Beige Blob behind heading */}
          <div 
            className="absolute -top-16 -left-12 w-[600px] h-[600px] bg-[#F5F1EE] opacity-70 pointer-events-none"
            style={{ borderRadius: '48% 52% 58% 42% / 44% 56% 44% 56%' }}
          />
          {/* Thin Outlined Circle */}
          <div className="absolute top-32 right-12 w-64 h-64 rounded-full border border-[#A84F43]/20 pointer-events-none" />
        </div>
      );

    case 'experience':
      return (
        <div className="page-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Large Pale Curved Shape behind title */}
          <div 
            className="absolute -top-24 -left-16 w-[700px] h-[550px] bg-[#F5F1EE] opacity-75 pointer-events-none"
            style={{ borderRadius: '35% 65% 50% 50% / 55% 45% 55% 45%' }}
          />
          {/* Dotted Accent */}
          <div className="absolute top-48 right-16 w-40 h-40 opacity-40 bg-[radial-gradient(#A84F43_2px,transparent_2px)] [background-size:16px_16px] rounded-full pointer-events-none" />
        </div>
      );

    case 'projects':
      return (
        <div className="page-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Pale Blob behind title */}
          <div 
            className="absolute -top-20 -left-20 w-[650px] h-[650px] bg-[#F5F1EE] opacity-70 pointer-events-none"
            style={{ borderRadius: '52% 48% 60% 40% / 45% 55% 45% 55%' }}
          />
          {/* Striped Circle Upper Right */}
          <div className="decorative-striped-circle" style={{ top: '2%', right: '-3%', opacity: 0.8 }} />
        </div>
      );

    case 'contact':
      return (
        <div className="page-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Large Pale Circle behind title */}
          <div className="absolute -top-24 -left-16 w-[550px] h-[550px] bg-[#F5F1EE] rounded-full opacity-75 pointer-events-none" />
          {/* Two Thin Orbit Outlined Circles */}
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-[#A84F43]/20 pointer-events-none" />
          <div className="absolute top-14 right-12 w-88 h-88 rounded-full border border-[#A98760]/15 pointer-events-none" />
        </div>
      );

    default:
      return null;
  }
};

export default PageAtmosphere;
