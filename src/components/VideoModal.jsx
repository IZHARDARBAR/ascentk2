import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function VideoModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#151A18] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <span className="text-sm font-medium text-white/90">
                Karakoram Expedition Reel · AscentK2 Treks
              </span>
              <button
                onClick={onClose}
                aria-label="Close video"
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-[#C5A46D] hover:text-[#151A18] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/6S3n4L8J7xI?autoplay=1&rel=0"
                title="Karakoram Mountains Expedition Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}