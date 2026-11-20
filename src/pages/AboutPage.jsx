import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { teamData } from '../data/treksData';

export default function AboutPage() {
  const stats = [
    { value: '2,000+', label: 'Trekkers Guided' },
    { value: '40+', label: 'Countries' },
    { value: '15 Years', label: 'In Operation' },
    { value: '0', label: 'Fatalities' },
  ];

  return (
    <div className="bg-[#F6F5F0]">
      {/* Hero */}
      <section className="relative pt-40 pb-28 lg:pt-48 lg:pb-36 bg-[#151A18] text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1800&q=85"
          alt="Karakoram ridge at sunrise"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151A18] via-[#151A18]/60 to-[#151A18]/50" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
            Our Heritage · Gilgit-Baltistan
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold mt-4 leading-tight">
            Born in the Mountains. <br />
            <span className="text-[#C5A46D]">Driven by Adventure.</span>
          </h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18] leading-snug">
              Making the Karakoram accessible with uncompromising mountain safety.
            </h2>
            <p className="text-base text-[#151A18]/80 leading-relaxed">
              Founded in 2010 in Gilgit, AscentK2 Treks was born from a simple belief: the
              Karakoram should be accessible to every adventurer, not just elite mountaineers.
            </p>
            <p className="text-base text-[#151A18]/80 leading-relaxed">
              Over 15 years, we&apos;ve guided more than 2,000 trekkers and climbers from 40+
              countries across the planet&apos;s highest non-polar glacier systems.
            </p>
            <p className="text-base text-[#151A18]/80 leading-relaxed">
              Our experience spans the Baltoro Glacier, K2 Base Camp, and the hidden valleys of
              Shimshal—combining native Balti and Wakhi mountain wisdom with IFMGA international
              alpine standards.
            </p>
          </motion.div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80"
              alt="Alpine valley trail in Gilgit-Baltistan"
              className="rounded-lg w-full h-72 object-cover mt-8 shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=80"
              alt="Snowy Karakoram high peaks"
              className="rounded-lg w-full h-80 object-cover shadow-md"
            />
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="bg-[#142C25] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
              By The Numbers
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="p-6 border border-white/10 rounded-lg bg-white/5"
              >
                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#C5A46D]">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm uppercase tracking-widest text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
            Leadership
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#151A18] mt-3">
            Meet the Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamData.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="bg-white border border-[#D8D5CA] rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/4] overflow-hidden bg-[#151A18]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
                  {member.credentials}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#151A18] mt-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-[#142C25] mb-3">{member.role}</p>
                <p className="text-sm text-[#151A18]/75 leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#D8D5CA]/40 border-t border-[#D8D5CA] text-center px-6">
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#151A18]">
          Let&apos;s Plan Your Adventure
        </h2>
        <p className="mt-3 text-[#151A18]/70 max-w-lg mx-auto">
          Speak directly with Ahmed, Bilal, or Sana to tailor your Karakoram expedition.
        </p>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-[#142C25] hover:bg-[#151A18] text-white font-semibold px-8 py-3.5 rounded-full transition"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
          </Link>
        </div>
      </section>
    </div>
  );
}