import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Search,
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
import { NotificationPanel } from './NotificationPanel';
import { ProfileMenu } from './ProfileMenu';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../data/seed';
import { toast } from 'sonner';

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

function NavLinks({ role, onNavigate, compact }: { role: Role; onNavigate?: () => void; compact?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV_CONFIG[role];

  return (
    <nav className={compact ? 'p-3 space-y-0.5' : 'p-4 space-y-1'}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onNavigate?.();
            }}
            className={`w-full flex items-center gap-3 rounded-md text-left text-sm font-medium transition-colors ${
              compact ? 'px-3 py-2.5' : 'px-4 py-3'
            } ${
              isActive
                ? 'bg-[#EEEDFB] text-[#312DC4] border-l-4 border-[#312DC4]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function Layout({ role, children }: LayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const match = NAV_CONFIG[role].find((item) => item.label.toLowerCase().includes(q));
    if (match) {
      navigate(match.path);
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      toast.info('No matching page found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md shrink-0" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(280px,85vw)] p-0">
              <div className="flex items-center gap-2.5 p-3 border-b border-gray-200">
                <div className="w-7 h-7 bg-[#EEEDFB] rounded-md flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#312DC4]" />
                </div>
                <span className="font-semibold text-sm text-gray-800">UniManage Portal</span>
              </div>
              <NavLinks role={role} onNavigate={() => setMobileOpen(false)} compact />
            </SheetContent>
          </Sheet>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#EEEDFB] rounded-md flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#312DC4]" />
          </div>
          <span className="font-semibold text-base sm:text-lg text-gray-800 hidden sm:block truncate">UniManage Portal</span>
        </div>

        <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-gray-100 border-none rounded-md py-1.5 lg:py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#312DC4]/30"
            />
          </form>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            aria-label="Search"
            onClick={() => setSearchOpen((o) => !o)}
          >
            <Search className="w-5 h-5" />
          </button>
          <NotificationPanel />
          <ProfileMenu role={role} onLogout={handleLogout} />
        </div>
      </header>

      {searchOpen && (
        <div className="md:hidden px-3 py-2 bg-white border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#312DC4]/30"
            />
          </form>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 lg:w-64 bg-white border-r border-gray-200 hidden lg:block overflow-y-auto shrink-0">
          <NavLinks role={role} />
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3 flex-wrap gap-y-1">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>}
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
