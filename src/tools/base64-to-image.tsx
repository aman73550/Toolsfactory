import React, { useState, useEffect } from 'react';
import { Download, Code, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function Base64ToImage() {
  const [base64String, setBase64String] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!base64String.trim()) {
      setImageUrl(null);
      setError('');
      return;
    }

    try {
      // Basic validation
      let cleanStr = base64String.trim();
      
      // If it doesn't have the data:image prefix, try to add it
      if (!cleanStr.startsWith('data:image')) {
        // Check if it's valid base64
        const isBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(cleanStr.replace(/\s/g, ''));
        if (isBase64) {
          cleanStr = `data:image/png;base64,${cleanStr}`;
        } else {
          throw new Error('Invalid Base64 string format');
        }
      }

      setImageUrl(cleanStr);
      setError('');
    } catch (err) {
      setImageUrl(null);
      setError('Invalid Base64 string. Please check your input.');
    }
  }, [base64String]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'decoded-image.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Base64 to Image</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paste your Base64 string to instantly preview and download the image.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Code className="w-4 h-4" /> Base64 String
            </div>
            <textarea
              value={base64String}
              onChange={(e) => setBase64String(e.target.value)}
              placeholder="Paste Base64 string here (e.g., data:image/png;base64,iVBORw0KGgo...)"
              className="w-full h-[400px] p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs resize-none bg-slate-50"
            />
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Live Preview
              </div>
              {imageUrl && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-center min-h-[400px] overflow-hidden relative">
              {/* Checkerboard background */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
              
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Decoded Preview" 
                  className="max-w-full max-h-full object-contain relative z-10 shadow-sm border border-slate-200 bg-white"
                  onError={() => {
                    setImageUrl(null);
                    setError('The provided string is not a valid image.');
                  }}
                />
              ) : (
                <div className="text-center text-slate-400 relative z-10">
                  <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p>Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
