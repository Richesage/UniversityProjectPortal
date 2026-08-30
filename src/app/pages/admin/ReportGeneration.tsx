import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';
import { DEPARTMENTS } from '../../data/seed';

interface ReportRow {
  student: string;
  topic: string;
  supervisor: string;
  department: string;
  status: string;
  progress: string;
}

export function ReportGeneration() {
  const navigate = useNavigate();
  const { assignments, topics, supervisors } = useAppData();

  const [department, setDepartment] = useState('All Departments');
  const [supervisorFilter, setSupervisorFilter] = useState('All Supervisors');
  const [status, setStatus] = useState('Any Status');
  const [dateRange, setDateRange] = useState('');
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [generated, setGenerated] = useState(false);

  const generateReport = () => {
    const rows: ReportRow[] = assignments.map((a, i) => ({
      student: `Student ${i + 1}`,
      topic: a.topicTitle ?? 'Not assigned',
      supervisor: a.supervisorName ?? 'Unassigned',
      department: topics.find((t) => t.id === a.topicId)?.department ?? 'Computer Science',
      status: a.supervisorId ? 'Active' : 'Pending',
      progress: `${a.progress}%`,
    }));

    let filtered = rows;
    if (department !== 'All Departments') filtered = filtered.filter((r) => r.department === department);
    if (supervisorFilter !== 'All Supervisors') filtered = filtered.filter((r) => r.supervisor === supervisorFilter);
    if (status !== 'Any Status') filtered = filtered.filter((r) => r.status === status);

    setReportData(filtered);
    setGenerated(true);
    toast.success('Report generated');
  };

  const exportCSV = () => {
    if (!generated || reportData.length === 0) { toast.error('Generate a report first'); return; }
    const headers = ['Student', 'Topic', 'Supervisor', 'Department', 'Status', 'Progress'];
    const csv = [headers.join(','), ...reportData.map((r) => [r.student, r.topic, r.supervisor, r.department, r.status, r.progress].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
    navigate('/admin/dashboard');
  };

  const exportPDF = () => {
    if (!generated) { toast.error('Generate a report first'); return; }
    toast.success('PDF export initiated (demo)');
    navigate('/admin/dashboard');
  };

  const exportExcel = () => {
    if (!generated) { toast.error('Generate a report first'); return; }
    exportCSV();
    toast.success('Excel export initiated (CSV format)');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Report Generation' }]} />
      <h1 className="text-2xl font-bold text-gray-800">Generate Reports</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
            <select value={supervisorFilter} onChange={(e) => setSupervisorFilter(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>All Supervisors</option>
              {supervisors.map((s) => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              <option>Any Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <input type="date" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={generateReport} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Generate Report</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={exportExcel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={exportCSV} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Report Table</h2>
        {generated && reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Student', 'Topic', 'Supervisor', 'Department', 'Status', 'Progress'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{row.student}</td>
                    <td className="px-4 py-3">{row.topic}</td>
                    <td className="px-4 py-3">{row.supervisor}</td>
                    <td className="px-4 py-3">{row.department}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3">{row.progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-gray-200 rounded bg-gray-50 h-64 flex items-center justify-center text-gray-500 text-sm">
            {generated ? 'No data matches your filters.' : 'Generated report data will appear here...'}
          </div>
        )}
      </div>
    </div>
  );
}
