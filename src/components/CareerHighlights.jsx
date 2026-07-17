import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { getHighlights } from '../services/portfolioService';

import ExpandableSection from './ExpandableSection';

const CareerHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await getHighlights();
        setHighlights(data);
      } catch (err) {
        console.warn("Failed to load career highlights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName] || FaIcons.FaRegCheckCircle;
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  const renderHighlightItem = (item, idx) => (
    <div 
      key={item.id || idx}
      className="bg-white/5 hover:bg-white/10 rounded-3xl p-8 border border-white/5 hover:border-secondary/40 shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 group hover:-translate-y-1 h-full"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
          {renderIcon(item.icon)}
        </div>
        {item.year && (
          <span className="text-[10px] font-black uppercase tracking-wider font-mono px-2.5 py-1 bg-white/10 text-white/60 rounded-full">
            {item.year}
          </span>
        )}
      </div>

      <h3 className="text-white font-black text-base md:text-lg leading-snug tracking-tight group-hover:text-secondary transition-colors duration-300">
        {item.headline}
      </h3>
    </div>
  );

  return (
    <section id="highlights" className="py-24 bg-charcoal relative overflow-hidden font-sans border-b border-white/5">
      {/* Dynamic background highlight spots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,#9C3205_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-secondary text-xs font-black tracking-widest uppercase">
            Milestones
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 tracking-tight animate-pulse">
            Career Highlights
          </h2>
          <p className="text-white/60 text-sm mt-4 font-medium leading-relaxed">
            Key professional accolades, project landmarks, and educational distinctions.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-8 border border-white/5 animate-pulse h-36" />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up">
            <ExpandableSection
              items={highlights}
              limit={3}
              buttonLabelSingle="Milestones"
              renderItem={renderHighlightItem}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CareerHighlights;
