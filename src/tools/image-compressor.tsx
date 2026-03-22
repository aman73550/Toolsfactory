import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders, Shield, ArrowRight } from 'lucide-react';

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.8);
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
    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds the 20MB limit.");
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
        compressImage(event.target.result as string, quality);
      }
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (dataUrl: string, q: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', q);
      setCompressedImage(compressedDataUrl);
      
      // Calculate approximate size of base64 string
      const base64str = compressedDataUrl.split('base64,')[1];
      const decoded = atob(base64str);
      setCompressedSize(decoded.length);
    };
    img.src = dataUrl;
  };

  useEffect(() => {
    if (originalImage) {
      compressImage(originalImage, quality);
    }
  }, [quality, originalImage]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image Compressor</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Compress JPG, PNG, and WebP images instantly without losing quality. 
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Files are processed locally. No data is stored on our servers.
        </div>
      </div>

      {/* Main Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {!originalImage ? (
          <div 
            className={`p-16 text-center border-2 border-dashed m-8 rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Drag & Drop your image here</h3>
            <p className="text-slate-500 mb-8">Supports JPG, PNG, WebP (Max 20MB)</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Choose File
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex-1 w-full space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2"><Sliders className="w-4 h-4" /> Compression Level</span>
                  <span>{Math.round(quality * 100)}% Quality</span>
                </label>
                <input 
                  type="range" min="0.1" max="1" step="0.05" 
                  value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div className="flex items-center gap-4 text-center">
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Original</p>
                  <p className="text-lg font-bold text-slate-800">{formatBytes(originalSize)}</p>
                </div>
                <ArrowRight className="text-slate-400" />
                <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm">
                  <p className="text-xs text-indigo-600 uppercase font-semibold">Compressed</p>
                  <p className="text-lg font-bold text-indigo-700">{formatBytes(compressedSize)}</p>
                </div>
              </div>
              <a 
                href={compressedImage || '#'} 
                download="compressed-image.jpg"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
              >
                <Download className="w-5 h-5" /> Download
              </a>
            </div>

            {/* Preview */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Original</h4>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px]">
                  <img src={originalImage} alt="Original" className="max-w-full max-h-[500px] object-contain" />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Compressed Preview</h4>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px]">
                  {compressedImage && <img src={compressedImage} alt="Compressed" className="max-w-full max-h-[500px] object-contain" />}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button onClick={() => {setOriginalImage(null); setCompressedImage(null);}} className="text-slate-500 hover:text-slate-800 font-medium underline">
                Compress another image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
