import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import JourneyTimeline from '../components/JourneyTimeline';
import VideoReels from '../components/VideoReels';
import Services from '../components/Services';
import Departments from '../components/Departments';
import CaseStudies from '../components/CaseStudies';
import CareerHighlights from '../components/CareerHighlights';
import ImpactAndAwards from '../components/ImpactAndAwards';
import Testimonials from '../components/Testimonials';
import ResumeSection from '../components/ResumeSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import FloatingActions from '../components/FloatingActions';
import ChatbotWidget from '../components/ChatbotWidget';
import { logAnalyticsEvent } from '../services/portfolioService';

const Home = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    // Detect basic device telemetry
    const userAgent = navigator.userAgent;
    let device = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(userAgent)) {
      device = 'Mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      device = 'Tablet';
    }
    
    let browser = 'Unknown';
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Edge") > -1) browser = "Edge";

    let os = 'Unknown';
    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
    else if (userAgent.indexOf("X11") > -1) os = "Linux";
    else if (userAgent.indexOf("Android") > -1) os = "Android";
    else if (userAgent.indexOf("iPhone") > -1) os = "iOS";

    logAnalyticsEvent({
      type: 'pageview',
      device,
      browser,
      os,
      url: window.location.href
    });
  }, []);

  return (
    <>
      <Preloader />
      <Navbar onGalleryClick={() => setIsGalleryOpen(true)} />
      <Hero isGalleryOpen={isGalleryOpen} setIsGalleryOpen={setIsGalleryOpen} />
      <About />
      <JourneyTimeline />
      <VideoReels />
      <Services />
      <Departments />
      <CaseStudies />
      <CareerHighlights />
      <ImpactAndAwards />
      <Testimonials />
      <ResumeSection />
      <Contact />
      <Footer />
      <FloatingActions />
      <ChatbotWidget />
      <MobileBottomNav onGalleryClick={() => setIsGalleryOpen(true)} />
    </>
  );
};

export default Home;
