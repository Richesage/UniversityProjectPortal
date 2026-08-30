import { useNavigate } from 'react-router';
import { CheckCircle, Circle } from 'lucide-react';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { milestones, getStudentAssignment } = useAppData();

  const assignment = user ? getStudentAssignment(user.id) : undefined;
  const progress = assignment?.progress ?? 0;
  const completed = milestones.filter((m) => m.status === 'completed');
  const pending = milestones.filter((m) => m.status === 'pending' || m.status === 'in_progress');

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/student/dashboard' }, { label: 'Progress Tracking' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Project Progress</h1>
        <button onClick={() => navigate('/student/dashboard')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 w-full text-left">Overall Completion</h2>
          <div className="relative w-40 h-40 flex items-center justify-center bg-[#EEEDFB] rounded-full border-8 border-[#312DC4]">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[#312DC4]">{progress}%</span>
              <span className="text-xs text-gray-500 mt-1">Completed</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            Supervisor Approval: <span className="font-medium text-[#312DC4]">{progress >= 50 ? 'On Track' : 'In Progress'}</span>
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Milestones</h2>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`flex items-center justify-between p-3 border rounded-md ${
                  m.status === 'completed' ? 'border-[#C5C3EC] bg-[#EEEDFB]/40' : m.status === 'in_progress' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {m.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-[#312DC4]" />
                  ) : m.status === 'in_progress' ? (
                    <div className="w-5 h-5 border-2 border-[#312DC4] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#312DC4] rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-800">{m.label}</span>
                </div>
                <span className="text-xs text-gray-500 capitalize">{m.status === 'completed' ? '100%' : m.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Timeline</h2>
          <div className="relative border-l border-[#C5C3EC] ml-3 space-y-4">
            {milestones.map((m) => (
              <div key={m.id} className="relative pl-6">
                <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full ${m.status === 'completed' ? 'bg-[#312DC4]' : 'bg-gray-300'}`} />
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs text-gray-500">{m.dueDate ?? 'TBD'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Completed Tasks</h2>
            {completed.length > 0 ? (
              completed.map((m) => (
                <div key={m.id} className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#312DC4]" />
                  <span className="text-sm">{m.label}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No completed tasks yet.</p>
            )}
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h2>
            {pending.length > 0 ? (
              pending.map((m) => (
                <div key={m.id} className="flex items-center gap-2 mb-2">
                  <Circle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{m.label}{m.dueDate ? ` — due ${m.dueDate}` : ''}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">All tasks completed!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
