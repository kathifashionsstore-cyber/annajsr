import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { getTimelineStops } from '../services/portfolioService';

const TagCard = ({ number, title, subtitle, text, className, style, aosDelay, aosType, pathLength, containerRef }) => {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useMotionValueEvent(pathLength, "change", (latest) => {
    if (!ref.current || !containerRef.current) return;
    
    const cardRect = ref.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const cardTopRelativeToContainer = cardRect.top - containerRect.top;
    const containerHeight = containerRect.height;
    
    // Trigger when the line tip is 50px into the card
    const triggerY = cardTopRelativeToContainer + 50;
    const lineTipY = latest * containerHeight;
    
    if (lineTipY >= triggerY && !isActive) {
      setIsActive(true);
    } else if (lineTipY < triggerY && isActive) {
      setIsActive(false);
    }
  });

  return (
    <div 
      ref={ref}
      style={style}
      data-aos={aosType || "fade-up"} 
      data-aos-delay={aosDelay}
      className={`w-72 sm:w-85 rounded-[2rem] p-2 relative flex flex-col items-center hover:scale-[1.02] transition-all duration-700 z-10 ${className} ${
        isActive 
          ? 'bg-primary border-secondary/40 shadow-[0_20px_50px_rgba(193,68,14,0.4)]' 
          : 'bg-white border border-gray-200 shadow-[0_15px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* The hole punch */}
      <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] absolute top-4 border border-gray-300 z-10 flex items-center justify-center">
        <div className="w-2 h-2 bg-gray-800 rounded-full opacity-20"></div>
      </div>
      
      {/* Inner container */}
      <div className={`w-full h-full rounded-[1.5rem] mt-8 p-6 md:p-8 flex flex-col min-h-[240px] transition-colors duration-700 ${
        isActive ? 'bg-[#9C3205]/50' : 'bg-offwhite/50'
      }`}>
        <span className={`text-lg font-bold mb-1 font-serif italic transition-colors duration-700 ${
          isActive ? 'text-secondary' : 'text-primary/70'
        }`}>{number}</span>
        
        <h3 className={`text-xl md:text-2xl font-black mb-1 tracking-tight transition-colors duration-700 ${
          isActive ? 'text-white' : 'text-charcoal'
        }`}>{title}</h3>
        
        <h4 className={`text-xs md:text-sm font-bold mb-4 uppercase tracking-wider transition-colors duration-700 ${
          isActive ? 'text-secondary/90' : 'text-[#8A330F]'
        }`}>{subtitle}</h4>
        
        <p className={`text-xs md:text-sm leading-relaxed font-medium transition-colors duration-700 ${
          isActive ? 'text-white/90' : 'text-neutraltext'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};

const JourneyTimeline = () => {
  const containerRef = useRef(null);
  const [timelineStops, setTimelineStops] = useState([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  useEffect(() => {
    const fetchTimeline = async () => {
      const stops = await getTimelineStops();
      if (Array.isArray(stops)) {
        // Ensure chronological ordering (oldest first: order 1 -> 5)
        setTimelineStops(stops.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    };
    fetchTimeline();
  }, []);

  const desktopHeight = Math.max(1000, 300 + timelineStops.length * 340);

  return (
    <section 
      id="experience"
      ref={containerRef}
      className="bg-offwhite pt-24 pb-36 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      <div 
        className="max-w-6xl mx-auto relative" 
        style={{ minHeight: `${desktopHeight}px` }}
      >
        
        {/* Header Content */}
        <div data-aos="fade-up" className="md:absolute top-10 left-0 md:w-[420px] z-20 mb-16 md:mb-0">
          <div className="inline-block border border-primary/30 rounded-full px-5 py-1.5 text-xs text-primary font-bold mb-8 shadow-sm bg-white uppercase tracking-wider">
            My Journey
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal leading-[1.1] mb-6 tracking-tight relative">
            A decade of building systems & driving behaviour change
            <svg className="absolute -bottom-10 right-10 w-12 h-12 text-primary hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4 Q 10 10 15 15 M 15 15 L 10 15 M 15 15 L 15 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </h2>
          <p className="text-neutraltext text-sm md:text-base font-medium leading-relaxed">
            Mobilising communities, advising municipal corporations, and empowering grassroots transformation across public institutions and environmental organizations.
          </p>
        </div>

        {/* Desktop SVG Animated Dashed Line */}
        <svg 
          className="hidden md:block absolute top-0 left-0 w-full pointer-events-none z-0" 
          style={{ height: `${desktopHeight - 30}px` }}
          viewBox={`0 0 1000 ${desktopHeight - 30}`}
          preserveAspectRatio="none"
        >
          {(() => {
            let pathD = "M 650,150 ";
            timelineStops.forEach((_, idx) => {
              const topY = 150 + idx * 340;
              const nextY = 150 + (idx + 1) * 340;
              const isEven = idx % 2 === 0;
              
              if (idx < timelineStops.length - 1) {
                if (isEven) {
                  pathD += `C 500,${topY + 100} 200,${topY + 200} 300,${nextY} `;
                } else {
                  pathD += `C 400,${topY + 100} 750,${topY + 200} 700,${nextY} `;
                }
              } else {
                pathD += `C 650,${topY + 150} 450,${topY + 200} 350,${topY + 250}`;
              }
            });

            return (
              <>
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="2.5" 
                  strokeDasharray="8 10" 
                />
                <mask id="path-mask">
                  <motion.path 
                     d={pathD} 
                     fill="none" 
                     stroke="white" 
                     strokeWidth="20" 
                     style={{ pathLength }}
                  />
                </mask>
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#C1440E" 
                  strokeWidth="2.5" 
                  strokeDasharray="8 10" 
                  mask="url(#path-mask)"
                  className="drop-shadow-sm"
                />
              </>
            );
          })()}
        </svg>

        {/* Mobile Animated Vertical Dashed Line */}
        <svg 
          className="md:hidden absolute top-0 left-[50%] -translate-x-1/2 w-4 h-[100%] pointer-events-none z-0" 
          viewBox="0 0 4 100" 
          preserveAspectRatio="none"
        >
          <path 
            d="M 2,0 L 2,100" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="4" 
            strokeDasharray="4 6" 
            vectorEffect="non-scaling-stroke"
          />
          <mask id="path-mask-mobile">
            <motion.path 
              d="M 2,0 L 2,100" 
              fill="none" 
              stroke="white" 
              strokeWidth="4" 
              style={{ pathLength }}
              vectorEffect="non-scaling-stroke"
            />
          </mask>
          <path 
            d="M 2,0 L 2,100" 
            fill="none" 
            stroke="#C1440E" 
            strokeWidth="4" 
            strokeDasharray="4 6" 
            mask="url(#path-mask-mobile)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Cards Container */}
        <div className="flex flex-col gap-10 md:gap-0 items-center md:block relative z-10 w-full pt-4 md:pt-0 pb-12 md:pb-0">
          {(timelineStops || []).map((stop, idx) => {
            const isEven = idx % 2 === 0;
            const topVal = 50 + idx * 340;
            const rotation = isEven ? (idx % 4 === 0 ? 'rotate-2 md:rotate-3' : 'rotate-1 md:rotate-2') : (idx % 4 === 1 ? '-rotate-2 md:-rotate-4' : '-rotate-1 md:-rotate-2');
            const sideClass = isEven ? 'md:right-[6%] lg:right-[10%]' : 'md:left-[6%] lg:left-[10%]';

            return (
              <TagCard 
                key={stop.id || idx}
                number={stop.number}
                title={stop.title}
                subtitle={stop.subtitle}
                text={stop.text}
                className={`md:absolute ${sideClass} ${rotation}`}
                style={{ top: `${topVal}px` }}
                aosType={isEven ? 'fade-left' : 'fade-right'}
                aosDelay={(idx + 1) * 100}
                pathLength={pathLength}
                containerRef={containerRef}
              />
            );
          })}

          {timelineStops.length > 0 && (
            <div 
              data-aos="fade-in" 
              data-aos-delay="600"
              className="hidden md:block absolute font-serif italic text-2xl text-primary font-bold rotate-2"
              style={{ top: `${desktopHeight - 80}px`, left: '55%' }}
            >
              Ready for what's next!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
