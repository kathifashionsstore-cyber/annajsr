import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

const Footer = () => {
  const { name, role, email, phone, address, linkedinUrl, whatsappUrl } = portfolioData.profile;

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-edi-footer text-edi-white/80 pt-20 pb-12 px-6 md:px-12 w-full font-sans border-t border-edi-border/10 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-16 border-b border-edi-border/10">
        
        {/* Column 1: Brand & Role */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-white font-serif-edi text-2xl font-bold tracking-tight">
            {name}
          </Link>
          <p className="text-xs text-edi-muted leading-relaxed max-w-[240px]">
            National Award-Winning {role} driving public system reforms and climate action.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em]">Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link to="/" className="hover:text-edi-accent transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/professional-profile" className="hover:text-edi-accent transition-colors">Professional Profile</Link>
            </li>
            <li>
              <Link to="/experience" className="hover:text-edi-accent transition-colors">Experience</Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-edi-accent transition-colors">Projects</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-edi-accent transition-colors">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em]">Contact Details</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <a href={`mailto:${email}`} className="hover:text-edi-accent transition-colors block truncate">{email}</a>
            </li>
            <li>
              <a href={`tel:${phone}`} className="hover:text-edi-accent transition-colors block">{phone}</a>
            </li>
            <li className="text-edi-muted">
              {address}
            </li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em]">Connect</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-edi-accent transition-colors">LinkedIn</a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-edi-accent transition-colors">WhatsApp Chat</a>
            </li>
            <li className="text-edi-muted">
              Available for Consultations
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Copyright */}
        <div className="text-[10px] sm:text-xs text-edi-muted font-mono tracking-widest text-center sm:text-left">
          &copy; {new Date().getFullYear()} {name}. ALL RIGHTS RESERVED.
        </div>

        {/* Back to top control */}
        <button
          onClick={handleBackToTop}
          className="flex items-center gap-2 group font-sans text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-edi-accent px-3 py-1.5"
          aria-label="Back to top"
        >
          Back To Top
          <span className="w-8 h-8 rounded-full border border-edi-border/20 flex items-center justify-center group-hover:border-white transition-colors">
            <FaArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </button>

      </div>
    </footer>
  );
};

export default Footer;
