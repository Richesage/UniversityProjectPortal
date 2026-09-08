import React, { useState } from 'react';
import { ChevronRight, FileText, Upload, CheckCircle, Search, Filter, Image, Video, Send, Paperclip, Phone, MoreVertical, X } from 'lucide-react';

interface ScreenProps {
  onNavigate: (screen: string) => void;
}

export function StudentDashboard({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Home</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Student Dashboard</span>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Student</h1>
          <p className="text-gray-500">Overview of your final year project.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Project</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Topic</p>
                <p className="font-medium text-gray-900">Design of a Web-Based Project Allocation System</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned Supervisor</p>
                <p className="font-medium text-gray-900">Dr. Amina Yusuf</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Submission Status</h2>
              <button onClick={() => onNavigate('submission')} className="text-sm text-[#312DC4] hover:underline">View All</button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Chapter 2: Literature Review</p>
                  <p className="text-xs text-gray-500">Submitted 2 days ago</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs rounded-full border border-[#C5C3EC]">Pending Review</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Progress</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center bg-[#EEEDFB] rounded-full border-4 border-[#312DC4]">
                <span className="text-2xl font-bold text-[#312DC4]">45%</span>
              </div>
            </div>
            <button onClick={() => onNavigate('progress')} className="w-full mt-6 py-2 bg-[#EEEDFB] hover:bg-[#E3E2F7] text-[#312DC4] text-sm font-medium rounded-md">
              View Detailed Progress
            </button>
          </div>

          {/* Recent Messages card replaces Upcoming Meetings */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h2>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-[#EEEDFB] rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-[#312DC4]">AY</span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">Dr. Amina Yusuf</p>
                <p className="text-xs text-gray-500 truncate">Please review the attached feedback on Ch. 2...</p>
                <p className="text-xs text-gray-400 mt-0.5">10 min ago</p>
              </div>
            </div>
            <button onClick={() => onNavigate('messages')} className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md">
              Open Messages
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => onNavigate('topic-selection')} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
            Browse Project Topics
          </button>
          <button onClick={() => onNavigate('submission')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
            Submit Chapter
          </button>
          <button onClick={() => onNavigate('messages')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
            Message Supervisor
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectTopicSelection({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Project Topics</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Project Topic Selection</h1>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search topics..." className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
            <option>All Departments</option>
          </select>
          <select className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
            <option>All Research Areas</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Title & Description</th>
              <th className="px-4 py-3 font-medium text-gray-700">Lecturer</th>
              <th className="px-4 py-3 font-medium text-gray-700">Area of Specialization</th>
              <th className="px-4 py-3 font-medium text-gray-700">Slots</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { id: 1, title: 'Topic Title Placeholder 1', lecturer: 'Dr. Amina Yusuf', specialization: 'Machine Learning & AI', slots: '2 / 5' },
              { id: 2, title: 'Topic Title Placeholder 2', lecturer: 'Dr. Chukwu Eze', specialization: 'Cybersecurity & Networks', slots: '3 / 5' },
              { id: 3, title: 'Topic Title Placeholder 3', lecturer: 'Dr. Fatima Bello', specialization: 'Software Engineering', slots: '1 / 5' },
            ].map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-gray-500 mt-1 line-clamp-2">Brief description of the project topic placeholder text to simulate content layout.</p>
                </td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{item.lecturer}</td>
                <td className="px-4 py-4">
                  <span className="inline-block px-2 py-1 text-xs bg-[#EEEDFB] text-[#312DC4] rounded-full border border-[#C5C3EC] whitespace-nowrap">{item.specialization}</span>
                </td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{item.slots}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => { alert('Topic Selected!'); onNavigate('dashboard'); }} className="px-3 py-1.5 bg-[#312DC4] text-white rounded-md text-sm hover:bg-[#2724b0]">
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Propose Your Own Topic</h2>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
            <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter your proposed topic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Explain your proposal..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proposal (PDF)</label>
            <div className="border-2 border-dashed border-[#C5C3EC] rounded-md p-6 flex flex-col items-center justify-center bg-[#EEEDFB]/30">
              <Upload className="w-6 h-6 text-[#312DC4] mb-2" />
              <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { alert('Proposal Submitted!'); onNavigate('dashboard'); }} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
              Submit Proposal
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubmissionAndFeedback({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Submissions & Feedback</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Submissions</h1>
        <button onClick={() => onNavigate('progress')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          View Progress Tracking
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit New Document</h2>
            <div className="border-2 border-dashed border-[#C5C3EC] rounded-md p-8 flex flex-col items-center justify-center bg-[#EEEDFB]/30">
              <Upload className="w-8 h-8 text-[#312DC4] mb-3" />
              <p className="text-sm font-medium text-gray-700">Upload Chapter or File</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
              <button className="mt-4 px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]" onClick={() => { alert('Uploaded!'); onNavigate('dashboard'); }}>
                Browse Files
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Submission History</h2>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Chapter {item}: Documentation.pdf</p>
                      <p className="text-xs text-gray-500">Submitted on Oct {10 + item}, 2023</p>
                      <p className="text-xs text-gray-600 mt-2 font-medium">Feedback: "Good start, please revise section 2.1."</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs rounded-full border border-[#C5C3EC]">Reviewed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h2>
            <div className="relative border-l border-[#C5C3EC] ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1 w-3 h-3 bg-[#312DC4] rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Proposal Approved</p>
                <p className="text-xs text-gray-500">Sep 15, 2023</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1 w-3 h-3 bg-[#312DC4] rounded-full"></div>
                <p className="text-sm font-medium text-gray-900">Chapter 1 Uploaded</p>
                <p className="text-xs text-gray-500">Oct 02, 2023</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                <p className="text-sm font-medium text-gray-500">Chapter 2 Due</p>
                <p className="text-xs text-gray-400">Nov 01, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgressTracking({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Progress Tracking</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project Progress</h1>
        <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 w-full text-left">Overall Completion</h2>
          <div className="relative w-40 h-40 flex items-center justify-center bg-[#EEEDFB] rounded-full border-8 border-[#312DC4]">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[#312DC4]">50%</span>
              <span className="text-xs text-gray-500 mt-1">Completed</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">Supervisor Approval: <span className="font-medium text-[#312DC4]">On Track</span></p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Milestones</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-[#C5C3EC] rounded-md bg-[#EEEDFB]/40">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#312DC4]" />
                <span className="text-sm font-medium text-gray-800">Proposal Approved</span>
              </div>
              <span className="text-xs text-[#312DC4] font-medium">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#C5C3EC] rounded-md bg-[#EEEDFB]/40">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#312DC4]" />
                <span className="text-sm font-medium text-gray-800">Chapter 1</span>
              </div>
              <span className="text-xs text-[#312DC4] font-medium">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#312DC4] rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#312DC4] rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Chapter 2</span>
              </div>
              <span className="text-xs text-gray-500">In Progress</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Chapter 3</span>
              </div>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Final Submission</span>
              </div>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared chat message types ────────────────────────────────────────────────

interface Message {
  id: number;
  sender: 'me' | 'other';
  type: 'text' | 'image' | 'video';
  content: string;
  time: string;
}

const STUDENT_THREAD: Message[] = [
  { id: 1, sender: 'other', type: 'text', content: 'Hello! I have reviewed your Chapter 1 draft. Overall it is good but there are a few areas to improve.', time: '9:10 AM' },
  { id: 2, sender: 'other', type: 'image', content: 'Annotated feedback on Chapter 1', time: '9:11 AM' },
  { id: 3, sender: 'me', type: 'text', content: 'Thank you Dr. Yusuf! I will review your annotations and revise accordingly. Should I send the updated version here?', time: '9:25 AM' },
  { id: 4, sender: 'other', type: 'text', content: 'Yes, please upload it here when you are done. Also watch this short clip on research methodology — it should help with Chapter 2.', time: '9:27 AM' },
  { id: 5, sender: 'other', type: 'video', content: 'Research Methodology Overview', time: '9:28 AM' },
  { id: 6, sender: 'me', type: 'text', content: 'Great, I will watch it tonight. Thank you!', time: '9:35 AM' },
];

// ─── Reusable ChatBubble ──────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  const isMe = msg.sender === 'me';

  if (msg.type === 'image') {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[260px] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
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
        <div className={`max-w-[260px] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
          <div className={`rounded-xl overflow-hidden border ${isMe ? 'border-[#C5C3EC]' : 'border-gray-200'}`}>
            <div className="w-60 h-36 bg-gray-800 flex flex-col items-center justify-center gap-2 relative">
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

// ─── Student Messaging Screen ─────────────────────────────────────────────────

export function StudentMessaging({ onNavigate }: ScreenProps) {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  return (
    <div className="max-w-5xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4 shrink-0">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Messages</span>
      </div>

      <div className="flex flex-1 min-h-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

        {/* ── Conversation sidebar ── */}
        <aside className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#312DC4]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {/* Active conversation */}
            <div className="flex items-start gap-3 px-4 py-3 bg-[#EEEDFB] cursor-pointer">
              <div className="w-10 h-10 bg-[#312DC4] rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">AY</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold text-[#312DC4]">Dr. Amina Yusuf</p>
                  <span className="text-xs text-gray-400">9:28 AM</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Watch this clip on research methodology...</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Chat thread ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#312DC4] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">AY</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Dr. Amina Yusuf</p>
                <p className="text-xs text-gray-400">Supervisor · Machine Learning & AI</p>
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
            {/* Date separator */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 shrink-0">Today</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {STUDENT_THREAD.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </div>

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
            {/* Attach menu */}
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
                placeholder="Type a message..."
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
