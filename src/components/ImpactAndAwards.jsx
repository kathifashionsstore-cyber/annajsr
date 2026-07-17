import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getStats, getAwards, getTalks } from '../services/portfolioService';
import ExpandableSection from './ExpandableSection';

const renderAwardItem = (award, idx) => (
  <div 
    key={award.id || idx}
    className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-secondary/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col overflow-hidden group h-full"
  >
    {award.image && (
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-55 border-b border-gray-100">
        <img 
          src={award.image} 
          alt={award.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>
    )}
    <div className="p-8 flex flex-col justify-between flex-1">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold font-mono px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
            {award.year}
          </span>
          <span className="text-xs font-bold text-neutraltext">
            {award.issuer}
          </span>
        </div>
        <h4 className="text-lg md:text-xl font-black text-charcoal mb-3 tracking-tight group-hover:text-primary transition-colors">
          {award.title}
        </h4>
        <p className="text-xs md:text-sm text-neutraltext leading-relaxed font-medium">
          {award.desc}
        </p>
      </div>
      
      {/* Gold Accent Divider */}
      <div className="w-12 h-1 bg-secondary mt-6 rounded-full"></div>
    </div>
  </div>
);

const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState('0');
  const elementRef = useRef(null);

  useEffect(() => {
    // Parse numeric value (e.g. "50,000+" -> 50000)
    const cleanValue = String(value);
    const numericValue = parseInt(cleanValue.replace(/[^0-9]/g, ''), 10);
    const suffix = cleanValue.replace(/[0-9,]/g, '');
    const hasCommas = cleanValue.includes(',');

    if (isNaN(numericValue)) {
      setCount(cleanValue);
      return;
    }

    let observer;
    let started = false;

    const startCounting = () => {
      let start = 0;
      const end = numericValue;
      const duration = 2000; // 2 seconds
      let startTime = null;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * (end - start) + start);

        const formatted = hasCommas 
          ? currentCount.toLocaleString('en-IN')
          : currentCount.toString();

        setCount(`${formatted}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !started) {
        started = true;
        startCounting();
      }
    };

    observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [value]);

  return (
    <div 
      ref={elementRef}
      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(193,68,14,0.08)] transition-all duration-500 hover:-translate-y-1 text-center"
    >
      <span className="block text-3xl md:text-4xl font-black text-primary mb-2 tracking-tight">
        {count}
      </span>
      <span className="block text-xs md:text-sm font-bold text-charcoal leading-snug">
        {label}
      </span>
    </div>
  );
};

const ImpactAndAwards = () => {
  const [stats, setStats] = useState([]);
  const [awards, setAwards] = useState([]);
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    
    const fetchImpactData = async () => {
      try {
        const s = await getStats();
        const a = await getAwards();
        const t = await getTalks();
        
        setStats(s);
        setAwards(a);
        setTalks(t);
      } catch (err) {
        console.error("Error loading impact data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImpactData();
  }, []);

  return (
    <section id="impact" className="bg-offwhite py-24 px-6 md:px-12 w-full relative overflow-hidden font-sans border-b border-gray-200">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 1. SECTION HEADER */}
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="inline-block border border-primary/30 rounded-full px-5 py-1.5 text-xs text-primary font-bold mb-6 uppercase tracking-wider bg-white shadow-sm">
            Impact & Recognition
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight mb-4">
            Systemic Impact & Major Awards
          </h2>
          <p className="text-neutraltext max-w-2xl mx-auto text-sm md:text-base font-medium">
            Bridging governance policy with citizen participation to create sustainable ecosystems, recognized at national and state levels.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {/* 2. STATS SECTION (CAPACITY BUILDING) */}
            <div className="mb-24">
              <h3 className="text-xl md:text-2xl font-black text-charcoal mb-8 uppercase tracking-wide border-l-4 border-primary pl-4" data-aos="fade-right">
                Capacity Building & Training
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up">
                {stats.map((stat, idx) => (
                  <AnimatedCounter 
                    key={stat.id || idx}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>

            {/* 3. AWARDS SECTION */}
            <div className="mb-24" id="awards">
              <h3 className="text-xl md:text-2xl font-black text-charcoal mb-8 uppercase tracking-wide border-l-4 border-primary pl-4" data-aos="fade-right">
                Major Honours & Awards
              </h3>
              <div data-aos="fade-up">
                <ExpandableSection
                  items={awards}
                  limit={3}
                  buttonLabelSingle="Awards"
                  renderItem={renderAwardItem}
                  gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                />
              </div>
            </div>
          </>
        )}

        {/* 4. INVITED TALKS STRIP */}
        <div>
          <h3 className="text-xl md:text-2xl font-black text-charcoal mb-8 uppercase tracking-wide border-l-4 border-primary pl-4" data-aos="fade-right">
            Invited Talks & Speaker Engagements
          </h3>
          <div 
            data-aos="fade-up" 
            className="flex flex-wrap justify-center gap-4 py-8 px-6 bg-white border border-gray-200 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)]"
          >
            {talks.map((talk, idx) => (
              <div 
                key={idx}
                className="px-5 py-2.5 bg-offwhite hover:bg-primary/5 hover:text-primary rounded-xl border border-gray-100 transition-all duration-300 text-xs md:text-sm font-bold text-charcoal shadow-sm cursor-default"
              >
                {talk}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Background visual helpers */}
      <div className="absolute top-24 right-10 text-primary opacity-5 animate-pulse pointer-events-none select-none">
        <span className="text-[14vw] font-black uppercase leading-none">IMPACT</span>
      </div>
      <div className="absolute bottom-24 left-10 text-secondary opacity-5 animate-pulse pointer-events-none select-none" style={{ animationDelay: '2s' }}>
        <span className="text-[12vw] font-black uppercase leading-none">AWARDS</span>
      </div>
    </section>
  );
};

export default ImpactAndAwards;
