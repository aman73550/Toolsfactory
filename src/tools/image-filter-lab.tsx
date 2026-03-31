import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { applyBasicAdjustments, canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

const FILTERS = {
  grayscale: { grayscale: 100 },
  sepia: { sepia: 85 },
  blur: { blur: 2 },
  sharpen: { contrast: 125, saturate: 110 },
  vintage: { sepia: 45, saturate: 70, contrast: 115, hue: -10 },
  dramatic: { contrast: 155, brightness: 95, saturate: 130 }
} as const;

type FilterKey = keyof typeof FILTERS;

export default function ImageFilterLab() {
  const [original, setOriginal] = useState('');
  const [filtered, setFiltered] = useState('');
  const [active, setActive] = useState<FilterKey>('vintage');

  const applyFilter = async (key: FilterKey, src = original) => {
    if (!src) return;
    const img = await loadImage(src);
    const canvas = applyBasicAdjustments(img, FILTERS[key]);
    const out = canvasToDataUrl(canvas);
    setFiltered(out);
    setActive(key);
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const src = await readImageFile(file);
    setOriginal(src);
    await applyFilter(active, src);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Image Filter Lab</h2>
        <p className="mt-2 text-slate-600">Apply handcrafted filter presets with before/after comparison slider.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <button key={key} onClick={() => applyFilter(key)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${active === key ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-700'}`}>
              {key}
            </button>
          ))}
          <button onClick={() => downloadDataUrl(filtered, `filter-${active}.png`)} disabled={!filtered} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
            <Download className="mr-1 inline h-4 w-4" /> Download
          </button>
        </div>

        {original && filtered && <div className="mt-5"><BeforeAfterSlider beforeSrc={original} afterSrc={filtered} alt="filter-lab" /></div>}
      </div>
    </div>
  );
}
