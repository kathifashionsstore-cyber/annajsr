import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { getContactSettings, logAnalyticsEvent } from '../services/portfolioService';

const FloatingActions = () => {
  const [email, setEmail] = useState('Sai.annamayya@gmail.com');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const settings = await getContactSettings();
        if (settings && settings.email) {
          setEmail(settings.email);
        }
      } catch (e) {
        console.warn("Failed to fetch email settings for FAB", e);
      }
    };
    fetchEmail();
  }, []);

  const handleLinkClick = (type) => {
    logAnalyticsEvent({
      type: 'fab_click',
      label: type
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6, type: 'spring', stiffness: 100 }}
      className="fixed right-6 z-40 flex flex-col gap-3.5 bottom-28 md:bottom-8 select-none"
    >
      {/* Email Button */}
      <a
        href={`mailto:${email}`}
        onClick={() => handleLinkClick('email')}
        className="group relative w-12 h-12 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-[0_4px_15px_rgba(193,68,14,0.4)] transition-all duration-300 hover:-translate-y-1 focus:outline-none"
        title={`Email JSR Annamayya (${email})`}
      >
        <FaEnvelope className="w-5 h-5" />
        
        {/* Tooltip */}
        <span className="absolute right-14 bg-[#25221F] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
          Email Me
        </span>
      </a>

      {/* LinkedIn Button */}
      <a
        href="https://www.linkedin.com/in/jsr-annamayya-18a59665/?isSelfProfile=false"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleLinkClick('linkedin')}
        className="group relative w-12 h-12 rounded-full bg-[#0077B5] hover:bg-[#0077B5]/95 text-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,119,181,0.4)] transition-all duration-300 hover:-translate-y-1 focus:outline-none"
        title="Visit LinkedIn Profile"
      >
        <FaLinkedin className="w-5 h-5" />
        
        {/* Tooltip */}
        <span className="absolute right-14 bg-[#25221F] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
          LinkedIn
        </span>
      </a>
    </motion.div>
  );
};

export default FloatingActions;