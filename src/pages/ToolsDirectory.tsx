/**
 * Tools Directory - Professional categorized tool browser
 * Clean, minimal design with 60:30:10 rule
 * Zero AI fingerprint
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Grid } from 'lucide-react';
import { cn } from '../lib/utils';
import { ToolCardIcon } from '../components/graphics/ToolCardIcons';

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

interface CategoryGroup {
  name: string;
  description: string;
  tools: Tool[];
  color: string;
}

const CATEGORY_INFO: Record<string, { description: string; color: string }> = {
  'PDF': { description: 'Merge, split, edit, and transform PDF documents', color: '#EF4444' },
  'Image': { description: 'Resize, compress, edit, and convert images', color: '#F59E0B' },
  'Text': { description: 'Format, convert, compress, and analyze text', color: '#3B82F6' },
  'Typing': { description: 'Test your typing speed and improve accuracy', color: '#8B5CF6' },
  'Web': { description: 'Developer utilities and web tools', color: '#06B6D4' },
  'Converter': { description: 'Convert between various file formats', color: '#10B981' },
  'Media': { description: 'Edit audio, video, and multimedia files', color: '#EC4899' },
  'Train': { description: 'Rail status and booking information', color: '#6366F1' },
};

export default function ToolsDirectory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        setTools(data);
        // Auto-expand first category
        const firstCategory = Array.from(new Set(data.map((t: Tool) => t.category)))[0] as string;
        setExpandedCategory(firstCategory);
      })
      .catch(err => console.error('Failed to load tools:', err));
  }, []);

  // Group tools by category
  const groupedTools = useMemo(() => {
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, Tool[]> = {};
    filtered.forEach(tool => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });

    return Object.entries(groups)
      .map(([category, categoryTools]) => ({
        name: category,
        description: CATEGORY_INFO[category]?.description || 'Utilities and tools',
        color: CATEGORY_INFO[category]?.color || '#4F46E5',
        tools: categoryTools.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tools, searchQuery]);

  const totalTools = useMemo(() => tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).length, [tools, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                All Tools
              </h1>
              <p className="text-slate-600">
                Browse {totalTools} professional tools organized by category
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          {groupedTools.length > 0 ? (
            groupedTools.map((group, idx) => (
              <div
                key={group.name}
                className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
              >
                {/* Category Header */}
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === group.name ? '' : group.name)
                  }
                  className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    {/* Category Color */}
                    <div
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                        {group.name}
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">{group.description}</p>
                    </div>
                  </div>

                  {/* Badge + Chevron */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium">
                      {group.tools.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-slate-400 transition-transform',
                        expandedCategory === group.name && 'rotate-180'
                      )}
                    />
                  </div>
                </button>

                {/* Tools Grid (Expandable) */}
                {expandedCategory === group.name && (
                  <div className="border-t border-slate-200 p-6 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.tools.map((tool) => (
                        <button
                          key={tool.slug}
                          onClick={() => navigate(`/tools/${tool.slug}`)}
                          className="text-left p-4 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <ToolCardIcon category={group.name.toLowerCase()} size="md" showBackground={true} />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {tool.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Grid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
