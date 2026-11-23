import { MapPin, Mountain } from 'lucide-react';

export default function RouteMap({ itinerary, selectedDayIndex, onSelectDay }) {
  if (!itinerary || itinerary.length === 0) return null;

  const maxElev = Math.max(...itinerary.map((d) => d.elevationNum || 1000), 1000);
  const minElev = Math.min(...itinerary.map((d) => d.elevationNum || 0));

  return (
    <div className="bg-[#142C25] text-white rounded-xl p-6 sm:p-8 border border-[#C5A46D]/30 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A46D] font-semibold">
            Interactive Trail Corridor
          </span>
          <h3 className="font-serif text-2xl font-semibold mt-1">Route &amp; Camp Progression</h3>
        </div>
        <span className="text-xs text-white/70">Click any stop to inspect day details</span>
      </div>

      {/* Interactive Horizontal SVG Corridor */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          <div className="relative h-44 flex items-end justify-between px-4 pt-8 pb-6 bg-[#151A18]/50 rounded-xl border border-white/10">
            {/* Subtle Ridge Backdrop Line */}
            <svg
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
            >
              <path
                d="M0 130 L120 95 L260 108 L410 55 L560 72 L710 25 L860 65 L1000 120 L1000 140 L0 140 Z"
                fill="#C5A46D"
              />
            </svg>

            {itinerary.map((stop, idx) => {
              const active = selectedDayIndex === idx;
              const ratio =
                maxElev === minElev
                  ? 0.5
                  : (stop.elevationNum - minElev) / (maxElev - minElev);
              const bottomOffset = Math.round(ratio * 65);

              return (
                <button
                  key={`${stop.day}-${idx}`}
                  type="button"
                  onClick={() => onSelectDay(idx)}
                  style={{ marginBottom: `${bottomOffset}px` }}
                  className="relative z-10 flex flex-col items-center group focus:outline-none"
                >
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded mb-1.5 transition ${
                      active
                        ? 'bg-[#C5A46D] text-[#151A18]'
                        : 'bg-black/60 text-white/80 group-hover:text-[#C5A46D]'
                    }`}
                  >
                    {stop.elevation}
                  </span>

                  <span
                    className={`w-4 h-4 rounded-full border-2 transition-transform ${
                      active
                        ? 'bg-[#C5A46D] border-white scale-125 shadow-lg'
                        : 'bg-[#142C25] border-[#C5A46D] group-hover:scale-110'
                    }`}
                  />

                  <span className="mt-2 text-[11px] font-medium text-white/90 max-w-[95px] truncate">
                    Day {stop.day}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stop Preview Bar */}
          {itinerary[selectedDayIndex] && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#C5A46D]">
                <MapPin className="w-4 h-4" />
                <span>
                  Day {itinerary[selectedDayIndex].day}: {itinerary[selectedDayIndex].route}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <span className="inline-flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-[#C5A46D]" />{' '}
                  {itinerary[selectedDayIndex].elevation}
                </span>
                <span>Camp: {itinerary[selectedDayIndex].accommodation}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}