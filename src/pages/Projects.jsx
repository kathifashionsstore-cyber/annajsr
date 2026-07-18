import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkillsSection from '../components/SkillsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { getCaseStudies } from '../services/portfolioService';
import { portfolioData } from '../data/portfolioData';

const Projects = () => {
  const { profile, gallery } = portfolioData;
  const [caseStudies, setCaseStudies] = useState(portfolioData.caseStudies);

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
            lessons: cs.lessons
          })).sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.warn("Failed to load projects page dynamic data", error);
      }
    };
    loadDynamicData();
  }, []);


  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [selectedGalleryImgIdx, setSelectedGalleryImgIdx] = useState(0);

  // Handle keyboard events for modal & gallery lightboxes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedGalleryImg(null);
      } else if (selectedGalleryImg) {
        if (e.key === 'ArrowLeft') {
          const newIdx = (selectedGalleryImgIdx - 1 + gallery.length) % gallery.length;
          setSelectedGalleryImg(gallery[newIdx]);
          setSelectedGalleryImgIdx(newIdx);
        } else if (e.key === 'ArrowRight') {
          const newIdx = (selectedGalleryImgIdx + 1) % gallery.length;
          setSelectedGalleryImg(gallery[newIdx]);
          setSelectedGalleryImgIdx(newIdx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryImg, selectedGalleryImgIdx, gallery]);

  // Trap body scroll when modal is active
  useEffect(() => {
    if (selectedGalleryImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedGalleryImg]);

  const openGalleryImg = (item, index) => {
    setSelectedGalleryImg(item);
    setSelectedGalleryImgIdx(index);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* 2. PROJECTS INNER HERO */}
        <section className="bg-edi-cream pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left title */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Projects</span>
              </div>
              <span className="text-section-label text-edi-accent font-bold block">
                JSR ANNAMAYYA
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                PROJECTS
              </h1>
            </div>

            {/* Right featured image with decorative block */}
            <div className="lg:col-span-5 relative select-none">
              <div className="absolute top-4 -right-4 w-12 h-16 bg-edi-beige/40 z-0"></div>
              <div className="aspect-[16/10] w-full overflow-hidden border border-[#DDD7CE] bg-edi-cream relative z-10 rounded-sm shadow-sm">
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


        {/* 3. PROJECTS INTRODUCTION */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4">
              <h2 className="font-serif text-section-headline text-edi-heading">
                INTRODUCTION
              </h2>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 text-edi-body leading-relaxed font-medium">
              <p className="font-serif text-2xl sm:text-3xl italic text-edi-heading leading-relaxed font-light">
                "We do not build programs merely to educate, but to design sustainable citizen behavior frameworks directly at the municipal level."
              </p>
              <p className="text-editorial-body">
                JSR Annamayya has successfully driven waste campaigns, behavior change frameworks, and climate projects inside Nellore, Rajamahendravaram, Guntur, and Greater Hyderabad Municipal Corporations.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => scrollToSection("project-index")}
                  className="text-xs uppercase tracking-wider font-extrabold text-edi-accent hover:text-edi-accent-dark underline"
                >
                  VIEW MORE
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* 4. PROJECT INDEX */}
        <section id="project-index" className="py-16 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 font-sans select-none">
            <span className="text-section-label text-edi-accent font-bold block mb-6">PROJECT INDEX</span>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              {caseStudies.map((study, idx) => (
                <button
                  key={study.order}
                  onClick={() => scrollToSection(`project-cs-${study.order}`)}
                  className="flex items-center gap-4 text-left group focus:outline-none py-2 border-b border-transparent hover:border-[#A98760] transition-colors"
                >
                  <span className="font-serif text-2xl italic text-[#A98760] font-bold">
                    0{idx + 1}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-edi-heading group-hover:text-edi-accent">
                    {study.title.split(':')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* 5. PROJECT COVERAGE LIST (Alternating Grid) */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-28 font-sans">
            
            {caseStudies.map((project, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={project.order}
                  id={`project-cs-${project.order}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-[#DDD7CE]/40 pb-20 last:border-0 last:pb-0"
                >
                  {/* Left Column: Image on even, content on odd */}
                  <div className={`lg:col-span-7 group aspect-[16/10] overflow-hidden border border-[#DDD7CE] bg-edi-cream relative rounded-none shadow-sm select-none ${
                    isEven ? 'order-1 lg:order-none' : 'order-1 lg:order-2'
                  }`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
                  </div>

                  {/* Right Column: Content on even, image on odd */}
                  <div className={`lg:col-span-5 flex flex-col gap-4 ${
                    isEven ? 'order-2 lg:order-none' : 'order-2 lg:order-1'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-edi-accent font-mono font-bold">PROJECT {String(idx + 1).padStart(2, '0')}</span>
                      <div className="h-[1px] w-8 bg-edi-accent/30"></div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-edi-muted font-bold">
                        {project.dateRange}
                      </span>
                    </div>

                    <h3 className="font-serif text-card-headline text-edi-heading">
                      {project.title}
                    </h3>
                    <h4 className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold mt-1">
                      {project.organisation} &mdash; <span className="text-edi-muted font-semibold">{project.tags.join(", ")}</span>
                    </h4>
                    
                    <p className="text-editorial-body text-edi-body font-medium mt-2">
                      {project.problem}
                    </p>

                    <div className="flex flex-col gap-2 mt-4 text-xs sm:text-sm text-edi-body font-medium">
                      <div className="border-t border-[#DDD7CE]/60 pt-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#A98760] block mb-1">Strategy & Action</span>
                        <p>{project.strategy}</p>
                      </div>
                      <div className="border-t border-[#DDD7CE]/60 pt-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#A98760] block mb-1">Impact Result</span>
                        <p className="font-serif italic text-edi-heading text-base">"{project.results}"</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </section>


        {/* 6. PROJECTS PAGE — REPEAT SKILLS (Reusable Component) */}
        <SkillsSection />


        {/* 7. PROJECTS PAGE — REPEAT RECOGNITION (Reusable Component) */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default Projects;
