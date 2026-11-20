import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#151A18] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <svg width="34" height="24" viewBox="0 0 38 28" fill="none">
                <path
                  d="M2 25L13.5 5L20.5 16.5L25.5 9L36 25H2Z"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 16.5L14 14L17 17.5"
                  stroke="#C5A46D"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-serif text-xl font-semibold tracking-tight">
                AscentK2 <span className="text-[#C5A46D]">Treks</span>
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Premier guided trekking and high-altitude mountaineering expeditions across the
              Karakoram, Hindu Kush, and Western Himalayas. Locally owned in Gilgit-Baltistan since
              2010.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/75 hover:text-[#C5A46D] hover:border-[#C5A46D] transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/75 hover:text-[#C5A46D] hover:border-[#C5A46D] transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/75 hover:text-[#C5A46D] hover:border-[#C5A46D] transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Treks */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold mb-5">
              Signature Treks
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link to="/treks/k2-base-camp" className="hover:text-[#C5A46D] transition">
                  K2 Base Camp Trek
                </Link>
              </li>
              <li>
                <Link to="/treks/shimshal-pass" className="hover:text-[#C5A46D] transition">
                  Shimshal Pass
                </Link>
              </li>
              <li>
                <Link to="/treks/karakoram-grand-traverse" className="hover:text-[#C5A46D] transition">
                  Karakoram Grand Traverse
                </Link>
              </li>
              <li>
                <Link to="/treks/rash-lake-trek" className="hover:text-[#C5A46D] transition">
                  Rash Lake Trek
                </Link>
              </li>
              <li>
                <Link to="/treks" className="inline-flex items-center gap-1 text-[#C5A46D] pt-1">
                  All 10 Treks <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Expeditions */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold mb-5">
              Expeditions
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <Link to="/contact?interest=K2%20Expedition" className="hover:text-[#C5A46D] transition">
                  K2 (8,611m)
                </Link>
              </li>
              <li>
                <Link to="/contact?interest=Broad%20Peak%20Expedition" className="hover:text-[#C5A46D] transition">
                  Broad Peak (8,051m)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C5A46D] transition">
                  Minglik Sar (6,050m)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C5A46D] transition">
                  About Us &amp; Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold mb-5">
              Base Office
            </h4>
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <span>Main Bazaar, Gilgit, Gilgit-Baltistan, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>+92-355-5550192</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <a href="mailto:info@ascentk2treks.com" className="hover:text-[#C5A46D] transition">
                  info@ascentk2treks.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} AscentK2 Treks. All rights reserved.</p>
          <p>IFMGA &amp; Alpine Club of Pakistan Registered Operator · Gilgit-Baltistan</p>
        </div>
      </div>
    </footer>
  );
}