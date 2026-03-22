import React, { useState, useRef } from 'react';
import { Download, FileImage, ArrowRight, RefreshCw } from 'lucide-react';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageConverter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  
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

    setOriginalFormat(file.type);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  const handleConvert = () => {
    if (!imageSrc || !imageRef.current) return;
    
    setIsConverting(true);
    
    setTimeout(() => {
      const img = imageRef.current!;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // If converting to JPEG, fill white background first to prevent transparent areas turning black
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const extension = targetFormat.split('/')[1];
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-image.${extension}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        setIsConverting(false);
      }, targetFormat, 0.9); // High quality
    }, 500); // Small delay to show converting state
  };

  const getFormatLabel = (mime: string) => {
    if (mime === 'image/jpeg') return 'JPG';
    if (mime === 'image/png') return 'PNG';
    if (mime === 'image/webp') return 'WebP';
    return mime.split('/')[1]?.toUpperCase() || 'IMG';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image Format Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert images between JPG, PNG, and WebP formats locally in your browser.
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
            <FileImage className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-6">Supports JPG, PNG, WebP, GIF</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Conversion Controls */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
              
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-slate-500 mb-2">Original Format</span>
                <div className="px-6 py-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 shadow-sm">
                  {getFormatLabel(originalFormat)}
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-slate-400 hidden md:block" />

              <div className="flex flex-col items-center w-full md:w-auto">
                <span className="text-sm font-medium text-slate-500 mb-2">Target Format</span>
                <select 
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                  className="w-full md:w-48 px-4 py-3 bg-white border border-indigo-300 text-indigo-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
                >
                  <option value="image/webp">WebP (Recommended)</option>
                  <option value="image/jpeg">JPG / JPEG</option>
                  <option value="image/png">PNG</option>
                </select>
              </div>

              <div className="w-full md:w-auto md:ml-4">
                <button 
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isConverting ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Converting...</>
                  ) : (
                    <><Download className="w-5 h-5" /> Convert & Download</>
                  )}
                </button>
              </div>

            </div>

            {/* Preview */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] overflow-hidden relative">
              <img 
                ref={imageRef}
                src={imageSrc} 
                alt="Preview" 
                className="max-w-full max-h-[50vh] object-contain shadow-sm border border-slate-200 bg-white"
              />
            </div>

            <div className="text-center">
              <button 
                onClick={() => setImageSrc(null)}
                className="text-sm text-slate-500 hover:text-indigo-600 font-medium underline"
              >
                Upload Different Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
