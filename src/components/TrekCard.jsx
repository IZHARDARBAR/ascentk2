import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Mountain, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTreks } from '../context/TreksContext';

const difficultyColors = {
  Easy: 'bg-[#142C25] text-[#F6F5F0]',
  Moderate: 'bg-[#284239] text-[#F6F5F0]',
  Hard: 'bg-[#151A18] text-[#C5A46D] border border-[#C5A46D]/40',
  Extreme: 'bg-[#C5A46D] text-[#151A18]',
};

export default function TrekCard({ trek, index = 0 }) {
  const { formatPrice } = useTreks();
  const nextDeparture = trek.departures?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group bg-white border border-[#D8D5CA] rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div>
        <Link to={`/treks/${trek.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          <img
            src={trek.cardImage}
            alt={trek.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151A18]/70 via-transparent to-transparent opacity-80" />

          <span
            className={`absolute top-4 left-4 text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-sm ${
              difficultyColors[trek.difficulty] || 'bg-[#151A18] text-white'
            }`}
          >
            {trek.difficulty}
          </span>

          {nextDeparture && (
            <span className="absolute top-4 right-4 bg-[#151A18]/80 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-sm border border-white/15">
              {nextDeparture.spotsLeft} Spots Left
            </span>
          )}

          <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-1.5 text-xs text-white/90">
            <Mountain className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
            <span className="truncate">{trek.maxAltitude}</span>
          </div>
        </Link>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-[#142C25]/70 uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>{trek.durationLabel}</span>
            <span>·</span>
            <span className="truncate">{trek.bestSeason}</span>
          </div>

          <Link to={`/treks/${trek.slug}`}>
            <h3 className="font-serif text-2xl font-semibold text-[#151A18] group-hover:text-[#142C25] transition-colors">
              {trek.name}
            </h3>
          </Link>

          <p className="mt-2.5 text-sm text-[#151A18]/70 leading-relaxed line-clamp-2">
            {trek.tagline}
          </p>

          {nextDeparture && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#142C25] bg-[#F6F5F0] px-2.5 py-1 rounded">
              <Calendar className="w-3 h-3 text-[#C5A46D]" />
              <span>Next: {nextDeparture.dates}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-[#F6F5F0]/60 border-t border-[#D8D5CA]/70 flex items-center justify-between">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#151A18]/55">
            Starting From
          </span>
          <span className="font-serif text-xl font-semibold text-[#142C25]">
            {formatPrice(trek.startingPrice)}
          </span>
        </div>

        <Link
          to={`/treks/${trek.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#142C25] hover:text-[#C5A46D] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}