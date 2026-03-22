import React, { useState, useEffect } from 'react';
import { Globe, Clock } from 'lucide-react';

const TIMEZONES = [
  { label: 'New York (EST)', tz: 'America/New_York' },
  { label: 'London (GMT)', tz: 'Europe/London' },
  { label: 'Paris (CET)', tz: 'Europe/Paris' },
  { label: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', tz: 'Australia/Sydney' },
  { label: 'Los Angeles (PST)', tz: 'America/Los_Angeles' },
  { label: 'Mumbai (IST)', tz: 'Asia/Kolkata' },
  { label: 'Singapore (SGT)', tz: 'Asia/Singapore' },
];

export default function WorldClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">World Clock</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Keep track of the exact time across major cities worldwide.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8">
        
        {/* Local Time Banner */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white text-center mb-8 shadow-md relative overflow-hidden">
          <Globe className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500 opacity-20" />
          <h2 className="text-indigo-200 font-medium uppercase tracking-widest mb-2 text-sm relative z-10">Your Local Time</h2>
          <div className="text-5xl md:text-7xl font-bold tracking-tight mb-2 relative z-10">
            {formatTime(time, Intl.DateTimeFormat().resolvedOptions().timeZone)}
          </div>
          <div className="text-indigo-100 text-lg relative z-10">
            {formatDate(time, Intl.DateTimeFormat().resolvedOptions().timeZone)}
          </div>
        </div>

        {/* World Clocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIMEZONES.map((zone) => (
            <div key={zone.tz} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
              <Clock className="w-6 h-6 text-slate-400 mb-4 group-hover:text-indigo-500 transition-colors" />
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{zone.label}</h3>
              <p className="text-3xl font-bold text-slate-900 my-3 font-mono tracking-tight">
                {formatTime(time, zone.tz)}
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {formatDate(time, zone.tz)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
