import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, Image as ImageIcon, Crop as CropIcon, RefreshCw } from 'lucide-react';

export default function CropImage() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    let file: File | null = null;
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0];
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files![0];
    }

    if (!file || !file.type.startsWith('image/')) return;

    setCrop(undefined);
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect || width / height, width, height),
      width,
      height
    );
    setCrop(crop);
  };

  const handleDownload = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-image.png';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }, 'image/png');
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, newAspect || width / height, width, height),
        width,
        height
      );
      setCrop(newCrop);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Crop Image</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Crop your images to specific aspect ratios or custom sizes instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!imgSrc ? (
          <div 
            className={`p-16 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onSelectFile}
          >
            <CropIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-6">Supports JPG, PNG, WebP</p>
            <input type="file" ref={fileInputRef} onChange={onSelectFile} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleAspectChange(undefined)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aspect === undefined ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >
                  Free
                </button>
                <button 
                  onClick={() => handleAspectChange(1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aspect === 1 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >
                  1:1 (Square)
                </button>
                <button 
                  onClick={() => handleAspectChange(16 / 9)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aspect === 16 / 9 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >
                  16:9 (Landscape)
                </button>
                <button 
                  onClick={() => handleAspectChange(9 / 16)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aspect === 9 / 16 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >
                  9:16 (Portrait)
                </button>
                <button 
                  onClick={() => handleAspectChange(4 / 3)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aspect === 4 / 3 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                >
                  4:3
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setImgSrc('')}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Upload New Image"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Crop & Download
                </button>
              </div>
            </div>

            {/* Crop Area */}
            <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[400px] p-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </ReactCrop>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
