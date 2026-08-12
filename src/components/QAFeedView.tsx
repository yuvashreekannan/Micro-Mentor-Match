import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  Sparkles,
  Send,
  X,
  Search,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';

export const QAFeedView: React.FC = () => {
  const {
    currentUserRole,
    activeMentor,
    qaQuestions,
    postQAQuestion,
    answerQAQuestion,
    upvoteQAAnswer,
    upvoteQAQuestion,
    bookSession,
  } = useBridge();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('');

  // Answer drafting per question ID
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [privateOfferFlags, setPrivateOfferFlags] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = qaQuestions.filter((q) => {
    if (searchQuery.trim()) {
      const matchTitle = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchContent = q.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTags = q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTitle || matchContent || matchTags;
    }
    return true;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    postQAQuestion(newTitle, newContent, tags.length > 0 ? tags : ['Career Advice']);
    setNewTitle('');
    setNewContent('');
    setNewTagsStr('');
    setIsPostModalOpen(false);
  };

  const handleAnswerSubmit = (questionId: string) => {
    const text = answerTexts[questionId];
    if (!text || !text.trim()) return;

    const isPrivate = privateOfferFlags[questionId] || false;
    answerQAQuestion(questionId, text, isPrivate);

    // Clear input
    setAnswerTexts({ ...answerTexts, [questionId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Post Question CTA */}
      <div className="bg-paper-card p-5 sm:p-6 rounded-[20px] border border-mist shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-signal font-mono text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-signal" strokeWidth={1.75} /> Reverse Q&A Knowledge Feed
          </div>
          <h2 className="text-2xl font-display font-medium text-ink">
            Public Student Questions & Micro-Answers
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Students ask crisp questions; industry professionals respond with actionable insights or private 15-min call invites.
          </p>
        </div>

        {currentUserRole === 'student' && (
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-2 flex-shrink-0"
            id="ask-public-question-btn"
          >
            <Plus className="w-4 h-4 text-paper" strokeWidth={1.75} />
            <span>Post Specific Question</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-muted" strokeWidth={1.75} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions by keyword (resume, cold messaging, system design)..."
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-paper-card border border-mist text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
        />
      </div>

      {/* Question Cards List */}
      <div className="space-y-5">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-paper-card rounded-[20px] border border-mist p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] space-y-4"
            id={`qa-question-${question.id}`}
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={question.studentAvatar}
                  alt={question.studentName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-mist"
                />
                <div>
                  <h3 className="font-display font-medium text-ink text-sm">
                    {question.studentName}
                  </h3>
                  <p className="text-[11px] text-ink-muted">{question.studentGoal}</p>
                </div>
              </div>

              <button
                onClick={() => upvoteQAQuestion(question.id)}
                className="px-3 py-1.5 rounded-lg bg-mist-subtle hover:bg-mist text-ink font-mono text-xs flex items-center gap-1.5 transition-colors border border-mist"
                id={`upvote-question-${question.id}`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-signal" strokeWidth={1.75} />
                <span>{question.upvotes}</span>
              </button>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="font-display font-medium text-ink text-base">{question.title}</h4>
              <p className="text-xs text-ink-subtle mt-1 leading-relaxed font-sans">{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-mist-subtle border border-mist text-ink-subtle text-[11px] font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Answers Section */}
            <div className="pt-3 border-t border-mist space-y-3">
              <span className="text-[10px] font-mono text-ink-muted uppercase">
                Mentor Answers ({question.answers.length})
              </span>

              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="p-4 rounded-xl bg-paper border border-mist space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={answer.mentorAvatar}
                        alt={answer.mentorName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium text-ink">{answer.mentorName}</span>
                        <span className="text-[10px] text-ink-muted ml-1 font-mono">
                          ({answer.mentorTitle} @ {answer.mentorCompany})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => upvoteQAAnswer(question.id, answer.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-paper-card border border-mist text-ink hover:text-signal text-[11px] font-mono"
                    >
                      <ThumbsUp className="w-3 h-3 text-signal" strokeWidth={1.75} />
                      <span>{answer.helpfulCount} Helpful</span>
                    </button>
                  </div>

                  <p className="text-ink-subtle leading-relaxed font-sans">{answer.content}</p>

                  {/* Private Offer Callout */}
                  {answer.isPrivateOffer && (
                    <div className="p-2.5 rounded-xl bg-brass-light border border-brass-border text-ink flex items-center justify-between text-[11px]">
                      <span className="font-sans flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brass" strokeWidth={1.75} />
                        {answer.mentorName} offered a private 15-min call to discuss this question!
                      </span>
                      {currentUserRole === 'student' && (
                        <button
                          onClick={() => {
                            bookSession(
                              answer.mentorId,
                              'Quick Career Q',
                              `Follow-up on Q&A: ${question.title}`,
                              'Tomorrow, 2:00 PM'
                            );
                            alert('Session booked from mentor invitation!');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-signal text-paper font-medium text-[10px] hover:bg-signal-hover transition-colors"
                        >
                          Accept Call Invite
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Mentor Answer Reply Form */}
              {currentUserRole === 'mentor' && (
                <div className="pt-2 space-y-2">
                  <textarea
                    rows={2}
                    value={answerTexts[question.id] || ''}
                    onChange={(e) =>
                      setAnswerTexts({ ...answerTexts, [question.id]: e.target.value })
                    }
                    placeholder={`Answer as ${activeMentor.name}...`}
                    className="w-full p-3 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs text-ink-subtle cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privateOfferFlags[question.id] || false}
                        onChange={(e) =>
                          setPrivateOfferFlags({
                            ...privateOfferFlags,
                            [question.id]: e.target.checked,
                          })
                        }
                        className="rounded text-signal focus:ring-signal w-3.5 h-3.5"
                      />
                      <span>Offer private 15-min micro-session invitation</span>
                    </label>

                    <button
                      onClick={() => handleAnswerSubmit(question.id)}
                      className="px-4 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Post Answer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Posting New Question */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-lg bg-paper-card rounded-[20px] shadow-2xl overflow-hidden border border-mist"
            >
              <div className="bg-ink p-6 text-paper relative">
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <h3 className="text-xl font-display font-medium text-paper">Ask Public Question</h3>
                <p className="text-mist text-xs mt-1">
                  Keep it specific and concise so industry mentors can give actionable advice.
                </p>
              </div>

              <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    Question Headline
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. How to handle cold messaging for product design intern roles?"
                    className="w-full p-3 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                    required
                    id="qa-new-title-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    Details / Context
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide specific details about your situation..."
                    className="w-full p-3 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                    required
                    id="qa-new-content-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    placeholder="e.g. Tech Resume, Cold Outreach, Interview Prep"
                    className="w-full p-3 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-mist">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-mist text-ink-subtle text-xs font-medium hover:bg-mist-subtle"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium shadow-2xs transition-colors"
                    id="submit-new-qa-btn"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

