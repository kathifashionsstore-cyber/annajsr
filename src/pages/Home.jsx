import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisionSection from '../components/VisionSection';
import SkillsSection from '../components/SkillsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PageAtmosphere from '../components/PageAtmosphere';
import { getHeroContent, getAboutContent } from '../services/portfolioService';
import { portfolioData } from '../data/portfolioData';

const Home = () => {
  const [profile, setProfile] = useState(portfolioData.profile);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Parallax refs for requestAnimationFrame pointer updates
  const blobRef = useRef(null);
  const stripedCircleRef = useRef(null);
  const dottedCircleRef = useRef(null);
  const portraitRef = useRef(null);
  const shapeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Trigger hero entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load dynamic data on mount
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const heroData = await getHeroContent();
        const aboutData = await getAboutContent();

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
      } catch (error) {
        console.warn("Failed to load home page dynamic data, using static fallback", error);
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
        blobRef.current.style.transform = `translate3d(${currentX * 5}px, ${currentY * 5}px, 0)`;
      }
      if (stripedCircleRef.current) {
        stripedCircleRef.current.style.transform = `scale(1) rotate(6deg) translate3d(${currentX * 9}px, ${currentY * 9}px, 0)`;
      }
      if (dottedCircleRef.current) {
        dottedCircleRef.current.style.transform = `translate3d(${currentX * 12}px, ${currentY * 12}px, 0)`;
      }
      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate3d(${currentX * 4}px, ${currentY * 4}px, 0)`;
      }
      if (shapeRef.current) {
        shapeRef.current.style.transform = `scale(1) translate3d(${currentX * -6}px, ${currentY * -6}px, 0)`;
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

  // Section Scroll Reveals (IntersectionObserver)
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

  return (
    <div className={`bg-[#FFFFFF] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased ${heroLoaded ? 'hero-loaded' : ''}`}>
      <Navbar />

      <main className="flex-grow w-full site-main">

        {/* 1. PORTRAIT-LED HOME HERO SECTION */}
        <section className="home-hero">
          {/* Pale Background Blob */}
          <div ref={blobRef} className="hero-soft-blob" />

          {/* Page Atmosphere 2D Accent Container */}
          <PageAtmosphere variant="home" />

          <div className="home-hero-container">
            
            {/* LEFT CONTENT SIDE */}
            <div className="home-hero-content">
              <h1>
                <span>HI, I’M</span>
                <strong>{profile.name}</strong>
              </h1>

              <div className="home-hero-copy">
                <p>
                  <strong>National Award-Winning Behaviour Change & IEC Specialist</strong> with <strong>9+ years</strong> building public sanitation systems, solid waste management campaigns, and environmental education networks across Andhra Pradesh & Telangana.
                </p>
                <p>
                  From corporate operations at <strong>Wipro and Accenture</strong> to municipal governance inside <strong>Guntur, Rajamahendravaram, Nellore, and Greater Hyderabad</strong> &mdash; bridging policy and grassroots human behaviour.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-8 z-10 relative">
                <Link to="/contact" className="hero-contact-button">
                  CONTACT
                </Link>
                <Link 
                  to="/professional-profile" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#111111] border border-[#111111] rounded-[4px] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-all duration-300"
                >
                  VIEW PROFILE
                </Link>
              </div>
            </div>

            {/* RIGHT PORTRAIT VISUAL SIDE */}
            <div className="home-hero-visual">
              <div ref={shapeRef} className="portrait-semicircle" />

              <img
                ref={portraitRef}
                src={profile.images.heroPortrait}
                alt="JSR Annamayya"
              />

              <div ref={stripedCircleRef} className="decorative-striped-circle" />

              <div ref={dottedCircleRef} className="decorative-dotted-circle">
                <div className="dotted-circle-inner" />
              </div>
            </div>

          </div>
        </section>


        {/* 2. PROFILE INTRODUCTION SECTION WITH CLIP REVEAL */}
        <section className="reveal-section py-24 md:py-32 bg-[#FFFFFF] border-y border-[#DDD7CE]/60 w-full relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Image with Clip-Path Reveal */}
            <div className="lg:col-span-5 relative group select-none">
              <div className="aspect-[4/5] w-full overflow-hidden border border-[#DDD7CE] bg-[#F8F6F1] relative z-10 clip-reveal-left shadow-sm">
                <img
                  src="/1.webp"
                  alt={`${profile.name} In Action`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-6 -left-6 text-[#A84F43] font-mono text-[10px] font-bold z-20">01 / INTRO</div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left font-sans">
              <span className="text-section-label text-[#A84F43] font-bold block">
                JSR ANNAMAYYA
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                National Award-Winning Behaviour Change & IEC Specialist
              </h2>
              
              <div className="w-16 h-[1px] bg-[#A84F43] my-2"></div>
              
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
                  <span className="w-1.5 h-1.5 bg-[#A84F43] rounded-full"></span>
                  <span>9+ Years Active Public Systems & IEC Expert</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#A84F43] rounded-full"></span>
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


        {/* 3. VISION & LEADERSHIP SECTION */}
        <div className="reveal-section">
          <VisionSection />
        </div>


        {/* 4. SKILLS SECTION */}
        <div className="reveal-section">
          <SkillsSection />
        </div>


        {/* 5. TESTIMONIALS & RECOGNITION AUTO-SLIDER */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default Home;
