import React, { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Download, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';
import { downloadDataUrl, readImageFile } from '../lib/image-utils';

export default function AdvancedImageCropper() {
  const [src, setSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 10, y: 10, width: 70, height: 70 });
  const [ratio, setRatio] = useState<number | undefined>(16 / 9);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const onPick = async (file?: File) => {
    if (!file) return;
    setSrc(await readImageFile(file));
    setResult('');
  };

  const renderCrop = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = Math.max(1, Math.floor(crop.width * scaleX));
    canvas.height = Math.max(1, Math.floor(crop.height * scaleY));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    ctx.restore();
    setResult(canvas.toDataURL('image/png'));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-bold text-slate-900">Advanced Image Cropper</h2>
        <p className="mt-2 text-slate-600">Crop with aspect ratios and rotation, then compare before and after instantly.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <select className="h-11 rounded-xl border border-slate-300 px-3" onChange={(e) => {
            const val = e.target.value;
            setRatio(val === 'free' ? undefined : Number(val));
          }}>
            <option value={String(16 / 9)}>16:9</option>
            <option value={String(4 / 5)}>4:5</option>
            <option value="1">1:1</option>
            <option value="free">Free</option>
          </select>
          <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="md:col-span-2" />
          <button onClick={renderCrop} className="h-11 rounded-xl border border-slate-300 px-4 font-semibold text-slate-700">Apply</button>
        </div>

        {src && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={ratio}>
              <img ref={imgRef} src={src} alt="crop" style={{ transform: `rotate(${rotation}deg)` }} />
            </ReactCrop>
          </div>
        )}

        {result && (
          <div className="mt-5 space-y-3">
            <BeforeAfterSlider beforeSrc={src} afterSrc={result} alt="crop" />
            <button onClick={() => downloadDataUrl(result, 'advanced-crop.png')} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              <Download className="mr-2 inline h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
