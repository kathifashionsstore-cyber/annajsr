import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to make navbar solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const desktopLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Impact', href: '#impact' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Gallery', href: '#gallery' }
  ];

  const allLinks = [
    { label: 'Home', href: '#' },
    { label: 'About Me', href: '#about' },
    { label: 'My Journey', href: '#experience' },
    { label: 'Impact & Recognition', href: '#impact' },
    { label: 'Governance in Action (Case Studies)', href: '#case-studies' },
    { label: 'Services Offered', href: '#services' },
    { label: 'Collaborating Departments', href: '#collaborations' },
    { label: 'Career Highlights', href: '#highlights' },
    { label: 'Visual Journey (Gallery)', href: '#gallery' },
    { label: 'Let\'s Collaborate', href: '#contact' }
  ];

  const handleLinkClick = (e, href) => {
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-charcoal/90 backdrop-blur-md border-b border-white/10 py-4 shadow-lg' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo/Name */}
          <div className="flex items-center">
            <a href="#" className="text-white text-2xl font-black tracking-tight hover:opacity-95 transition-opacity">
              JSR Annamayya<span className="text-secondary">.</span>
            </a>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {desktopLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                className="text-white/80 hover:text-white font-bold text-xs lg:text-sm relative group transition-colors duration-300"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <a 
              href="#contact" 
              className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 hover:shadow-[0_0_15px_rgba(232,163,61,0.3)] transition-all duration-300 backdrop-blur-md"
            >
              Let's Connect
            </a>
          </div>

          {/* Mobile Hamburger Icon Only (No link rows in header bar) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(true)}
              className="text-white focus:outline-none p-2 hover:text-secondary transition-colors"
              aria-label="Open navigation menu"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Overlay Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-charcoal z-[60] flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Header section in full screen menu */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto pt-2">
              <span className="text-white text-2xl font-black tracking-tight">
                Menu<span className="text-secondary">.</span>
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white p-2 hover:text-secondary transition-colors"
                aria-label="Close navigation menu"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-12">
              <div className="flex flex-col space-y-4">
                {allLinks.map((link, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-white/80 hover:text-white font-black text-xl sm:text-2xl tracking-tight transition-colors flex items-center gap-3 border-b border-white/5 pb-2"
                  >
                    <span className="text-xs text-secondary/60 font-mono">0{idx + 1}</span>
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer / Connect Info inside menu */}
            <div className="w-full max-w-7xl mx-auto border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-white/40">
              <span>JSR Annamayya &copy; 2026</span>
              <div className="flex gap-4">
                <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">About</a>
                <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
