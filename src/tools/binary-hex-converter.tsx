import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

type Format = 'text' | 'binary' | 'hex' | 'decimal';

export default function BinaryHexConverter() {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState<Format>('text');
  const [outputFormat, setOutputFormat] = useState<Format>('binary');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const convert = (val: string, from: Format, to: Format) => {
    if (!val) return '';
    
    try {
      // First convert input to a string of characters or numbers
      let textStr = '';
      
      if (from === 'text') {
        textStr = val;
      } else if (from === 'binary') {
        const cleanBin = val.replace(/[^01]/g, '');
        if (cleanBin.length % 8 !== 0 && cleanBin.length > 0) {
          throw new Error('Binary length must be a multiple of 8');
        }
        const bytes = cleanBin.match(/.{1,8}/g) || [];
        textStr = bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
      } else if (from === 'hex') {
        const cleanHex = val.replace(/[^0-9a-fA-F]/g, '');
        if (cleanHex.length % 2 !== 0 && cleanHex.length > 0) {
          throw new Error('Hex length must be a multiple of 2');
        }
        const bytes = cleanHex.match(/.{1,2}/g) || [];
        textStr = bytes.map(b => String.fromCharCode(parseInt(b, 16))).join('');
      } else if (from === 'decimal') {
        const nums = val.split(/[\s,]+/).filter(n => n.trim() !== '');
        textStr = nums.map(n => String.fromCharCode(parseInt(n, 10))).join('');
      }

      // Then convert text to target format
      if (to === 'text') {
        return textStr;
      } else if (to === 'binary') {
        return Array.from(textStr).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      } else if (to === 'hex') {
        return Array.from(textStr).map(c => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join(' ');
      } else if (to === 'decimal') {
        return Array.from(textStr).map(c => c.charCodeAt(0).toString(10)).join(' ');
      }
      
      return '';
    } catch (err: any) {
      setError(err.message || 'Invalid input for the selected format');
      return '';
    }
  };

  useEffect(() => {
    setError('');
    const result = convert(input, inputFormat, outputFormat);
    setOutput(result);
  }, [input, inputFormat, outputFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapFormats = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInput(output);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Binary & Hex Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert seamlessly between Text, Binary, Hexadecimal, and Decimal formats.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Input</label>
              <select 
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value as Format)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
              >
                <option value="text">Text</option>
                <option value="binary">Binary</option>
                <option value="hex">Hexadecimal</option>
                <option value="decimal">Decimal</option>
              </select>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${inputFormat} here...`}
              className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
            />
            {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button 
              onClick={swapFormats}
              className="p-3 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Output</label>
              <select 
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as Format)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
              >
                <option value="text">Text</option>
                <option value="binary">Binary</option>
                <option value="hex">Hexadecimal</option>
                <option value="decimal">Decimal</option>
              </select>
            </div>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder={`Result will appear here...`}
                className="w-full h-64 p-4 rounded-xl border border-slate-300 bg-white outline-none font-mono text-sm resize-none text-slate-800"
              />
              {output && (
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
