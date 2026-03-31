import React, { useState, useEffect } from 'react';
import { BarChart3, Settings, Lock, AlertCircle, Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

/**
 * 👑 MASTER ADMIN DASHBOARD
 * Manages 100+ tools with Security, SEO, Analytics, & Maintenance from ONE screen
 */

interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  status: 'active' | 'inactive' | 'maintenance';
  views: number;
  lastUpdated: string;
}

interface AdminStats {
  totalTools: number;
  activeUsers: number;
  totalViews?: number;
  rateLimitedIPs: number;
  maintenanceMode: boolean;
}

export function MasterAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'seo' | 'security' | 'maintenance'>('overview');
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchTools();
    fetchStats();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/tools');
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tools', label: 'Tools Management', icon: Settings },
    { id: 'seo', label: 'SEO Manager', icon: Search },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'maintenance', label: 'Maintenance', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--accent)]">👑 Master Admin</h1>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm">
              <p className="text-[var(--text-secondary)]">Tools</p>
              <p className="text-xl font-bold">{stats?.totalTools || 0}</p>
            </div>
            <div className="w-px h-8 bg-[var(--border-primary)]" />
            <div className="text-sm">
              <p className="text-[var(--text-secondary)]">Active Users</p>
              <p className="text-xl font-bold">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative w-64 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)]
            transition-transform duration-300 z-20
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-[var(--accent)] text-white rounded-lg"
        >
          {isMobileMenuOpen ? <X /> : <Settings />}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} tools={tools} />
            )}

            {/* TOOLS MANAGEMENT TAB */}
            {activeTab === 'tools' && (
              <ToolsManagementTab
                tools={filteredTools}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                editingTool={editingTool}
                setEditingTool={setEditingTool}
                onSave={fetchTools}
              />
            )}

            {/* SEO MANAGER TAB */}
            {activeTab === 'seo' && (
              <SEOManagerTab tools={filteredTools} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <SecurityTab stats={stats} />
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === 'maintenance' && (
              <MaintenanceTab
                maintenanceMode={maintenanceMode}
                setMaintenanceMode={setMaintenanceMode}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

// ============================================
// TAB COMPONENTS
// ============================================

function OverviewTab({ stats, tools }: { stats: AdminStats | null; tools: Tool[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Tools"
          value={stats?.totalTools || 0}
          icon="⚙️"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon="👥"
        />
        <StatCard
          title="Total Views"
          value={(stats?.totalViews || 0).toLocaleString()}
          icon="👀"
        />
        <StatCard
          title="Rate Limited IPs"
          value={stats?.rateLimitedIPs || 0}
          icon="🚫"
        />
      </div>

      {/* Recent Tools */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6">
        <h3 className="font-bold mb-4">Recently Updated Tools</h3>
        <div className="space-y-3">
          {tools.slice(0, 5).map(tool => (
            <div key={tool.id} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded">
              <div>
                <p className="font-medium">{tool.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{tool.category}</p>
              </div>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${tool.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
              `}>
                {tool.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Status */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6">
        <h3 className="font-bold mb-4">System Health</h3>
        <div className="space-y-3">
          <HealthItem label="Server Status" status="healthy" />
          <HealthItem label="Database" status="healthy" />
          <HealthItem label="API Response Time" status="healthy" />
          <HealthItem label="Storage Usage" status="warning" />
        </div>
      </div>
    </div>
  );
}

function ToolsManagementTab({
  tools,
  searchQuery,
  setSearchQuery,
  editingTool,
  setEditingTool,
  onSave,
}: {
  tools: Tool[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  editingTool: Tool | null;
  setEditingTool: (tool: Tool | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Tools Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)]">
          <Plus size={20} /> Add New Tool
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-lg focus:border-[var(--accent)] outline-none"
        />
      </div>

      {/* Tools Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Tool Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Views</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {tools.map(tool => (
              <tr key={tool.id} className="hover:bg-[var(--bg-tertiary)]">
                <td className="px-4 py-3">{tool.name}</td>
                <td className="px-4 py-3 font-mono text-sm">{tool.slug}</td>
                <td className="px-4 py-3">{tool.category}</td>
                <td className="px-4 py-3">
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${tool.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  `}>
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3">{tool.views.toLocaleString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="p-1 hover:bg-[var(--bg-tertiary)] rounded" onClick={() => setEditingTool(tool)}>
                    <Edit2 size={16} className="text-[var(--accent)]" />
                  </button>
                  <button className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingTool && (
        <ToolEditModal tool={editingTool} onClose={() => setEditingTool(null)} onSave={onSave} />
      )}
    </div>
  );
}

function SEOManagerTab({
  tools,
  searchQuery,
  setSearchQuery,
}: {
  tools: Tool[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">SEO Manager</h2>
        <p className="text-[var(--text-secondary)]">Manage SEO metadata for all tools</p>
      </div>

      {/* Bulk Actions */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4 space-y-3">
        <h3 className="font-bold">Bulk Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] text-sm">
            ↺ Update All Meta Tags
          </button>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] text-sm">
            🔍 Generate Missing FAQs
          </button>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] text-sm">
            📊 Regenerate OG Images
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-lg"
        />
      </div>

      {/* SEO Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
            <tr>
              <th className="px-4 py-3 text-left">Tool</th>
              <th className="px-4 py-3 text-left">SEO Title</th>
              <th className="px-4 py-3 text-left">Meta Description</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {tools.map(tool => (
              <tr key={tool.id} className="hover:bg-[var(--bg-tertiary)]">
                <td className="px-4 py-3 font-medium">{tool.name}</td>
                <td className="px-4 py-3 truncate text-xs">{tool.seoTitle}</td>
                <td className="px-4 py-3 truncate text-xs">{tool.seoDescription}</td>
                <td className="px-4 py-3">
                  <button className="text-[var(--accent)] hover:underline text-xs">Edit SEO</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityTab({ stats }: { stats: AdminStats | null }) {
  const [ipWhitelist, setIpWhitelist] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Security Settings</h2>

      {/* Rate Limiting */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6 space-y-4">
        <h3 className="font-bold">Rate Limiting</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Max Requests Per IP</label>
            <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Window (seconds)</label>
            <input type="number" defaultValue="60" className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg" />
          </div>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Save Rate Limit Settings</button>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6 space-y-4">
        <h3 className="font-bold">IP Whitelist (Rate limit bypass)</h3>
        <textarea
          value={ipWhitelist}
          onChange={e => setIpWhitelist(e.target.value)}
          placeholder="192.168.1.1&#10;10.0.0.1"
          rows={4}
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg font-mono text-sm"
        />
        <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Save Whitelist</button>
      </div>

      {/* Rate Limited IPs */}
      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6">
        <h3 className="font-bold mb-4">Currently Rate Limited ({stats?.rateLimitedIPs || 0})</h3>
        <p className="text-sm text-[var(--text-secondary)]">IPs automatically unblock after 1 hour of inactivity</p>
      </div>
    </div>
  );
}

function MaintenanceTab({
  maintenanceMode,
  setMaintenanceMode,
}: {
  maintenanceMode: boolean;
  setMaintenanceMode: (v: boolean) => void;
}) {
  const [maintenanceMsg, setMaintenanceMsg] = useState('Scheduled maintenance. We\'ll be back soon!');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Maintenance Mode</h2>

      <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Enable Maintenance Mode</h3>
            <p className="text-sm text-[var(--text-secondary)]">Website will show maintenance page to all users</p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              maintenanceMode
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            {maintenanceMode ? 'Disable' : 'Enable'}
          </button>
        </div>

        {maintenanceMode && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Maintenance Message</label>
              <textarea
                value={maintenanceMsg}
                onChange={e => setMaintenanceMsg(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Update Message</button>
          </>
        )}
      </div>

      {maintenanceMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Maintenance mode is currently <strong>ACTIVE</strong>. All users will see the maintenance page.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function HealthItem({ label, status }: { label: string; status: 'healthy' | 'warning' | 'error' }) {
  const colors = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };
  const symbols = { healthy: '✓', warning: '⚠', error: '✕' };

  return (
    <div className="flex items-center justify-between p-2 bg-[var(--bg-primary)] rounded">
      <p className="text-sm">{label}</p>
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
        {symbols[status]} {status}
      </span>
    </div>
  );
}

interface ToolEditModalProps {
  tool: Tool;
  onClose: () => void;
  onSave: () => void;
}

function ToolEditModal({ tool, onClose, onSave }: ToolEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Edit Tool: {tool.name}</h3>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <X />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tool Name</label>
              <input type="text" defaultValue={tool.name} className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input type="text" defaultValue={tool.seoTitle} className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SEO Description</label>
              <textarea defaultValue={tool.seoDescription} rows={2} className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg" />
            </div>

            <div className="flex gap-3 pt-4">
              <button className="flex-1 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
