import React, { useState } from 'react';
import { BookOpen, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, type Role } from '../data/seed';
import { PasswordInput } from './PasswordInput';

interface LoginProps {
  onLoginSuccess: (role: Role) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      const account = MOCK_USERS[email.trim().toLowerCase()];
      toast.success('Login successful');
      onLoginSuccess(account.role);
    } else {
      toast.error(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
        <div className="flex flex-col items-center pt-6 sm:pt-8 pb-5 sm:pb-6 px-6 sm:px-8 border-b border-gray-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#EEEDFB] rounded-full flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#312DC4]" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">University Project Portal</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center">Final Year Project Allocation & Supervision</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Username / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
                placeholder="your@university.edu"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <PasswordInput id="password" value={password} onChange={setPassword} required />
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm text-[#312DC4] hover:underline" onClick={() => toast.info('Password reset link sent to your email')}>
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-[#312DC4] hover:bg-[#2724b0] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-xs text-center text-gray-400 pt-2">
            Demo: student@uni.edu / lecturer@uni.edu / admin@uni.edu — password
          </p>
        </form>
      </div>
    </div>
  );
}
