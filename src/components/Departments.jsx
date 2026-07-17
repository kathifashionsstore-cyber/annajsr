import React, { useEffect, useState } from 'react';
import { getDepartments } from '../services/portfolioService';
import { FaBuilding } from 'react-icons/fa';

import ExpandableSection from './ExpandableSection';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.warn("Failed to load departments, using fallbacks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const renderDeptItem = (dept, index) => (
    <div 
      key={dept.id || index}
      className="bg-white/5 hover:bg-white/10 rounded-[2rem] p-6 border border-white/5 hover:border-secondary/40 shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 group hover:-translate-y-1 h-full"
    >
      {/* Logo placeholder or upload */}
      {dept.logo ? (
        <img 
          src={dept.logo} 
          alt={dept.name} 
          className="h-12 w-auto object-contain filter brightness-95 group-hover:brightness-100 transition-all duration-300"
        />
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center group-hover:bg-secondary/15 group-hover:text-secondary transition-all duration-300">
          <FaBuilding className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-white text-xs md:text-sm font-bold tracking-wide uppercase group-hover:text-secondary transition-colors duration-300">
        {dept.name}
      </h3>
    </div>
  );

  return (
    <section id="collaborations" className="py-20 bg-charcoal relative overflow-hidden">
      {/* Dark background styling context */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,#C1440E_0%,transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-secondary text-xs font-black tracking-widest uppercase">
            Institutional Trust
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
            Government Departments Collaborated With
          </h2>
          <p className="text-white/60 text-sm mt-4 font-medium leading-relaxed">
            Proudly working alongside municipal corporations, state departments, and environmental boards across Andhra Pradesh and Telangana.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-8 border border-white/5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up">
            <ExpandableSection
              items={departments}
              limit={3}
              buttonLabelSingle="Collaborations"
              renderItem={renderDeptItem}
              gridClassName="grid grid-cols-2 md:grid-cols-3 gap-6"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Departments;
