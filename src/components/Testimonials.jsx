import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaDownload, FaFilePdf, FaImage } from 'react-icons/fa';
import { getTestimonials, logAnalyticsEvent } from '../services/portfolioService';

const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    name: 'Dr. K. Srinivas Rao, IAS',
    organisation: 'Nellore Municipal Corporation',
    quote: 'JSR Annamayya\'s strategic IEC interventions and deep understanding of waste management systems catalyzed a massive public shift in Nellore. His ability to mobilize thousands of citizen volunteers is truly commendable.'
  },
  {
    id: 'f2',
    name: 'M. Alivelu Mangamma',
    organisation: 'Council for Green Revolution',
    quote: 'JSR\'s leadership in school and college environmental education has empowered a new generation of climate advocates. The Young Earth Leaders Program has reached over 50,000 students under his guidance.'
  },
  {
    id: 'f3',
    name: 'Rajendra Prasad',
    organisation: 'Rajamahendravaram Municipal Corp.',
    quote: 'We witnessed a 15% increase in segregation efficiency within months of JSR launching the BCC campaign. He combines strategic public systems thinking with active grassroots implementation.'
  }
];

const Testimonials = () => {
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTestimonials();
        setList(data.length > 0 ? data.sort((a,b) => (a.order || 0) - (b.order || 0)) : FALLBACK_TESTIMONIALS);
      } catch (err) {
        console.warn("Failed to load testimonials, using fallbacks", err);
        setList(FALLBACK_TESTIMONIALS);
      }
    };
    fetchData();
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [list]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % list.length);
  };

  const handleDownload = (type) => {
    logAnalyticsEvent({
      type: 'press_kit_download',
      label: type
    });
  };

  if (list.length === 0) return null;

  return (
    <section className="bg-[#1a1815] py-24 px-6 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/5">
      
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-16 relative z-10">
        
        {/* Title */}
        <div className="text-center">
          <div className="inline-block border border-secondary/35 rounded-full px-5 py-1.5 text-xs text-secondary font-bold mb-4 bg-[#2d2824]/50 uppercase tracking-wider">
            Endorsements
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            What Leaders Say
          </h2>
        </div>

        {/* Testimonials Slider */}
        <div className="w-full relative min-h-[300px] flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-[#25221F] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative w-full flex flex-col justify-between items-center text-center"
            >
              <FaQuoteLeft className="text-secondary/20 w-16 h-16 absolute -top-8 left-12" />
              
              <p className="text-white/80 text-sm md:text-base md:leading-loose font-medium italic mt-4 max-w-2xl">
                "{list[currentIndex]?.quote || list[currentIndex]?.text}"
              </p>

              <div className="mt-8">
                <h4 className="text-white font-black text-base">{list[currentIndex]?.name}</h4>
                <p className="text-secondary text-[10px] font-bold uppercase tracking-wider mt-1">{list[currentIndex]?.organisation || list[currentIndex]?.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Buttons */}
          {list.length > 1 && (
            <div className="absolute -bottom-10 flex gap-4 z-20">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-secondary text-white hover:text-secondary flex items-center justify-center transition-all bg-[#1a1815] focus:outline-none"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-secondary text-white hover:text-secondary flex items-center justify-center transition-all bg-[#1a1815] focus:outline-none"
              >
                <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Press & Media Kit */}
        <div className="w-full bg-gradient-to-br from-[#25221F] to-[#1e1b18] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 mt-6">
          <div className="text-left max-w-lg">
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight">Press & Media Kit</h3>
            <p className="text-white/50 text-xs mt-2 leading-relaxed font-medium">
              Access JSR Annamayya's official press packet containing high-resolution headshots, speaker profiles, and verified curriculum vitae.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {/* Download CV */}
            <a
              href="/JSR_Annamayya_CV.pdf"
              onClick={() => handleDownload('CV')}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full border border-white/10 hover:border-secondary bg-transparent hover:bg-secondary/5 text-white hover:text-secondary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FaFilePdf className="w-3.5 h-3.5" /> Download CV
            </a>
            
            {/* Download Bio & Headshots (Mock Drive Link) */}
            <a
              href="https://drive.google.com/drive/folders/mock_jsr_press_kit_folder_id"
              onClick={() => handleDownload('Media Pack')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <FaImage className="w-3.5 h-3.5" /> Media Pack
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;