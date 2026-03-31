import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { applyBasicAdjustments, canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

export default function BrightnessContrast() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const render = async (source = src, b = brightness, c = contrast) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = applyBasicAdjustments(img, { brightness: b, contrast: c });
    setOut(canvasToDataUrl(canvas));
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    await render(data, brightness, contrast);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Brightness & Contrast</h2>
        <p className="mt-2 text-slate-600">Tune exposure and tonal depth in real-time with a comparison slider.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <input type="range" min={0} max={200} value={brightness} onChange={(e) => { const v = Number(e.target.value); setBrightness(v); render(src, v, contrast); }} />
          <input type="range" min={0} max={200} value={contrast} onChange={(e) => { const v = Number(e.target.value); setContrast(v); render(src, brightness, v); }} />
          <button onClick={() => downloadDataUrl(out, 'brightness-contrast.png')} disabled={!out} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Download</button>
        </div>
        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="brightness-contrast" /></div>}
      </div>
    </div>
  );
}
