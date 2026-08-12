import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Coins,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { MentorProfile, SessionType } from '../types';

interface BookingModalProps {
  mentor: MentorProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SESSION_TYPES: { id: SessionType; duration: string; desc: string; icon: any }[] = [
  {
    id: 'Resume Glance',
    duration: '15 min',
    desc: 'Rapid feedback on resume layout, impact statements, and recruiter clarity.',
    icon: FileText,
  },
  {
    id: 'Quick Career Q',
    duration: '15 min',
    desc: 'Unfiltered answers to 1-2 specific career questions about roles, teams, or offers.',
    icon: MessageSquare,
  },
  {
    id: 'Mock Interview Snippet',
    duration: '20 min',
    desc: 'Targeted single question mock interview (system design, product sense, or behavioral).',
    icon: Sparkles,
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { activeStudent, bookSession } = useBridge();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>('Resume Glance');
  const [topic, setTopic] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !mentor) return null;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSlot) {
      setErrorMsg('Please pick an available time slot.');
      return;
    }

    if (!topic.trim()) {
      setErrorMsg('Please briefly describe what you want to cover.');
      return;
    }

    const res = bookSession(mentor.id, selectedSessionType, topic, selectedSlot);
    if (res.success) {
      onSuccess();
      onClose();
      // Reset state
      setStep(1);
      setTopic('');
      setSelectedSlot('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-xl bg-paper-card rounded-[20px] shadow-2xl overflow-hidden border border-mist"
          id="booking-modal"
        >
          {/* Header */}
          <div className="bg-ink p-6 text-paper relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors"
              id="close-booking-modal"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-brass"
              />
              <div>
                <p className="text-brass font-mono text-xs uppercase tracking-wider">
                  Book 15-Minute Ask
                </p>
                <h2 className="text-xl font-display font-medium text-paper">{mentor.name}</h2>
                <p className="text-mist text-xs">
                  {mentor.title} @ {mentor.company}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleBookSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-coral-light border border-coral-border text-coral text-xs font-medium flex items-center gap-2 font-sans">
                <ShieldAlert className="w-4 h-4 text-coral flex-shrink-0" strokeWidth={1.75} />
                <span>{errorMsg}</span>
              </div>
            )}

            {step === 1 ? (
              <>
                {/* Step 1: Select Session Type */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    1. Select Session Format
                  </label>
                  <div className="space-y-2.5">
                    {SESSION_TYPES.map((st) => {
                      const Icon = st.icon;
                      const isSel = selectedSessionType === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSelectedSessionType(st.id)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 ${
                            isSel
                              ? 'border-signal bg-signal-light text-ink shadow-2xs'
                              : 'border-mist hover:border-mist-dark bg-paper text-ink-subtle'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              isSel ? 'bg-signal text-paper' : 'bg-mist text-ink-muted'
                            }`}
                          >
                            <Icon className="w-4 h-4" strokeWidth={1.75} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-display font-medium text-xs text-ink">{st.id}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-paper border border-mist text-ink-muted flex items-center gap-1">
                                <Clock className="w-3 h-3 text-signal" strokeWidth={1.75} /> {st.duration}
                              </span>
                            </div>
                            <p className="text-[11px] text-ink-muted mt-0.5 leading-snug font-sans">{st.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pick Time Slot */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    2. Select Available Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {mentor.availabilitySlots.map((slot) => {
                      const slotStr = `${slot.day}, ${slot.time}`;
                      const isSel = selectedSlot === slotStr;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slotStr)}
                          className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                            isSel
                              ? 'border-signal bg-signal-light text-ink font-medium shadow-2xs'
                              : 'border-mist hover:border-mist-dark bg-paper text-ink-subtle'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-ink-muted text-[10px] font-mono mb-0.5">
                            <Calendar className="w-3 h-3 text-signal" strokeWidth={1.75} /> {slot.day}
                          </div>
                          <div className="text-xs font-sans font-semibold text-ink">{slot.time}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic / Question Input */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    3. Specific Question or Goal
                  </label>
                  <textarea
                    rows={2}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Please review my resume bullet points for Frontend Engineer at Stripe or advice on cold messaging recruiters."
                    className="w-full p-3 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                    required
                    id="booking-topic-input"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedSlot) {
                        setErrorMsg('Please select a time slot.');
                        return;
                      }
                      if (!topic.trim()) {
                        setErrorMsg('Please describe your question / topic.');
                        return;
                      }
                      setErrorMsg(null);
                      setStep(2);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                    id="booking-next-step"
                  >
                    <span>Continue to Escrow</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Escrow Confirmation */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-brass-light border border-brass-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-brass" strokeWidth={1.75} />
                        <span className="font-display font-medium text-ink text-sm">Escrow Credit Hold</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-brass text-paper font-mono text-xs">
                        1 Credit Held
                      </span>
                    </div>

                    <div className="text-xs text-ink-subtle leading-relaxed space-y-1.5 border-t border-brass-border/60 pt-2 font-sans">
                      <p className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brass flex-shrink-0" strokeWidth={1.75} />
                        Available Ledger Balance: <strong className="font-mono text-ink">{activeStudent.credits.toFixed(2)} Credits</strong>
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        1 Credit will be placed in escrow hold upon booking. When the session completes, <strong className="font-semibold text-brass">your credit is refunded in full + you earn a +0.25 reliable attendee bonus</strong>!
                      </p>
                    </div>
                  </div>

                  {/* Policy Summary */}
                  <div className="p-4 rounded-xl bg-mist-subtle border border-mist text-xs space-y-2 font-sans">
                    <h4 className="font-display font-medium text-ink flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-signal" strokeWidth={1.75} /> Cancellation & Attendance Policy
                    </h4>
                    <ul className="list-disc list-inside text-ink-subtle space-y-1 text-[11px] leading-relaxed">
                      <li>Free cancellation up to 2 hours before scheduled session time.</li>
                      <li>Student No-Show: Credit forfeited and awarded to mentor as compensation credit.</li>
                      <li>3 rolling no-shows trigger a 7-day account cooldown.</li>
                    </ul>
                  </div>

                  {/* Booking Summary Box */}
                  <div className="p-4 rounded-xl bg-paper border border-mist text-xs space-y-1 font-sans">
                    <p className="text-ink font-display font-medium">{selectedSessionType} with {mentor.name}</p>
                    <p className="text-ink-subtle"><strong className="text-ink font-mono">Time:</strong> {selectedSlot}</p>
                    <p className="text-ink-subtle truncate"><strong className="text-ink font-mono">Topic:</strong> {topic}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-mist">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-mist text-ink-subtle hover:bg-mist-subtle text-xs font-medium"
                    id="booking-back-step"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                    id="confirm-booking-btn"
                  >
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                    Confirm & Hold 1 Credit
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

