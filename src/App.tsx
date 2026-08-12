import React, { useState } from 'react';
import { BridgeProvider, useBridge } from './context/BridgeContext';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { LandingHero } from './components/LandingHero';
import { MatchingFeed } from './components/MatchingFeed';
import { BookingModal } from './components/BookingModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SessionsView } from './components/SessionsView';
import { QAFeedView } from './components/QAFeedView';
import { InsightLibraryView } from './components/InsightLibraryView';
import { MentorProfile } from './types';
import { Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, activeTab, setActiveTab, currentUserRole, setCurrentUserRole } = useBridge();

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sidebar Collapsed State Persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('bridge_sidebar_collapsed') === 'true';
  });

  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    localStorage.setItem('bridge_sidebar_collapsed', String(collapsed));
  };

  // Booking modal state
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<MentorProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenBooking = (mentor: MentorProfile) => {
    if (currentUserRole === 'mentor') {
      if (confirm("Switch to Student role to book a 15-minute ask with this mentor?")) {
        setCurrentUserRole('student');
        setSelectedMentorForBooking(mentor);
        setIsBookingModalOpen(true);
      }
      return;
    }
    setSelectedMentorForBooking(mentor);
    setIsBookingModalOpen(true);
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col selection:bg-signal selection:text-paper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-ink text-paper shadow-2xl border border-mist text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-brass" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={handleSetSidebarCollapsed}
      />

      {/* Main Content Area - Shifted Right for Sidebar */}
      <div
        className={`flex-1 flex flex-col justify-between transition-[padding] duration-200 ease-in-out pt-16 md:pt-0 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <>
              <LandingHero
                onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
              <MatchingFeed onSelectMentorToBook={handleOpenBooking} />
            </>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && <SessionsView />}

          {/* Q&A Tab */}
          {activeTab === 'qa' && <QAFeedView />}

          {/* Insights Tab */}
          {activeTab === 'insights' && <InsightLibraryView />}
        </main>

        {/* Footer */}
        <footer className="bg-paper-card border-t border-mist py-6 text-ink-muted text-xs text-center mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-display">
              <span className="font-bold text-ink text-sm">Bridge</span>
              <span>— Micro-Mentorship Platform</span>
            </div>
            <p className="text-ink-subtle text-[11px] font-sans">
              15-Minute Asks • Escrow Credit Accountability • Gemini AI Session Digests
            </p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onSelectRole={(role) => setCurrentUserRole(role)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <BookingModal
        mentor={selectedMentorForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => {
          showToast("15-Minute session booked! 1 Credit held in escrow.");
          setActiveTab('sessions');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <BridgeProvider>
      <MainContent />
    </BridgeProvider>
  );
}
