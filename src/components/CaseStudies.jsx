import React, { useEffect, useState } from 'react';
import { getCaseStudies } from '../services/portfolioService';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaLightbulb, FaBullseye, FaDraftingCompass, FaCogs, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import ExpandableSection from './ExpandableSection';

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStudy, setActiveStudy] = useState(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const data = await getCaseStudies();
        setCaseStudies(data);
      } catch (err) {
        console.warn("Failed to load case studies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudies();
  }, []);

  const renderCaseStudyItem = (study, idx) => (
    <div 
      key={study.id || idx}
      className="bg-offwhite rounded-[2rem] border border-gray-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
    >
      {study.coverImage && (
        <div className="aspect-[21/9] w-full overflow-hidden bg-gray-55 border-b border-gray-100">
          <img 
            src={study.coverImage} 
            alt={study.title} 
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105" 
          />
        </div>
      )}
      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tags?.map((tag, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-xl md:text-2xl font-black text-charcoal tracking-tight group-hover:text-primary transition-colors duration-300">
            {study.title}
          </h3>
          
          {/* Metadata indicators */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutraltext mt-4">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-primary/70" />
              {study.organisation}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-primary/70" />
              {study.dateRange}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <button 
            onClick={() => setActiveStudy(study)}
            className="px-5 py-2.5 rounded-full bg-charcoal text-white hover:bg-primary font-bold text-xs transition-all shadow-md hover:shadow-lg"
          >
            Read Implementation Details
          </button>
          <span className="text-[10px] font-black text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="case-studies" className="py-24 bg-white relative overflow-hidden font-sans border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-primary text-xs font-black tracking-widest uppercase bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            Case Studies
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mt-4 tracking-tight">
            Governance in Action
          </h2>
          <p className="text-neutraltext text-sm md:text-base mt-4 font-medium leading-relaxed">
            Detailed breakdowns of public policy implementation, communication strategies, and environmental campaign outcomes.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-offwhite rounded-[2rem] p-8 border border-gray-100 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up">
            <ExpandableSection
              items={caseStudies}
              limit={3}
              buttonLabelSingle="Case Studies"
              renderItem={renderCaseStudyItem}
              gridClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
            />
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {activeStudy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-offwhite border-b border-gray-100 flex justify-between items-start shrink-0">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activeStudy.tags?.map((tag, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight leading-tight">{activeStudy.title}</h3>
                  <p className="text-neutraltext text-xs md:text-sm font-bold mt-2 flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-primary" /> {activeStudy.organisation}</span>
                    <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-primary" /> {activeStudy.dateRange}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setActiveStudy(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white flex items-center justify-center text-charcoal transition-all shrink-0 ml-4"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable details content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
                {/* Problem */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                      <FaLightbulb className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">The Problem</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.problem}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Objective */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                      <FaBullseye className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">Objective</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.objective}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <FaDraftingCompass className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">Strategy</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.strategy}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Implementation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                      <FaCogs className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">Implementation</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.implementation}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <FaCheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">Results</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.results}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Lessons Learned */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-start">
                  <div className="flex items-center gap-2.5 md:col-span-1">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 shrink-0">
                      <FaBookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-charcoal">Lessons Learned</span>
                  </div>
                  <div className="md:col-span-3 text-neutraltext text-sm md:text-base leading-relaxed font-medium">
                    {activeStudy.lessons}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-offwhite border-t border-gray-100 flex justify-end shrink-0">
                <button 
                  onClick={() => setActiveStudy(null)}
                  className="px-6 py-2.5 rounded-full bg-charcoal text-white hover:bg-secondary font-bold text-xs transition-all shadow-md"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudies;
