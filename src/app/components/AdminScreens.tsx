import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, UserCheck, Download, Search,
  AlertTriangle, FileText, CheckCircle, Info, Bell,
  ChevronRight, BarChart2,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { AdminStats, AppNotification, StudentRecord, SupervisorRecord, ReportFilters, ReportRow } from '../../types';

interface ScreenProps { onNavigate: (screen: string) => void; }

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({ onNavigate }: ScreenProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.notifications()])
      .then(([s, n]) => { setStats(s); setNotifications(n); })
      .finally(() => setLoading(false));
  }, []);

  const notifIcon: Record<string, React.ElementType> = {
    warning: AlertTriangle,
    info:    Info,
    success: CheckCircle,
    error:   AlertTriangle,
  };
  const notifCls: Record<string, string> = {
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error:   'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students',       value: stats?.totalStudents,        icon: Users,    color: 'text-[#312DC4]',   bg: 'bg-[#EEEDFB]' },
          { label: 'Total Lecturers',      value: stats?.totalLecturers,       icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Approved Topics',      value: stats?.approvedTopics,       icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Topics',       value: stats?.pendingTopics,        icon: FileText, color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Allocated %',          value: stats ? `${stats.allocatedPercentage}%` : undefined, icon: UserCheck, color: 'text-[#312DC4]', bg: 'bg-[#EEEDFB]' },
          { label: 'Unallocated Students', value: stats?.unallocatedStudents,  icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-3">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{loading ? '—' : card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#312DC4]" />
            <h3 className="font-semibold text-gray-700">System Alerts</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No alerts.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const Icon = notifIcon[n.type] ?? Info;
                return (
                  <div key={n.id} className={`flex items-start gap-3 border rounded-lg px-3 py-3 ${notifCls[n.type] ?? 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Allocate Supervisors', screen: 'supervisor-allocation', icon: UserCheck },
              { label: 'Generate Reports',     screen: 'report-generation',     icon: BarChart2 },
              { label: 'Review Proposals',     screen: 'topic-approval',        icon: FileText },
            ].map((a) => (
              <button
                key={a.screen}
                onClick={() => onNavigate(a.screen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#C5C3EC] hover:bg-[#EEEDFB] transition-colors text-left"
              >
                <a.icon className="w-4 h-4 text-[#312DC4]" />
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TopicApproval (kept but not in admin nav) ────────────────────────────────
export function TopicApproval({ onNavigate: _onNavigate }: ScreenProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Topic Approval</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Topic approval queue will display here once connected to the backend.</p>
      </div>
    </div>
  );
}

// ─── SupervisorAllocation ─────────────────────────────────────────────────────
export function SupervisorAllocation({ onNavigate: _onNavigate }: ScreenProps) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [supSearch, setSupSearch] = useState('');
  const [selected, setSelected] = useState<{ studentId: string; supervisorId: string | null }>({ studentId: '', supervisorId: null });
  const [allocating, setAllocating] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([adminApi.unallocatedStudents(), adminApi.supervisors()])
      .then(([s, sup]) => { setStudents(s); setSupervisors(sup); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    adminApi.supervisors(supSearch.trim() || undefined).then(setSupervisors);
  }, [supSearch]);

  const handleAllocate = async () => {
    if (!selected.studentId || !selected.supervisorId) return;
    setAllocating(true);
    try {
      await adminApi.allocate(selected.studentId, selected.supervisorId);
      const studentName = students.find(s => s.id === selected.studentId)?.name ?? 'Student';
      const supName = supervisors.find(s => s.id === selected.supervisorId)?.name ?? 'Supervisor';
      setStudents(prev => prev.filter(s => s.id !== selected.studentId));
      setSelected({ studentId: '', supervisorId: null });
      setAllocSuccess(`${studentName} has been allocated to ${supName}.`);
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Allocate Supervisors</h2>

      {allocSuccess && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
          <CheckCircle className="w-4 h-4 shrink-0" /> {allocSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unallocated students */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Unallocated Students ({students.length})</h3>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All students are allocated!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(prev => ({ ...prev, studentId: s.id }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    selected.studentId === s.id
                      ? 'border-[#312DC4] bg-[#EEEDFB]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.regNo} · {s.currentTopic}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Supervisors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Available Supervisors</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search supervisors…"
              value={supSearch}
              onChange={(e) => setSupSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]"
            />
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="space-y-2">
              {supervisors.map((sup) => (
                <button
                  key={sup.id}
                  disabled={sup.availability === 'full'}
                  onClick={() => setSelected(prev => ({ ...prev, supervisorId: sup.id }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    selected.supervisorId === sup.id
                      ? 'border-[#312DC4] bg-[#EEEDFB]'
                      : sup.availability === 'full'
                        ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#EEEDFB] flex items-center justify-center text-xs font-bold text-[#312DC4] shrink-0">
                    {sup.name.split(' ').filter(w => w !== 'Dr.').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{sup.name}</p>
                    <p className="text-xs text-gray-400 truncate">{sup.specialization}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-600">{sup.currentLoad}/{sup.maxLoad}</p>
                    <span className={`text-xs font-medium ${sup.availability === 'available' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {sup.availability === 'available' ? 'Available' : 'Full'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAllocate}
          disabled={!selected.studentId || !selected.supervisorId || allocating}
          className="px-6 py-2.5 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-50"
        >
          {allocating ? 'Allocating…' : 'Confirm Allocation'}
        </button>
      </div>
    </div>
  );
}

// ─── ReportGeneration ─────────────────────────────────────────────────────────
export function ReportGeneration({ onNavigate: _onNavigate }: ScreenProps) {
  const [filters, setFilters] = useState<ReportFilters>({ department: '', supervisorId: '', status: '', dateFrom: '', dateTo: '' });
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [generated, setGenerated] = useState(false);

  const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering'];
  const STATUSES = ['In Progress', 'Completed', 'Suspended'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const data = await adminApi.generateReport(filters);
      setRows(data);
      setGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      const { url } = await adminApi.exportReport(filters, format);
      if (url && url !== '#') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        a.click();
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Report Generation</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Filter Report</h3>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={filters.department} onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
              <select value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#312DC4]" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={generating}
              className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60">
              {generating ? 'Generating…' : 'Generate Report'}
            </button>
            {generated && (
              <>
                <button type="button" onClick={() => handleExport('pdf')} disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7] disabled:opacity-60">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button type="button" onClick={() => handleExport('excel')} disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
                  <Download className="w-4 h-4" /> Excel
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {generated && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Results ({rows.length} records)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Student', 'Reg. No.', 'Department', 'Topic', 'Supervisor', 'Progress', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.studentName}</td>
                    <td className="px-4 py-3 text-gray-500">{row.regNo}</td>
                    <td className="px-4 py-3 text-gray-600">{row.department}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs"><p className="truncate">{row.topic}</p></td>
                    <td className="px-4 py-3 text-gray-600">{row.supervisor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#312DC4] h-1.5 rounded-full" style={{ width: `${row.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
