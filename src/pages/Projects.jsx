import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkillsSection from '../components/SkillsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PageAtmosphere from '../components/PageAtmosphere';
import { getCaseStudies } from '../services/portfolioService';
import { portfolioData } from '../data/portfolioData';

const Projects = () => {
  const { profile } = portfolioData;
  const [caseStudies, setCaseStudies] = useState(portfolioData.caseStudies);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const studies = await getCaseStudies();
        if (studies && studies.length > 0) {
          setCaseStudies(studies.map(cs => ({
            order: cs.order,
            title: cs.title,
            organisation: cs.organisation,
            dateRange: cs.dateRange,
            image: cs.coverImage || cs.image,
            tags: cs.tags || [],
            problem: cs.problem,
            objective: cs.objective,
            strategy: cs.strategy,
            implementation: cs.implementation,
            results: cs.results,
            lessons: cs.lessons,
            metricBadge: cs.order === 1 
              ? "Swachh Survekshan Rank 121 → 4th Turnaround" 
              : cs.order === 2 
              ? "50,000+ Students Trained Across 500+ Govt Schools" 
              : "Solar-Powered ATB Vending & UNDP Recognized"
          })).sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.warn("Failed to load projects page dynamic data", error);
      }
    };
    loadDynamicData();
  }, []);

  // IntersectionObserver scroll reveals
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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`bg-[#F8F6F1] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased relative ${heroLoaded ? 'hero-loaded' : ''}`}>
      <Navbar />

      <main className="flex-grow w-full relative">

        {/* 1. PROJECTS HERO WITH 2D DECORATIVE ACCENTS */}
        <section className="bg-[#F8F6F1] pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60">
          <PageAtmosphere variant="projects" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
            
            {/* Left title */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Projects</span>
              </div>
              <span className="text-section-label text-[#A84F43] font-bold block">
                JSR ANNAMAYYA ARCHIVE
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                <div className="reveal-line">
                  <span>PROJECTS & CASE STUDIES</span>
                </div>
              </h1>
              <p className="text-editorial-body text-[#5F5F5F] font-medium leading-relaxed max-w-xl mt-2">
                In-depth municipal governance case studies, behaviour change communication frameworks, and UNDP-recognized environmental innovations.
              </p>
            </div>

            {/* Right featured image */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[16/10] w-full overflow-hidden border-2 border-[#111111] bg-[#F8F6F1] relative z-10 clip-reveal-left shadow-lg">
                <img
                  src={caseStudies[0].image}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* 2. PROJECTS INTRODUCTION */}
        <section className="reveal-section relative border-b border-[#DDD7CE]/60 bg-[#FFFFFF] py-16 md:py-24">
          <div 
            className="absolute top-12 right-12 w-36 h-36 opacity-40 bg-[radial-gradient(#A84F43_2px,transparent_2px)] [background-size:14px_14px] rounded-full pointer-events-none z-0" 
            aria-hidden="true" 
          />
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">
            <div className="lg:col-span-4 flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#A84F43] tracking-widest uppercase">01 / INTRODUCTION</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#181818] tracking-tight">INTRODUCTION</h2>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 text-left">
              <p className="font-serif text-2xl sm:text-3xl italic text-[#181818] font-light leading-relaxed">
                "We do not build programs merely to educate, but to design sustainable citizen behavior frameworks directly at the municipal level."
              </p>

              <p className="text-[#5F5F5F] font-sans text-base sm:text-lg leading-relaxed font-medium">
                JSR Annamayya has successfully driven waste campaigns, behavior change frameworks, and climate projects inside Nellore, Rajamahendravaram, Guntur, and Greater Hyderabad Municipal Corporations.
              </p>

              <button
                type="button"
                onClick={() => scrollToSection("project-index")}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#A84F43] transition-colors w-max mt-2"
              >
                EXPLORE CASE STUDIES &rarr;
              </button>
            </div>
          </div>
        </section>


        {/* 3. PROJECT INDEX NAVIGATION BAR */}
        <section id="project-index" className="reveal-section py-12 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-left relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 font-sans select-none">
            <span className="text-section-label text-[#A84F43] font-bold block mb-4">CASE STUDY INDEX</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {caseStudies.map((study, idx) => (
                <button
                  key={study.order}
                  type="button"
                  onClick={() => scrollToSection(`project-cs-${study.order}`)}
                  className="flex items-center gap-4 text-left p-4 bg-[#FFFFFF] border border-[#DDD7CE] hover:border-[#A84F43] hover:shadow-sm transition-all group"
                >
                  <span className="font-serif text-3xl font-bold text-[#A84F43]">
                    0{idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#181818] group-hover:text-[#A84F43]">
                      {study.title.split(':')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-edi-muted">{study.dateRange}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* 4. ARCHITECTURAL CASE STUDY CARDS (WITH 1:1 RATIO PHOTO FRAMES) */}
        <section className="reveal-section py-24 md:py-32 bg-[#FFFFFF] border-b border-[#DDD7CE]/60 w-full text-left relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-28 font-sans">
            
            {caseStudies.map((project, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <article 
                  key={project.order}
                  id={`project-cs-${project.order}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-[#DDD7CE]/40 pb-20 last:border-0 last:pb-0 relative"
                >
                  {/* Watermark Case Study Number */}
                  <div 
                    className={`hidden lg:block absolute font-serif text-[180px] font-bold text-[#A98760]/08 leading-none select-none pointer-events-none z-0 ${
                      isEven ? '-top-10 -right-6' : '-top-10 -left-6'
                    }`}
                    aria-hidden="true"
                  >
                    0{idx + 1}
                  </div>

                  {/* 1:1 Aspect Ratio Photo Container */}
                  <div className={`lg:col-span-5 select-none z-10 ${
                    isEven ? 'order-1 lg:order-none' : 'order-1 lg:order-2'
                  }`}>
                    <div className="relative w-full max-w-[440px] mx-auto aspect-square group">
                      
                      {/* Terracotta Offset Backdrop */}
                      <div 
                        className={`absolute -bottom-4 -right-4 w-full h-full bg-[#A84F43]/15 border border-[#A84F43]/30 z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2 ${
                          isEven ? '' : '-right-auto -left-4'
                        }`} 
                        aria-hidden="true"
                      />

                      {/* 1:1 Square Image Box */}
                      <div className="w-full h-full aspect-square overflow-hidden border-2 border-[#111111] bg-[#F8F6F1] relative z-10 shadow-lg">
                        <span className="absolute top-2 left-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>
                        <span className="absolute top-2 right-2 text-[#A84F43] font-mono text-xs z-20 font-bold">+</span>

                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#111111]/05 pointer-events-none"></div>
                      </div>

                      {/* Figure Caption */}
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#A84F43] uppercase font-bold">
                        <span>[ CASE STUDY 0{idx + 1} • 1:1 ARCHIVE ]</span>
                        <span className="text-edi-muted">{project.dateRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className={`lg:col-span-7 flex flex-col gap-5 z-10 ${
                    isEven ? 'order-2 lg:order-none' : 'order-2 lg:order-1'
                  }`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] bg-[#A84F43] text-white px-3 py-1 font-mono font-bold uppercase">
                        CASE STUDY 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-edi-muted font-bold">
                        {project.organisation}
                      </span>
                    </div>

                    <h3 className="font-serif text-card-headline text-[#181818]">
                      {project.title}
                    </h3>

                    {/* Metric Highlight Badge */}
                    {project.metricBadge && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F8F6F1] border-l-2 border-[#A84F43] text-[#181818] font-sans text-xs font-bold uppercase tracking-wider w-max shadow-2xs">
                        <span className="text-[#A84F43]">★</span>
                        <span>{project.metricBadge}</span>
                      </div>
                    )}
                    
                    <p className="text-editorial-body text-[#5F5F5F] font-medium leading-relaxed">
                      {project.problem}
                    </p>

                    {/* Strategy & Results Dual Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 font-sans text-xs sm:text-sm text-edi-body font-medium">
                      <div className="bg-[#F8F6F1] border border-[#DDD7CE] p-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#A84F43] block mb-1">Strategy & Action</span>
                        <p className="text-[#181818] leading-relaxed">{project.strategy}</p>
                      </div>
                      
                      <div className="bg-[#F8F6F1] border border-[#DDD7CE] p-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D5A27] block mb-1">Verified Impact Result</span>
                        <p className="font-serif italic text-[#181818] text-base leading-snug">"{project.results}"</p>
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}

          </div>
        </section>


        {/* 5. SKILLS SECTION */}
        <div className="reveal-section">
          <SkillsSection />
        </div>


        {/* 7. TESTIMONIALS & RECOGNITION AUTO-SLIDER */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default Projects;
