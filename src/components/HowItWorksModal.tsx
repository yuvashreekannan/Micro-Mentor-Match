import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'student' | 'mentor') => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-paper-card rounded-[20px] shadow-2xl overflow-hidden border border-mist"
          id="how-it-works-modal"
        >
          {/* Header Banner */}
          <div className="bg-ink p-6 sm:p-8 text-paper relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors"
              id="close-how-it-works"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <div className="flex items-center gap-2 text-brass font-mono text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.75} /> Architecture Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-paper">
              How Bridge Operates
            </h2>
            <p className="text-mist mt-2 text-sm max-w-xl font-sans">
              Micro-mentorship designed for busy professionals and ambitious students through high-value 15-minute asks.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Step 1 */}
            <div className="flex gap-4 items-start p-4 rounded-xl bg-paper border border-mist">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-signal text-paper flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-signal" strokeWidth={1.75} />
                  <h3 className="font-display font-medium text-ink text-base">The 15-Minute Ask</h3>
                </div>
                <p className="text-sm text-ink-subtle leading-relaxed font-sans">
                  No long 60-minute calls or vague advice. Pick an ultra-focused session type: <span className="font-semibold text-ink">Resume Glance</span>, <span className="font-semibold text-ink">Quick Career Q</span>, or <span className="font-semibold text-ink">Mock Interview Snippet</span>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start p-4 rounded-xl bg-brass-light border border-brass-border">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brass text-paper flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brass" strokeWidth={1.75} />
                  <h3 className="font-display font-medium text-ink text-base">Escrow & Credit Ledger</h3>
                </div>
                <p className="text-sm text-ink-subtle leading-relaxed font-sans">
                  When a student books, <span className="font-mono text-brass font-semibold">1 Credit is held in escrow</span>. Upon completion, the credit is refunded + a <span className="font-mono text-brass font-semibold">+0.25 reliable attendee bonus</span>!
                  Student no-shows forfeit their credit to the mentor; mentor no-shows result in a reliability score drop.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start p-4 rounded-xl bg-paper border border-mist">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-signal text-paper flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.75} />
                  <h3 className="font-display font-medium text-ink text-base">AI-Generated Session Digest</h3>
                </div>
                <p className="text-sm text-ink-subtle leading-relaxed font-sans">
                  After each completed call, Gemini AI auto-generates an <span className="font-semibold text-ink">Insight Card</span> with Key Advice, Resources, and Actionable Next Steps — building a permanent knowledge library for students.
                </p>
              </div>
            </div>

            {/* Quick Role Select Callout */}
            <div className="p-5 rounded-xl bg-ink text-paper flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display font-medium text-sm text-paper">Ready to test the prototype flow?</p>
                <p className="text-xs text-mist font-sans">Switch roles anytime using the top header toggle.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onSelectRole('student');
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                  id="how-it-works-select-student"
                >
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} /> Demo Student
                </button>
                <button
                  onClick={() => {
                    onSelectRole('mentor');
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-brass text-paper hover:opacity-90 text-xs font-medium transition-opacity shadow-2xs flex items-center justify-center gap-1.5"
                  id="how-it-works-select-mentor"
                >
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} /> Demo Mentor
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

