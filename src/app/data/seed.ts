export type Role = 'student' | 'lecturer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  regNo?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  department: string;
  researchArea: string;
  maxStudents: number;
  enrolled: number;
  status: 'approved' | 'pending' | 'draft';
  studentId?: string;
}

export interface Proposal {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'modification_requested';
  duplicateRisk: 'low' | 'medium' | 'high';
  similarityPercent: number;
  comments?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  title: string;
  fileName: string;
  submittedAt: string;
  status: 'pending_review' | 'reviewed' | 'approved' | 'revision_required';
  feedback?: string;
  chapter: number;
}

export interface Milestone {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
  percent: number;
  dueDate?: string;
}

export interface Meeting {
  id: string;
  studentId: string;
  supervisorId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  type: 'online' | 'in_person';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: string;
}

export interface Supervisor {
  id: string;
  name: string;
  specialization: string;
  assignedStudents: number;
  maxCapacity: number;
  completedProjects: number;
}

export interface StudentAssignment {
  studentId: string;
  topicId?: string;
  topicTitle?: string;
  supervisorId?: string;
  supervisorName?: string;
  progress: number;
}

export const MOCK_USERS: Record<string, User & { password: string }> = {
  'student@uni.edu': {
    id: 'stu-1',
    name: 'Jane Student',
    email: 'student@uni.edu',
    password: 'password',
    role: 'student',
    department: 'Computer Science',
    regNo: 'CS/2021/001',
  },
  'lecturer@uni.edu': {
    id: 'lec-1',
    name: 'Dr. Amina Yusuf',
    email: 'lecturer@uni.edu',
    password: 'password',
    role: 'lecturer',
    department: 'Computer Science',
  },
  'admin@uni.edu': {
    id: 'adm-1',
    name: 'Admin Coordinator',
    email: 'admin@uni.edu',
    password: 'password',
    role: 'admin',
  },
};

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'top-1',
    title: 'Design of a Web-Based Project Allocation System',
    description: 'Develop a portal for managing final year project allocation and supervision workflows.',
    lecturerId: 'lec-1',
    lecturerName: 'Dr. Amina Yusuf',
    department: 'Computer Science',
    researchArea: 'Software Engineering',
    maxStudents: 5,
    enrolled: 2,
    status: 'approved',
  },
  {
    id: 'top-2',
    title: 'Machine Learning for Academic Performance Prediction',
    description: 'Use ML models to predict student academic outcomes based on historical data.',
    lecturerId: 'lec-2',
    lecturerName: 'Dr. Chukwu Eze',
    department: 'Computer Science',
    researchArea: 'Machine Learning & AI',
    maxStudents: 5,
    enrolled: 3,
    status: 'approved',
  },
  {
    id: 'top-3',
    title: 'Cybersecurity Framework for Campus Networks',
    description: 'Design and implement security measures for university network infrastructure.',
    lecturerId: 'lec-3',
    lecturerName: 'Dr. Fatima Bello',
    department: 'Information Technology',
    researchArea: 'Cybersecurity & Networks',
    maxStudents: 5,
    enrolled: 1,
    status: 'approved',
  },
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    studentId: 'stu-2',
    studentName: 'Alice Smith',
    title: 'AI-Driven Automated Attendance System',
    description: 'Computer vision based attendance tracking for lecture halls.',
    status: 'pending',
    duplicateRisk: 'low',
    similarityPercent: 12,
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    studentId: 'stu-1',
    title: 'Chapter 1: Introduction',
    fileName: 'Chapter_1_Introduction.pdf',
    submittedAt: '2023-10-02',
    status: 'reviewed',
    feedback: 'Well structured introduction. Minor formatting fixes needed.',
    chapter: 1,
  },
  {
    id: 'sub-2',
    studentId: 'stu-1',
    title: 'Chapter 2: Literature Review',
    fileName: 'Chapter_2_Literature.pdf',
    submittedAt: '2023-10-22',
    status: 'pending_review',
    feedback: 'Good start, please revise section 2.1.',
    chapter: 2,
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'mil-1', label: 'Proposal Approved', status: 'completed', percent: 100, dueDate: '2023-09-15' },
  { id: 'mil-2', label: 'Chapter 1', status: 'completed', percent: 100, dueDate: '2023-10-02' },
  { id: 'mil-3', label: 'Chapter 2', status: 'in_progress', percent: 50, dueDate: '2023-11-01' },
  { id: 'mil-4', label: 'Chapter 3', status: 'pending', percent: 0, dueDate: '2023-12-01' },
  { id: 'mil-5', label: 'Final Submission', status: 'pending', percent: 0, dueDate: '2024-03-15' },
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    studentId: 'stu-1',
    supervisorId: 'lec-1',
    title: 'Project Review Setup',
    date: '2023-10-24',
    time: '10:00 AM - 10:30 AM',
    venue: 'Online (Teams)',
    type: 'online',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-1',
    userId: 'stu-1',
    title: 'Chapter 2 Feedback Available',
    message: 'Your supervisor has reviewed Chapter 2. Please check feedback.',
    type: 'info',
    read: false,
    createdAt: '2023-10-23',
  },
  {
    id: 'not-2',
    userId: 'stu-1',
    title: 'Meeting Reminder',
    message: 'Review meeting scheduled for Oct 24 at 10:00 AM.',
    type: 'warning',
    read: false,
    createdAt: '2023-10-23',
  },
  {
    id: 'not-3',
    userId: 'adm-1',
    title: 'Duplicate Topic Detected',
    message: 'John Doe submitted a topic similar to an existing one.',
    type: 'warning',
    read: false,
    createdAt: '2023-10-22',
  },
  {
    id: 'not-4',
    userId: 'adm-1',
    title: '5 New Topics Awaiting Approval',
    message: 'Submitted in the last 24 hours.',
    type: 'info',
    read: false,
    createdAt: '2023-10-22',
  },
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  { id: 'lec-1', name: 'Dr. Amina Yusuf', specialization: 'Software Engineering, AI', assignedStudents: 6, maxCapacity: 10, completedProjects: 2 },
  { id: 'lec-2', name: 'Dr. Chukwu Eze', specialization: 'Machine Learning, Security', assignedStudents: 9, maxCapacity: 10, completedProjects: 1 },
  { id: 'lec-3', name: 'Dr. Fatima Bello', specialization: 'Blockchain, Security', assignedStudents: 10, maxCapacity: 10, completedProjects: 3 },
];

