import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { getServices } from '../services/portfolioService';

import ExpandableSection from './ExpandableSection';

const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServicesList(data);
      } catch (err) {
        console.warn("Failed to load services offered, using static list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Safe helper to dynamically render FontAwesome icons by string name
  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName] || FaIcons.FaBriefcase;
    return <IconComponent className="w-6 h-6 text-secondary" />;
  };

  const renderServiceItem = (service, index) => (
    <div 
      key={service.id || index}
      className="bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 group"
    >
      {/* Icon Container */}
      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
        <div className="group-hover:scale-110 transition-transform duration-300">
          {renderIcon(service.icon)}
        </div>
      </div>
      
      {/* Text Context */}
      <div>
        <h3 className="text-lg md:text-xl font-black text-charcoal tracking-tight group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-neutraltext text-xs md:text-sm mt-3 leading-relaxed font-medium">
          {service.description}
        </p>
      </div>
    </div>
  );

  return (
    <section id="services" className="py-24 bg-offwhite relative overflow-hidden font-sans border-t border-gray-100">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-primary text-xs font-black tracking-widest uppercase bg-white border border-primary/20 px-4 py-1.5 rounded-full shadow-sm">
            Core Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mt-4 tracking-tight">
            Services Offered
          </h2>
          <p className="text-neutraltext text-sm md:text-base mt-4 font-medium leading-relaxed">
            Professional consulting and design services spanning government operations, behavioral strategies, and environmental campaign implementation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up">
            <ExpandableSection
              items={servicesList}
              limit={3}
              buttonLabelSingle="Services"
              renderItem={renderServiceItem}
              gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
