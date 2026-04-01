import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Settings, Zap, Users, Activity } from 'lucide-react';
import { ToolMaker } from './ToolMaker';

interface AdminStats {
  activeUsers: number;
  cpuUsage: number;
  rateLimitedIPs: number;
  uptime: number;
  totalRequests: number;
  apiRequests: number;
}

/**
 * Responsive Admin Dashboard
 * Mobile: Hamburger menu, full-width content
 * Desktop: Fixed sidebar, main content area
 */
export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'tools' | 'monitoring' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
      if (!newIsDesktop) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tools', label: 'Tool Maker', icon: Settings },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-60' : 'w-0'}
          bg-white border-r border-slate-200
          transition-all duration-300
          fixed md:relative z-50 md:z-auto
          h-full overflow-hidden
        `}
      >
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Toolsfactory Admin</h1>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as any);
                if (!isDesktop) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors
                ${activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1 flex justify-center md:justify-start md:ml-0">
              <h2 className="text-lg font-semibold text-slate-900 capitalize">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'tools' && 'Tool Maker'}
                {activeSection === 'monitoring' && 'Monitoring'}
                {activeSection === 'settings' && 'Settings'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                {stats?.activeUsers || 0} <span className="text-xs text-slate-500">online</span>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Users Card */}
                <StatCard
                  title="Active Users"
                  value={stats?.activeUsers || 0}
                  icon={Users}
                  color="blue"
                />

                {/* CPU Usage Card */}
                <StatCard
                  title="CPU Usage"
                  value={`${stats?.cpuUsage || 0}%`}
                  icon={Zap}
                  color={stats && stats.cpuUsage < 70 ? 'green' : 'red'}
                />

                {/* Rate Limited IPs */}
                <StatCard
                  title="Rate Limited Today"
                  value={stats?.rateLimitedIPs || 0}
                  icon={Activity}
                  color="amber"
                />

                {/* Uptime */}
                <StatCard
                  title="30-Day Uptime"
                  value={`${stats?.uptime || 99}%`}
                  icon={BarChart3}
                  color="green"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">Server Statistics</h3>
                <div className="space-y-3">
                  <StatRow label="Total Requests" value={stats?.totalRequests || 0} />
                  <StatRow label="API Requests" value={stats?.apiRequests || 0} />
                  <StatRow label="Server Health" value="Healthy" color="green" />
                </div>
              </div>
            </div>
          )}

          {/* Tool Maker Section */}
          {activeSection === 'tools' && <ToolMaker />}

          {/* Monitoring Section */}
          {activeSection === 'monitoring' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">Live Monitor</h3>
                <p className="text-slate-600 mb-4">Real-time system monitoring coming soon...</p>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-900">CPU Usage</p>
                    <div className="mt-2 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${stats?.cpuUsage || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{stats?.cpuUsage || 0}%</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-900">Active Connections</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-2">{stats?.activeUsers || 0}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-900">Rate Limited IPs</p>
                    <p className="text-2xl font-bold text-amber-600 mt-2">{stats?.rateLimitedIPs || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ size: number }>;
  color?: 'blue' | 'green' | 'red' | 'amber';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        <Icon size={24} />
      </div>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

/**
 * Stat Row Component
 */
function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: 'green' | 'red' | 'amber';
}) {
  const colorClass = color ? `text-${color}-600 font-semibold` : '';

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
      <p className="text-slate-700">{label}</p>
      <p className={`${colorClass} text-slate-900 font-medium`}>{value}</p>
    </div>
  );
}
