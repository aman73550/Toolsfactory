import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface Analytics {
  toolId: string;
  views: number;
  users: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversions: number;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics/overview', {
          credentials: 'include',
        });
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-slate-600">Loading analytics...</div>;
  }

  const metrics = [
    { label: 'Total Views', value: analytics?.views || 0, icon: BarChart3 },
    { label: 'Unique Users', value: analytics?.users || 0, icon: TrendingUp },
    { label: 'Avg. Session Duration', value: `${analytics?.avgSessionDuration || 0}s`, icon: BarChart3 },
    { label: 'Bounce Rate', value: `${analytics?.bounceRate || 0}%`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">Platform usage and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">{metric.label}</h3>
                <Icon className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics Dashboard</h2>
        <p className="text-slate-600 text-center py-8">Chart visualizations coming soon</p>
      </div>
    </div>
  );
}
