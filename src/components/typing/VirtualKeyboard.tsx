import React from 'react';

const rows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['Space']
];

export default function VirtualKeyboard({ pressed }: { pressed: string | null }) {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {rows.map((row, idx) => (
        <div key={idx} className="flex flex-wrap justify-center gap-2">
          {row.map((key) => {
            const isPressed = pressed && (pressed.toUpperCase() === key || (pressed === ' ' && key === 'Space'));
            return (
              <span
                key={key}
                className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-semibold ${isPressed ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
              >
                {key}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
