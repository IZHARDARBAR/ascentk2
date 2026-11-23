import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const { pathname } = useLocation();
  const isTrekDetail = pathname.startsWith('/treks/') && pathname !== '/treks';

  // Hide on Admin portal; lift higher on Trek Detail so it never overlaps sticky booking bar
  if (pathname.startsWith('/admin')) return null;

  return (
    <a
      href="https://wa.me/923555550192?text=Hello%20AscentK2%20Treks!%20I%20have%20a%20question%20about%20a%20Karakoram%20trek."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-5 z-40 inline-flex items-center gap-2.5 bg-[#142C25] hover:bg-[#151A18] text-white border border-[#C5A46D]/60 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-0.5 group ${
        isTrekDetail ? 'bottom-20 sm:bottom-24' : 'bottom-6'
      }`}
    >
      <span className="w-7 h-7 rounded-full bg-[#C5A46D] text-[#151A18] flex items-center justify-center">
        <MessageCircle className="w-4 h-4" />
      </span>
      <span className="hidden sm:inline text-xs font-semibold tracking-wide pr-1">
        Chat with Guides
      </span>
    </a>
  );
}