import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Heart, ArrowRight, Settings, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { MinimalistHeroSVG } from '../components/graphics/HeroSVG';
import { BlobContainer } from '../components/graphics/BackgroundBlobs';
import { ToolCardIcon } from '../components/graphics/ToolCardIcons';

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        setTools(data);
        // Set first category as active
        const cats = Array.from(new Set(data.map((t: Tool) => t.category))).sort();
        if (cats.length > 0) {
          setActiveCategory(cats[0] as string);
        }
      })
      .catch(err => console.error('Failed to load tools:', err));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  // Get all unique categories sorted alphabetically
  const categories = Array.from(new Set(tools.map(tool => tool.category)))
    .sort((a, b) => a.localeCompare(b)) as string[];

  // Get tools in active category
  const toolsInCategory = tools
    .filter(tool => tool.category === activeCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section with Graphics */}
      <BlobContainer>
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 fade-in-up">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-slate-900">
                    All-in-One Professional <span className="text-indigo-600">Online Tools</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                    Fast, secure, and free tools for developers, creators, and everyday users. No installation required. Everything runs instantly in your browser.
                  </p>
                </div>

                {/* Smart Search Bar */}
                <div className="relative max-w-2xl" ref={searchRef}>
                  <div className={cn(
                    "relative flex items-center w-full bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm",
                    isSearchFocused ? "border-indigo-500 shadow-lg" : "border-slate-200 hover:border-slate-300"
                  )}>
                    <Search className="w-6 h-6 text-slate-400 ml-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search tools (e.g., 'PDF', 'Compress', 'Image')..."
                      className="w-full px-4 py-4 text-lg bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => {
                        if (filteredTools.length > 0) {
                          navigate(`/tools/${filteredTools[0].slug}`);
                          setIsSearchFocused(false);
                        }
                      }}
                      className="hidden sm:flex items-center gap-2 px-6 py-2 mr-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                      Select First Match <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Animated Dropdown */}
                  {isSearchFocused && searchQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden z-50">
                      {filteredTools.length > 0 ? (
                        <ul className="py-2">
                          {filteredTools.map(tool => (
                            <li key={tool.slug}>
                              <button
                                type="button"
                                onClick={() => {
                                  navigate(`/tools/${tool.slug}`);
                                  setIsSearchFocused(false);
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                              >
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
                                  <Settings className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate">{tool.name}</h4>
                                  <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-6 text-center text-slate-500">
                          No tools found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-slate-200 space-y-2 fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <p className="text-sm text-slate-600">
                    ✓ Works Instantly  •  ✓ No Data Stored  •  ✓ Always Free
                  </p>
                  <p className="text-xs text-slate-500">
                    Trusted by 50,000+ users worldwide
                  </p>
                </div>
              </div>

              {/* Right: Hero SVG Illustration */}
              <div className="hidden lg:flex justify-center fade-in-down">
                <MinimalistHeroSVG />
              </div>
            </div>

            {/* Mobile: Show hero SVG below on smaller screens */}
            <div className="lg:hidden mt-12 flex justify-center fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-full max-w-md">
                <MinimalistHeroSVG />
              </div>
            </div>
          </div>
        </section>
      </BlobContainer>

      {/* Why Choose Us - Updated Design */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Toolsfactory?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Professional-grade tools designed for speed, security, and simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors fade-in-up" style={{ animationDelay: '0s' }}>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">Most tools run locally in your browser, ensuring zero upload wait times and instant results.</p>
            </div>

            <div className="space-y-4 p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors fade-in-up" style={{ animationDelay: '0.05s' }}>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Privacy First</h3>
              <p className="text-slate-600 text-sm">Your files never leave your device for client-side tools. We don't store your sensitive data.</p>
            </div>

            <div className="space-y-4 p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">100% Free</h3>
              <p className="text-slate-600 text-sm">Access professional-grade utilities without subscriptions, hidden fees, or annoying watermarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Browser */}
      {categories.length > 0 && (
        <section className="border-t border-slate-200 py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-slate-600 text-lg">
                Explore tools organized by type
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-12 pb-6 border-b border-slate-200 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools Grid for Active Category */}
            {toolsInCategory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolsInCategory.map((tool, idx) => (
                  <button
                    key={tool.slug}
                    onClick={() => navigate(`/tools/${tool.slug}`)}
                    className="group text-left p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all fade-in-up"
                    style={{ animationDelay: `${(idx % 6) * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <ToolCardIcon category={(tool.category as any) || 'code'} size="md" showBackground={true} />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{tool.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No tools found in this category</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Tools Preview */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Popular Tools
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Explore some of our most popular utilities
            </p>
          </div>

          {tools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.slice(0, 6).map((tool, idx) => (
                <button
                  key={tool.slug}
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="group text-left p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <ToolCardIcon category={(tool.category as any) || 'code'} size="md" showBackground={true} />
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{tool.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading tools...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => {
                // Scroll to tools section or navigate to tools browse page
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse All Tools →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
