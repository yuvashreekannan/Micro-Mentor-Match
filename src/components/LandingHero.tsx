import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  UserCheck,
  Briefcase,
  ArrowRight,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';

interface LandingHeroProps {
  onOpenHowItWorks: () => void;
  onOpenOnboarding: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenHowItWorks,
  onOpenOnboarding,
}) => {
  const { currentUserRole, setCurrentUserRole, activeStudent, activeMentor } = useBridge();

  return (
    <div className="bg-ink text-paper rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(20,33,61,0.08)] mb-6 border border-ink/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal"></span>
            <span className="text-xs font-mono text-mist uppercase tracking-wider">
              Mentorship Connection Bridge
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-medium leading-tight text-paper">
            Connecting students finding their footing with professionals who've crossed.
          </h1>

          <p className="text-mist text-xs sm:text-sm font-sans leading-relaxed max-w-xl pt-1">
            Low-commitment 15-minute asks, guaranteed attendance through credit escrow, and AI digests that preserve real advice.
          </p>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 pt-4 lg:pt-0 border-t border-mist/10 lg:border-t-0">
          {/* Role Toggle Pill */}
          <div className="flex items-center p-1 rounded-xl bg-ink-subtle border border-mist/20 text-xs">
            <span className="text-[11px] font-mono text-mist px-2.5">Perspective:</span>
            <button
              onClick={() => setCurrentUserRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentUserRole === 'student'
                  ? 'bg-signal text-paper font-semibold shadow-xs'
                  : 'text-mist hover:text-paper'
              }`}
              id="hero-select-student"
            >
              <UserCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> Student
            </button>
            <button
              onClick={() => setCurrentUserRole('mentor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentUserRole === 'mentor'
                  ? 'bg-signal text-paper font-semibold shadow-xs'
                  : 'text-mist hover:text-paper'
              }`}
              id="hero-select-mentor"
            >
              <Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} /> Mentor
            </button>
          </div>

          {/* Secondary Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOnboarding}
              className="px-3.5 py-2 rounded-xl bg-paper/10 hover:bg-paper/15 text-paper text-xs font-medium transition-colors border border-paper/15 flex items-center gap-1.5"
              id="hero-customize-preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-mist" strokeWidth={1.75} />
              <span>Configure Profile</span>
            </button>

            <button
              onClick={onOpenHowItWorks}
              className="px-3.5 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
              id="hero-view-architecture"
            >
              <HelpCircle className="w-3.5 h-3.5 text-paper" strokeWidth={1.75} />
              <span>How Bridge Works</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

