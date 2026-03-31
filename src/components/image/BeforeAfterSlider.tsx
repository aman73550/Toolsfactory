import React, { useState } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, alt = 'preview' }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <img src={beforeSrc} alt={`${alt}-before`} className="block h-auto w-full" />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={afterSrc} alt={`${alt}-after`} className="block h-full w-full max-w-none object-cover" style={{ width: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="h-full w-[2px] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.2)]" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute bottom-3 left-1/2 w-[80%] -translate-x-1/2 accent-indigo-600"
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700">Before</div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700">After</div>
    </div>
  );
}
