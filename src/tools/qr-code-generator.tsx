import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Link as LinkIcon, Shield } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(250);
  const [qrUrl, setQrUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text.trim() && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error(error);
        else {
          setQrUrl(canvasRef.current?.toDataURL('image/png') || '');
        }
      });
    } else {
      setQrUrl('');
    }
  }, [text, size]);

  const downloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">QR Code Generator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create custom QR codes for URLs, text, Wi-Fi, and contact info instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <LinkIcon className="w-4 h-4" /> Enter URL or Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://your-website.com"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="flex justify-between text-sm font-medium text-slate-700">
              <span>Image Size</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{size}x{size} px</span>
            </label>
            <input 
              type="range" min="100" max="1000" step="50" value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center space-y-8">
          <h3 className="text-lg font-medium text-slate-700">Live Preview</h3>
          
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 min-h-[300px] flex items-center justify-center w-full">
            <canvas ref={canvasRef} className={`shadow-sm rounded bg-white ${!text.trim() ? 'hidden' : ''}`} />
            {!text.trim() && (
              <div className="text-slate-400 flex flex-col items-center">
                <QrCode className="w-16 h-16 mb-2 opacity-50" />
                <p>Enter text to generate</p>
              </div>
            )}
          </div>

          <button 
            onClick={downloadQR}
            disabled={!qrUrl}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
