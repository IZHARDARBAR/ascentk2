import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import { treksData as initialTreks } from '../data/treksData';
import { journalArticles as initialArticles } from '../data/journalData';

const TreksContext = createContext(null);

const CURRENCY_STORAGE_KEY = 'ascentk2_currency_v1';

export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  PKR: { symbol: 'Rs ', rate: 278, label: 'PKR' },
};

const initialTrailStatuses = [
  { id: 'baltoro', name: 'Baltoro Glacier Corridor', status: 'Open', note: 'Dry moraine & stable camps' },
  { id: 'gondogoro', name: 'Gondogoro La (5,585m)', status: 'Open', note: 'Fixed lines active' },
  { id: 'shimshal', name: 'Shimshal Pass (4,735m)', status: 'Open', note: 'Jeep track & trails clear' },
  { id: 'fairy', name: 'Fairy Meadows & Nanga Parbat', status: 'Open', note: 'All cabins operational' },
];

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

export function TreksProvider({ children }) {
  const [treks, setTreks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [trailStatuses, setTrailStatuses] = useState(initialTrailStatuses);
  const [inquiries, setInquiries] = useState([]);

  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(isFirebaseConfigured);
  const [dbSynced, setDbSynced] = useState(false);

  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return saved && CURRENCY_RATES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Public Firestore Real-Time Listeners
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoadingData(false);
      return;
    }

    const unsubTreks = onSnapshot(
      collection(db, 'treks'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        setTreks(list);
        setDbSynced(list.length > 0);
        setLoadingData(false);
      },
      () => {
        setLoadingData(false);
      }
    );

    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      setArticles(list);
    });

    const unsubTrails = onSnapshot(collection(db, 'trailStatuses'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        setTrailStatuses(list);
      }
    });

    return () => {
      unsubTreks();
      unsubArticles();
      unsubTrails();
    };
  }, []);

  // 3. Protected Firestore Listener for Inquiries
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !adminUser) {
      setInquiries([]);
      return;
    }

    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubInquiries = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      setInquiries(list);
    });

    return () => unsubInquiries();
  }, [adminUser]);

  const loginAdmin = async (email, password) => {
    if (!auth) throw new Error('Firebase is not configured. Check your .env file.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutAdmin = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const uploadImage = async (file, folder = 'ascentk2') => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Add VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET in .env (or paste an image URL directly).'
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || 'Cloudinary upload failed');
    }
    return data.secure_url;
  };

  const seedDefaultDataToFirestore = async () => {
    if (!db) throw new Error('Firestore not configured.');
    const batch = writeBatch(db);

    enrichedInitialTreks.forEach((trek) => {
      const refDoc = doc(db, 'treks', trek.slug);
      batch.set(refDoc, { ...trek, id: trek.slug });
    });

    initialArticles.forEach((art) => {
      const refDoc = doc(db, 'articles', art.slug);
      batch.set(refDoc, { ...art, id: art.slug });
    });

    initialTrailStatuses.forEach((trail) => {
      const refDoc = doc(db, 'trailStatuses', trail.id);
      batch.set(refDoc, trail);
    });

    await batch.commit();
    setDbSynced(true);
  };

  const formatPrice = (usdAmount) => {
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = Math.round(Number(usdAmount || 0) * info.rate);
    return `${info.symbol}${converted.toLocaleString()}`;
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);

  const updateTrailStatus = async (id, updates) => {
    if (db && adminUser) {
      await setDoc(
        doc(db, 'trailStatuses', String(id)),
        { ...trailStatuses.find((t) => t.id === id), ...updates },
        { merge: true }
      );
    }
  };

  const addTrek = async (newTrek) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    const slug =
      newTrek.slug?.trim() ||
      newTrek.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const trekObj = {
      ...newTrek,
      id: slug,
      slug,
      departures: newTrek.departures?.length
        ? newTrek.departures
        : defaultDeparturesForTrek({ ...newTrek, slug }),
    };

    await setDoc(doc(db, 'treks', slug), trekObj);
    return trekObj;
  };

  const updateTrek = async (id, updatedFields) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await updateDoc(doc(db, 'treks', String(id)), updatedFields);
  };

  const deleteTrek = async (id) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await deleteDoc(doc(db, 'treks', String(id)));
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
  };

  const addArticle = async (newArticle) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    const slug =
      newArticle.slug?.trim() ||
      newArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const articleObj = { ...newArticle, id: slug, slug };
    await setDoc(doc(db, 'articles', slug), articleObj);
    return articleObj;
  };

  const updateArticle = async (id, updatedFields) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await updateDoc(doc(db, 'articles', String(id)), updatedFields);
  };

  const deleteArticle = async (id) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await deleteDoc(doc(db, 'articles', String(id)));
  };

  const addInquiry = async (inquiry) => {
    if (!db) throw new Error('Firestore not configured.');
    const payload = {
      ...inquiry,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'inquiries'), payload);
    return { ...payload, id: docRef.id };
  };

  const updateInquiryStatus = async (id, status) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await updateDoc(doc(db, 'inquiries', String(id)), { status });
  };

  const deleteInquiry = async (id) => {
    if (!db || !adminUser) throw new Error('Admin login required.');
    await deleteDoc(doc(db, 'inquiries', String(id)));
  };

  return (
    <TreksContext.Provider
      value={{
        treks,
        articles,
        inquiries,
        trailStatuses,
        currency,
        setCurrency,
        formatPrice,
        compareIds,
        toggleCompare,
        clearCompare,
        adminUser,
        authLoading,
        loadingData,
        dbSynced,
        loginAdmin,
        logoutAdmin,
        uploadImage,
        seedDefaultDataToFirestore,
        updateTrailStatus,
        addTrek,
        updateTrek,
        deleteTrek,
        addArticle,
        updateArticle,
        deleteArticle,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
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