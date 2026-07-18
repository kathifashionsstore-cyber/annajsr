import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryImages, logAnalyticsEvent } from '../services/portfolioService';
import ExpandableSection from './ExpandableSection';

const BORDER_COLORS = [
  'border-[#C1440E]/30 shadow-[#C1440E]/5 hover:border-[#C1440E] hover:shadow-[#C1440E]/20',
  'border-[#0ea5e9]/30 shadow-[#0ea5e9]/5 hover:border-[#0ea5e9] hover:shadow-[#0ea5e9]/20',
  'border-[#e11d48]/30 shadow-[#e11d48]/5 hover:border-[#e11d48] hover:shadow-[#e11d48]/20',
  'border-[#ca8a04]/30 shadow-[#ca8a04]/5 hover:border-[#ca8a04] hover:shadow-[#ca8a04]/20'
];

const VisualJourneyCard = ({ images, initialIndex, staggerDelay, colorIndex, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex % images.length);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    let timer;
    const startTimer = () => {
      timer = setInterval(() => {
        if (!isHovered) {
          setCurrentIndex(prev => (prev + 1) % images.length);
        }
      }, 2000);
    };

    const delayTimeout = setTimeout(startTimer, staggerDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (timer) clearInterval(timer);
    };
  }, [images.length, staggerDelay, isHovered]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const borderStyle = BORDER_COLORS[colorIndex % BORDER_COLORS.length];

  return (
    <div
      onClick={() => onCardClick(currentIndex)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`relative aspect-[16/9] w-full overflow-hidden rounded-[2.2rem] border-4 ${borderStyle} shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={currentImage.image}
          alt={currentImage.caption || "JSR Annamayya Visual Journey"}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Caption overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <p className="text-white text-xs md:text-sm font-black tracking-tight leading-snug">
          {currentImage.caption || "Visual Journey"}
        </p>
      </div>
    </div>
  );
};

const VisualJourney = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data || []);
      } catch (err) {
        console.warn("Failed to load gallery images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleCardClick = (index) => {
    setActivePhotoIdx(index);
    if (images[index]) {
      logAnalyticsEvent({
        type: 'gallery_view',
        label: images[index].caption
      });
    }
  };

  const renderCard = (item, index) => {
    return (
      <VisualJourneyCard
        key={item.id || index}
        images={images}
        initialIndex={index}
        staggerDelay={(index % 3) * 500}
        colorIndex={index}
        onCardClick={handleCardClick}
      />
    );
  };

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden font-sans border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-primary text-xs font-black tracking-widest uppercase bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mt-4 tracking-tight">
            Moments in the Field
          </h2>
          <p className="text-neutraltext text-sm md:text-base mt-4 font-medium leading-relaxed">
            A dynamic record of community engagement, award ceremonies, policy summits, and grassroots sustainability campaigns.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/9] w-full bg-gray-100 rounded-[2.2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up">
            <ExpandableSection
              items={images}
              limit={3}
              buttonLabelSingle="Photos"
              renderItem={renderCard}
              gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        )}
      </div>

      {/* --- DYNAMIC FULL-SCREEN PHOTO GALLERY LIGHTBOX --- */}
      <AnimatePresence>
        {activePhotoIdx !== null && images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full z-[100000] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4 md:p-8"
            onClick={() => setActivePhotoIdx(null)}
          >
            {/* Ambient color light glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-[80px] opacity-70 z-0 pointer-events-none"></div>

            {/* Close Lightbox */}
            <button 
              onClick={() => setActivePhotoIdx(null)}
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
                src={images[activePhotoIdx].image} 
                alt={images[activePhotoIdx].caption} 
                className="max-w-full max-h-full object-contain select-none"
              />

              {/* Left Prev Arrow */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const newIdx = (activePhotoIdx - 1 + images.length) % images.length;
                  setActivePhotoIdx(newIdx); 
                  logAnalyticsEvent({ type: 'gallery_view', label: images[newIdx].caption });
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
                  const newIdx = (activePhotoIdx + 1) % images.length;
                  setActivePhotoIdx(newIdx); 
                  logAnalyticsEvent({ type: 'gallery_view', label: images[newIdx].caption });
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
                Photo {activePhotoIdx + 1} of {images.length}
              </span>
              <p className="text-xs md:text-sm font-bold mt-2 text-offwhite leading-relaxed">
                {images[activePhotoIdx].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VisualJourney;
