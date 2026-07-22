import React, { useState, useEffect, useRef } from 'react';

const ImpactStatistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[#FFFFFF] border-t border-[#DDD7CE]/60 w-full relative overflow-hidden">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#A84F43_1.5px,transparent_1.5px)] [background-size:24px_24px]" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-3 text-left max-w-2xl mb-14">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#A84F43] rounded-full animate-pulse"></span>
            <span className="text-section-label text-[#A84F43] font-bold uppercase tracking-widest text-xs">
              PROGRAM IMPACT GRAPH & ANALYTICS
            </span>
          </div>
          <h2 className="font-serif text-section-headline text-[#181818] leading-tight">
            Animated Performance Graphs
          </h2>
          <p className="text-editorial-body text-[#5F5F5F] font-sans font-medium text-sm">
            Quantifiable public sanitation metrics, Swachh Survekshan rankings, and environmental education growth charts.
          </p>
        </div>


        {/* ANIMATED GRAPH DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* GRAPH 1: SWACHH SURVEKSHAN RANKING TURNAROUND (ANIMATED BAR) */}
          <div className="lg:col-span-7 bg-[#F8F6F1] border-2 border-[#111111] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-md relative group">
            <div className="flex items-center justify-between border-b border-[#DDD7CE] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A84F43] font-bold">GRAPH 01 &mdash; RANKING METRIC</span>
                <h3 className="font-serif text-2xl font-bold text-[#181818] mt-1">Swachh Survekshan Turnaround</h3>
              </div>
              <span className="px-3 py-1 bg-[#2D5A27] text-white font-mono text-xs font-bold rounded-none">
                TOP 4 NATIONAL
              </span>
            </div>

            <p className="text-xs text-[#5F5F5F] font-medium leading-relaxed">
              Guntur Municipal Corporation national cleanliness rank turnaround from baseline Rank 121 to Rank 4th Nationally through systematic IEC, SWM, and citizen campaigns.
            </p>

            {/* Ranking Progress Bar Graph */}
            <div className="flex flex-col gap-4 my-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#181818]">
                <span>BASELINE: RANK 121</span>
                <span className="text-[#A84F43]">PEAK: RANK 4TH NATIONALLY</span>
              </div>

              <div className="w-full h-8 bg-[#DDD7CE]/60 relative overflow-hidden rounded-none p-1 border border-[#DDD7CE]">
                <div 
                  className="h-full bg-gradient-to-r from-[#A84F43] via-[#A98760] to-[#2D5A27] transition-all duration-1000 ease-out flex items-center justify-end pr-3 text-white text-[11px] font-mono font-bold"
                  style={{ width: isVisible ? '96%' : '0%' }}
                >
                  {isVisible ? 'RANK 4 / 4,300+ CITIES' : ''}
                </div>
              </div>

              <div className="grid grid-cols-4 text-[10px] font-mono text-[#5F5F5F] pt-1 border-t border-[#DDD7CE]/50">
                <div>Rank 121 (Start)</div>
                <div className="text-center">Rank 50</div>
                <div className="text-center">Rank 15</div>
                <div className="text-right font-bold text-[#2D5A27]">Rank 4 (National)</div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#806346] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2D5A27] rounded-full"></span>
              <span>Verified MoHUA Swachh Survekshan Audit Result</span>
            </div>
          </div>


          {/* GRAPH 2: YELP STUDENT OUTREACH (VERTICAL COLUMN CHART) */}
          <div className="lg:col-span-5 bg-[#F8F6F1] border-2 border-[#111111] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-md relative group">
            <div className="flex items-center justify-between border-b border-[#DDD7CE] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A84F43] font-bold">GRAPH 02 &mdash; YELP GROWTH</span>
                <h3 className="font-serif text-2xl font-bold text-[#181818] mt-1">50,000+ Students Trained</h3>
              </div>
            </div>

            {/* Vertical Bar Growth Chart */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#DDD7CE]">
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                <span className="text-[10px] font-mono font-bold text-[#5F5F5F]">5K</span>
                <div 
                  className="w-full bg-[#DDD7CE] group-hover/bar:bg-[#A84F43] transition-all duration-700"
                  style={{ height: isVisible ? '20%' : '0%' }}
                />
                <span className="text-[9px] font-mono text-[#5F5F5F]">Ph 1</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                <span className="text-[10px] font-mono font-bold text-[#5F5F5F]">15K</span>
                <div 
                  className="w-full bg-[#A98760] group-hover/bar:bg-[#A84F43] transition-all duration-700"
                  style={{ height: isVisible ? '45%' : '0%' }}
                />
                <span className="text-[9px] font-mono text-[#5F5F5F]">Ph 2</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                <span className="text-[10px] font-mono font-bold text-[#5F5F5F]">32K</span>
                <div 
                  className="w-full bg-[#806346] group-hover/bar:bg-[#A84F43] transition-all duration-700"
                  style={{ height: isVisible ? '70%' : '0%' }}
                />
                <span className="text-[9px] font-mono text-[#5F5F5F]">Ph 3</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                <span className="text-[10px] font-mono font-bold text-[#A84F43]">50K+</span>
                <div 
                  className="w-full bg-[#A84F43] transition-all duration-700"
                  style={{ height: isVisible ? '100%' : '0%' }}
                />
                <span className="text-[9px] font-mono font-bold text-[#181818]">Target</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#5F5F5F]">
              <span>500+ Govt Schools</span>
              <span className="font-bold text-[#A84F43]">100+ Colleges</span>
            </div>
          </div>


          {/* GRAPH 3: DUAL METRIC COMPARISON (STACKED PROGRESS BARS) */}
          <div className="lg:col-span-6 bg-[#F8F6F1] border-2 border-[#111111] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-md relative group">
            <div className="flex items-center justify-between border-b border-[#DDD7CE] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A84F43] font-bold">GRAPH 03 &mdash; PUBLIC REACH</span>
                <h3 className="font-serif text-2xl font-bold text-[#181818] mt-1">2.2 Million+ Citizens Impacted</h3>
              </div>
            </div>

            <div className="flex flex-col gap-5 my-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>Municipal SWM Coverage (Guntur, Nellore, RJY, GHMC)</span>
                  <span className="text-[#A84F43]">2.2M Citizens</span>
                </div>
                <div className="w-full h-4 bg-[#DDD7CE]/60 overflow-hidden border border-[#DDD7CE]">
                  <div 
                    className="h-full bg-[#A84F43] transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '100%' : '0%' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>Community Outreach & IEC Campaign Hours</span>
                  <span className="text-[#806346]">2,080+ Hours</span>
                </div>
                <div className="w-full h-4 bg-[#DDD7CE]/60 overflow-hidden border border-[#DDD7CE]">
                  <div 
                    className="h-full bg-[#806346] transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '88%' : '0%' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>Active Municipal Corporations Served</span>
                  <span className="text-[#2D5A27]">4 Corporations</span>
                </div>
                <div className="w-full h-4 bg-[#DDD7CE]/60 overflow-hidden border border-[#DDD7CE]">
                  <div 
                    className="h-full bg-[#2D5A27] transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? '80%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#806346] font-semibold">
              Source: Municipal Health & SWM Department Progress Audits
            </div>
          </div>


          {/* GRAPH 4: TIMELINE PROGRESSION SPARKLINE CHART */}
          <div className="lg:col-span-6 bg-[#F8F6F1] border-2 border-[#111111] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-md relative group">
            <div className="flex items-center justify-between border-b border-[#DDD7CE] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A84F43] font-bold">GRAPH 04 &mdash; EXPERIENCE SPARKLINE</span>
                <h3 className="font-serif text-2xl font-bold text-[#181818] mt-1">9+ Years Active Leadership</h3>
              </div>
              <span className="px-3 py-1 bg-[#111111] text-white font-mono text-xs font-bold">
                2016 &mdash; 2026
              </span>
            </div>

            <div className="relative w-full h-36 flex items-center justify-center my-2">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <line x1="0" y1="30" x2="400" y2="30" stroke="#DDD7CE" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="#DDD7CE" strokeWidth="1" strokeDasharray="4 4" />

                <path
                  d="M 20 100 L 110 75 L 200 45 L 290 30 L 380 15"
                  fill="none"
                  stroke="#A84F43"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="500"
                  strokeDashoffset={isVisible ? '0' : '500'}
                  className="transition-all duration-1200 ease-out"
                />

                <circle cx="20" cy="100" r="5" fill="#111111" />
                <circle cx="110" cy="75" r="5" fill="#806346" />
                <circle cx="200" cy="45" r="5" fill="#A98760" />
                <circle cx="290" cy="30" r="5" fill="#A84F43" />
                <circle cx="380" cy="15" r="6" fill="#2D5A27" className="animate-ping" />
                <circle cx="380" cy="15" r="6" fill="#2D5A27" />
              </svg>
            </div>

            <div className="grid grid-cols-4 text-[10px] font-mono text-[#5F5F5F] pt-2 border-t border-[#DDD7CE]">
              <div>2016: Wipro & Accenture</div>
              <div className="text-center">2019: Climate Council</div>
              <div className="text-center">2021: Municipal IEC</div>
              <div className="text-right font-bold text-[#A84F43]">2026: Lead Consultant</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ImpactStatistics;
