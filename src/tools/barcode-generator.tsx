import React, { useState, useEffect, useRef } from 'react';
import { Download, ScanBarcode, Settings } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !text) {
      setError(null);
      return;
    }

    try {
      JsBarcode(svgRef.current, text, {
        format: format,
        lineColor: lineColor,
        background: background,
        width: width,
        height: height,
        displayValue: displayValue,
        valid: function(valid) {
          if (!valid) {
            setError(`Invalid data for ${format} format.`);
          } else {
            setError(null);
          }
        }
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate barcode");
    }
  }, [text, format, lineColor, background, width, height, displayValue]);

  const handleDownload = () => {
    if (!svgRef.current || error) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `barcode-${format}.png`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          a.remove();
        }, 'image/png');
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Barcode Generator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create standard barcodes (Code 128, EAN, UPC) instantly and download them as PNG.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Barcode Content</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter text or numbers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="CODE128">Code 128 (Auto)</option>
                  <option value="CODE39">Code 39</option>
                  <option value="EAN13">EAN-13</option>
                  <option value="EAN8">EAN-8</option>
                  <option value="UPC">UPC</option>
                  <option value="ITF14">ITF-14</option>
                  <option value="MSI">MSI</option>
                  <option value="pharmacode">Pharmacode</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Line Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={lineColor} 
                      onChange={(e) => setLineColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-none p-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={background} 
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-none p-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bar Width: {width}px</label>
                <input 
                  type="range" min="1" max="4" step="1"
                  value={width} 
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height: {height}px</label>
                <input 
                  type="range" min="10" max="250" step="10"
                  value={height} 
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="displayValue"
                  checked={displayValue} 
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="displayValue" className="text-sm font-medium text-slate-700">
                  Show Text Below Barcode
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <button 
                onClick={handleDownload}
                disabled={!!error || !text}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" /> Download PNG
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-1">
                <ScanBarcode className="w-3 h-3" />
                Live Preview
              </span>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center min-w-[300px] min-h-[200px] overflow-x-auto">
              {error ? (
                <div className="text-red-500 text-center font-medium max-w-xs">
                  {error}
                </div>
              ) : text ? (
                <svg ref={svgRef} className="max-w-full h-auto"></svg>
              ) : (
                <div className="text-slate-400 text-center">
                  Enter text to generate barcode
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
