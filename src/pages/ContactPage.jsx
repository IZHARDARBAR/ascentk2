import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const interestedOptions = [
  'K2 Base Camp Trek',
  'Shimshal Pass',
  'Karakoram Grand Traverse',
  'Rash Lake Trek',
  'K2 Expedition',
  'Broad Peak Expedition',
  "I'm not sure yet — help me choose",
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    interestedIn: interestedOptions[0],
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [validatedData, setValidatedData] = useState(null);

  useEffect(() => {
    const paramInterest = searchParams.get('interest');
    const paramPackage = searchParams.get('package');
    if (paramInterest) {
      const matched = interestedOptions.find((opt) =>
        opt.toLowerCase().includes(paramInterest.toLowerCase())
      );
      setForm((prev) => ({
        ...prev,
        interestedIn: matched || interestedOptions[6],
        message: paramPackage
          ? `Hello AscentK2 team, I am interested in the ${paramPackage} package for ${paramInterest}.`
          : prev.message,
      }));
    }
  }, [searchParams]);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) nextErrors.phone = 'Phone or WhatsApp number is required.';
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = 'Please include a short message (at least 10 characters).';
    }
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setValidatedData({ ...form });
    }
  };

  const buildMailtoLink = (data) => {
    const subject = encodeURIComponent(`Expedition Inquiry: ${data.interestedIn}`);
    const body = encodeURIComponent(
      `Name: ${data.fullName}\nEmail: ${data.email}\nPhone/WhatsApp: ${data.phone}\nInterested In: ${data.interestedIn}\n\nMessage:\n${data.message}`
    );
    return `mailto:info@ascentk2treks.com?subject=${subject}&body=${body}`;
  };

  const buildWhatsAppLink = (data) => {
    const text = encodeURIComponent(
      `Hello AscentK2 Treks! My name is ${data.fullName}. I am interested in ${data.interestedIn}. ${data.message}`
    );
    return `https://wa.me/923555550192?text=${text}`;
  };

  return (
    <div className="bg-[#F6F5F0] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
            Direct Dispatch · Gilgit-Baltistan
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#151A18] mt-3">
            Let&apos;s Start Planning Your Adventure
          </h1>
          <p className="mt-3 text-base text-[#151A18]/75">
            Tell us what you&apos;re looking for. Our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#D8D5CA] rounded-xl p-8 sm:p-10 shadow-sm">
            {validatedData ? (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-3 text-[#142C25]">
                  <CheckCircle2 className="w-7 h-7 text-[#142C25] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-serif text-2xl font-semibold">
                      Your Inquiry Is Ready to Send
                    </h2>
                    <p className="text-sm text-[#151A18]/75 mt-1">
                      This frontend preview does not connect to a backend server. Send your
                      validated message directly via email or WhatsApp below:
                    </p>
                  </div>
                </div>

                <div className="bg-[#F6F5F0] border border-[#D8D5CA] rounded-lg p-5 text-sm space-y-2">
                  <p><strong>Name:</strong> {validatedData.fullName}</p>
                  <p><strong>Email:</strong> {validatedData.email}</p>
                  <p><strong>Phone/WhatsApp:</strong> {validatedData.phone}</p>
                  <p><strong>Interested In:</strong> {validatedData.interestedIn}</p>
                  <p><strong>Message:</strong> {validatedData.message}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={buildMailtoLink(validatedData)}
                    className="inline-flex items-center gap-2 bg-[#142C25] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#151A18] transition"
                  >
                    <Mail className="w-4 h-4 text-[#C5A46D]" />
                    <span>Open in Email Client</span>
                  </a>
                  <a
                    href={buildWhatsAppLink(validatedData)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#C5A46D] text-[#151A18] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#d4b682] transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setValidatedData(null)}
                    className="text-sm font-medium text-[#151A18]/70 underline px-3"
                  >
                    Edit Form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#151A18] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Liam Carter"
                      className={`w-full px-4 py-3 rounded-lg border text-sm bg-[#F6F5F0]/50 focus:outline-none focus:ring-2 focus:ring-[#142C25] ${
                        errors.fullName ? 'border-red-500' : 'border-[#D8D5CA]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#151A18] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-lg border text-sm bg-[#F6F5F0]/50 focus:outline-none focus:ring-2 focus:ring-[#142C25] ${
                        errors.email ? 'border-red-500' : 'border-[#D8D5CA]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#151A18] mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+44 7700 900077"
                      className={`w-full px-4 py-3 rounded-lg border text-sm bg-[#F6F5F0]/50 focus:outline-none focus:ring-2 focus:ring-[#142C25] ${
                        errors.phone ? 'border-red-500' : 'border-[#D8D5CA]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#151A18] mb-2">
                      Interested In
                    </label>
                    <select
                      value={form.interestedIn}
                      onChange={(e) => setForm({ ...form, interestedIn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#D8D5CA] text-sm bg-[#F6F5F0]/50 focus:outline-none focus:ring-2 focus:ring-[#142C25]"
                    >
                      {interestedOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#151A18] mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share your preferred travel dates, group size, and trekking experience..."
                    className={`w-full px-4 py-3 rounded-lg border text-sm bg-[#F6F5F0]/50 focus:outline-none focus:ring-2 focus:ring-[#142C25] ${
                      errors.message ? 'border-red-500' : 'border-[#D8D5CA]'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-[#142C25] hover:bg-[#151A18] text-white font-semibold px-8 py-3.5 rounded-full transition shadow-md"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 text-[#C5A46D]" />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#142C25] text-white rounded-xl p-8 space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-[#C5A46D]">
                Gilgit Operations Headquarters
              </h2>

              <ul className="space-y-5 text-sm text-white/85">
                <li className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Office</div>
                    <div>Main Bazaar, Gilgit, Gilgit-Baltistan, Pakistan.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Phone</div>
                    <div>+92-355-5550192</div>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <MessageCircle className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">WhatsApp</div>
                    <a
                      href="https://wa.me/923555550192"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C5A46D] hover:underline"
                    >
                      +92-355-5550192 (Chat on WhatsApp)
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <a href="mailto:info@ascentk2treks.com" className="hover:text-[#C5A46D] transition">
                      info@ascentk2treks.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Hours</div>
                    <div>Mon–Sat, 9 AM – 6 PM (PKT)</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#D8D5CA] rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-[#D8D5CA] flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#142C25]">
                  Gilgit Base Location
                </span>
                <span className="text-[11px] text-[#151A18]/55">35.9208° N, 74.3080° E</span>
              </div>
              <iframe
                title="Main Bazaar Gilgit Map"
                src="https://maps.google.com/maps?q=Gilgit,%20Gilgit-Baltistan,%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}