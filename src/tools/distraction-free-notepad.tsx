import React, { useEffect, useMemo, useState } from 'react';
import { Maximize2, Minimize2, Save } from 'lucide-react';

const STORAGE_KEY = 'typing-distraction-free-notepad';

export default function DistractionFreeNotepad() {
  const [value, setValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setValue(saved);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value);
      setSavedAt(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()));
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [value]);

  const wordCount = useMemo(() => value.trim().split(/\s+/).filter(Boolean).length, [value]);
  const charCount = value.length;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'mx-auto max-w-5xl'}`}>
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Distraction-Free Notepad</h2>
          <button onClick={() => setIsFullscreen((prev) => !prev)} className="rounded-lg border border-slate-300 p-2 text-slate-700">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="font-semibold text-indigo-600">Words: {wordCount}</span>
          <span className="font-semibold text-slate-700">Characters: {charCount}</span>
          <span className="flex items-center gap-1 text-slate-500"><Save className="h-4 w-4" /> Auto-saved {savedAt || 'just now'}</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[60vh] w-full rounded-2xl border border-slate-300 p-4 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 typing-mono"
          placeholder="Start writing here... your notes are auto-saved in this browser."
        />
      </div>
    </div>
  );
}
