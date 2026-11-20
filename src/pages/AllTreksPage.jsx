import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { treksData } from '../data/treksData';
import TrekCard from '../components/TrekCard';

const filterOptions = [
  'All',
  '3–7 Days',
  '8–15 Days',
  '16+ Days',
  'Easy',
  'Moderate',
  'Hard',
  'Extreme',
];

export default function AllTreksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTreks = useMemo(() => {
    if (activeFilter === 'All') return treksData;
    if (activeFilter === '3–7 Days') {
      return treksData.filter((t) => t.durationDays >= 3 && t.durationDays <= 7);
    }
    if (activeFilter === '8–15 Days') {
      return treksData.filter((t) => t.durationDays >= 8 && t.durationDays <= 15);
    }
    if (activeFilter === '16+ Days') {
      return treksData.filter((t) => t.durationDays >= 16);
    }
    return treksData.filter((t) => t.difficulty === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-[#F6F5F0] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
            Karakoram &amp; Himalayan Routes
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#151A18] mt-3">
            Explore Our Treks
          </h1>
          <p className="mt-3 text-base text-[#151A18]/70">
            10 guided adventures across Gilgit-Baltistan.
          </p>
        </div>

        {/* Animated Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pb-10 mb-10 border-b border-[#D8D5CA]">
          {filterOptions.map((option) => {
            const active = activeFilter === option;
            return (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-white text-[#151A18]/80 border border-[#D8D5CA] hover:border-[#142C25]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeTrekFilterPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#142C25] rounded-full"
                  />
                )}
                <span className="relative z-10">{option}</span>
              </button>
            );
          })}
          <span className="ml-auto text-xs font-medium text-[#151A18]/60">
            Showing {filteredTreks.length} {filteredTreks.length === 1 ? 'trek' : 'treks'}
          </span>
        </div>

        {/* Grid */}
        {filteredTreks.length > 0 ? (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTreks.map((trek, idx) => (
              <TrekCard key={trek.id} trek={trek} index={idx} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#D8D5CA] rounded-lg">
            <p className="font-serif text-2xl text-[#151A18]">No treks match this filter.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 text-sm font-semibold text-[#142C25] underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}