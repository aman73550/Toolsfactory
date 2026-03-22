import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Heart, ArrowRight, Settings, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

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
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

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

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6); // Max 6 results in dropdown

  const popularSlugs = ['youtube-downloader', 'image-compress', 'reorder-pdf', 'qr-code-generator'];
  const popularTools = tools.filter(t => popularSlugs.includes(t.slug));
  // Fallback if specific slugs aren't found
  const displayPopular = popularTools.length > 0 ? popularTools : tools.slice(0, 4);

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-white">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            All-in-One Professional <span className="text-indigo-600">Online Tools</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Fast, secure, and free tools for developers, creators, and everyday users. No installation required.
          </p>

          {/* Smart Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-8" ref={searchRef}>
            <div className={cn(
              "relative flex items-center w-full bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm",
              isSearchFocused ? "border-indigo-500 shadow-indigo-100 shadow-xl" : "border-slate-200 hover:border-slate-300"
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
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-6 py-2 mr-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Animated Dropdown */}
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                {filteredTools.length > 0 ? (
                  <ul className="py-2">
                    {filteredTools.map(tool => (
                      <li key={tool.slug}>
                        <Link 
                          to={`/tools/${tool.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Settings className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="text-sm font-semibold text-slate-900">{tool.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
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
        </div>
      </section>

      {/* Below the Fold: Most Popular & Why Choose Us */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Most Popular Tools */}
          {displayPopular.length > 0 && (
            <div>
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6 text-center">Most Popular Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayPopular.map(tool => (
                  <Link 
                    key={tool.slug} 
                    to={`/tools/${tool.slug}`}
                    className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-center group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">{tool.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us */}
          <div className="grid md:grid-cols-3 gap-8 text-center pt-8 border-t border-slate-200">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">Lightning Fast</h4>
              <p className="text-sm text-slate-600">Most tools run locally in your browser, ensuring zero upload wait times and instant results.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">Privacy First</h4>
              <p className="text-sm text-slate-600">Your files never leave your device for client-side tools. We don't store your sensitive data.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">100% Free</h4>
              <p className="text-sm text-slate-600">Access professional-grade utilities without subscriptions, hidden fees, or annoying watermarks.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
