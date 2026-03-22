import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Maximize2, Shield } from 'lucide-react';

export default function ImageUpscaler() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDim, setOriginalDim] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState<number>(2);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    };
    img.src = url;
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const targetWidth = originalDim.w * scale;
      const targetHeight = originalDim.h * scale;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Enable high quality smoothing for upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob((blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `upscaled-${scale}x.png`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          a.remove();
          setIsProcessing(false);
        }, 'image/png', 1.0);
      };
      img.src = imageSrc;
    }, 100); // Small delay to allow UI to update
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image Upscaler</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upscale and enhance your low-resolution images instantly using high-quality interpolation.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          100% Private - Processed locally on your device.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!imageSrc ? (
          <div 
            className={`p-16 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <Maximize2 className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
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
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Upscale Factor</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 4, 8].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${scale === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Original Size:</span>
                  <span className="font-medium text-slate-700">{originalDim.w} × {originalDim.h} px</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Upscaled Size:</span>
                  <span className="font-medium text-indigo-600">{originalDim.w * scale} × {originalDim.h * scale} px</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : <><Download className="w-5 h-5" /> Download Upscaled</>}
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
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Original Preview
                </span>
              </div>
              <img 
                src={imageSrc} 
                alt="Original Preview" 
                className="max-w-full max-h-[60vh] object-contain shadow-md rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
