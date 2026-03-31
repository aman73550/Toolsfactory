import React, { useMemo, useState } from 'react';

interface Pair {
  shortcut: string;
  expanded: string;
}

export default function TextExpanderGenerator() {
  const [pairs, setPairs] = useState<Pair[]>([
    { shortcut: ';gm', expanded: 'Good morning' },
    { shortcut: ';ty', expanded: 'Thank you for your message.' }
  ]);

  const generatedCode = useMemo(() => {
    const mapBody = pairs
      .filter((item) => item.shortcut && item.expanded)
      .map((item) => `  "${item.shortcut}": "${item.expanded.replace(/"/g, '\\"')}"`)
      .join(',\n');

    return `const shortcuts = {\n${mapBody}\n};\n\nexport function expandInput(input) {\n  return input.split(/\\s+/).map((token) => shortcuts[token] || token).join(' ');\n}`;
  }, [pairs]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Text Expander Generator</h2>
        <p className="mt-2 text-slate-600">Generate shortcut-expansion logic such as ;gm to Good Morning.</p>

        <div className="mt-5 space-y-3">
          {pairs.map((pair, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input
                value={pair.shortcut}
                onChange={(e) => {
                  const next = [...pairs];
                  next[index] = { ...next[index], shortcut: e.target.value };
                  setPairs(next);
                }}
                className="h-11 rounded-xl border border-slate-300 px-3"
                placeholder="Shortcut"
              />
              <input
                value={pair.expanded}
                onChange={(e) => {
                  const next = [...pairs];
                  next[index] = { ...next[index], expanded: e.target.value };
                  setPairs(next);
                }}
                className="h-11 rounded-xl border border-slate-300 px-3"
                placeholder="Expanded text"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setPairs((prev) => [...prev, { shortcut: '', expanded: '' }])}
          className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Add Shortcut
        </button>

        <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100 typing-mono">{generatedCode}</pre>
      </div>
    </div>
  );
}
