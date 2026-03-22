import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Type, Settings, DownloadCloud } from 'lucide-react';

export default function AddTextToImage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState('Your Text Here');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Draw text
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const x = (canvas.width * xPos) / 100;
      const y = (canvas.height * yPos) / 100;
      
      ctx.fillText(text, x, y);
    };
    img.src = imageSrc;
  }, [imageSrc, text, fontSize, color, xPos, yPos]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image-with-text.png';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }, 'image/png');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Add Text to Image</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Add custom text, watermarks, and typography to your images instantly.
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
            <Type className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Text content</label>
                  <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter your text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Font Size: {fontSize}px</label>
                  <input 
                    type="range" min="12" max="200" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-none p-0"
                    />
                    <span className="text-sm text-slate-600 uppercase">{color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Horizontal Position: {xPos}%</label>
                  <input 
                    type="range" min="0" max="100" 
                    value={xPos} 
                    onChange={(e) => setXPos(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vertical Position: {yPos}%</label>
                  <input 
                    type="range" min="0" max="100" 
                    value={yPos} 
                    onChange={(e) => setYPos(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  <DownloadCloud className="w-5 h-5" /> Download Image
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
              <canvas 
                ref={canvasRef}
                className="max-w-full max-h-[60vh] object-contain shadow-md rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
