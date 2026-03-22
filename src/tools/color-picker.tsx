import React, { useState, useRef, useEffect } from 'react';
import { Upload, Pipette, Copy, Shield, Check } from 'lucide-react';

export default function ColorPicker() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverColor, setHoverColor] = useState<{ hex: string; rgb: string } | null>(null);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setPickedColor(null);
        setHoverColor(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const drawImageToCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions to match image display dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const getColorAtPosition = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    
    return { hex, rgb };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const color = getColorAtPosition(x, y);
    if (color) setHoverColor(color);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const color = getColorAtPosition(x, y);
    if (color) setPickedColor(color);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Color Picker from Image</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract exact HEX and RGB color codes from any image instantly.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Images are processed locally in your browser.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {!image ? (
          <div 
            className={`p-16 text-center border-2 border-dashed m-8 rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-8">Supports JPG, PNG, WebP</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Choose Image
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Image Area */}
            <div className="lg:col-span-2 p-6 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] relative">
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                <Pipette className="w-4 h-4" /> Hover to preview, click to pick color
              </p>
              <div className="relative inline-block border border-slate-200 shadow-sm rounded overflow-hidden cursor-crosshair">
                <img 
                  ref={imgRef}
                  src={image} 
                  alt="Upload" 
                  className="max-w-full max-h-[600px] opacity-0 absolute pointer-events-none"
                  onLoad={drawImageToCanvas}
                />
                <canvas 
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  className="max-w-full max-h-[600px] block"
                />
              </div>
              <button 
                onClick={() => setImage(null)}
                className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                Upload different image
              </button>
            </div>

            {/* Color Details Area */}
            <div className="p-8 space-y-8 bg-white">
              {/* Hover Preview */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Live Preview</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div 
                    className="w-16 h-16 rounded-lg border border-slate-200 shadow-inner"
                    style={{ backgroundColor: hoverColor?.hex || '#ffffff' }}
                  ></div>
                  <div className="flex-1 font-mono text-sm space-y-1 text-slate-600">
                    <p>HEX: {hoverColor?.hex || '---'}</p>
                    <p>RGB: {hoverColor?.rgb || '---'}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Picked Color */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Picked Color</h3>
                {pickedColor ? (
                  <div className="space-y-4">
                    <div 
                      className="w-full h-32 rounded-xl border border-slate-200 shadow-inner"
                      style={{ backgroundColor: pickedColor.hex }}
                    ></div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="font-mono text-slate-800 font-medium">{pickedColor.hex}</span>
                        <button 
                          onClick={() => copyToClipboard(pickedColor.hex, 'hex')}
                          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {copied === 'hex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied === 'hex' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="font-mono text-slate-800 font-medium">{pickedColor.rgb}</span>
                        <button 
                          onClick={() => copyToClipboard(pickedColor.rgb, 'rgb')}
                          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {copied === 'rgb' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied === 'rgb' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    Click anywhere on the image to pick a color
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
