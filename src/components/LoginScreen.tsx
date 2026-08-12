import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Compass,
  Coins,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { ConnectingThread } from './ConnectingThread';
import { GoalStage } from '../types';

export const LoginScreen: React.FC = () => {
  const { loginStudent, signupStudent, students } = useBridge();

  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor'>('student');
  const [isSignup, setIsSignup] = useState(false);

  // Student Form State
  const [email, setEmail] = useState('maya.lin@berkeley.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [goalStage, setGoalStage] = useState<GoalStage>('interviewing');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'System Design',
    'Tech Resume',
    'Frontend',
  ]);

  // Validation Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mentor Notify State
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorNotified, setMentorNotified] = useState(false);

  const interestOptions = [
    'System Design',
    'Tech Resume',
    'Frontend',
    'Product Strategy',
    'FinTech',
    'Portfolio Review',
    'Interview Prep',
  ];

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Enter your university or personal email to continue.');
      return;
    }

    if (!isSignup) {
      if (password.length < 3) {
        setErrorMsg('Password must be at least 3 characters.');
        return;
      }
      loginStudent(email);
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      signupStudent({
        name,
        email,
        careerGoal: careerGoal || 'Software Engineer at Tier-1 Firm',
        goalStage,
        interests: selectedInterests,
        universityOrCompany: university || 'University Student',
      });
    }
  };

  const handleDemoStudentLogin = (demoEmail: string) => {
    loginStudent(demoEmail);
  };

  const handleMentorNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorEmail && mentorEmail.includes('@')) {
      setMentorNotified(true);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col justify-between relative overflow-hidden selection:bg-signal selection:text-paper">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#14213D_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ink text-paper flex items-center justify-center font-display font-bold text-base shadow-2xs">
            B
          </div>
          <span className="font-display font-medium text-xl tracking-tight text-ink">
            Bridge
          </span>
          <span className="px-2 py-0.5 rounded-md bg-brass-light border border-brass-border text-[10px] font-mono text-brass uppercase">
            15-Min Ask
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-ink-muted font-sans">
          <ShieldCheck className="w-4 h-4 text-brass" strokeWidth={1.75} />
          <span>Escrow-Protected Micro-Mentorship</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mist-subtle border border-mist text-ink-subtle text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brass" strokeWidth={1.75} />
            Connect Across The Bridge
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-ink tracking-tight">
            Micro-Mentorship Powered by 15-Minute Asks
          </h1>
          <p className="text-sm text-ink-subtle max-w-lg mx-auto font-sans">
            Verified mentors from Stripe, Airbnb, Goldman Sachs & Meta. Escrow credit held per ask — show up, get refunded, earn reliability bonuses.
          </p>
        </div>

        {/* Role Selector Cards with Connecting Thread Motif */}
        <div className="relative mb-8">
          {/* Subtle Connecting Thread Visual between cards */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 h-12 pointer-events-none z-0 opacity-40">
            <ConnectingThread height={48} progress={0.5} strokeColor="#B08D57" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto relative z-10">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg(null);
              }}
              className={`p-5 rounded-[20px] border text-left transition-all flex items-start gap-4 ${
                selectedRole === 'student'
                  ? 'bg-paper-card border-signal shadow-[0_4px_20px_-4px_rgba(20,33,61,0.12)] ring-1 ring-signal'
                  : 'bg-paper-card/70 border-mist hover:border-mist-dark text-ink-subtle'
              }`}
            >
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  selectedRole === 'student'
                    ? 'bg-signal text-paper'
                    : 'bg-mist text-ink-muted'
                }`}
              >
                <GraduationCap className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-medium text-base text-ink">
                    Continue as Student
                  </span>
                  {selectedRole === 'student' && (
                    <span className="w-2 h-2 rounded-full bg-signal" />
                  )}
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed font-sans">
                  Book 15-minute asks, build your credit history, and unlock AI session digests.
                </p>
              </div>
            </button>

            {/* Mentor Card */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('mentor');
                setErrorMsg(null);
              }}
              className={`p-5 rounded-[20px] border text-left transition-all flex items-start gap-4 ${
                selectedRole === 'mentor'
                  ? 'bg-paper-card border-brass shadow-[0_4px_20px_-4px_rgba(176,141,87,0.15)] ring-1 ring-brass'
                  : 'bg-paper-card/70 border-mist hover:border-mist-dark text-ink-subtle'
              }`}
            >
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  selectedRole === 'mentor'
                    ? 'bg-brass text-paper'
                    : 'bg-mist text-ink-muted'
                }`}
              >
                <Briefcase className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-medium text-base text-ink">
                    Continue as Mentor
                  </span>
                  {selectedRole === 'mentor' && (
                    <span className="w-2 h-2 rounded-full bg-brass" />
                  )}
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed font-sans">
                  Provide high-impact 15-min reviews and earn compensation credits.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Card Container for Forms */}
        <div className="max-w-md w-full mx-auto bg-paper-card rounded-[20px] border border-mist p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(20,33,61,0.08)]">
          <AnimatePresence mode="wait">
            {selectedRole === 'student' ? (
              <motion.div
                key="student-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Form Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-medium text-ink">
                      {isSignup ? 'Create Student Account' : 'Student Access'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(!isSignup);
                        setErrorMsg(null);
                      }}
                      className="text-xs font-mono text-signal hover:underline"
                    >
                      {isSignup ? 'Already have an account? Log in' : 'New here? Create account'}
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted font-sans">
                    {isSignup
                      ? 'Set up your student profile to start requesting 15-minute asks.'
                      : 'Log in to manage your 15-minute asks and credit escrow ledger.'}
                  </p>
                </div>

                {/* Inline Validation Error */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-coral-light border border-coral-border text-coral text-xs font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Student Login / Signup Form */}
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  {isSignup && (
                    <div>
                      <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Maya Lin"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                          required={isSignup}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                      {isSignup ? 'University / College Email' : 'Student Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. maya.lin@berkeley.edu"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        required
                      />
                    </div>
                  </div>

                  {isSignup && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                          School / Company
                        </label>
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="e.g. UC Berkeley / Career Switcher"
                          className="w-full px-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                          Target Career Goal
                        </label>
                        <input
                          type="text"
                          value={careerGoal}
                          onChange={(e) => setCareerGoal(e.target.value)}
                          placeholder="e.g. Software Engineer at Tier-1 Tech"
                          className="w-full px-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                          Career Stage
                        </label>
                        <select
                          value={goalStage}
                          onChange={(e) => setGoalStage(e.target.value as GoalStage)}
                          className="w-full px-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                        >
                          <option value="exploring">Exploring Career Options</option>
                          <option value="interviewing">Actively Interviewing</option>
                          <option value="early_career">Early Career Professional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                          Topics You Want Mentorship On
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {interestOptions.map((opt) => {
                            const isSel = selectedInterests.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setSelectedInterests(
                                    isSel
                                      ? selectedInterests.filter((i) => i !== opt)
                                      : [...selectedInterests, opt]
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                                  isSel
                                    ? 'bg-signal text-paper font-medium'
                                    : 'bg-mist-subtle text-ink-subtle hover:bg-mist'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{isSignup ? 'Create Account & Enter Dashboard' : 'Log In as Student'}</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </form>

                {/* One-Click Demo Access Shortcuts */}
                {!isSignup && (
                  <div className="pt-4 border-t border-mist space-y-2">
                    <p className="text-[11px] font-mono text-ink-muted uppercase text-center">
                      Quick Demo Profiles
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {students.slice(0, 3).map((std) => (
                        <button
                          key={std.id}
                          type="button"
                          onClick={() => handleDemoStudentLogin(std.name.toLowerCase())}
                          className="p-2.5 rounded-xl border border-mist bg-paper/60 hover:bg-paper hover:border-mist-dark text-left transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={std.avatar}
                              alt={std.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-mist"
                            />
                            <div>
                              <p className="font-display font-medium text-xs text-ink group-hover:text-signal">
                                {std.name}
                              </p>
                              <p className="text-[10px] text-ink-muted font-sans">
                                {std.title} • {std.credits.toFixed(2)} Credits
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-signal" strokeWidth={1.75} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="mentor-holding-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-center"
              >
                {/* Coming Soon Icon Header */}
                <div className="w-12 h-12 rounded-2xl bg-brass-light border border-brass-border text-brass flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" strokeWidth={1.75} />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-brass-light text-brass text-[10px] font-mono uppercase font-semibold">
                    Invite-Only Beta
                  </div>
                  <h2 className="text-xl font-display font-medium text-ink">
                    Mentor Portal Coming Soon
                  </h2>
                  <p className="text-xs text-ink-subtle leading-relaxed font-sans max-w-sm mx-auto">
                    We are currently onboarding tier-1 tech, design, and finance leads in selective batches to ensure high signal 15-minute asks.
                  </p>
                </div>

                {/* Notify List Form */}
                {!mentorNotified ? (
                  <form onSubmit={handleMentorNotifySubmit} className="space-y-3 pt-2">
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                      <input
                        type="email"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        placeholder="Enter work email (e.g. name@stripe.com)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mist bg-paper text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-brass"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-brass hover:opacity-95 text-paper text-xs font-medium transition-opacity shadow-2xs flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" strokeWidth={1.75} />
                      <span>Join Mentor Waitlist</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-brass-light border border-brass-border text-brass text-xs font-sans space-y-1">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-brass" strokeWidth={1.75} />
                    <p className="font-semibold text-ink">You're on the invite list!</p>
                    <p className="text-[11px] text-ink-subtle">
                      We'll reach out to <strong className="text-ink">{mentorEmail}</strong> with early access details.
                    </p>
                  </div>
                )}

                {/* Fallback to Student / Guest Option */}
                <div className="pt-4 border-t border-mist space-y-2">
                  <p className="text-[11px] text-ink-muted font-sans">
                    Want to explore the platform right now?
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDemoStudentLogin('maya.lin@berkeley.edu')}
                    className="w-full py-2.5 rounded-xl border border-mist bg-paper hover:bg-mist-subtle text-ink text-xs font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-signal" strokeWidth={1.75} />
                    <span>Explore Platform as Guest Student</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-ink-muted border-t border-mist">
        <p>Bridge Micro-Mentorship Platform • Escrow Credit Engine & AI Session Digests</p>
      </footer>
    </div>
  );
};
