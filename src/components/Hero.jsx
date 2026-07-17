import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getHeroSlides, getGalleryImages, logAnalyticsEvent } from '../services/portfolioService';

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

const Hero = ({ isGalleryOpen, setIsGalleryOpen }) => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });

    const fetchData = async () => {
      const heroSlidesData = await getHeroSlides();
      setSlides(heroSlidesData);
      
      const imgs = await getGalleryImages();
      setGallery(imgs);
    };
    fetchData();
  }, []);

  // Sync autoplay
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
  };

  const getSlideImage = (slide, index) => {
    if (slide.imageUrl && (slide.imageUrl.startsWith('http') || slide.imageUrl.startsWith('/') || slide.imageUrl.startsWith('data:'))) {
      return slide.imageUrl;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  // Text transition variants
  const textVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 }
  };

  // Image transition variants
  const imageVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' }
  };

  const currentSlide = slides[currentIndex] || {
    headline: "Behaviour Change & \nIEC Specialist",
    subtext: "9+ years building public systems, IEC/BCC strategy, and climate action programs across Andhra Pradesh & Telangana."
  };

  return (
    <section 
      id="home"
      className="relative w-full min-h-screen bg-charcoal flex items-center pt-28 pb-16 md:py-0 overflow-hidden text-white font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-10 text-white/5 text-[12vw] font-black select-none pointer-events-none uppercase tracking-widest z-0">
        IEC
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Animated Text Block */}
          <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 border border-secondary/35 rounded-full px-4 py-1.5 text-xs text-secondary font-bold mb-6 bg-[#2d2824]/80 backdrop-blur-sm shadow-sm select-none uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              National Awardee
            </div>

            <div className="min-h-[220px] sm:min-h-[200px] md:min-h-[240px] w-full flex flex-col justify-start relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] whitespace-pre-line">
                    {currentSlide.headline ? (
                      currentSlide.headline.split('\n').length > 1 ? (
                        <>
                          {currentSlide.headline.split('\n')[0]} <br />
                          <span className="text-secondary font-black drop-shadow-md">
                            {currentSlide.headline.split('\n').slice(1).join('\n')}
                          </span>
                        </>
                      ) : (
                        currentSlide.headline
                      )
                    ) : (
                      <>
                        Hi, I'm a <br />
                        <span className="text-secondary font-black drop-shadow-md">
                          Behaviour Change Specialist
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="text-white/80 text-sm md:text-base lg:text-lg font-medium mb-8 max-w-2xl leading-relaxed">
                    {currentSlide.subtext}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div 
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex flex-row flex-wrap items-center gap-4 w-full mb-10"
            >
              <a 
                href="#experience"
                className="px-6 py-3.5 rounded-full bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(193,68,14,0.4)] transition-all duration-300 transform hover:scale-105 shadow-md text-center"
              >
                View My Journey
              </a>

              <a 
                href="#contact"
                className="px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs md:text-sm hover:bg-white/20 transition-all duration-300 backdrop-blur-md text-center"
              >
                Contact Me
              </a>
            </div>

            {/* Navigation Dot Indicators */}
            {slides.length > 1 && (
              <div className="flex gap-2.5 items-center select-none" data-aos="fade-up" data-aos-delay="400">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-secondary' : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Synced Image Frame */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none">
            <div 
              data-aos="zoom-in"
              className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-[#25221F]"
            >
              {/* Decorative side accent lines */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-secondary z-20"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-secondary z-20"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-secondary z-20"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-secondary z-20"></div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={getSlideImage(currentSlide, currentIndex)}
                  alt="JSR Annamayya Public Systems Specialist"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full object-cover relative z-10"
                />
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* --- DYNAMIC FULL-SCREEN PHOTO GALLERY LIGHTBOX --- */}
      {isGalleryOpen && gallery.length > 0 && (
        <div 
          className="fixed inset-0 w-full h-full z-[100000] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4 md:p-8"
          onClick={() => setIsGalleryOpen(false)}
        >
          {/* Ambient color light glow */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-[80px] opacity-70 z-0 pointer-events-none"></div>

          {/* Close Lightbox */}
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 z-50 focus:outline-none"
            title="Close Gallery"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Centered Image display frame */}
          <div 
            className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 bg-black/50 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img 
              src={gallery[activePhotoIdx].image} 
              alt={gallery[activePhotoIdx].caption} 
              className="max-w-full max-h-full object-contain select-none"
            />

            {/* Left Prev Arrow */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                const newIdx = (activePhotoIdx - 1 + gallery.length) % gallery.length;
                setActivePhotoIdx(newIdx); 
                logAnalyticsEvent({ type: 'gallery_click', label: gallery[newIdx].caption });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:border-transparent transition-all focus:outline-none shadow-md"
              title="Previous Photo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Next Arrow */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                const newIdx = (activePhotoIdx + 1) % gallery.length;
                setActivePhotoIdx(newIdx); 
                logAnalyticsEvent({ type: 'gallery_click', label: gallery[newIdx].caption });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:border-transparent transition-all focus:outline-none shadow-md"
              title="Next Photo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Slideshow Caption card */}
          <div 
            className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.2rem] p-6 mt-6 max-w-4xl w-full text-white text-center z-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] font-mono text-secondary font-bold uppercase tracking-widest">
              Photo {activePhotoIdx + 1} of {gallery.length}
            </span>
            <p className="text-xs md:text-sm font-bold mt-2 text-offwhite leading-relaxed">
              {gallery[activePhotoIdx].caption}
            </p>
          </div>
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="animate-bounce">
          <svg 
            className="w-6 h-6 text-white/40 drop-shadow-sm" 
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