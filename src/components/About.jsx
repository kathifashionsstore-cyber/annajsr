import React, { useEffect, useState } from 'react';
import stackImage from '../assets/about/image.png';
import { getAboutContent, getInnovations } from '../services/portfolioService';

const About = () => {
  const [aboutData, setAboutData] = useState({ intro: '', eduBio: '', serviceBio: '', corporateBio: '', strengths: [] });
  const [innovations, setInnovations] = useState([]);

  useEffect(() => {
    const fetchAbout = async () => {
      const data = await getAboutContent();
      setAboutData(data);
    };
    const fetchInnovations = async () => {
      const data = await getInnovations();
      setInnovations(data || []);
    };
    fetchAbout();
    fetchInnovations();
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
          
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-6">About Me</h2>
          
          {/* Intro / Tagline */}
          <p className="text-base md:text-lg font-bold mb-8 leading-relaxed max-w-3xl text-charcoal bg-white/10 p-5 rounded-2xl border border-white/5 shadow-sm">
            {aboutData.intro || "A Trailblazer in Environmental Sustainability and Leadership with 9 years of expertise in IEC strategies, solid waste management, corporate operations, and community development. Recognised for his innovative approaches, he has made a lasting impact in public service and corporate leadership."}
          </p>

          <div className="space-y-6">
            {/* Subsection 1 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-charcoal/80 mb-2">Educational & Early Career Excellence</h4>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed max-w-3xl text-white/90">
                {aboutData.eduBio || "JSR Annamayya holds a Gold Medal from Tirumala Engineering College with a B.Tech in Electrical & Electronics Engineering, an early testament to his dedication and pursuit of excellence. His technical acumen and innovative mindset have laid the foundation for his future contributions to society. He has taken the stage at numerous national forums in Delhi, representing India many times and sharing his insights on critical issues on SWM at the India Circular Economy Forum 2024."}
              </p>
            </div>

            {/* Subsection 2 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-charcoal/80 mb-2">Public Service & Environmental Advocacy</h4>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed max-w-3xl text-white/90">
                {aboutData.serviceBio || "As an IEC Specialist in Andhra Pradesh municipal administrations, he influenced sustainable behavioural change among 2.2 million people, played a key role in the National Swachh Bharat rankings of the Government of India, and earned national recognition for best practices in environmental sustainability."}
              </p>
            </div>

            {/* Subsection 3 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-charcoal/80 mb-2">Corporate & Strategic Leadership</h4>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed max-w-3xl text-white/90">
                {aboutData.corporateBio || "At Wipro and Accenture, he led an 80+ member team, showcasing excellence in technical solutions, project management, and leadership for Silicon Valley clients including Google and Uber."}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-black text-charcoal mb-6 mt-10">Core Strengths</h3>
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

      {/* Innovations & Technological Solutions */}
      {innovations.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20 border-t border-white/10 pt-16 relative z-20">
          <h3 className="text-3xl font-black text-charcoal mb-8 text-center md:text-left">Innovations & Tech Solutions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((item, idx) => (
              <div 
                key={item.id || idx} 
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="bg-charcoal/60 backdrop-blur-sm p-6 rounded-3xl border border-white/10 flex flex-col gap-3 hover:border-secondary/40 transition-all duration-300 group shadow-lg"
              >
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-lg group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <h4 className="text-base font-black text-white group-hover:text-secondary transition-colors">{item.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed font-semibold">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
