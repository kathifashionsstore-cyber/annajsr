import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaVideo, FaEnvelope, FaImage } from 'react-icons/fa';

const MobileBottomNav = ({ onGalleryClick }) => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'campaigns', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle of the viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <FaHome className="w-5 h-5" />, action: () => scrollToSection('home') },
    { id: 'about', label: 'About', icon: <FaUser className="w-5 h-5" />, action: () => scrollToSection('about') },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="w-6 h-6" />, action: () => scrollToSection('contact'), isCenter: true },
    { id: 'campaigns', label: 'Videos', icon: <FaVideo className="w-5 h-5" />, action: () => scrollToSection('campaigns') },
    { id: 'gallery', label: 'Gallery', icon: <FaImage className="w-5 h-5" />, action: (e) => {
        e.preventDefault();
        if (onGalleryClick) onGalleryClick();
      }
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#25221F]/90 backdrop-blur-lg border-t border-white/5 py-2.5 px-6 flex justify-between items-center z-[9999] md:hidden pb-[calc(env(safe-area-inset-bottom,16px)+10px)] shadow-2xl">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="relative -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-white shadow-[0_8px_20px_rgba(193,68,14,0.45)] border-4 border-[#25221F] transform active:scale-95 transition-all duration-200 focus:outline-none"
              aria-label={item.label}
            >
              {item.icon}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none transition-colors"
          >
            <div className={`transition-all duration-300 ${isActive ? 'text-secondary scale-110' : 'text-white/40'}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-bold mt-1 tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-secondary' : 'text-white/40'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-secondary rounded-full mt-0.5"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;