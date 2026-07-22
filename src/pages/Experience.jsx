import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageAtmosphere from '../components/PageAtmosphere';
import ImpactStatistics from '../components/ImpactStatistics';
import { portfolioData } from '../data/portfolioData';
import { getTimelineStops, getDepartments } from '../services/portfolioService';

const Experience = () => {
  const { profile } = portfolioData;
  const [experience, setExperience] = useState(portfolioData.experience);
  const [departments, setDepartments] = useState(portfolioData.departments);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Parallax refs for 2D editorial animations
  const blobRef = useRef(null);
  const stripedCircleRef = useRef(null);
  const dottedCircleRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const stops = await getTimelineStops();
        const deptItems = await getDepartments();

        if (stops && stops.length > 0) {
          setExperience(stops.map(s => ({
            id: s.id,
            dateRange: s.number,
            yearWatermark: s.number.split('–')[0] || s.number,
            organisation: s.title,
            role: s.subtitle,
            description: s.text,
            order: s.order,
            type: s.type || (s.title.includes('Wipro') ? "Corporate Operations & Delivery" : s.title.includes('Council') ? "Climate Action & Environmental Advocacy" : "Government Public Systems Assignment"),
            activities: s.activities || [],
            metricBadge: s.title.includes('Guntur') ? "Swachh Survekshan Rank 4th Turnaround" : s.title.includes('Council') ? "50,000+ Young Earth Leaders Trained" : s.title.includes('Wipro') ? "80+ Engineering Operations Team" : "500k+ Citizens Impacted"
          })).sort((a, b) => b.order - a.order));
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

  // Desktop Mouse Parallax
  useEffect(() => {
    const isMobile = window.innerWidth < 900;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (isMobile || mediaQuery.matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${currentX * 6}px, ${currentY * 6}px, 0)`;
      }
      if (stripedCircleRef.current) {
        stripedCircleRef.current.style.transform = `scale(1) rotate(6deg) translate3d(${currentX * 10}px, ${currentY * 10}px, 0)`;
      }
      if (dottedCircleRef.current) {
        dottedCircleRef.current.style.transform = `translate3d(${currentX * 12}px, ${currentY * 12}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('pointermove', handlePointerMove);
    animationFrameRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // IntersectionObserver scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal-section');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Filter Categories
  const categories = [
    { label: 'ALL', count: experience.length },
    { label: 'GOVERNMENT PUBLIC SYSTEMS', count: experience.filter(e => e.type?.toLowerCase().includes('government')).length },
    { label: 'CLIMATE ACTION', count: experience.filter(e => e.type?.toLowerCase().includes('climate')).length },
    { label: 'CORPORATE OPERATIONS', count: experience.filter(e => e.type?.toLowerCase().includes('corporate')).length }
  ];

  const filteredExperience = experience.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'GOVERNMENT PUBLIC SYSTEMS') return item.type?.toLowerCase().includes('government');
    if (activeFilter === 'CLIMATE ACTION') return item.type?.toLowerCase().includes('climate');
    if (activeFilter === 'CORPORATE OPERATIONS') return item.type?.toLowerCase().includes('corporate');
    return true;
  });

  return (
    <div className={`bg-[#F8F6F1] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased relative ${heroLoaded ? 'hero-loaded' : ''}`}>
      <Navbar />

      <main className="flex-grow w-full relative site-main">

        {/* 1. EXPERIENCE HERO WITH ANIMATED 2D EDITORIAL ACCENTS */}
        <section className="bg-[#F8F6F1] pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60 overflow-hidden">
          
          {/* Background Soft Blob */}
          <div ref={blobRef} className="hero-soft-blob" />

          {/* Page Atmosphere 2D Accents */}
          <PageAtmosphere variant="experience" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Experience</span>
              </div>
              
              <span className="text-section-label text-[#A84F43] font-bold block uppercase tracking-widest">
                JSR ANNAMAYYA ARCHIVE
              </span>
              
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                <div className="reveal-line">
                  <span>EXPERIENCE</span>
                </div>
              </h1>
              
              <p className="font-serif text-2xl sm:text-3xl italic text-[#806346] leading-relaxed font-light mt-2 hero-description hero-description-1">
                Advancing public sanitation systems and environmental education across Andhra Pradesh and Telangana.
              </p>
            </div>

            {/* Right Image (5 cols) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[16/10] w-full overflow-hidden border-2 border-[#111111] bg-[#F8F6F1] relative z-10 clip-reveal-left shadow-lg">
                <img
                  src={profile.images.experienceHero}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

          </div>

          {/* Animated Decorative Striped Circle */}
          <div ref={stripedCircleRef} className="decorative-striped-circle" />

          {/* Animated Decorative Dotted Circle */}
          <div ref={dottedCircleRef} className="decorative-dotted-circle">
            <div className="dotted-circle-inner" />
          </div>
        </section>


        {/* 2. CATEGORY FILTER TABS */}
        <section className="bg-[#FFFFFF] border-b border-[#DDD7CE]/60 py-6 px-6 md:px-12 w-full sticky top-[62px] lg:top-[88px] z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 font-sans">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveFilter(cat.label)}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 rounded-none border ${
                  activeFilter === cat.label
                    ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                    : 'bg-[#F8F6F1] text-[#5F5F5F] border-[#DDD7CE] hover:border-[#A84F43] hover:text-[#111111]'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </section>


        {/* 3. EXPERIENCE ARCHITECTURAL CARDS TIMELINE */}
        <section className="reveal-section py-24 md:py-32 bg-[#F8F6F1] w-full relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-20">
            {filteredExperience.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <article 
                  key={item.id || idx}
                  className="experience-item bg-[#FFFFFF] border-2 border-[#111111] p-8 md:p-12 relative shadow-md hover:shadow-xl transition-all duration-500 group overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Watermark Year Background */}
                  <div 
                    className="absolute -bottom-6 -right-4 font-serif font-bold text-[120px] sm:text-[180px] text-[#A98760]/08 leading-none select-none pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    {item.yearWatermark || '2026'}
                  </div>

                  {/* Left Column: Organization & Monogram Tag (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-4 relative z-10 border-b lg:border-b-0 lg:border-r border-[#DDD7CE] pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-[#A84F43] text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                        {item.dateRange}
                      </span>
                      <span className="text-[10px] font-mono text-[#806346] font-bold uppercase tracking-wider">
                        ENTRY 0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl font-bold text-[#181818] group-hover:text-[#A84F43] transition-colors leading-tight">
                        {item.organisation}
                      </h3>
                      <p className="font-sans text-xs font-bold text-[#806346] uppercase tracking-wider mt-1">
                        {item.role}
                      </p>
                    </div>

                    {/* Metric Highlight Badge */}
                    {item.metricBadge && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-[#F8F6F1] border border-[#A84F43]/30 text-[#A84F43] font-mono text-[11px] font-bold uppercase tracking-wider">
                        <span>★</span>
                        <span>{item.metricBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Execution Scope & Deliverables (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-5 relative z-10">
                    <p className="font-serif text-xl sm:text-2xl italic text-[#181818] font-light leading-relaxed">
                      "{item.description}"
                    </p>

                    {/* Deliverables Bullet List */}
                    {item.activities && item.activities.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#DDD7CE]/60">
                        {item.activities.map((act, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2.5 text-xs text-[#5F5F5F] font-sans font-medium">
                            <span className="w-1.5 h-1.5 bg-[#A84F43] rounded-full mt-1.5 shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>


        {/* 4. COLLABORATING AUTHORITIES */}
        <section className="reveal-section py-24 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-center relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <span className="text-section-label text-[#A84F43] font-bold block mb-3">COLLABORATING AUTHORITIES</span>
            <h2 className="font-serif text-section-headline text-edi-heading mb-12">
              Departments & Agencies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {departments.map((dept, i) => (
                <div 
                  key={i} 
                  className="p-6 bg-[#FFFFFF] border-2 border-[#DDD7CE] rounded-none h-full flex flex-col items-center justify-center min-h-[110px] hover:border-[#A84F43] hover:shadow-md transition-all group"
                >
                  <span className="font-mono text-[10px] text-[#A84F43] font-bold mb-1">AGENCY 0{i + 1}</span>
                  <span className="font-sans text-xs uppercase tracking-wider font-extrabold text-[#5F5F5F] group-hover:text-[#111111] transition-colors leading-tight text-center">
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 5. ANIMATED IMPACT GRAPH DASHBOARD */}
        <div className="reveal-section">
          <ImpactStatistics />
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Experience;
