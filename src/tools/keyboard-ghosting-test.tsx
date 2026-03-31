import React, { useEffect, useState } from 'react';

export default function KeyboardGhostingTest() {
  const [pressed, setPressed] = useState<string[]>([]);
  const [maxKeys, setMaxKeys] = useState(0);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      setPressed((prev) => {
        const next = prev.includes(key) ? prev : [...prev, key];
        if (next.length > maxKeys) setMaxKeys(next.length);
        return next;
      });
    };

    const upHandler = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      setPressed((prev) => prev.filter((item) => item !== key));
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [maxKeys]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Keyboard Ghosting Test</h2>
        <p className="mt-2 text-slate-600">Press multiple keys together and verify how many are registered by your keyboard at once.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Currently Pressed</p>
            <p className="text-3xl font-bold text-indigo-600">{pressed.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Peak Simultaneous Keys</p>
            <p className="text-3xl font-bold text-emerald-600">{maxKeys}</p>
          </div>
        </div>

        <div className="mt-4 flex min-h-[100px] flex-wrap gap-2 rounded-xl border border-slate-200 p-3">
          {pressed.length === 0 && <span className="text-sm text-slate-500">Press keys to start the ghosting test.</span>}
          {pressed.map((key) => (
            <span key={key} className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">{key}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
