import React, { useState, useEffect, useRef } from 'react';

const SkillRing = ({ label, targetPercentage, animate }) => {
  const [percentage, setPercentage] = useState(0);
  const radius = 38;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (animate) {
      // Smooth animation transition
      let start = 0;
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();

      const animateProgress = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        
        setPercentage(Math.floor(easeOutQuad * targetPercentage));

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };

      requestAnimationFrame(animateProgress);
    } else {
      setPercentage(0);
    }
  }, [animate, targetPercentage]);

  return (
    <div className="flex flex-col items-center gap-4 text-center font-sans">
      <div className="relative w-28 h-28 md:w-32 md:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background Track Stroke */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#DDD7CE"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring Stroke */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#A98760"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {/* Large Percentage in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-serif font-bold text-edi-heading">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-edi-heading max-w-[150px] leading-tight">
        {label}
      </span>
    </div>
  );
};

const SkillsSection = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

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

  const skillsData = [
    { label: "Behaviour Change Communication", target: 95 },
    { label: "IEC Strategy", target: 90 },
    { label: "Community Mobilisation", target: 92 },
    { label: "Program Leadership", target: 88 }
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 bg-edi-cream border-b border-edi-border/60 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Section Title and Description */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-edi-accent uppercase block">
            05 / EXPERTISE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-edi-heading leading-tight tracking-tight">
            Skills & Competencies
          </h2>
          <p className="text-sm text-edi-body leading-relaxed font-sans max-w-xs mt-2">
            A visual overview of core professional proficiencies applied across state-level campaigns, solid waste campaigns, and institutional environmental projects.
          </p>
        </div>

        {/* Right Side: Four ring charts */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {skillsData.map((skill, idx) => (
              <SkillRing
                key={idx}
                label={skill.label}
                targetPercentage={skill.target}
                animate={animate}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
