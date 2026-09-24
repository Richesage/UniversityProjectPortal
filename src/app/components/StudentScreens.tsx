import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, BarChart2, MessageSquare, Upload, CheckCircle,
  Clock, AlertCircle, Send, Paperclip, ImageIcon, Video,
  X, ChevronRight, Star, Search, UserCheck, Award,
  BookOpen, Shield, AlertTriangle, ExternalLink, Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectApi, topicsApi, submissionsApi, messagesApi } from '../../lib/api';
import type { Project, Topic, Submission, Conversation, Message, TopicFilters } from '../../types';

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

// ─── Mock supervisor data ─────────────────────────────────────────────────────
interface SupervisorProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  specializations: string[];
  bio: string;
  openSlots: number;
  maxStudents: number;
  awards: string[];
  certifications: string[];
  rating: number;
}

const MOCK_SUPERVISORS: SupervisorProfile[] = [
  {
    id: 'lec1', name: 'Sarah Johnson', title: 'Dr.', department: 'Computer Science',
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'],
    bio: 'A leading researcher in AI and machine learning with over 15 years of experience. Published 40+ papers in top-tier venues and has led multiple national research projects on intelligent systems.',
    openSlots: 2, maxStudents: 8,
    awards: ['Best Research Paper — IEEE 2024', 'Faculty Excellence Award 2023'],
    certifications: ['PhD Computer Science — MIT', 'Google Professional ML Engineer'],
    rating: 4.8,
  },
  {
    id: 'lec2', name: 'Michael Chen', title: 'Dr.', department: 'Software Engineering',
    specializations: ['Blockchain', 'Distributed Systems', 'Cybersecurity'],
    bio: 'Specialises in blockchain technology and distributed systems security. Has extensive industry experience at leading tech firms before transitioning to academia.',
    openSlots: 3, maxStudents: 6,
    awards: ['Faculty Excellence Award 2023'],
    certifications: ['PhD Information Security — Stanford', 'Certified Ethical Hacker (CEH)'],
    rating: 4.6,
  },
  {
    id: 'lec3', name: 'Amina Osei', title: 'Prof.', department: 'Electrical Engineering',
    specializations: ['Internet of Things', 'Embedded Systems', 'Smart Grid'],
    bio: 'Professor with research focus on IoT and smart infrastructure. Leads the Smart Systems Lab and has secured $2M+ in research funding from international bodies.',
    openSlots: 1, maxStudents: 10,
    awards: ['African Innovator of the Year 2022', 'STEM Champion Award 2024'],
    certifications: ['PhD Electrical Engineering — Cambridge'],
    rating: 4.9,
  },
  {
    id: 'lec4', name: 'Kwesi Ampah', title: 'Dr.', department: 'Computer Science',
    specializations: ['Data Science', 'Big Data Analytics', 'Database Systems'],
    bio: 'Focuses on scalable data analytics solutions for real-world industry problems. Collaborates with major banks and telecoms on data-driven research initiatives.',
    openSlots: 4, maxStudents: 8,
    awards: ['Teaching Excellence Award 2025'],
    certifications: ['PhD Data Science — UCL', 'AWS Certified Data Analytics'],
    rating: 4.4,
  },
  {
    id: 'lec5', name: 'Abena Frimpong', title: 'Dr.', department: 'Information Technology',
    specializations: ['Mobile Computing', 'Web Development', 'Human-Computer Interaction'],
    bio: 'Passionate about building user-centred digital systems that create social impact. Her work bridges technology and community development across West Africa.',
    openSlots: 0, maxStudents: 5,
    awards: ['HCI Research Award 2024'],
    certifications: ['PhD HCI — University of Edinburgh'],
    rating: 4.7,
  },
];

