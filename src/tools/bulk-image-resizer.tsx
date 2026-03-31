import React, { useMemo, useState } from 'react';
import JSZip from 'jszip';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { downloadDataUrl, loadImage, readImageFile } from '../lib/image-utils';

interface Item {
  name: string;
  original: string;
  resized: string;
  originalW: number;
  originalH: number;
  targetW: number;
  targetH: number;
}

export default function BulkImageResizer() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<'px' | 'percent'>('px');
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [percent, setPercent] = useState(50);
  const [processing, setProcessing] = useState(false);

  const hasItems = items.length > 0;
  const preview = useMemo(() => items[0], [items]);

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;

    setProcessing(true);
    try {
      const next: Item[] = [];
      for (const file of list) {
        const src = await readImageFile(file);
        const img = await loadImage(src);
        const targetW = mode === 'percent' ? Math.max(1, Math.round(img.naturalWidth * percent / 100)) : width;
        const targetH = mode === 'percent' ? Math.max(1, Math.round(img.naturalHeight * percent / 100)) : height;

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.drawImage(img, 0, 0, targetW, targetH);
        next.push({
          name: file.name,
          original: src,
          resized: canvas.toDataURL('image/png'),
          originalW: img.naturalWidth,
          originalH: img.naturalHeight,
          targetW,
          targetH
        });
      }
      setItems(next);
    } finally {
      setProcessing(false);
    }
  };

  const downloadAllZip = async () => {
    if (!hasItems) return;
    const zip = new JSZip();
    items.forEach((item, i) => {
      const b64 = item.resized.split(',')[1];
      zip.file(`resized-${i + 1}-${item.name.replace(/\.[^.]+$/, '')}.png`, b64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, 'bulk-resized-images.zip');
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Bulk Image Resizer</h2>
        <p className="mt-2 text-slate-600">Resize multiple images by exact pixels or percentage with instant preview.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <select value={mode} onChange={(e) => setMode(e.target.value as 'px' | 'percent')} className="h-11 rounded-xl border border-slate-300 px-3">
            <option value="px">Exact Pixels</option>
            <option value="percent">Percentage</option>
          </select>
          {mode === 'px' ? (
            <>
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value) || 1)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Width" />
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 1)} className="h-11 rounded-xl border border-slate-300 px-3" placeholder="Height" />
            </>
          ) : (
            <input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value) || 1)} className="h-11 rounded-xl border border-slate-300 px-3 md:col-span-2" placeholder="Percent" />
          )}
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Pick Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files)} />
          </label>
          <button onClick={downloadAllZip} disabled={!hasItems} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 disabled:opacity-50">
            <Download className="mr-2 inline h-4 w-4" /> Download ZIP
          </button>
        </div>

        {processing && <p className="mt-3 text-sm text-indigo-600">Processing images...</p>}

        {preview && (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Relative Box: {preview.originalW}x{preview.originalH} {'->'} {preview.targetW}x{preview.targetH}
            </div>
            <BeforeAfterSlider beforeSrc={preview.original} afterSrc={preview.resized} alt="bulk-resize" />
          </div>
        )}
      </div>
    </div>
  );
}
