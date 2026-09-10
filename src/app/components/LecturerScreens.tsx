import React, { useState, useEffect, useRef } from 'react';
import {
  Users, FileText, Upload, BarChart2, MessageSquare,
  CheckCircle, Clock, AlertCircle, Search, X,
  ImageIcon, Video, Send, Paperclip, Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { topicsApi, lecturerApi, messagesApi, submissionsApi } from '../../lib/api';
import type { Topic, TopicFormData, StudentRecord, Conversation, Message, Submission } from '../../types';

interface ScreenProps { onNavigate: (screen: string) => void; }

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

function ChatBubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
  const time = new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 shadow-sm ${
        isMine ? 'bg-[#312DC4] text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
      }`}>
        {msg.type === 'text' && <p className="text-sm leading-relaxed">{msg.content}</p>}
        {msg.type === 'image' && (
          <div className="space-y-1">
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <ImageIcon className={`w-8 h-8 ${isMine ? 'text-white/60' : 'text-gray-400'}`} />
            </div>
            <p className="text-xs opacity-80">{msg.content}</p>
          </div>
        )}
        {msg.type === 'video' && (
          <div className="space-y-1">
            <div className="w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
              <Video className="w-8 h-8 text-white/60" />
            </div>
            <p className={`text-xs ${isMine ? 'opacity-80' : 'text-gray-500'}`}>{msg.content}</p>
          </div>
        )}
        <p className={`text-xs mt-1 ${isMine ? 'text-white/60 text-right' : 'text-gray-400'}`}>{time}</p>
      </div>
    </div>
  );
}

// ─── LecturerDashboard ────────────────────────────────────────────────────────
export function LecturerDashboard({ onNavigate }: ScreenProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assignedStudents: 0, activeProjects: 0, pendingReviews: 0, workloadPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lecturerApi.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Assigned Students', value: stats.assignedStudents, icon: Users, color: 'text-[#312DC4]', bg: 'bg-[#EEEDFB]' },
    { label: 'Active Projects',   value: stats.activeProjects,   icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Reviews',   value: stats.pendingReviews,   icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name ?? 'Lecturer'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{user?.specialization ?? 'Faculty Member'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{loading ? '—' : card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">Workload Capacity</h3>
          <span className="text-lg font-bold text-[#312DC4]">{loading ? '—' : stats.workloadPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${stats.workloadPercent >= 90 ? 'bg-red-500' : stats.workloadPercent >= 70 ? 'bg-amber-500' : 'bg-[#312DC4]'}`}
            style={{ width: `${stats.workloadPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{stats.workloadPercent >= 90 ? 'Near capacity — contact admin to adjust limits.' : 'Within acceptable range.'}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Upload Topic',   screen: 'topic-upload',  icon: Upload },
            { label: 'My Students',    screen: 'view-students', icon: Users },
            { label: 'Workload',       screen: 'workload',      icon: BarChart2 },
            { label: 'Messages',       screen: 'messages',      icon: MessageSquare },
          ].map((a) => (
            <button
              key={a.screen}
              onClick={() => onNavigate(a.screen)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#C5C3EC] hover:bg-[#EEEDFB] transition-colors"
            >
              <a.icon className="w-5 h-5 text-[#312DC4]" />
              <span className="text-xs font-medium text-gray-700 text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ProjectTopicUpload ───────────────────────────────────────────────────────
export function ProjectTopicUpload({ onNavigate: _onNavigate }: ScreenProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<TopicFormData>({ title: '', description: '', department: '', researchArea: '', maxStudents: 5 });

  const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering', 'Computer Engineering'];
  const RESEARCH_AREAS = ['Artificial Intelligence', 'Blockchain', 'Web Development', 'Internet of Things', 'Cybersecurity', 'Data Science', 'Mobile Computing'];

  useEffect(() => {
    topicsApi.myTopics().then(setTopics).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      const newTopic = await topicsApi.create(form);
      setTopics(prev => [newTopic, ...prev]);
      setForm({ title: '', description: '', department: '', researchArea: '', maxStudents: 5 });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const statusCls: Record<string, string> = {
    available:        'bg-emerald-50 text-emerald-700',
    pending_approval: 'bg-amber-50 text-amber-700',
    approved:         'bg-blue-50 text-blue-700',
    rejected:         'bg-red-50 text-red-700',
    full:             'bg-gray-50 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Upload Project Topics</h2>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-[#312DC4]" /> Add New Topic</h3>

        {success && (
          <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> Topic submitted for approval.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Enter topic title" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Describe the project topic…"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select required value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
              <select required value={form.researchArea} onChange={(e) => setForm(f => ({ ...f, researchArea: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">Select…</option>
                {RESEARCH_AREAS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
              <input type="number" min={1} max={20} required value={form.maxStudents}
                onChange={(e) => setForm(f => ({ ...f, maxStudents: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit Topic'}
          </button>
        </form>
      </div>

      {/* Topics list */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Your Topics</h3>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : topics.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No topics uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {topics.map((t) => (
              <div key={t.id} className="border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.department} · {t.researchArea} · {t.enrolledStudents}/{t.maxStudents} students</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusCls[t.status] ?? 'bg-gray-50 text-gray-600'}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ViewAssignedStudents ─────────────────────────────────────────────────────
export function ViewAssignedStudents({ onNavigate: _onNavigate }: ScreenProps) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reviewing, setReviewing] = useState<{ sub: Submission; studentName: string } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [savingFeedback, setSavingFeedback] = useState(false);

  useEffect(() => {
    const q = search.trim();
    setLoading(true);
    lecturerApi.students(q || undefined).then(setStudents).finally(() => setLoading(false));
  }, [search]);

  const statusBadge: Record<string, string> = {
    pending_review: 'bg-amber-50 text-amber-700',
    up_to_date:     'bg-emerald-50 text-emerald-700',
    overdue:        'bg-red-50 text-red-700',
  };

  const handleSaveFeedback = async () => {
    if (!reviewing || !feedback.trim()) return;
    setSavingFeedback(true);
    try {
      await submissionsApi.review(reviewing.sub.id, feedback, 'reviewed');
      setReviewing(null);
      setFeedback('');
    } finally {
      setSavingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">My Students</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or reg. number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Topic</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Progress</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Submission</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td></tr>
                ))
                : students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.regNo} · {s.department}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate">{s.currentTopic}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#312DC4] h-1.5 rounded-full" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[s.submissionStatus] ?? 'bg-gray-50 text-gray-600'}`}>
                        {s.submissionStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.submissionStatus === 'pending_review' && (
                        <button
                          onClick={() => {
                            setReviewing({
                              sub: { id: `sub-${s.id}`, projectId: '', studentId: s.id, chapterLabel: 'Latest Chapter', fileName: '', uploadedAt: new Date().toISOString(), status: 'pending_review' },
                              studentName: s.name,
                            });
                            setFeedback('');
                          }}
                          className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Review — {reviewing.studentName}</h3>
              <button onClick={() => setReviewing(null)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <textarea
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback for this submission…"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveFeedback}
                disabled={!feedback.trim() || savingFeedback}
                className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60"
              >
                {savingFeedback ? 'Saving…' : 'Submit Feedback'}
              </button>
              <button onClick={() => setReviewing(null)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SupervisorWorkloadTracking ───────────────────────────────────────────────
export function SupervisorWorkloadTracking({ onNavigate: _onNavigate }: ScreenProps) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [stats, setStats] = useState({ assignedStudents: 0, activeProjects: 0, pendingReviews: 0, workloadPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([lecturerApi.students(), lecturerApi.stats()])
      .then(([s, st]) => { setStudents(s); setStats(st); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Workload Tracking</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Supervision Capacity</h3>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-bold text-[#312DC4]">{loading ? '—' : stats.workloadPercent}%</span>
            <span className="text-sm text-gray-500 mb-1">utilised</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${stats.workloadPercent >= 90 ? 'bg-red-500' : stats.workloadPercent >= 70 ? 'bg-amber-500' : 'bg-[#312DC4]'}`}
              style={{ width: `${stats.workloadPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{stats.assignedStudents} of 15 maximum student slots filled.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Summary</h3>
          <dl className="space-y-3">
            {[
              { label: 'Assigned Students', value: stats.assignedStudents },
              { label: 'Active Projects',   value: stats.activeProjects },
              { label: 'Pending Reviews',   value: stats.pendingReviews },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <dt className="text-gray-500">{row.label}</dt>
                <dd className="font-semibold text-gray-800">{loading ? '—' : row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Student Progress Overview</h3>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFB] flex items-center justify-center text-xs font-bold text-[#312DC4] shrink-0">
                  {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400 truncate">{s.currentTopic}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-[#312DC4] h-1.5 rounded-full" style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">{s.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LecturerMessaging ────────────────────────────────────────────────────────
export function LecturerMessaging({ onNavigate: _onNavigate }: ScreenProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesApi.conversations('lecturer').then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveConvId(data[0].id);
    }).finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    setLoadingMsgs(true);
    messagesApi.thread(activeConvId, 'lecturer').then(setMessages).finally(() => setLoadingMsgs(false));
  }, [activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const sendText = async () => {
    if (!text.trim() || !activeConvId || !user) return;
    setSending(true);
    try {
      const msg = await messagesApi.send(activeConvId, user.id, user.name, text.trim());
      setMessages(prev => [...prev, msg]);
      setText('');
    } finally {
      setSending(false);
    }
  };

  const sendMedia = async (file: File, type: 'image' | 'video') => {
    if (!activeConvId || !user) return;
    setSending(true);
    setShowAttachMenu(false);
    try {
      const msg = await messagesApi.sendMedia(activeConvId, user.id, user.name, file, type);
      setMessages(prev => [...prev, msg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Messages</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex h-[calc(100vh-220px)] min-h-[480px]">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Student Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>)
              : conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors ${activeConvId === conv.id ? 'bg-[#EEEDFB]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#EEEDFB] border border-[#C5C3EC] flex items-center justify-center text-[#312DC4] text-xs font-bold shrink-0">
                    {conv.participantInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 truncate">{conv.participantName}</p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-1 w-4 h-4 bg-[#312DC4] text-white text-xs rounded-full flex items-center justify-center shrink-0">{conv.unreadCount}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.participantSubtitle}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            }
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFB] border border-[#C5C3EC] flex items-center justify-center text-[#312DC4] text-xs font-bold shrink-0">
                  {activeConv.participantInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{activeConv.participantName}</p>
                  <p className="text-xs text-gray-400">{activeConv.projectInfo}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
                {loadingMsgs
                  ? <div className="space-y-3"><Skeleton className="h-12 w-3/5" /><Skeleton className="h-10 w-2/5 ml-auto" /></div>
                  : messages.map((msg) => <ChatBubble key={msg.id} msg={msg} isMine={msg.senderId === user?.id} />)
                }
                <div ref={bottomRef} />
              </div>

              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="p-2 text-gray-400 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    {showAttachMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-10">
                        <button onClick={() => imageRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <ImageIcon className="w-4 h-4 text-[#312DC4]" /> Image
                        </button>
                        <button onClick={() => videoRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Video className="w-4 h-4 text-[#312DC4]" /> Video
                        </button>
                      </div>
                    )}
                  </div>
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) sendMedia(e.target.files[0], 'image'); }} />
                  <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) sendMedia(e.target.files[0], 'video'); }} />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                    rows={1}
                    placeholder="Type a message…"
                    className="flex-1 resize-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] bg-gray-50"
                  />
                  <button
                    onClick={sendText}
                    disabled={!text.trim() || sending}
                    className="p-2 bg-[#312DC4] hover:bg-[#2724b0] text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              Select a student conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
