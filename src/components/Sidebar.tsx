import React, { useState, useEffect } from 'react';
import {
  Compass,
  Calendar,
  MessageSquare,
  BookOpenCheck,
  Coins,
  Plus,
  History,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  User,
  Sparkles,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { CreditModal } from './CreditModal';

interface SidebarProps {
  onOpenHowItWorks: () => void;
  onOpenOnboarding: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenHowItWorks,
  onOpenOnboarding,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { activeTab, setActiveTab, activeStudent, logout } = useBridge();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  // Close mobile drawer on tab change
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'sessions', label: 'My Sessions', icon: Calendar },
    { id: 'qa', label: 'Q&A Feed', icon: MessageSquare },
    { id: 'insights', label: 'Insight Library', icon: BookOpenCheck },
  ];

  const isCooldownActive = activeStudent.noShowCount >= 3;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-paper/95 backdrop-blur-md border-b border-mist px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-mist-subtle text-ink hover:bg-mist transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('discover')}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-ink text-paper flex items-center justify-center font-display font-bold text-sm">
              B
            </div>
            <span className="font-display font-medium text-lg text-ink">Bridge</span>
          </button>
        </div>

        {/* Mobile Credit Quick Badge */}
        <button
          type="button"
          onClick={() => setIsCreditModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-brass-light border border-brass-border text-brass text-xs font-mono font-medium flex items-center gap-1.5"
        >
          <Coins className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>{activeStudent.credits.toFixed(2)} Cr</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay Backstep */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-ink/40 backdrop-blur-xs z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container (Desktop & Mobile Slide-Out) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-paper-card border-r border-mist flex flex-col justify-between transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header: Logo & Collapse Toggle */}
        <div className="p-4 border-b border-mist flex items-center justify-between min-h-[64px]">
          <button
            type="button"
            onClick={() => handleTabClick('discover')}
            className="flex items-center gap-3 overflow-hidden text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-ink text-paper flex items-center justify-center font-display font-bold text-base flex-shrink-0 shadow-2xs">
              B
            </div>
            {!isCollapsed && (
              <div className="leading-tight overflow-hidden">
                <span className="font-display font-medium text-lg text-ink block truncate">
                  Bridge
                </span>
                <span className="text-[10px] font-mono text-ink-muted uppercase block tracking-wider">
                  Micro-Mentorship
                </span>
              </div>
            )}
          </button>

          {/* Desktop Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-mist-subtle transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>

          {/* Mobile Close Drawer Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-mist-subtle"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Primary Nav Group */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full relative px-3 py-2.5 rounded-xl text-xs transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-signal-light text-ink font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-6 before:bg-signal before:rounded-r-full'
                      : 'text-ink-subtle hover:text-ink hover:bg-mist-subtle font-medium'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-signal' : 'text-ink-muted'
                    }`}
                    strokeWidth={1.75}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Visual Divider */}
          <div className="border-t border-mist" />

          {/* Secondary Group: Credit Balance Widget & Profile */}
          <div className="space-y-3">
            {/* Real Credit Balance Widget */}
            {!isCollapsed ? (
              <div className="p-3.5 rounded-2xl bg-brass-light border border-brass-border text-ink space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-brass font-mono text-[11px] font-semibold uppercase tracking-wider">
                    <Coins className="w-3.5 h-3.5 text-brass" strokeWidth={1.75} />
                    <span>Credit Balance</span>
                  </div>
                  {isCooldownActive && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-coral-light text-coral font-bold">
                      Cooldown
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-display font-medium text-ink">
                    {activeStudent.credits.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted">Credits</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-brass-border/60 text-[11px]">
                  <span className="text-ink-subtle text-[10px]">1 Cr / 15-min ask</span>
                  <button
                    type="button"
                    onClick={() => setIsCreditModalOpen(true)}
                    className="text-brass hover:underline font-mono font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" strokeWidth={1.75} />
                    <span>Get more</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreditModalOpen(true)}
                title={`Credit Balance: ${activeStudent.credits.toFixed(2)} Credits`}
                className="w-full p-2.5 rounded-xl bg-brass-light border border-brass-border text-brass flex flex-col items-center justify-center gap-1 text-center hover:bg-brass-light/80 transition-colors"
              >
                <Coins className="w-4 h-4 text-brass" strokeWidth={1.75} />
                <span className="text-[10px] font-mono font-bold">
                  {activeStudent.credits.toFixed(1)}
                </span>
              </button>
            )}

            {/* Profile Section */}
            {!isCollapsed ? (
              <div className="p-3 rounded-2xl border border-mist bg-paper/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeStudent.avatar}
                    alt={activeStudent.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-mist flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-display font-medium text-ink truncate">
                      {activeStudent.name}
                    </p>
                    <p className="text-[10px] text-ink-muted font-sans truncate">
                      {activeStudent.universityOrCompany || activeStudent.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-mist transition-colors flex-shrink-0"
                  title="Edit Profile Preferences"
                >
                  <Edit2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenOnboarding}
                title={`${activeStudent.name} (${activeStudent.title})`}
                className="w-full flex justify-center p-2 rounded-xl hover:bg-mist-subtle"
              >
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-mist"
                />
              </button>
            )}
          </div>
        </div>

        {/* Bottom-Anchored Group: Settings & Logout */}
        <div className="p-3 border-t border-mist space-y-1">
          <button
            type="button"
            onClick={onOpenHowItWorks}
            title={isCollapsed ? 'How Bridge Works' : undefined}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium text-ink-subtle hover:text-ink hover:bg-mist-subtle transition-colors flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-ink-muted flex-shrink-0" strokeWidth={1.75} />
            {!isCollapsed && <span>How Bridge Works</span>}
          </button>

          <button
            type="button"
            onClick={logout}
            title={isCollapsed ? 'Log out' : undefined}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium text-coral hover:bg-coral-light transition-colors flex items-center gap-3 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 text-coral flex-shrink-0" strokeWidth={1.75} />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Credit Ledger Modal */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />
    </>
  );
};
