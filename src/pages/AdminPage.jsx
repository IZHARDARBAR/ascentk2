import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Mountain,
  Inbox,
  Database,
  BookOpen,
  Compass,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  Star,
  ExternalLink,
  Lock,
  CheckCircle2,
  Calendar,
  LogOut,
  Upload,
} from 'lucide-react';
import { useTreks } from '../context/TreksContext';
import { isFirebaseConfigured } from '../firebase/config';

const emptyTrekTemplate = {
  name: '',
  slug: '',
  tagline: '',
  durationDays: 10,
  durationLabel: '10 Days',
  difficulty: 'Moderate',
  maxAltitude: '4,500m',
  location: 'Gilgit-Baltistan, Pakistan',
  bestSeason: 'June – September',
  startingPrice: 1500,
  featured: false,
  heroImage:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85',
  cardImage:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80',
  ],
  overview: [''],
  highlights: [''],
  inclusions: ['Certified local guide & support crew', 'All camping permits & hot meals'],
  exclusions: ['International airfare & visa', 'Travel & evacuation insurance'],
  departures: [
    {
      id: 'dep-1',
      dates: 'Jul 10 – Jul 20',
      window: 'Peak Summer',
      spotsLeft: 5,
      status: 'Guaranteed',
    },
  ],
  itinerary: [
    {
      day: 1,
      route: 'Arrival & Briefing',
      elevation: '1,500m',
      elevationNum: 1500,
      accommodation: 'Mountain Lodge',
      description: 'Welcome briefing, gear inspection, and orientation.',
    },
  ],
};

const emptyArticleTemplate = {
  title: '',
  slug: '',
  category: 'Expedition Guide',
  readTime: '5 min read',
  date: 'March 2025',
  author: 'Ahmed Khan · IFMGA Lead Guide',
  coverImage:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
  excerpt: '',
  content: [''],
};

