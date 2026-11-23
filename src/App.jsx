import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TreksProvider } from './context/TreksContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import CompareModal from './components/CompareModal';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AllTreksPage from './pages/AllTreksPage';
import TrekDetailPage from './pages/TrekDetailPage';
import JournalPage from './pages/JournalPage';
import AdminPage from './pages/AdminPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/treks" element={<PageTransition><AllTreksPage /></PageTransition>} />
        <Route path="/treks/:slug" element={<PageTransition><TrekDetailPage /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><JournalPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <TreksProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F6F5F0] text-[#151A18]">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <CompareModal />
          <WhatsAppFloat />
        </div>
      </BrowserRouter>
    </TreksProvider>
  );
}