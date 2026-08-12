import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Sparkles,
  BookOpen,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { SessionStatus } from '../types';
import { CreditSystemCard } from './CreditSystemCard';
import { ConnectingThread } from './ConnectingThread';

export const SessionsView: React.FC = () => {
  const {
    currentUserRole,
    activeStudent,
    activeMentor,
    sessions,
    updateSessionStatus,
    generateDigestForSession,
    toggleInsightPublic,
  } = useBridge();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [generatingSessionId, setGeneratingSessionId] = useState<string | null>(null);
  const [transcriptInputs, setTranscriptInputs] = useState<Record<string, string>>({});

  // Filter sessions relevant to role
  const roleSessions = sessions.filter((s) => {
    if (currentUserRole === 'student') return s.studentId === activeStudent.id;
    return s.mentorId === activeMentor.id;
  });

  const filteredSessions = roleSessions.filter((s) => {
    if (activeFilter === 'Pending') return s.status === 'Requested';
    if (activeFilter === 'Confirmed') return s.status === 'Confirmed';
    if (activeFilter === 'Completed') return s.status === 'Completed';
    if (activeFilter === 'History') return ['Completed', 'Student_No_Show', 'Mentor_No_Show', 'Cancelled'].includes(s.status);
    return true;
  });

  const handleGenerateDigest = async (sessionId: string) => {
    setGeneratingSessionId(sessionId);
    const customNotes = transcriptInputs[sessionId];
    await generateDigestForSession(sessionId, customNotes);
    setGeneratingSessionId(null);
  };

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'Requested':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-coral-light text-coral border border-coral-border text-xs font-mono font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-coral animate-spin" /> Pending Approval
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-signal-light text-signal border border-signal-border text-xs font-mono font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-signal" /> Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-brass-light text-brass border border-brass-border text-xs font-mono font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-brass" /> Completed
          </span>
        );
      case 'Student_No_Show':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-coral-light text-coral border border-coral-border text-xs font-mono font-medium flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-coral" /> Student No-Show
          </span>
        );
      case 'Mentor_No_Show':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-coral-light text-coral border border-coral-border text-xs font-mono font-medium flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-coral" /> Mentor No-Show
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-mist text-ink-muted border border-mist-dark text-xs font-mono font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-ink-muted" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Credit System Card for Student View */}
      {currentUserRole === 'student' && <CreditSystemCard />}

      {/* Header & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-paper-card p-5 rounded-[20px] border border-mist shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)]">
        <div>
          <h2 className="text-xl font-display font-medium text-ink">
            {currentUserRole === 'student' ? 'My Mentorship Sessions' : 'Incoming & Scheduled 15-Min Asks'}
          </h2>
          <p className="text-xs text-ink-muted pt-0.5">
            Manage session approvals, trigger completion refunds, and generate AI insight digests.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-mist-subtle p-1 rounded-xl border border-mist text-xs font-sans">
          {['All', 'Pending', 'Confirmed', 'Completed', 'History'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeFilter === tab
                  ? 'bg-paper-card text-signal font-semibold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
              id={`session-filter-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center bg-paper-card rounded-[20px] border border-mist space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-signal-light text-signal flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-display font-medium text-ink text-base">No sessions in this view</h3>
          <p className="text-ink-muted text-xs max-w-sm mx-auto">
            {currentUserRole === 'student'
              ? 'Find your first industry mentor on the Discover feed and book a 15-minute ask.'
              : 'Incoming student requests will appear here for your 1-click approval.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSessions.map((session) => {
            const isMentorView = currentUserRole === 'mentor';
            const isGenerating = generatingSessionId === session.id;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-paper-card rounded-[20px] border border-mist p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] space-y-5"
                id={`session-card-${session.id}`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mist">
                  <div className="flex items-center gap-3">
                    <img
                      src={isMentorView ? session.studentAvatar : session.mentorAvatar}
                      alt={isMentorView ? session.studentName : session.mentorName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-mist"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-medium text-ink text-base">
                          {isMentorView ? session.studentName : session.mentorName}
                        </h3>
                        <span className="text-xs text-ink-muted font-mono">({session.sessionType})</span>
                      </div>
                      <p className="text-xs text-ink-subtle">
                        {isMentorView ? 'Student Applicant' : `${session.mentorTitle} @ ${session.mentorCompany}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(session.status)}
                    <span className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-signal" strokeWidth={1.75} /> {session.scheduledAt}
                    </span>
                  </div>
                </div>

                {/* Session Topic / Goal */}
                <div className="p-4 rounded-xl bg-mist-subtle border border-mist text-xs space-y-1">
                  <span className="font-mono text-ink-muted uppercase text-[10px]">
                    Session Focus / Question
                  </span>
                  <p className="font-sans font-medium text-ink text-sm">{session.topic}</p>
                </div>

                {/* Credit Stepper Lifecycle */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Escrow Status
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-center">
                    <div className="p-2 rounded-lg bg-mist text-ink">1. Booked</div>
                    <div className="p-2 rounded-lg bg-brass-light text-brass border border-brass-border">2. Escrow Held</div>
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        session.status === 'Completed'
                          ? 'bg-signal text-paper font-semibold'
                          : 'bg-mist-subtle text-ink-muted'
                      }`}
                    >
                      3. Refunded + Bonus
                    </div>
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        session.status === 'Student_No_Show'
                          ? 'bg-coral text-paper font-semibold'
                          : 'bg-mist-subtle text-ink-muted'
                      }`}
                    >
                      4. Forfeited
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Pending / Confirmed Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Mentor Accept / Decline buttons */}
                    {isMentorView && session.status === 'Requested' && (
                      <>
                        <button
                          onClick={() => updateSessionStatus(session.id, 'Confirmed')}
                          className="px-4 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                          id={`accept-session-${session.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} /> Accept 15-Min Ask
                        </button>
                        <button
                          onClick={() => updateSessionStatus(session.id, 'Cancelled')}
                          className="px-3 py-2 rounded-xl border border-mist text-ink-subtle hover:bg-mist-subtle text-xs font-medium"
                          id={`decline-session-${session.id}`}
                        >
                          Decline Request
                        </button>
                      </>
                    )}

                    {/* Complete & No-show buttons */}
                    {session.status === 'Confirmed' && (
                      <>
                        <button
                          onClick={() => updateSessionStatus(session.id, 'Completed')}
                          className="px-4 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                          id={`complete-session-${session.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} /> Mark Completed (+0.25 Bonus)
                        </button>

                        <button
                          onClick={() =>
                            updateSessionStatus(
                              session.id,
                              isMentorView ? 'Student_No_Show' : 'Mentor_No_Show'
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-coral-light hover:bg-coral-border/40 text-coral border border-coral-border text-xs font-medium flex items-center gap-1.5"
                          id={`report-noshow-${session.id}`}
                        >
                          <AlertOctagon className="w-3.5 h-3.5" strokeWidth={1.75} /> Report No-Show
                        </button>
                      </>
                    )}
                  </div>

                  {/* Cancel button if student requested */}
                  {!isMentorView && session.status === 'Requested' && (
                    <button
                      onClick={() => updateSessionStatus(session.id, 'Cancelled')}
                      className="px-3 py-2 rounded-xl text-coral hover:bg-coral-light text-xs font-medium"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>

                {/* AI Digest Section for Completed Sessions */}
                {session.status === 'Completed' && (
                  <div className="mt-4 pt-4 border-t border-mist space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.75} />
                        <h4 className="font-display font-medium text-ink text-sm">AI Session Digest</h4>
                      </div>

                      {session.digest && (
                        <label className="flex items-center gap-2 text-xs font-sans text-ink cursor-pointer">
                          <input
                            type="checkbox"
                            checked={session.isPublicInsight}
                            onChange={() => toggleInsightPublic(session.id)}
                            className="rounded text-signal focus:ring-signal w-4 h-4"
                            id={`public-insight-toggle-${session.id}`}
                          />
                          <span>Publish to Community Insight Library</span>
                        </label>
                      )}
                    </div>

                    {/* Signature Animated Connecting Thread during & on generation */}
                    {isGenerating && (
                      <ConnectingThread variant="animated" label="Drawing Wisdom Bridge..." />
                    )}

                    {!session.digest ? (
                      <div className="p-4 rounded-xl bg-mist-subtle border border-mist space-y-3">
                        <p className="text-xs text-ink-subtle leading-relaxed">
                          Auto-generate a structured Insight Card using Gemini AI from session notes or key talking points.
                        </p>
                        <textarea
                          rows={2}
                          value={transcriptInputs[session.id] || ''}
                          onChange={(e) =>
                            setTranscriptInputs({ ...transcriptInputs, [session.id]: e.target.value })
                          }
                          placeholder="Optional: Paste raw transcript or key bullet points discussed during call..."
                          className="w-full p-2.5 rounded-xl bg-paper-card border border-mist text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        />
                        <button
                          onClick={() => handleGenerateDigest(session.id)}
                          disabled={isGenerating}
                          className="px-4 py-2.5 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-2"
                          id={`generate-digest-btn-${session.id}`}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-paper" strokeWidth={1.75} />
                              <span>Gemini AI Digest Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-paper" strokeWidth={1.75} />
                              <span>Generate AI Insight Card</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 rounded-xl bg-paper border border-signal-border space-y-3 text-xs">
                        <ConnectingThread label="Wisdom Bridge Formed" />

                        <div className="font-display font-medium text-ink text-base flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-signal" strokeWidth={1.75} />
                          {session.digest.summaryHeadline}
                        </div>

                        {/* Key Advice */}
                        <div>
                          <span className="font-mono text-ink-muted uppercase text-[10px]">
                            Key Advice Points:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-ink-subtle mt-1 font-sans">
                            {session.digest.keyAdvice.map((adv, idx) => (
                              <li key={idx}>{adv}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        <div>
                          <span className="font-mono text-ink-muted uppercase text-[10px]">
                            Resources Mentioned:
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {session.digest.resourcesMentioned.map((res, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-mist-subtle border border-mist text-ink text-[11px] font-sans"
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Item */}
                        <div className="p-3 rounded-xl bg-brass-light border border-brass-border text-ink font-sans">
                          <strong className="font-semibold text-brass font-mono">48-Hour Action Step:</strong>{' '}
                          {session.digest.suggestedNextStep}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleGenerateDigest(session.id)}
                            className="text-[11px] font-medium text-signal hover:text-signal-hover flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" strokeWidth={1.75} /> Regenerate Digest
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

