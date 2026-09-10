import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';

import {
  StudentDashboard, ProjectTopicSelection, SubmissionAndFeedback,
  ProgressTracking, StudentMessaging,
} from './components/StudentScreens';

import {
  LecturerDashboard, ProjectTopicUpload, ViewAssignedStudents,
  SupervisorWorkloadTracking, LecturerMessaging,
} from './components/LecturerScreens';

import {
  AdminDashboard, TopicApproval, SupervisorAllocation, ReportGeneration,
} from './components/AdminScreens';

function AppShell() {
  const { user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  const handleNavigate = (screen: string) => setCurrentScreen(screen);

  if (!user) {
    return <Login />;
  }

  const renderScreen = () => {
    if (user.role === 'student') {
      switch (currentScreen) {
        case 'dashboard':       return <StudentDashboard onNavigate={handleNavigate} />;
        case 'topic-selection': return <ProjectTopicSelection onNavigate={handleNavigate} />;
        case 'submission':      return <SubmissionAndFeedback onNavigate={handleNavigate} />;
        case 'progress':        return <ProgressTracking onNavigate={handleNavigate} />;
        case 'messages':        return <StudentMessaging onNavigate={handleNavigate} />;
        default:                return <StudentDashboard onNavigate={handleNavigate} />;
      }
    }

    if (user.role === 'lecturer') {
      switch (currentScreen) {
        case 'dashboard':     return <LecturerDashboard onNavigate={handleNavigate} />;
        case 'topic-upload':  return <ProjectTopicUpload onNavigate={handleNavigate} />;
        case 'view-students': return <ViewAssignedStudents onNavigate={handleNavigate} />;
        case 'workload':      return <SupervisorWorkloadTracking onNavigate={handleNavigate} />;
        case 'messages':      return <LecturerMessaging onNavigate={handleNavigate} />;
        default:              return <LecturerDashboard onNavigate={handleNavigate} />;
      }
    }

    if (user.role === 'admin') {
      switch (currentScreen) {
        case 'dashboard':             return <AdminDashboard onNavigate={handleNavigate} />;
        case 'topic-approval':        return <TopicApproval onNavigate={handleNavigate} />;
        case 'supervisor-allocation': return <SupervisorAllocation onNavigate={handleNavigate} />;
        case 'report-generation':     return <ReportGeneration onNavigate={handleNavigate} />;
        default:                      return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    return null;
  };

  return (
    <Layout
      role={user.role}
      currentScreen={currentScreen}
      onNavigate={handleNavigate}
      onLogout={logout}
    >
      {renderScreen()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
