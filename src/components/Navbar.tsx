import React from 'react';
import {
  Compass,
  CalendarCheck2,
  MessageSquare,
  BookOpenCheck,
  HelpCircle,
  RotateCcw,
  UserCheck,
  Coins,
  SlidersHorizontal,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';

interface NavbarProps {
  onOpenHowItWorks: () => void;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHowItWorks, onOpenOnboarding }) => {
  const {
    currentUserRole,
    setCurrentUserRole,
    activeStudent,
    activeMentor,
    sessions,
    activeTab,
    setActiveTab,
    resetDemoData,
  } = useBridge();

  // Pending / active session counts
  const pendingCount = sessions.filter((s) => {
    if (currentUserRole === 'student') return s.studentId === activeStudent.id && s.status === 'Requested';
    return s.mentorId === activeMentor.id && s.status === 'Requested';
  }).length;

  const activeUserAvatar = currentUserRole === 'student' ? activeStudent.avatar : activeMentor.avatar;
  const activeUserName = currentUserRole === 'student' ? activeStudent.name : activeMentor.name;
  const activeUserTitle = currentUserRole === 'student' ? activeStudent.title : `${activeMentor.title} @ ${activeMentor.company}`;

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2.5 group text-left"
              id="nav-logo-btn"
            >
              <div className="w-9 h-9 rounded-[12px] bg-ink text-paper flex items-center justify-center font-display font-medium text-lg tracking-tight group-hover:bg-signal transition-colors">
                B
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-semibold text-lg text-ink tracking-tight">Bridge</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-mist text-ink-subtle uppercase tracking-wider">
                    Mentorship
                  </span>
                </div>
                <p className="text-[10px] text-ink-muted font-sans">15-Min Ask Platform</p>
              </div>
            </button>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-mist/50 p-1 rounded-xl border border-mist">
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'discover'
                    ? 'bg-paper-card text-signal font-semibold shadow-2xs'
                    : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                }`}
                id="nav-tab-discover"
              >
                <Compass className="w-4 h-4 text-signal" strokeWidth={1.75} />
                <span>Discover</span>
              </button>

              <button
                onClick={() => setActiveTab('sessions')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  activeTab === 'sessions'
                    ? 'bg-paper-card text-signal font-semibold shadow-2xs'
                    : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                }`}
                id="nav-tab-sessions"
              >
                <CalendarCheck2 className="w-4 h-4 text-signal" strokeWidth={1.75} />
                <span>Sessions</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-coral text-paper text-[10px] font-mono font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'qa'
                    ? 'bg-paper-card text-signal font-semibold shadow-2xs'
                    : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                }`}
                id="nav-tab-qa"
              >
                <MessageSquare className="w-4 h-4 text-signal" strokeWidth={1.75} />
                <span>Q&A Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'insights'
                    ? 'bg-paper-card text-signal font-semibold shadow-2xs'
                    : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                }`}
                id="nav-tab-insights"
              >
                <BookOpenCheck className="w-4 h-4 text-signal" strokeWidth={1.75} />
                <span>Insight Library</span>
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Student Earned Credit Badge (Brass Token) */}
            {currentUserRole === 'student' && (
              <button
                onClick={() => setActiveTab('sessions')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brass-light border border-brass-border text-ink text-xs font-mono font-medium transition-colors hover:bg-brass-light/80 shadow-2xs"
                title="Your Credit Balance. Click to view history."
                id="credit-balance-badge"
              >
                <Coins className="w-3.5 h-3.5 text-brass" strokeWidth={1.75} />
                <span>{activeStudent.credits.toFixed(2)} Credits</span>
              </button>
            )}

            {/* Quick Perspective Role Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-ink text-paper text-xs">
              <button
                onClick={() => setCurrentUserRole('student')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  currentUserRole === 'student'
                    ? 'bg-signal text-paper font-semibold shadow-xs'
                    : 'text-mist hover:text-paper'
                }`}
                id="role-switch-student"
              >
                <span>Student</span>
              </button>
              <button
                onClick={() => setCurrentUserRole('mentor')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  currentUserRole === 'mentor'
                    ? 'bg-signal text-paper font-semibold shadow-xs'
                    : 'text-mist hover:text-paper'
                }`}
                id="role-switch-mentor"
              >
                <span>Mentor</span>
              </button>
            </div>

            {/* Profile Avatar / Preferences button */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-mist/50 transition-colors border border-transparent hover:border-mist"
              title="Configure Profile Preferences"
              id="user-profile-btn"
              aria-label="Configure profile preferences"
            >
              <img
                src={activeUserAvatar}
                alt={activeUserName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-mist"
              />
              <div className="hidden lg:block text-left text-xs">
                <p className="font-medium text-ink leading-tight flex items-center gap-1">
                  {activeUserName}
                  <SlidersHorizontal className="w-3 h-3 text-ink-muted" strokeWidth={1.75} />
                </p>
                <p className="text-[10px] text-ink-muted truncate max-w-[110px]">{activeUserTitle}</p>
              </div>
            </button>

            {/* How Bridge Works button */}
            <button
              onClick={onOpenHowItWorks}
              className="p-2 rounded-xl bg-mist/40 hover:bg-mist text-ink-subtle transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
              title="How Bridge Works Guide"
              id="how-it-works-nav-btn"
            >
              <HelpCircle className="w-4 h-4 text-signal" strokeWidth={1.75} />
              <span className="hidden xl:inline">Guide</span>
            </button>

            {/* Demo Reset Button */}
            <button
              onClick={() => {
                if (confirm('Reset prototype state to initial demo seed data?')) {
                  resetDemoData();
                }
              }}
              className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-mist/40 transition-colors"
              title="Reset Demo Data"
              id="reset-demo-data-btn"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-mist text-xs font-medium">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'discover' ? 'text-signal font-semibold' : 'text-ink-muted'
            }`}
          >
            <Compass className="w-4 h-4" strokeWidth={1.75} />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex flex-col items-center gap-0.5 relative ${
              activeTab === 'sessions' ? 'text-signal font-semibold' : 'text-ink-muted'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" strokeWidth={1.75} />
            <span>Sessions</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 rounded-full bg-coral text-paper text-[9px] font-mono font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'qa' ? 'text-signal font-semibold' : 'text-ink-muted'
            }`}
          >
            <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
            <span>Q&A</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center gap-0.5 ${
              activeTab === 'insights' ? 'text-signal font-semibold' : 'text-ink-muted'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" strokeWidth={1.75} />
            <span>Insights</span>
          </button>
        </div>
      </div>
    </header>
  );
};

