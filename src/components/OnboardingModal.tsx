import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Target, Briefcase } from 'lucide-react';
import { useBridge } from '../context/BridgeContext';
import { GoalStage, MentorProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOAL_STAGES: { id: GoalStage; label: string; desc: string }[] = [
  { id: 'exploring', label: 'Exploring Fields', desc: 'Curious about different career paths & industries' },
  { id: 'interviewing', label: 'Actively Interviewing', desc: 'Preparing resumes, portfolios & mock technical calls' },
  { id: 'early_career', label: 'Early Career Growth', desc: 'First 1-3 years in role, aiming for promotion' },
];

const STUDENT_TAG_OPTIONS = [
  'Tech Resume',
  'Frontend',
  'Distributed Systems',
  'Product Strategy',
  'FinTech',
  'UX Research',
  'Design Systems',
  'Healthcare',
  'MedTech',
  'Growth Strategy',
  'Mock Interview Snippet',
  'Resume Glance',
];

const MENTOR_INDUSTRIES: MentorProfile['industry'][] = [
  'Tech',
  'Finance',
  'Design',
  'Healthcare',
  'Marketing',
  'Engineering',
];

const MENTOR_TAG_OPTIONS = [
  'Tech Resume',
  'System Design',
  'Portfolio Review',
  'Financial Modeling',
  'MedTech',
  'Growth Strategy',
  'Agile',
  'Product Strategy',
  'Mock Interview Snippet',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUserRole,
    activeStudent,
    activeMentor,
    updateStudentOnboarding,
    updateMentorOnboarding,
  } = useBridge();

  // Student form state
  const [goalStage, setGoalStage] = useState<GoalStage>(activeStudent.goalStage);
  const [careerGoal, setCareerGoal] = useState(activeStudent.careerGoal);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(activeStudent.interests);

  // Mentor form state
  const [industry, setIndustry] = useState<MentorProfile['industry']>(activeMentor.industry);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(activeMentor.expertiseTags);
  const [bio, setBio] = useState(activeMentor.bio);

  if (!isOpen) return null;

  const toggleTag = (tag: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(tag)) {
      setter(current.filter((t) => t !== tag));
    } else {
      setter([...current, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole === 'student') {
      updateStudentOnboarding(goalStage, careerGoal, selectedInterests);
    } else {
      updateMentorOnboarding(industry, selectedExpertise, bio);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-xl bg-paper-card rounded-[20px] shadow-2xl overflow-hidden border border-mist"
          id="onboarding-modal"
        >
          {/* Header */}
          <div className="bg-ink p-6 text-paper relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors"
              id="close-onboarding"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <div className="flex items-center gap-2 text-brass font-mono text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.75} /> Profile Preferences
            </div>
            <h2 className="text-2xl font-display font-medium text-paper">
              {currentUserRole === 'student' ? 'Customize Student Goals' : 'Update Mentor Focus'}
            </h2>
            <p className="text-mist text-xs mt-1 font-sans">
              {currentUserRole === 'student'
                ? 'Tune your matching feed algorithm to find mentors aligned with your targets.'
                : 'Help students discover your 15-minute mentorship availability and domain focus.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {currentUserRole === 'student' ? (
              <>
                {/* Goal Stage Selection */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    Where are you in your career journey?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {GOAL_STAGES.map((stage) => {
                      const isSelected = goalStage === stage.id;
                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setGoalStage(stage.id)}
                          className={`p-3 text-left rounded-xl border transition-colors text-xs flex flex-col justify-between ${
                            isSelected
                              ? 'border-signal bg-signal-light text-ink font-medium shadow-2xs'
                              : 'border-mist hover:border-mist-dark bg-paper text-ink-subtle'
                          }`}
                        >
                          <span className="font-display font-medium mb-1 flex items-center justify-between text-ink">
                            {stage.label}
                            {isSelected && <Check className="w-3.5 h-3.5 text-signal" strokeWidth={1.75} />}
                          </span>
                          <span className="text-[10px] text-ink-muted leading-snug font-sans">{stage.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Career Goal */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    Specific Target Role or Goal
                  </label>
                  <div className="relative">
                    <Target className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                    <input
                      type="text"
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      placeholder="e.g. Software Engineer at Tier-1 Tech, Product Designer, FinTech Analyst"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                      required
                      id="onboarding-career-goal"
                    />
                  </div>
                </div>

                {/* Interest Tags */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    Topic & Skill Interests
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STUDENT_TAG_OPTIONS.map((tag) => {
                      const isSel = selectedInterests.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag, selectedInterests, setSelectedInterests)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                            isSel
                              ? 'bg-signal text-paper font-medium'
                              : 'bg-mist-subtle text-ink-subtle hover:bg-mist'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Industry Selection */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    Primary Industry Sector
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MENTOR_INDUSTRIES.map((ind) => {
                      const isSel = industry === ind;
                      return (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setIndustry(ind)}
                          className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-colors ${
                            isSel
                              ? 'border-brass bg-brass-light text-ink font-semibold shadow-2xs'
                              : 'border-mist hover:border-mist-dark bg-paper text-ink-subtle'
                          }`}
                        >
                          {ind}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expertise Tags */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-2">
                    Expertise Tags (15-min focus)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MENTOR_TAG_OPTIONS.map((tag) => {
                      const isSel = selectedExpertise.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag, selectedExpertise, setSelectedExpertise)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                            isSel
                              ? 'bg-brass text-paper font-medium'
                              : 'bg-mist-subtle text-ink-subtle hover:bg-mist'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase mb-1">
                    Short Mentor Bio (1-2 sentences)
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-ink-muted" strokeWidth={1.75} />
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your experience and what students can expect from a 15-min call."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-mist bg-paper-card text-xs text-ink placeholder:text-ink-muted focus:outline-2 focus:outline-offset-1 focus:outline-signal"
                      required
                      id="onboarding-mentor-bio"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex justify-end gap-3 border-t border-mist">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-mist text-ink-subtle hover:bg-mist-subtle text-xs font-medium"
                id="cancel-onboarding"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs"
                id="save-onboarding"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

