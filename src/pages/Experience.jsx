import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { portfolioData } from '../data/portfolioData';

const StatCard = ({ label, targetVal }) => {
  const [val, setVal] = useState("0");
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const numericPart = parseInt(targetVal.replace(/[^0-9]/g, ''));
          const suffix = targetVal.replace(/[0-9]/g, '');
          
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = progress * (2 - progress);
            
            const currentNum = Math.floor(easeOutQuad * numericPart);
            setVal(`${currentNum.toLocaleString()}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1, triggerOnce: true }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [targetVal]);

  return (
    <div ref={cardRef} className="p-6 bg-edi-cream border border-[#DDD7CE] text-center rounded-none shadow-sm flex flex-col gap-2">
      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-edi-accent">
        {val}
      </span>
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-edi-muted">
        {label}
      </span>
    </div>
  );
};

import { getTimelineStops, getStats, getDepartments } from '../services/portfolioService';

const Experience = () => {
  const { profile } = portfolioData;
  const [experience, setExperience] = useState(portfolioData.experience);
  const [stats, setStats] = useState(portfolioData.stats);
  const [departments, setDepartments] = useState(portfolioData.departments);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const stops = await getTimelineStops();
        const statItems = await getStats();
        const deptItems = await getDepartments();

        if (stops && stops.length > 0) {
          setExperience(stops.map(s => ({
            id: s.id,
            dateRange: s.number,
            organisation: s.title,
            role: s.subtitle,
            description: s.text,
            order: s.order
          })).sort((a, b) => b.order - a.order));
        }

        if (statItems && statItems.length > 0) {
          setStats(statItems);
        }

        if (deptItems && deptItems.length > 0) {
          setDepartments(deptItems);
        }
      } catch (error) {
        console.warn("Failed to load experience page dynamic data", error);
      }
    };
    loadDynamicData();
  }, []);


  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* 2. EXPERIENCE HERO */}
        <section className="bg-edi-cream pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              {/* Breadcrumb */}
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Experience</span>
              </div>
              <span className="text-section-label text-edi-accent font-bold block">
                JSR ANNAMAYYA
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                EXPERIENCE
              </h1>
              <p className="font-serif text-2xl sm:text-3xl italic text-[#806346] leading-relaxed font-light mt-2">
                Advancing public sanitation systems and environmental education across Andhra Pradesh and Telangana.
              </p>
            </div>

            {/* Right Image (5 cols) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[16/10] w-full overflow-hidden border border-[#DDD7CE] bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={profile.images.experienceHero}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* 3. INTRODUCTORY STATEMENT */}
        <section className="py-16 md:py-24 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-edi-heading leading-relaxed font-light text-center">
              "Over the past nine years, my focus has been to create operational models that build bridge layers between municipal health departments and local citizen communities."
            </p>
          </div>
        </section>


        {/* 4. COMPLETE EXPERIENCE LIST */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col gap-16 font-sans">
            {experience.map((item, idx) => {
              // Derive clean text monogram fallback for logos
              const initials = item.organisation
                .split(' ')
                .map(word => word[0])
                .join('')
                .substring(0, 3)
                .toUpperCase();

              return (
                <div 
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-8 border-b border-[#DDD7CE]/40 last:border-0 last:pb-0"
                >
                  
                  {/* Left logo column (25% width / 3 cols) */}
                  <div className="md:col-span-3 flex justify-start md:justify-center items-start select-none">
                    <div className="w-20 h-20 bg-[#F8F6F1] border border-[#DDD7CE] flex items-center justify-center rounded-none shadow-sm group">
                      <span className="font-serif text-2xl font-bold text-[#A98760] group-hover:text-[#111111] transition-colors">
                        {initials}
                      </span>
                    </div>
                  </div>

                  {/* Right content column (75% width / 9 cols) */}
                  <div className="md:col-span-9 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono tracking-widest text-[#A98760] font-bold uppercase">
                        {item.dateRange} &mdash; {item.type}
                      </span>
                      <h3 className="font-serif text-card-headline text-edi-heading leading-tight">
                        {item.role}
                      </h3>
                      <h4 className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold mt-1">
                        {item.organisation} &mdash; <span className="text-edi-muted font-semibold">{item.location}</span>
                      </h4>
                    </div>

                    <p className="text-editorial-body text-edi-body font-medium mt-2">
                      {item.description}
                    </p>

                    {item.activities && item.activities.length > 0 && (
                      <ul className="flex flex-col gap-2.5 mt-3 pl-1 font-sans text-xs sm:text-sm text-edi-body">
                        {item.activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 bg-[#A98760] rounded-full mt-1.5 shrink-0"></span>
                            <span className="font-medium text-edi-body/90 leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </section>


        {/* 5. ORGANIZATIONS AND COLLABORATIONS */}
        <section className="py-24 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <span className="text-section-label text-edi-accent font-bold block mb-3">COLLABORATING AUTHORITIES</span>
            <h2 className="font-serif text-section-headline text-edi-heading mb-12">
              Departments & Agencies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {departments.map((dept, i) => (
                <div 
                  key={i} 
                  className="p-6 bg-edi-white border border-[#DDD7CE] rounded-none h-full flex items-center justify-center min-h-[100px] hover:shadow-sm transition-shadow group"
                >
                  <span className="font-sans text-xs uppercase tracking-wider font-extrabold text-[#5F5F5F] group-hover:text-[#111111] transition-colors leading-tight">
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 6. MAJOR PROFESSIONAL OUTCOMES */}
        <section className="py-24 md:py-32 bg-edi-white w-full text-center">
          <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col gap-12">
            <div className="max-w-xl mx-auto flex flex-col gap-3">
              <span className="text-section-label text-edi-accent font-bold block">IMPACT NUMBERS</span>
              <h2 className="font-serif text-section-headline text-edi-heading leading-tight">
                Program Statistics
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-sans">
              {stats.slice(0, 8).map((stat, idx) => (
                <StatCard 
                  key={idx} 
                  label={stat.label} 
                  targetVal={stat.value} 
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Experience;
