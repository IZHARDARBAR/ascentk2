import { useState, useEffect, useMemo } from 'react';
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
  Download,
  Backpack,
  Users,
  ZoomIn,
  ShieldCheck,
  Activity,
  Compass,
  Calculator,
  Search,
  FileText,
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
import { globalFaqs } from '../data/treksData';
import { useTreks } from '../context/TreksContext';
import LightboxModal from '../components/LightboxModal';
import RouteMap from '../components/RouteMap';
import { openBrandedDossierPDF } from '../utils/dossierPdf';

const getGearCategories = (difficulty) => {
  const baseGear = [
    {
      category: 'Layering & Clothing',
      items: [
        'Moisture-wicking merino base layers (top & bottom)',
        'Mid-weight fleece or synthetic insulated jacket',
        'Waterproof & windproof Gore-Tex shell jacket and pants',
        'Heavy expedition down jacket (-15°C rated)',
        'Warm beanie, sun hat, neck gaiter (Buff), and liner gloves',
      ],
    },
    {
      category: 'Footwear & Trekking',
      items: [
        'Broken-in waterproof high-ankle trekking boots',
        '4–5 pairs merino wool trekking socks + liner socks',
        'Camp shoes / insulated down booties for evenings',
        'Adjustable trekking poles with snow/mud baskets',
      ],
    },
    {
      category: 'Sleeping & Essentials',
      items: [
        '-15°C to -20°C four-season down sleeping bag',
        '45L–55L daypack + 80L waterproof expedition duffel',
        'Category 4 glacier sunglasses + UV lip balm & SPF 50',
        'Headlamp with spare batteries & 2x 1L insulated Nalgene bottles',
      ],
    },
  ];

  if (difficulty === 'Hard' || difficulty === 'Extreme') {
    baseGear.push({
      category: 'Technical & Glacier Gear',
      items: [
        '12-point mountaineering crampons (for Gondogoro La / high passes)',
        'UIAA climbing helmet, alpine harness, and 2 locking carabiners',
        'Ascender (Jumar) & Figure-8 descender for fixed snow lines',
        'Waterproof gaiters & insulated expedition mittens',
      ],
    });
  }

  return baseGear;
};

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { treks, formatPrice } = useTreks();

  const trek = treks.find((t) => t.slug === slug);

  const [openDay, setOpenDay] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);

  // Interactive Trip Cost Calculator State
  const [calcGroupSize, setCalcGroupSize] = useState('6+');
  const [addSingleTent, setAddSingleTent] = useState(false);
  const [addGearRental, setAddGearRental] = useState(false);
  const [addExtraPorter, setAddExtraPorter] = useState(false);

  const gearStorageKey = `ascentk2_gear_${slug}`;
  const [checkedGear, setCheckedGear] = useState(() => {
    try {
      const saved = localStorage.getItem(gearStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (trek) {
      document.title = `${trek.name} (${trek.durationLabel}) | AscentK2 Treks`;
    } else {
      document.title = 'Trek Not Found | AscentK2 Treks';
    }
  }, [trek]);

  useEffect(() => {
    setOpenDay(0);
    setOpenFaq(0);
    setFaqSearch('');
    setLightboxIndex(null);
    try {
      const saved = localStorage.getItem(gearStorageKey);
      setCheckedGear(saved ? JSON.parse(saved) : {});
    } catch {
      setCheckedGear({});
    }
  }, [slug, gearStorageKey]);

  useEffect(() => {
    localStorage.setItem(gearStorageKey, JSON.stringify(checkedGear));
  }, [checkedGear, gearStorageKey]);

  useEffect(() => {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  const sortedItinerary = useMemo(() => {
    return [...(trek?.itinerary || [])].sort((a, b) => Number(a.day) - Number(b.day));
  }, [trek]);

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return globalFaqs;
    const q = faqSearch.toLowerCase();
    return globalFaqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [faqSearch]);

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

  // Calculator Total
  const baseCalcTier =
    calcGroupSize === '6+'
      ? standardPrice
      : calcGroupSize === '4-5'
      ? premiumPrice
      : privatePrice;
  const addOnTotal =
    (addSingleTent ? 250 : 0) + (addGearRental ? 160 : 0) + (addExtraPorter ? 220 : 0);
  const calculatedPerPersonUsd = baseCalcTier + addOnTotal;

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

  const galleryList = trek.gallery || [];
  const allPhotos = [trek.cardImage, ...galleryList].filter(Boolean);
  const overviewList = trek.overview || [];
  const highlightsList = trek.highlights || [];
  const inclusionsList = trek.inclusions || [];
  const exclusionsList = trek.exclusions || [];
  const departuresList = trek.departures || [];
  const gearCategories = getGearCategories(trek.difficulty);
  const totalGearItems = gearCategories.reduce((acc, c) => acc + c.items.length, 0);
  const packedCount = Object.values(checkedGear).filter(Boolean).length;

  const chartData = sortedItinerary.map((item) => ({
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

  const handleInquire = (extraNote = '') => {
    const note = extraNote ? `&package=${encodeURIComponent(extraNote)}` : '';
    navigate(`/contact?interest=${encodeURIComponent(trek.name)}${note}`);
  };

  const handleCustomQuoteBook = () => {
    const addOns = [
      addSingleTent && 'Private Single Tent (+$250)',
      addGearRental && 'Expedition Gear Kit (+$160)',
      addExtraPorter && 'Extra 15kg Porter (+$220)',
    ]
      .filter(Boolean)
      .join(', ');
    const summary = `Group: ${calcGroupSize}${addOns ? ` | Add-ons: ${addOns}` : ''} | Estimate: ${formatPrice(
      calculatedPerPersonUsd
    )}/person`;
    handleInquire(summary);
  };

  return (
    <div className="bg-[#F6F5F0] pb-24">
      {/* TREK HERO */}
      <section className="relative min-h-[75vh] flex items-end bg-[#151A18] text-white pt-32 pb-14">
        <img
          src={trek.heroImage || trek.cardImage}
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

            <div className="bg-[#151A18]/85 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:w-72 shrink-0 space-y-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/60">Starting Price</span>
                <div className="font-serif text-4xl font-bold text-[#C5A46D] mt-1">
                  {formatPrice(trek.startingPrice)}
                  <span className="text-sm font-sans font-normal text-white/60"> /person</span>
                </div>
              </div>

              <button
                onClick={() => handleInquire()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold py-3 rounded-full transition"
              >
                <span>Inquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  openBrandedDossierPDF(
                    trek,
                    formatPrice(trek.startingPrice),
                    sortedItinerary,
                    gearCategories
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 border border-white/25 hover:border-[#C5A46D] text-white text-xs font-semibold py-2.5 rounded-full transition"
              >
                <FileText className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>Download PDF Brochure</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY SECTION NAVIGATION */}
      <div className="sticky top-[58px] sm:top-[62px] z-30 bg-white/95 backdrop-blur-md border-b border-[#D8D5CA] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-6 sm:gap-9 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'departures', label: 'Departures' },
            { id: 'itinerary', label: 'Itinerary & Map' },
            { id: 'gear', label: 'Gear List' },
            { id: 'inclusions', label: 'Inclusions' },
            { id: 'pricing', label: 'Calculator & Pricing' },
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
        {/* 1. OVERVIEW + LIGHTBOX + SAFETY BANNER */}
        <section id="overview" className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
                Route Overview
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18]">
                Expedition Experience
              </h2>
              {overviewList.length > 0 ? (
                overviewList.map((paragraph, i) => (
                  <p key={i} className="text-base text-[#151A18]/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base text-[#151A18]/80 leading-relaxed">{trek.tagline}</p>
              )}

              {highlightsList.length > 0 && (
                <div className="pt-4">
                  <h3 className="font-serif text-xl font-semibold text-[#151A18] mb-4">
                    Key Highlights
                  </h3>
                  <ul className="space-y-3">
                    {highlightsList.map((hl, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#151A18]/80">
                        <Check className="w-4 h-4 text-[#142C25] shrink-0 mt-1" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {allPhotos.slice(0, 3).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`group relative overflow-hidden rounded-lg shadow-sm text-left ${
                    i === 0 ? 'col-span-2 h-64' : 'h-44'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${trek.name} gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-[#151A18]/80 text-white flex items-center justify-center">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#142C25] text-white rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-[#C5A46D]/30">
            <div className="flex items-start gap-3.5">
              <Activity className="w-6 h-6 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-semibold">Twice-Daily SpO2 Checks</h4>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Pulse oximetry &amp; Lake Louise altitude scoring every morning and evening.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-semibold">Gamow Bag &amp; Medical O2</h4>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Portable hyperbaric chamber &amp; emergency oxygen carried on all high routes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <Compass className="w-6 h-6 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-semibold">Satellite &amp; Heli Rescue</h4>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Thuraya satellite comms &amp; direct Askari Aviation helicopter evacuation chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FIXED GROUP DEPARTURES */}
        <section id="departures" className="pt-6 border-t border-[#D8D5CA]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
                Join a Small Group
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
                Upcoming Group Departures
              </h2>
            </div>
            <span className="text-xs font-medium text-[#142C25] bg-white border border-[#D8D5CA] px-4 py-2 rounded-full">
              Solo travelers welcome · No forced single supplement
            </span>
          </div>

          <div className="space-y-3">
            {departuresList.map((dep) => (
              <div
                key={dep.id}
                className="bg-white border border-[#D8D5CA] rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#142C25] transition"
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#C5A46D]" />
                    <span className="font-serif text-lg font-semibold text-[#151A18]">
                      {dep.dates}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#151A18]/65">{dep.window}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142C25] bg-[#F6F5F0] px-3 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5 text-[#C5A46D]" />
                    {dep.spotsLeft} Spots Left
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-[#142C25] text-[#C5A46D] text-[11px] font-semibold uppercase tracking-wider">
                    {dep.status} Departure
                  </span>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                  <span className="font-serif text-xl font-bold text-[#142C25]">
                    {formatPrice(trek.startingPrice)}
                  </span>
                  <button
                    onClick={() => handleInquire(`Departure: ${dep.dates}`)}
                    className="px-5 py-2.5 rounded-full bg-[#142C25] hover:bg-[#151A18] text-white text-xs font-semibold transition"
                  >
                    Reserve Spot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. ROUTE MAP + ELEVATION PROFILE + ITINERARY */}
        <section id="itinerary" className="space-y-10 pt-6 border-t border-[#D8D5CA]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Acclimatization &amp; Route
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              Interactive Route Map &amp; Itinerary
            </h2>
          </div>

          <RouteMap
            itinerary={sortedItinerary}
            selectedDayIndex={openDay}
            onSelectDay={(idx) => setOpenDay(idx)}
          />

          {chartData.length > 1 && (
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
          )}

          <div className="space-y-3">
            {sortedItinerary.map((dayItem, idx) => {
              const isOpen = openDay === idx;
              return (
                <div
                  key={`${dayItem.day}-${idx}`}
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

        {/* 4. GEAR & PACKING CHECKLIST */}
        <section id="gear" className="pt-6 border-t border-[#D8D5CA] space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
                Saved Automatically in Your Browser
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
                Gear &amp; Packing List
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#142C25] bg-white border border-[#D8D5CA] px-4 py-2.5 rounded-full">
                <Backpack className="w-4 h-4 text-[#C5A46D]" />
                <span>
                  {packedCount} / {totalGearItems} Packed
                </span>
              </div>
              {packedCount > 0 && (
                <button
                  onClick={() => setCheckedGear({})}
                  className="text-xs font-semibold text-[#151A18]/70 hover:text-red-600 px-3 py-2"
                >
                  Clear List
                </button>
              )}
              <button
                onClick={() =>
                  openBrandedDossierPDF(
                    trek,
                    formatPrice(trek.startingPrice),
                    sortedItinerary,
                    gearCategories
                  )
                }
                className="inline-flex items-center gap-2 bg-[#142C25] hover:bg-[#151A18] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition"
              >
                <Download className="w-4 h-4 text-[#C5A46D]" />
                <span>Download PDF Brochure</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gearCategories.map((group) => (
              <div
                key={group.category}
                className="bg-white border border-[#D8D5CA] rounded-xl p-6 space-y-4"
              >
                <h3 className="font-serif text-xl font-semibold text-[#142C25]">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item) => {
                    const checked = Boolean(checkedGear[item]);
                    return (
                      <li key={item}>
                        <label className="flex items-start gap-3 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setCheckedGear((prev) => ({ ...prev, [item]: !prev[item] }))
                            }
                            className="mt-1 w-4 h-4 accent-[#142C25] rounded"
                          />
                          <span
                            className={
                              checked ? 'line-through text-[#151A18]/45' : 'text-[#151A18]/85'
                            }
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INCLUSIONS & EXCLUSIONS */}
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
                {inclusionsList.map((inc, i) => (
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
                {exclusionsList.map((exc, i) => (
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

        {/* 6. INTERACTIVE TRIP COST CALCULATOR + PRICING PACKAGES */}
        <section id="pricing" className="pt-6 border-t border-[#D8D5CA] space-y-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Departure Tiers &amp; Custom Quote
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
              Pricing &amp; Cost Estimator
            </h2>
          </div>

          {/* Interactive Cost Estimator */}
          <div className="bg-[#142C25] text-white rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A46D] font-semibold">
                <Calculator className="w-4 h-4" />
                <span>Interactive Trip Cost Calculator</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/75 mb-2.5">
                  1. Select Group Size
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { key: '6+', label: 'Group of 6+ (Standard)' },
                    { key: '4-5', label: 'Group of 4–5 (Premium)' },
                    { key: '1-2', label: 'Solo or 2 People (Private)' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setCalcGroupSize(opt.key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                        calcGroupSize === opt.key
                          ? 'bg-[#C5A46D] text-[#151A18]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/75 mb-2.5">
                  2. Optional Add-Ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 bg-white/10 p-3 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addSingleTent}
                      onChange={(e) => setAddSingleTent(e.target.checked)}
                      className="accent-[#C5A46D]"
                    />
                    <span>Private Tent (+{formatPrice(250)})</span>
                  </label>
                  <label className="flex items-center gap-2.5 bg-white/10 p-3 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addGearRental}
                      onChange={(e) => setAddGearRental(e.target.checked)}
                      className="accent-[#C5A46D]"
                    />
                    <span>Full Gear Rental (+{formatPrice(160)})</span>
                  </label>
                  <label className="flex items-center gap-2.5 bg-white/10 p-3 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addExtraPorter}
                      onChange={(e) => setAddExtraPorter(e.target.checked)}
                      className="accent-[#C5A46D]"
                    />
                    <span>Extra 15kg Porter (+{formatPrice(220)})</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#151A18] rounded-xl p-6 border border-white/15 space-y-4">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Estimated Cost Per Person
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-[#C5A46D]">
                {formatPrice(calculatedPerPersonUsd)}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Includes base expedition ({formatPrice(baseCalcTier)}) + selected upgrades (
                {formatPrice(addOnTotal)}). Zero hidden permit charges.
              </p>
              <button
                onClick={handleCustomQuoteBook}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold py-3 rounded-full text-sm transition"
              >
                <span>Lock In This Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Standard Tiers */}
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
                      {formatPrice(pkg.price)}
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

        {/* 7. SEARCHABLE FAQ ACCORDION */}
        <section id="faq" className="pt-6 border-t border-[#D8D5CA]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
                Preparation &amp; Policies
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#151A18]/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search permits, gear, season..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D8D5CA] rounded-full text-sm focus:outline-none focus:border-[#142C25]"
              />
            </div>
          </div>

          <div className="space-y-3 max-w-4xl">
            {filteredFaqs.map((faq, idx) => {
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
            {filteredFaqs.length === 0 && (
              <p className="text-sm text-[#151A18]/65">No matching FAQ found for &ldquo;{faqSearch}&rdquo;.</p>
            )}
          </div>
        </section>
      </div>

      {/* FOOTER-AWARE STICKY BOOKING CTA */}
      <AnimatePresence>
        {!footerVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#151A18]/95 backdrop-blur-md border-t border-white/15 text-white py-3.5 px-5 sm:px-10 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div>
                <span className="hidden sm:block text-[11px] uppercase tracking-wider text-white/60">
                  {trek.name}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#C5A46D]">
                    From {formatPrice(trek.startingPrice)}
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
          </motion.div>
        )}
      </AnimatePresence>

      <LightboxModal
        images={allPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
