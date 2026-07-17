import React, { useState } from 'react';
import { FaFilePdf, FaEye, FaDownload, FaTimes } from 'react-icons/fa';
import { logAnalyticsEvent } from '../services/portfolioService';
import { motion } from 'framer-motion';

const ResumeSection = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const resumeUrl = "/JSR_Annamayya_CV.pdf";

  const handlePreview = () => {
    setIsPreviewOpen(true);
    logAnalyticsEvent({
      type: 'resume_preview',
      label: 'PDF Resume Viewer'
    });
  };

  const handleDownload = () => {
    logAnalyticsEvent({
      type: 'resume_download',
      label: 'PDF Resume Download'
    });
  };

  return (
    <section id="resume" className="bg-[#1E1B18] py-20 px-6 md:px-12 w-full relative overflow-hidden border-t border-white/5">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-block border border-secondary/35 rounded-full px-5 py-1.5 text-xs text-secondary font-bold mb-4 bg-[#2d2824]/50 uppercase tracking-wider">
            Curriculum Vitae
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            Professional Profile & CV
          </h2>
          <p className="text-white/50 text-xs md:text-sm mt-3 max-w-xl mx-auto font-medium">
            Explore JSR Annamayya's background, core competencies, academic credentials, and project history in detail.
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-[#25221F] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FaFilePdf className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-snug">JSR_Annamayya_CV.pdf</h3>
              <p className="text-white/40 text-xs mt-1 font-medium">National Award Winner • 9+ Years Experience • SWM & IEC Expert</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Preview Button */}
            <button
              onClick={handlePreview}
              className="px-6 py-3 rounded-full border border-white/10 hover:border-secondary bg-[#1E1B18] text-white hover:text-secondary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm focus:outline-none"
            >
              <FaEye className="w-3.5 h-3.5" /> Preview CV
            </button>

            {/* Download Button */}
            <a
              href={resumeUrl}
              onClick={handleDownload}
              download="JSR_Annamayya_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <FaDownload className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>
        </div>

      </div>

      {/* PDF Iframe Preview Modal Overlay */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#25221F] w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
          >
            {/* Modal Header */}
            <div className="bg-[#1E1B18] px-6 py-4 flex justify-between items-center border-b border-white/5">
              <span className="text-xs font-bold text-white tracking-wider flex items-center gap-2">
                <FaFilePdf className="text-primary w-4 h-4" /> PDF Document Reader
              </span>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/10 text-white/60 hover:text-primary flex items-center justify-center transition-all focus:outline-none"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Iframe content */}
            <div className="flex-1 bg-white/95">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                title="JSR Annamayya Curriculum Vitae"
                className="w-full h-full border-none"
              />
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};

export default ResumeSection;