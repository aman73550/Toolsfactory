import React, { useState, useRef } from 'react';
import { Upload, Copy, FileText, Loader2, Shield, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function ImageToText() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
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
    setImageSrc(url);
    setText('');
    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing OCR engine...');

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setStatusText('Extracting text...');
              setProgress(Math.round(m.progress * 100));
            } else {
              setStatusText(m.status);
            }
          }
        }
      );
      setText(result.data.text);
    } catch (error) {
      console.error("OCR failed:", error);
      setText("Failed to extract text. Please ensure the image contains clear, readable text.");
    } finally {
      setIsProcessing(false);
      setStatusText('');
    }
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image to Text (OCR)</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract text from images instantly using Optical Character Recognition (OCR) directly in your browser.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          100% Private - Processed locally on your device.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        {!imageSrc ? (
          <div 
            className={`p-16 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop an image here</h3>
            <p className="text-slate-500 mb-6">Supports JPG, PNG, WebP with clear text</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" /> Source Image
                </h3>
                <button 
                  onClick={() => { setImageSrc(null); setText(''); }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Upload New
                </button>
              </div>
              <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[400px] relative">
                <img src={imageSrc} alt="Source" className="max-w-full max-h-[500px] object-contain" />
              </div>
            </div>

            {/* Extracted Text */}
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" /> Extracted Text
                </h3>
                {text && !isProcessing && (
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg"
                  >
                    <Copy className="w-4 h-4" /> Copy Text
                  </button>
                )}
              </div>
              
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden min-h-[400px]">
                {isProcessing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-600 p-6 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium text-lg mb-2">{statusText}</p>
                    <div className="w-full max-w-xs bg-slate-200 rounded-full h-2.5 mb-2">
                      <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-500">{progress}% Complete</p>
                  </div>
                ) : (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-full p-6 bg-transparent border-none outline-none resize-none text-slate-700 leading-relaxed"
                    placeholder="Extracted text will appear here..."
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
