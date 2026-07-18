import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getHeroSlides, logAnalyticsEvent } from '../services/portfolioService';
import { FaAward, FaCalendarCheck } from 'react-icons/fa';

// Fallback images
import slideImg1 from '../assets/gallery/gallery_2.jpeg'; // NSE Mumbai Presentation
import slideImg2 from '../assets/gallery/gallery_3.jpeg'; // Telangana Government Award
import slideImg3 from '../assets/gallery/gallery_4.jpeg'; // UNICEF Team Meet
import slideImg4 from '../assets/gallery/gallery_9.jpeg'; // NABARD Project Launch
import slideImg5 from '../assets/gallery/gallery_10.jpeg'; // Speaking at Abhyas
import slideImg6 from '../assets/gallery/gallery_11.jpeg'; // UNDP BIOFIN Meet
import slideImg7 from '../assets/gallery/gallery_12.jpeg'; // Speaker at Circular Economy Forum
import slideImg8 from '../assets/gallery/gallery_20.jpeg'; // National Youth Icon Award

const fallbackImages = [slideImg1, slideImg2, slideImg3, slideImg4, slideImg5, slideImg6, slideImg7, slideImg8];

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract all valid, non-empty image URLs from the fetched slides list
  const adminImages = slides.map(s => s.imageUrl).filter(Boolean);
  const imagesToUse = adminImages.length > 0 ? adminImages : fallbackImages;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });

    const fetchData = async () => {
      const heroSlidesData = await getHeroSlides();
      setSlides(heroSlidesData || []);
    };
    fetchData();
  }, []);

  // Autoplay for Text Slides (2 seconds)
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000); // 2 seconds auto-advance for text slides
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  // Autoplay for Images (2 seconds)
  useEffect(() => {
    if (isHovered || imagesToUse.length <= 1) return;
    const imgTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesToUse.length);
    }, 2000); // 2 seconds auto-advance for background images
    return () => clearInterval(imgTimer);
  }, [isHovered, imagesToUse.length]);

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
    logAnalyticsEvent({
      type: 'hero_slide_jump',
      label: `Slide ${idx + 1}`
    });
  };

  const activeSlide = slides[currentIndex] || {
    headline: "Behaviour Change & \nIEC Specialist",
    subtext: "9+ years building public systems, IEC/BCC strategy, and climate action programs across Andhra Pradesh & Telangana.",
    imageUrl: fallbackImages[0]
  };

  // Helper to split headline dynamically for rich typography hierarchy
  const formatHeadline = (text) => {
    if (!text) return "";
    const lines = text.split('\n');
    if (lines.length > 1) {
      return (
        <>
          <span className="block text-white/90 font-medium tracking-tight mb-2 text-3xl sm:text-4xl">{lines[0]}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-secondary font-black drop-shadow-md text-4xl sm:text-5xl lg:text-6xl leading-none">
            {lines.slice(1).join('\n')}
          </span>
        </>
      );
    }
    const words = text.split(' ');
    if (words.length > 3) {
      const main = words.slice(0, -2).join(' ');
      const highlight = words.slice(-2).join(' ');
      return (
        <>
          <span className="block text-white/95 font-medium tracking-tight mb-2 text-3xl sm:text-4xl">{main}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-secondary font-black drop-shadow-md text-4xl sm:text-5xl lg:text-6xl leading-none">
            {highlight}
          </span>
        </>
      );
    }
    return (
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-secondary font-black drop-shadow-md text-4xl sm:text-5xl lg:text-6xl leading-none">
        {text}
      </span>
    );
  };

  const activeImageUrl = imagesToUse[currentImageIndex % imagesToUse.length];
  const secondImageUrl = imagesToUse[(currentImageIndex + 1) % imagesToUse.length];
  const bottomImageUrl = isMobile ? secondImageUrl : activeImageUrl;

  return (
    <section 
      id="home" 
      className="bg-charcoal min-h-screen flex items-center pt-28 pb-20 px-6 md:px-12 w-full relative overflow-hidden font-sans border-b border-[#25221F]"
    >
      {/* 1. Micro-grid background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* 2. Soft Ambient color glow bubbles */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 items-center relative z-10">
        
        {/* Mobile Top Rotating Image: Sandwich top layer */}
        <div 
          className="md:hidden w-full flex justify-center items-center py-2 mb-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)] bg-[#2a2622]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={activeImageUrl}
                alt="JSR Annamayya Showcase Top"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover filter brightness-95"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Left Column: Rich Typography Text Block */}
        <div 
          className="flex-1 text-white text-left select-none z-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className="inline-flex items-center gap-2 border border-secondary/40 rounded-full px-5 py-2 text-[10px] sm:text-xs text-secondary font-bold mb-6 bg-[#2d2824]/60 uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping"></span>
            Public Systems Innovator
          </div>

          <div className="min-h-[220px] sm:min-h-[260px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="tracking-tight leading-tight mb-6">
                  {formatHeadline(activeSlide.headline)}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/60 font-semibold leading-relaxed max-w-xl">
                  {activeSlide.subtext}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-full bg-secondary hover:bg-secondary/95 text-charcoal font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_8px_25px_rgba(232,163,61,0.25)] hover:shadow-[0_12px_30px_rgba(232,163,61,0.4)] hover:scale-[1.03] active:scale-[0.97]"
            >
              Collaborate
            </a>
            <a 
              href="#about" 
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-black text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-sm hover:border-white/30"
            >
              Learn More
            </a>
          </div>

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="flex gap-3 mt-12">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === currentIndex 
                      ? 'bg-secondary w-10 shadow-[0_0_10px_rgba(232,163,61,0.5)]' 
                      : 'bg-white/20 hover:bg-white/40 w-2'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Piece de Resistance Asymmetric Layered Showcase */}
        <div 
          className="flex-1 w-full flex justify-center items-center relative py-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className="relative w-full max-w-[400px] aspect-[4/5] z-10">
            
            {/* A. Blurred offset double backdrop shadow layer */}
            <div className="absolute inset-4 rounded-[4rem_3rem_6rem_4rem] overflow-hidden blur-2xl opacity-40 scale-95 translate-x-6 translate-y-6 z-0 pointer-events-none transition-all duration-700">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={bottomImageUrl}
                  alt="Backdrop glow copy"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>
            </div>

            {/* B. Organic masked border wrapper */}
            <div 
              data-aos="zoom-in" 
              className="w-full h-full rounded-[4rem_3rem_6rem_4rem] p-2 bg-charcoal/50 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.55)] relative z-10 backdrop-blur-md overflow-hidden transition-all duration-700 hover:rounded-[3rem_5rem_3rem_5rem]"
            >
              {/* C. Interactive Main Display Container */}
              <div className="w-full h-full rounded-[3.8rem_2.8rem_5.8rem_3.8rem] overflow-hidden relative bg-[#2a2622] transition-all duration-700 hover:rounded-[2.8rem_4.8rem_2.8rem_4.8rem]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={bottomImageUrl}
                    alt="JSR Annamayya Showcase slide"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover select-none relative z-10 filter brightness-95 hover:brightness-100 transition-all duration-500"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* D. Floating badge 1: Years experience */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -left-6 z-20 bg-charcoal/85 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl max-w-[170px]"
            >
              <div className="w-8 h-8 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <FaCalendarCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black text-white">9+ Years</span>
                <span className="block text-[9px] text-white/50 font-bold">Public Systems</span>
              </div>
            </motion.div>

            {/* E. Floating badge 2: Award Recognition */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -right-6 z-20 bg-charcoal/85 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl max-w-[170px]"
            >
              <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                <FaAward className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black text-white">National Awardee</span>
                <span className="block text-[9px] text-white/50 font-bold">Vande Bharat / NYIA</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="animate-bounce">
          <svg 
            className="w-6 h-6 text-white/30 drop-shadow-sm" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

    </section>
  );
};

export default Hero;