import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Trash2, Check } from 'lucide-react';

export default function Base64Converter() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');
    
    if (!text) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch (err) {
      setOutput('');
      setError(currentMode === 'decode' ? 'Invalid Base64 string' : 'Error encoding text');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    handleProcess(output, newMode); // Swap input and output
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Base64 Encode & Decode</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert text to Base64 format or decode Base64 back to normal text instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Mode Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => { setMode('encode'); handleProcess(input, 'encode'); }}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${mode === 'encode' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => { setMode('decode'); handleProcess(input, 'decode'); }}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${mode === 'decode' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Input */}
          <div className="flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-medium text-slate-700">{mode === 'encode' ? 'Text Input' : 'Base64 Input'}</h3>
              <button onClick={() => handleProcess('', mode)} className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleProcess(e.target.value, mode)}
              placeholder={mode === 'encode' ? "Type text to encode..." : "Paste Base64 to decode..."}
              className="flex-1 p-6 resize-none outline-none text-slate-800 font-mono text-sm leading-relaxed"
              autoFocus
            />
          </div>

          {/* Output */}
          <div className="flex flex-col h-[400px] bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
              <h3 className="font-medium text-slate-700">{mode === 'encode' ? 'Base64 Output' : 'Text Output'}</h3>
              <button 
                onClick={handleCopy}
                disabled={!output}
                className={`text-sm flex items-center gap-1 font-medium ${copied ? 'text-emerald-600' : 'text-indigo-600 hover:text-indigo-800'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 p-6 overflow-auto relative">
              {error ? (
                <div className="text-red-500 font-medium flex items-center justify-center h-full">
                  {error}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 break-all">
                  {output || <span className="text-slate-400 italic">Output will appear here...</span>}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
