import { createBrowserRouter, Navigate } from 'react-router';
import { RootRedirect, ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';

import { StudentDashboard } from '../pages/student/Dashboard';
import { TopicSelection } from '../pages/student/TopicSelection';
import { Submissions } from '../pages/student/Submissions';
import { Progress } from '../pages/student/Progress';
import { Meetings } from '../pages/student/Meetings';

import { LecturerDashboard } from '../pages/lecturer/Dashboard';
import { TopicUpload } from '../pages/lecturer/TopicUpload';
import { AssignedStudents } from '../pages/lecturer/AssignedStudents';
import { Workload } from '../pages/lecturer/Workload';

import { AdminDashboard } from '../pages/admin/Dashboard';
import { TopicApproval } from '../pages/admin/TopicApproval';
import { SupervisorAllocation } from '../pages/admin/SupervisorAllocation';
import { ReportGeneration } from '../pages/admin/ReportGeneration';
import { ProfilePage } from '../pages/Profile';

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/student',
    element: <ProtectedRoute allowedRole="student" />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'topics', element: <TopicSelection /> },
      { path: 'submissions', element: <Submissions /> },
      { path: 'progress', element: <Progress /> },
      { path: 'meetings', element: <Meetings /> },
      { path: 'profile', element: <ProfilePage role="student" /> },
    ],
  },
  {
    path: '/lecturer',
    element: <ProtectedRoute allowedRole="lecturer" />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <LecturerDashboard /> },
      { path: 'upload', element: <TopicUpload /> },
      { path: 'students', element: <AssignedStudents /> },
      { path: 'workload', element: <Workload /> },
      { path: 'profile', element: <ProfilePage role="lecturer" /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'approval', element: <TopicApproval /> },
      { path: 'allocation', element: <SupervisorAllocation /> },
      { path: 'reports', element: <ReportGeneration /> },
      { path: 'profile', element: <ProfilePage role="admin" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
