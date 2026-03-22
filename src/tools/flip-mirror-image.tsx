import React, { useState, useRef } from 'react';
import { Download, FlipHorizontal, FlipVertical, Image as ImageIcon } from 'lucide-react';

export default function FlipMirrorImage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
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
    setFlipX(1);
    setFlipY(1);
  };

  const handleDownload = () => {
    if (!imageSrc || !imageRef.current) return;
    
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Move to center, scale, move back
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipX, flipY);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flipped-image.png`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }, 'image/png');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Flip & Mirror Image</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Instantly flip your images horizontally or vertically with live preview.
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
            <FlipHorizontal className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
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
          <div className="space-y-8">
            
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <button 
                onClick={() => setFlipX(prev => prev * -1)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
              >
                <FlipHorizontal className="w-5 h-5" /> Flip Horizontal
              </button>
              <button 
                onClick={() => setFlipY(prev => prev * -1)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
              >
                <FlipVertical className="w-5 h-5" /> Flip Vertical
              </button>
              
              <div className="w-px h-10 bg-slate-300 mx-2 hidden sm:block"></div>
              
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" /> Download
              </button>
            </div>

            {/* Live Preview */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
              <img 
                ref={imageRef}
                src={imageSrc} 
                alt="Preview" 
                className="max-w-full max-h-[60vh] object-contain shadow-md transition-transform duration-300"
                style={{ transform: `scale(${flipX}, ${flipY})` }}
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
