import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown } from 'lucide-react';
import { useTreks } from '../context/TreksContext';
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
  const { treks, loadingData } = useTreks();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    document.title = 'Explore All Treks | AscentK2 Treks';
  }, []);

  const filteredAndSortedTreks = useMemo(() => {
    let list = [...treks];

    if (activeFilter === '3–7 Days') {
      list = list.filter((t) => t.durationDays >= 3 && t.durationDays <= 7);
    } else if (activeFilter === '8–15 Days') {
      list = list.filter((t) => t.durationDays >= 8 && t.durationDays <= 15);
    } else if (activeFilter === '16+ Days') {
      list = list.filter((t) => t.durationDays >= 16);
    } else if (activeFilter !== 'All') {
      list = list.filter((t) => t.difficulty === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          (t.name || '').toLowerCase().includes(q) ||
          (t.location || '').toLowerCase().includes(q) ||
          (t.tagline || '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') list.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortBy === 'price-desc') list.sort((a, b) => b.startingPrice - a.startingPrice);
    if (sortBy === 'duration-asc') list.sort((a, b) => a.durationDays - b.durationDays);
    if (sortBy === 'duration-desc') list.sort((a, b) => b.durationDays - a.durationDays);
    if (sortBy === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));

    return list;
  }, [treks, activeFilter, searchQuery, sortBy]);

  return (
    <div className="bg-[#F6F5F0] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Karakoram &amp; Himalayan Routes
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#151A18] mt-3">
              Explore Our Treks
            </h1>
            <p className="mt-3 text-base text-[#151A18]/70">
              {treks.length} guided adventures across Gilgit-Baltistan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#151A18]/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treks or valleys..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D8D5CA] rounded-full text-sm focus:outline-none focus:border-[#142C25]"
              />
            </div>

            <div className="relative flex items-center bg-white border border-[#D8D5CA] rounded-full px-4 py-2.5 text-sm">
              <ArrowUpDown className="w-4 h-4 text-[#C5A46D] mr-2 shrink-0" />
              <select
                aria-label="Sort treks"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-[#151A18] focus:outline-none cursor-pointer pr-2"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Shortest</option>
                <option value="duration-desc">Duration: Longest</option>
              </select>
            </div>
          </div>
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
            Showing {filteredAndSortedTreks.length}{' '}
            {filteredAndSortedTreks.length === 1 ? 'trek' : 'treks'}
          </span>
        </div>

        {/* Loading Skeleton / Grid / Empty State */}
        {loadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[420px] rounded-lg bg-[#D8D5CA]/40 animate-pulse border border-[#D8D5CA]"
              />
            ))}
          </div>
        ) : filteredAndSortedTreks.length > 0 ? (
          <motion.div
            key={`${activeFilter}-${searchQuery}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAndSortedTreks.map((trek, idx) => (
              <TrekCard key={trek.id} trek={trek} index={idx} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#D8D5CA] rounded-lg">
            <p className="font-serif text-2xl text-[#151A18]">No treks match this filter.</p>
            <button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
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