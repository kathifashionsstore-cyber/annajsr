import React, { useState, useEffect, useRef } from 'react';

const ProgressBar = ({ label, targetPercentage, animate }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      // Set to target width after a slight delay to trigger CSS transition
      const timer = setTimeout(() => {
        setWidth(targetPercentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(0);
    }
  }, [animate, targetPercentage]);

  return (
    <div className="flex flex-col gap-2.5 w-full font-sans select-none">
      <div className="flex justify-between items-baseline text-xs md:text-sm font-semibold text-edi-heading">
        <span className="uppercase tracking-wider">{label}</span>
        <span>{width}%</span>
      </div>
      
      {/* Horizontal Progress Track */}
      <div className="relative w-full h-[4px] bg-[#DDD7CE] rounded-none overflow-hidden">
        {/* Animated Progress Line */}
        <div 
          className="absolute top-0 left-0 h-full bg-[#111111] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] rounded-none"
          style={{ width: `${width}%` }}
        >
          {/* Optional Gold Endpoint */}
          <div className="absolute right-0 top-0 h-full w-[4px] bg-[#A98760]"></div>
        </div>
      </div>
    </div>
  );
};

import { getSkills } from '../services/portfolioService';

const SkillsSection = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);
  const [skillsData, setSkillsData] = useState([
    { label: "Behaviour Change Communication", target: 100 },
    { label: "IEC Strategy", target: 100 },
    { label: "Community Mobilisation", target: 100 },
    { label: "Program Leadership", target: 100 }
  ]);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const dbSkills = await getSkills();
        if (dbSkills && dbSkills.length > 0) {
          setSkillsData(dbSkills.map(s => ({
            label: s.label,
            target: s.targetPercentage !== undefined ? s.targetPercentage : (s.target || 100)
          })));
        }
      } catch (error) {
        console.warn("Failed to load skills dynamically", error);
      }
    };
    loadDynamicData();
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.1, triggerOnce: true }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);



  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F8F6F1] border-b border-[#DDD7CE] w-full"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Heading and Explanation (40% / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 text-left">
          <span className="text-section-label text-[#A98760] font-bold block">
            05 / EXPERTISE
          </span>
          <h2 className="font-serif text-section-headline text-[#181818] font-light leading-tight tracking-tight">
            Skills
          </h2>
          <p className="text-editorial-body text-[#5F5F5F] font-sans font-medium mt-2 max-w-sm">
            Proven competencies applied across public systems, waste campaigns, and institutional climate education programs in Andhra Pradesh and Telangana.
          </p>
        </div>

        {/* Right Column: Graphs (60% / 7 cols) */}
        <div className="lg:col-span-7 w-full flex flex-col gap-8 md:gap-9 py-2">
          {skillsData.map((skill, idx) => (
            <ProgressBar
              key={idx}
              label={skill.label}
              targetPercentage={skill.target}
              animate={animate}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
