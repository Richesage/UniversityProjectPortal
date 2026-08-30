import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  INITIAL_TOPICS,
  INITIAL_PROPOSALS,
  INITIAL_SUBMISSIONS,
  INITIAL_MILESTONES,
  INITIAL_MEETINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPERVISORS,
  INITIAL_ASSIGNMENTS,
  LECTURER_STUDENTS,
  type Topic,
  type Proposal,
  type Submission,
  type Milestone,
  type Meeting,
  type Notification,
  type Supervisor,
  type StudentAssignment,
} from '../data/seed';

interface AppDataContextValue {
  topics: Topic[];
  proposals: Proposal[];
  submissions: Submission[];
  milestones: Milestone[];
  meetings: Meeting[];
  notifications: Notification[];
  supervisors: Supervisor[];
  assignments: StudentAssignment[];
  lecturerStudents: typeof LECTURER_STUDENTS;
  selectTopic: (studentId: string, topicId: string) => void;
  submitProposal: (proposal: Omit<Proposal, 'id' | 'status' | 'duplicateRisk' | 'similarityPercent'>) => void;
  uploadSubmission: (studentId: string, title: string, fileName: string) => void;
  uploadTopic: (topic: Omit<Topic, 'id' | 'enrolled' | 'status'>) => void;
  saveTopicDraft: (topic: Omit<Topic, 'id' | 'enrolled'>) => void;
  approveProposal: (proposalId: string, comments?: string) => void;
  rejectProposal: (proposalId: string, comments?: string) => void;
  requestModification: (proposalId: string, comments: string) => void;
  assignSupervisor: (studentId: string, supervisorId: string) => void;
  requestMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  giveFeedback: (submissionId: string, feedback: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getStudentAssignment: (studentId: string) => StudentAssignment | undefined;
  getStudentSubmissions: (studentId: string) => Submission[];
  getStudentMeetings: (studentId: string) => Meeting[];
  getUserNotifications: (userId: string) => Notification[];
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [milestones] = useState(INITIAL_MILESTONES);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [supervisors, setSupervisors] = useState(INITIAL_SUPERVISORS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [lecturerStudents] = useState(LECTURER_STUDENTS);

  const selectTopic = useCallback((studentId: string, topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic || topic.enrolled >= topic.maxStudents) return;
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, enrolled: t.enrolled + 1, studentId } : t))
    );
    setAssignments((prev) => {
      const existing = prev.find((a) => a.studentId === studentId);
      const updated: StudentAssignment = {
        studentId,
        topicId,
        topicTitle: topic.title,
        supervisorId: topic.lecturerId,
        supervisorName: topic.lecturerName,
        progress: existing?.progress ?? 10,
      };
      return existing
        ? prev.map((a) => (a.studentId === studentId ? updated : a))
        : [...prev, updated];
    });
  }, [topics]);

  const submitProposal = useCallback((proposal: Omit<Proposal, 'id' | 'status' | 'duplicateRisk' | 'similarityPercent'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pending',
      duplicateRisk: 'low',
      similarityPercent: Math.floor(Math.random() * 20),
    };
    setProposals((prev) => [...prev, newProposal]);
  }, []);

  const uploadSubmission = useCallback((studentId: string, title: string, fileName: string) => {
    const chapter = submissions.filter((s) => s.studentId === studentId).length + 1;
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      studentId,
      title,
      fileName,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending_review',
      chapter,
    };
    setSubmissions((prev) => [...prev, newSub]);
  }, [submissions]);

  const uploadTopic = useCallback((topic: Omit<Topic, 'id' | 'enrolled' | 'status'>) => {
    setTopics((prev) => [
      ...prev,
      { ...topic, id: `top-${Date.now()}`, enrolled: 0, status: 'approved' },
    ]);
  }, []);

  const saveTopicDraft = useCallback((topic: Omit<Topic, 'id' | 'enrolled'>) => {
    setTopics((prev) => [
      ...prev,
      { ...topic, id: `top-${Date.now()}`, enrolled: 0, status: 'draft' },
    ]);
  }, []);

  const approveProposal = useCallback((proposalId: string, comments?: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: 'approved' as const, comments } : p
      )
    );
  }, []);

  const rejectProposal = useCallback((proposalId: string, comments?: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: 'rejected' as const, comments } : p
      )
    );
  }, []);

  const requestModification = useCallback((proposalId: string, comments: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: 'modification_requested' as const, comments } : p
      )
    );
  }, []);

  const assignSupervisor = useCallback((studentId: string, supervisorId: string) => {
    const supervisor = supervisors.find((s) => s.id === supervisorId);
    if (!supervisor || supervisor.assignedStudents >= supervisor.maxCapacity) return;
    setSupervisors((prev) =>
      prev.map((s) =>
        s.id === supervisorId ? { ...s, assignedStudents: s.assignedStudents + 1 } : s
      )
    );
    setAssignments((prev) =>
      prev.map((a) =>
        a.studentId === studentId
          ? { ...a, supervisorId, supervisorName: supervisor.name }
          : a
      )
    );
  }, [supervisors]);

  const requestMeeting = useCallback((meeting: Omit<Meeting, 'id'>) => {
    setMeetings((prev) => [...prev, { ...meeting, id: `meet-${Date.now()}` }]);
  }, []);

  const giveFeedback = useCallback((submissionId: string, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, feedback, status: 'reviewed' as const } : s
      )
    );
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const getStudentAssignment = useCallback(
    (studentId: string) => assignments.find((a) => a.studentId === studentId),
    [assignments]
  );

  const getStudentSubmissions = useCallback(
    (studentId: string) => submissions.filter((s) => s.studentId === studentId),
    [submissions]
  );

  const getStudentMeetings = useCallback(
    (studentId: string) => meetings.filter((m) => m.studentId === studentId),
    [meetings]
  );

  const getUserNotifications = useCallback(
    (userId: string) => notifications.filter((n) => n.userId === userId),
    [notifications]
  );

  return (
    <AppDataContext.Provider
      value={{
        topics,
        proposals,
        submissions,
        milestones,
        meetings,
        notifications,
        supervisors,
        assignments,
        lecturerStudents,
        selectTopic,
        submitProposal,
        uploadSubmission,
        uploadTopic,
        saveTopicDraft,
        approveProposal,
        rejectProposal,
        requestModification,
        assignSupervisor,
        requestMeeting,
        giveFeedback,
        markNotificationRead,
        getStudentAssignment,
        getStudentSubmissions,
        getStudentMeetings,
        getUserNotifications,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
