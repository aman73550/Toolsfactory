import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Code2, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ToolSkeleton } from './Skeleton';

interface GeneratedTool {
  name: string;
  slug: string;
  description: string;
  category: string;
  component: string;
  seoTitle: string;
  seoDescription: string;
  blogContent: string;
  faqs: Array<{ question: string; answer: string }>;
}

/**
 * Admin Tool Maker
 * Generate new tools via AI prompt
 */
export function ToolMaker() {
  const { add: toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedTool, setGeneratedTool] = useState<GeneratedTool | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'seo' | 'blog'>('code');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast('Please describe the tool you want to create', 'warning');
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedTool(null);

    try {
      const response = await fetch('/api/admin/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setGeneratedTool(data.tool);
      toast('Tool generated successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast(`Error: ${errorMessage}`, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedTool) return;

    try {
      const response = await fetch('/api/admin/save-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: generatedTool }),
      });

      if (!response.ok) throw new Error('Failed to save tool');

      toast('Tool saved successfully!', 'success');
      setGeneratedTool(null);
      setPrompt('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast(`Error: ${errorMessage}`, 'error');
    }
  };

  const handleCopyCode = () => {
    if (generatedTool?.component) {
      navigator.clipboard.writeText(generatedTool.component);
      toast('Code copied to clipboard', 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Tool Generator</h2>
        <p className="text-slate-600 mb-4">
          Describe the tool you want to create. The AI will generate React code, SEO content, and blog material.
        </p>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="E.g., A tool that converts Markdown to HTML with live preview. Include features like syntax highlighting, dark mode, and download options. Support for CommonMark and GitHub Flavored Markdown."
            rows={5}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          />

          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader size={20} className="animate-spin" />
                Generating Tool...
              </>
            ) : (
              'Generate Tool'
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Generation Failed</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Tool Preview */}
      {generating ? (
        <ToolSkeleton />
      ) : generatedTool ? (
        <div className="space-y-6">
          {/* Tool Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{generatedTool.name}</h3>
                <p className="text-sm text-slate-600 mt-1">Slug: <code className="bg-slate-100 px-2 py-1 rounded">{generatedTool.slug}</code></p>
                <p className="text-sm text-slate-600">Category: <span className="font-medium">{generatedTool.category}</span></p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>

            <p className="text-slate-700">{generatedTool.description}</p>
          </div>

          {/* Tabbed Content */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50">
              {[
                { id: 'code', label: 'Component Code', icon: Code2 },
                { id: 'seo', label: 'SEO Data', icon: null },
                { id: 'blog', label: 'Blog Content', icon: null },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'code' | 'seo' | 'blog')}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.id === 'code' && <Code2 size={16} className="inline mr-2" />}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {activeTab === 'code' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-900">Generated React Component</p>
                    <button
                      onClick={handleCopyCode}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
                    >
                      <Copy size={16} /> Copy
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto">
                    {generatedTool.component}
                  </pre>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">SEO Title</p>
                    <p className="text-slate-700 p-3 bg-slate-50 rounded">{generatedTool.seoTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">SEO Description</p>
                    <p className="text-slate-700 p-3 bg-slate-50 rounded">{generatedTool.seoDescription}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-2">FAQs</p>
                    <div className="space-y-3">
                      {generatedTool.faqs.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded">
                          <p className="font-medium text-slate-900 text-sm">{faq.question}</p>
                          <p className="text-slate-600 text-sm mt-1">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-3">Blog Content (500-800 words)</p>
                  <div className="bg-slate-50 p-4 rounded prose prose-sm max-w-none">
                    <p className="text-slate-700 whitespace-pre-wrap">{generatedTool.blogContent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setGeneratedTool(null);
                setPrompt('');
              }}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-slate-400 transition-colors"
            >
              Generate Another
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Save Tool to Platform
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
