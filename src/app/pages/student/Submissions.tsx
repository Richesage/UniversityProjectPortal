import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Upload, Download, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export function Submissions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStudentAssignment, getStudentSubmissions, milestones, uploadSubmission } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);

  const assignment = user ? getStudentAssignment(user.id) : undefined;
  const submissions = user ? getStudentSubmissions(user.id) : [];
  const reviewed = submissions.filter((s) => s.status === 'reviewed' || s.feedback);
  const latestStatus = submissions.length > 0 ? submissions[submissions.length - 1].status : 'none';

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!user || !file) {
      toast.error('Please select a file to upload');
      return;
    }
    uploadSubmission(user.id, `Chapter ${submissions.length + 1}`, file.name);
    toast.success('File uploaded successfully');
    navigate('/student/dashboard');
  };

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading ${fileName}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/student/dashboard' }, { label: 'Submissions & Feedback' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Submissions & Feedback</h1>
        <button onClick={() => navigate('/student/progress')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          View Progress Tracking
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Current Project</h2>
        <p className="font-medium text-gray-900">{assignment?.topicTitle ?? 'No project assigned'}</p>
        <p className="text-sm text-gray-600 mt-1">Supervisor: {assignment?.supervisorName ?? 'Not assigned'}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Approval Status:</span>
          <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs rounded-full border border-[#C5C3EC] capitalize">
            {latestStatus === 'none' ? 'No submissions' : latestStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Chapter</h2>
            <div className="border-2 border-dashed border-[#C5C3EC] rounded-md p-8 flex flex-col items-center justify-center bg-[#EEEDFB]/30">
              <Upload className="w-8 h-8 text-[#312DC4] mb-3" />
              <p className="text-sm font-medium text-gray-700">Upload Chapter or File</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
              <input ref={fileRef} type="file" accept=".pdf,.docx" className="mt-4 text-sm" />
              <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
                Upload
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h2>
            {submissions.length > 0 ? (
              <div className="space-y--2">
                {submissions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{s.fileName}</span>
                    </div>
                    <button onClick={() => handleDownload(s.fileName)} className="text-[#312DC4] text-sm hover:underline">Download</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No files uploaded yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Submission History</h2>
            <div className="space-y-4">
              {submissions.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{item.title}: {item.fileName}</p>
                      <p className="text-xs text-gray-500">Submitted on {item.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs rounded-full border border-[#C5C3EC] capitalize">{item.status.replace('_', ' ')}</span>
                    <button onClick={() => handleDownload(item.fileName)} className="p-1 text-gray-500 hover:text-gray-700" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {submissions.length === 0 && <p className="text-sm text-gray-500">No submission history.</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Supervisor Comments
            </h2>
            {reviewed.length > 0 ? (
              reviewed.map((s) => (
                <div key={s.id} className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.feedback}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No supervisor comments yet.</p>
            )}
            <button onClick={() => navigate('/student/progress')} className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
              View Feedback
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Revision History</h2>
            {reviewed.filter((s) => s.status === 'revision_required' || s.feedback).length > 0 ? (
              reviewed.map((s) => (
                <div key={s.id} className="text-sm text-gray-600 mb-2">
                  {s.submittedAt}: {s.title} — {s.feedback ?? 'Revision requested'}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No revisions recorded.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Submission Timeline</h2>
            <div className="relative border-l border-[#C5C3EC] ml-3 space-y-6">
              {milestones.map((m, i) => (
                <div key={m.id} className="relative pl-6">
                  <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full ${m.status === 'completed' ? 'bg-[#312DC4]' : m.status === 'in_progress' ? 'bg-white border-2 border-[#312DC4]' : 'bg-white border-2 border-gray-300'}`} />
                  <p className={`text-sm font-medium ${m.status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>{m.label}</p>
                  <p className="text-xs text-gray-500">{m.dueDate ?? (i === 0 ? 'Completed' : 'Upcoming')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
