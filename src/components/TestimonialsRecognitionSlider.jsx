import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

const TestimonialsRecognitionSlider = () => {
  const { testimonials } = portfolioData;

  // Real data slides combining testimonials and verified civilian recognitions
  const slides = [
    {
      id: 's1',
      type: "TESTIMONIAL",
      text: testimonials[0]?.quote || "His strategic interventions in solid waste management helped our corporation achieve Swachh Bharat milestones.",
      author: testimonials[0]?.author || "Municipal Commissioner",
      role: testimonials[0]?.designation || "IAS Officer",
      organisation: testimonials[0]?.company || "Nellore Municipal Corporation"
    },
    {
      id: 's2',
      type: "RECOGNITION",
      text: "Awarded the Vande Bharat Puraskar civilian honor for outstanding contributions to public waste system reforms and environmental advocacy.",
      author: "Govt. of Telangana",
      role: "Civilian Honour",
      organisation: "State Level Recognition"
    },
    {
      id: 's3',
      type: "RECOGNITION",
      text: "Recipient of the National Youth Icon Award in New Delhi, recognized for excellence in youth leadership and mobilizing community clean-up networks.",
      author: "National Youth Parliament",
      role: "National Award",
      organisation: "New Delhi, India"
    },
    {
      id: 's4',
      type: "RECOGNITION",
      text: "Honoured with the Indian Star Icon Award in New Delhi for civilian contributions to public systems governance and citizen IEC strategy.",
      author: "National Human Rights Commission",
      role: "Civilian Award",
      organisation: "New Delhi, India"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleTabVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleTabVisibility);
    return () => document.removeEventListener('visibilitychange', handleTabVisibility);
  }, []);

  // Reset & start timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1 || prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
  };

  useEffect(() => {
    const shouldRun = isPlaying && !isHovered && !hasFocus && isTabVisible && !prefersReducedMotion;
    if (shouldRun) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isPlaying, isHovered, hasFocus, isTabVisible, prefersReducedMotion]);

  // Navigation handlers with timer reset
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelectDot = (idx) => {
    setActiveIndex(idx);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatNumber = (num) => (num < 9 ? `0${num + 1}` : `${num + 1}`);

  return (
    <section
      id="testimonials-recognition"
      className="py-24 md:py-32 bg-[#111111] text-[#F4EFE7] border-b border-[#DDD7CE]/10 w-full relative z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col gap-10 items-center text-center font-sans">
        
        {/* Section Header */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-section-label text-[#A98760] font-bold tracking-[0.2em] block">
            06 / TESTIMONIALS & RECOGNITION
          </span>
          <div className="text-[11px] font-mono text-white/50 tracking-widest uppercase mt-1">
            Slide {formatNumber(activeIndex)} / {formatNumber(slides.length - 1)}
          </div>
        </div>

        {/* Slide Window Container */}
        <div className="relative min-h-[240px] sm:min-h-[200px] w-full flex items-center justify-center overflow-hidden py-4">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-x-0 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col gap-6 items-center ${
                  isActive
                    ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                    : index < activeIndex
                    ? 'opacity-0 -translate-x-12 scale-95 pointer-events-none z-0'
                    : 'opacity-0 translate-x-12 scale-95 pointer-events-none z-0'
                }`}
                style={prefersReducedMotion ? { transition: 'none' } : {}}
              >
                <span className="text-[10px] font-mono tracking-widest text-[#A98760] font-bold uppercase bg-[#181818] px-3 py-1 rounded border border-[#A98760]/30">
                  {slide.type}
                </span>

                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl italic leading-relaxed text-white font-light px-4 sm:px-8 max-w-3xl">
                  "{slide.text}"
                </p>

                <div className="text-xs uppercase tracking-wider text-[#A98760] font-bold">
                  &mdash; {slide.author},{" "}
                  <span className="text-white/60 font-medium">
                    {slide.role} ({slide.organisation})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls Row (Hidden if only 1 slide) */}
        {slides.length > 1 && (
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 select-none">
            
            {/* Prev / PlayPause / Next buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-white/20 hover:border-white hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#A98760]"
                aria-label="Previous slide"
              >
                <FaArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={togglePlayPause}
                className="w-11 h-11 rounded-full border border-white/20 hover:border-[#A98760] text-[#A98760] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#A98760]"
                aria-label={isPlaying ? "Pause testimonial autoplay" : "Resume testimonial autoplay"}
              >
                {isPlaying ? <FaPause className="w-3.5 h-3.5" /> : <FaPlay className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-white/20 hover:border-white hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#A98760]"
                aria-label="Next slide"
              >
                <FaArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDot(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#A98760] ${
                    idx === activeIndex
                      ? 'w-7 bg-[#A98760]'
                      : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsRecognitionSlider;
