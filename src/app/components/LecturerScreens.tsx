import React, { useState } from 'react';
import { ChevronRight, Users, BookOpen, Clock, FileText, Upload, Calendar, CheckSquare, Search, Edit, Image, Video, Send, Paperclip, Phone, MoreVertical, X } from 'lucide-react';

interface ScreenProps {
  onNavigate: (screen: string) => void;
}

export function LecturerDashboard({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Home</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Lecturer Dashboard</span>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lecturer Dashboard</h1>
          <p className="text-gray-500">Overview of your supervision tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Assigned Students</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">12</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Active Projects</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">10</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CheckSquare className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Pending Reviews</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">4</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Workload</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">80%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Student Submissions</h2>
            <button onClick={() => onNavigate('view-students')} className="text-sm text-[#312DC4] hover:underline">View All Students</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EEEDFB] rounded-full flex items-center justify-center text-xs font-medium text-[#312DC4]">ST{item}</div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Student Name {item}</p>
                    <p className="text-xs text-gray-500">Chapter {item} Uploaded</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => onNavigate('topic-upload')} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload Project Topics
              </button>
              <button onClick={() => onNavigate('view-students')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> View Assigned Students
              </button>
              <button onClick={() => onNavigate('messages')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Message Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectTopicUpload({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Upload Topic</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Upload Project Topic</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
          <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter topic title" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={5} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter detailed description" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>Computer Science</option>
              <option>Software Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>Artificial Intelligence</option>
              <option>Web Development</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Students</label>
          <input type="number" className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none" defaultValue={1} min={1} />
        </div>

        <div className="pt-4 flex gap-3 border-t border-gray-200">
          <button onClick={() => { alert('Uploaded successfully!'); onNavigate('dashboard'); }} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
            Upload Topic
          </button>
          <button onClick={() => { alert('Draft Saved!'); onNavigate('dashboard'); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ViewAssignedStudents({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Assigned Students</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Students</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search students..." className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Student</th>
              <th className="px-4 py-3 font-medium text-gray-700">Reg No</th>
              <th className="px-4 py-3 font-medium text-gray-700">Current Topic</th>
              <th className="px-4 py-3 font-medium text-gray-700">Progress</th>
              <th className="px-4 py-3 font-medium text-gray-700">Submission Status</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4].map((item) => (
              <tr key={item} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">Jane Doe {item}</td>
                <td className="px-4 py-4 text-gray-600">REG202300{item}</td>
                <td className="px-4 py-4 text-gray-700 truncate max-w-[150px]">Design of Allocation System</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#312DC4] rounded-full" style={{ width: `${item * 20}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{item * 20}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item % 2 === 0
                      ? 'bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC]'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {item % 2 === 0 ? 'Pending Review' : 'Up to date'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="View Details">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="Give Feedback">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="Schedule Meeting">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SupervisorWorkloadTracking({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Workload Tracking</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Supervisor Workload</h1>
        <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          Back
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Assigned</p>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-gray-800">2</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Pending Reviews</p>
          <p className="text-2xl font-bold text-gray-800">4</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Available Capacity</p>
          <p className="text-2xl font-bold text-gray-800">3</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-80 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Workload Distribution Chart (Placeholder)</h2>
        <div className="flex-1 bg-[#EEEDFB]/30 border border-dashed border-[#C5C3EC] rounded flex flex-col items-center justify-center text-gray-400">
          <BarChartIcon className="w-12 h-12 mb-2 text-[#312DC4]/30" />
          <p className="text-sm">Chart rendering area</p>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

// ─── Chat data ────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  sender: 'me' | 'other';
  type: 'text' | 'image' | 'video';
  content: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  initials: string;
  regNo: string;
  lastMessage: string;
  time: string;
  unread: number;
  thread: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: 'Jane Doe 1', initials: 'JD', regNo: 'REG2023001',
    lastMessage: 'Thank you! I will revise and resend.', time: '9:35 AM', unread: 0,
    thread: [
      { id: 1, sender: 'other', type: 'text', content: 'Good morning Dr. Yusuf, I have uploaded Chapter 1 for your review.', time: '8:50 AM' },
      { id: 2, sender: 'me', type: 'text', content: 'Received! I will go through it today and send feedback shortly.', time: '9:10 AM' },
      { id: 3, sender: 'me', type: 'image', content: 'Chapter 1 Annotated Feedback', time: '9:15 AM' },
      { id: 4, sender: 'other', type: 'text', content: 'Thank you! I will revise and resend.', time: '9:35 AM' },
    ],
  },
  {
    id: 2, name: 'Jane Doe 2', initials: 'JD', regNo: 'REG2023002',
    lastMessage: 'Is this the correct format for Chapter 2?', time: 'Yesterday', unread: 2,
    thread: [
      { id: 1, sender: 'other', type: 'text', content: 'Dr. Yusuf, is this the correct format for Chapter 2?', time: 'Yesterday 4:00 PM' },
      { id: 2, sender: 'other', type: 'image', content: 'Chapter 2 Draft Format', time: 'Yesterday 4:01 PM' },
    ],
  },
  {
    id: 3, name: 'Jane Doe 3', initials: 'JD', regNo: 'REG2023003',
    lastMessage: 'Please watch the methodology video I sent.', time: 'Mon', unread: 0,
    thread: [
      { id: 1, sender: 'me', type: 'text', content: 'Hi Jane, please watch the methodology video I am sharing below.', time: 'Mon 10:00 AM' },
      { id: 2, sender: 'me', type: 'video', content: 'Research Methodology Guide', time: 'Mon 10:01 AM' },
      { id: 3, sender: 'other', type: 'text', content: 'Thank you, I will watch it!', time: 'Mon 11:20 AM' },
    ],
  },
];

// ─── Reusable ChatBubble ──────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  const isMe = msg.sender === 'me';

  if (msg.type === 'image') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[260px] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-xl overflow-hidden border ${isMe ? 'border-[#C5C3EC]' : 'border-gray-200'}`}>
            <div className="w-60 h-36 bg-gray-100 flex flex-col items-center justify-center gap-2">
              <Image className="w-8 h-8 text-gray-300" />
              <span className="text-xs text-gray-400">{msg.content}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 px-1">{msg.time}</span>
        </div>
      </div>
    );
  }

  if (msg.type === 'video') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[260px] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
          <div className="rounded-xl overflow-hidden border border-gray-300">
            <div className="w-60 h-36 bg-gray-800 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
              </div>
              <span className="text-xs text-white/70">{msg.content}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 px-1">{msg.time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe
            ? 'bg-[#312DC4] text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-xs text-gray-400 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

// ─── Lecturer Messaging Screen ────────────────────────────────────────────────

export function LecturerMessaging({ onNavigate }: ScreenProps) {
  const [activeId, setActiveId] = useState<number>(1);
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const active = CONVERSATIONS.find((c) => c.id === activeId)!;

  return (
    <div className="max-w-5xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4 shrink-0">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Messages</span>
      </div>

      <div className="flex flex-1 min-h-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

        {/* ── Conversation list ── */}
        <aside className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Student Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search students..." className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#312DC4]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { setActiveId(conv.id); setInputText(''); setShowAttachMenu(false); }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  activeId === conv.id ? 'bg-[#EEEDFB]' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activeId === conv.id ? 'bg-[#312DC4]' : 'bg-gray-200'
                }`}>
                  <span className={`text-xs font-bold ${activeId === conv.id ? 'text-white' : 'text-gray-600'}`}>{conv.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className={`text-sm font-medium ${activeId === conv.id ? 'text-[#312DC4]' : 'text-gray-900'}`}>{conv.name}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400">{conv.regNo}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="shrink-0 mt-1 w-5 h-5 bg-[#312DC4] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Chat thread ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#312DC4] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{active.initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{active.name}</p>
                <p className="text-xs text-gray-400">{active.regNo} · Design of Allocation System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Voice call">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="More options">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 shrink-0">Today</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {active.thread.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </div>

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
            {showAttachMenu && (
              <div className="flex gap-3 mb-3 px-1">
                <button
                  onClick={() => setShowAttachMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#EEEDFB] text-[#312DC4] rounded-lg text-xs font-medium hover:bg-[#E3E2F7] border border-[#C5C3EC]"
                >
                  <Image className="w-4 h-4" /> Share Image
                </button>
                <button
                  onClick={() => setShowAttachMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#EEEDFB] text-[#312DC4] rounded-lg text-xs font-medium hover:bg-[#E3E2F7] border border-[#C5C3EC]"
                >
                  <Video className="w-4 h-4" /> Share Video
                </button>
                <button onClick={() => setShowAttachMenu(false)} className="ml-auto p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-full transition-colors ${showAttachMenu ? 'bg-[#EEEDFB] text-[#312DC4]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${active.name}...`}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:bg-white border border-transparent focus:border-[#312DC4]"
              />

              <button
                className={`p-2.5 rounded-full transition-colors ${inputText.trim() ? 'bg-[#312DC4] text-white hover:bg-[#2724b0]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={!inputText.trim()}
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
