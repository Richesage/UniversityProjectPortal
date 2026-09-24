import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, UserCheck, Download, Search,
  AlertTriangle, FileText, CheckCircle, Info, Bell,
  ChevronRight, BarChart2, X, Eye, ThumbsUp, ThumbsDown,
  GitBranch, Shield,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminStats, AppNotification, StudentRecord, SupervisorRecord, ReportFilters, ReportRow } from '../../types';

interface ScreenProps { onNavigate: (screen: string) => void; }

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PENDING_TOPICS = [
  { id: 'pt1', title: 'Deep Learning for Medical Image Classification', description: 'Develop a CNN-based system for automated classification of medical images including X-rays and MRI scans with high diagnostic accuracy and explainability.', lecturerName: 'Dr. Sarah Johnson', department: 'Computer Science', researchArea: 'Artificial Intelligence', submittedAt: '2026-09-08T10:00:00Z' },
  { id: 'pt2', title: 'Blockchain-Based Academic Credential Verification', description: 'Design and implement a decentralised system for verifying academic credentials using smart contracts and blockchain, eliminating forgery.', lecturerName: 'Dr. Michael Chen', department: 'Software Engineering', researchArea: 'Blockchain', submittedAt: '2026-09-07T14:30:00Z' },
  { id: 'pt3', title: 'IoT Smart Campus Energy Management System', description: 'Create an IoT-based energy monitoring and management system for campus buildings using sensor networks and predictive analytics.', lecturerName: 'Prof. Amina Osei', department: 'Electrical Engineering', researchArea: 'Internet of Things', submittedAt: '2026-09-06T09:15:00Z' },
  { id: 'pt4', title: 'Federated Learning for Privacy-Preserving Health Data', description: 'Implement federated learning architecture to train ML models on distributed hospital data without sharing raw patient records.', lecturerName: 'Dr. Kwesi Ampah', department: 'Computer Science', researchArea: 'Data Science', submittedAt: '2026-09-05T11:45:00Z' },
];

const MOCK_DENIED_REQUESTS = [
  { id: 'dr1', studentName: 'Kwame Mensah', regNo: 'CS/2023/001', program: 'BSc Computer Science', requestedSupervisorName: 'Dr. Sarah Johnson', requestedSupervisorId: 'lec1', topicInterest: 'Machine Learning for Fraud Detection', deniedReason: 'Supervisor at full capacity', deniedAt: '2026-09-05T11:00:00Z' },
  { id: 'dr2', studentName: 'Amara Diallo', regNo: 'SE/2023/045', program: 'BSc Software Engineering', requestedSupervisorName: 'Prof. Amina Osei', requestedSupervisorId: 'lec3', topicInterest: 'Smart Grid Optimisation using AI', deniedReason: 'Research area mismatch', deniedAt: '2026-09-04T15:30:00Z' },
  { id: 'dr3', studentName: 'Esi Owusu', regNo: 'IT/2023/012', program: 'BSc Information Technology', requestedSupervisorName: 'Dr. Michael Chen', requestedSupervisorId: 'lec2', topicInterest: 'Cybersecurity Threat Detection', deniedReason: 'Supervisor on research leave', deniedAt: '2026-09-03T08:20:00Z' },
];

interface PendingTopic { id: string; title: string; description: string; lecturerName: string; department: string; researchArea: string; submittedAt: string; }
interface DeniedRequest { id: string; studentName: string; regNo: string; program: string; requestedSupervisorName: string; requestedSupervisorId: string; topicInterest: string; deniedReason: string; deniedAt: string; }

