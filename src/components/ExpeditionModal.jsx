import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mountain, Clock, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { useTreks } from '../context/TreksContext';

export default function ExpeditionModal({ expedition, onClose }) {
  const { formatPrice } = useTreks();

  return (
    <AnimatePresence>
      {expedition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151A18] text-white border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-2xl"
          >
            {/* Compact Hero Header */}
            <div className="relative h-44 sm:h-52">
              <img
                src={expedition.image}
                alt={expedition.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151A18] via-black/35 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close dossier"
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 text-white hover:bg-[#C5A46D] hover:text-[#151A18] transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block bg-[#C5A46D] text-[#151A18] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm mb-1.5">
                  {expedition.tag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
                  {expedition.name}
                </h2>
              </div>
            </div>

            {/* Compact Body */}
            <div className="p-5 sm:p-7 space-y-4">
              <p className="text-sm text-white/80 leading-relaxed">
                {expedition.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#142C25] border border-white/10 text-xs">
                <div>
                  <span className="text-[#C5A46D] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </span>
                  <div className="font-semibold mt-0.5">
                    {expedition.duration} ({expedition.season})
                  </div>
                </div>
                <div>
                  <span className="text-[#C5A46D] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Compass className="w-3.5 h-3.5" /> Support Ratio
                  </span>
                  <div className="font-semibold mt-0.5">{expedition.hapRatio}</div>
                </div>
                <div>
                  <span className="text-[#C5A46D] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Oxygen Protocol
                  </span>
                  <div className="font-semibold mt-0.5">{expedition.oxygen}</div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold text-[#C5A46D] mb-2.5 flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  <span>High-Camp Progression</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/85">
                  {(expedition.camps || []).map((camp, i) => (
                    <li
                      key={i}
                      className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 leading-snug"
                    >
                      {camp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-white/55">
                    Full-Board Expedition Investment
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C5A46D]">
                    From {formatPrice(expedition.startingPrice)}
                  </div>
                </div>

                <Link
                  to={`/contact?interest=${encodeURIComponent(expedition.name.split(' (')[0])}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold text-sm px-6 py-2.5 rounded-full transition"
                >
                  <span>Apply for Expedition</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}