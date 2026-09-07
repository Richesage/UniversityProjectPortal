import React, { useState } from 'react';
import { BookOpen, KeyRound, Mail, Hash, User, ChevronDown } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'student' | 'lecturer' | 'admin') => void;
}

type AuthMode = 'login' | 'register';
type RegisterRole = 'student' | 'lecturer' | 'admin';
type IdType = 'id' | 'email';

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [registerRole, setRegisterRole] = useState<RegisterRole>('student');
  const [regIdType, setRegIdType] = useState<IdType>('id');
  const [loginIdType, setLoginIdType] = useState<IdType>('id');

  const isStudent = registerRole === 'student';

  const regIdLabel = isStudent
    ? (regIdType === 'id' ? 'Matric Number' : 'Student Email')
    : (regIdType === 'id' ? 'Staff ID' : 'Staff Email');

  const regIdPlaceholder = isStudent
    ? (regIdType === 'id' ? 'e.g. CS/2021/001' : 'student@university.edu')
    : (regIdType === 'id' ? 'e.g. STF-00123' : 'staff@university.edu');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-6 px-8 border-b border-gray-100">
          <div className="w-14 h-14 bg-[#EEEDFB] rounded-full flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7 text-[#312DC4]" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">University Project Portal</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-[#312DC4] text-[#312DC4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-[#312DC4] text-[#312DC4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-8 space-y-4">
          {mode === 'login' ? (
            /* ── LOGIN FORM ── */
            <>
              {/* Identifier toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {loginIdType === 'id' ? 'Matric / Staff ID' : 'Email Address'}
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setLoginIdType('id')}
                      className={`font-medium transition-colors ${loginIdType === 'id' ? 'text-[#312DC4] underline underline-offset-2' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Use ID
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setLoginIdType('email')}
                      className={`font-medium transition-colors ${loginIdType === 'email' ? 'text-[#312DC4] underline underline-offset-2' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Use Email
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {loginIdType === 'id'
                    ? <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  }
                  <input
                    type={loginIdType === 'email' ? 'email' : 'text'}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder={loginIdType === 'id' ? 'Matric No. or Staff ID' : 'your@university.edu'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 border-gray-300 rounded accent-[#312DC4]" />
                  Remember me
                </label>
                <button className="text-sm text-[#312DC4] hover:underline">Forgot Password?</button>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-xs text-center text-gray-400 pb-1">Wireframe: select a role to sign in</p>
                <button
                  onClick={() => onLogin('student')}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]"
                >
                  Sign in as Student
                </button>
                <button
                  onClick={() => onLogin('lecturer')}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-[#312DC4] border border-[#C5C3EC] bg-[#EEEDFB] hover:bg-[#E3E2F7]"
                >
                  Sign in as Lecturer
                </button>
                <button
                  onClick={() => onLogin('admin')}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50"
                >
                  Sign in as Administrator
                </button>
              </div>
            </>
          ) : (
            /* ── REGISTRATION FORM ── */
            <>
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am registering as</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as RegisterRole)}
                    className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Primary identifier with toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{regIdLabel}</label>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setRegIdType('id')}
                      className={`font-medium transition-colors ${regIdType === 'id' ? 'text-[#312DC4] underline underline-offset-2' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {isStudent ? 'Matric No.' : 'Staff ID'}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setRegIdType('email')}
                      className={`font-medium transition-colors ${regIdType === 'email' ? 'text-[#312DC4] underline underline-offset-2' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {isStudent ? 'Student Email' : 'Staff Email'}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {regIdType === 'id'
                    ? <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  }
                  <input
                    type={regIdType === 'email' ? 'email' : 'text'}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder={regIdPlaceholder}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {isStudent
                    ? 'Use your matric number or university-issued student email.'
                    : 'Use your staff ID or institution staff email address.'}
                </p>
              </div>

              {/* Department — students and lecturers only */}
              {(registerRole === 'student' || registerRole === 'lecturer') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select className="block w-full pr-9 pl-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] appearance-none">
                      <option value="">Select department</option>
                      <option>Computer Science</option>
                      <option>Software Engineering</option>
                      <option>Information Technology</option>
                      <option>Electrical Engineering</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-xs text-center text-gray-400 pb-1">Wireframe: click below to complete registration</p>
                <button
                  onClick={() => onLogin(registerRole)}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0]"
                >
                  Register as {registerRole === 'admin' ? 'Administrator' : registerRole.charAt(0).toUpperCase() + registerRole.slice(1)}
                </button>
                <button
                  onClick={() => setMode('login')}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
