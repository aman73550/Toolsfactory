import React, { useState } from 'react';
import { Download, FlipHorizontal, FlipVertical, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

export default function ImageFlipMirror() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const render = async (source = src, fx = flipX, fy = flipY) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    setOut(canvasToDataUrl(canvas));
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    await render(data, flipX, flipY);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Image Flip & Mirror</h2>
        <p className="mt-2 text-slate-600">Flip horizontally or vertically with real-time comparison.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <button onClick={() => { const v = !flipX; setFlipX(v); render(src, v, flipY); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><FlipHorizontal className="mr-1 inline h-4 w-4" />Horizontal</button>
          <button onClick={() => { const v = !flipY; setFlipY(v); render(src, flipX, v); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><FlipVertical className="mr-1 inline h-4 w-4" />Vertical</button>
          <button onClick={() => downloadDataUrl(out, 'flip-mirror.png')} disabled={!out} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><Download className="mr-1 inline h-4 w-4" />Download</button>
        </div>
        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="flip" /></div>}
      </div>
    </div>
  );
}
