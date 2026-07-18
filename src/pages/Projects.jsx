import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { portfolioData } from '../data/portfolioData';

const Projects = () => {
  const { profile, caseStudies, gallery } = portfolioData;

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [selectedGalleryImgIdx, setSelectedGalleryImgIdx] = useState(0);

  // Available categories based on actual caseStudies tags and stats
  const categories = ["All", "Behaviour Change", "IEC", "Sanitation", "Sustainability", "Menstrual Health", "Public Policy", "Capacity Building", "Innovation"];

  // Filter projects dynamically
  const filteredProjects = caseStudies.filter((study) => {
    if (activeCategory === "All") return true;
    
    // Custom mapping for filter keywords
    if (activeCategory === "Behaviour Change") return study.tags.includes("SWM") || study.tags.includes("IEC") || study.title.includes("Bag") || study.title.includes("Guntur");
    if (activeCategory === "IEC") return study.tags.includes("IEC") || study.title.includes("Guntur") || study.title.includes("MHM");
    if (activeCategory === "Sanitation") return study.title.includes("Guntur") || study.title.includes("SWM") || study.tags.includes("SWM");
    if (activeCategory === "Sustainability") return study.title.includes("Bag") || study.tags.includes("Plastic Reduction") || study.tags.includes("Climate Action");
    if (activeCategory === "Menstrual Health") return study.title.includes("MHM") || study.tags.includes("Public Health");
    if (activeCategory === "Public Policy") return study.title.includes("MHM") || study.tags.includes("Governance");
    if (activeCategory === "Capacity Building") return study.title.includes("Guntur") || study.tags.includes("IEC");
    if (activeCategory === "Innovation") return study.title.includes("Bag") || study.tags.includes("Innovation");
    
    return false;
  });

  // Handle keyboard events for modal & gallery lightboxes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
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
  }, [selectedProject, selectedGalleryImg, selectedGalleryImgIdx, gallery]);

  // Trap body scroll when modal is active
  useEffect(() => {
    if (selectedProject || selectedGalleryImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject, selectedGalleryImg]);

  const openGalleryImg = (item, index) => {
    setSelectedGalleryImg(item);
    setSelectedGalleryImgIdx(index);
  };

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* PAGE SECTION 1 — INNER HERO */}
        <section className="bg-edi-cream pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-edi-border/60">
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
                Projects & Major Initiatives
              </h1>
            </div>

            {/* Right featured image with decorative block */}
            <div className="lg:col-span-5 relative select-none">
              <div className="absolute top-4 -right-4 w-12 h-16 bg-edi-beige/40 z-0"></div>
              <div className="aspect-[16/10] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={caseStudies[0].image}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 2 — INTRODUCTION */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4">
              <h2 className="font-serif text-section-headline text-edi-heading">
                Introduction
              </h2>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 text-edi-body leading-relaxed font-medium">
              <p className="font-serif text-2xl sm:text-3xl italic text-edi-heading leading-relaxed font-light">
                "We do not build programs merely to educate, but to design sustainable citizen behavior frameworks directly at the municipal level."
              </p>
              <p className="text-editorial-body">
                JSR Annamayya has successfully driven waste campaigns, behavior change frameworks, and climate projects inside Nellore, Rajamahendravaram, Guntur, and Greater Hyderabad Municipal Corporations.
              </p>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 3 — FILTER NAVIGATION */}
        <section className="py-8 bg-edi-warm-light border-b border-edi-border/60 w-full sticky top-[90px] z-30 shadow-sm select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-x-auto">
            <div className="flex items-center gap-6 md:gap-8 min-w-max py-2 font-sans text-xs sm:text-sm font-semibold text-edi-muted">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-1 uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                    activeCategory === cat 
                      ? 'text-edi-accent border-b-2 border-edi-accent font-extrabold' 
                      : 'hover:text-edi-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* PAGE SECTION 4 — FEATURED PROJECT */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Large landscape image (7 cols) */}
            <div className="lg:col-span-7 group aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-md select-none">
              <img
                src={caseStudies[1].image}
                alt={caseStudies[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
            </div>

            {/* Details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 font-sans">
              <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">{caseStudies[1].dateRange} &mdash; {caseStudies[1].organisation}</span>
              <h2 className="font-serif text-card-headline font-bold text-edi-heading">
                {caseStudies[1].title}
              </h2>
              <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase block mt-1">
                CATEGORY: {caseStudies[1].tags.join(" / ")}
              </span>
              <p className="text-editorial-body text-edi-body font-medium mt-2">
                {caseStudies[1].problem}
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => setSelectedProject(caseStudies[1])}
                  className="px-6 py-3 bg-edi-black text-edi-cream border border-edi-black text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-transparent hover:text-edi-black transition-all duration-300"
                >
                  View details &rarr;
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 5 — PROJECT LIST (Alternating Grid) */}
        <section className="py-24 md:py-32 bg-edi-warm-light border-b border-edi-border/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-24 font-sans">
            
            {filteredProjects.map((project, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={project.order}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-edi-border/40 pb-16 last:border-0 last:pb-0"
                >
                  {/* Left Column: Image on even, content on odd */}
                  <div className={`lg:col-span-7 group aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm select-none ${
                    isEven ? 'order-1 lg:order-none' : 'order-1 lg:order-2'
                  }`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
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

                    <h3 className="font-serif text-card-headline font-bold text-edi-heading">
                      {project.title}
                    </h3>
                    <h4 className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold mt-1">
                      {project.organisation} &mdash; <span className="text-edi-muted font-semibold">{project.tags.join(", ")}</span>
                    </h4>
                    
                    <p className="text-editorial-body text-edi-body font-medium mt-2">
                      {project.problem}
                    </p>

                    <div className="flex items-center gap-6 mt-4">
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="text-xs font-bold text-edi-accent hover:text-edi-accent-dark uppercase tracking-wider underline underline-offset-4"
                      >
                        View case study details &rarr;
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-edi-muted font-medium">No projects found in this category.</p>
              </div>
            )}

          </div>
        </section>


        {/* PAGE SECTION 6 — VISUAL JOURNEY GALLERY COLLAGE (Inside projects for full integration) */}
        <section id="gallery" className="py-24 md:py-32 bg-edi-cream w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="mb-16">
              <span className="text-section-label text-edi-accent font-bold block mb-3">06 / PHOTO LOGS</span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Visual Journey Collage
              </h2>
              <p className="text-editorial-body text-edi-body font-sans font-medium mt-2 max-w-md">
                A grid showcasing municipal project activities, community workshops, civil awards, and government programs. Click any image to browse.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              {gallery.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => openGalleryImg(item, idx)}
                  className="group flex flex-col bg-edi-warm-light border border-edi-border p-3 hover:shadow-md transition-shadow text-left rounded-none select-none"
                  aria-label={`View photo logs: ${item.caption}`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden border border-edi-border bg-edi-cream relative mb-3">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-edi-black/5 pointer-events-none"></div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-edi-heading font-semibold leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 1. Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-edi-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-edi-cream border border-edi-border w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 rounded-none text-left relative font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-edi-black hover:text-edi-accent font-sans text-xl focus:outline-none p-2"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            
            <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase block mb-2">
              CASE DETAIL &mdash; {selectedProject.dateRange}
            </span>
            <h3 className="font-serif text-3xl font-semibold text-edi-heading leading-tight tracking-tight mb-4">
              {selectedProject.title}
            </h3>
            <span className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold block mb-6">
              {selectedProject.organisation}
            </span>

            <div className="flex flex-col gap-6 text-sm text-edi-body leading-relaxed font-medium">
              
              <div className="border-t border-edi-border/60 pt-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">The Challenge / Problem</h5>
                <p className="text-xs sm:text-sm">{selectedProject.problem}</p>
              </div>

              {selectedProject.objective && (
                <div className="border-t border-edi-border/60 pt-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">Project Objective</h5>
                  <p className="text-xs sm:text-sm">{selectedProject.objective}</p>
                </div>
              )}

              <div className="border-t border-edi-border/60 pt-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">Core Strategy</h5>
                <p className="text-xs sm:text-sm">{selectedProject.strategy}</p>
              </div>

              <div className="border-t border-edi-border/60 pt-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">Implementation & Community engagement</h5>
                <p className="text-xs sm:text-sm">{selectedProject.implementation}</p>
              </div>

              <div className="border-t border-edi-border/60 pt-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">Results & Public Outcomes</h5>
                <p className="text-xs sm:text-sm font-serif italic text-edi-heading text-lg mt-1">
                  "{selectedProject.results}"
                </p>
              </div>

              {selectedProject.lessons && (
                <div className="border-t border-edi-border/60 pt-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-edi-heading mb-2">Key Operational Lessons</h5>
                  <p className="text-xs sm:text-sm">{selectedProject.lessons}</p>
                </div>
              )}

            </div>

            <div className="mt-8 pt-6 border-t border-edi-border/60 text-right">
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-6 py-3 bg-edi-black text-edi-cream border border-edi-black text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-edi-black transition-colors rounded-none"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Gallery Lightbox Modal */}
      {selectedGalleryImg && (
        <div 
          className="fixed inset-0 bg-edi-black/95 z-[99999] flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <button 
            className="absolute top-6 right-6 text-edi-cream hover:text-white font-sans text-xs uppercase tracking-widest focus:outline-none p-2"
            onClick={() => setSelectedGalleryImg(null)}
          >
            Close ×
          </button>
          
          <div 
            className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center mb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedGalleryImg.image} 
              alt={selectedGalleryImg.caption} 
              className="max-w-full max-h-[75vh] object-contain border border-edi-border/10 shadow-2xl"
            />
          </div>

          <div 
            className="text-center max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm sm:text-base font-serif italic text-edi-cream leading-relaxed">
              {selectedGalleryImg.caption}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Projects;
