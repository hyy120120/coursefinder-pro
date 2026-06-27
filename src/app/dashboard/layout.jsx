'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, CheckSquare, BarChart3, LogOut, Menu, X, Zap, Workflow, DollarSign, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/dashboard/students', icon: Users },
  { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Applications', href: '/dashboard/applications', icon: CheckSquare },
  { label: 'AI Tools', href: '/dashboard/ai-tools', icon: Zap },
  { label: 'Pipeline', href: '/dashboard/pipeline', icon: Workflow },
  { label: 'Commissions', href: '/dashboard/commissions', icon: DollarSign },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      toast.success('Logged out');
      router.push('/auth/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4" />
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 fixed h-screen md:relative z-40`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          {sidebarOpen && <h1 className="font-bold text-lg text-brand-600">CourseFinder</h1>}
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} className="btn-ghost">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-brand-600 hover:text-brand-600"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-ghost md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{profile?.displayName}</p>
              <p className="text-xs text-slate-500">{profile?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
              {profile?.displayName?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
