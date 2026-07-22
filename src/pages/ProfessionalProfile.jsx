import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';
import PageAtmosphere from '../components/PageAtmosphere';
import ProfileStorySection from '../components/ProfileStorySection';
import { portfolioData } from '../data/portfolioData';
import { getAboutContent, getDevelopment } from '../services/portfolioService';

const ProfessionalProfile = () => {
  const [profile] = useState(portfolioData.profile);
  const [development, setDevelopment] = useState(portfolioData.development);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [storyImages, setStoryImages] = useState({
    story1: portfolioData.profile.images.aboutStack,
    story2: portfolioData.profile.images.profileAlt,
    story3: portfolioData.profile.images.heroPortrait
  });

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
        const dbAbout = await getAboutContent();
        const devList = await getDevelopment();

        if (dbAbout) {
          setStoryImages({
            story1: dbAbout.story1Image || portfolioData.profile.images.aboutStack,
            story2: dbAbout.story2Image || portfolioData.profile.images.profileAlt,
            story3: dbAbout.story3Image || portfolioData.profile.images.heroPortrait
          });
        }

        if (devList && devList.length > 0) {
          setDevelopment(devList.map(d => ({
            id: d.id,
            year: d.year,
            program: d.program,
            institution: d.institution,
            description: d.description
          })).sort((a, b) => b.order - a.order));
        }
      } catch (error) {
        console.warn("Failed to load profile page dynamic data", error);
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

  // Scroll Entrance IntersectionObserver
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

  // Story 1: Foundation & Education
  const story1Paragraphs = [
    "Graduated as a Gold Medallist in Electrical & Electronics Engineering (EEE) from Tirumala Engineering College, Narasaraopet, presenting over 21 technical research papers at prestigious academic forums including BITS Pilani, JNTUH, and Anna University.",
    "His technical research and academic rigor laid the initial analytical foundation for solving complex engineering and municipal systems problems. This early commitment to excellence earned him national recognition, including invitations to national forums in Delhi and speaker sessions at the India Circular Economy Forum 2024."
  ];

  // Story 2: Corporate Leadership
  const story2Paragraphs = [
    "JSR Annamayya built his early career in corporate software operations at Accenture and Wipro (2016–2019) as a Quality Team Lead and Special Project Area Lead.",
    "At Wipro and Accenture, he spearheaded operational workflows and technical quality assurance for Silicon Valley enterprise clients, including Google and Uber. Directing an 80+ member engineering team, he developed deep expertise in large-scale delivery, data tracking, process optimization, and team leadership before transitioning full-time into public service governance."
  ];

  // Story 3: Public Impact & Innovation
  const story3Paragraphs = [
    "Since transitioning to public systems governance, JSR Annamayya has driven extensive solid waste management (SWM) campaigns and Behaviour Change Communication (BCC/IEC) programs across municipal corporations in Andhra Pradesh and Telangana, including Guntur, Rajamahendravaram, Nellore, and Greater Hyderabad Municipal Corporation (GHMC).",
    "He played a key role in elevating Guntur's national Swachh Survekshan ranking from 121 to 4th nationally, conceptualised the \"Any Time Bag\" (ATB) solar-powered cloth bag vending machine recognised by UNDP, and guided state-level environmental initiatives like the Young Earth Leaders Program (YELP), training 50,000+ students across 500+ government schools. For his public service, he received the Vande Bharat Puraskar in 2023, National Youth Icon Award in 2022, and Indian Star Icon Award in 2021."
  ];

  return (
    <div className={`bg-[#F8F6F1] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased relative ${heroLoaded ? 'hero-loaded' : ''}`}>
      <Navbar />

      <main className="flex-grow w-full relative site-main">

        {/* 1. HERO HEADER WITH ANIMATED 2D EDITORIAL ACCENTS */}
        <section className="bg-[#F8F6F1] pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60 overflow-hidden">
          
          {/* Background Soft Blob */}
          <div ref={blobRef} className="hero-soft-blob" />

          {/* Page Atmosphere 2D Accents */}
          <PageAtmosphere variant="profile" />

          <div className="flex flex-col gap-4 text-left relative z-10 max-w-3xl">
            <div className="mb-2 text-section-label text-edi-muted">
              <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Professional Profile</span>
            </div>
            
            <span className="text-section-label text-[#A84F43] font-bold block tracking-widest uppercase">
              JSR ANNAMAYYA
            </span>
            
            <h1 className="font-serif font-light text-edi-heading text-inner-headline">
              <div className="reveal-line">
                <span>PROFESSIONAL PROFILE</span>
              </div>
            </h1>
            
            <p className="text-editorial-body text-edi-body font-medium max-w-2xl hero-description hero-description-1">
              An editorial survey of technical foundation, corporate operations leadership, and state-wide public systems impact across Andhra Pradesh and Telangana.
            </p>
          </div>

          {/* Animated Decorative Striped Circle */}
          <div ref={stripedCircleRef} className="decorative-striped-circle" />

          {/* Animated Decorative Dotted Circle */}
          <div ref={dottedCircleRef} className="decorative-dotted-circle">
            <div className="dotted-circle-inner" />
          </div>
        </section>


        {/* 2. THREE EDITORIAL STORY SECTIONS WITH SCROLL REVEALS */}
        
        {/* STORY 1: Foundation & Education */}
        <div className="reveal-section relative">
          <ProfileStorySection
            number="01"
            title="Foundation & Education"
            quote="Academic rigor and technical research form the analytical backbone of public systems engineering."
            paragraphs={story1Paragraphs}
            highlights={["B.Tech EEE Gold Medalist", "21+ Technical Research Papers", "BITS Pilani & JNTUH Keynotes"]}
            image={storyImages.story1}
            imageAlt="Foundation and Education - Tirumala Engineering College Gold Medalist"
            imagePosition="left"
            variant="square-gallery"
          />
        </div>

        {/* STORY 2: Corporate Leadership */}
        <div className="reveal-section relative">
          <ProfileStorySection
            number="02"
            title="Corporate Leadership"
            quote="Managing 80+ engineers for Silicon Valley enterprise clients built the operational discipline required for municipal governance."
            paragraphs={story2Paragraphs}
            highlights={["Accenture & Wipro Lead", "80+ Member Operations Team", "Google & Uber Client Delivery"]}
            image={storyImages.story2}
            imageAlt="Corporate Leadership - Wipro and Accenture Quality Lead"
            imagePosition="right"
            variant="diagonal-arch"
          />
        </div>

        {/* STORY 3: Public Impact & Innovation */}
        <div className="reveal-section relative">
          <ProfileStorySection
            number="03"
            title="Public Impact & Innovation"
            quote="Public systems succeed when behaviour change communication turns compliance into active citizen ownership."
            paragraphs={story3Paragraphs}
            highlights={["Swachh Survekshan Rank 4", "UNDP Recognized ATB Vending", "50,000+ Young Earth Leaders", "Vande Bharat Puraskar"]}
            image={storyImages.story3}
            imageAlt="Public Impact and Innovation - SWM, IEC, Any Time Bag"
            imagePosition="left"
            variant="top-arch"
          />
        </div>


        {/* 3. CORE STRENGTHS HIGHLIGHTS */}
        <section className="reveal-section py-24 bg-[#FFFFFF] border-b border-[#DDD7CE]/60 w-full relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-10 text-left">
            <div>
              <span className="text-section-label text-[#A84F43] font-bold block mb-2">COMPETENCIES</span>
              <h2 className="font-serif text-section-headline text-edi-heading">Core Strengths</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {profile.strengths.map((str, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-[#F8F6F1] border border-[#DDD7CE] hover:border-[#A84F43] transition-colors flex flex-col justify-between gap-3 group shadow-sm"
                >
                  <span className="font-mono text-[10px] text-[#A84F43] font-bold">0{idx + 1}</span>
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#181818] group-hover:text-[#A84F43] transition-colors leading-snug">
                    {str}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 4. ONGOING DEVELOPMENT */}
        <section className="reveal-section py-24 md:py-32 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-left relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-section-label text-[#A84F43] font-bold block">
                04 / DEVELOPMENT
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Ongoing Development
              </h2>
              <p className="text-editorial-body text-edi-body font-sans mt-2 max-w-xs font-medium">
                National panels, capacity-building workshops, and academic keynote presentations.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 font-sans">
              {development.map((item, idx) => (
                <div key={item.id || idx} className="p-6 bg-[#FFFFFF] border border-[#DDD7CE] hover:border-[#A84F43] transition-colors flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#A84F43] font-bold uppercase">{item.year}</span>
                    <span className="text-[10px] font-mono text-edi-muted uppercase tracking-wider">{item.institution}</span>
                  </div>
                  <h4 className="font-serif text-card-headline text-edi-heading">{item.program}</h4>
                  <p className="text-xs sm:text-sm text-edi-body font-medium leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* 5. TESTIMONIALS & RECOGNITION */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalProfile;
