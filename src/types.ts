export type UserRole = 'student' | 'mentor';

export type GoalStage = 'exploring' | 'interviewing' | 'early_career';

export type SessionType = 'Resume Glance' | 'Quick Career Q' | 'Mock Interview Snippet';

export type SessionStatus =
  | 'Requested'
  | 'Confirmed'
  | 'Completed'
  | 'Student_No_Show'
  | 'Mentor_No_Show'
  | 'Cancelled';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  universityOrCompany: string;
  goalStage: GoalStage;
  careerGoal: string;
  interests: string[];
  credits: number;
  noShowCount: number;
  cooldownUntil?: string | null; // ISO string if cooldown is active
  reliabilityScore: number; // 0 - 100
  history: {
    attended: number;
    noShows: number;
    totalBooked: number;
  };
}

export interface MentorProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  industry: 'Tech' | 'Finance' | 'Design' | 'Healthcare' | 'Marketing' | 'Engineering';
  expertiseTags: string[];
  bio: string;
  availabilitySlots: {
    id: string;
    day: string;
    time: string;
  }[];
  reliabilityScore: number; // 0 - 100
  responseTimeMinutes: number;
  completedSessionsCount: number;
  history: {
    attended: number;
    noShows: number;
    totalBooked: number;
  };
}

export interface SessionDigest {
  summaryHeadline: string;
  keyAdvice: string[];
  resourcesMentioned: string[];
  suggestedNextStep: string;
  generatedAt: string;
}

export interface Session {
  id: string;
  studentId: string;
  mentorId: string;
  studentName: string;
  studentAvatar: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  mentorCompany: string;
  sessionType: SessionType;
  topic: string;
  scheduledAt: string; // e.g. "Tomorrow, 2:30 PM"
  creditCost: number;
  status: SessionStatus;
  rawNotesOrTranscript?: string;
  digest?: SessionDigest;
  isPublicInsight: boolean;
  createdAt: string;
}

export type CreditTransactionType =
  | 'Initial Grant'
  | 'Escrow Hold'
  | 'Escrow Refund'
  | 'Attendance Bonus'
  | 'No-Show Forfeit'
  | 'Mentor Compensation'
  | 'Mentor Penalty Penalty';

export interface CreditTransaction {
  id: string;
  userId: string;
  userRole: UserRole;
  amount: number; // e.g. -1, +1, +0.25
  type: CreditTransactionType;
  description: string;
  timestamp: string;
  sessionId?: string;
}

export interface QAAnswer {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  mentorCompany: string;
  content: string;
  isPrivateOffer?: boolean;
  createdAt: string;
  helpfulCount: number;
}

export interface QAQuestion {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentGoal: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
  answers: QAAnswer[];
}

export interface InsightCardData {
  id: string;
  sessionId: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  mentorAvatar: string;
  studentName: string;
  studentGoal: string;
  industry: string;
  topic: string;
  sessionType: SessionType;
  digest: SessionDigest;
  likesCount: number;
  createdAt: string;
}
