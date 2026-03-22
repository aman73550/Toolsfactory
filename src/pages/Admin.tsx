import React, { useState } from 'react';
import { Loader2, Wand2, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Admin() {
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Text');
  const [apiKey, setApiKey] = useState(localStorage.getItem('custom_api_key') || 'AIzaSyBw5-N169UtXfJ3lMbAVFgC_PonltAN6X4');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    if (val) {
      localStorage.setItem('custom_api_key', val);
    } else {
      localStorage.removeItem('custom_api_key');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !name) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, name, category, customApiKey: apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate tool');
      }

      setStatus({ type: 'success', message: `Tool "${data.tool.name}" created successfully!` });
      setPrompt('');
      setName('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Meta-Admin Panel
        </h1>
        <p className="mt-2 text-slate-600">
          Generate new tools dynamically using the AI Tool Creator.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Tool Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., JSON Formatter"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="Text">Text</option>
                <option value="Image">Image</option>
                <option value="PDF">PDF</option>
                <option value="Security">Security</option>
                <option value="Utility">Utility</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="apiKey" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Key className="w-4 h-4 text-slate-500" />
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Leave blank to use default platform key"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <p className="mt-1 text-xs text-slate-500">
              If you hit rate limits, you can provide your own Gemini API key. It will be saved locally in your browser.
            </p>
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
              Tool Description / Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what the tool should do in detail..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex-1">
              {status && (
                <div className={cn(
                  "flex items-center gap-2 text-sm",
                  status.type === 'success' ? "text-emerald-600" : "text-red-600"
                )}>
                  {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {status.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !prompt || !name}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Tool
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
