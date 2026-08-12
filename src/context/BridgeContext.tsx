import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  StudentProfile,
  MentorProfile,
  Session,
  CreditTransaction,
  QAQuestion,
  InsightCardData,
  SessionStatus,
  SessionType,
  GoalStage,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MENTORS,
  INITIAL_SESSIONS,
  INITIAL_CREDIT_TRANSACTIONS,
  INITIAL_QA_QUESTIONS,
  INITIAL_INSIGHTS,
} from '../mockData';

interface BridgeContextType {
  isAuthenticated: boolean;
  loggedInStudentId: string | null;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  activeStudent: StudentProfile;
  activeMentor: MentorProfile;
  students: StudentProfile[];
  mentors: MentorProfile[];
  sessions: Session[];
  creditTransactions: CreditTransaction[];
  qaQuestions: QAQuestion[];
  insights: InsightCardData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Auth & Credit Actions
  loginStudent: (email: string) => { success: boolean; student?: StudentProfile; message?: string };
  signupStudent: (data: { name: string; email: string; careerGoal?: string; goalStage?: GoalStage; interests?: string[]; universityOrCompany?: string }) => { success: boolean; student?: StudentProfile; message?: string };
  logout: () => void;
  addCredits: (amount?: number, reason?: string) => void;

  // Actions
  bookSession: (mentorId: string, sessionType: SessionType, topic: string, scheduledAt: string) => { success: boolean; message: string };
  updateSessionStatus: (sessionId: string, newStatus: SessionStatus) => void;
  generateDigestForSession: (sessionId: string, rawTranscriptOverride?: string) => Promise<{ success: boolean; digest?: any }>;
  toggleInsightPublic: (sessionId: string) => void;
  postQAQuestion: (title: string, content: string, tags: string[]) => void;
  answerQAQuestion: (questionId: string, content: string, isPrivateOffer?: boolean) => void;
  upvoteQAAnswer: (questionId: string, answerId: string) => void;
  upvoteQAQuestion: (questionId: string) => void;
  upvoteInsight: (insightId: string) => void;
  updateStudentOnboarding: (goalStage: GoalStage, careerGoal: string, interests: string[]) => void;
  updateMentorOnboarding: (industry: MentorProfile['industry'], expertiseTags: string[], bio: string) => void;
  resetDemoData: () => void;
}

const BridgeContext = createContext<BridgeContextType | undefined>(undefined);

