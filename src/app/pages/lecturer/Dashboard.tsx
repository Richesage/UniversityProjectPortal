import { useNavigate } from 'react-router';
import { Users, BookOpen, CheckSquare, Clock, Upload, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';

const WORKLOAD_DATA = [
  { name: 'Mon', reviews: 2 },
  { name: 'Tue', reviews: 3 },
  { name: 'Wed', reviews: 1 },
  { name: 'Thu', reviews: 4 },
  { name: 'Fri', reviews: 2 },
];

export function LecturerDashboard() {
  const navigate = useNavigate();
  const { lecturerStudents, submissions } = useAppData();

  const pendingReviews = submissions.filter((s) => s.status === 'pending_review').length;
  const activeProjects = lecturerStudents.length;
  const workloadPercent = Math.min(100, Math.round((activeProjects / 15) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/lecturer/dashboard' }, { label: 'Lecturer Dashboard' }]} />

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lecturer Dashboard</h1>
        <p className="text-gray-500">Overview of your supervision tasks.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Assigned Students</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{lecturerStudents.length}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BookOpen className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Active Projects</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{activeProjects}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CheckSquare className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Pending Reviews</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{pendingReviews}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4 text-[#312DC4]" />
            <span className="text-sm">Workload</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{workloadPercent}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Student Submissions</h2>
            <button onClick={() => navigate('/lecturer/students')} className="text-sm text-[#312DC4] hover:underline">View All Students</button>
          </div>
          <div className="space-y-3">
            {lecturerStudents.slice(0, 3).map((item, i) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EEEDFB] rounded-full flex items-center justify-center text-xs font-medium text-[#312DC4]">ST{i + 1}</div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.lastSubmission} Uploaded</p>
                  </div>
                </div>
                <button onClick={() => navigate('/lecturer/students')} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50">
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
              <button onClick={() => navigate('/lecturer/upload')} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload Project Topics
              </button>
              <button onClick={() => navigate('/lecturer/students')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> View Assigned Students
              </button>
              <button onClick={() => navigate('/lecturer/workload')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> View Workload Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Supervisor Workload</h2>
          <button onClick={() => navigate('/lecturer/workload')} className="text-sm text-[#312DC4] hover:underline">View Full Chart</button>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WORKLOAD_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="reviews" fill="#312DC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
