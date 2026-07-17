import React, { useEffect, useState } from 'react';
import stackImage from '../assets/about/image.png';
import { getAboutContent } from '../services/portfolioService';

const About = () => {
  const [aboutData, setAboutData] = useState({ bio1: '', bio2: '', strengths: [] });

  useEffect(() => {
    const fetchAbout = async () => {
      const data = await getAboutContent();
      setAboutData(data);
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="bg-primary pt-20 pb-40 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        
        {/* Left Side: ID Badge */}
        <div className="flex flex-col items-center w-full md:w-[350px] shrink-0 mt-12 md:mt-0">
          
          <div data-aos="drop-bounce" className="relative flex justify-center w-full">
            {/* Lanyard string */}
            <div className="absolute -top-32 left-1/2 w-3 h-40 bg-charcoal transform -translate-x-1/2 shadow-inner z-0"></div>
            {/* Lanyard clip */}
            <div className="absolute -top-6 left-1/2 w-6 h-12 bg-gray-300 rounded border border-gray-400 transform -translate-x-1/2 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"></div>
            
            {/* Badge Card */}
            <div className="bg-charcoal w-full max-w-[280px] rounded-2xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Cutout Hole */}
              <div className="absolute -top-3 left-1/2 w-16 h-6 bg-charcoal rounded-t-xl transform -translate-x-1/2 flex justify-center items-center">
                <div className="w-8 h-2 bg-black/30 rounded-full shadow-inner"></div>
              </div>
              {/* Image Container */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-800 border-2 border-transparent">
                <img 
                  src={aboutData.image || stackImage} 
                  alt="JSR Annamayya Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Info Content */}
        <div data-aos="fade-left" data-aos-delay="200" className="flex-1 text-white mt-8 md:mt-0 relative z-20">
          
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4">About Me</h2>
          <p className="text-lg font-bold mb-6 leading-relaxed max-w-3xl text-white/95">
            {aboutData.bio1 || "Graduated as a Gold Medallist in Electrical & Electronics Engineering (EEE) from Tirumala Engineering College, Narasaraopet, presenting over 21 technical papers at prestigious institutions like BITS Pilani, JNTUH, and Anna University."}
          </p>
          <p className="text-base font-semibold mb-6 leading-relaxed max-w-3xl text-white/90">
            {aboutData.bio2 || "Started professional career in the software corporate world at Accenture and Wipro (2016–2019) as a Quality Team Lead and Special Project Area Lead, managing large engineering delivery operations before transitioning full-time into public systems governance."}
          </p>
          <p className="text-sm font-medium mb-10 leading-relaxed max-w-3xl text-white/85">
            {aboutData.bio3 || "Since transitioning, has driven extensive solid waste management (SWM) campaigns and Behaviour Change Communication (BCC/IEC) programs across municipal administrations and departments in Andhra Pradesh and Telangana. Guided state-level environmental initiatives like the Young Earth Leaders Program, training 50,000+ students across 500+ government schools and 100+ colleges, and dedicating 2,080+ hours of community outreach."}
          </p>

          <h3 className="text-2xl font-black text-charcoal mb-6">Core Strengths</h3>
          {/* Strengths Badges Row */}
          <div className="flex flex-wrap gap-2.5 max-w-3xl">
            {(aboutData.strengths || []).map((strength, idx) => (
              <span 
                key={idx}
                data-aos="zoom-in"
                data-aos-delay={100 + (idx * 50)}
                className="px-4 py-2 bg-charcoal text-white font-bold text-xs rounded-full border border-white/10 hover:bg-secondary hover:text-charcoal transition-all duration-300 shadow-md cursor-default"
              >
                {strength}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Torn paper divider at bottom (blends into off-white next section) */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-30 transform translate-y-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-offwhite">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.62,189.5,99.8,242.79,81.82,282.88,63.6,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-10 right-10 md:right-20 text-charcoal opacity-15 animate-pulse">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z"/></svg>
      </div>
      <div className="absolute bottom-32 left-4 md:left-20 text-charcoal opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z"/></svg>
      </div>
    </section>
  );
};

export default About;
