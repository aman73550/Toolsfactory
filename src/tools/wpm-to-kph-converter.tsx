import React, { useMemo, useState } from 'react';

export default function WpmToKphConverter() {
  const [wpm, setWpm] = useState('40');
  const [charsPerWord, setCharsPerWord] = useState('5');

  const result = useMemo(() => {
    const w = Number(wpm) || 0;
    const c = Number(charsPerWord) || 5;
    const kph = w * c * 60;
    const kpm = w * c;
    return { kph, kpm };
  }, [wpm, charsPerWord]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">WPM to KPH Converter</h2>
        <p className="mt-2 text-slate-600">Convert Words Per Minute into Keystrokes Per Minute and Per Hour.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input value={wpm} onChange={(e) => setWpm(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="WPM" />
          <input value={charsPerWord} onChange={(e) => setCharsPerWord(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Average chars per word" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-indigo-50 p-4">
            <p className="text-sm text-slate-500">Keystrokes per Minute</p>
            <p className="text-2xl font-bold text-indigo-600">{Math.round(result.kpm)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
            <p className="text-sm text-slate-500">Keystrokes per Hour</p>
            <p className="text-2xl font-bold text-emerald-600">{Math.round(result.kph)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
