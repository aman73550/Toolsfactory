import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  changedBy?: string;
  details: string;
  ip?: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/admin/audit-logs', {
          credentials: 'include',
        });
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.action.toLowerCase().includes(filter.toLowerCase()));

  const downloadLogs = () => {
    const csv = [
      ['ID', 'Action', 'Timestamp', 'Changed By', 'Details'].join(','),
      ...logs.map((l) =>
        [l.id, l.action, l.timestamp, l.changedBy || 'System', l.details].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-slate-600">Loading logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Activity Logs</h1>
          <p className="text-slate-600 mt-1">Audit trail of all admin actions</p>
        </div>
        <button
          onClick={downloadLogs}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action..."
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900 flex-1"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold text-slate-900 bg-slate-100 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.changedBy || 'System'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-slate-600">
            <p>No logs found</p>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-500">
        Showing {filteredLogs.length} of {logs.length} entries
      </div>
    </div>
  );
}
