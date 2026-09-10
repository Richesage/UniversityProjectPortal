/**
 * Centralised API layer.
 *
 * Set VITE_API_BASE_URL in your .env file to point at your backend.
 * When the variable is absent the module operates in mock mode —
 * every function resolves with realistic data after a short delay.
 * To connect to a real backend:
 *   1. Add VITE_API_BASE_URL=https://your-api.example.com to .env
 *   2. Remove the `if (IS_MOCK)` branches (or keep them as a fallback).
 */

import {
  MOCK_AUTH,
  MOCK_TOPICS, MOCK_LECTURER_TOPICS,
  MOCK_PROJECT, MOCK_SUBMISSIONS,
  MOCK_STUDENT_CONVERSATIONS, MOCK_STUDENT_MESSAGES,
  MOCK_LECTURER_CONVERSATIONS, MOCK_LECTURER_MESSAGES,
  MOCK_LECTURER_STATS, MOCK_ASSIGNED_STUDENTS,
  MOCK_ADMIN_STATS, MOCK_NOTIFICATIONS,
  MOCK_UNALLOCATED_STUDENTS, MOCK_SUPERVISORS, MOCK_REPORT_ROWS,
} from './mockData';

import type {
  AuthResponse, LoginPayload, RegisterPayload,
  Topic, TopicFormData, TopicFilters, Project,
  Submission, Message, Conversation, MessageType,
  LecturerStats, StudentRecord, SupervisorRecord,
  AdminStats, AppNotification, ReportFilters, ReportRow,
} from '../types';

// ─── Base client ──────────────────────────────────────────────────────────────

const BASE_URL: string = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_BASE_URL ?? '';
export const IS_MOCK = !BASE_URL;

function pause(ms = 500) { return new Promise<void>((r) => setTimeout(r, ms)); }

function getToken() { return localStorage.getItem('upp_token'); }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = init.body instanceof FormData;
  const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  Object.assign(headers, init.headers ?? {});

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /** Login with matric/staff ID or email + password. */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (IS_MOCK) {
      await pause(600);
      return MOCK_AUTH[payload._mockRole ?? 'student'];
    }
    return request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },

  /** Register a new user account. */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (IS_MOCK) {
      await pause(800);
      return MOCK_AUTH[payload.role];
    }
    return request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },

  /** Invalidate the current session server-side. */
  logout: async (): Promise<void> => {
    if (IS_MOCK) return;
    return request<void>('/auth/logout', { method: 'POST' });
  },
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const topicsApi = {
  /** List available topics with optional search/filter. */
  list: async (filters?: Partial<TopicFilters>): Promise<Topic[]> => {
    if (IS_MOCK) {
      await pause(400);
      let topics = [...MOCK_TOPICS];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        topics = topics.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.lecturerName.toLowerCase().includes(q) ||
          t.specialization.toLowerCase().includes(q)
        );
      }
      if (filters?.department && filters.department !== '') {
        topics = topics.filter(t => t.department === filters.department);
      }
      if (filters?.researchArea && filters.researchArea !== '') {
        topics = topics.filter(t => t.researchArea === filters.researchArea);
      }
      return topics;
    }
    const params = new URLSearchParams(filters as Record<string, string> ?? {});
    return request<Topic[]>(`/topics?${params}`);
  },

  /** Fetch topics created by the authenticated lecturer. */
  myTopics: async (): Promise<Topic[]> => {
    if (IS_MOCK) { await pause(400); return MOCK_LECTURER_TOPICS; }
    return request<Topic[]>('/topics/my');
  },

  /** Create a new project topic (lecturer). */
  create: async (data: TopicFormData): Promise<Topic> => {
    if (IS_MOCK) {
      await pause(600);
      return {
        ...data, id: `top-${Date.now()}`,
        lecturerId: 'lec-001', lecturerName: 'Dr. Amina Yusuf',
        specialization: 'Machine Learning & AI',
        enrolledStudents: 0, status: 'pending_approval', createdAt: new Date().toISOString(),
      };
    }
    return request<Topic>('/topics', { method: 'POST', body: JSON.stringify(data) });
  },

  /** Student selects an existing topic. */
  select: async (topicId: string): Promise<void> => {
    if (IS_MOCK) { await pause(500); return; }
    return request<void>(`/topics/${topicId}/select`, { method: 'POST' });
  },

  /** Student proposes their own topic (with optional PDF upload). */
  propose: async (data: { title: string; description: string; file?: File | null }): Promise<void> => {
    if (IS_MOCK) { await pause(700); return; }
    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('description', data.description);
    if (data.file) fd.append('file', data.file);
    return request<void>('/topics/propose', { method: 'POST', body: fd });
  },
};

// ─── Project (student) ────────────────────────────────────────────────────────

export const projectApi = {
  /** Returns the authenticated student's active project, or null. */
  current: async (): Promise<Project | null> => {
    if (IS_MOCK) { await pause(400); return MOCK_PROJECT; }
    return request<Project | null>('/student/project');
  },
};

// ─── Submissions ──────────────────────────────────────────────────────────────

