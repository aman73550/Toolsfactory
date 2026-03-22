import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Lock, Unlock, Image as ImageIcon, Maximize } from 'lucide-react';

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDim, setOriginalDim] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    let file: File | null = null;
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0];
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files![0];
    }

    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageSrc(url);
      setOriginalDim({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newW = parseInt(e.target.value) || 0;
    setWidth(newW);
    if (aspectLocked && originalDim.w > 0) {
      setHeight(Math.round((newW * originalDim.h) / originalDim.w));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value) || 0;
    setHeight(newH);
    if (aspectLocked && originalDim.h > 0) {
      setWidth(Math.round((newH * originalDim.w) / originalDim.h));
    }
  };

  const handleDownload = () => {
    if (!imageSrc || width <= 0 || height <= 0) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized-${width}x${height}.png`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image Resizer</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Resize your images instantly with live dimension previews.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!imageSrc ? (
          <div 
            className={`p-12 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <ImageIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-6">Supports JPG, PNG, WebP</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Controls */}
            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Dimensions</h3>
                <button 
                  onClick={() => setAspectLocked(!aspectLocked)}
                  className={`p-2 rounded-lg transition-colors ${aspectLocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}
                  title={aspectLocked ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                >
                  {aspectLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={handleWidthChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={handleHeightChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-5 h-5" /> Download Resized
                </button>
                <button 
                  onClick={() => setImageSrc(null)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Upload New Image
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1">
                  <Maximize className="w-3 h-3" />
                  Target: {width} × {height} px
                </span>
              </div>
              
              {/* Visual representation of the bounding box */}
              <div 
                className="relative border-2 border-indigo-400 border-dashed flex items-center justify-center bg-white/50 transition-all duration-300"
                style={{ 
                  width: '100%', 
                  maxWidth: '100%',
                  aspectRatio: width > 0 && height > 0 ? `${width}/${height}` : 'auto',
                  maxHeight: '60vh'
                }}
              >
                <img 
                  src={imageSrc} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
