import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';

interface RateLimitSettings {
  maxRequests: number;
  windowMs: number;
  whitelist: string[];
  rateLimitedIPs: Array<{ ip: string; attempts: number; lastAttempt: string }>;
}

export default function AdminSecurity() {
  const [settings, setSettings] = useState<RateLimitSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/security/rate-limit', {
          credentials: 'include',
        });
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch security settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const addIPToWhitelist = async () => {
    if (!newIP || !settings) return;

    try {
      const newWhitelist = [...settings.whitelist, newIP];
      await fetch('/api/admin/security/whitelist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ips: newWhitelist }),
      });

      setSettings({ ...settings, whitelist: newWhitelist });
      setNewIP('');
    } catch (error) {
      console.error('Failed to add IP:', error);
    }
  };

  const removeIPFromWhitelist = async (ip: string) => {
    if (!settings) return;

    try {
      const newWhitelist = settings.whitelist.filter((w) => w !== ip);
      await fetch('/api/admin/security/whitelist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ips: newWhitelist }),
      });

      setSettings({ ...settings, whitelist: newWhitelist });
    } catch (error) {
      console.error('Failed to remove IP:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading security settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Security</h1>
        <p className="text-slate-600 mt-1">Rate limiting and access control</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Rate Limiting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Requests</label>
              <input
                type="number"
                value={settings?.maxRequests || 0}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time Window (seconds)
              </label>
              <input
                type="number"
                value={(settings?.windowMs || 0) / 1000}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">IP Whitelist</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
            <button
              onClick={addIPToWhitelist}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {settings?.whitelist?.map((ip) => (
              <div
                key={ip}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <span className="text-sm font-mono text-slate-700">{ip}</span>
                <button
                  onClick={() => removeIPFromWhitelist(ip)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Rate Limited IPs</h2>
        <div className="space-y-3">
          {settings?.rateLimitedIPs?.map((item) => (
            <div key={item.ip} className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-mono text-red-900 font-semibold">{item.ip}</p>
                  <p className="text-sm text-red-700 mt-1">
                    {item.attempts} requests • Last: {new Date(item.lastAttempt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
