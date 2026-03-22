import React, { useState, useRef } from 'react';
import { Download, Square, Circle, Image as ImageIcon } from 'lucide-react';

export default function RoundCorners() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [radius, setRadius] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
    setImageSrc(url);
    setRadius(20);
  };

  const handleDownload = () => {
    if (!imageSrc || !imageRef.current) return;
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rx = Math.min((radius / 100) * canvas.width, canvas.width / 2);
    const ry = Math.min((radius / 100) * canvas.height, canvas.height / 2);

    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(canvas.width - rx, 0);
    ctx.ellipse(canvas.width - rx, ry, rx, ry, 0, -Math.PI / 2, 0);
    ctx.lineTo(canvas.width, canvas.height - ry);
    ctx.ellipse(canvas.width - rx, canvas.height - ry, rx, ry, 0, 0, Math.PI / 2);
    ctx.lineTo(rx, canvas.height);
    ctx.ellipse(rx, canvas.height - ry, rx, ry, 0, Math.PI / 2, Math.PI);
    ctx.lineTo(0, ry);
    ctx.ellipse(rx, ry, rx, ry, 0, Math.PI, Math.PI * 1.5);
    ctx.closePath();
    
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rounded-image.png`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }, 'image/png');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Round Image Corners</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Add smooth rounded corners or make your image a perfect circle instantly.
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
            <Square className="w-12 h-12 text-indigo-400 mx-auto mb-4 rounded-xl" />
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
            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">Corner Radius</span>
                  <span className="text-indigo-600">{radius}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={radius} 
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between gap-2 pt-2">
                  <button 
                    onClick={() => setRadius(0)}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    Square (0%)
                  </button>
                  <button 
                    onClick={() => setRadius(100)}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    Circle (100%)
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-5 h-5" /> Download PNG
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
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-8 flex items-center justify-center min-h-[400px] overflow-hidden relative">
              {/* Checkerboard background for transparency visibility */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
              
              <img 
                ref={imageRef}
                src={imageSrc} 
                alt="Preview" 
                className="max-w-full max-h-[60vh] object-cover shadow-xl transition-all duration-200 relative z-10"
                style={{ borderRadius: `${radius}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
