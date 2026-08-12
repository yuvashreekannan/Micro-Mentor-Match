import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Sparkles,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { MentorProfile } from '../types';
import { ReliabilityRadial } from './ReliabilityRadial';
import { ConnectingThread } from './ConnectingThread';

interface MatchingFeedProps {
  onSelectMentorToBook: (mentor: MentorProfile) => void;
}

export const MatchingFeed: React.FC<MatchingFeedProps> = ({ onSelectMentorToBook }) => {
  const { mentors, activeStudent } = useBridge();

  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Industry filters
  const industries = ['All', 'Tech', 'Finance', 'Design', 'Healthcare', 'Marketing'];
  const sessionTypes = ['All', 'Resume Glance', 'Quick Career Q', 'Mock Interview Snippet'];

  // Compute Compatibility Score out of 100
  const computeCompatibilityScore = (mentor: MentorProfile) => {
    let score = 50;

    // 1. Shared tags match
    const studentInterests = activeStudent.interests || [];
    const sharedTags = mentor.expertiseTags.filter((t) => studentInterests.includes(t));
    score += sharedTags.length * 12;

    // 2. Goal stage alignment
    if (activeStudent.goalStage === 'interviewing' && mentor.expertiseTags.includes('Mock Interview Snippet')) {
      score += 15;
    } else if (activeStudent.goalStage === 'exploring' && mentor.expertiseTags.includes('Quick Career Q')) {
      score += 12;
    }

    // 3. Reliability score weight
    if (mentor.reliabilityScore >= 95) score += 10;
    else if (mentor.reliabilityScore >= 90) score += 5;

    // Clamp between 68 and 99 for prototype realism
    return Math.min(99, Math.max(68, score));
  };

  // Filter mentors
  const filteredMentors = mentors.filter((mentor) => {
    if (selectedIndustry !== 'All' && mentor.industry !== selectedIndustry) return false;
    if (
      selectedSessionType !== 'All' &&
      !mentor.expertiseTags.includes(selectedSessionType) &&
      !mentor.expertiseTags.some((t) => t.toLowerCase().includes(selectedSessionType.toLowerCase()))
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = mentor.name.toLowerCase().includes(q);
      const matchCompany = mentor.company.toLowerCase().includes(q);
      const matchTitle = mentor.title.toLowerCase().includes(q);
      const matchTags = mentor.expertiseTags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCompany && !matchTitle && !matchTags) return false;
    }
    return true;
  });

  // Sort mentors by computed score descending
  const sortedMentors = [...filteredMentors].sort(
    (a, b) => computeCompatibilityScore(b) - computeCompatibilityScore(a)
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-paper-card p-5 rounded-[20px] border border-mist shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-ink-muted" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentors by company, skills, or title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-mist-subtle border border-mist text-xs font-sans text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal transition-all"
              id="matching-search-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-muted">
              {sortedMentors.length} MENTORS AVAILABLE
            </span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-mist">
          {/* Industry Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider mr-1">
              Industry:
            </span>
            {industries.map((ind) => {
              const isSel = selectedIndustry === ind;
              return (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSel
                      ? 'bg-ink text-paper font-semibold shadow-2xs'
                      : 'bg-mist-subtle text-ink-subtle hover:bg-mist'
                  }`}
                  id={`filter-ind-${ind}`}
                >
                  {ind}
                </button>
              );
            })}
          </div>

          {/* Session Type Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider mr-1">
              Format:
            </span>
            {sessionTypes.map((st) => {
              const isSel = selectedSessionType === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedSessionType(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSel
                      ? 'bg-signal text-paper font-semibold shadow-2xs'
                      : 'bg-mist-subtle text-ink-subtle hover:bg-mist'
                  }`}
                  id={`filter-st-${st}`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      {sortedMentors.length === 0 ? (
        <div className="p-12 text-center bg-paper-card rounded-[20px] border border-mist space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-signal-light text-signal flex items-center justify-center">
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-display font-medium text-ink text-base">No mentors matched your filters</h3>
          <p className="text-ink-muted text-xs max-w-sm mx-auto">
            Try selecting "All" industries or clearing search keywords to explore available 15-minute mentors.
          </p>
          <button
            onClick={() => {
              setSelectedIndustry('All');
              setSelectedSessionType('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-2 rounded-xl bg-signal text-paper text-xs font-medium hover:bg-signal-hover transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedMentors.map((mentor, index) => {
            const compatScore = computeCompatibilityScore(mentor);
            const nextSlot = mentor.availabilitySlots[0];
            const isTopMatch = index === 0;

            return (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-paper-card rounded-[20px] border border-mist hover:border-signal-border p-5 shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] hover:shadow-[0_4px_20px_-2px_rgba(20,33,61,0.08)] transition-all duration-200 flex flex-col justify-between relative group"
                id={`mentor-card-${mentor.id}`}
              >
                <div>
                  {/* Top Header: Avatar + Match Score Badge + Reliability Radial */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-13 h-13 rounded-2xl object-cover ring-1 ring-mist"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-signal border-2 border-paper rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-display font-medium text-ink text-base group-hover:text-signal transition-colors">
                          {mentor.name}
                        </h3>
                        <p className="text-xs text-ink-subtle">
                          {mentor.title} <span className="text-ink-muted">@</span>{' '}
                          <strong className="text-ink font-semibold">{mentor.company}</strong>
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-mist text-[10px] font-mono text-ink-muted uppercase">
                          {mentor.industry}
                        </span>
                      </div>
                    </div>

                    {/* Compatibility Score & Reliability */}
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <div className="px-2.5 py-1 rounded-full bg-brass-light border border-brass-border text-brass font-mono font-semibold text-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-brass" strokeWidth={1.75} />
                          <span>{compatScore}% Match</span>
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted mt-0.5">
                          ALGORITHM
                        </span>
                      </div>

                      {/* Reliability Trust Chart */}
                      <ReliabilityRadial score={mentor.reliabilityScore} size={44} showTooltip={true} />
                    </div>
                  </div>

                  {/* Connecting Thread Motif for top match */}
                  {isTopMatch && (
                    <ConnectingThread label="Top Match Bridge" />
                  )}

                  {/* Bio */}
                  <p className="text-xs text-ink-subtle leading-relaxed line-clamp-2 my-3 font-sans">
                    {mentor.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.expertiseTags.map((tag) => {
                      const isShared = activeStudent.interests?.includes(tag);
                      return (
                        <span
                          key={tag}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-sans transition-colors ${
                            isShared
                              ? 'bg-signal-light text-signal font-semibold border border-signal-border'
                              : 'bg-mist-subtle text-ink-muted'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls: Availability & CTA */}
                <div className="pt-3 border-t border-mist flex items-center justify-between gap-3">
                  {nextSlot ? (
                    <div className="text-[11px] font-mono text-ink-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-signal" strokeWidth={1.75} />
                      <span>NEXT: <strong className="text-ink font-sans">{nextSlot.day}, {nextSlot.time}</strong></span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-ink-muted">SLOTS ON REQUEST</div>
                  )}

                  <button
                    onClick={() => onSelectMentorToBook(mentor)}
                    className="px-4 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 group/btn"
                    id={`book-mentor-${mentor.id}`}
                  >
                    <span>Request 15-Min Ask</span>
                    <ChevronRight className="w-3.5 h-3.5 text-paper group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={1.75} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

