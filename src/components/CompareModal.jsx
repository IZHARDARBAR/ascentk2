import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, X, ArrowRight } from 'lucide-react';
import { useTreks } from '../context/TreksContext';

export default function CompareModal() {
  const { treks, compareIds, toggleCompare, clearCompare, formatPrice } = useTreks();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isTrekDetail = pathname.startsWith('/treks/') && pathname !== '/treks';
  const selectedTreks = treks.filter((t) => compareIds.includes(t.id));

  if (selectedTreks.length === 0) return null;

  return (
    <>
      {/* Floating Compare Tray */}
      <div
        className={`fixed left-5 z-40 bg-[#142C25] text-white border border-[#C5A46D]/60 rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-3 transition-all ${
          isTrekDetail ? 'bottom-20 sm:bottom-24' : 'bottom-6'
        }`}
      >
        <ArrowLeftRight className="w-4 h-4 text-[#C5A46D]" />
        <span className="text-xs font-semibold">
          Compare ({selectedTreks.length}/3)
        </span>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] text-xs font-bold px-3.5 py-1.5 rounded-full transition"
        >
          Compare Now
        </button>
        <button
          onClick={clearCompare}
          aria-label="Clear comparison"
          className="p-1 text-white/65 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F6F5F0] text-[#151A18] rounded-2xl max-w-5xl w-full max-h-[88vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-2xl border border-[#D8D5CA] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between pb-5 border-b border-[#D8D5CA]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A46D]">
                    Side-by-Side Matrix
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">
                    Compare Karakoram Treks
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full border border-[#D8D5CA] bg-white hover:bg-[#142C25] hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#D8D5CA]">
                      <th className="py-4 pr-4 text-xs uppercase tracking-wider text-[#151A18]/60 w-40">
                        Specification
                      </th>
                      {selectedTreks.map((t) => (
                        <th key={t.id} className="py-4 px-4 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-serif text-lg font-semibold text-[#142C25]">
                              {t.name}
                            </span>
                            <button
                              onClick={() => toggleCompare(t.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D5CA]/70">
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Price
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4 font-serif text-xl font-bold text-[#142C25]">
                          {formatPrice(t.startingPrice)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Duration
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4">{t.durationLabel}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Difficulty
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4 font-semibold">{t.difficulty}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Max Altitude
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4">{t.maxAltitude}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Best Season
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4">{t.bestSeason}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-xs uppercase text-[#151A18]/60">
                        Technical Gear
                      </td>
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-3.5 px-4">
                          {t.difficulty === 'Extreme'
                            ? 'Crampons, Harness & Ascender'
                            : t.difficulty === 'Hard'
                            ? 'Glacier Boots & Poles'
                            : 'Standard Trekking Gear'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 pr-4" />
                      {selectedTreks.map((t) => (
                        <td key={t.id} className="py-4 px-4">
                          <Link
                            to={`/treks/${t.slug}`}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1.5 bg-[#142C25] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#151A18] transition"
                          >
                            <span>Explore Trek</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}