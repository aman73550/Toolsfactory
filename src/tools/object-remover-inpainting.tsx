import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

interface Dot { x: number; y: number; r: number }

export default function ObjectRemoverInpainting() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [brush, setBrush] = useState(24);
  const [dots, setDots] = useState<Dot[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    setOut(data);
    setDots([]);
  };

  const render = async (source = src, mask = dots) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    for (const dot of mask) {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;
      const r = dot.r;
      const size = Math.max(8, Math.floor(r * 2));

      const temp = document.createElement('canvas');
      temp.width = size;
      temp.height = size;
      const tctx = temp.getContext('2d');
      if (!tctx) continue;
      tctx.drawImage(canvas, x - size / 2, y - size / 2, size, size, 0, 0, size, size);

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.filter = 'blur(10px)';
      ctx.drawImage(temp, x - size / 2, y - size / 2, size, size);
      ctx.restore();
    }

    setOut(canvasToDataUrl(canvas));
  };

  const pushDot = (clientX: number, clientY: number) => {
    const el = boxRef.current;
    if (!el || !src) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || y < 0 || x > 1 || y > 1) return;

    setDots((prev) => {
      const next = [...prev, { x, y, r: brush }];
      render(src, next);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Object Remover (Inpainting)</h2>
        <p className="mt-2 text-slate-600">Paint over unwanted areas to apply soft inpainting-style cleanup preview.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <input type="range" min={6} max={80} value={brush} onChange={(e) => setBrush(Number(e.target.value))} />
          <button onClick={() => { setDots([]); setOut(src); }} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700">Reset Mask</button>
          <button onClick={() => downloadDataUrl(out, 'object-removed.png')} disabled={!out} className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Download</button>
        </div>

        {src && (
          <div
            ref={boxRef}
            className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200"
            onPointerDown={(e) => { drawing.current = true; pushDot(e.clientX, e.clientY); }}
            onPointerMove={(e) => { if (drawing.current) pushDot(e.clientX, e.clientY); }}
            onPointerUp={() => { drawing.current = false; }}
            onPointerLeave={() => { drawing.current = false; }}
          >
            <img src={out || src} alt="object-remove-editor" className="w-full" />
          </div>
        )}

        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="inpainting" /></div>}
      </div>
    </div>
  );
}
