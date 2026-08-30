import { useState } from 'react';
import { User, Mail, Building2, Hash, BookOpen, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import type { Role } from '../data/seed';

interface ProfilePageProps {
  role: Role;
}

export function ProfilePage({ role }: ProfilePageProps) {
  const { user, updateProfile } = useAuth();
  const { getStudentAssignment } = useAppData();
  const [name, setName] = useState(user?.name ?? '');
  const [editing, setEditing] = useState(false);

  const assignment = user && role === 'student' ? getStudentAssignment(user.id) : undefined;

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateProfile({ name: name.trim() });
    setEditing(false);
    toast.success('Profile updated');
  };

  if (!user) return null;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: `/${role}/dashboard` }, { label: 'Profile' }]} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#EEEDFB] rounded-full flex items-center justify-center shrink-0">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#312DC4]" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">{user.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#EEEDFB] text-[#312DC4] rounded-full capitalize border border-[#C5C3EC]">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 text-gray-400" /> Display Name
            </label>
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
                />
                <button onClick={handleSave} className="px-3 py-2 bg-[#312DC4] text-white rounded-md text-sm hover:bg-[#2724b0] flex items-center gap-1">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{user.name}</p>
                <button onClick={() => setEditing(true)} className="text-sm text-[#312DC4] hover:underline">Edit</button>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 text-gray-400" /> Email
            </label>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {user.department && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 text-gray-400" /> Department
              </label>
              <p className="text-sm text-gray-600">{user.department}</p>
            </div>
          )}

          {user.regNo && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Hash className="w-4 h-4 text-gray-400" /> Registration Number
              </label>
              <p className="text-sm text-gray-600">{user.regNo}</p>
            </div>
          )}

          {role === 'student' && assignment && (
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 text-gray-400" /> Project Summary
              </label>
              <div className="bg-gray-50 rounded-md p-3 space-y-2 text-sm">
                <p><span className="text-gray-500">Topic:</span> {assignment.topicTitle ?? 'Not selected'}</p>
                <p><span className="text-gray-500">Supervisor:</span> {assignment.supervisorName ?? 'Not assigned'}</p>
                <p><span className="text-gray-500">Progress:</span> {assignment.progress}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
