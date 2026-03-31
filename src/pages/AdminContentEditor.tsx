import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface ContentEditor {
  toolId: string;
  seoTitle: string;
  seoDescription: string;
  blogContent: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function AdminContentEditor() {
  const [tools, setTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [content, setContent] = useState<ContentEditor | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/admin/tools', {
          credentials: 'include',
        });
        const data = await response.json();
        setTools(data.map((t: any) => t.id));
        if (data.length > 0) {
          setSelectedTool(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    if (!selectedTool) return;

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/admin/content/${selectedTool}`, {
          credentials: 'include',
        });
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };

    fetchContent();
  }, [selectedTool]);

  const handleSave = async () => {
    if (!content || !selectedTool) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/content/${selectedTool}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(content),
      });

      alert('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Content Editor</h1>
        <p className="text-slate-600 mt-1">Edit SEO metadata and blog content</p>
      </div>

      <div className="flex gap-4">
        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
        >
          <option value="">Select a tool</option>
          {tools.map((toolId) => (
            <option key={toolId} value={toolId}>
              Tool {toolId}
            </option>
          ))}
        </select>
      </div>

      {content && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={content.seoTitle}
                  onChange={(e) => setContent({ ...content, seoTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SEO Description</label>
                <textarea
                  value={content.seoDescription}
                  onChange={(e) => setContent({ ...content, seoDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Blog Content</h2>
            <textarea
              value={content.blogContent}
              onChange={(e) => setContent({ ...content, blogContent: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-900 resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
