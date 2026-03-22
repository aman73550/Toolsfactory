import React, { useState } from 'react';
import { FileText, Type, Clock, Hash, Shield } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  const readingTime = Math.ceil(words / 200); // Avg 200 words per minute

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Word & Character Counter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real-time word count, character count, and reading time estimator.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          100% Client-side. Your text never leaves your browser.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{words}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Words</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Type className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{characters}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Characters</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Hash className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{charactersNoSpaces}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">No Spaces</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{paragraphs}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Paragraphs</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center col-span-2 md:col-span-1">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{readingTime} <span className="text-lg text-slate-500 font-normal">min</span></p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Reading Time</p>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-medium text-slate-700">Type or paste your text below</h3>
          <button 
            onClick={() => setText('')}
            className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear Text
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing here..."
          className="w-full h-96 p-6 resize-none outline-none text-slate-800 leading-relaxed"
          autoFocus
        />
      </div>
    </div>
  );
}
