import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { resumeUrl } = portfolioData.profile;

  // Track scroll position to adjust navbar styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
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

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Force scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Professional Profile', path: '/professional-profile' },
    { label: 'Experience', path: '/experience' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-edi-white/95 backdrop-blur-md border-b border-edi-border py-4 shadow-sm'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            className="text-edi-heading hover:text-edi-accent font-serif-edi text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-edi-accent"
          >
            JSR Annamayya
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-300 py-1.5 focus:outline-none focus:ring-2 focus:ring-edi-accent ${
                    isActive ? 'text-edi-black font-semibold' : 'text-edi-body hover:text-edi-black'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-edi-accent rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Call To Action (Resume Download) */}
          <div className="hidden md:block">
            <a
              href={resumeUrl}
              download="JSR-Annamayya-CV-2026.pdf"
              className="px-5 py-2.5 bg-edi-black text-edi-white font-sans text-[11px] uppercase tracking-[0.18em] border border-edi-black hover:bg-transparent hover:text-edi-black transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-edi-accent"
            >
              Download CV
            </a>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-edi-black focus:outline-none p-2 focus:ring-2 focus:ring-edi-accent"
              aria-label="Open navigation menu"
            >
              <FaBars className="w-5 h-5" />
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-edi-cream z-[9999] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
          >
            {/* Header section in full screen menu */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto pt-2">
              <span className="font-serif-edi text-xl font-bold tracking-tight text-edi-heading">
                Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-edi-black p-2 hover:text-edi-accent transition-colors focus:outline-none focus:ring-2 focus:ring-edi-accent"
                aria-label="Close navigation menu"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-12">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    key={link.path}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `font-serif-edi text-3xl sm:text-4xl tracking-tight transition-colors flex items-baseline gap-4 border-b border-edi-border/50 pb-3 focus:outline-none focus:ring-2 focus:ring-edi-accent ${
                          isActive ? 'text-edi-accent font-semibold' : 'text-edi-heading hover:text-edi-accent'
                        }`
                      }
                    >
                      <span className="text-[10px] font-sans font-mono tracking-widest text-edi-muted">
                        0{idx + 1}
                      </span>
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile CTA (Resume Download) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 + 0.1 }}
                className="mt-8"
              >
                <a
                  href={resumeUrl}
                  download="JSR-Annamayya-CV-2026.pdf"
                  className="inline-block text-center w-full py-4 bg-edi-black text-edi-white font-sans text-xs uppercase tracking-[0.18em] border border-edi-black hover:bg-transparent hover:text-edi-black transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-edi-accent"
                >
                  Download CV
                </a>
              </motion.div>
            </div>

            {/* Footer / Connect Info inside menu */}
            <div className="w-full max-w-7xl mx-auto border-t border-edi-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-sans uppercase tracking-widest text-edi-muted">
              <span>JSR Annamayya &copy; {new Date().getFullYear()}</span>
              <div className="flex gap-6">
                <a
                  href={`mailto:${portfolioData.profile.email}`}
                  className="hover:text-edi-heading transition-colors"
                >
                  Email
                </a>
                <a
                  href={portfolioData.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-edi-heading transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
