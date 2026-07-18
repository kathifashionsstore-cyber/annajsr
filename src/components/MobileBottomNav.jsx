import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaTrophy, FaEnvelope, FaBookOpen } from 'react-icons/fa';

const MobileBottomNav = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'impact', 'case-studies', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // Trigger when section is in the middle of the viewport
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
    { id: 'home', label: 'Home', icon: <FaHome className="w-4 h-4" />, action: () => scrollToSection('home') },
    { id: 'about', label: 'About', icon: <FaUser className="w-4 h-4" />, action: () => scrollToSection('about') },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope className="w-5 h-5" />, action: () => scrollToSection('contact'), isCenter: true },
    { id: 'impact', label: 'Impact', icon: <FaTrophy className="w-4 h-4" />, action: () => scrollToSection('impact') },
    { id: 'case-studies', label: 'Governance', icon: <FaBookOpen className="w-4 h-4" />, action: () => scrollToSection('case-studies') }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#25221F]/90 backdrop-blur-lg border-t border-white/5 py-2.5 px-3 flex justify-between items-center z-[9999] md:hidden pb-[calc(env(safe-area-inset-bottom,16px)+8px)] shadow-2xl">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="relative -top-4 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-primary/95 text-white shadow-[0_8px_20px_rgba(193,68,14,0.45)] border-4 border-[#25221F] transform active:scale-95 transition-all duration-200 focus:outline-none shrink-0"
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
            <span className={`text-[8px] font-black mt-1 tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-secondary' : 'text-white/40'} text-center block max-w-full truncate`}>
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