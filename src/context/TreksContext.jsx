import { createContext, useContext, useState, useEffect } from 'react';
import { treksData as initialTreks } from '../data/treksData';
import { journalArticles as initialArticles } from '../data/journalData';

const TreksContext = createContext(null);

const TREKS_STORAGE_KEY = 'ascentk2_treks_v2';
const INQUIRIES_STORAGE_KEY = 'ascentk2_inquiries_v2';
const JOURNAL_STORAGE_KEY = 'ascentk2_journal_v1';
const CURRENCY_STORAGE_KEY = 'ascentk2_currency_v1';

export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  PKR: { symbol: 'Rs ', rate: 278, label: 'PKR' },
};

const defaultDeparturesForTrek = (trek) => {
  if (trek.departures && trek.departures.length > 0) return trek.departures;
  return [
    {
      id: `${trek.slug}-d1`,
      dates: 'Jun 18 – Jun ' + (18 + Math.min(trek.durationDays, 12)),
      window: 'Summer Opening',
      spotsLeft: 5,
      status: 'Guaranteed',
    },
    {
      id: `${trek.slug}-d2`,
      dates: 'Jul 10 – Jul ' + (10 + Math.min(trek.durationDays, 20)),
      window: 'Peak Karakoram',
      spotsLeft: 3,
      status: 'Guaranteed',
    },
    {
      id: `${trek.slug}-d3`,
      dates: 'Aug 05 – Aug ' + (5 + Math.min(trek.durationDays, 24)),
      window: 'Clear Skies',
      spotsLeft: 6,
      status: 'Available',
    },
  ];
};

const enrichedInitialTreks = initialTreks.map((t) => ({
  ...t,
  departures: defaultDeparturesForTrek(t),
}));

const defaultInquiries = [
  {
    id: 'inq-101',
    fullName: 'Marcus Weber',
    email: 'marcus.weber@example.de',
    phone: '+49 170 5550142',
    interestedIn: 'K2 Base Camp Trek',
    message: 'Looking for a group departure in July for 2 trekkers.',
    status: 'New',
    createdAt: '2025-02-18T10:30:00.000Z',
  },
];

export function TreksProvider({ children }) {
  const [treks, setTreks] = useState(() => {
    try {
      const saved = localStorage.getItem(TREKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : enrichedInitialTreks;
    } catch {
      return enrichedInitialTreks;
    }
  });

  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultInquiries;
    } catch {
      return defaultInquiries;
    }
  });

  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return saved && CURRENCY_RATES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  useEffect(() => {
    localStorage.setItem(TREKS_STORAGE_KEY, JSON.stringify(treks));
  }, [treks]);

  useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  const formatPrice = (usdAmount) => {
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = Math.round(Number(usdAmount || 0) * info.rate);
    return `${info.symbol}${converted.toLocaleString()}`;
  };

  // Trek CRUD
  const addTrek = (newTrek) => {
    const slug =
      newTrek.slug?.trim() ||
      newTrek.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const trekObj = {
      ...newTrek,
      id: Date.now(),
      slug,
      departures: newTrek.departures?.length
        ? newTrek.departures
        : defaultDeparturesForTrek({ ...newTrek, slug }),
    };
    setTreks((prev) => [trekObj, ...prev]);
    return trekObj;
  };

  const updateTrek = (id, updatedFields) => {
    setTreks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)));
  };

  const deleteTrek = (id) => {
    setTreks((prev) => prev.filter((t) => t.id !== id));
  };

  // Journal CRUD
  const addArticle = (newArticle) => {
    const slug =
      newArticle.slug?.trim() ||
      newArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const articleObj = {
      ...newArticle,
      id: Date.now(),
      slug,
    };
    setArticles((prev) => [articleObj, ...prev]);
    return articleObj;
  };

  const updateArticle = (id, updatedFields) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  const deleteArticle = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Inquiry CRUD
  const addInquiry = (inquiry) => {
    const newItem = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteInquiry = (id) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
  };

  const resetDemoData = () => {
    setTreks(enrichedInitialTreks);
    setArticles(initialArticles);
    setInquiries(defaultInquiries);
    localStorage.removeItem(TREKS_STORAGE_KEY);
    localStorage.removeItem(JOURNAL_STORAGE_KEY);
    localStorage.removeItem(INQUIRIES_STORAGE_KEY);
  };

  return (
    <TreksContext.Provider
      value={{
        treks,
        articles,
        inquiries,
        currency,
        setCurrency,
        formatPrice,
        addTrek,
        updateTrek,
        deleteTrek,
        addArticle,
        updateArticle,
        deleteArticle,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        resetDemoData,
      }}
    >
      {children}
    </TreksContext.Provider>
  );
}

export function useTreks() {
  const ctx = useContext(TreksContext);
  if (!ctx) throw new Error('useTreks must be used inside TreksProvider');
  return ctx;
}