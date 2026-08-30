import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Bell,
  Search,
  LogOut,
  User,
  BookOpen,
  LayoutDashboard,
  FileText,
  List,
  Calendar,
  Users,
  BarChart,
  CheckSquare,
  ClipboardList,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../data/seed';

interface LayoutProps {
  role: Role;
  children: React.ReactNode;
}

const NAV_CONFIG: Record<Role, { path: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  student: [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/topics', label: 'Project Topics', icon: List },
    { path: '/student/submissions', label: 'Submissions', icon: FileText },
    { path: '/student/progress', label: 'Progress Tracking', icon: BarChart },
    { path: '/student/meetings', label: 'Meetings', icon: Calendar },
  ],
  lecturer: [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/lecturer/upload', label: 'Upload Topics', icon: FileText },
    { path: '/lecturer/students', label: 'My Students', icon: Users },
    { path: '/lecturer/workload', label: 'Workload Tracking', icon: BarChart },
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/approval', label: 'Topic Approval', icon: CheckSquare },
    { path: '/admin/allocation', label: 'Allocate Supervisors', icon: Users },
    { path: '/admin/reports', label: 'Reports', icon: ClipboardList },
  ],
};

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV_CONFIG[role];

  return (
    <nav className="p-4 space-y-1">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onNavigate?.();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#EEEDFB] text-[#312DC4] border-l-4 border-[#312DC4]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function Layout({ role, children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-[#EEEDFB] rounded-md flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#312DC4]" />
                </div>
                <span className="font-semibold text-gray-800">UniManage Portal</span>
              </div>
              <NavLinks role={role} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="w-8 h-8 bg-[#EEEDFB] rounded-md flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#312DC4]" />
          </div>
          <span className="font-semibold text-lg text-gray-800 hidden sm:block">UniManage Portal</span>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 border-none rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#312DC4]/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#312DC4] rounded-full" />
          </button>
          <div className="flex items-center gap-2 border-l border-gray-200 pl-2 sm:pl-4">
            <div className="w-8 h-8 bg-[#EEEDFB] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-[#312DC4]" />
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-700">{user?.name ?? `${role} User`}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block overflow-y-auto shrink-0">
          <NavLinks role={role} />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mx-2 text-gray-400">/</span>}
          {item.href ? (
            <button onClick={() => navigate(item.href!)} className="hover:underline hover:text-gray-700">
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
