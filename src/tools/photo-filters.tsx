import React, { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, SlidersHorizontal } from 'lucide-react';

export default function PhotoFilters() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Filter states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  
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
    resetFilters();
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
  };

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;

  const handleDownload = () => {
    if (!imageSrc || !imageRef.current) return;
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply filters to canvas context
    ctx.filter = filterStyle;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filtered-image.png`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }, 'image/png');
  };

  const FilterSlider = ({ label, value, min, max, unit, onChange }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-indigo-600">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Photo Filters</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Apply beautiful filters and adjustments to your photos in real-time.
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
            <SlidersHorizontal className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
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
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            {/* Controls */}
            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">Adjustments</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-5">
                <FilterSlider label="Brightness" value={brightness} min="0" max="200" unit="%" onChange={setBrightness} />
                <FilterSlider label="Contrast" value={contrast} min="0" max="200" unit="%" onChange={setContrast} />
                <FilterSlider label="Saturation" value={saturation} min="0" max="200" unit="%" onChange={setSaturation} />
                <FilterSlider label="Grayscale" value={grayscale} min="0" max="100" unit="%" onChange={setGrayscale} />
                <FilterSlider label="Sepia" value={sepia} min="0" max="100" unit="%" onChange={setSepia} />
                <FilterSlider label="Hue Rotate" value={hueRotate} min="0" max="360" unit="°" onChange={setHueRotate} />
                <FilterSlider label="Blur" value={blur} min="0" max="20" unit="px" onChange={setBlur} />
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-5 h-5" /> Download Image
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
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-center min-h-[500px] overflow-hidden">
              <img 
                ref={imageRef}
                src={imageSrc} 
                alt="Preview" 
                className="max-w-full max-h-[70vh] object-contain shadow-lg transition-all duration-100"
                style={{ filter: filterStyle }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
