import React, { useMemo, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

const FONTS = ['Impact', 'Arial Black', 'Inter', 'JetBrains Mono'];

export default function MemeGenerator() {
  const [src, setSrc] = useState('');
  const [top, setTop] = useState('TOP TEXT');
  const [bottom, setBottom] = useState('BOTTOM TEXT');
  const [font, setFont] = useState(FONTS[0]);
  const [result, setResult] = useState('');

  const preview = useMemo(() => result || src, [result, src]);

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    setResult('');
  };

  const render = async () => {
    if (!src) return;
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const size = Math.max(24, Math.round(canvas.width * 0.07));
    ctx.font = `700 ${size}px ${font}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, size * 0.08);

    ctx.strokeText(top.toUpperCase(), canvas.width / 2, size + 20);
    ctx.fillText(top.toUpperCase(), canvas.width / 2, size + 20);

    ctx.strokeText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);
    ctx.fillText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);

    setResult(canvasToDataUrl(canvas));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Meme Generator</h2>
        <p className="mt-2 text-slate-600">Create memes with live text overlays and export instantly.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <input value={top} onChange={(e) => setTop(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Top text" />
          <input value={bottom} onChange={(e) => setBottom(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Bottom text" />
          <select value={font} onChange={(e) => setFont(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3">{FONTS.map((item) => <option key={item}>{item}</option>)}</select>
          <button onClick={render} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700">Render</button>
        </div>

        {preview && (
          <div className="mt-5 space-y-3">
            <img src={preview} alt="meme-preview" className="w-full rounded-2xl border border-slate-200" />
            <button onClick={() => downloadDataUrl(preview, 'meme.png')} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              <Download className="mr-2 inline h-4 w-4" /> Download Meme
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