export const submissionsApi = {
  /** List all submissions for the authenticated student (or a specific project). */
  list: async (): Promise<Submission[]> => {
    if (IS_MOCK) { await pause(400); return MOCK_SUBMISSIONS; }
    return request<Submission[]>('/submissions');
  },

  /** Upload a new chapter document. */
  upload: async (file: File, chapterLabel: string): Promise<Submission> => {
    if (IS_MOCK) {
      await pause(800);
      const newSub: Submission = {
        id: `sub-${Date.now()}`, projectId: 'proj-001', studentId: 'stu-001',
        chapterLabel, fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString(), status: 'pending_review',
      };
      return newSub;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('chapterLabel', chapterLabel);
    return request<Submission>('/submissions', { method: 'POST', body: fd });
  },

  /** Lecturer adds feedback to a submission. */
  review: async (submissionId: string, feedback: string, status: string): Promise<Submission> => {
    if (IS_MOCK) {
      await pause(500);
      return { ...MOCK_SUBMISSIONS[0], id: submissionId, feedback, status: status as Submission['status'] };
    }
    return request<Submission>(`/submissions/${submissionId}/review`, {
      method: 'PATCH', body: JSON.stringify({ feedback, status }),
    });
  },
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messagesApi = {
  /** List conversations for the current user. */
  conversations: async (role: 'student' | 'lecturer'): Promise<Conversation[]> => {
    if (IS_MOCK) {
      await pause(400);
      return role === 'student' ? MOCK_STUDENT_CONVERSATIONS : MOCK_LECTURER_CONVERSATIONS;
    }
    return request<Conversation[]>('/messages/conversations');
  },

  /** Fetch the message thread for a conversation. */
  thread: async (conversationId: string, role: 'student' | 'lecturer'): Promise<Message[]> => {
    if (IS_MOCK) {
      await pause(300);
      const map = role === 'student' ? MOCK_STUDENT_MESSAGES : MOCK_LECTURER_MESSAGES;
      return map[conversationId] ?? [];
    }
    return request<Message[]>(`/messages/conversations/${conversationId}`);
  },

  /** Send a text message. */
  send: async (conversationId: string, senderId: string, senderName: string, content: string, type: MessageType = 'text'): Promise<Message> => {
    if (IS_MOCK) {
      await pause(300);
      return { id: `msg-${Date.now()}`, conversationId, senderId, senderName, type, content, sentAt: new Date().toISOString() };
    }
    return request<Message>(`/messages/conversations/${conversationId}`, {
      method: 'POST', body: JSON.stringify({ content, type }),
    });
  },

  /** Upload and send an image or video attachment. */
  sendMedia: async (conversationId: string, senderId: string, senderName: string, file: File, type: 'image' | 'video'): Promise<Message> => {
    if (IS_MOCK) {
      await pause(600);
      return { id: `msg-${Date.now()}`, conversationId, senderId, senderName, type, content: file.name, sentAt: new Date().toISOString() };
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    return request<Message>(`/messages/conversations/${conversationId}/media`, { method: 'POST', body: fd });
  },
};

// ─── Lecturer ─────────────────────────────────────────────────────────────────

export const lecturerApi = {
  /** Dashboard summary stats for the authenticated lecturer. */
  stats: async (): Promise<LecturerStats> => {
    if (IS_MOCK) { await pause(400); return MOCK_LECTURER_STATS; }
    return request<LecturerStats>('/lecturer/stats');
  },

  /** Students supervised by the authenticated lecturer. */
  students: async (search?: string): Promise<StudentRecord[]> => {
    if (IS_MOCK) {
      await pause(400);
      if (!search) return MOCK_ASSIGNED_STUDENTS;
      const q = search.toLowerCase();
      return MOCK_ASSIGNED_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q)
      );
    }
    return request<StudentRecord[]>(`/lecturer/students${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  /** System-wide summary statistics. */
  stats: async (): Promise<AdminStats> => {
    if (IS_MOCK) { await pause(400); return MOCK_ADMIN_STATS; }
    return request<AdminStats>('/admin/stats');
  },

  /** Admin notification feed. */
  notifications: async (): Promise<AppNotification[]> => {
    if (IS_MOCK) { await pause(300); return MOCK_NOTIFICATIONS; }
    return request<AppNotification[]>('/admin/notifications');
  },

  /** Students without an assigned supervisor. */
  unallocatedStudents: async (): Promise<StudentRecord[]> => {
    if (IS_MOCK) { await pause(400); return MOCK_UNALLOCATED_STUDENTS; }
    return request<StudentRecord[]>('/admin/students?allocated=false');
  },

  /** All supervisors, optionally filtered by name/specialization. */
  supervisors: async (search?: string): Promise<SupervisorRecord[]> => {
    if (IS_MOCK) {
      await pause(400);
      if (!search) return MOCK_SUPERVISORS;
      const q = search.toLowerCase();
      return MOCK_SUPERVISORS.filter(s =>
        s.name.toLowerCase().includes(q) || s.specialization.toLowerCase().includes(q)
      );
    }
    return request<SupervisorRecord[]>(`/admin/supervisors${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  /** Assign a supervisor to a student. */
  allocate: async (studentId: string, supervisorId: string): Promise<void> => {
    if (IS_MOCK) { await pause(500); return; }
    return request<void>('/admin/allocations', { method: 'POST', body: JSON.stringify({ studentId, supervisorId }) });
  },

  /** Generate a filtered report. */
  generateReport: async (filters: ReportFilters): Promise<ReportRow[]> => {
    if (IS_MOCK) { await pause(700); return MOCK_REPORT_ROWS; }
    return request<ReportRow[]>('/admin/reports/generate', { method: 'POST', body: JSON.stringify(filters) });
  },

  /** Export report as PDF or Excel; returns a download URL. */
  exportReport: async (filters: ReportFilters, format: 'pdf' | 'excel'): Promise<{ url: string }> => {
    if (IS_MOCK) { await pause(500); return { url: '#' }; }
    return request<{ url: string }>(`/admin/reports/export/${format}`, { method: 'POST', body: JSON.stringify(filters) });
  },
};
