import React, { useState, useEffect } from 'react';
import { getContactSettings } from '../services/portfolioService';

const Footer = () => {
  const [settings, setSettings] = useState({
    email: 'Sai.annamayya@gmail.com',
    phone: '7702012010',
    address: 'Manikonda, Telangana',
    experienceYears: '9+ years of experience',
    specialties: [
      'Public Systems Specialist',
      'IEC & BCC Strategy Development',
      'Environmental Communication'
    ]
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getContactSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#151311] text-[#d4d4d4] py-16 px-6 md:px-12 w-full font-mono text-[10px] md:text-xs tracking-widest flex flex-col justify-between min-h-[50vh] border-t border-[#2d2824]">
      
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full font-medium">
        <div className="flex flex-col gap-1.5 text-white/80">
          {settings.specialties && settings.specialties.map((spec, i) => (
            <p key={i}>{spec}</p>
          ))}
        </div>
        
        <div className="flex flex-col gap-1.5 md:items-center text-white/80">
          <p>{settings.experienceYears}</p>
          <a href="#experience" className="underline hover:text-secondary transition-colors mt-1 underline-offset-4 decoration-1">View Journey</a>
        </div>
        
        <div className="flex flex-col gap-1.5 md:items-end text-white/80">
          <p>Available for Consultations</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Middle Huge Text */}
      <div className="w-full flex justify-center items-center py-16 md:py-20 overflow-hidden">
        <h2 className="text-[18vw] md:text-[16vw] leading-none font-sans font-bold tracking-tighter lowercase select-none text-[#F7F4F0] w-full text-center">
          annamayya
        </h2>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full items-end font-medium">
        <div className="flex flex-col gap-6">
          <a href="#contact" className="underline hover:text-secondary transition-colors underline-offset-4 decoration-1 font-bold text-xs">Let's Connect</a>
          <p className="text-white/40 font-mono text-[9px] md:text-[10px]">
            &copy; {new Date().getFullYear()} JSR Annamayya | Built with React
          </p>
        </div>
        
        <div className="flex flex-col gap-2 md:items-center">
          <a href={`mailto:${settings.email}`} className="underline hover:text-secondary transition-colors underline-offset-4 decoration-1 text-[11px] md:text-sm">{settings.email}</a>
          <a href={`tel:${settings.phone}`} className="hover:text-secondary transition-colors text-[11px] md:text-sm">{settings.phone}</a>
        </div>
        
        <div className="flex flex-col gap-1.5 md:items-end text-white/50">
          <p>{settings.address}</p>
          <a href="#" className="underline hover:text-secondary transition-colors underline-offset-4 decoration-1 text-[9px]">Privacy & Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
