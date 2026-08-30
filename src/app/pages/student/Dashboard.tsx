import { useNavigate } from 'react-router';
import { FileText, Calendar, Bell, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { topics, proposals, getStudentAssignment, getStudentSubmissions, getStudentMeetings, getUserNotifications, markNotificationRead } = useAppData();

  const assignment = user ? getStudentAssignment(user.id) : undefined;
  const submissions = user ? getStudentSubmissions(user.id) : [];
  const meetings = user ? getStudentMeetings(user.id) : [];
  const notifications = user ? getUserNotifications(user.id) : [];
  const availableTopics = topics.filter((t) => t.status === 'approved' && t.enrolled < t.maxStudents);
  const myProposals = proposals.filter((p) => p.studentId === user?.id);
  const latestSubmission = submissions[submissions.length - 1];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/student/dashboard' }, { label: 'Student Dashboard' }]} />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome, {user?.name?.split(' ')[0] ?? 'Student'}</h1>
        <p className="text-gray-500">Overview of your final year project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Project</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Topic</p>
                <p className="font-medium text-gray-900">{assignment?.topicTitle ?? 'No topic selected yet'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned Supervisor</p>
                <p className="font-medium text-gray-900">{assignment?.supervisorName ?? 'Not assigned'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Submission Status</h2>
              <button onClick={() => navigate('/student/submissions')} className="text-sm text-[#312DC4] hover:underline">View All</button>
            </div>
            {latestSubmission ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{latestSubmission.title}</p>
                    <p className="text-xs text-gray-500">Submitted {latestSubmission.submittedAt}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] text-xs rounded-full border border-[#C5C3EC] capitalize">
                  {latestSubmission.status.replace('_', ' ')}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No submissions yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Project Topics</h2>
              <button onClick={() => navigate('/student/topics')} className="text-sm text-[#312DC4] hover:underline">Browse All</button>
            </div>
            <div className="space-y-2">
              {availableTopics.slice(0, 3).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => navigate('/student/topics')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">{topic.title}</p>
                    <p className="text-xs text-gray-500">{topic.lecturerName} · {topic.maxStudents - topic.enrolled} slots left</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Proposed Topics</h2>
              <button onClick={() => navigate('/student/submissions')} className="text-sm text-[#312DC4] hover:underline">View Feedback</button>
            </div>
            {myProposals.length > 0 ? (
              myProposals.map((p) => (
                <div key={p.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">Status: {p.status.replace('_', ' ')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No proposals submitted. <button onClick={() => navigate('/student/topics')} className="text-[#312DC4] hover:underline">Propose a topic</button></p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Progress</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center bg-[#EEEDFB] rounded-full border-4 border-[#312DC4]">
                <span className="text-2xl font-bold text-[#312DC4]">{assignment?.progress ?? 0}%</span>
              </div>
            </div>
            <button onClick={() => navigate('/student/progress')} className="w-full mt-6 py-2 bg-[#EEEDFB] hover:bg-[#E3E2F7] text-[#312DC4] text-sm font-medium rounded-md">
              View Detailed Progress
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
            {meetings.length > 0 ? (
              meetings.slice(0, 2).map((m) => (
                <div key={m.id} className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{m.title}</p>
                    <p className="text-xs text-gray-500">{m.date} - {m.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 mb-4">No upcoming meetings.</p>
            )}
            <button onClick={() => navigate('/student/meetings')} className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md">
              Schedule Meeting
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-2 sm:space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.actionUrl) navigate(n.actionUrl);
                  }}
                  className={`w-full text-left flex gap-2 p-2 rounded-md transition-colors hover:bg-gray-50 ${n.read ? 'bg-gray-50' : 'bg-[#EEEDFB]/40 border border-[#C5C3EC]'}`}
                >
                  <Bell className="w-4 h-4 text-[#312DC4] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                  </div>
                </button>
              ))}
              {notifications.length === 0 && <p className="text-sm text-gray-500">No notifications.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/student/topics')} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
            Browse Project Topics
          </button>
          <button onClick={() => navigate('/student/submissions')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
            Submit Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