// ─── Mock plagiarism check ─────────────────────────────────────────────────────
async function checkPlagiarism(fileName: string): Promise<{ score: number; verdict: 'clear' | 'warning' | 'flagged'; sources: string[] }> {
  await new Promise(r => setTimeout(r, 2800));
  const seed = Array.from(fileName).reduce((a, c) => a + c.charCodeAt(0), 0);
  const score = ((seed * 7 + 13) % 35);
  return {
    score,
    verdict: score < 15 ? 'clear' : score < 25 ? 'warning' : 'flagged',
    sources: score > 8 ? [
      'doi.org/10.1016/j.techreport.2024.01.023',
      'scholar.google.com/citations?q=related-research-2023',
    ] : [],
  };
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
          { label: 'Overall Progress', value: loading ? '—' : `${project?.overallProgress ?? 0}%`, icon: BarChart2,     color: 'text-[#312DC4]',   bg: 'bg-[#EEEDFB]' },
          { label: 'Submissions',      value: '2',                                                   icon: FileText,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Messages',         value: '2',                                                   icon: MessageSquare, color: 'text-amber-600',  bg: 'bg-amber-50' },
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
            <button onClick={() => onNavigate('find-supervisor')} className="mt-3 text-sm text-[#312DC4] hover:underline">
              Find a supervisor to get started
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Find a Supervisor', screen: 'find-supervisor',  icon: Search },
            { label: 'Browse Topics',     screen: 'topic-selection',  icon: Star },
            { label: 'Submit Chapter',    screen: 'submission',       icon: Upload },
            { label: 'View Progress',     screen: 'progress',         icon: BarChart2 },
            { label: 'Messages',          screen: 'messages',         icon: MessageSquare },
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

// ─── FindSupervisor ───────────────────────────────────────────────────────────
export function FindSupervisor({ onNavigate: _onNavigate }: ScreenProps) {
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [selectedSup, setSelectedSup] = useState<SupervisorProfile | null>(null);
  const [requestModal, setRequestModal] = useState<SupervisorProfile | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestTopic, setRequestTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const allAreas = [...new Set(MOCK_SUPERVISORS.flatMap(s => s.specializations))].sort();
  const allDepts = [...new Set(MOCK_SUPERVISORS.map(s => s.department))].sort();

  const filtered = MOCK_SUPERVISORS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.specializations.some(sp => sp.toLowerCase().includes(q)) || s.department.toLowerCase().includes(q);
    const matchArea = !filterArea || s.specializations.includes(filterArea);
    const matchDept = !filterDept || s.department === filterDept;
    return matchSearch && matchArea && matchDept;
  });

  const handleSendRequest = async () => {
    if (!requestModal || !requestTopic.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSentRequests(prev => [...prev, requestModal.id]);
    setSubmitting(false);
    setRequestModal(null);
    setRequestNote('');
    setRequestTopic('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Find a Supervisor</h2>
        <p className="text-sm text-gray-500 mt-0.5">Browse available supervisors and send a supervision request.</p>
      </div>

      {sentRequests.length > 0 && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-800">Request{sentRequests.length !== 1 ? 's' : ''} sent!</p>
            <p className="text-sm text-emerald-700 mt-0.5">Your supervisor request has been submitted. You will be notified once the lecturer reviews it.</p>
          </div>
        </div>
      )}

      {/* Search & filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialization…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
            />
          </div>
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
            <option value="">All Specializations</option>
            {allAreas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
            <option value="">All Departments</option>
            {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Supervisor grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No supervisors match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((sup) => {
            const requested = sentRequests.includes(sup.id);
            return (
              <div key={sup.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#EEEDFB] border border-[#C5C3EC] flex items-center justify-center text-sm font-bold text-[#312DC4] shrink-0">
                    {sup.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-[#312DC4] font-medium bg-[#EEEDFB] px-1.5 py-0.5 rounded">{sup.title}</span>
                      <p className="text-sm font-semibold text-gray-800">{sup.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">{sup.department}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {renderStars(sup.rating)}
                      <span className="text-xs text-gray-500 ml-0.5">{sup.rating}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${sup.openSlots > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                    {sup.openSlots > 0 ? `${sup.openSlots} slot${sup.openSlots !== 1 ? 's' : ''}` : 'Full'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{sup.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sup.specializations.map((s) => (
                    <span key={s} className="text-xs font-medium text-[#312DC4] bg-[#EEEDFB] border border-[#C5C3EC] rounded-full px-2 py-0.5">{s}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSup(sup)}
                    className="flex-1 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                  {requested ? (
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <CheckCircle className="w-4 h-4" /> Requested
                    </div>
                  ) : (
                    <button
                      disabled={sup.openSlots === 0}
                      onClick={() => { setRequestModal(sup); setRequestNote(''); setRequestTopic(''); }}
                      className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Request Supervision
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full profile modal */}
      {selectedSup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-xl overflow-y-auto max-h-full p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#EEEDFB] border border-[#C5C3EC] flex items-center justify-center text-lg font-bold text-[#312DC4] shrink-0">
                  {selectedSup.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#312DC4] font-medium bg-[#EEEDFB] px-1.5 py-0.5 rounded">{selectedSup.title}</span>
                    <h3 className="text-lg font-bold text-gray-800">{selectedSup.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{selectedSup.department}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {renderStars(selectedSup.rating)}
                    <span className="text-xs text-gray-500 ml-0.5">{selectedSup.rating} / 5</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSup(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Professional Bio</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedSup.bio}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Areas of Specialization</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSup.specializations.map(s => (
                    <span key={s} className="text-sm font-medium text-[#312DC4] bg-[#EEEDFB] border border-[#C5C3EC] rounded-full px-3 py-1">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Awards & Recognition</p>
                <ul className="space-y-1.5">
                  {selectedSup.awards.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-0.5" /> {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Qualifications</p>
                <ul className="space-y-1.5">
                  {selectedSup.certifications.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Supervision capacity: <span className="font-semibold text-gray-800">{selectedSup.openSlots} of {selectedSup.maxStudents} slots available</span></p>
                </div>
                {sentRequests.includes(selectedSup.id) ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                    <CheckCircle className="w-4 h-4" /> Requested
                  </span>
                ) : (
                  <button
                    disabled={selectedSup.openSlots === 0}
                    onClick={() => { setRequestModal(selectedSup); setSelectedSup(null); setRequestNote(''); setRequestTopic(''); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UserCheck className="w-4 h-4" /> Request Supervision
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request modal */}
      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Request Supervision</h3>
              <button onClick={() => setRequestModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You are requesting supervision from <span className="font-medium text-gray-800">{requestModal.title} {requestModal.name}</span>.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your topic of interest <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  placeholder="Briefly describe your project idea…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to supervisor <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  rows={4}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Introduce yourself and explain why you are interested in working with this supervisor…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSendRequest}
                disabled={submitting || !requestTopic.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" /> {submitting ? 'Sending…' : 'Send Request'}
              </button>
              <button onClick={() => setRequestModal(null)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Specialization</th>
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
            <input type="text" required value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Enter your proposed topic title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
            <textarea required value={proposalDesc} onChange={(e) => setProposalDesc(e.target.value)}
              rows={3} placeholder="Describe your project idea…"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] resize-none" />
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
          <button type="submit" disabled={submittingProposal}
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
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

  // Plagiarism check state — in a real system, the threshold would come from the lecturer's settings API
  const plagiarismRequired = true;
  const plagiarismThreshold = 20;
  const [plagCheck, setPlagCheck] = useState<{
    status: 'idle' | 'checking' | 'done';
    score?: number;
    verdict?: 'clear' | 'warning' | 'flagged';
    sources?: string[];
  }>({ status: 'idle' });

  useEffect(() => {
    submissionsApi.list().then(setSubmissions).finally(() => setLoading(false));
  }, []);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setPlagCheck({ status: 'idle' });
  };

  const handleRunPlagiarismCheck = async () => {
    if (!file) return;
    setPlagCheck({ status: 'checking' });
    const result = await checkPlagiarism(file.name);
    setPlagCheck({ status: 'done', ...result });
  };

  const canSubmit = !plagiarismRequired
    || (plagCheck.status === 'done' && (plagCheck.verdict === 'clear' || (plagCheck.verdict === 'warning' && plagCheck.score! < plagiarismThreshold)));

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !canSubmit) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      const newSub = await submissionsApi.upload(file, chapterLabel);
      setSubmissions(prev => [newSub, ...prev]);
      setFile(null);
      setChapterLabel('');
      setPlagCheck({ status: 'idle' });
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

  const plagVerdictConfig = {
    clear:   { label: 'Clear', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, bar: 'bg-emerald-500' },
    warning: { label: 'Similarity Detected', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle, bar: 'bg-amber-500' },
    flagged: { label: 'High Similarity — Blocked', cls: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle, bar: 'bg-red-500' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Submissions & Feedback</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Upload New Submission</h3>

        {plagiarismRequired && (
          <div className="mb-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Plagiarism check required</p>
              <p className="text-xs text-blue-600 mt-0.5">Your supervisor requires all submissions to pass a plagiarism check (max {plagiarismThreshold}% similarity) before they are accepted.</p>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> File uploaded successfully and sent for review.
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter / Document Label</label>
            <input type="text" required value={chapterLabel} onChange={(e) => setChapterLabel(e.target.value)}
              placeholder="e.g. Chapter 3: Methodology"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#C5C3EC] hover:bg-[#EEEDFB]/30 transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  <FileText className="w-5 h-5 text-[#312DC4]" />
                  <span>{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleFileChange(null); }}>
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

          {/* Plagiarism check section */}
          {plagiarismRequired && file && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#312DC4]" />
                  <p className="text-sm font-medium text-gray-700">Plagiarism Check</p>
                </div>
                {plagCheck.status !== 'done' && (
                  <button
                    type="button"
                    onClick={handleRunPlagiarismCheck}
                    disabled={plagCheck.status === 'checking'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60"
                  >
                    {plagCheck.status === 'checking' ? (
                      <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Checking…</>
                    ) : 'Run Check'}
                  </button>
                )}
              </div>

              {plagCheck.status === 'checking' && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-[#312DC4] rounded-full animate-pulse w-2/3" />
                  </div>
                  <p className="text-xs text-gray-500">Analysing document against known sources…</p>
                </div>
              )}

              {plagCheck.status === 'done' && plagCheck.verdict && (
                <div className="space-y-2">
                  <div className={`flex items-start gap-3 border rounded-lg px-3 py-2.5 ${plagVerdictConfig[plagCheck.verdict].cls}`}>
                    {React.createElement(plagVerdictConfig[plagCheck.verdict].icon, { className: 'w-4 h-4 shrink-0 mt-0.5' })}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{plagVerdictConfig[plagCheck.verdict].label}</p>
                      <p className="text-xs opacity-80 mt-0.5">Similarity score: {plagCheck.score}% (threshold: {plagiarismThreshold}%)</p>
                    </div>
                    <span className="text-lg font-bold tabular-nums">{plagCheck.score}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${plagVerdictConfig[plagCheck.verdict].bar}`}
                        style={{ width: `${Math.min(plagCheck.score!, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{plagiarismThreshold}%</span>
                    <div className="w-0.5 h-3 bg-gray-300 rounded" />
                  </div>
                  {plagCheck.sources && plagCheck.sources.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Matched sources:</p>
                      <ul className="space-y-1">
                        {plagCheck.sources.map((s, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <ExternalLink className="w-3 h-3 text-gray-400" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plagCheck.verdict === 'flagged' && (
                    <p className="text-xs text-red-600 font-medium">This document cannot be submitted. Please revise it to reduce similarity below {plagiarismThreshold}%.</p>
                  )}
                  {plagCheck.verdict !== 'flagged' && (
                    <button type="button" onClick={handleRunPlagiarismCheck}
                      className="text-xs text-[#312DC4] hover:underline">Re-check with updated file</button>
                  )}
                </div>
              )}

              {plagCheck.status === 'idle' && (
                <p className="text-xs text-gray-400">Run the plagiarism check before submitting. Submissions with high similarity will be rejected.</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading || (plagiarismRequired && !canSubmit)}
            className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : plagiarismRequired && plagCheck.status !== 'done' ? 'Run Plagiarism Check First' : 'Submit for Review'}
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
