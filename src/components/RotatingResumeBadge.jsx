import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

const RotatingResumeBadge = ({ className = "" }) => {
  const { resumeUrl } = portfolioData.profile;

  return (
    <a
      href={resumeUrl}
      download="JSR-Annamayya-CV-2026.pdf"
      className={`relative w-[96px] h-[96px] md:w-[145px] md:h-[145px] flex items-center justify-center rounded-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-edi-accent transition-transform select-none bg-edi-cream border border-edi-black/85 ${className}`}
      aria-label="Download JSR Annamayya CV"
    >
      {/* Central Stationary Icon */}
      <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-edi-black text-edi-cream rounded-full flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform duration-300">
        <FaArrowDown className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 group-hover:translate-y-0.5 transition-transform duration-300" />
      </div>

      {/* Rotating Circular Text Container */}
      <div className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            />
          </defs>
          <text className="fill-edi-black font-sans font-bold text-[8.2px] md:text-[8px] uppercase tracking-[0.25em]">
            <textPath xlinkHref="#circlePath" startOffset="0%">
              CV Download • CV Download • CV Download •
            </textPath>
          </text>
        </svg>
      </div>
    </a>
  );
};

export default RotatingResumeBadge;
