import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GreenEarthLoader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0); // 0: init, 1: circle draw, 2: earth scale, 3: leaf/dots, 4: text, 5: exit
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
    }

    // Check sessionStorage
    const hasSeen = sessionStorage.getItem('jsr_earth_loader_seen');
    if (hasSeen) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Loader timing sequence
    const t1 = setTimeout(() => setStage(1), 150);  // Thin circle draw
    const t2 = setTimeout(() => setStage(2), 500);  // Green earth circle scales
    const t3 = setTimeout(() => setStage(3), 850);  // Leaf grows & dots appear
    const t4 = setTimeout(() => setStage(4), 1250); // Text fades in
    const t5 = setTimeout(() => {
      setStage(5);
      sessionStorage.setItem('jsr_earth_loader_seen', 'true');
    }, 1800);
    const t6 = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {stage < 5 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="green-earth-loader fixed inset-0 flex flex-col items-center justify-center bg-[#F4EFE7] px-6 select-none"
        >
          {/* Editorial SVG Graphic */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            
            {/* Dotted Circular Background Pattern (Stage 3+) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: stage >= 3 ? 0.75 : 0, scale: stage >= 3 ? 1 : 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-[radial-gradient(#A84F43_2px,transparent_2px)] [background-size:14px_14px] pointer-events-none"
            />

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
              
              {/* Step 1: Thin Orbit Line */}
              <motion.circle
                cx="100"
                cy="100"
                r="75"
                fill="none"
                stroke="#A84F43"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: stage >= 1 ? 1 : 0, opacity: stage >= 1 ? 0.7 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />

              {/* Step 2: Flat Green Earth Circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="50"
                fill="#2D5A27"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 1 : 0 }}
                transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
              />

              {/* Cream Environmental Land Contour Lines */}
              <motion.path
                d="M 68 88 Q 80 72, 100 78 Q 118 82, 128 72 Q 138 88, 126 112 Q 102 128, 78 108 Z"
                fill="none"
                stroke="#F4EFE7"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: stage >= 2 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />

              {/* Step 3: Leaf Growing from top */}
              <motion.g
                initial={{ scale: 0, y: 15 }}
                animate={{ scale: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 15 }}
                transition={{ duration: 0.45, ease: 'backOut' }}
              >
                {/* Stem */}
                <path d="M 100 50 L 100 30" fill="none" stroke="#2D5A27" strokeWidth="2.5" strokeLinecap="round" />
                {/* Left Leaf */}
                <path d="M 100 35 Q 88 26, 92 38 Z" fill="#4A8B3B" stroke="#2D5A27" strokeWidth="1" />
                {/* Right Leaf */}
                <path d="M 100 30 Q 112 22, 108 34 Z" fill="#A98760" stroke="#2D5A27" strokeWidth="1" />
              </motion.g>

              {/* Terracotta Accent Dot on Orbit */}
              <motion.circle
                cx="165"
                cy="65"
                r="5"
                fill="#A84F43"
                initial={{ scale: 0 }}
                animate={{ scale: stage >= 3 ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />

            </svg>

          </div>

          {/* Step 4: Text Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: stage >= 4 ? 1 : 0, y: stage >= 4 ? 0 : 10 }}
            transition={{ duration: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="font-serif text-2xl sm:text-3xl text-[#181818] tracking-tight font-medium">
              Growing Ideas. Creating Impact.
            </p>
            <p className="font-sans text-[11px] text-[#A84F43] font-bold uppercase tracking-[0.2em] mt-2">
              JSR Annamayya Portfolio
            </p>
          </motion.div>

          {/* Editorial Progress Bar */}
          <div className="w-44 h-[2px] bg-[#DDD7CE] rounded-full overflow-hidden mt-8">
            <motion.div
              className="h-full bg-[#A84F43]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GreenEarthLoader;