export const INITIAL_ASSIGNMENTS: StudentAssignment[] = [
  {
    studentId: 'stu-1',
    topicId: 'top-1',
    topicTitle: 'Design of a Web-Based Project Allocation System',
    supervisorId: 'lec-1',
    supervisorName: 'Dr. Amina Yusuf',
    progress: 45,
  },
  {
    studentId: 'stu-2',
    topicTitle: 'Blockchain for Supply Chain',
    progress: 20,
  },
  {
    studentId: 'stu-3',
    topicTitle: 'Design of Allocation System',
    supervisorId: 'lec-1',
    supervisorName: 'Dr. Amina Yusuf',
    progress: 40,
  },
  {
    studentId: 'stu-4',
    topicTitle: 'IoT Smart Campus',
    supervisorId: 'lec-1',
    supervisorName: 'Dr. Amina Yusuf',
    progress: 60,
  },
];

export const LECTURER_STUDENTS = [
  { id: 'stu-3', name: 'Jane Doe 1', regNo: 'REG2023001', topic: 'Design of Allocation System', progress: 20, lastSubmission: 'Chapter 1', status: 'Up to date' as const },
  { id: 'stu-4', name: 'Jane Doe 2', regNo: 'REG2023002', topic: 'Design of Allocation System', progress: 40, lastSubmission: 'Chapter 2', status: 'Pending Review' as const },
  { id: 'stu-5', name: 'Jane Doe 3', regNo: 'REG2023003', topic: 'Design of Allocation System', progress: 60, lastSubmission: 'Chapter 3', status: 'Up to date' as const },
  { id: 'stu-6', name: 'Jane Doe 4', regNo: 'REG2023004', topic: 'Design of Allocation System', progress: 80, lastSubmission: 'Chapter 4', status: 'Pending Review' as const },
];

export const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering'];
export const RESEARCH_AREAS = ['Software Engineering', 'Machine Learning & AI', 'Cybersecurity & Networks', 'Web Development', 'Blockchain'];
