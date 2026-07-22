import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import MobileBottomNavigation from './MobileBottomNavigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position to adjust navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Strictly 5 navigation items
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
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DDD7CE] shadow-xs h-[62px] lg:h-[88px]'
            : 'bg-transparent h-[62px] lg:h-[88px]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 md:px-12 h-full flex justify-between items-center">
          
          {/* LEFT: Logo / Brand Name */}
          <Link
            to="/"
            className="text-[#181818] hover:text-[#A84F43] font-serif text-lg sm:text-2xl font-bold tracking-tight transition-colors duration-300 focus:outline-none"
          >
            JSR Annamayya
          </Link>

          {/* RIGHT: Desktop & Tablet Navigation Links (>= 768px / md) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative font-sans text-xs uppercase tracking-[0.14em] transition-colors duration-300 py-2 focus:outline-none ${
                    isActive ? 'text-[#181818] font-bold' : 'text-[#5F5F5F] hover:text-[#181818]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A84F43]"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

        </div>
      </nav>

      {/* Fixed 5-Button Mobile Bottom Navigation (< 768px) */}
      <MobileBottomNavigation />
    </>
  );
};

export default Navbar;
