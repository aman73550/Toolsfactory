import React, { useMemo, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

export default function WatermarkAdderTextImage() {
  const [src, setSrc] = useState('');
  const [logo, setLogo] = useState('');
  const [out, setOut] = useState('');
  const [text, setText] = useState('Your Brand');
  const [x, setX] = useState(75);
  const [y, setY] = useState(85);
  const dragging = useRef(false);

  const onPickMain = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    setOut('');
  };

  const onPickLogo = async (file?: File) => {
    if (!file) return;
    setLogo(await readImageFile(file));
  };

  const previewStyle = useMemo(() => ({ left: `${x}%`, top: `${y}%` }), [x, y]);

  const apply = async () => {
    if (!src) return;
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const px = (x / 100) * canvas.width;
    const py = (y / 100) * canvas.height;

    if (logo) {
      const logoImg = await loadImage(logo);
      const logoW = Math.max(60, Math.round(canvas.width * 0.14));
      const logoH = (logoImg.naturalHeight / logoImg.naturalWidth) * logoW;
      ctx.globalAlpha = 0.75;
      ctx.drawImage(logoImg, px - logoW / 2, py - logoH / 2, logoW, logoH);
      ctx.globalAlpha = 1;
    }

    ctx.font = `bold ${Math.max(18, Math.round(canvas.width * 0.03))}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.strokeStyle = 'rgba(15,23,42,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeText(text, px, py);
    ctx.fillText(text, px, py);

    setOut(canvasToDataUrl(canvas));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Watermark Adder (Text/Image)</h2>
        <p className="mt-2 text-slate-600">Apply brand text and optional logo with draggable live position preview.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Base Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickMain(e.target.files?.[0])} />
          </label>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700">
            Logo (opt)
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickLogo(e.target.files?.[0])} />
          </label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Watermark text" />
          <button onClick={apply} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700">Apply</button>
          <button onClick={() => downloadDataUrl(out, 'watermarked.png')} disabled={!out} className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Download</button>
        </div>

        {src && (
          <div
            className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200"
            onPointerMove={(e) => {
              if (!dragging.current) return;
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              setX(Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100)));
              setY(Math.min(95, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100)));
            }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerLeave={() => { dragging.current = false; }}
          >
            <img src={src} alt="watermark-base" className="block w-full" />
            <div
              style={previewStyle}
              onPointerDown={() => { dragging.current = true; }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move rounded-md bg-white/80 px-3 py-1 text-sm font-semibold text-slate-800 shadow"
            >
              {text}
            </div>
          </div>
        )}

        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="watermark" /></div>}
      </div>
    </div>
  );
}
