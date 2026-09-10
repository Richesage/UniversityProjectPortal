import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, BarChart2, MessageSquare, Upload, CheckCircle,
  Clock, AlertCircle, Send, Paperclip, ImageIcon, Video,
  X, ChevronRight, Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectApi, topicsApi, submissionsApi, messagesApi } from '../../lib/api';
import type { Project, Topic, Submission, Conversation, Message, TopicFilters } from '../../types';

interface ScreenProps { onNavigate: (screen: string) => void; }

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────
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

// ─── StudentDashboard ─────────────────────────────────────────────────────────
export function StudentDashboard({ onNavigate }: ScreenProps) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.current().then(setProject).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name?.split(' ')[0] ?? 'Student'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Here is an overview of your project progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Overall Progress', value: loading ? '—' : `${project?.overallProgress ?? 0}%`, icon: BarChart2, color: 'text-[#312DC4]', bg: 'bg-[#EEEDFB]' },
          { label: 'Submissions',      value: '2', icon: FileText,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Messages',         value: '2', icon: MessageSquare, color: 'text-amber-600',  bg: 'bg-amber-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Current Project</h3>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : project ? (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800">{project.topicTitle}</p>
              <p className="text-sm text-gray-500">Supervisor: {project.supervisorName}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-[#312DC4]">{project.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#312DC4] h-2 rounded-full transition-all duration-500" style={{ width: `${project.overallProgress}%` }} />
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> {project.supervisorApprovalStatus}
            </span>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No active project yet.</p>
            <button onClick={() => onNavigate('topic-selection')} className="mt-3 text-sm text-[#312DC4] hover:underline">
              Browse available topics
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Submit Chapter',   screen: 'submission',      icon: Upload },
            { label: 'View Progress',    screen: 'progress',        icon: BarChart2 },
            { label: 'Browse Topics',    screen: 'topic-selection', icon: Star },
            { label: 'Messages',         screen: 'messages',        icon: MessageSquare },
          ].map((a) => (
            <button
              key={a.screen}
              onClick={() => onNavigate(a.screen)}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#C5C3EC] hover:bg-[#EEEDFB] transition-colors text-left"
            >
              <a.icon className="w-4 h-4 text-[#312DC4]" />
              <span className="text-sm font-medium text-gray-700">{a.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ProjectTopicSelection ────────────────────────────────────────────────────
export function ProjectTopicSelection({ onNavigate: _onNavigate }: ScreenProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TopicFilters>({ search: '', department: '', researchArea: '' });
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selecting, setSelecting] = useState(false);

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchTopics = useCallback(() => {
    setLoading(true);
    topicsApi.list(filters).then(setTopics).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const handleSelect = async (topic: Topic) => {
    setSelecting(true);
    try {
      await topicsApi.select(topic.id);
      setSelectedTopic(topic);
    } finally {
      setSelecting(false);
    }
  };

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProposal(true);
    try {
      await topicsApi.propose({ title: proposalTitle, description: proposalDesc, file: proposalFile });
      setProposalSuccess(true);
      setProposalTitle(''); setProposalDesc(''); setProposalFile(null);
    } finally {
      setSubmittingProposal(false);
    }
  };

  const departments = [...new Set(topics.map(t => t.department))];
  const researchAreas = [...new Set(topics.map(t => t.researchArea))];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Project Topics</h2>

      {selectedTopic && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-800">Topic selected successfully!</p>
            <p className="text-sm text-emerald-700 mt-0.5">"{selectedTopic.title}" has been registered.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search topics or lecturers…"
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
          />
          <select
            value={filters.department}
            onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filters.researchArea}
            onChange={(e) => setFilters(f => ({ ...f, researchArea: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none"
          >
            <option value="">All Research Areas</option>
            {researchAreas.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Topic Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Lecturer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Area of Specialization</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Slots</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td></tr>
                ))
                : topics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <p className="truncate">{topic.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{topic.department}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{topic.lecturerName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block text-xs font-medium text-[#312DC4] bg-[#EEEDFB] border border-[#C5C3EC] rounded-full px-2 py-0.5">
                        {topic.specialization}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{topic.enrolledStudents}/{topic.maxStudents}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        topic.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {topic.status === 'available' ? 'Available' : 'Full'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={topic.status !== 'available' || selecting}
                        onClick={() => handleSelect(topic)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-40"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Propose own topic */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Propose Your Own Topic</h3>

        {proposalSuccess && (
          <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> Proposal submitted! Your supervisor will review it shortly.
          </div>
        )}

        <form onSubmit={handlePropose} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Title</label>
            <input
              type="text"
              required
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Enter your proposed topic title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
            <textarea
              required
              value={proposalDesc}
              onChange={(e) => setProposalDesc(e.target.value)}
              rows={3}
              placeholder="Describe your project idea…"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Proposal (optional)</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setProposalFile(e.target.files?.[0] ?? null)} />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                <Upload className="w-4 h-4" /> Choose File
              </button>
              {proposalFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{proposalFile.name}</span>
                  <button type="button" onClick={() => setProposalFile(null)}><X className="w-3 h-3 text-gray-400 hover:text-red-500" /></button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={submittingProposal}
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60"
          >
            {submittingProposal ? 'Submitting…' : 'Submit Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SubmissionAndFeedback ────────────────────────────────────────────────────
export function SubmissionAndFeedback({ onNavigate: _onNavigate }: ScreenProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [chapterLabel, setChapterLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    submissionsApi.list().then(setSubmissions).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      const newSub = await submissionsApi.upload(file, chapterLabel);
      setSubmissions(prev => [newSub, ...prev]);
      setFile(null);
      setChapterLabel('');
      setUploadSuccess(true);
    } finally {
      setUploading(false);
    }
  };

  const statusConfig: Record<Submission['status'], { label: string; cls: string; icon: React.ElementType }> = {
    pending_review: { label: 'Pending Review', cls: 'bg-amber-50 text-amber-700',      icon: Clock },
    reviewed:       { label: 'Reviewed',        cls: 'bg-blue-50 text-blue-700',        icon: CheckCircle },
    approved:       { label: 'Approved',         cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
    rejected:       { label: 'Rejected',         cls: 'bg-red-50 text-red-700',         icon: AlertCircle },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Submissions & Feedback</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Upload New Submission</h3>

        {uploadSuccess && (
          <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> File uploaded successfully and sent for review.
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter / Document Label</label>
            <input
              type="text"
              required
              value={chapterLabel}
              onChange={(e) => setChapterLabel(e.target.value)}
              placeholder="e.g. Chapter 3: Methodology"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#C5C3EC] hover:bg-[#EEEDFB]/30 transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  <FileText className="w-5 h-5 text-[#312DC4]" />
                  <span>{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to browse, or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (max 20 MB)</p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Submit for Review'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Submission History</h3>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const cfg = statusConfig[sub.status];
              const Icon = cfg.icon;
              return (
                <div key={sub.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#312DC4] shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{sub.chapterLabel}</p>
                        <p className="text-xs text-gray-400">{sub.fileName} · {sub.fileSize} · {new Date(sub.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.cls}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  {sub.feedback && (
                    <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-md p-3 border-l-2 border-[#312DC4]">
                      <p className="text-xs font-medium text-gray-500 mb-1">Supervisor Feedback</p>
                      {sub.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ProgressTracking ─────────────────────────────────────────────────────────
export function ProgressTracking({ onNavigate: _onNavigate }: ScreenProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.current().then(setProject).finally(() => setLoading(false));
  }, []);

  const milestoneConfig = {
    completed:   { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    in_progress: { cls: 'bg-[#EEEDFB] text-[#312DC4] border-[#C5C3EC]',      dot: 'bg-[#312DC4]' },
    pending:     { cls: 'bg-gray-50 text-gray-500 border-gray-200',           dot: 'bg-gray-300' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Progress Tracking</h2>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-full" />
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : !project ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
          No active project found.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Overall Progress</h3>
              <span className="text-2xl font-bold text-[#312DC4]">{project.overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-[#312DC4] h-3 rounded-full transition-all duration-700" style={{ width: `${project.overallProgress}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">{project.topicTitle}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Milestones</h3>
            <div className="space-y-3">
              {project.milestones.map((m) => {
                const cfg = milestoneConfig[m.status];
                return (
                  <div key={m.id} className={`flex items-center gap-4 border rounded-lg px-4 py-3 ${cfg.cls}`}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.label}</p>
                      {m.dueDate && <p className="text-xs opacity-70">Due {new Date(m.dueDate).toLocaleDateString()}</p>}
                    </div>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="opacity-70">Progress</span>
                        <span className="font-medium">{m.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${cfg.dot}`} style={{ width: `${m.percentage}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium capitalize opacity-80 shrink-0">
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── StudentMessaging ─────────────────────────────────────────────────────────
export function StudentMessaging({ onNavigate: _onNavigate }: ScreenProps) {
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
    messagesApi.conversations('student').then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveConvId(data[0].id);
    }).finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    setLoadingMsgs(true);
    messagesApi.thread(activeConvId, 'student').then(setMessages).finally(() => setLoadingMsgs(false));
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
        {/* Conversation list */}
        <div className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs
              ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>)
              : conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors ${activeConvId === conv.id ? 'bg-[#EEEDFB]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#312DC4] flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                <div className="w-8 h-8 rounded-full bg-[#312DC4] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {activeConv.participantInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{activeConv.participantName}</p>
                  <p className="text-xs text-gray-400">{activeConv.participantSubtitle}</p>
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
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
