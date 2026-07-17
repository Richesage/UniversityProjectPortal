import React from 'react';
import { ChevronRight, FileText, Upload, Calendar, Clock, CheckCircle, Search, Filter, Play } from 'lucide-react';

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
                <p className="font-medium text-gray-900">Dr. Placeholder Name</p>
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

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Review Meeting with Supervisor</p>
                <p className="text-xs text-gray-500">Oct 24, 2023 - 10:00 AM</p>
              </div>
            </div>
            <button onClick={() => onNavigate('meeting')} className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md">
              Schedule Meeting
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
                    <button className="text-gray-500 hover:text-gray-700 p-1">
                      <Upload className="w-4 h-4 rotate-180" />
                    </button>
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

export function MeetingSchedule({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Meeting Schedule</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        <button className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
          Request Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar View (Placeholder)</h2>
          <div className="aspect-video bg-[#EEEDFB]/30 border border-[#C5C3EC] rounded-md flex flex-col items-center justify-center">
            <Calendar className="w-12 h-12 text-[#312DC4]/30 mb-2" />
            <span className="text-gray-400 text-sm">Calendar Component Placeholder</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-[#C5C3EC] rounded-md bg-[#EEEDFB]/30">
                <h3 className="font-medium text-sm text-gray-900 mb-2">Project Review Setup</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-600 gap-2">
                    <Clock className="w-4 h-4 text-[#312DC4]" /> 10:00 AM - 10:30 AM
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-2">
                    <Calendar className="w-4 h-4 text-[#312DC4]" /> Oct 24, 2023
                  </div>
                  <div className="flex items-center text-xs text-gray-600 gap-2">
                    <Play className="w-4 h-4 text-[#312DC4]" /> Online (Teams)
                  </div>
                </div>
                <button className="w-full py-2 bg-[#312DC4] text-white rounded-md text-xs font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
                  <Play className="w-3 h-3 fill-current" /> Join Meeting
                </button>
              </div>
            </div>

            <button onClick={() => onNavigate('dashboard')} className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
