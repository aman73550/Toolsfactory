import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  startTime: string | null;
  endTime: string | null;
  whitelistedIPs: string[];
}

export default function AdminMaintenance() {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/maintenance/status', {
          credentials: 'include',
        });
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch maintenance status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const toggleMaintenance = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/admin/maintenance/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          enabled,
          message: status?.message || 'We will be back soon. Thank you for your patience.',
        }),
      });
      const data = await response.json();
      setStatus({ ...status, enabled: data.enabled } as any);
    } catch (error) {
      console.error('Failed to toggle maintenance:', error);
    }
  };

  const updateMessage = async (newMessage: string) => {
    if (!status) return;

    try {
      const updatedStatus = { ...status, message: newMessage };
      await fetch('/api/admin/maintenance/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          enabled: status.enabled,
          message: newMessage,
        }),
      });

      setStatus(updatedStatus);
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading maintenance settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Maintenance</h1>
        <p className="text-slate-600 mt-1">Global maintenance mode controls</p>
      </div>

      {status?.enabled && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Maintenance Mode is ON</h3>
            <p className="text-sm text-amber-800 mt-1">
              All users except whitelisted IPs will see the maintenance page.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div>
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={status?.enabled || false}
              onChange={(e) => toggleMaintenance(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600"
            />
            <span className="font-semibold text-slate-900">
              {status?.enabled ? 'Maintenance Mode: ON' : 'Maintenance Mode: OFF'}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Maintenance Message</label>
          <textarea
            value={status?.message || ''}
            onChange={(e) => updateMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 resize-none"
            disabled={!status?.enabled}
          />
          <p className="text-xs text-slate-500 mt-2">This message will be shown to users during maintenance.</p>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Admin IP Whitelist</h3>
          <p className="text-xs text-slate-600 mb-4">
            These IPs can access the site during maintenance
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="Your IP address"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
            <button
              onClick={() => {
                if (newIP && status) {
                  setStatus({
                    ...status,
                    whitelistedIPs: [...(status.whitelistedIPs || []), newIP],
                  });
                  setNewIP('');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {status?.whitelistedIPs?.map((ip) => (
              <div
                key={ip}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <span className="text-sm font-mono text-slate-700">{ip}</span>
                <button
                  onClick={() => {
                    setStatus({
                      ...status,
                      whitelistedIPs: status.whitelistedIPs.filter((w) => w !== ip),
                    });
                  }}
                  className="p-2 hover:bg-red-50 text-red-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
