import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { applyBasicAdjustments, canvasToDataUrl, downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

export default function HueSaturationLightness() {
  const [src, setSrc] = useState('');
  const [out, setOut] = useState('');
  const [hue, setHue] = useState(0);
  const [saturate, setSaturate] = useState(100);
  const [lightness, setLightness] = useState(100);

  const render = async (source = src, h = hue, s = saturate, l = lightness) => {
    if (!source) return;
    const img = await loadImage(source);
    const canvas = applyBasicAdjustments(img, { hue: h, saturate: s, brightness: l });
    setOut(canvasToDataUrl(canvas));
  };

  const onPick = async (file?: File) => {
    if (!file) return;
    const data = await readImageFile(file);
    setSrc(data);
    await render(data, hue, saturate, lightness);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Hue, Saturation & Lightness</h2>
        <p className="mt-2 text-slate-600">Adjust color tone and intensity with live visual feedback.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <input type="range" min={-180} max={180} value={hue} onChange={(e) => { const v = Number(e.target.value); setHue(v); render(src, v, saturate, lightness); }} />
          <input type="range" min={0} max={200} value={saturate} onChange={(e) => { const v = Number(e.target.value); setSaturate(v); render(src, hue, v, lightness); }} />
          <input type="range" min={0} max={200} value={lightness} onChange={(e) => { const v = Number(e.target.value); setLightness(v); render(src, hue, saturate, v); }} />
          <button onClick={() => downloadDataUrl(out, 'hsl-adjusted.png')} disabled={!out} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Download</button>
        </div>
        {src && out && <div className="mt-5"><BeforeAfterSlider beforeSrc={src} afterSrc={out} alt="hsl" /></div>}
      </div>
    </div>
  );
}
