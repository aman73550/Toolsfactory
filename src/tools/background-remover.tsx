import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2, Shield } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
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
    setOriginalImage(url);
    setProcessedImage(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      const imageBlob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        }
      });
      const processedUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(processedUrl);
    } catch (error) {
      console.error("Background removal failed:", error);
      alert("Failed to remove background. Please try another image.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Background Remover</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Remove the background from any image instantly using AI directly in your browser.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          100% Private - Processed locally on your device.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!originalImage ? (
          <div 
            className={`p-16 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <ImageIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
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
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">Original</h4>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px] relative">
                  <img src={originalImage} alt="Original" className="max-w-full max-h-[400px] object-contain" />
                </div>
              </div>

              {/* Processed Image */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">Result</h4>
                <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/ENCE8z8PmtHRMICBxsxQAGgAAwB11x1yTz1H1AAAAABJRU5ErkJggg==')] rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px] relative">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center text-indigo-600 bg-white/80 absolute inset-0 z-10">
                      <Loader2 className="w-10 h-10 animate-spin mb-4" />
                      <p className="font-medium">Removing background...</p>
                      <p className="text-sm text-indigo-500 mt-2">{progress}%</p>
                    </div>
                  ) : processedImage ? (
                    <img src={processedImage} alt="Processed" className="max-w-full max-h-[400px] object-contain" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-200">
              <button 
                onClick={() => { setOriginalImage(null); setProcessedImage(null); }}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
              >
                Upload New Image
              </button>
              {processedImage && (
                <a 
                  href={processedImage} 
                  download="background-removed.png"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                  <Download className="w-5 h-5" /> Download PNG
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
