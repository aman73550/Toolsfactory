import React, { useState } from 'react';
import { Type, Copy, Trash2, Check } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toSentenceCase = () => {
    const result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(result);
  };

  const toTitleCase = () => {
    const result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    setText(result);
  };

  const toAlternatingCase = () => {
    const result = text.toLowerCase().split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
    setText(result);
  };

  const toInverseCase = () => {
    const result = text.split('').map(char => {
      if (char === char.toUpperCase()) return char.toLowerCase();
      if (char === char.toLowerCase()) return char.toUpperCase();
      return char;
    }).join('');
    setText(result);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Case Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Easily convert text between upper case, lower case, title case, and more.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-2">
          <button onClick={() => setText(text.toUpperCase())} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            UPPER CASE
          </button>
          <button onClick={() => setText(text.toLowerCase())} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            lower case
          </button>
          <button onClick={toTitleCase} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            Title Case
          </button>
          <button onClick={toSentenceCase} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            Sentence case
          </button>
          <button onClick={toAlternatingCase} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            aLtErNaTiNg cAsE
          </button>
          <button onClick={toInverseCase} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            InVeRsE CaSe
          </button>
        </div>

        {/* Editor */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-80 p-6 resize-none outline-none text-slate-800 leading-relaxed text-lg"
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="text-sm font-medium text-slate-500 flex gap-4">
            <span>Character Count: <strong className="text-slate-800">{text.length}</strong></span>
            <span>Word Count: <strong className="text-slate-800">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong></span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setText('')}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
