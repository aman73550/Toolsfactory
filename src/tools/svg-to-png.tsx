import React, { useState, useRef } from 'react';
import { Upload, Download, FileJson, Image as ImageIcon, Settings } from 'lucide-react';

export default function SvgToPng() {
  const [svgContent, setSvgContent] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(2);
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

    if (!file || file.type !== 'image/svg+xml') {
      alert("Please upload a valid SVG file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSvgContent(event.target.result as string);
        convertSvgToPng(event.target.result as string, scale);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setSvgContent(content);
    if (content.trim().startsWith('<svg')) {
      convertSvgToPng(content, scale);
    } else {
      setPngDataUrl(null);
    }
  };

  const convertSvgToPng = (svgStr: string, currentScale: number) => {
    try {
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * currentScale;
        canvas.height = img.height * currentScale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPngDataUrl(canvas.toDataURL('image/png'));
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        console.error("Failed to load SVG");
        setPngDataUrl(null);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      console.error("SVG conversion error:", error);
      setPngDataUrl(null);
    }
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    if (svgContent.trim().startsWith('<svg')) {
      convertSvgToPng(svgContent, newScale);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">SVG to PNG Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert scalable vector graphics (SVG) into high-quality PNG images instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4 flex flex-col h-full">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-indigo-500" /> SVG Input
            </h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div 
                className={`p-8 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileUpload}
              >
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-4">Drag & Drop SVG file here</p>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".svg,image/svg+xml" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Browse File
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR PASTE CODE</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <textarea
                value={svgContent}
                onChange={handleTextChange}
                placeholder="<svg>...</svg>"
                className="w-full flex-1 min-h-[200px] p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" /> PNG Output
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Scale:</span>
                <select 
                  value={scale} 
                  onChange={(e) => handleScaleChange(Number(e.target.value))}
                  className="text-sm border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                  <option value={8}>8x</option>
                </select>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[400px] p-4 relative">
              {pngDataUrl ? (
                <>
                  <img src={pngDataUrl} alt="Converted PNG" className="max-w-full max-h-[400px] object-contain shadow-sm bg-white" />
                  <a 
                    href={pngDataUrl} 
                    download="converted.png"
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download PNG
                  </a>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
