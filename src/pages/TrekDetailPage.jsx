import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Mountain,
  MapPin,
  Calendar,
  Shield,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { treksData, globalFaqs } from '../data/treksData';

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const trek = treksData.find((t) => t.slug === slug);

  const [openDay, setOpenDay] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setOpenDay(0);
    setOpenFaq(0);
  }, [slug]);

  if (!trek) {
    return (
      <div className="min-h-screen bg-[#F6F5F0] pt-40 pb-24 px-6 text-center">
        <h1 className="font-serif text-4xl font-semibold text-[#151A18]">Trek Not Found</h1>
        <p className="mt-3 text-[#151A18]/70">
          The requested expedition route could not be located.
        </p>
        <Link
          to="/treks"
          className="mt-8 inline-flex items-center gap-2 bg-[#142C25] text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Treks</span>
        </Link>
      </div>
    );
  }

  const ratio = trek.startingPrice / 2800;
  const standardPrice = trek.startingPrice;
  const premiumPrice =
    trek.startingPrice === 2800 ? 3500 : Math.round((3500 * ratio) / 50) * 50;
  const privatePrice =
    trek.startingPrice === 2800 ? 5200 : Math.round((5200 * ratio) / 50) * 50;

  const pricingPackages = [
    {
      tier: 'Standard',
      price: standardPrice,
      group: 'Group of 6+',
      features: [
        'Full guiding team & Balti/Wakhi support crew',
        'Shared 4-season expedition dome tent',
        'All domestic transport, permits & meals',
      ],
    },
    {
      tier: 'Premium',
      price: premiumPrice,
      group: 'Group of 4–5',
      popular: true,
      features: [
        'Smaller pace-matched alpine group',
        'Upgraded sleeping mat & single tent option',
        'Dedicated satellite communicator & weather routing',
      ],
    },
    {
      tier: 'Private',
      price: privatePrice,
      group: 'Solo or 2 people',
      features: [
        '100% flexible dates & custom acclimatization',
        'Private senior IFMGA guide & dedicated cook',
        'Private 4x4 transfers & boutique hotel upgrades',
      ],
    },
  ];

  const chartData = trek.itinerary.map((item) => ({
    name: `Day ${item.day}`,
    route: item.route,
    elevation: item.elevationNum,
  }));

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleInquire = (packageTier = '') => {
    const note = packageTier ? `&package=${encodeURIComponent(packageTier)}` : '';
    navigate(`/contact?interest=${encodeURIComponent(trek.name)}${note}`);
  };

  return (
    <div className="bg-[#F6F5F0] pb-24">
      {/* TREK HERO */}
      <section className="relative min-h-[75vh] flex items-end bg-[#151A18] text-white pt-32 pb-14">
        <img
          src={trek.heroImage}
          alt={trek.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151A18] via-[#151A18]/55 to-[#151A18]/40" />

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-10">
          <Link
            to="/treks"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A46D] hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Karakoram Treks</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl font-semibold leading-tight">
                {trek.name}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl">
                {trek.tagline}
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-white/15">
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A46D]">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </span>
                  <div className="text-sm font-semibold mt-1">{trek.durationLabel}</div>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A46D]">
                    <Shield className="w-3.5 h-3.5" /> Difficulty
                  </span>
                  <div className="text-sm font-semibold mt-1">{trek.difficulty}</div>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A46D]">
                    <Mountain className="w-3.5 h-3.5" /> Max Altitude
                  </span>
                  <div className="text-sm font-semibold mt-1">{trek.maxAltitude}</div>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A46D]">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </span>
                  <div className="text-sm font-semibold mt-1">{trek.location}</div>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A46D]">
                    <Calendar className="w-3.5 h-3.5" /> Best Season
                  </span>
                  <div className="text-sm font-semibold mt-1">{trek.bestSeason}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#151A18]/85 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:w-72 shrink-0">
              <span className="text-xs uppercase tracking-widest text-white/60">Starting Price</span>
              <div className="font-serif text-4xl font-bold text-[#C5A46D] mt-1">
                ${trek.startingPrice.toLocaleString()}
                <span className="text-sm font-sans font-normal text-white/60"> /person</span>
              </div>
              <button
                onClick={() => handleInquire()}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold py-3 rounded-full transition"
              >
                <span>Inquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY SECTION NAVIGATION */}
      <div className="sticky top-[62px] z-30 bg-white/95 backdrop-blur-md border-b border-[#D8D5CA] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-6 sm:gap-10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'itinerary', label: 'Itinerary' },
            { id: 'inclusions', label: 'Inclusions' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'faq', label: 'FAQ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#142C25] text-[#142C25]'
                  : 'border-transparent text-[#151A18]/60 hover:text-[#151A18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-20 pt-14">
        {/* OVERVIEW */}
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Route Overview
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18]">
              Expedition Experience
            </h2>
            {trek.overview.map((paragraph, i) => (
              <p key={i} className="text-base text-[#151A18]/80 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="pt-4">
              <h3 className="font-serif text-xl font-semibold text-[#151A18] mb-4">
                Key Highlights
              </h3>
              <ul className="space-y-3">
                {trek.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#151A18]/80">
                    <Check className="w-4 h-4 text-[#142C25] shrink-0 mt-1" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <img
              src={trek.cardImage}
              alt={trek.name}
              className="col-span-2 rounded-lg w-full h-64 object-cover shadow-sm"
            />
            {trek.gallery.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${trek.name} view ${i + 1}`}
                className="rounded-lg w-full h-44 object-cover shadow-sm"
              />
            ))}
          </div>
        </section>

        {/* ELEVATION PROFILE & ITINERARY */}
        <section id="itinerary" className="space-y-12 pt-6 border-t border-[#D8D5CA]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Acclimatization &amp; Route
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              Elevation Profile &amp; Day-by-Day Itinerary
            </h2>
          </div>

          <div className="bg-white border border-[#D8D5CA] rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#142C25] mb-6">
              Altitude Gain Across Expedition (Meters)
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldElevation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A46D" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#142C25" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8D5CA" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#151A18' }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#151A18' }}
                    unit="m"
                    domain={[0, 'dataMax + 500']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151A18',
                      borderColor: '#C5A46D',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value}m`, 'Elevation']}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.route
                        ? `${label}: ${payload[0].payload.route}`
                        : label
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="elevation"
                    stroke="#142C25"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldElevation)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            {trek.itinerary.map((dayItem, idx) => {
              const isOpen = openDay === idx;
              return (
                <div
                  key={dayItem.day}
                  className="bg-white border border-[#D8D5CA] rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenDay(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#F6F5F0]/60 transition"
                  >
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                      <span className="px-3 py-1 rounded-sm bg-[#142C25] text-[#C5A46D] text-xs font-semibold uppercase tracking-wider">
                        Day {dayItem.day}
                      </span>
                      <span className="font-serif text-lg sm:text-xl font-semibold text-[#151A18]">
                        {dayItem.route}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="hidden sm:inline text-xs font-medium text-[#151A18]/65">
                        {dayItem.elevation}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#142C25] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-[#D8D5CA]/60 space-y-3">
                          <p className="text-sm sm:text-base text-[#151A18]/80 leading-relaxed">
                            {dayItem.description}
                          </p>
                          <div className="flex flex-wrap gap-6 pt-2 text-xs font-medium text-[#142C25]">
                            <span>Elevation: {dayItem.elevation}</span>
                            <span>Accommodation: {dayItem.accommodation}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* INCLUSIONS & EXCLUSIONS */}
        <section id="inclusions" className="pt-6 border-t border-[#D8D5CA]">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Transparent Logistics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              What&apos;s Included
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#D8D5CA] rounded-xl p-8">
              <h3 className="font-serif text-2xl font-semibold text-[#142C25] mb-6">
                Included in Your Expedition
              </h3>
              <ul className="space-y-4">
                {trek.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#151A18]/85">
                    <span className="w-5 h-5 rounded-full bg-[#142C25] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#D8D5CA] rounded-xl p-8">
              <h3 className="font-serif text-2xl font-semibold text-[#151A18] mb-6">
                Not Included
              </h3>
              <ul className="space-y-4">
                {trek.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#151A18]/75">
                    <span className="w-5 h-5 rounded-full bg-[#D8D5CA] text-[#151A18] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PRICING PACKAGES */}
        <section id="pricing" className="pt-6 border-t border-[#D8D5CA]">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Departure Tiers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              Pricing Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.tier}
                className={`rounded-xl p-8 flex flex-col justify-between border ${
                  pkg.popular
                    ? 'bg-[#142C25] text-white border-[#142C25] shadow-xl'
                    : 'bg-white text-[#151A18] border-[#D8D5CA]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold uppercase tracking-widest ${
                        pkg.popular ? 'text-[#C5A46D]' : 'text-[#142C25]'
                      }`}
                    >
                      {pkg.tier}
                    </span>
                    {pkg.popular && (
                      <span className="text-[10px] uppercase tracking-widest bg-[#C5A46D] text-[#151A18] font-bold px-2.5 py-1 rounded-sm">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className="font-serif text-4xl font-bold">
                      ${pkg.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ${pkg.popular ? 'text-white/70' : 'text-[#151A18]/60'}`}>
                      /person
                    </span>
                  </div>
                  <p className={`mt-1 text-sm font-medium ${pkg.popular ? 'text-[#C5A46D]' : 'text-[#142C25]'}`}>
                    {pkg.group}
                  </p>

                  <ul className="mt-6 pt-6 border-t border-current/15 space-y-3 text-sm">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            pkg.popular ? 'text-[#C5A46D]' : 'text-[#142C25]'
                          }`}
                        />
                        <span className={pkg.popular ? 'text-white/85' : 'text-[#151A18]/80'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleInquire(pkg.tier)}
                  className={`mt-8 w-full py-3 rounded-full font-semibold text-sm transition ${
                    pkg.popular
                      ? 'bg-[#C5A46D] text-[#151A18] hover:bg-[#d4b682]'
                      : 'bg-[#142C25] text-white hover:bg-[#151A18]'
                  }`}
                >
                  Inquire
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="pt-6 border-t border-[#D8D5CA]">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Preparation &amp; Policies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl">
            {globalFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white border border-[#D8D5CA] rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#F6F5F0]/60 transition"
                  >
                    <span className="font-serif text-lg font-semibold text-[#151A18]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#142C25] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#151A18]/75 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* STICKY BOOKING CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#151A18]/95 backdrop-blur-md border-t border-white/15 text-white py-3.5 px-5 sm:px-10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="hidden sm:block text-[11px] uppercase tracking-wider text-white/60">
              {trek.name}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#C5A46D]">
                From ${trek.startingPrice.toLocaleString()}
              </span>
              <span className="text-xs text-white/70">· {trek.durationLabel}</span>
            </div>
          </div>

          <button
            onClick={() => handleInquire()}
            className="inline-flex items-center gap-2.5 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold text-sm px-6 py-2.5 rounded-full transition"
          >
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}