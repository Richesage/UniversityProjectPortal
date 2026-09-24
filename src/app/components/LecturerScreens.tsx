import React, { useState, useEffect, useRef } from 'react';
import {
  Users, FileText, Upload, BarChart2, MessageSquare,
  CheckCircle, Clock, AlertCircle, Search, X,
  ImageIcon, Video, Send, Paperclip, Plus,
  UserCheck, Award, BookOpen, PenLine, Save,
  Calendar, Link2, MapPin, Radio, Star,
  ExternalLink, Megaphone, Phone, ChevronDown,
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
        {(msg as any).type === 'meeting' && (
          <div className="space-y-1">
            <div className={`rounded-lg p-2.5 ${isMine ? 'bg-white/15' : 'bg-[#EEEDFB]'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className={`w-3.5 h-3.5 ${isMine ? 'text-white' : 'text-[#312DC4]'}`} />
                <span className={`text-xs font-semibold ${isMine ? 'text-white' : 'text-[#312DC4]'}`}>Meeting Scheduled</span>
              </div>
              <p className="text-xs leading-relaxed">{msg.content}</p>
            </div>
          </div>
        )}
        <p className={`text-xs mt-1 ${isMine ? 'text-white/60 text-right' : 'text-gray-400'}`}>{time}</p>
      </div>
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SUPERVISION_REQUESTS = [
  { id: 'sr1', studentName: 'Kofi Asante', regNo: 'CS/2023/078', program: 'BSc Computer Science', topicInterest: 'Machine Learning for Fraud Detection in Mobile Banking', message: 'I have taken your AI course and scored distinction. I am very interested in your research area and would be honored to work under your supervision for my final year project.', submittedAt: '2026-09-09T10:00:00Z', status: 'pending' },
  { id: 'sr2', studentName: 'Efua Boateng', regNo: 'CS/2023/032', program: 'BSc Computer Science', topicInterest: 'Natural Language Processing for Ghanaian Languages', message: 'My background in linguistics combined with computer science makes me a strong fit for NLP research. I have already reviewed three of your published papers on the subject.', submittedAt: '2026-09-08T14:00:00Z', status: 'pending' },
  { id: 'sr3', studentName: 'Yaw Darko', regNo: 'SE/2023/091', program: 'BSc Software Engineering', topicInterest: 'Smart Healthcare Mobile Application with AI Diagnostics', message: 'I have 2 years of React Native experience and am passionate about applying AI to solve healthcare challenges in Ghana.', submittedAt: '2026-09-07T09:30:00Z', status: 'pending' },
];

interface SupervisionRequest {
  id: string;
  studentName: string;
  regNo: string;
  program: string;
  topicInterest: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'admitted' | 'denied';
}

interface MeetingForm {
  platform: 'googlemeet' | 'zoom' | 'teams' | 'physical';
  date: string;
  time: string;
  topic: string;
  link: string;
  location: string;
  sendTo: 'all' | string;
}

const PLATFORM_LABELS: Record<string, string> = {
  googlemeet: 'Google Meet',
  zoom: 'Zoom',
  teams: 'Microsoft Teams',
  physical: 'Physical Meeting',
};

const PLATFORM_ICONS: Record<string, string> = {
  googlemeet: '🎥',
  zoom: '💻',
  teams: '🖥️',
  physical: '📍',
};

// ─── LecturerDashboard ────────────────────────────────────────────────────────
export function LecturerDashboard({ onNavigate }: ScreenProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assignedStudents: 0, activeProjects: 0, pendingReviews: 0, workloadPercent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lecturerApi.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Assigned Students', value: stats.assignedStudents, icon: Users,    color: 'text-[#312DC4]',   bg: 'bg-[#EEEDFB]' },
    { label: 'Active Projects',   value: stats.activeProjects,   icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Reviews',   value: stats.pendingReviews,   icon: Clock,    color: 'text-amber-600',   bg: 'bg-amber-50' },
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
        <p className="text-xs text-gray-400 mt-1">{stats.workloadPercent >= 90 ? 'Near capacity — review workload settings.' : 'Within acceptable range.'}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'My Profile',          screen: 'my-profile',       icon: UserCheck },
            { label: 'Student Requests',    screen: 'student-requests', icon: Users },
            { label: 'Upload Topic',        screen: 'topic-upload',     icon: Upload },
            { label: 'My Students',         screen: 'view-students',    icon: BookOpen },
            { label: 'Workload',            screen: 'workload',         icon: BarChart2 },
            { label: 'Messages',            screen: 'messages',         icon: MessageSquare },
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

// ─── LecturerProfile ─────────────────────────────────────────────────────────
export function LecturerProfile({ onNavigate: _onNavigate }: ScreenProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    title: 'Dr.',
    bio: 'I am a researcher and academic with over a decade of experience in my field. My work focuses on applying cutting-edge computational methods to solve real-world problems. I am passionate about mentoring the next generation of engineers and researchers.',
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'],
    awards: ['Best Research Paper Award — IEEE 2024', 'Faculty Excellence in Teaching 2023'],
    certifications: ['PhD Computer Science — MIT', 'Google Professional ML Engineer', 'Certified Data Scientist (DASCA)'],
    maxStudents: 8,
    openSlots: 3,
    requirePlagiarismCheck: true,
    plagiarismThreshold: 20,
    allowStudentsToSeeCapacity: true,
  });
  const [newSpec, setNewSpec] = useState('');
  const [newAward, setNewAward] = useState('');
  const [newCert, setNewCert] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addToList = (field: 'specializations' | 'awards' | 'certifications', value: string, clear: () => void) => {
    if (!value.trim()) return;
    setProfile(p => ({ ...p, [field]: [...p[field], value.trim()] }));
    clear();
  };

  const removeFromList = (field: 'specializations' | 'awards' | 'certifications', idx: number) => {
    setProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  const titles = ['Prof.', 'Assoc. Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-emerald-600 font-medium">✓ Profile saved</span>}
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
                <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7]">
              <PenLine className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#EEEDFB] border-2 border-[#C5C3EC] flex items-center justify-center text-2xl font-bold text-[#312DC4]">
              {(user?.name ?? 'L').split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#312DC4] text-white flex items-center justify-center hover:bg-[#2724b0] text-xs" title="Upload photo">
                +
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {editing ? (
                <select value={profile.title} onChange={(e) => setProfile(p => ({ ...p, title: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                  {titles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <span className="text-sm font-medium text-[#312DC4] bg-[#EEEDFB] px-2 py-0.5 rounded">{profile.title}</span>
              )}
              <h3 className="text-lg font-bold text-gray-800">{user?.name ?? 'Faculty Member'}</h3>
            </div>
            <p className="text-sm text-gray-500">{user?.email ?? 'lecturer@university.edu'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{(user as any)?.department ?? 'Computer Science'}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${profile.openSlots > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {profile.openSlots > 0 ? `${profile.openSlots} slot${profile.openSlots !== 1 ? 's' : ''} available` : 'No slots available'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Professional Bio</p>
          {editing ? (
            <textarea rows={4} value={profile.bio} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none" />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specializations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#312DC4]" />
            <h3 className="font-semibold text-gray-700">Areas of Specialization</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.specializations.map((s, i) => (
              <span key={i} className="flex items-center gap-1 text-sm font-medium text-[#312DC4] bg-[#EEEDFB] border border-[#C5C3EC] rounded-full px-3 py-1">
                {s}
                {editing && <button onClick={() => removeFromList('specializations', i)} className="ml-1 text-[#312DC4]/60 hover:text-red-500"><X className="w-3 h-3" /></button>}
              </span>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input type="text" value={newSpec} onChange={(e) => setNewSpec(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { addToList('specializations', newSpec, () => setNewSpec('')); } }}
                placeholder="Add specialization…"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
              <button onClick={() => addToList('specializations', newSpec, () => setNewSpec(''))}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Awards */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-gray-700">Awards & Recognition</h3>
          </div>
          <ul className="space-y-2 mb-3">
            {profile.awards.map((a, i) => (
              <li key={i} className="flex items-start justify-between gap-2 text-sm">
                <span className="flex items-start gap-2 text-gray-700"><Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> {a}</span>
                {editing && <button onClick={() => removeFromList('awards', i)} className="text-gray-300 hover:text-red-500 shrink-0"><X className="w-3.5 h-3.5" /></button>}
              </li>
            ))}
          </ul>
          {editing && (
            <div className="flex gap-2">
              <input type="text" value={newAward} onChange={(e) => setNewAward(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { addToList('awards', newAward, () => setNewAward('')); } }}
                placeholder="Add award…"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
              <button onClick={() => addToList('awards', newAward, () => setNewAward(''))}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-gray-700">Qualifications & Certifications</h3>
          </div>
          <ul className="space-y-2 mb-3">
            {profile.certifications.map((c, i) => (
              <li key={i} className="flex items-start justify-between gap-2 text-sm">
                <span className="flex items-start gap-2 text-gray-700"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {c}</span>
                {editing && <button onClick={() => removeFromList('certifications', i)} className="text-gray-300 hover:text-red-500 shrink-0"><X className="w-3.5 h-3.5" /></button>}
              </li>
            ))}
          </ul>
          {editing && (
            <div className="flex gap-2">
              <input type="text" value={newCert} onChange={(e) => setNewCert(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { addToList('certifications', newCert, () => setNewCert('')); } }}
                placeholder="Add qualification…"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
              <button onClick={() => addToList('certifications', newCert, () => setNewCert(''))}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Supervision settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-[#312DC4]" />
            <h3 className="font-semibold text-gray-700">Supervision Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum students I can supervise</label>
              {editing ? (
                <input type="number" min={1} max={30} value={profile.maxStudents}
                  onChange={(e) => setProfile(p => ({ ...p, maxStudents: Number(e.target.value) }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
              ) : (
                <p className="text-sm font-semibold text-gray-800">{profile.maxStudents} students</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Show capacity to students</p>
                <p className="text-xs text-gray-400">Students can see how many slots are available</p>
              </div>
              <button
                disabled={!editing}
                onClick={() => setProfile(p => ({ ...p, allowStudentsToSeeCapacity: !p.allowStudentsToSeeCapacity }))}
                className={`w-10 h-5.5 rounded-full relative transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'} ${profile.allowStudentsToSeeCapacity ? 'bg-[#312DC4]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${profile.allowStudentsToSeeCapacity ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Require plagiarism check on submissions</p>
                  <p className="text-xs text-gray-400">Students must pass check before submission is accepted</p>
                </div>
                <button
                  disabled={!editing}
                  onClick={() => setProfile(p => ({ ...p, requirePlagiarismCheck: !p.requirePlagiarismCheck }))}
                  className={`w-10 h-5.5 rounded-full relative transition-colors ${editing ? '' : 'opacity-60 cursor-not-allowed'} ${profile.requirePlagiarismCheck ? 'bg-[#312DC4]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${profile.requirePlagiarismCheck ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              {profile.requirePlagiarismCheck && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">Similarity threshold:</p>
                  {editing ? (
                    <input type="number" min={5} max={50} value={profile.plagiarismThreshold}
                      onChange={(e) => setProfile(p => ({ ...p, plagiarismThreshold: Number(e.target.value) }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-800">{profile.plagiarismThreshold}%</span>
                  )}
                  <p className="text-xs text-gray-400">max similarity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StudentSupervisionRequests ───────────────────────────────────────────────
export function StudentSupervisionRequests({ onNavigate: _onNavigate }: ScreenProps) {
  const [requests, setRequests] = useState<SupervisionRequest[]>(MOCK_SUPERVISION_REQUESTS as SupervisionRequest[]);
  const [viewingRequest, setViewingRequest] = useState<SupervisionRequest | null>(null);
  const [denyModal, setDenyModal] = useState<SupervisionRequest | null>(null);
  const [denyReason, setDenyReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const pending = requests.filter(r => r.status === 'pending');
  const admitted = requests.filter(r => r.status === 'admitted');
  const denied = requests.filter(r => r.status === 'denied');

  const handleAdmit = async (req: SupervisionRequest) => {
    setProcessing(req.id);
    await new Promise(r => setTimeout(r, 700));
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'admitted' } : r));
    setProcessing(null);
    setViewingRequest(null);
  };

  const handleDeny = async () => {
    if (!denyModal) return;
    setProcessing(denyModal.id);
    await new Promise(r => setTimeout(r, 700));
    setRequests(prev => prev.map(r => r.id === denyModal.id ? { ...r, status: 'denied' } : r));
    setProcessing(null);
    setDenyModal(null);
    setDenyReason('');
    setViewingRequest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Supervision Requests</h2>
        <div className="flex gap-2">
          <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">{pending.length} pending</span>
          {admitted.length > 0 && <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">{admitted.length} admitted</span>}
          {denied.length > 0 && <span className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">{denied.length} denied</span>}
        </div>
      </div>

      {pending.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No pending supervision requests.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
            <p className="text-sm font-medium text-amber-800">Pending Review ({pending.length})</p>
          </div>
          <div className="divide-y divide-gray-100">
            {pending.map((req) => (
              <div key={req.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EEEDFB] flex items-center justify-center text-sm font-bold text-[#312DC4] shrink-0">
                  {req.studentName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{req.studentName}</p>
                  <p className="text-xs text-gray-500">{req.regNo} · {req.program}</p>
                  <p className="text-xs text-gray-600 mt-1">Topic interest: <span className="font-medium text-gray-700">{req.topicInterest}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewingRequest(req)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAdmit(req)}
                    disabled={processing === req.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> {processing === req.id ? '…' : 'Admit'}
                  </button>
                  <button
                    onClick={() => { setDenyModal(req); setDenyReason(''); }}
                    disabled={processing === req.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(admitted.length > 0 || denied.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-600">Processed Requests</p>
          </div>
          <div className="divide-y divide-gray-100">
            {[...admitted, ...denied].map((req) => (
              <div key={req.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">{req.studentName} <span className="text-gray-400 text-xs font-normal">({req.regNo})</span></p>
                  <p className="text-xs text-gray-400 truncate">{req.topicInterest}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${req.status === 'admitted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {req.status === 'admitted' ? '✓ Admitted' : '✗ Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{viewingRequest.studentName}</h3>
                <p className="text-xs text-gray-500">{viewingRequest.regNo} · {viewingRequest.program}</p>
              </div>
              <button onClick={() => setViewingRequest(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Topic of Interest</p>
              <p className="text-sm font-medium text-gray-800">{viewingRequest.topicInterest}</p>
            </div>
            <div className="mb-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Student's Message</p>
              <p className="text-sm text-gray-700 leading-relaxed">{viewingRequest.message}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAdmit(viewingRequest)} disabled={processing === viewingRequest.id}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                <UserCheck className="w-4 h-4" /> Admit Student
              </button>
              <button onClick={() => { setDenyModal(viewingRequest); setDenyReason(''); setViewingRequest(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600">
                <X className="w-4 h-4" /> Deny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny modal */}
      {denyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Deny Request</h3>
              <button onClick={() => setDenyModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Denying supervision request from <span className="font-medium text-gray-800">{denyModal.studentName}</span>.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
              <textarea rows={3} value={denyReason} onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Provide a reason to help the student…"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDeny} disabled={processing === denyModal.id}
                className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                {processing === denyModal.id ? 'Denying…' : 'Confirm Denial'}
              </button>
              <button onClick={() => setDenyModal(null)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [editingCapacity, setEditingCapacity] = useState(false);
  const [maxStudents, setMaxStudents] = useState(15);
  const [tempMax, setTempMax] = useState(15);
  const [savingCapacity, setSavingCapacity] = useState(false);

  useEffect(() => {
    Promise.all([lecturerApi.students(), lecturerApi.stats()])
      .then(([s, st]) => { setStudents(s); setStats(st); })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveCapacity = async () => {
    setSavingCapacity(true);
    await new Promise(r => setTimeout(r, 700));
    setMaxStudents(tempMax);
    setSavingCapacity(false);
    setEditingCapacity(false);
  };

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
          <p className="text-xs text-gray-400 mt-2">{stats.assignedStudents} of {maxStudents} maximum student slots filled.</p>
          <div className="border-t border-gray-100 mt-4 pt-4">
            {editingCapacity ? (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 shrink-0">Max students:</label>
                <input type="number" min={1} max={50} value={tempMax}
                  onChange={(e) => setTempMax(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                <button onClick={handleSaveCapacity} disabled={savingCapacity}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
                  <Save className="w-3 h-3" /> {savingCapacity ? '…' : 'Save'}
                </button>
                <button onClick={() => { setEditingCapacity(false); setTempMax(maxStudents); }}
                  className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
              </div>
            ) : (
              <button onClick={() => { setEditingCapacity(true); setTempMax(maxStudents); }}
                className="flex items-center gap-1.5 text-xs text-[#312DC4] hover:underline">
                <PenLine className="w-3 h-3" /> Edit maximum capacity
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Summary</h3>
          <dl className="space-y-3">
            {[
              { label: 'Assigned Students', value: stats.assignedStudents },
              { label: 'Active Projects',   value: stats.activeProjects },
              { label: 'Pending Reviews',   value: stats.pendingReviews },
              { label: 'Available Slots',   value: Math.max(0, maxStudents - stats.assignedStudents) },
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
  const [viewMode, setViewMode] = useState<'individual' | 'broadcast'>('individual');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meeting, setMeeting] = useState<MeetingForm>({
    platform: 'googlemeet', date: '', time: '', topic: '', link: '', location: '', sendTo: 'all',
  });
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
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

  const sendBroadcast = async () => {
    if (!broadcastText.trim() || !user) return;
    setBroadcastSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setBroadcastSending(false);
    setBroadcastSuccess(true);
    setBroadcastText('');
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const scheduleMeeting = async () => {
    if (!meeting.date || !meeting.time || !meeting.topic || !user) return;
    setSchedulingMeeting(true);
    await new Promise(r => setTimeout(r, 900));

    const platformLabel = PLATFORM_LABELS[meeting.platform];
    const dateStr = new Date(`${meeting.date}T${meeting.time}`).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const content = `${PLATFORM_ICONS[meeting.platform]} ${platformLabel} — ${meeting.topic}\n📅 ${dateStr}${meeting.link ? `\n🔗 ${meeting.link}` : ''}${meeting.location ? `\n📍 ${meeting.location}` : ''}`;

    if (activeConvId && user && meeting.sendTo !== 'all') {
      const msg: Message = {
        id: `meet-${Date.now()}`, conversationId: activeConvId,
        senderId: user.id, senderName: user.name,
        type: 'text' as any, content, sentAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, msg]);
    }

    setSchedulingMeeting(false);
    setShowMeetingModal(false);
    setMeeting({ platform: 'googlemeet', date: '', time: '', topic: '', link: '', location: '', sendTo: 'all' });
  };

  const platformUrls: Record<string, string> = {
    googlemeet: 'https://meet.google.com/new',
    zoom: 'https://zoom.us/start/videomeeting',
    teams: 'https://teams.microsoft.com',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Messages</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          {/* Mode tabs */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setViewMode('individual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${viewMode === 'individual' ? 'text-[#312DC4] border-b-2 border-[#312DC4] bg-[#EEEDFB]/30' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Individual
            </button>
            <button
              onClick={() => setViewMode('broadcast')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${viewMode === 'broadcast' ? 'text-[#312DC4] border-b-2 border-[#312DC4] bg-[#EEEDFB]/30' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Megaphone className="w-3.5 h-3.5" /> Broadcast
            </button>
          </div>

          {viewMode === 'individual' ? (
            <>
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700">Student Conversations</p>
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
            </>
          ) : (
            <div className="flex-1 flex flex-col p-4">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Broadcast to Students</p>
                <p className="text-xs text-gray-400">Send an announcement to all your supervised students at once.</p>
              </div>
              <div className="bg-[#EEEDFB] border border-[#C5C3EC] rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-[#312DC4]">Recipients</p>
                {loadingConvs
                  ? <Skeleton className="h-4 w-full mt-1" />
                  : conversations.map(c => (
                    <p key={c.id} className="text-xs text-gray-600 mt-1">• {c.participantName}</p>
                  ))
                }
              </div>
              {broadcastSuccess && (
                <div className="mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Broadcast sent to all students.
                </div>
              )}
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                rows={5}
                placeholder="Write your announcement…"
                className="flex-1 resize-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] bg-gray-50"
              />
              <button
                onClick={sendBroadcast}
                disabled={!broadcastText.trim() || broadcastSending}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
              >
                <Megaphone className="w-4 h-4" /> {broadcastSending ? 'Sending…' : 'Send to All Students'}
              </button>
            </div>
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'broadcast' ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center px-8">
              <Megaphone className="w-10 h-10 text-[#312DC4]/20" />
              <p className="text-sm text-gray-400">Compose your broadcast message in the panel on the left. It will be delivered to all your supervised students simultaneously.</p>
            </div>
          ) : activeConv ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFB] border border-[#C5C3EC] flex items-center justify-center text-[#312DC4] text-xs font-bold shrink-0">
                  {activeConv.participantInitials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{activeConv.participantName}</p>
                  <p className="text-xs text-gray-400">{activeConv.projectInfo}</p>
                </div>
                <button
                  onClick={() => setShowMeetingModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7] transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Meeting
                </button>
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

      {/* Meeting scheduler modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800">Schedule a Meeting</h3>
              <button onClick={() => setShowMeetingModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              {/* Platform */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Meeting Platform</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['googlemeet', 'zoom', 'teams', 'physical'] as const).map((p) => (
                    <label key={p} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${meeting.platform === p ? 'border-[#312DC4] bg-[#EEEDFB] text-[#312DC4]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      <input type="radio" name="platform" value={p} checked={meeting.platform === p} onChange={() => setMeeting(m => ({ ...m, platform: p }))} className="hidden" />
                      <span className="text-base">{PLATFORM_ICONS[p]}</span>
                      <span className="font-medium">{PLATFORM_LABELS[p]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={meeting.date} onChange={(e) => setMeeting(m => ({ ...m, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={meeting.time} onChange={(e) => setMeeting(m => ({ ...m, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agenda / Topic</label>
                <input type="text" value={meeting.topic} onChange={(e) => setMeeting(m => ({ ...m, topic: e.target.value }))}
                  placeholder="e.g. Chapter 3 review and feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
              </div>

              {meeting.platform !== 'physical' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                  <div className="flex gap-2">
                    <input type="url" value={meeting.link} onChange={(e) => setMeeting(m => ({ ...m, link: e.target.value }))}
                      placeholder={`Paste your ${PLATFORM_LABELS[meeting.platform]} link…`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                    <a href={platformUrls[meeting.platform]} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7] whitespace-nowrap">
                      <ExternalLink className="w-3.5 h-3.5" /> Create link
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={meeting.location} onChange={(e) => setMeeting(m => ({ ...m, location: e.target.value }))}
                    placeholder="e.g. Room 204, Engineering Block B"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                <select value={meeting.sendTo} onChange={(e) => setMeeting(m => ({ ...m, sendTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                  <option value="all">All my students (broadcast)</option>
                  {conversations.map(c => <option key={c.id} value={c.id}>{c.participantName}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={scheduleMeeting}
                disabled={schedulingMeeting || !meeting.date || !meeting.time || !meeting.topic}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" /> {schedulingMeeting ? 'Scheduling…' : 'Send Meeting Invite'}
              </button>
              <button onClick={() => setShowMeetingModal(false)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
