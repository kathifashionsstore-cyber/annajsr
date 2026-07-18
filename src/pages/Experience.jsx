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
          // Trigger a count up for the statistic
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
    <div ref={cardRef} className="p-6 bg-edi-cream border border-edi-border text-center rounded-none shadow-sm flex flex-col gap-2">
      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-edi-accent">
        {val}
      </span>
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-edi-muted">
        {label}
      </span>
    </div>
  );
};

const Experience = () => {
  const { profile, experience, stats, departments } = portfolioData;

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* PAGE SECTION 1 — HERO */}
        <section className="bg-edi-cream pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-edi-border/60">
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
                Experience
              </h1>
              <p className="text-editorial-body text-edi-body leading-relaxed max-w-xl font-medium mt-2">
                A chronological timeline detailing solid waste assignments, private operations leadership, and climate communication campaigns across public administrations.
              </p>
            </div>

            {/* Right Image (5 cols) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[16/10] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={profile.images.experienceHero}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 2 — CAREER TIMELINE */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full text-left">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            
            <div className="relative border-l border-edi-border/80 pl-6 sm:pl-16 py-4 flex flex-col gap-16 font-sans">
              
              {experience.map((item, index) => {
                const isCurrent = index === 0;

                return (
                  <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                    
                    {/* Timeline Node Point */}
                    <div 
                      className={`absolute -left-[32px] sm:-left-[73px] top-1.5 w-4 h-4 rounded-full border ${
                        isCurrent 
                          ? 'bg-edi-accent border-edi-accent-dark scale-110 shadow-sm' 
                          : 'bg-edi-white border-edi-accent'
                      }`}
                    ></div>

                    {/* Column 1: Date range on desktop (3 cols) */}
                    <div className="md:col-span-3 flex flex-col">
                      <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase mb-1">
                        {item.dateRange}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-edi-muted font-bold font-mono">
                        {item.type}
                      </span>
                    </div>

                    {/* Column 3: Complete Role & Details (9 cols) */}
                    <div className="md:col-span-9 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-serif text-card-headline font-bold text-edi-heading tracking-tight leading-tight">
                          {item.role}
                        </h3>
                        <h4 className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold">
                          {item.organisation} &mdash; <span className="text-edi-muted font-semibold">{item.location}</span>
                        </h4>
                      </div>

                      <p className="text-editorial-body text-edi-body font-medium mt-2">
                        {item.description}
                      </p>

                      {/* Responsibilities bullet highlights */}
                      {item.activities && item.activities.length > 0 && (
                        <ul className="flex flex-col gap-2.5 mt-3 pl-1 font-sans text-xs sm:text-sm text-edi-body">
                          {item.activities.map((act, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 bg-edi-accent rounded-full mt-1.5 shrink-0"></span>
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

          </div>
        </section>


        {/* PAGE SECTION 3 — ORGANIZATIONS AND COLLABORATIONS */}
        <section className="py-24 bg-edi-cream border-b border-edi-border/60 w-full text-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <span className="text-section-label text-edi-accent font-bold block mb-3">03 / COLLABORATORS</span>
            <h2 className="font-serif text-section-headline text-edi-heading mb-12">
              Collaborating Departments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {departments.map((dept, i) => (
                <div 
                  key={i} 
                  className="p-6 bg-edi-white border border-edi-border rounded-none h-full flex items-center justify-center min-h-[100px] hover:shadow-sm transition-shadow"
                >
                  <span className="font-sans text-xs uppercase tracking-wider font-extrabold text-edi-heading leading-tight">
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* PAGE SECTION 4 — MAJOR PROFESSIONAL OUTCOMES */}
        <section className="py-24 md:py-32 bg-edi-white w-full text-center">
          <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col gap-12">
            <div className="max-w-xl mx-auto flex flex-col gap-3">
              <span className="text-section-label text-edi-accent font-bold block">IMPACT NUMBERS</span>
              <h2 className="font-serif text-section-headline text-edi-heading leading-tight">
                Program Statistics
              </h2>
              <p className="text-editorial-body text-edi-body font-sans font-medium">
                Verified figures from environmental networks and youth climate programs across institutions.
              </p>
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
