import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpenCheck,
  Search,
  Heart,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';

export const InsightLibraryView: React.FC = () => {
  const { insights, upvoteInsight } = useBridge();

  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const industries = ['All', 'Tech', 'Finance', 'Design', 'Healthcare', 'Marketing'];

  const filteredInsights = insights.filter((ins) => {
    if (selectedIndustry !== 'All' && ins.industry !== selectedIndustry) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = ins.topic.toLowerCase().includes(q);
      const matchHeadline = ins.digest.summaryHeadline.toLowerCase().includes(q);
      const matchAdvice = ins.digest.keyAdvice.some((a) => a.toLowerCase().includes(q));
      const matchMentor = ins.mentorName.toLowerCase().includes(q);
      return matchTopic || matchHeadline || matchAdvice || matchMentor;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-paper-card p-5 sm:p-6 rounded-[20px] border border-mist shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-brass font-mono text-xs uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4 text-brass" strokeWidth={1.75} /> AI Knowledge Repository
          </div>
          <h2 className="text-2xl font-display font-medium text-ink">
            Public Insight Library
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Gemini AI-generated digests from real 15-minute mentorship calls shared by students.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-paper-card p-4 rounded-[20px] border border-mist shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-ink-muted" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI insights by topic, advice bullet, or mentor..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-paper-card border border-mist text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
          />
        </div>

        {/* Industry Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-ink-muted uppercase mr-1">
            Industry:
          </span>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors ${
                selectedIndustry === ind
                  ? 'bg-signal text-paper font-semibold shadow-2xs'
                  : 'bg-mist-subtle text-ink-muted hover:text-ink'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Insight Cards Grid */}
      {filteredInsights.length === 0 ? (
        <div className="p-12 text-center bg-paper-card rounded-[20px] border border-mist space-y-3">
          <BookOpenCheck className="w-10 h-10 mx-auto text-brass" strokeWidth={1.75} />
          <h3 className="font-display font-medium text-ink text-base">No public insights found</h3>
          <p className="text-ink-muted text-xs max-w-sm mx-auto">
            Try clearing filters or complete a 15-minute ask session and publish its AI digest!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInsights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-paper-card rounded-[20px] border border-mist p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] hover:border-mist-dark transition-all flex flex-col justify-between space-y-4"
              id={`insight-card-${insight.id}`}
            >
              <div className="space-y-3">
                {/* Header Mentor info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={insight.mentorAvatar}
                      alt={insight.mentorName}
                      className="w-11 h-11 rounded-2xl object-cover ring-1 ring-mist"
                    />
                    <div>
                      <h4 className="font-display font-medium text-ink text-sm">
                        {insight.mentorName}
                      </h4>
                      <p className="text-[11px] text-ink-subtle">
                        {insight.mentorTitle} @ {insight.mentorCompany}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-brass-light border border-brass-border text-[10px] font-mono text-brass uppercase">
                        {insight.industry} • {insight.sessionType}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => upvoteInsight(insight.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mist-subtle hover:bg-mist text-coral font-mono text-xs transition-colors border border-mist"
                    id={`like-insight-${insight.id}`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-coral text-coral" strokeWidth={1.75} />
                    <span>{insight.likesCount}</span>
                  </button>
                </div>

                {/* Topic & AI Summary Headline */}
                <div className="p-3.5 rounded-xl bg-mist-subtle border border-mist space-y-1">
                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Topic: {insight.topic}
                  </span>
                  <h3 className="font-display font-medium text-ink text-sm leading-snug">
                    {insight.digest.summaryHeadline}
                  </h3>
                </div>

                {/* Key Advice */}
                <div className="space-y-1.5 text-xs font-sans">
                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Core Insights:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-ink-subtle text-xs">
                    {insight.digest.keyAdvice.map((adv, idx) => (
                      <li key={idx} className="leading-snug">
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                {insight.digest.resourcesMentioned.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {insight.digest.resourcesMentioned.map((res, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-mist-subtle border border-mist text-ink-subtle text-[10px] font-mono"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action item footer */}
              <div className="pt-3 border-t border-mist flex items-center justify-between text-[11px] text-ink-muted">
                <span>Shared by {insight.studentName}</span>
                <span className="font-mono text-brass bg-brass-light border border-brass-border px-2 py-0.5 rounded-md text-[10px]">
                  Gemini Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

