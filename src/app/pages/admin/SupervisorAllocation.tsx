import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';

export function SupervisorAllocation() {
  const navigate = useNavigate();
  const { supervisors, assignments, assignSupervisor } = useAppData();
  const [search, setSearch] = useState('');

  const unallocatedStudent = assignments.find((a) => !a.supervisorId) ?? assignments[1];

  const filteredSupervisors = supervisors.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = (supervisorId: string) => {
    if (!unallocatedStudent) return;
    const supervisor = supervisors.find((s) => s.id === supervisorId);
    if (!supervisor || supervisor.assignedStudents >= supervisor.maxCapacity) {
      toast.error('Supervisor at full capacity');
      return;
    }
    assignSupervisor(unallocatedStudent.studentId, supervisorId);
    toast.success(`Supervisor assigned to student`);
    navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Supervisor Allocation' }]} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Allocate Supervisor</h1>

      {unallocatedStudent && (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Student Details</p>
            <p className="font-medium text-gray-900 text-lg">Student ({unallocatedStudent.studentId})</p>
            <p className="text-sm text-gray-700 mt-1">Selected Topic: <span className="font-medium">{unallocatedStudent.topicTitle ?? 'Not selected'}</span></p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800">Available Supervisors</h2>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name or specialization..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]" />
          </div>
        </div>
        <table className="w-full text-left text-sm min-w-[640px]">
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
            {filteredSupervisors.map((s) => {
              const isFull = s.assignedStudents >= s.maxCapacity;
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-4 text-gray-600">{s.specialization}</td>
                  <td className="px-4 py-4 text-gray-700">{s.assignedStudents} Students</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${isFull ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC]'}`}>
                      {isFull ? 'Full Capacity' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleAssign(s.id)}
                      disabled={isFull}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${isFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#312DC4] text-white hover:bg-[#2724b0]'}`}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
