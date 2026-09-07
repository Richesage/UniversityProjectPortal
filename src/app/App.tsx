import React, { useState } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';

// Student Screens
import { 
  StudentDashboard, 
  ProjectTopicSelection, 
  SubmissionAndFeedback, 
  ProgressTracking, 
  MeetingSchedule 
} from './components/StudentScreens';

// Lecturer Screens
import {
  LecturerDashboard,
  ProjectTopicUpload,
  ViewAssignedStudents,
  SupervisorWorkloadTracking
} from './components/LecturerScreens';

// Admin Screens
import {
  AdminDashboard,
  TopicApproval,
  SupervisorAllocation,
  ReportGeneration
} from './components/AdminScreens';

type Role = 'student' | 'lecturer' | 'admin' | null;

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  const handleLogin = (selectedRole: 'student' | 'lecturer' | 'admin') => {
    setRole(selectedRole);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  // Render correct screen based on role and currentScreen state
  const renderScreen = () => {
    if (role === 'student') {
      switch (currentScreen) {
        case 'dashboard': return <StudentDashboard onNavigate={handleNavigate} />;
        case 'topic-selection': return <ProjectTopicSelection onNavigate={handleNavigate} />;
        case 'submission': return <SubmissionAndFeedback onNavigate={handleNavigate} />;
        case 'progress': return <ProgressTracking onNavigate={handleNavigate} />;
        case 'meeting': return <MeetingSchedule onNavigate={handleNavigate} />;
        default: return <StudentDashboard onNavigate={handleNavigate} />;
      }
    }

    if (role === 'lecturer') {
      switch (currentScreen) {
        case 'dashboard': return <LecturerDashboard onNavigate={handleNavigate} />;
        case 'topic-upload': return <ProjectTopicUpload onNavigate={handleNavigate} />;
        case 'view-students': return <ViewAssignedStudents onNavigate={handleNavigate} />;
        case 'workload': return <SupervisorWorkloadTracking onNavigate={handleNavigate} />;
        default: return <LecturerDashboard onNavigate={handleNavigate} />;
      }
    }

    if (role === 'admin') {
      switch (currentScreen) {
        case 'dashboard': return <AdminDashboard onNavigate={handleNavigate} />;
        case 'topic-approval': return <TopicApproval onNavigate={handleNavigate} />;
        case 'supervisor-allocation': return <SupervisorAllocation onNavigate={handleNavigate} />;
        case 'report-generation': return <ReportGeneration onNavigate={handleNavigate} />;
        default: return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    return null;
  };

  return (
    <Layout 
      role={role} 
      currentScreen={currentScreen} 
      onNavigate={handleNavigate} 
      onLogout={handleLogout}
    >
      {renderScreen()}
    </Layout>
  );
}
