import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

type Mode = 'sketch' | 'cartoon';

export default function PhotoToSketchCartoon() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [mode, setMode] = useState<Mode>('sketch');

  const transform = async (source = src, selected = mode) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.3 * r + 0.59 * g + 0.11 * b;

      if (selected === 'sketch') {
        const edge = Math.max(0, Math.min(255, 255 - Math.abs(r - g) * 2 - Math.abs(g - b) * 2));
        data[i] = edge;
        data[i + 1] = edge;
        data[i + 2] = edge;
      } else {
        const quant = (v: number) => Math.round(v / 32) * 32;
        data[i] = quant(Math.max(gray, r));
        data[i + 1] = quant(Math.max(gray * 0.95, g));
        data[i + 2] = quant(Math.max(gray * 0.9, b));
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setOut(canvasToDataUrl(canvas));
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    await transform(data, mode);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Photo to Sketch/Cartoon</h2>
        <p className="mt-2 text-slate-600">Turn photos into artistic styles with instant before/after comparison.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <button onClick={() => { setMode('sketch'); transform(src, 'sketch'); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'sketch' ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-700'}`}>Sketch</button>
          <button onClick={() => { setMode('cartoon'); transform(src, 'cartoon'); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'cartoon' ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-700'}`}>Cartoon</button>
          <button onClick={() => downloadDataUrl(out, `style-${mode}.png`)} disabled={!out} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><Download className="mr-1 inline h-4 w-4" />Download</button>
        </div>

        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="style" /></div>}
      </div>
    </div>
  );
}
