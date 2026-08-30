import { useNavigate } from 'react-router';
import { Users, BookOpen, UserCheck, Download, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { topics, proposals, assignments, supervisors, getUserNotifications } = useAppData();

  const notifications = user ? getUserNotifications(user.id) : [];
  const approvedTopics = topics.filter((t) => t.status === 'approved').length;
  const pendingTopics = proposals.filter((p) => p.status === 'pending').length;
  const unallocated = assignments.filter((a) => !a.supervisorId).length;
  const allocatedPercent = assignments.length > 0 ? Math.round(((assignments.length - unallocated) / assignments.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Admin Dashboard' }]} />

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and management.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2"><Users className="w-4 h-4 text-[#312DC4]" /><span className="text-sm">Total Students</span></div>
          <span className="text-2xl font-bold text-gray-800">{assignments.length + 130}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2"><UserCheck className="w-4 h-4 text-[#312DC4]" /><span className="text-sm">Total Lecturers</span></div>
          <span className="text-2xl font-bold text-gray-800">{supervisors.length + 21}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2"><BookOpen className="w-4 h-4 text-[#312DC4]" /><span className="text-sm">Approved Topics</span></div>
          <span className="text-2xl font-bold text-gray-800">{approvedTopics}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2"><FileText className="w-4 h-4 text-[#312DC4]" /><span className="text-sm">Pending Topics</span></div>
          <span className="text-2xl font-bold text-gray-800">{pendingTopics}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Supervisor Allocation Summary</h2>
              <button onClick={() => navigate('/admin/allocation')} className="text-sm text-[#312DC4] hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students without Supervisor</span>
                <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs font-medium rounded-full border border-[#C5C3EC]">{unallocated}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#312DC4] h-2 rounded-full transition-all" style={{ width: `${allocatedPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 text-right">{allocatedPercent}% Allocated</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications Panel</h2>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`flex gap-3 p-3 border rounded ${n.type === 'warning' ? 'border-[#C5C3EC] bg-[#EEEDFB]/30' : 'border-gray-200 bg-gray-50'}`}>
                  {n.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-[#312DC4] shrink-0" /> : <FileText className="w-5 h-5 text-gray-500 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/approval')} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Review Proposals
            </button>
            <button onClick={() => navigate('/admin/allocation')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" /> Allocate Supervisors
            </button>
            <button onClick={() => navigate('/admin/reports')} className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
