import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LightboxModal({ images, currentIndex, onClose, onChangeIndex }) {
  const isOpen = currentIndex !== null && images.length > 0;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChangeIndex((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft')
        onChangeIndex((currentIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onChangeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-[#C5A46D] text-white hover:text-[#151A18] transition"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex((currentIndex - 1 + images.length) % images.length);
                }}
                aria-label="Previous photo"
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-[#C5A46D] text-white hover:text-[#151A18] transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex((currentIndex + 1) % images.length);
                }}
                aria-label="Next photo"
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-[#C5A46D] text-white hover:text-[#151A18] transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full flex flex-col items-center"
          >
            <img
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-xs tracking-widest uppercase text-white/70">
              Photo {currentIndex + 1} of {images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}