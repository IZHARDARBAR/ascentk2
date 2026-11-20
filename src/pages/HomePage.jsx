import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Star,
  Award,
  ShieldCheck,
  Compass,
  Wallet,
  MapPin,
  Maximize2,
} from 'lucide-react';
import { expeditionsData, testimonialsData } from '../data/treksData';
import { useTreks } from '../context/TreksContext';
import TrekCard from '../components/TrekCard';
import VideoModal from '../components/VideoModal';

export default function HomePage() {
  const { treks, formatPrice } = useTreks();
  const [videoOpen, setVideoOpen] = useState(false);

  const featuredTreks = treks.filter((t) => t.featured);
  const heroPreviewTreks = featuredTreks.length > 0 ? featuredTreks : treks.slice(0, 3);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    if (heroPreviewTreks.length === 0) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroPreviewTreks.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroPreviewTreks.length]);

  const activeHeroTrek = heroPreviewTreks[heroSlideIndex % heroPreviewTreks.length] || treks[0];

  return (
    <div className="bg-[#F6F5F0]">
      {/* HERO SECTION */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#151A18] flex flex-col justify-between">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=85"
            alt="Karakoram mountains at golden twilight"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#151A18]/88 via-[#151A18]/50 to-[#151A18]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151A18]/90 via-transparent to-[#151A18]/45" />
        </motion.div>

        {/* Floating Hotspots */}
        <div className="hidden lg:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/treks/k2-base-camp"
              className="pointer-events-auto absolute top-[26%] left-[55%] flex items-center gap-2 group"
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-[4px] border-[#142C25]" />
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#151A18]/65 backdrop-blur-md border border-white/20 text-xs font-medium text-white group-hover:border-[#C5A46D] group-hover:text-[#C5A46D] transition">
                K2 Summit · 8,611m
              </span>
            </Link>

            <Link
              to="/treks/karakoram-grand-traverse"
              className="pointer-events-auto absolute top-[49%] left-[58%] flex items-center gap-2 group"
            >
              <span className="px-3.5 py-1 rounded-full bg-[#151A18]/65 backdrop-blur-md border border-white/20 text-xs font-medium text-white group-hover:border-[#C5A46D] group-hover:text-[#C5A46D] transition">
                Concordia &amp; Baltoro
              </span>
              <span className="inline-flex rounded-full h-3.5 w-3.5 bg-white border-[3px] border-[#142C25]" />
            </Link>

            <Link
              to="/treks/shimshal-pass"
              className="pointer-events-auto absolute top-[62%] left-[47%] flex items-center gap-2 group"
            >
              <span className="px-3.5 py-1 rounded-full bg-[#151A18]/65 backdrop-blur-md border border-white/20 text-xs font-medium text-white group-hover:border-[#C5A46D] group-hover:text-[#C5A46D] transition">
                High Alpine Basecamps
              </span>
              <span className="inline-flex rounded-full h-3.5 w-3.5 bg-white border-[3px] border-[#142C25]" />
            </Link>
          </motion.div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-32 sm:pt-36 pb-10 flex-1 flex flex-col justify-between">
          <div className="max-w-2xl my-auto py-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-white/90 mb-5 flex items-center gap-2.5"
            >
              <span>EXPLORE THE KARAKORAM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              <span className="text-[#C5A46D]">PAKISTAN</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight"
            >
              Conquer the <br />
              <span className="text-[#C5A46D]">Roof</span> of the World
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 text-base sm:text-lg text-white/80 max-w-lg leading-relaxed"
            >
              Guided treks &amp; expeditions across Gilgit-Baltistan, Pakistan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/treks"
                className="inline-flex items-center gap-3.5 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold text-sm sm:text-base pl-6 pr-2 py-2 rounded-full transition-all duration-300 shadow-xl group hover:-translate-y-0.5"
              >
                <span>Explore Treks</span>
                <span className="w-9 h-9 rounded-full bg-[#151A18] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="w-6 h-6 rounded-full bg-[#C5A46D] text-[#151A18] flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span>Watch Video</span>
              </button>
            </motion.div>
          </div>

          <div className="pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              className="bg-[#151A18]/70 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-4 sm:px-7 sm:py-5 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 max-w-2xl"
            >
              <div className="flex items-start gap-2.5 sm:border-r sm:border-white/10 sm:pr-4">
                <Star className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5 fill-[#C5A46D]" />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white leading-none">4.9</div>
                  <div className="text-[11px] text-white/65 mt-1">Average Rating</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:border-r sm:border-white/10 sm:pr-4">
                <Award className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white leading-none">200+</div>
                  <div className="text-[11px] text-white/65 mt-1">Reviews</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:border-r sm:border-white/10 sm:pr-4">
                <Compass className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white leading-none">15+ Yrs</div>
                  <div className="text-[11px] text-white/65 mt-1">Experience</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white leading-none">IFMGA</div>
                  <div className="text-[11px] text-white/65 mt-1">Certified Guides</div>
                </div>
              </div>
            </motion.div>

            {/* Bottom-Right Floating Featured Trek Card */}
            {activeHeroTrek && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.38 }}
                className="hidden sm:block w-full max-w-[290px] bg-[#151A18]/75 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 shadow-2xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHeroTrek.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/treks/${activeHeroTrek.slug}`}
                      className="relative block aspect-[16/10] rounded-xl overflow-hidden group"
                    >
                      <img
                        src={activeHeroTrek.cardImage}
                        alt={activeHeroTrek.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#151A18]/70 backdrop-blur text-white flex items-center justify-center group-hover:bg-[#C5A46D] group-hover:text-[#151A18] transition">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </Link>

                    <div className="mt-3 px-0.5">
                      <Link to={`/treks/${activeHeroTrek.slug}`}>
                        <h3 className="font-sans text-base font-semibold text-white hover:text-[#C5A46D] transition">
                          {activeHeroTrek.name}
                        </h3>
                      </Link>
                      <p className="flex items-center gap-1.5 text-[11px] text-white/70 mt-1">
                        <MapPin className="w-3 h-3 text-[#C5A46D] shrink-0" />
                        <span className="truncate">{activeHeroTrek.location}</span>
                      </p>
                      <p className="text-xs text-white/65 mt-2 line-clamp-2 leading-relaxed">
                        {activeHeroTrek.tagline}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 px-0.5">
                  <div className="flex items-center gap-1.5">
                    {heroPreviewTreks.map((t, idx) => (
                      <button
                        key={t.id}
                        aria-label={`Preview ${t.name}`}
                        onClick={() => setHeroSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === heroSlideIndex
                            ? 'w-5 bg-[#C5A46D]'
                            : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#C5A46D]">
                    From {formatPrice(activeHeroTrek.startingPrice)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED TREKS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Curated Routes
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#151A18] mt-3">
              Find Your Next Adventure
            </h2>
            <p className="mt-3 text-base text-[#151A18]/70 max-w-xl">
              Handpicked journeys through the world&apos;s most spectacular mountain landscapes.
            </p>
          </div>
          <Link
            to="/treks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#142C25] border-b border-[#142C25] pb-1 hover:text-[#C5A46D] hover:border-[#C5A46D] transition self-start md:self-auto"
          >
            <span>View All {treks.length} Treks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heroPreviewTreks.map((trek, idx) => (
            <TrekCard key={trek.id} trek={trek} index={idx} />
          ))}
        </div>
      </section>

      {/* FEATURED EXPEDITIONS */}
      <section id="expeditions" className="py-20 lg:py-28 bg-[#142C25] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              High-Altitude Mountaineering
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-3">
              Summit the Giants
            </h2>
            <p className="mt-3 text-base text-white/75">
              Take on some of the world&apos;s most iconic mountain summits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {expeditionsData.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-[#151A18] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151A18] via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-[#C5A46D] text-[#151A18] text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                      {exp.tag}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-[#C5A46D] uppercase tracking-widest font-medium mb-2">
                      <span>{exp.duration}</span>
                      <span>Elevation {exp.altitude}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-white">{exp.name}</h3>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-serif text-xl font-semibold text-[#C5A46D]">
                    {exp.price}
                  </span>
                  <Link
                    to={`/contact?interest=${encodeURIComponent(exp.name.split(' (')[0])}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#C5A46D] transition"
                  >
                    <span>Request Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
            The AscentK2 Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#151A18] mt-3">
            Adventure With Confidence
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Award, title: 'Certified Guides', desc: 'IFMGA & NPA certified mountain guides.' },
            { icon: ShieldCheck, title: 'Safety First', desc: 'Full evacuation planning and medical support.' },
            { icon: Compass, title: 'Local Expertise', desc: 'Born and raised in Gilgit-Baltistan.' },
            { icon: Wallet, title: 'Transparent Pricing', desc: 'No hidden costs. All-inclusive packages.' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#D8D5CA] rounded-lg p-8 hover:border-[#C5A46D] transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#142C25] text-[#C5A46D] flex items-center justify-center mb-6">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#151A18]">{item.title}</h3>
              <p className="mt-2.5 text-sm text-[#151A18]/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-[#D8D5CA]/35 border-y border-[#D8D5CA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#142C25]">
              Expedition Voices
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#151A18] mt-3">
              Stories From the Mountains
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="bg-white border border-[#D8D5CA] rounded-lg p-8 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C5A46D] mb-5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-[#151A18]/80 leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#D8D5CA]/60 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#142C25] text-[#C5A46D] font-serif font-semibold flex items-center justify-center shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#151A18]">{review.name}</div>
                    <div className="text-xs text-[#151A18]/60">
                      {review.country} · {review.trek}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85"
          alt="Dramatic Karakoram horizon"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#151A18]/75" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
            Bespoke Expedition Planning
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold mt-4 leading-tight">
            Your Next Great Adventure Starts Here
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80">
            Get a free custom itinerary within 24 hours.
          </p>
          <div className="mt-9">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3.5 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold text-base pl-7 pr-2.5 py-2.5 rounded-full transition-all shadow-2xl group"
            >
              <span>Get a Free Itinerary</span>
              <span className="w-9 h-9 rounded-full bg-[#151A18] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}