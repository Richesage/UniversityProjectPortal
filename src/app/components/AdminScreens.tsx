import React from 'react';
import { ChevronRight, Users, BookOpen, UserCheck, Download, Search, AlertTriangle, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminDashboard({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Home</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Admin Dashboard</span>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">System overview and management.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Total Students</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">145</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <UserCheck className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Total Lecturers</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">24</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Approved Topics</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">110</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <FileText className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Pending Topics</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">12</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Supervisor Allocation Summary</h2>
              <button onClick={() => onNavigate('supervisor-allocation')} className="text-sm text-[#312DC4] hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students without Supervisor</span>
                <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs font-medium rounded-full border border-[#C5C3EC]">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#312DC4] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">85% Allocated</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications Panel</h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 border border-[#C5C3EC] rounded bg-[#EEEDFB]/30">
                <AlertTriangle className="w-5 h-5 text-[#312DC4] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duplicate Topic Detected</p>
                  <p className="text-xs text-gray-500">John Doe submitted a topic similar to an existing one.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 border border-gray-200 rounded bg-gray-50">
                <FileText className="w-5 h-5 text-gray-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">5 New Topics Awaiting Approval</p>
                  <p className="text-xs text-gray-500">Submitted in the last 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => onNavigate('topic-approval')} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Review Proposals
            </button>
            <button onClick={() => onNavigate('supervisor-allocation')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" /> Allocate Supervisors
            </button>
            <button onClick={() => onNavigate('report-generation')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopicApproval({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Topic Approval</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Review Student Proposal</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Student Information</p>
            <p className="font-medium text-gray-900">Alice Smith (REG2023015)</p>
            <p className="text-sm text-gray-600">Computer Science Dept.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Duplicate Topic Detection Status</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC] text-xs rounded-full">Low Risk</span>
              <span className="text-xs text-gray-500">12% similarity</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Project Topic</p>
          <h2 className="text-lg font-medium text-gray-900">AI-Driven Automated Attendance System</h2>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Topic Description</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded border border-gray-200">
            This project aims to develop an automated attendance tracking system using computer vision...
            (Placeholder description text goes here).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation / Comments</label>
          <textarea rows={3} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter comments for the student..." />
        </div>

        <div className="pt-4 flex gap-3 flex-wrap">
          <button onClick={() => { alert('Approved'); onNavigate('dashboard'); }} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            Request Modification
          </button>
          <button onClick={() => { alert('Rejected'); onNavigate('dashboard'); }} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export function SupervisorAllocation({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Supervisor Allocation</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Allocate Supervisor</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Student Details</p>
          <p className="font-medium text-gray-900 text-lg">Mark Johnson (REG2023042)</p>
          <p className="text-sm text-gray-700 mt-1">Selected Topic: <span className="font-medium">Blockchain for Supply Chain</span></p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Supervisors</h2>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name or specialization..." className="w-full bg-white border border-gray-300 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 font-medium text-gray-700">Area of Specialization</th>
              <th className="px-4 py-3 font-medium text-gray-700">Current Load</th>
              <th className="px-4 py-3 font-medium text-gray-700">Availability</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <tr key={item} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">Dr. Supervisor {item}</td>
                <td className="px-4 py-4 text-gray-600">Blockchain, Security</td>
                <td className="px-4 py-4 text-gray-700">{item * 3} Students</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item < 3
                      ? 'bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC]'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {item < 3 ? 'Available' : 'Full Capacity'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => { alert('Assigned!'); onNavigate('dashboard'); }}
                    disabled={item >= 3}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      item < 3
                        ? 'bg-[#312DC4] text-white hover:bg-[#2724b0]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReportGeneration({ onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:underline">Home</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Report Generation</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Generate Reports</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>All Departments</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>All Supervisors</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>Any Status</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <input type="date" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Report Table</h2>
        <div className="border border-gray-200 rounded bg-gray-50 h-64 flex items-center justify-center text-gray-500 text-sm">
          Generated report data will appear here...
        </div>
      </div>
    </div>
  );
}
