import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, X, Calendar, User } from 'lucide-react';
import { useTreks } from '../context/TreksContext';

export default function JournalPage() {
  const { articles } = useTreks();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="bg-[#F6F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A46D]">
            Field Dispatches &amp; Guides
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#151A18] mt-3">
            Expedition Journal
          </h1>
          <p className="mt-3 text-base text-[#151A18]/75">
            Training blueprints, Karakoram weather insights, and Pakistan permit guidance written
            by our Gilgit guiding team.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white border border-[#D8D5CA] rounded-xl p-12 text-center">
            <p className="font-serif text-2xl text-[#151A18]">No journal articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group bg-white border border-[#D8D5CA] rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all"
              >
                <div>
                  <div
                    onClick={() => setSelectedArticle(article)}
                    className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-[#142C25] text-[#C5A46D] text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-sm">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[#151A18]/60 mb-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A46D]" /> {article.readTime}
                      </span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>

                    <h2
                      onClick={() => setSelectedArticle(article)}
                      className="font-serif text-2xl font-semibold text-[#151A18] group-hover:text-[#142C25] cursor-pointer transition-colors"
                    >
                      {article.title}
                    </h2>

                    <p className="mt-3 text-sm text-[#151A18]/75 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#D8D5CA]/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#151A18]/60">{article.author}</span>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#142C25] hover:text-[#C5A46D] transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 bg-[#142C25] text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold">
              Need Personal Advice?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mt-2">
              Ask Our Guides About Permits or Training
            </h3>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 bg-[#C5A46D] hover:bg-[#d4b682] text-[#151A18] font-semibold px-7 py-3 rounded-full transition shrink-0"
          >
            <span>Talk to an Expert</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F6F5F0] text-[#151A18] rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-[#D8D5CA]"
            >
              <div className="relative h-64 sm:h-72">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close article"
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-[#151A18]/80 text-white hover:bg-[#C5A46D] hover:text-[#151A18] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-7 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#151A18]/65">
                  <span className="px-3 py-1 rounded-sm bg-[#142C25] text-[#C5A46D] font-semibold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" /> {selectedArticle.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A46D]" /> {selectedArticle.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#C5A46D]" /> {selectedArticle.author}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#151A18]">
                  {selectedArticle.title}
                </h2>

                <div className="space-y-4 text-base text-[#151A18]/85 leading-relaxed">
                  {(selectedArticle.content || []).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}