export const BridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('discover');

  // Auth State
  const [loggedInStudentId, setLoggedInStudentId] = useState<string | null>(() => {
    return localStorage.getItem('bridge_auth_student_id') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('bridge_auth_student_id');
  });

  // State
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('bridge_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [mentors, setMentors] = useState<MentorProfile[]>(() => {
    const saved = localStorage.getItem('bridge_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('bridge_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem('bridge_credit_txs');
    return saved ? JSON.parse(saved) : INITIAL_CREDIT_TRANSACTIONS;
  });

  const [qaQuestions, setQaQuestions] = useState<QAQuestion[]>(() => {
    const saved = localStorage.getItem('bridge_qa');
    return saved ? JSON.parse(saved) : INITIAL_QA_QUESTIONS;
  });

  const [insights, setInsights] = useState<InsightCardData[]>(() => {
    const saved = localStorage.getItem('bridge_insights');
    return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
  });

  // Save to localStorage for demo persistence
  useEffect(() => {
    localStorage.setItem('bridge_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bridge_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('bridge_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('bridge_credit_txs', JSON.stringify(creditTransactions));
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem('bridge_qa', JSON.stringify(qaQuestions));
  }, [qaQuestions]);

  useEffect(() => {
    localStorage.setItem('bridge_insights', JSON.stringify(insights));
  }, [insights]);

  const activeStudent = students.find((s) => s.id === loggedInStudentId) || students[0] || INITIAL_STUDENTS[0];
  const activeMentor = mentors[0] || INITIAL_MENTORS[0];

  // Auth Methods
  const loginStudent = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    let matched = students.find(
      (s) =>
        s.name.toLowerCase().includes(cleanEmail) ||
        s.title.toLowerCase().includes(cleanEmail) ||
        (cleanEmail.includes('maya') && s.id === 's1') ||
        (cleanEmail.includes('alex') && s.id === 's2') ||
        (cleanEmail.includes('jordan') && s.id === 's3') ||
        (cleanEmail.includes('priya') && s.id === 's4')
    );

    if (!matched) {
      matched = students[0] || INITIAL_STUDENTS[0];
    }

    setLoggedInStudentId(matched.id);
    setIsAuthenticated(true);
    localStorage.setItem('bridge_auth_student_id', matched.id);
    return { success: true, student: matched };
  };

  const signupStudent = (data: {
    name: string;
    email: string;
    careerGoal?: string;
    goalStage?: GoalStage;
    interests?: string[];
    universityOrCompany?: string;
  }) => {
    const newStudent: StudentProfile = {
      id: `s-${Date.now()}`,
      name: data.name.trim() || 'New Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: data.universityOrCompany || 'Student',
      universityOrCompany: data.universityOrCompany || 'University',
      goalStage: data.goalStage || 'exploring',
      careerGoal: data.careerGoal || 'Career Growth & Mentorship',
      interests: data.interests && data.interests.length > 0 ? data.interests : ['Tech Resume', 'Career Advice'],
      credits: 3.0,
      noShowCount: 0,
      cooldownUntil: null,
      reliabilityScore: 100,
      history: {
        attended: 0,
        noShows: 0,
        totalBooked: 0,
      },
    };

    setStudents((prev) => [newStudent, ...prev]);

    const welcomeTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId: newStudent.id,
      userRole: 'student',
      amount: 3.0,
      type: 'Initial Grant',
      description: 'Welcome credit grant upon signing up for Bridge',
      timestamp: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [welcomeTx, ...prev]);

    setLoggedInStudentId(newStudent.id);
    setIsAuthenticated(true);
    localStorage.setItem('bridge_auth_student_id', newStudent.id);
    return { success: true, student: newStudent };
  };

  const logout = () => {
    setLoggedInStudentId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bridge_auth_student_id');
  };

  const addCredits = (amount: number = 2.0, reason = 'Demo Credit Top-up') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, credits: s.credits + amount } : s))
    );

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId: activeStudent.id,
      userRole: 'student',
      amount,
      type: 'Initial Grant',
      description: reason,
      timestamp: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [tx, ...prev]);
  };

  // Book a 15-Minute Ask
  const bookSession = (mentorId: string, sessionType: SessionType, topic: string, scheduledAt: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    if (!mentor) return { success: false, message: 'Mentor not found' };

    // Check student cooldown / no-show status
    if (activeStudent.noShowCount >= 3) {
      return {
        success: false,
        message: 'Account under cooldown due to 3 rolling no-shows. Please wait for cooldown expiry.',
      };
    }

    const creditCost = 1;
    if (activeStudent.credits < creditCost) {
      return {
        success: false,
        message: `Insufficient credits (${activeStudent.credits.toFixed(2)} available, ${creditCost} required).`,
      };
    }

    const newSessionId = `sess-${Date.now().toString().slice(-4)}`;

    // Deduct / hold credit
    const updatedStudentCredits = activeStudent.credits - creditCost;
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, credits: updatedStudentCredits } : s))
    );

    // Record Hold transaction
    const holdTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId: activeStudent.id,
      userRole: 'student',
      amount: -creditCost,
      type: 'Escrow Hold',
      description: `Held 1.00 credit for 15-min ask with ${mentor.name}`,
      timestamp: new Date().toISOString(),
      sessionId: newSessionId,
    };
    setCreditTransactions((prev) => [holdTx, ...prev]);

    // Create session
    const newSession: Session = {
      id: newSessionId,
      studentId: activeStudent.id,
      mentorId: mentor.id,
      studentName: activeStudent.name,
      studentAvatar: activeStudent.avatar,
      mentorName: mentor.name,
      mentorAvatar: mentor.avatar,
      mentorTitle: mentor.title,
      mentorCompany: mentor.company,
      sessionType,
      topic,
      scheduledAt,
      creditCost,
      status: 'Requested',
      isPublicInsight: false,
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    return { success: true, message: 'Session requested successfully! Credit placed in escrow hold.' };
  };

  // Update Session Status (Requested -> Confirmed -> Completed / No-Show / Cancelled)
  const updateSessionStatus = (sessionId: string, newStatus: SessionStatus) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const oldStatus = session.status;
    if (oldStatus === newStatus) return;

    // Execute state transition logic for credits & reliability score
    if (newStatus === 'Completed') {
      // Refund student held credit + grant reliable attendee bonus (+0.25)
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === session.studentId) {
            const newAttended = s.history.attended + 1;
            const newTotal = s.history.totalBooked + 1;
            const newReliability = Math.round((newAttended / newTotal) * 100);
            return {
              ...s,
              credits: s.credits + 1.0 + 0.25, // Refund 1.0 + 0.25 bonus
              reliabilityScore: newReliability,
              history: { ...s.history, attended: newAttended, totalBooked: newTotal },
            };
          }
          return s;
        })
      );

      // Mentor compensation credit (+1.0)
      setMentors((prev) =>
        prev.map((m) => {
          if (m.id === session.mentorId) {
            return {
              ...m,
              completedSessionsCount: m.completedSessionsCount + 1,
              history: { ...m.history, attended: m.history.attended + 1, totalBooked: m.history.totalBooked + 1 },
            };
          }
          return m;
        })
      );

      // Add Credit Transactions
      const refundTx: CreditTransaction = {
        id: `tx-${Date.now()}-ref`,
        userId: session.studentId,
        userRole: 'student',
        amount: 1.0,
        type: 'Escrow Refund',
        description: `Escrow credit released for completed session with ${session.mentorName}`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      const bonusTx: CreditTransaction = {
        id: `tx-${Date.now()}-bon`,
        userId: session.studentId,
        userRole: 'student',
        amount: 0.25,
        type: 'Attendance Bonus',
        description: `Reliable attendee bonus (+0.25 credits) earned!`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      const mentorCompTx: CreditTransaction = {
        id: `tx-${Date.now()}-mcomp`,
        userId: session.mentorId,
        userRole: 'mentor',
        amount: 1.0,
        type: 'Mentor Compensation',
        description: `Earned 1.0 compensation credit for completed 15-min session`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      setCreditTransactions((prev) => [refundTx, bonusTx, mentorCompTx, ...prev]);
    } else if (newStatus === 'Student_No_Show') {
      // Student forfeit held credit (no refund), transferred to mentor as compensation credit
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === session.studentId) {
            const newNoShows = s.noShowCount + 1;
            const newTotal = s.history.totalBooked + 1;
            const newReliability = Math.max(0, Math.round((s.history.attended / newTotal) * 100));
            const isCooldown = newNoShows >= 3;
            const cooldownUntil = isCooldown ? new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() : null;

            return {
              ...s,
              noShowCount: newNoShows,
              cooldownUntil,
              reliabilityScore: newReliability,
              history: { ...s.history, noShows: s.history.noShows + 1, totalBooked: newTotal },
            };
          }
          return s;
        })
      );

      // Mentor compensation
      const forfeitTx: CreditTransaction = {
        id: `tx-${Date.now()}-forfeit`,
        userId: session.studentId,
        userRole: 'student',
        amount: 0, // Held credit forfeited
        type: 'No-Show Forfeit',
        description: `Credit forfeited due to student no-show for ${session.mentorName}`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      const mentorCompTx: CreditTransaction = {
        id: `tx-${Date.now()}-mforfeit`,
        userId: session.mentorId,
        userRole: 'mentor',
        amount: 1.0,
        type: 'Mentor Compensation',
        description: `Compensation credit granted for student no-show on session ${session.id}`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      setCreditTransactions((prev) => [forfeitTx, mentorCompTx, ...prev]);
    } else if (newStatus === 'Mentor_No_Show') {
      // Student gets held credit refunded (+1.0) + bonus compensation (+0.5)
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === session.studentId) {
            return {
              ...s,
              credits: s.credits + 1.0 + 0.5,
            };
          }
          return s;
        })
      );

      // Mentor reliability score drops
      setMentors((prev) =>
        prev.map((m) => {
          if (m.id === session.mentorId) {
            const newNoShows = m.history.noShows + 1;
            const newTotal = m.history.totalBooked + 1;
            const newReliability = Math.max(0, Math.round((m.history.attended / newTotal) * 100));
            return {
              ...m,
              reliabilityScore: newReliability,
              history: { ...m.history, noShows: newNoShows, totalBooked: newTotal },
            };
          }
          return m;
        })
      );

      const refundTx: CreditTransaction = {
        id: `tx-${Date.now()}-mno-ref`,
        userId: session.studentId,
        userRole: 'student',
        amount: 1.5,
        type: 'Escrow Refund',
        description: `Full refund + 0.50 bonus credit for mentor no-show`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      setCreditTransactions((prev) => [refundTx, ...prev]);
    } else if (newStatus === 'Cancelled') {
      // Return held credit to student if cancelled before start
      setStudents((prev) =>
        prev.map((s) => (s.id === session.studentId ? { ...s, credits: s.credits + 1.0 } : s))
      );

      const cancelTx: CreditTransaction = {
        id: `tx-${Date.now()}-cancel`,
        userId: session.studentId,
        userRole: 'student',
        amount: 1.0,
        type: 'Escrow Refund',
        description: `Escrow credit refunded due to session cancellation`,
        timestamp: new Date().toISOString(),
        sessionId: session.id,
      };

      setCreditTransactions((prev) => [cancelTx, ...prev]);
    }

    // Update status in state
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
    );
  };

  // Generate AI Insight Digest
  const generateDigestForSession = async (sessionId: string, rawTranscriptOverride?: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return { success: false };

    const student = students.find((st) => st.id === session.studentId);
    const mentor = mentors.find((m) => m.id === session.mentorId);

    const transcriptToUse =
      rawTranscriptOverride ||
      session.rawNotesOrTranscript ||
      `15-Minute Ask between ${session.studentName} and ${session.mentorName} regarding ${session.topic}. Discussed core challenges, key industry best practices, recommended readings, and 48-hour action steps.`;

    try {
      const res = await fetch('/api/generate-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorName: session.mentorName,
          studentName: session.studentName,
          sessionType: session.sessionType,
          topic: session.topic,
          rawTranscript: transcriptToUse,
          industry: mentor?.industry || 'Tech',
        }),
      });

      const data = await res.json();
      if (data.success && data.digest) {
        const digestObj = {
          ...data.digest,
          generatedAt: new Date().toISOString(),
        };

        // Update session with digest
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, digest: digestObj, rawNotesOrTranscript: transcriptToUse } : s))
        );

        // If public insight is toggled, also add to public insights library
        if (session.isPublicInsight) {
          const newInsightCard: InsightCardData = {
            id: `ins-${Date.now()}`,
            sessionId: session.id,
            mentorName: session.mentorName,
            mentorTitle: session.mentorTitle,
            mentorCompany: session.mentorCompany,
            mentorAvatar: session.mentorAvatar,
            studentName: session.studentName,
            studentGoal: student?.careerGoal || 'Student',
            industry: mentor?.industry || 'Tech',
            topic: session.topic,
            sessionType: session.sessionType,
            digest: digestObj,
            likesCount: 1,
            createdAt: new Date().toISOString(),
          };

          setInsights((prev) => [newInsightCard, ...prev.filter((i) => i.sessionId !== session.id)]);
        }

        return { success: true, digest: digestObj };
      }
    } catch (e) {
      console.error('Failed to generate digest:', e);
    }

    return { success: false };
  };

  // Toggle Insight Public
  const toggleInsightPublic = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const newPublic = !s.isPublicInsight;
          // If turning public and digest exists, sync to insights list
          if (newPublic && s.digest) {
            const student = students.find((st) => st.id === s.studentId);
            const mentor = mentors.find((m) => m.id === s.mentorId);
            const existingInsight = insights.find((i) => i.sessionId === s.id);
            if (!existingInsight) {
              const newCard: InsightCardData = {
                id: `ins-${Date.now()}`,
                sessionId: s.id,
                mentorName: s.mentorName,
                mentorTitle: s.mentorTitle,
                mentorCompany: s.mentorCompany,
                mentorAvatar: s.mentorAvatar,
                studentName: s.studentName,
                studentGoal: student?.careerGoal || 'Student',
                industry: mentor?.industry || 'Tech',
                topic: s.topic,
                sessionType: s.sessionType,
                digest: s.digest,
                likesCount: 1,
                createdAt: new Date().toISOString(),
              };
              setInsights((ins) => [newCard, ...ins]);
            }
          } else if (!newPublic) {
            // Remove from public insights list
            setInsights((ins) => ins.filter((i) => i.sessionId !== s.id));
          }
          return { ...s, isPublicInsight: newPublic };
        }
        return s;
      })
    );
  };

  // Q&A Actions
  const postQAQuestion = (title: string, content: string, tags: string[]) => {
    const newQuestion: QAQuestion = {
      id: `q-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentAvatar: activeStudent.avatar,
      studentGoal: activeStudent.careerGoal,
      title,
      content,
      tags,
      upvotes: 1,
      createdAt: 'Just now',
      answers: [],
    };
    setQaQuestions((prev) => [newQuestion, ...prev]);
  };

  const answerQAQuestion = (questionId: string, content: string, isPrivateOffer = false) => {
    const newAnswer = {
      id: `a-${Date.now()}`,
      mentorId: activeMentor.id,
      mentorName: activeMentor.name,
      mentorAvatar: activeMentor.avatar,
      mentorTitle: activeMentor.title,
      mentorCompany: activeMentor.company,
      content,
      isPrivateOffer,
      createdAt: 'Just now',
      helpfulCount: 0,
    };

    setQaQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q))
    );
  };

  const upvoteQAAnswer = (questionId: string, answerId: string) => {
    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === answerId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a)),
          };
        }
        return q;
      })
    );
  };

  const upvoteQAQuestion = (questionId: string) => {
    setQaQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const upvoteInsight = (insightId: string) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === insightId ? { ...i, likesCount: i.likesCount + 1 } : i))
    );
  };

  // Onboarding updates
  const updateStudentOnboarding = (goalStage: GoalStage, careerGoal: string, interests: string[]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, goalStage, careerGoal, interests } : s))
    );
  };

  const updateMentorOnboarding = (industry: MentorProfile['industry'], expertiseTags: string[], bio: string) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === activeMentor.id ? { ...m, industry, expertiseTags, bio } : m))
    );
  };

  // Reset demo
  const resetDemoData = () => {
    localStorage.removeItem('bridge_students');
    localStorage.removeItem('bridge_mentors');
    localStorage.removeItem('bridge_sessions');
    localStorage.removeItem('bridge_credit_txs');
    localStorage.removeItem('bridge_qa');
    localStorage.removeItem('bridge_insights');

    setStudents(INITIAL_STUDENTS);
    setMentors(INITIAL_MENTORS);
    setSessions(INITIAL_SESSIONS);
    setCreditTransactions(INITIAL_CREDIT_TRANSACTIONS);
    setQaQuestions(INITIAL_QA_QUESTIONS);
    setInsights(INITIAL_INSIGHTS);
  };

  return (
    <BridgeContext.Provider
      value={{
        isAuthenticated,
        loggedInStudentId,
        currentUserRole,
        setCurrentUserRole,
        activeStudent,
        activeMentor,
        students,
        mentors,
        sessions,
        creditTransactions,
        qaQuestions,
        insights,
        activeTab,
        setActiveTab,
        loginStudent,
        signupStudent,
        logout,
        addCredits,
        bookSession,
        updateSessionStatus,
        generateDigestForSession,
        toggleInsightPublic,
        postQAQuestion,
        answerQAQuestion,
        upvoteQAAnswer,
        upvoteQAQuestion,
        upvoteInsight,
        updateStudentOnboarding,
        updateMentorOnboarding,
        resetDemoData,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
};

export const useBridge = () => {
  const context = useContext(BridgeContext);
  if (!context) {
    throw new Error('useBridge must be used within a BridgeProvider');
  }
  return context;
};
