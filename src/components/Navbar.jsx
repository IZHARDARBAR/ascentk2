import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTreks, CURRENCY_RATES } from '../context/TreksContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [treksDropdown, setTreksDropdown] = useState(false);
  const { currency, setCurrency } = useTreks();
  const location = useLocation();
  const navigate = useNavigate();

  const isHeroDarkPage =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname.startsWith('/treks/');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setTreksDropdown(false);
  }, [location.pathname]);

  const handleExpeditionsClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('expeditions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#expeditions');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-white/80 hover:text-white'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHeroDarkPage
            ? 'bg-[#151A18]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
            : 'bg-transparent py-0'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link
            to="/"
            className={`flex items-center gap-3 group ${scrolled || !isHeroDarkPage ? '' : 'py-5'}`}
          >
            <svg
              width="36"
              height="26"
              viewBox="0 0 38 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white group-hover:text-[#C5A46D] transition-colors duration-300"
            >
              <path
                d="M2 25L13.5 5L20.5 16.5L25.5 9L36 25H2Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 16.5L14 14L17 17.5"
                stroke="#C5A46D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white font-semibold text-lg tracking-tight leading-none">
              AscentK2 <span className="text-[#C5A46D]">Treks</span>
            </span>
          </Link>

          {/* Center: Top Frosted Dock */}
          <nav
            className={`hidden lg:flex items-center transition-all duration-300 ${
              scrolled || !isHeroDarkPage
                ? 'gap-7 py-1'
                : 'bg-[#151A18]/55 backdrop-blur-md border-b border-x border-white/15 px-10 pt-4 pb-4 rounded-b-[28px] shadow-xl gap-6'
            }`}
          >
            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Home
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A46D] rounded-full" />
                  )}
                </span>
              )}
            </NavLink>

            <div
              className="relative"
              onMouseEnter={() => setTreksDropdown(true)}
              onMouseLeave={() => setTreksDropdown(false)}
            >
              <NavLink
                to="/treks"
                className={({ isActive }) =>
                  `flex items-center gap-1 py-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-white' : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      Treks
                      {isActive && (
                        <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A46D] rounded-full" />
                      )}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </>
                )}
              </NavLink>

              <AnimatePresence>
                {treksDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full pt-3 w-60"
                  >
                    <div className="bg-[#151A18]/95 backdrop-blur-lg border border-white/15 rounded-xl p-2 shadow-2xl">
                      <Link
                        to="/treks/k2-base-camp"
                        className="block px-3.5 py-2.5 text-xs font-medium text-white/85 hover:text-[#C5A46D] hover:bg-white/5 rounded-lg transition"
                      >
                        K2 Base Camp Trek · 19 Days
                      </Link>
                      <Link
                        to="/treks/shimshal-pass"
                        className="block px-3.5 py-2.5 text-xs font-medium text-white/85 hover:text-[#C5A46D] hover:bg-white/5 rounded-lg transition"
                      >
                        Shimshal Pass · 19 Days
                      </Link>
                      <Link
                        to="/treks/karakoram-grand-traverse"
                        className="block px-3.5 py-2.5 text-xs font-medium text-white/85 hover:text-[#C5A46D] hover:bg-white/5 rounded-lg transition"
                      >
                        Karakoram Grand Traverse · 24 Days
                      </Link>
                      <div className="my-1 border-t border-white/10" />
                      <Link
                        to="/treks"
                        className="block px-3.5 py-2 text-xs font-semibold text-[#C5A46D] hover:bg-white/5 rounded-lg transition"
                      >
                        View All Treks →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/#expeditions"
              onClick={handleExpeditionsClick}
              className="flex items-center gap-1 py-1 text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors"
            >
              <span>Expeditions</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </a>

            <NavLink to="/journal" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Journal
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A46D] rounded-full" />
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  About Us
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A46D] rounded-full" />
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Contact
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A46D] rounded-full" />
                  )}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right: Currency Switcher + Pill CTA + Mobile Hamburger */}
          <div className={`flex items-center gap-3 ${scrolled || !isHeroDarkPage ? '' : 'py-4'}`}>
            {/* Currency Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#151A18]/65 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5 text-white text-xs">
              <Globe className="w-3.5 h-3.5 text-[#C5A46D]" />
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCY_RATES).map((code) => (
                  <option key={code} value={code} className="bg-[#151A18] text-white">
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-3 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold text-sm pl-5 pr-1.5 py-1.5 rounded-full transition-all duration-300 shadow-lg group"
            >
              <span>Plan Your Trek</span>
              <span className="w-8 h-8 rounded-full bg-[#151A18] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2.5 rounded-full bg-[#151A18]/70 border border-white/15 text-white hover:border-[#C5A46D] transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#142C25] text-white p-6 flex flex-col justify-between border-l border-white/10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <span className="font-serif text-xl font-semibold">
                    AscentK2 <span className="text-[#C5A46D]">Treks</span>
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/" className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]">
                    Home
                  </Link>
                  <Link to="/treks" className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]">
                    All Treks
                  </Link>
                  <a
                    href="/#expeditions"
                    onClick={handleExpeditionsClick}
                    className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]"
                  >
                    Expeditions
                  </a>
                  <Link to="/journal" className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]">
                    Journal &amp; Guides
                  </Link>
                  <Link to="/about" className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]">
                    About Us
                  </Link>
                  <Link to="/contact" className="text-lg font-medium py-2 border-b border-white/10 hover:text-[#C5A46D]">
                    Contact
                  </Link>
                </div>

                {/* Mobile Currency Selector */}
                <div className="mt-6 flex items-center justify-between bg-white/10 px-4 py-2.5 rounded-lg">
                  <span className="text-xs uppercase tracking-wider text-white/75">Currency</span>
                  <div className="flex gap-1.5">
                    {Object.keys(CURRENCY_RATES).map((code) => (
                      <button
                        key={code}
                        onClick={() => setCurrency(code)}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          currency === code
                            ? 'bg-[#C5A46D] text-[#151A18]'
                            : 'text-white/75 hover:text-white'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-between bg-[#C5A46D] text-[#151A18] font-semibold px-5 py-3 rounded-full"
                >
                  <span>Plan Your Trek</span>
                  <span className="w-8 h-8 rounded-full bg-[#151A18] text-white flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <p className="text-xs text-white/60 mt-4">Gilgit, Gilgit-Baltistan, Pakistan</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}