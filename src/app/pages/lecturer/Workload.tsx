import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';

const DISTRIBUTION_DATA = [
  { name: 'Active', value: 10, color: '#312DC4' },
  { name: 'Completed', value: 2, color: '#C5C3EC' },
  { name: 'Pending Review', value: 4, color: '#EEEDFB' },
];

export function Workload() {
  const navigate = useNavigate();
  const { lecturerStudents, submissions } = useAppData();

  const totalAssigned = lecturerStudents.length;
  const completed = 2;
  const pendingReviews = submissions.filter((s) => s.status === 'pending_review').length;
  const availableCapacity = Math.max(0, 15 - totalAssigned);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/lecturer/dashboard' }, { label: 'Workload Tracking' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Supervisor Workload</h1>
        <button onClick={() => navigate('/lecturer/dashboard')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          Back
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Assigned</p>
          <p className="text-2xl font-bold text-gray-800">{totalAssigned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-gray-800">{completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Pending Reviews</p>
          <p className="text-2xl font-bold text-gray-800">{pendingReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Available Capacity</p>
          <p className="text-2xl font-bold text-gray-800">{availableCapacity}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Workload Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DISTRIBUTION_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {DISTRIBUTION_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Reviews</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', count: 2 }, { day: 'Tue', count: 3 }, { day: 'Wed', count: 1 },
                { day: 'Thu', count: 4 }, { day: 'Fri', count: 2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#312DC4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
