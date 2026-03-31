import React, { useState, useEffect } from 'react';
import { Plus, Mail, Trash2, Eye, EyeOff } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'maintenance';
  views: number;
  lastUpdated: string;
}

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/admin/tools', {
          credentials: 'include',
        });
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const toggleToolStatus = async (toolId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      setTools(tools.map((t) =>
        t.id === toolId ? { ...t, status: newStatus as any } : t
      ));
    } catch (error) {
      console.error('Failed to update tool:', error);
    }
  };

  const deleteTool = async (toolId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      await fetch(`/api/admin/tools/${toolId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setTools(tools.filter((t) => t.id !== toolId));
    } catch (error) {
      console.error('Failed to delete tool:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Tools</h1>
          <p className="text-slate-600 mt-1">Manage all available tools on the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tool</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Views</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Last Updated</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{tool.name}</p>
                      <p className="text-sm text-slate-500">{tool.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={tool.status}
                      onChange={(e) => toggleToolStatus(tool.id, e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 text-sm text-slate-900"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tool.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tool.lastUpdated}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-600 transition-all"
                      title="Delete tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
