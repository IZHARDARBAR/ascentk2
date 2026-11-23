import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileCardSlider({ items = [], renderItem, darkTheme = false }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const total = items.length;
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);

  return (
    <div className="md:hidden relative w-full overflow-hidden py-3">
      <div className="relative flex items-center justify-center">
        {/* Left Peeking Card */}
        {total > 1 && (
          <div
            aria-hidden="true"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[76%] w-[82%] scale-90 opacity-45 pointer-events-none select-none z-0"
          >
            {renderItem(items[prevIndex], prevIndex)}
          </div>
        )}

        {/* Right Peeking Card */}
        {total > 1 && (
          <div
            aria-hidden="true"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[76%] w-[82%] scale-90 opacity-45 pointer-events-none select-none z-0"
          >
            {renderItem(items[nextIndex], nextIndex)}
          </div>
        )}

        {/* Active Center Card (Swipeable) */}
        <div className="relative z-10 w-[84%] sm:w-[74%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0.75, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.75, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              drag={total > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45) handleNext();
                if (info.offset.x > 45) handlePrev();
              }}
              className="shadow-2xl rounded-lg"
            >
              {renderItem(items[activeIndex], activeIndex)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Circular Arrow Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous card"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-[#151A18] border border-[#D8D5CA] shadow-xl flex items-center justify-center hover:bg-[#C5A46D] transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Circular Arrow Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next card"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-[#151A18] border border-[#D8D5CA] shadow-xl flex items-center justify-center hover:bg-[#C5A46D] transition active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? 'w-6 bg-[#C5A46D]'
                  : darkTheme
                  ? 'w-2 bg-white/30'
                  : 'w-2 bg-[#142C25]/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}