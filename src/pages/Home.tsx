/**
 * Clean Professional Homepage
 * - Minimal hero with search focus
 * - Trust indicators
 * - Single CTA to explore tools
 * 60:30:10 design rule, Zero AI fingerprint
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Zap, Shield, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { BlobContainer } from '../components/graphics/BackgroundBlobs';

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => setTools(data))
      .catch(err => console.error('Failed to load tools:', err));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTools = tools
    .filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 8);

  const handleSearch = (slug: string) => {
    navigate(`/tools/${slug}`);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <BlobContainer>
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32 lg:py-40 bg-white overflow-hidden">
          <div className="max-w-3xl w-full text-center space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900">
                All-in-One Professional Tools
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Free, fast, and secure. Everything runs in your browser. No installation required.
              </p>
            </div>

            {/* Search Bar - Primary CTA */}
            <div className="relative max-w-2xl mx-auto w-full" ref={searchRef}>
              <div
                className={cn(
                  'relative flex items-center w-full bg-white rounded-2xl border-2 transition-all duration-300',
                  isSearchFocused
                    ? 'border-indigo-500 shadow-lg'
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
                )}
              >
                <Search className="w-6 h-6 text-slate-400 ml-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search 100+ tools..."
                  className="w-full px-4 py-5 text-lg bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden z-50">
                  {filteredTools.length > 0 ? (
                    <ul className="divide-y divide-slate-200">
                      {filteredTools.map((tool) => (
                        <li key={tool.slug}>
                          <button
                            onClick={() => handleSearch(tool.slug)}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {tool.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No tools found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700">
                ✓ Instant Processing  •  ✓ Privacy Protected  •  ✓ Always Free
              </p>
              <p className="text-xs text-slate-500">Used by 50,000+ professionals</p>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => navigate('/tools')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
              >
                Explore All 100+ Tools
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </BlobContainer>

      {/* Why Choose Us */}
      <section className="bg-slate-50 border-t border-slate-200 py-20 px-4 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Toolsfactory?
            </h2>
            <p className="text-slate-600 text-lg">
              Professional-grade utilities for every use case
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Tools run locally in your browser. No upload delays, instant results.',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'Your files never leave your device. We never store sensitive data.',
              },
              {
                icon: Heart,
                title: '100% Free',
                description: 'No subscriptions, no hidden fees, no annoying watermarks ever.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="space-y-4 p-6 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white border-t border-slate-200 py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-600 mb-6">Ready to get started?</p>
          <button
            onClick={() => navigate('/tools')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse All Tools
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