// ─── AdminDashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({ onNavigate }: ScreenProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.notifications()])
      .then(([s, n]) => { setStats(s); setNotifications(n); })
      .finally(() => setLoading(false));
  }, []);

  const notifIcon: Record<string, React.ElementType> = {
    warning: AlertTriangle,
    info:    Info,
    success: CheckCircle,
    error:   AlertTriangle,
  };
  const notifCls: Record<string, string> = {
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error:   'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students',       value: stats?.totalStudents,        icon: Users,        color: 'text-[#312DC4]',   bg: 'bg-[#EEEDFB]' },
          { label: 'Total Lecturers',      value: stats?.totalLecturers,       icon: BookOpen,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Approved Topics',      value: stats?.approvedTopics,       icon: CheckCircle,  color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Pending Topics',       value: stats?.pendingTopics,        icon: FileText,     color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Allocated %',          value: stats ? `${stats.allocatedPercentage}%` : undefined, icon: UserCheck, color: 'text-[#312DC4]', bg: 'bg-[#EEEDFB]' },
          { label: 'Unallocated Students', value: stats?.unallocatedStudents,  icon: AlertTriangle, color: 'text-red-600',   bg: 'bg-red-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-3">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{loading ? '—' : card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#312DC4]" />
            <h3 className="font-semibold text-gray-700">System Alerts</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No alerts.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const Icon = notifIcon[n.type] ?? Info;
                return (
                  <div key={n.id} className={`flex items-start gap-3 border rounded-lg px-3 py-3 ${notifCls[n.type] ?? 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Review Topic Proposals',  screen: 'topic-approval',        icon: FileText },
              { label: 'Allocate Supervisors',    screen: 'supervisor-allocation', icon: UserCheck },
              { label: 'Generate Reports',        screen: 'report-generation',     icon: BarChart2 },
            ].map((a) => (
              <button
                key={a.screen}
                onClick={() => onNavigate(a.screen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#C5C3EC] hover:bg-[#EEEDFB] transition-colors text-left"
              >
                <a.icon className="w-4 h-4 text-[#312DC4]" />
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TopicApproval ────────────────────────────────────────────────────────────
export function TopicApproval({ onNavigate: _onNavigate }: ScreenProps) {
  const [topics, setTopics] = useState<PendingTopic[]>(MOCK_PENDING_TOPICS);
  const [processed, setProcessed] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [viewingTopic, setViewingTopic] = useState<PendingTopic | null>(null);
  const [rejectModal, setRejectModal] = useState<PendingTopic | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const pending = topics.filter(t => !processed[t.id]);
  const done = topics.filter(t => !!processed[t.id]);

  const handleApprove = async (topic: PendingTopic) => {
    setProcessing(topic.id);
    await new Promise(r => setTimeout(r, 800));
    setProcessed(p => ({ ...p, [topic.id]: 'approved' }));
    setProcessing(null);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(rejectModal.id);
    await new Promise(r => setTimeout(r, 800));
    setProcessed(p => ({ ...p, [rejectModal.id]: 'rejected' }));
    setProcessing(null);
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Topic Approval</h2>
        <div className="flex gap-2">
          <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">{pending.length} pending</span>
          {done.length > 0 && <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{done.length} reviewed</span>}
        </div>
      </div>

      {pending.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">All topics have been reviewed.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
            <p className="text-sm font-medium text-amber-800">Pending Review ({pending.length})</p>
          </div>
          <div className="divide-y divide-gray-100">
            {pending.map((topic) => (
              <div key={topic.id} className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{topic.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{topic.lecturerName} · {topic.department} · {topic.researchArea}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(topic.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{topic.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewingTopic(topic)}
                    className="p-2 text-gray-400 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApprove(topic)}
                    disabled={processing === topic.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {processing === topic.id ? '…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => { setRejectModal(topic); setRejectReason(''); }}
                    disabled={processing === topic.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-600">Recently Reviewed</p>
          </div>
          <div className="divide-y divide-gray-100">
            {done.map((topic) => (
              <div key={topic.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{topic.title}</p>
                  <p className="text-xs text-gray-400">{topic.lecturerName} · {topic.department}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  processed[topic.id] === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {processed[topic.id] === 'approved' ? '✓ Approved' : '✗ Rejected'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic detail modal */}
      {viewingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-800 pr-4">{viewingTopic.title}</h3>
              <button onClick={() => setViewingTopic(null)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <dl className="space-y-3 text-sm mb-4">
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-gray-500">Lecturer</dt><dd className="text-gray-800 font-medium">{viewingTopic.lecturerName}</dd></div>
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-gray-500">Department</dt><dd className="text-gray-800">{viewingTopic.department}</dd></div>
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-gray-500">Research Area</dt><dd className="text-gray-800">{viewingTopic.researchArea}</dd></div>
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-gray-500">Submitted</dt><dd className="text-gray-800">{new Date(viewingTopic.submittedAt).toLocaleString()}</dd></div>
            </dl>
            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{viewingTopic.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { handleApprove(viewingTopic); setViewingTopic(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <ThumbsUp className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => { setRejectModal(viewingTopic); setViewingTopic(null); setRejectReason(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600"
              >
                <ThumbsDown className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Reject Topic</h3>
              <button onClick={() => setRejectModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">You are rejecting: <span className="font-medium text-gray-800">"{rejectModal.title}"</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for rejection</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide feedback to the lecturer…"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processing === rejectModal.id}
                className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
              >
                {processing === rejectModal.id ? 'Rejecting…' : 'Confirm Rejection'}
              </button>
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SupervisorAllocation ─────────────────────────────────────────────────────
export function SupervisorAllocation({ onNavigate: _onNavigate }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'allocate' | 'denied'>('allocate');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [supSearch, setSupSearch] = useState('');
  const [selected, setSelected] = useState<{ studentId: string; supervisorId: string | null }>({ studentId: '', supervisorId: null });
  const [allocating, setAllocating] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState<string | null>(null);

  // Denied requests state
  const [deniedRequests, setDeniedRequests] = useState<DeniedRequest[]>(MOCK_DENIED_REQUESTS);
  const [resolveModal, setResolveModal] = useState<DeniedRequest | null>(null);
  const [resolutionType, setResolutionType] = useState<'special-approval' | 'recommend-alternative'>('special-approval');
  const [alternativeSupervisorId, setAlternativeSupervisorId] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([adminApi.unallocatedStudents(), adminApi.supervisors()])
      .then(([s, sup]) => { setStudents(s); setSupervisors(sup); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    adminApi.supervisors(supSearch.trim() || undefined).then(setSupervisors);
  }, [supSearch]);

  const handleAllocate = async () => {
    if (!selected.studentId || !selected.supervisorId) return;
    setAllocating(true);
    try {
      await adminApi.allocate(selected.studentId, selected.supervisorId);
      const studentName = students.find(s => s.id === selected.studentId)?.name ?? 'Student';
      const supName = supervisors.find(s => s.id === selected.supervisorId)?.name ?? 'Supervisor';
      setStudents(prev => prev.filter(s => s.id !== selected.studentId));
      setSelected({ studentId: '', supervisorId: null });
      setAllocSuccess(`${studentName} has been allocated to ${supName}.`);
    } finally {
      setAllocating(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveModal) return;
    setResolving(true);
    await new Promise(r => setTimeout(r, 900));
    setResolvedIds(prev => [...prev, resolveModal.id]);
    setResolving(false);
    setResolveModal(null);
    setResolutionNote('');
    setAlternativeSupervisorId('');
  };

  const pendingDenied = deniedRequests.filter(r => !resolvedIds.includes(r.id));
  const resolvedDenied = deniedRequests.filter(r => resolvedIds.includes(r.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Supervisor Management</h2>
        {pendingDenied.length > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" /> {pendingDenied.length} denied request{pendingDenied.length !== 1 ? 's' : ''} need resolution
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'allocate', label: 'Allocate Supervisors' },
          { id: 'denied',   label: `Denied Request Resolution ${pendingDenied.length > 0 ? `(${pendingDenied.length})` : ''}` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'allocate' | 'denied')}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-[#312DC4] text-[#312DC4]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'allocate' && (
        <>
          {allocSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> {allocSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unallocated students */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Unallocated Students ({students.length})</h3>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">All students are allocated!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelected(prev => ({ ...prev, studentId: s.id }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                        selected.studentId === s.id
                          ? 'border-[#312DC4] bg-[#EEEDFB]'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                        {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400 truncate">{s.regNo} · {s.currentTopic}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Supervisors */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Available Supervisors</h3>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search supervisors…"
                  value={supSearch}
                  onChange={(e) => setSupSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
                />
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : (
                <div className="space-y-2">
                  {supervisors.map((sup) => (
                    <button
                      key={sup.id}
                      disabled={sup.availability === 'full'}
                      onClick={() => setSelected(prev => ({ ...prev, supervisorId: sup.id }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                        selected.supervisorId === sup.id
                          ? 'border-[#312DC4] bg-[#EEEDFB]'
                          : sup.availability === 'full'
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EEEDFB] flex items-center justify-center text-xs font-bold text-[#312DC4] shrink-0">
                        {sup.name.split(' ').filter(w => w !== 'Dr.' && w !== 'Prof.').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{sup.name}</p>
                        <p className="text-xs text-gray-400 truncate">{sup.specialization}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-gray-600">{sup.currentLoad}/{sup.maxLoad}</p>
                        <span className={`text-xs font-medium ${sup.availability === 'available' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {sup.availability === 'available' ? 'Available' : 'Full'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAllocate}
              disabled={!selected.studentId || !selected.supervisorId || allocating}
              className="px-6 py-2.5 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
            >
              {allocating ? 'Allocating…' : 'Confirm Allocation'}
            </button>
          </div>
        </>
      )}

      {activeTab === 'denied' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">These students had their preferred supervisor request denied. You can grant a <strong>special approval</strong> to override the denial, or <strong>recommend an alternative</strong> supervisor.</p>
          </div>

          {pendingDenied.length === 0 && resolvedDenied.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
              <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No denied requests to resolve.</p>
            </div>
          )}

          {pendingDenied.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
                <p className="text-sm font-medium text-red-800">Awaiting Resolution ({pendingDenied.length})</p>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingDenied.map((req) => (
                  <div key={req.id} className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {req.studentName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{req.studentName}</p>
                      <p className="text-xs text-gray-500">{req.regNo} · {req.program}</p>
                      <p className="text-xs text-gray-600 mt-1">Requested: <span className="font-medium">{req.requestedSupervisorName}</span></p>
                      <p className="text-xs text-gray-500">Topic interest: {req.topicInterest}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                        <X className="w-3 h-3" /> Denied: {req.deniedReason}
                      </div>
                    </div>
                    <button
                      onClick={() => { setResolveModal(req); setResolutionType('special-approval'); setResolutionNote(''); setAlternativeSupervisorId(''); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] shrink-0"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolvedDenied.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
              </div>
              <div className="divide-y divide-gray-100">
                {resolvedDenied.map((req) => (
                  <div key={req.id} className="px-5 py-4 flex items-center justify-between gap-4 opacity-70">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{req.studentName} <span className="text-gray-400 font-normal">({req.regNo})</span></p>
                      <p className="text-xs text-gray-400">Was denied: {req.requestedSupervisorName}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">✓ Resolved</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resolution modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Resolve Denied Request</h3>
              <button onClick={() => setResolveModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm">
              <p className="font-medium text-gray-800">{resolveModal.studentName} <span className="text-gray-500 font-normal">({resolveModal.regNo})</span></p>
              <p className="text-gray-500 text-xs mt-0.5">Requested supervisor: <span className="text-gray-700 font-medium">{resolveModal.requestedSupervisorName}</span></p>
              <p className="text-gray-500 text-xs mt-0.5">Denial reason: <span className="text-red-600">{resolveModal.deniedReason}</span></p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Resolution type</p>
              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${resolutionType === 'special-approval' ? 'border-[#312DC4] bg-[#EEEDFB]' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="resType" value="special-approval" checked={resolutionType === 'special-approval'} onChange={() => setResolutionType('special-approval')} className="mt-0.5 accent-[#312DC4]" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Special Approval</p>
                    <p className="text-xs text-gray-500">Override the denial and assign the student to their preferred supervisor ({resolveModal.requestedSupervisorName}), even if at capacity.</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${resolutionType === 'recommend-alternative' ? 'border-[#312DC4] bg-[#EEEDFB]' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="resType" value="recommend-alternative" checked={resolutionType === 'recommend-alternative'} onChange={() => setResolutionType('recommend-alternative')} className="mt-0.5 accent-[#312DC4]" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Recommend Alternative</p>
                    <p className="text-xs text-gray-500">Assign the student to a different available supervisor and notify the student with a recommendation note.</p>
                  </div>
                </label>
              </div>
            </div>

            {resolutionType === 'recommend-alternative' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Alternative Supervisor</label>
                <select
                  value={alternativeSupervisorId}
                  onChange={(e) => setAlternativeSupervisorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none"
                >
                  <option value="">Choose a supervisor…</option>
                  {supervisors.filter(s => s.availability === 'available' && s.id !== resolveModal.requestedSupervisorId).map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.specialization} ({s.currentLoad}/{s.maxLoad})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin note to student</label>
              <textarea
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Explain the resolution to the student…"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResolve}
                disabled={resolving || !resolutionNote.trim() || (resolutionType === 'recommend-alternative' && !alternativeSupervisorId)}
                className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
              >
                {resolving ? 'Processing…' : 'Confirm Resolution'}
              </button>
              <button onClick={() => setResolveModal(null)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ReportGeneration ─────────────────────────────────────────────────────────
export function ReportGeneration({ onNavigate: _onNavigate }: ScreenProps) {
  const [filters, setFilters] = useState<ReportFilters>({ department: '', supervisorId: '', status: '', dateFrom: '', dateTo: '' });
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [generated, setGenerated] = useState(false);

  const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering'];
  const STATUSES = ['In Progress', 'Completed', 'Suspended'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const data = await adminApi.generateReport(filters);
      setRows(data);
      setGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      const { url } = await adminApi.exportReport(filters, format);
      if (url && url !== '#') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        a.click();
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Report Generation</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Filter Report</h3>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={filters.department} onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
              <select value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={generating}
              className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
              {generating ? 'Generating…' : 'Generate Report'}
            </button>
            {generated && (
              <>
                <button type="button" onClick={() => handleExport('pdf')} disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7] disabled:opacity-60">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button type="button" onClick={() => handleExport('excel')} disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
                  <Download className="w-4 h-4" /> Excel
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {generated && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Results ({rows.length} records)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Student', 'Reg. No.', 'Department', 'Topic', 'Supervisor', 'Progress', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.studentName}</td>
                    <td className="px-4 py-3 text-gray-500">{row.regNo}</td>
                    <td className="px-4 py-3 text-gray-600">{row.department}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs"><p className="truncate">{row.topic}</p></td>
                    <td className="px-4 py-3 text-gray-600">{row.supervisor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#312DC4] h-1.5 rounded-full" style={{ width: `${row.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
