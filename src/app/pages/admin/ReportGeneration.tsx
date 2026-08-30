import { useState } from 'react';
import { FileText, Sheet, Table } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';
import { DEPARTMENTS } from '../../data/seed';
import { exportCSV, exportExcel, exportPDF, type ReportRow } from '../../lib/export';

export function ReportGeneration() {
  const { assignments, topics, supervisors } = useAppData();

  const [department, setDepartment] = useState('All Departments');
  const [supervisorFilter, setSupervisorFilter] = useState('All Supervisors');
  const [status, setStatus] = useState('Any Status');
  const [dateRange, setDateRange] = useState('');
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [generated, setGenerated] = useState(false);

  const buildRows = (): ReportRow[] => {
    const rows: ReportRow[] = assignments.map((a, i) => ({
      Student: `Student ${i + 1}`,
      Topic: a.topicTitle ?? 'Not assigned',
      Supervisor: a.supervisorName ?? 'Unassigned',
      Department: topics.find((t) => t.id === a.topicId)?.department ?? 'Computer Science',
      Status: a.supervisorId ? 'Active' : 'Pending',
      Progress: `${a.progress}%`,
    }));

    let filtered = rows;
    if (department !== 'All Departments') filtered = filtered.filter((r) => r.Department === department);
    if (supervisorFilter !== 'All Supervisors') filtered = filtered.filter((r) => r.Supervisor === supervisorFilter);
    if (status !== 'Any Status') filtered = filtered.filter((r) => r.Status === status);
    if (dateRange) filtered = filtered;
    return filtered;
  };

  const generateReport = () => {
    const filtered = buildRows();
    setReportData(filtered);
    setGenerated(true);
    toast.success(filtered.length > 0 ? 'Report generated' : 'No data matches your filters');
  };

  const ensureGenerated = () => {
    if (!generated || reportData.length === 0) {
      toast.error('Generate a report first');
      return false;
    }
    return true;
  };

  const handleExportCSV = () => {
    if (!ensureGenerated()) return;
    exportCSV(reportData, 'project-report.csv');
    toast.success('CSV downloaded');
  };

  const handleExportExcel = () => {
    if (!ensureGenerated()) return;
    exportExcel(reportData, 'project-report.xlsx');
    toast.success('Excel downloaded');
  };

  const handleExportPDF = () => {
    if (!ensureGenerated()) return;
    exportPDF(reportData, 'Project Allocation Report', 'project-report.pdf');
    toast.success('PDF downloaded');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Report Generation' }]} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Generate Reports</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button onClick={generateReport} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Generate Report</button>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <Sheet className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <Table className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Preview Report Table</h2>
        {generated && reportData.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {Object.keys(reportData[0]).map((h) => (
                    <th key={h} className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 sm:px-4 py-2.5 sm:py-3">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-gray-200 rounded bg-gray-50 h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm px-4 text-center">
            {generated ? 'No data matches your filters.' : 'Generated report data will appear here...'}
          </div>
        )}
      </div>
    </div>
  );
}