export default function AdminPage() {
  const {
    treks,
    articles,
    inquiries,
    trailStatuses,
    adminUser,
    authLoading,
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
    updateInquiryStatus,
    deleteInquiry,
  } = useTreks();

  useEffect(() => {
    document.title = 'Admin Operations Portal | AscentK2 Treks';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [activeTab, setActiveTab] = useState('treks');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingTrek, setEditingTrek] = useState(null);
  const [isCreatingTrek, setIsCreatingTrek] = useState(false);

  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  const [uploadingField, setUploadingField] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      setSigningIn(true);
      await loginAdmin(email.trim(), password);
    } catch (err) {
      setAuthError(err.message || 'Invalid admin email or password.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleFileUpload = async (file, folder, onSuccess) => {
    if (!file) return;
    try {
      setUploadingField(folder);
      const url = await uploadImage(file, folder);
      onSuccess(url);
      showToast('Photo uploaded to Firebase Storage!');
    } catch (err) {
      showToast('Upload failed: ' + err.message);
    } finally {
      setUploadingField('');
    }
  };

  const handleSeedCloud = async () => {
    try {
      setSaving(true);
      await seedDefaultDataToFirestore();
      showToast('All 10 default treks, journal & trails synced to Firestore!');
    } catch (err) {
      showToast('Seed error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- TREK HANDLERS ----------------
  const openCreateTrek = () => {
    setActiveTab('treks');
    setEditingArticle(null);
    setIsCreatingTrek(true);
    setEditingTrek(JSON.parse(JSON.stringify(emptyTrekTemplate)));
  };

  const openEditTrek = (trek) => {
    setEditingArticle(null);
    setIsCreatingTrek(false);
    const cloned = JSON.parse(JSON.stringify(trek));
    if (!cloned.departures) cloned.departures = [];
    if (!cloned.gallery) cloned.gallery = ['', ''];
    if (!cloned.overview) cloned.overview = [''];
    if (!cloned.highlights) cloned.highlights = [''];
    if (!cloned.inclusions) cloned.inclusions = [''];
    if (!cloned.exclusions) cloned.exclusions = [''];
    if (!cloned.itinerary) cloned.itinerary = [];
    setEditingTrek(cloned);
  };

  const handleSaveTrek = async (e) => {
    e.preventDefault();
    if (!editingTrek.name.trim()) return;

    const cleanTrek = {
      ...editingTrek,
      durationDays: Number(editingTrek.durationDays) || 1,
      durationLabel: `${Number(editingTrek.durationDays) || 1} Days`,
      startingPrice: Number(editingTrek.startingPrice) || 0,
      gallery: (editingTrek.gallery || []).filter((g) => g.trim() !== ''),
      overview: (editingTrek.overview || []).filter((p) => p.trim() !== ''),
      highlights: (editingTrek.highlights || []).filter((h) => h.trim() !== ''),
      inclusions: (editingTrek.inclusions || []).filter((i) => i.trim() !== ''),
      exclusions: (editingTrek.exclusions || []).filter((ex) => ex.trim() !== ''),
      departures: (editingTrek.departures || []).map((d) => ({
        ...d,
        spotsLeft: Number(d.spotsLeft) || 0,
      })),
      itinerary: (editingTrek.itinerary || [])
        .map((item) => ({
          ...item,
          day: Number(item.day) || 1,
          elevationNum: Number(item.elevationNum) || 0,
        }))
        .sort((a, b) => a.day - b.day),
    };

    try {
      setSaving(true);
      if (isCreatingTrek) {
        await addTrek(cleanTrek);
        showToast('New trek saved to Cloud Firestore!');
      } else {
        await updateTrek(cleanTrek.id, cleanTrek);
        showToast('Trek updated in Cloud Firestore!');
      }
      setEditingTrek(null);
    } catch (err) {
      showToast('Error saving trek: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItineraryDay = () => {
    const nextDayNum =
      editingTrek.itinerary.length > 0
        ? Number(editingTrek.itinerary[editingTrek.itinerary.length - 1].day) + 1
        : 1;

    setEditingTrek((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: nextDayNum,
          route: '',
          elevation: '3,000m',
          elevationNum: 3000,
          accommodation: 'Expedition Camp',
          description: '',
        },
      ],
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    setEditingTrek((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const removeItineraryDay = (index) => {
    setEditingTrek((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const addDeparture = () => {
    setEditingTrek((prev) => ({
      ...prev,
      departures: [
        ...(prev.departures || []),
        {
          id: `dep-${Date.now()}`,
          dates: 'Aug 10 – Aug 22',
          window: 'Late Summer',
          spotsLeft: 6,
          status: 'Available',
        },
      ],
    }));
  };

  const updateDeparture = (index, field, value) => {
    setEditingTrek((prev) => {
      const updated = [...(prev.departures || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, departures: updated };
    });
  };

  const removeDeparture = (index) => {
    setEditingTrek((prev) => ({
      ...prev,
      departures: (prev.departures || []).filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (listKey, idx, value) => {
    setEditingTrek((prev) => {
      const next = [...(prev[listKey] || [])];
      next[idx] = value;
      return { ...prev, [listKey]: next };
    });
  };

  const addListItem = (listKey) => {
    setEditingTrek((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), ''],
    }));
  };

  const removeListItem = (listKey, idx) => {
    setEditingTrek((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((_, i) => i !== idx),
    }));
  };

  // ---------------- JOURNAL HANDLERS ----------------
  const openCreateArticle = () => {
    setActiveTab('journal');
    setEditingTrek(null);
    setIsCreatingArticle(true);
    setEditingArticle(JSON.parse(JSON.stringify(emptyArticleTemplate)));
  };

  const openEditArticle = (article) => {
    setEditingTrek(null);
    setIsCreatingArticle(false);
    const cloned = JSON.parse(JSON.stringify(article));
    if (!cloned.content || cloned.content.length === 0) cloned.content = [''];
    setEditingArticle(cloned);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!editingArticle.title.trim()) return;

    const cleanArticle = {
      ...editingArticle,
      content: (editingArticle.content || []).filter((p) => p.trim() !== ''),
    };

    try {
      setSaving(true);
      if (isCreatingArticle) {
        await addArticle(cleanArticle);
        showToast('Article published to Cloud Firestore!');
      } else {
        await updateArticle(cleanArticle.id, cleanArticle);
        showToast('Article updated in Cloud Firestore!');
      }
      setEditingArticle(null);
    } catch (err) {
      showToast('Error saving article: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateArticleParagraph = (idx, value) => {
    setEditingArticle((prev) => {
      const next = [...prev.content];
      next[idx] = value;
      return { ...prev, content: next };
    });
  };

  const addArticleParagraph = () => {
    setEditingArticle((prev) => ({
      ...prev,
      content: [...prev.content, ''],
    }));
  };

  const removeArticleParagraph = (idx) => {
    setEditingArticle((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== idx),
    }));
  };

  const filteredTreks = treks.filter(
    (t) =>
      (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#151A18] flex items-center justify-center text-white">
        <span className="text-sm tracking-widest uppercase text-[#C5A46D]">
          Verifying Session...
        </span>
      </div>
    );
  }

  // Firebase Config Warning / Real Login Gate
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#151A18] flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-md bg-[#142C25] border border-white/15 rounded-2xl p-8 text-white shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#C5A46D]/20 text-[#C5A46D] flex items-center justify-center mb-5">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl font-semibold">Admin Sign In</h1>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">
            Sign in with your Firebase Admin Email &amp; Password to manage treks, itineraries,
            journal articles, and customer inquiries.
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-4 p-3 rounded-lg bg-red-900/40 border border-red-400/40 text-xs text-red-200">
              Firebase environment variables (.env) are not set yet. Add your{' '}
              <code>VITE_FIREBASE_*</code> keys and restart the dev server.
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ascentk2treks.com"
                className="w-full px-4 py-3 rounded-lg bg-[#151A18] border border-white/20 text-white text-sm focus:outline-none focus:border-[#C5A46D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#151A18] border border-white/20 text-white text-sm focus:outline-none focus:border-[#C5A46D]"
              />
            </div>
            {authError && <p className="text-xs text-red-400">{authError}</p>}
            <button
              type="submit"
              disabled={signingIn || !isFirebaseConfigured}
              className="w-full bg-[#C5A46D] hover:bg-[#d4b682] disabled:opacity-50 text-[#151A18] font-semibold py-3 rounded-full text-sm transition"
            >
              {signingIn ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F0] pt-28 pb-20">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142C25] text-white border border-[#C5A46D] px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#D8D5CA]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Signed in as {adminUser.email} · {dbSynced ? 'Firestore Live' : 'Local Fallback'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!dbSynced && (
              <button
                onClick={handleSeedCloud}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#142C25] bg-[#142C25]/10 text-xs font-semibold text-[#142C25] hover:bg-[#142C25] hover:text-white transition"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Seed Default Data to Firestore</span>
              </button>
            )}
            <button
              onClick={openCreateArticle}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Journal Post</span>
            </button>
            <button
              onClick={openCreateTrek}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#142C25] hover:bg-[#151A18] text-white text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C5A46D]" />
              <span>Add New Trek</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D8D5CA] bg-white text-xs font-semibold text-[#151A18] hover:border-red-500 hover:text-red-600 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 py-6">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'treks', label: `Treks & Itineraries (${treks.length})`, icon: Mountain },
            { id: 'journal', label: `Journal (${articles.length})`, icon: BookOpen },
            { id: 'trails', label: 'Trail Conditions', icon: Compass },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingTrek(null);
                setEditingArticle(null);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-[#142C25] text-white shadow-sm'
                  : 'bg-white text-[#151A18]/80 border border-[#D8D5CA] hover:border-[#142C25]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && !editingTrek && !editingArticle && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#D8D5CA] rounded-xl p-6">
              <span className="text-xs uppercase tracking-wider text-[#151A18]/60">Total Treks</span>
              <div className="font-serif text-4xl font-bold text-[#142C25] mt-2">{treks.length}</div>
            </div>
            <div className="bg-white border border-[#D8D5CA] rounded-xl p-6">
              <span className="text-xs uppercase tracking-wider text-[#151A18]/60">Journal Articles</span>
              <div className="font-serif text-4xl font-bold text-[#C5A46D] mt-2">{articles.length}</div>
            </div>
            <div className="bg-white border border-[#D8D5CA] rounded-xl p-6">
              <span className="text-xs uppercase tracking-wider text-[#151A18]/60">Total Inquiries</span>
              <div className="font-serif text-4xl font-bold text-[#142C25] mt-2">{inquiries.length}</div>
            </div>
            <div className="bg-white border border-[#D8D5CA] rounded-xl p-6">
              <span className="text-xs uppercase tracking-wider text-[#151A18]/60">New Leads</span>
              <div className="font-serif text-4xl font-bold text-[#151A18] mt-2">
                {inquiries.filter((i) => i.status === 'New').length}
              </div>
            </div>
          </div>
        )}

        {/* TREKS LIST */}
        {activeTab === 'treks' && !editingTrek && (
          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#151A18]/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search treks by name or valley..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D8D5CA] rounded-full text-sm focus:outline-none focus:border-[#142C25]"
              />
            </div>

            <div className="bg-white border border-[#D8D5CA] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#142C25] text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Trek Name</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Difficulty</th>
                      <th className="px-6 py-4">Itinerary</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Featured</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D5CA]/60">
                    {filteredTreks.map((trek) => (
                      <tr key={trek.id} className="hover:bg-[#F6F5F0]/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#151A18]">{trek.name}</div>
                          <div className="text-xs text-[#151A18]/60">{trek.location}</div>
                        </td>
                        <td className="px-6 py-4">{trek.durationLabel}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#F6F5F0] border border-[#D8D5CA]">
                            {trek.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#142C25] font-medium">
                          {trek.itinerary?.length || 0} Stops
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ${Number(trek.startingPrice).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={async () => {
                              await updateTrek(trek.id, { featured: !trek.featured });
                              showToast(`Updated featured status for ${trek.name}`);
                            }}
                            className={`p-1.5 rounded-full transition ${
                              trek.featured
                                ? 'text-[#C5A46D] bg-[#142C25]'
                                : 'text-[#151A18]/30 hover:text-[#151A18]'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${trek.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/treks/${trek.slug}`}
                              className="p-2 rounded-lg border border-[#D8D5CA] hover:border-[#142C25] text-[#151A18]/75"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openEditTrek(trek)}
                              className="p-2 rounded-lg border border-[#D8D5CA] hover:border-[#142C25] text-[#142C25]"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                await deleteTrek(trek.id);
                                showToast(`Deleted ${trek.name}`);
                              }}
                              className="p-2 rounded-lg border border-[#D8D5CA] hover:border-red-500 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT TREK */}
        {editingTrek && (
          <form
            onSubmit={handleSaveTrek}
            className="bg-white border border-[#D8D5CA] rounded-xl p-6 sm:p-10 space-y-10 shadow-sm"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#D8D5CA]">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#151A18]">
                  {isCreatingTrek ? 'Create New Trek & Itinerary' : `Editing: ${editingTrek.name}`}
                </h2>
                <p className="text-xs text-[#151A18]/60 mt-1">
                  Saves directly to Cloud Firestore in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTrek(null)}
                className="p-2 rounded-full border border-[#D8D5CA] hover:bg-[#F6F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Trek Name *
                </label>
                <input
                  required
                  type="text"
                  value={editingTrek.name}
                  onChange={(e) => setEditingTrek({ ...editingTrek, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  URL Slug (auto if blank)
                </label>
                <input
                  type="text"
                  disabled={!isCreatingTrek}
                  value={editingTrek.slug}
                  onChange={(e) => setEditingTrek({ ...editingTrek, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm disabled:bg-[#F6F5F0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingTrek.location}
                  onChange={(e) => setEditingTrek({ ...editingTrek, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingTrek.durationDays}
                  onChange={(e) => setEditingTrek({ ...editingTrek, durationDays: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Difficulty
                </label>
                <select
                  value={editingTrek.difficulty}
                  onChange={(e) => setEditingTrek({ ...editingTrek, difficulty: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Starting Price (USD)
                </label>
                <input
                  type="number"
                  min="100"
                  value={editingTrek.startingPrice}
                  onChange={(e) => setEditingTrek({ ...editingTrek, startingPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Max Altitude
                </label>
                <input
                  type="text"
                  value={editingTrek.maxAltitude}
                  onChange={(e) => setEditingTrek({ ...editingTrek, maxAltitude: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Best Season
                </label>
                <input
                  type="text"
                  value={editingTrek.bestSeason}
                  onChange={(e) => setEditingTrek({ ...editingTrek, bestSeason: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  id="featuredCheckbox"
                  type="checkbox"
                  checked={editingTrek.featured}
                  onChange={(e) => setEditingTrek({ ...editingTrek, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#142C25]"
                />
                <label htmlFor="featuredCheckbox" className="text-sm font-medium">
                  Feature on Homepage
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={editingTrek.tagline}
                onChange={(e) => setEditingTrek({ ...editingTrek, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
              />
            </div>

            {/* IMAGES WITH FIREBASE STORAGE UPLOAD + LIVE PREVIEWS */}
            <div className="pt-6 border-t border-[#D8D5CA] space-y-6">
              <h3 className="font-serif text-2xl font-semibold text-[#151A18]">
                Trek Photography (Paste URL or Upload to Firebase Storage)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider">
                    Card Thumbnail
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingTrek.cardImage}
                      onChange={(e) => setEditingTrek({ ...editingTrek, cardImage: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                    />
                    <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#142C25] text-white text-xs font-semibold cursor-pointer hover:bg-[#151A18]">
                      <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>{uploadingField === 'treks-card' ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'treks-card', (url) =>
                            setEditingTrek((prev) => ({ ...prev, cardImage: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                  {editingTrek.cardImage && (
                    <img
                      src={editingTrek.cardImage}
                      alt="Card preview"
                      className="h-28 w-44 object-cover rounded-lg border border-[#D8D5CA]"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider">
                    Wide Hero Banner
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingTrek.heroImage || ''}
                      onChange={(e) => setEditingTrek({ ...editingTrek, heroImage: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                    />
                    <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#142C25] text-white text-xs font-semibold cursor-pointer hover:bg-[#151A18]">
                      <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>{uploadingField === 'treks-hero' ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'treks-hero', (url) =>
                            setEditingTrek((prev) => ({ ...prev, heroImage: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                  {editingTrek.heroImage && (
                    <img
                      src={editingTrek.heroImage}
                      alt="Hero preview"
                      className="h-28 w-44 object-cover rounded-lg border border-[#D8D5CA]"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* FIXED GROUP DEPARTURES */}
            <div className="pt-6 border-t border-[#D8D5CA] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-semibold text-[#151A18] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#C5A46D]" />
                  <span>Fixed Group Departures</span>
                </h3>
                <button
                  type="button"
                  onClick={addDeparture}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#142C25] text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Add Departure</span>
                </button>
              </div>

              {(editingTrek.departures || []).map((dep, idx) => (
                <div
                  key={dep.id || idx}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-[#F6F5F0] border border-[#D8D5CA] items-end"
                >
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">Dates</label>
                    <input
                      type="text"
                      value={dep.dates}
                      onChange={(e) => updateDeparture(idx, 'dates', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">Season Tag</label>
                    <input
                      type="text"
                      value={dep.window}
                      onChange={(e) => updateDeparture(idx, 'window', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">Spots Left</label>
                    <input
                      type="number"
                      value={dep.spotsLeft}
                      onChange={(e) => updateDeparture(idx, 'spotsLeft', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">Status</label>
                    <select
                      value={dep.status}
                      onChange={(e) => updateDeparture(idx, 'status', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                    >
                      <option value="Guaranteed">Guaranteed</option>
                      <option value="Available">Available</option>
                      <option value="Filling Fast">Filling Fast</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDeparture(idx)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ITINERARY BUILDER */}
            <div className="pt-6 border-t border-[#D8D5CA] space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-semibold text-[#151A18]">
                  Day-by-Day Itinerary Builder
                </h3>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#142C25] text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Add Day</span>
                </button>
              </div>

              <div className="space-y-4">
                {editingTrek.itinerary.map((dayItem, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#F6F5F0] border border-[#D8D5CA] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#142C25]">
                        Stop #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(idx)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Day
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase mb-1">Day #</label>
                        <input
                          type="number"
                          value={dayItem.day}
                          onChange={(e) => updateItineraryDay(idx, 'day', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase mb-1">Route Title</label>
                        <input
                          type="text"
                          value={dayItem.route}
                          onChange={(e) => updateItineraryDay(idx, 'route', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase mb-1">
                          Elevation (Meters)
                        </label>
                        <input
                          type="number"
                          value={dayItem.elevationNum}
                          onChange={(e) => {
                            const num = e.target.value;
                            updateItineraryDay(idx, 'elevationNum', num);
                            updateItineraryDay(idx, 'elevation', `${Number(num).toLocaleString()}m`);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase mb-1">
                          Accommodation
                        </label>
                        <input
                          type="text"
                          value={dayItem.accommodation}
                          onChange={(e) => updateItineraryDay(idx, 'accommodation', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase mb-1">
                        Day Description
                      </label>
                      <textarea
                        rows={2}
                        value={dayItem.description}
                        onChange={(e) => updateItineraryDay(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGHLIGHTS & INCLUSIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#D8D5CA]">
              {[
                { key: 'highlights', label: 'Key Highlights' },
                { key: 'inclusions', label: 'Inclusions' },
              ].map((section) => (
                <div key={section.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm uppercase tracking-wider">
                      {section.label}
                    </h4>
                    <button
                      type="button"
                      onClick={() => addListItem(section.key)}
                      className="text-xs font-semibold text-[#142C25] hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  {(editingTrek[section.key] || []).map((val, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateListItem(section.key, idx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#D8D5CA] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(section.key, idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#D8D5CA]">
              <button
                type="button"
                onClick={() => setEditingTrek(null)}
                className="px-6 py-2.5 rounded-full border border-[#D8D5CA] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#142C25] hover:bg-[#151A18] disabled:opacity-60 text-white text-sm font-semibold shadow-md"
              >
                <Save className="w-4 h-4 text-[#C5A46D]" />
                <span>{saving ? 'Saving...' : 'Save Trek & Itinerary'}</span>
              </button>
            </div>
          </form>
        )}

        {/* JOURNAL LIST */}
        {activeTab === 'journal' && !editingArticle && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#151A18]/70">
                Manage articles published on{' '}
                <Link to="/journal" className="text-[#142C25] font-semibold underline">
                  /journal
                </Link>
                .
              </p>
              <button
                onClick={openCreateArticle}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#142C25] text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4 text-[#C5A46D]" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border border-[#D8D5CA] rounded-xl overflow-hidden flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A46D]">
                        {article.category} · {article.date}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-[#151A18]">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#151A18]/70 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-[#D8D5CA]/60 flex items-center justify-between bg-[#F6F5F0]/50">
                    <span className="text-xs text-[#151A18]/60">{article.readTime}</span>
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditArticle(article)}
                        className="p-2 rounded-lg border border-[#D8D5CA] bg-white hover:border-[#142C25] text-[#142C25]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          await deleteArticle(article.id);
                          showToast(`Removed article: ${article.title}`);
                        }}
                        className="p-2 rounded-lg border border-[#D8D5CA] bg-white hover:border-red-500 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE / EDIT JOURNAL ARTICLE */}
        {editingArticle && (
          <form
            onSubmit={handleSaveArticle}
            className="bg-white border border-[#D8D5CA] rounded-xl p-6 sm:p-10 space-y-8 shadow-sm"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#D8D5CA]">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#151A18]">
                {isCreatingArticle ? 'Write New Journal Article' : `Editing: ${editingArticle.title}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-2 rounded-full border border-[#D8D5CA] hover:bg-[#F6F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Article Title *
                </label>
                <input
                  required
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={editingArticle.author}
                  onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingArticle.date}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingArticle.readTime}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, readTime: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider">
                Cover Image (URL or Upload)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editingArticle.coverImage}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, coverImage: e.target.value })
                  }
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#142C25] text-white text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>{uploadingField === 'journal' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'journal', (url) =>
                        setEditingArticle((prev) => ({ ...prev, coverImage: url }))
                      )
                    }
                  />
                </label>
              </div>
              {editingArticle.coverImage && (
                <img
                  src={editingArticle.coverImage}
                  alt="Cover preview"
                  className="h-32 w-56 object-cover rounded-lg border border-[#D8D5CA]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-[#D8D5CA]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-[#151A18]">
                  Article Paragraphs
                </h3>
                <button
                  type="button"
                  onClick={addArticleParagraph}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#142C25] text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              {(editingArticle.content || []).map((para, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => updateArticleParagraph(idx, e.target.value)}
                    placeholder={`Paragraph ${idx + 1}...`}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[#D8D5CA] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArticleParagraph(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#D8D5CA]">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-6 py-2.5 rounded-full border border-[#D8D5CA] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#142C25] hover:bg-[#151A18] text-white text-sm font-semibold shadow-md"
              >
                <Save className="w-4 h-4 text-[#C5A46D]" />
                <span>{saving ? 'Saving...' : 'Save Article'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TRAIL CONDITIONS TAB */}
        {activeTab === 'trails' && (
          <div className="bg-white border border-[#D8D5CA] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#151A18]">
                Live Karakoram Pass &amp; Trail Conditions
              </h2>
              <p className="text-xs text-[#151A18]/60 mt-1">
                Updates the status badges inside the Homepage live weather &amp; trail widget.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trailStatuses.map((trail) => (
                <div
                  key={trail.id}
                  className="p-4 rounded-xl bg-[#F6F5F0] border border-[#D8D5CA] space-y-3"
                >
                  <div className="font-semibold text-sm text-[#151A18]">{trail.name}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={trail.status}
                      onChange={async (e) => {
                        await updateTrailStatus(trail.id, { status: e.target.value });
                        showToast(`${trail.name} set to ${e.target.value}`);
                      }}
                      className="px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-xs font-semibold"
                    >
                      <option value="Open">Open</option>
                      <option value="Caution">Caution</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <input
                      type="text"
                      defaultValue={trail.note}
                      onBlur={async (e) => {
                        if (e.target.value !== trail.note) {
                          await updateTrailStatus(trail.id, { note: e.target.value });
                          showToast('Trail note saved.');
                        }
                      }}
                      className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#D8D5CA] bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-white border border-[#D8D5CA] rounded-xl p-12 text-center">
                <p className="font-serif text-2xl text-[#151A18]">No inquiries in Firestore yet.</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white border border-[#D8D5CA] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-xl font-semibold text-[#151A18]">
                        {inq.fullName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#142C25] text-[#C5A46D]">
                        {inq.interestedIn}
                      </span>
                      <span className="text-xs text-[#151A18]/50">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#151A18]/70">
                      {inq.email} · {inq.phone}
                    </p>
                    <p className="text-sm text-[#151A18]/85 leading-relaxed">{inq.message}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={inq.status}
                      onChange={async (e) => {
                        await updateInquiryStatus(inq.id, e.target.value);
                        showToast('Inquiry status updated.');
                      }}
                      className="px-3.5 py-2 rounded-lg border border-[#D8D5CA] text-xs font-semibold bg-[#F6F5F0]"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Booked">Booked</option>
                    </select>
                    <button
                      onClick={async () => {
                        await deleteInquiry(inq.id);
                        showToast('Inquiry deleted.');
                      }}
                      className="p-2 rounded-lg border border-[#D8D5CA] text-red-600 hover:border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}