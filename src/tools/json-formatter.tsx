import React, { useState } from 'react';
import { Copy, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          JSON Formatter & Validator
        </h1>
        <p className="mt-2 text-slate-600">
          Format, validate, and beautify your JSON data instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-medium text-slate-700">Input JSON</h2>
            <button
              onClick={handleFormat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Format
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your JSON here..."
            className="flex-1 w-full p-4 font-mono text-sm text-slate-700 resize-none outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/20"
            spellCheck={false}
          />
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-medium text-slate-700">Formatted Output</h2>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          
          {error ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-600 mb-1">Invalid JSON</p>
              <p className="text-xs text-slate-500 font-mono max-w-sm break-words">{error}</p>
            </div>
          ) : (
            <pre className="flex-1 w-full p-4 font-mono text-sm text-slate-700 overflow-auto">
              <code>{output || 'Output will appear here...'}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
