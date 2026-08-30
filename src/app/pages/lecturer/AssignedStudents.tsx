import { useState } from 'react';
import { Search, FileText, Edit, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export function AssignedStudents() {
  const { user } = useAuth();
  const { lecturerStudents, submissions, giveFeedback, requestMeeting } = useAppData();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof lecturerStudents[0] | null>(null);
  const [dialogMode, setDialogMode] = useState<'details' | 'feedback' | 'meeting' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const filtered = lecturerStudents.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.toLowerCase().includes(search.toLowerCase())
  );

  const openDialog = (student: typeof lecturerStudents[0], mode: 'details' | 'feedback' | 'meeting') => {
    setSelectedStudent(student);
    setDialogMode(mode);
    setFeedbackText('');
    setMeetingDate('');
    setMeetingTime('');
  };

  const handleGiveFeedback = () => {
    if (!selectedStudent || !feedbackText.trim()) {
      toast.error('Please enter feedback');
      return;
    }
    const studentSubs = submissions.filter((s) => s.studentId === selectedStudent.id);
    const latest = studentSubs[studentSubs.length - 1] ?? submissions.find((s) => s.status === 'pending_review');
    if (latest) {
      giveFeedback(latest.id, feedbackText, selectedStudent.id);
      toast.success(`Feedback sent to ${selectedStudent.name}`);
    } else {
      toast.error('No submission found for this student');
    }
    setDialogMode(null);
  };

  const handleScheduleMeeting = () => {
    if (!selectedStudent || !meetingDate || !meetingTime) {
      toast.error('Please select date and time');
      return;
    }
    requestMeeting({
      studentId: selectedStudent.id,
      supervisorId: user?.id ?? 'lec-1',
      title: `Meeting with ${selectedStudent.name}`,
      date: meetingDate,
      time: meetingTime,
      venue: 'Online (Teams)',
      type: 'online',
    });
    toast.success(`Meeting scheduled with ${selectedStudent.name}`);
    setDialogMode(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/lecturer/dashboard' }, { label: 'Assigned Students' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Assigned Students</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Student</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Reg No</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Current Topic</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Progress</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Last Submission</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700">Status</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-600">{item.regNo}</td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-700 truncate max-w-[150px]">{item.topic}</td>
                <td className="px-3 sm:px-4 py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#312DC4] rounded-full" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{item.progress}%</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-600">{item.lastSubmission}</td>
                <td className="px-3 sm:px-4 py-3 sm:py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Pending Review' ? 'bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC]' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <button onClick={() => openDialog(item, 'details')} className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="View Details"><FileText className="w-4 h-4" /></button>
                    <button onClick={() => openDialog(item, 'feedback')} className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="Give Feedback"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => openDialog(item, 'meeting')} className="p-1.5 text-gray-500 hover:text-[#312DC4] hover:bg-[#EEEDFB] rounded" title="Schedule Meeting"><Calendar className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'details' && 'Student Details'}
              {dialogMode === 'feedback' && 'Give Feedback'}
              {dialogMode === 'meeting' && 'Schedule Meeting'}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && dialogMode === 'details' && (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Reg No:</strong> {selectedStudent.regNo}</p>
              <p><strong>Topic:</strong> {selectedStudent.topic}</p>
              <p><strong>Progress:</strong> {selectedStudent.progress}%</p>
              <p><strong>Last Submission:</strong> {selectedStudent.lastSubmission}</p>
            </div>
          )}
          {selectedStudent && dialogMode === 'feedback' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Feedback for {selectedStudent.name}</p>
              <textarea rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="Enter your feedback..." />
              <button onClick={handleGiveFeedback} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Submit Feedback</button>
            </div>
          )}
          {selectedStudent && dialogMode === 'meeting' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Schedule meeting with {selectedStudent.name}</p>
              <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" />
              <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" />
              <button onClick={handleScheduleMeeting} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Schedule</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
