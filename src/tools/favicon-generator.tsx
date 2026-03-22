import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Briefcase, Globe } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function FaviconGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
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
    setImageSrc(url);
  };

  const generateFavicons = async () => {
    if (!imageSrc) return;

    const sizes = [16, 32, 48, 64, 128, 256, 512];
    const zip = new JSZip();
    const img = new Image();
    
    img.onload = async () => {
      for (const size of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          zip.file(`favicon-${size}x${size}.png`, blob);
        }
      }

      // Generate favicon.ico (using 32x32 for simplicity)
      const canvasIco = document.createElement('canvas');
      canvasIco.width = 32;
      canvasIco.height = 32;
      const ctxIco = canvasIco.getContext('2d');
      if (ctxIco) {
        ctxIco.imageSmoothingEnabled = true;
        ctxIco.imageSmoothingQuality = 'high';
        ctxIco.drawImage(img, 0, 0, 32, 32);
        const blobIco = await new Promise<Blob | null>((resolve) => canvasIco.toBlob(resolve, 'image/x-icon'));
        if (blobIco) {
          zip.file('favicon.ico', blobIco);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'favicons.zip');
    };
    img.src = imageSrc;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Favicon Generator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Generate favicon.ico and app icons from your images instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!imageSrc ? (
          <div 
            className={`p-16 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <Briefcase className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-6">Supports JPG, PNG, WebP (Square image recommended)</p>
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
                <h3 className="font-semibold text-slate-800">Generated Sizes</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 16x16 (Standard)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 32x32 (Desktop)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 48x48 (Windows)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 64x64 (High-res)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 128x128 (Chrome Web Store)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 256x256 (Android)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 512x512 (PWA)</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> favicon.ico</li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={generateFavicons}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-5 h-5" /> Download ZIP
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
                  <Globe className="w-3 h-3" />
                  Browser Tab Preview
                </span>
              </div>
              
              <div className="bg-white rounded-t-lg shadow-sm border border-slate-200 w-full max-w-md overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 ml-4 bg-white rounded-md px-3 py-1 text-xs text-slate-500 flex items-center gap-2 border border-slate-200">
                    <img src={imageSrc} alt="Favicon" className="w-4 h-4 object-contain rounded-sm" />
                    My Awesome Website
                  </div>
                </div>
                <div className="p-8 text-center text-slate-400">
                  Page Content
                </div>
              </div>

              <div className="mt-8 flex gap-4 items-end">
                <div className="text-center">
                  <img src={imageSrc} alt="16x16" className="w-4 h-4 object-contain mx-auto mb-2 border border-slate-200 bg-white" />
                  <span className="text-xs text-slate-500">16x16</span>
                </div>
                <div className="text-center">
                  <img src={imageSrc} alt="32x32" className="w-8 h-8 object-contain mx-auto mb-2 border border-slate-200 bg-white" />
                  <span className="text-xs text-slate-500">32x32</span>
                </div>
                <div className="text-center">
                  <img src={imageSrc} alt="64x64" className="w-16 h-16 object-contain mx-auto mb-2 border border-slate-200 bg-white" />
                  <span className="text-xs text-slate-500">64x64</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
