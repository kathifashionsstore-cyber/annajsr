import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpandableSection = ({ 
  items, 
  limit = 3, 
  buttonLabelSingle, // e.g. "Services", "Collaborations", "Case Studies", "Milestones"
  renderItem, 
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const showButton = items.length > limit;
  const initialItems = items.slice(0, limit);
  const extraItems = items.slice(limit);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Initial Grid */}
      <div className={gridClassName}>
        {initialItems.map((item, index) => renderItem(item, index))}
      </div>

      {/* Expanded Grid Block with height/opacity animation */}
      <AnimatePresence initial={false}>
        {isExpanded && extraItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden w-full mt-6"
          >
            <div className={gridClassName}>
              {extraItems.map((item, index) => renderItem(item, index + limit))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showButton && (
        <div className="mt-12 w-full flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
              isExpanded 
                ? 'bg-transparent border-2 border-secondary/50 text-secondary hover:bg-secondary/10' 
                : 'bg-secondary text-white hover:bg-secondary/95'
            }`}
          >
            {isExpanded ? `View Less ${buttonLabelSingle}` : `View More ${buttonLabelSingle}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
