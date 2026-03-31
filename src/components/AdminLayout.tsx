import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, LogOut, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expiryTime, setExpiryTime] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          navigate('/admin-dashboard-access/login');
        }
      } catch {
        navigate('/admin-dashboard-access/login');
      }
    };

    verifySession();
  }, [navigate]);

  // Show session expiry warning (update every minute)
  useEffect(() => {
    const updateExpiryTime = () => {
      const tokenExpiry = localStorage.getItem('admin_token_expiry');
      if (tokenExpiry) {
        const expiryDate = new Date(parseInt(tokenExpiry));
        const now = new Date();
        const diffMs = expiryDate.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setExpiryTime(`${hours}h ${mins}m`);
      }
    };

    updateExpiryTime();
    const interval = setInterval(updateExpiryTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('admin_token_expiry');
      navigate('/admin-dashboard-access/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin-dashboard-access/dashboard', icon: '📊' },
    { label: 'Tools', path: '/admin-dashboard-access/tools', icon: '🛠️' },
    { label: 'Analytics', path: '/admin-dashboard-access/analytics', icon: '📈' },
    { label: 'Content', path: '/admin-dashboard-access/content-editor', icon: '✏️' },
    { label: 'Security', path: '/admin-dashboard-access/security', icon: '🔒' },
    { label: 'Maintenance', path: '/admin-dashboard-access/maintenance', icon: '⚙️' },
    { label: 'Logs', path: '/admin-dashboard-access/logs', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 md:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <h1 className="text-lg font-semibold text-slate-900">👑 Admin</h1>
            <p className="text-xs text-slate-500 mt-1">Command Center</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-auto">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Session Info & Logout */}
          <div className="border-t border-slate-200 p-4 space-y-3">
            {expiryTime && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700">Session expires in {expiryTime}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="text-right">
            <p className="text-sm text-slate-600">Toolsfactory Admin</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
