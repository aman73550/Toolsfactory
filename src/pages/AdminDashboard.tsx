import React, { useState, useEffect } from 'react';
import { Activity, Users, Zap, AlertCircle } from 'lucide-react';

interface DashboardStats {
  dailyActiveUsers: number;
  totalExecutions: number;
  errorRate: number;
  serverMetrics: {
    cpuUsage: number;
    ramUsage: number;
    apiResponseTime: number;
  };
  topTools: Array<{ name: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats', {
          credentials: 'include',
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Daily Active Users',
      value: stats?.dailyActiveUsers || 0,
      icon: Users,
      color: 'indigo',
    },
    {
      label: 'Total Executions',
      value: stats?.totalExecutions || 0,
      icon: Zap,
      color: 'emerald',
    },
    {
      label: 'Error Rate',
      value: `${stats?.errorRate || 0}%`,
      icon: AlertCircle,
      color: 'red',
    },
    {
      label: 'API Response',
      value: `${stats?.serverMetrics?.apiResponseTime || 0}ms`,
      icon: Activity,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Real-time platform analytics and system health</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">{metric.label}</h3>
                <Icon className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Top Tools */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Tools</h2>
        <div className="space-y-3">
          {stats?.topTools?.map((tool, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-900">{tool.name}</span>
              <span className="text-sm text-slate-600">{tool.count.toLocaleString()} uses</span>
            </div>
          ))}
        </div>
      </div>

      {/* Server Health */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Server Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'CPU Usage', value: stats?.serverMetrics?.cpuUsage || 0, unit: '%' },
            { label: 'RAM Usage', value: stats?.serverMetrics?.ramUsage || 0, unit: '%' },
            { label: 'API Response', value: stats?.serverMetrics?.apiResponseTime || 0, unit: 'ms' },
          ].map((metric) => (
            <div key={metric.label}>
              <p className="text-sm text-slate-600 mb-2">{metric.label}</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {metric.value}{metric.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
