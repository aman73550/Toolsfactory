import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

export default function RoundCornersBorders() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [radius, setRadius] = useState(24);
  const [borderWidth, setBorderWidth] = useState(8);
  const [borderColor, setBorderColor] = useState('#4F46E5');

  const render = async (source = src) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = Math.min(radius, canvas.width / 2, canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0);

    if (borderWidth > 0) {
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }

    setOut(canvasToDataUrl(canvas));
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    await render(data);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Round Corners & Borders</h2>
        <p className="mt-2 text-slate-600">Add professional corner radius and custom borders with live preview.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <input type="range" min={0} max={160} value={radius} onChange={(e) => { setRadius(Number(e.target.value)); render(src); }} />
          <input type="range" min={0} max={40} value={borderWidth} onChange={(e) => { setBorderWidth(Number(e.target.value)); render(src); }} />
          <input type="color" value={borderColor} onChange={(e) => { setBorderColor(e.target.value); render(src); }} className="h-11 rounded-xl border border-slate-300" />
          <button onClick={() => downloadDataUrl(out, 'rounded-border.png')} disabled={!out} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Download</button>
        </div>

        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="round-border" /></div>}
      </div>
    </div>
  );
}
