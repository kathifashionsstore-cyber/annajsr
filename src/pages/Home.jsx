import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortraitFrame from '../components/PortraitFrame';
import RotatingResumeBadge from '../components/RotatingResumeBadge';
import VisionSection from '../components/VisionSection';
import SkillsSection from '../components/SkillsSection';
import { portfolioData } from '../data/portfolioData';

const Home = () => {
  const { profile, heroSlides, experience, caseStudies, awards, testimonials, gallery } = portfolioData;

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto transition hero slides slowly (every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Handle lightbox keyboard navigation (Escape, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        const newIndex = (selectedImageIndex - 1 + gallery.length) % gallery.length;
        setSelectedImage(gallery[newIndex]);
        setSelectedImageIndex(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = (selectedImageIndex + 1) % gallery.length;
        setSelectedImage(gallery[newIndex]);
        setSelectedImageIndex(newIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedImageIndex, gallery]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  const openLightbox = (item, index) => {
    setSelectedImage(item);
    setSelectedImageIndex(index);
  };

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* 1. HERO SECTION */}
        <section id="hero" className="min-h-[calc(100vh-90px)] flex items-center pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center w-full">
            
            {/* Left Column (46% width) */}
            <div className="lg:col-span-6 flex flex-col gap-8 text-left py-4">
              <span className="text-section-label text-edi-accent font-bold block animate-[fadeIn_0.5s_ease-out_forwards]">
                HI, I'M
              </span>
              
              {/* Headline Slideshow */}
              <div className="relative h-80 sm:h-64 md:h-56 lg:h-64 my-2">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col gap-6 ${
                      index === activeSlide 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 translate-y-6 pointer-events-none'
                    }`}
                  >
                    <h1 className="font-serif text-edi-heading text-hero-headline">
                      {slide.headline}
                    </h1>
                    <p className="text-editorial-body text-edi-body font-sans max-w-xl font-medium">
                      {slide.subtext}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-6 mt-4 font-sans">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-edi-black text-edi-cream border border-edi-black text-xs font-semibold uppercase tracking-[0.18em] rounded-none hover:bg-transparent hover:text-edi-black transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-edi-accent"
                >
                  Contact
                </Link>
                <Link
                  to="/professional-profile"
                  className="px-8 py-4 bg-transparent text-edi-black border border-edi-border text-xs font-semibold uppercase tracking-[0.18em] rounded-none hover:bg-edi-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-edi-accent"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Right Column (54% width) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <PortraitFrame src={profile.images.heroPortrait} alt={`${profile.name} Portrait`} />
              
              {/* Rotating CV Badge overlapping lower left of the portrait */}
              <RotatingResumeBadge className="absolute -bottom-8 left-0 sm:left-6 lg:-left-6 z-20 shadow-xl" />
            </div>

          </div>
        </section>


        {/* 2. PROFILE INTRODUCTION SECTION */}
        <section className="py-24 md:py-32 bg-edi-white border-y border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Image (42% width) */}
            <div className="lg:col-span-5 relative group select-none">
              <div className="absolute top-4 -right-4 w-12 h-16 bg-edi-beige/40 z-0"></div>
              <div className="aspect-[4/5] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-none shadow-sm">
                <img
                  src={profile.images.profileAlt}
                  alt={`${profile.name} In Action`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
              {/* Section number overlay */}
              <div className="absolute -top-6 -left-6 text-edi-accent font-mono text-[10px] font-bold z-20">01 / INTRO</div>
            </div>

            {/* Right Content (58% width) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="text-section-label text-edi-accent font-bold block">
                JSR ANNAMAYYA
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                National Award-Winning Behaviour Change & IEC Specialist
              </h2>
              
              <div className="w-16 h-[1px] bg-edi-accent my-2"></div>
              
              <div className="flex flex-col gap-4 text-edi-body font-sans font-medium">
                <p className="font-serif text-2xl sm:text-3xl italic text-edi-heading leading-relaxed font-light">
                  "{profile.bio.intro}"
                </p>
                <p className="text-editorial-body">
                  Transitioning from software operations to public service governance, JSR Annamayya has spearheaded SWM, sanitation reform, and state-wide climate advocacy networks across Andhra Pradesh and Telangana.
                </p>
              </div>

              {/* Strengths highlights list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 font-sans text-xs sm:text-sm font-semibold text-edi-heading">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-edi-accent rounded-full"></span>
                  <span>9+ Years Active Public Systems & IEC Expert</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-edi-accent rounded-full"></span>
                  <span>National Award civilian recognition recipient</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/professional-profile"
                  className="inline-block px-8 py-4 bg-edi-black text-edi-cream border border-edi-black rounded-none hover:bg-transparent hover:text-edi-black font-sans text-xs uppercase tracking-wider transition-all duration-300 font-semibold"
                >
                  View More &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* 3. VISION & LEADERSHIP SECTION (VisionSection Component) */}
        <VisionSection />


        {/* 4. SKILLS SECTION (SkillsSection Component) */}
        <SkillsSection />


        {/* 5. SELECTED EXPERIENCE SECTION */}
        <section id="experience-preview" className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-section-label text-edi-accent font-bold block">06 / TIMELINE</span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Selected Experience
              </h2>
              <p className="text-editorial-body text-edi-body font-sans mt-2 max-w-xs font-medium">
                A brief list of recent municipal coordination roles, climate programs, and private operations.
              </p>
              <div className="mt-4">
                <Link
                  to="/experience"
                  className="inline-block px-5 py-3 border border-edi-black text-edi-black rounded-none font-sans text-xs uppercase tracking-wider hover:bg-edi-black hover:text-white transition-all font-semibold"
                >
                  View All Experience &rarr;
                </Link>
              </div>
            </div>

            {/* Right side rows */}
            <div className="lg:col-span-8 w-full flex flex-col border-t border-edi-border/60 font-sans">
              {experience.slice(0, 4).map((item) => (
                <Link 
                  key={item.id} 
                  to="/experience"
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-edi-border/60 hover:bg-edi-light-cream/45 hover:px-4 transition-all duration-300"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">{item.dateRange}</span>
                    <h3 className="font-serif text-card-headline text-edi-heading group-hover:text-edi-accent transition-colors">
                      {item.role}
                    </h3>
                    <span className="text-xs text-edi-muted uppercase tracking-wider font-semibold">{item.organisation}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <span className="text-xs font-bold text-edi-accent group-hover:translate-x-1 transition-transform block">
                      Read Details
                    </span>
                    <span className="text-edi-accent group-hover:translate-x-1 transition-transform block">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>


        {/* 6. AWARDS AND RECOGNITION */}
        <section id="awards" className="py-24 md:py-32 bg-edi-light-cream border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left featured image column */}
            <div className="lg:col-span-5 select-none relative">
              <div className="absolute top-4 -left-4 w-12 h-16 bg-edi-accent/15 z-0"></div>
              <div className="aspect-[4/5] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-none shadow-sm">
                <img
                  src={profile.images.awardFeatured}
                  alt="National Youth Icon Award ceremony"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
              <span className="absolute -top-6 -right-6 text-edi-accent font-mono text-[10px] font-bold z-20">07 / AWARDS</span>
            </div>

            {/* Right list column */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="text-section-label text-edi-accent font-bold block">
                RECOGNITION
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading mb-4">
                National Awards & Civilian Honors
              </h2>
              
              <div className="flex flex-col border-t border-edi-border/60 font-sans">
                {awards.slice(0, 4).map((award, index) => (
                  <div 
                    key={index}
                    className="py-6 border-b border-edi-border/60 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline"
                  >
                    <div className="sm:col-span-2 text-lg font-serif italic text-edi-accent font-bold">
                      {award.year}
                    </div>
                    <div className="sm:col-span-10 flex flex-col gap-1">
                      <h3 className="font-serif text-card-headline text-edi-heading">
                        {award.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-edi-accent-dark">{award.issuer}</span>
                      <p className="text-xs text-edi-body leading-relaxed mt-1 font-medium">{award.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* 7. FEATURED PROJECTS SECTION */}
        <section id="featured-projects" className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-16">
              <div>
                <span className="text-section-label text-edi-accent font-bold block mb-3">08 / INITIATIVES</span>
                <h2 className="font-serif text-section-headline text-edi-heading">
                  Featured Projects
                </h2>
              </div>
              <Link 
                to="/projects"
                className="font-sans text-xs uppercase tracking-wider font-extrabold text-edi-accent hover:text-edi-accent-dark underline underline-offset-4 decoration-1"
              >
                View All Projects &rarr;
              </Link>
            </div>

            {/* Grid details (asymmetrical pattern) */}
            <div className="flex flex-col gap-20 font-sans">
              
              {/* Project 1: Image left, text right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-7 group aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm select-none">
                  <img
                    src={caseStudies[0].image}
                    alt={caseStudies[0].title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                  <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">PROJECT 01 &mdash; {caseStudies[0].organisation}</span>
                  <h3 className="font-serif text-card-headline text-edi-heading">
                    {caseStudies[0].title}
                  </h3>
                  <p className="text-editorial-body text-edi-body font-medium">
                    {caseStudies[0].problem}
                  </p>
                  <div className="mt-4">
                    <Link to="/projects" className="text-xs font-bold text-edi-accent hover:text-edi-accent-dark uppercase tracking-wider block underline underline-offset-4 decoration-1">
                      View details &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Project 2: Text left, image right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-5 flex flex-col gap-4 text-left order-2 lg:order-none">
                  <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">PROJECT 02 &mdash; {caseStudies[1].organisation}</span>
                  <h3 className="font-serif text-card-headline text-edi-heading">
                    {caseStudies[1].title}
                  </h3>
                  <p className="text-editorial-body text-edi-body font-medium">
                    {caseStudies[1].problem}
                  </p>
                  <div className="mt-4">
                    <Link to="/projects" className="text-xs font-bold text-edi-accent hover:text-edi-accent-dark uppercase tracking-wider block underline underline-offset-4 decoration-1">
                      View details &rarr;
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 group aspect-[16/10] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm order-1 lg:order-none select-none">
                  <img
                    src={caseStudies[1].image}
                    alt={caseStudies[1].title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Project 3: Full width image with content block below */}
              <div className="flex flex-col gap-8">
                <div className="group aspect-[21/9] overflow-hidden border border-edi-border bg-edi-cream relative rounded-none shadow-sm select-none">
                  <img
                    src={caseStudies[2].image}
                    alt={caseStudies[2].title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 bg-edi-warm-light border border-edi-border p-8 rounded-none">
                  <div className="flex flex-col gap-2 max-w-xl text-left">
                    <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">PROJECT 03 &mdash; {caseStudies[2].organisation}</span>
                    <h3 className="font-serif text-card-headline text-edi-heading">
                      {caseStudies[2].title}
                    </h3>
                    <p className="text-xs text-edi-body leading-relaxed mt-2 font-medium">
                      {caseStudies[2].problem}
                    </p>
                  </div>
                  <Link to="/projects" className="text-xs font-bold text-edi-accent hover:text-edi-accent-dark uppercase tracking-wider block underline underline-offset-4 decoration-1 mt-2 shrink-0">
                    View Project Case &rarr;
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 8. VISUAL JOURNEY / GALLERY COLLAGE */}
        <section id="gallery-preview" className="py-24 md:py-32 bg-edi-cream border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-16">
              <div>
                <span className="text-section-label text-edi-accent font-bold block mb-3">09 / PRESS GALLERY</span>
                <h2 className="font-serif text-section-headline text-edi-heading">
                  Visual Journey
                </h2>
              </div>
              <Link 
                to="/projects"
                className="font-sans text-xs uppercase tracking-wider font-extrabold text-edi-accent hover:text-edi-accent-dark underline underline-offset-4 decoration-1"
              >
                View Full Gallery &rarr;
              </Link>
            </div>

            {/* Collage Layout: 1 tall, 2 landscape, 1 medium, 1 wide */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch font-sans select-none">
              
              {/* Tall Image (left, 4 cols) */}
              <button 
                onClick={() => openLightbox(gallery[12], 12)}
                className="md:col-span-4 group flex flex-col bg-edi-warm-light border border-edi-border p-3 hover:shadow-md transition-shadow text-left rounded-none h-full"
                aria-label={`View image: ${gallery[12].caption}`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden border border-edi-border bg-edi-cream relative mb-3">
                  <img
                    src={gallery[12].image}
                    alt={gallery[12].caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-edi-black/5 pointer-events-none"></div>
                </div>
                <p className="text-[10px] text-edi-heading font-semibold leading-relaxed line-clamp-2">
                  {gallery[12].caption}
                </p>
              </button>

              {/* Landscape & Medium block (center/right, 8 cols) */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Image 2 (landscape) */}
                  <button 
                    onClick={() => openLightbox(gallery[1], 1)}
                    className="group flex flex-col bg-edi-warm-light border border-edi-border p-3 hover:shadow-md transition-shadow text-left rounded-none"
                    aria-label={`View image: ${gallery[1].caption}`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border border-edi-border bg-edi-cream relative mb-3">
                      <img
                        src={gallery[1].image}
                        alt={gallery[1].caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-edi-black/5 pointer-events-none"></div>
                    </div>
                    <p className="text-[10px] text-edi-heading font-semibold leading-relaxed line-clamp-2">
                      {gallery[1].caption}
                    </p>
                  </button>

                  {/* Image 3 (landscape) */}
                  <button 
                    onClick={() => openLightbox(gallery[2], 2)}
                    className="group flex flex-col bg-edi-warm-light border border-edi-border p-3 hover:shadow-md transition-shadow text-left rounded-none"
                    aria-label={`View image: ${gallery[2].caption}`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border border-edi-border bg-edi-cream relative mb-3">
                      <img
                        src={gallery[2].image}
                        alt={gallery[2].caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-edi-black/5 pointer-events-none"></div>
                    </div>
                    <p className="text-[10px] text-edi-heading font-semibold leading-relaxed line-clamp-2">
                      {gallery[2].caption}
                    </p>
                  </button>
                </div>

                {/* Wide Image */}
                <button 
                  onClick={() => openLightbox(gallery[3], 3)}
                  className="group flex flex-col bg-edi-warm-light border border-edi-border p-3 hover:shadow-md transition-shadow text-left rounded-none"
                  aria-label={`View image: ${gallery[3].caption}`}
                >
                  <div className="aspect-[21/9] w-full overflow-hidden border border-edi-border bg-edi-cream relative mb-3">
                    <img
                      src={gallery[3].image}
                      alt={gallery[3].caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-edi-black/5 pointer-events-none"></div>
                  </div>
                  <p className="text-[10px] text-edi-heading font-semibold leading-relaxed">
                    {gallery[3].caption}
                  </p>
                </button>
              </div>

            </div>
          </div>
        </section>


        {/* 9. TESTIMONIAL PRESERVED QUOTE SECTION */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-24 bg-edi-black text-edi-cream p-6 sm:p-12 text-center w-full border-b border-edi-border/10">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-edi-accent block">TESTIMONY</span>
              <p className="font-serif text-3xl sm:text-4xl italic leading-relaxed text-white font-light">
                "{testimonials[0].quote}"
              </p>
              <div className="font-sans text-xs tracking-wider uppercase text-edi-accent mt-2 font-bold">
                &mdash; {testimonials[0].author}, <span className="text-edi-cream/65 font-medium">{testimonials[0].designation} ({testimonials[0].company})</span>
              </div>
            </div>
          </section>
        )}


        {/* 10. FINAL CONTACT CTA */}
        <section id="contact-cta" className="py-24 bg-edi-warm-light w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left side (large serif heading) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-section-label text-edi-accent font-bold block">LET'S CONNECT</span>
              <h2 className="font-serif font-light text-edi-heading text-section-headline">
                Let's create meaningful public impact.
              </h2>
            </div>

            {/* Right side (short paragraph and contact button) */}
            <div className="lg:col-span-5 flex flex-col gap-6 items-start font-sans">
              <p className="text-editorial-body text-edi-body font-medium">
                Available for public system strategy design, solid waste management (SWM) consultations, climate workshops, and municipal advisory boards.
              </p>
              <div className="flex flex-wrap gap-4 w-full">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-edi-black text-edi-cream border border-edi-black text-xs font-semibold uppercase tracking-[0.18em] rounded-none hover:bg-transparent hover:text-edi-black transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-edi-accent"
                >
                  Contact Me
                </Link>
                <a
                  href={`mailto:${profile.email}`}
                  className="px-8 py-4 bg-transparent text-edi-black border border-edi-border text-xs font-semibold uppercase tracking-[0.18em] rounded-none hover:bg-edi-black hover:text-white transition-all duration-300 focus:outline-none"
                >
                  Email Directly
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-edi-black/95 z-[99999] flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-edi-cream hover:text-white font-sans text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-edi-accent p-2"
            onClick={() => setSelectedImage(null)}
          >
            Close ×
          </button>
          
          <div 
            className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center mb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image} 
              alt={selectedImage.caption} 
              className="max-w-full max-h-[75vh] object-contain border border-edi-border/10 shadow-2xl"
            />
          </div>

          <div 
            className="text-center max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm sm:text-base font-serif italic text-edi-cream leading-relaxed">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
