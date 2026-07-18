import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortraitFrame from '../components/PortraitFrame';
import RotatingResumeBadge from '../components/RotatingResumeBadge';
import VisionSection from '../components/VisionSection';
import SkillsSection from '../components/SkillsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { getHeroContent, getAboutContent, getHeroSlides } from '../services/portfolioService';
import { portfolioData } from '../data/portfolioData';

const Home = () => {
  const [profile, setProfile] = useState(portfolioData.profile);
  const [heroSlides, setHeroSlides] = useState(portfolioData.heroSlides);
  const [activeSlide, setActiveSlide] = useState(0);

  // Load dynamic data on mount
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const heroData = await getHeroContent();
        const aboutData = await getAboutContent();
        const slides = await getHeroSlides();

        setProfile((prev) => ({
          ...prev,
          designation: heroData.title || prev.designation,
          images: {
            ...prev.images,
            heroPortrait: heroData.imageUrl || prev.images.heroPortrait,
            profileAlt: aboutData.imageUrl || prev.images.profileAlt,
          },
          bio: {
            ...prev.bio,
            intro: aboutData.intro || prev.bio.intro,
            bio1: heroData.introText || prev.bio.bio1,
            bio2: aboutData.eduBio || prev.bio.bio2,
            bio3: aboutData.corporateBio || prev.bio.bio3,
          },
          strengths: aboutData.strengths || prev.strengths,
        }));

        if (slides && slides.length > 0) {
          setHeroSlides(slides.map((s, idx) => ({
            id: s.id || `h${idx + 1}`,
            headline: s.headline,
            subtext: s.subtext,
            order: s.order || idx + 1
          })));
        }
      } catch (error) {
        console.warn("Failed to load home page dynamic data, using static fallback", error);
      }
    };
    loadDynamicData();
  }, []);

  // Auto transition hero slides slowly (every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);


  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* 1. HERO SECTION */}
        <section id="hero" className="min-h-[calc(100vh-90px)] flex items-center pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center w-full">
            
            {/* Left Column (47% width) */}
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
                  className="px-8 py-4 bg-transparent text-edi-black border border-edi-black text-xs font-semibold uppercase tracking-[0.1em] rounded-[4px] hover:bg-edi-black hover:text-white transition-all duration-300 focus:outline-none"
                >
                  CONTACT
                </Link>
                <Link
                  to="/professional-profile"
                  className="px-8 py-4 bg-transparent text-edi-black border border-edi-border text-xs font-semibold uppercase tracking-[0.1em] rounded-[4px] hover:bg-edi-black hover:text-white transition-all duration-300 focus:outline-none"
                >
                  VIEW PROFILE
                </Link>
              </div>
            </div>

            {/* Right Column (53% width) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <PortraitFrame src={profile.images.heroPortrait} alt={`${profile.name} Portrait`} />
              
              {/* Rotating CV Badge overlapping lower section of the portrait */}
              <RotatingResumeBadge className="absolute -bottom-8 right-0 sm:right-6 lg:-right-6 z-20 shadow-xl" />
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
                  className="inline-block px-8 py-4 bg-transparent text-edi-black border border-edi-black rounded-[4px] hover:bg-edi-black hover:text-white font-sans text-xs uppercase tracking-wider transition-all duration-300 font-semibold"
                >
                  VIEW MORE &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* 3. VISION & LEADERSHIP SECTION (VisionSection Component) */}
        <VisionSection />


        {/* 4. SKILLS SECTION (SkillsSection Component) */}
        <SkillsSection />


        {/* 5. TESTIMONIALS & RECOGNITION SECTION (TestimonialsSection Component) */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default Home;
