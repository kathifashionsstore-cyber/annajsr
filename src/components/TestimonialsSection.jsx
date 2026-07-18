import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

const TestimonialsSection = () => {
  const { profile, testimonials } = portfolioData;

  const slides = [
    {
      type: "TESTIMONIAL",
      text: testimonials[0].quote,
      author: testimonials[0].author,
      role: testimonials[0].designation,
      organisation: testimonials[0].company
    },
    {
      type: "RECOGNITION",
      text: "Awarded the Vande Bharat Puraskar civilian honor for outstanding contributions to public waste system reforms and environmental advocacy.",
      author: "Govt. of Telangana",
      role: "Civilian Honour",
      organisation: "State Level Recognition"
    },
    {
      type: "RECOGNITION",
      text: "Recipient of the National Youth Icon Award in New Delhi, recognized for excellence in youth leadership and mobilizing community clean-up networks.",
      author: "National Youth Parliament",
      role: "National Award",
      organisation: "New Delhi, India"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      id="testimonials-recognition" 
      className="py-24 md:py-32 bg-[#111111] text-[#F4EFE7] border-b border-[#DDD7CE]/10 w-full"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col gap-10 items-center text-center font-sans">
        
        <span className="text-section-label text-[#A98760] font-bold tracking-[0.2em] block">
          06 / TESTIMONIALS & RECOGNITION
        </span>

        {/* Slides Container */}
        <div className="relative min-h-[220px] w-full flex items-center justify-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-x-0 transition-all duration-700 ease-in-out flex flex-col gap-6 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              }`}
            >
              <span className="text-[10px] font-mono tracking-widest text-[#A98760] font-bold uppercase">
                {slide.type}
              </span>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl italic leading-relaxed text-white font-light px-4 sm:px-8">
                "{slide.text}"
              </p>
              <div className="text-xs uppercase tracking-wider text-[#A98760] font-bold">
                &mdash; {slide.author},{" "}
                <span className="text-white/60 font-medium">
                  {slide.role} ({slide.organisation})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-6 mt-4 select-none">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/20 hover:border-white hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#A98760]"
            aria-label="Previous slide"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/20 hover:border-white hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#A98760]"
            aria-label="Next slide"
          >
            <FaArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
