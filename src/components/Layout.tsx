import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings2, Wrench, Search, Github, Twitter, Linkedin, Clock3, X } from 'lucide-react';

type LimitState = {
  open: boolean;
  retryAfterSec: number;
};

export default function Layout() {
  const location = useLocation();
  const [limitState, setLimitState] = useState<LimitState>({ open: false, retryAfterSec: 0 });

  useEffect(() => {
    const handleRateLimited = (event: Event) => {
      const detail = (event as CustomEvent<{ retryAfterMs?: number }>).detail;
      const retryAfterSec = Math.ceil((detail?.retryAfterMs || 60_000) / 1000);
      setLimitState({ open: true, retryAfterSec });
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 429) {
        try {
          const payload = await response.clone().json();
          if (payload?.code === 'RATE_LIMITED') {
            window.dispatchEvent(new CustomEvent('app:rate-limited', { detail: payload }));
          }
        } catch {
          window.dispatchEvent(new CustomEvent('app:rate-limited', { detail: {} }));
        }
      }
      return response;
    };

    window.addEventListener('app:rate-limited', handleRateLimited as EventListener);
    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('app:rate-limited', handleRateLimited as EventListener);
    };
  }, []);

  return (
    <div className="surface-blob min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <header className="glass-header sticky top-0 z-50 bg-white/80 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-900">
                All-in-One Tools
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  placeholder="Search tools..."
                />
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tools
              </Link>
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  location.pathname === '/admin' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg tracking-tight text-slate-900">
                  All-in-One Tools
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                A high-performance, privacy-first platform featuring a suite of online tools for PDF, Image, Text, and Security processing.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Products</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">PDF Tools</Link></li>
                <li><Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Image Tools</Link></li>
                <li><Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Text Utilities</Link></li>
                <li><Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Developer Tools</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Contact</Link></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} All-in-One Tools. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {limitState.open && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 glass-scrim">
          <div className="premium-card w-full max-w-md rounded-3xl p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Take a Break</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  You have reached the request limit for this minute. Pause for a moment and try again.
                </p>
              </div>
              <button
                onClick={() => setLimitState({ open: false, retryAfterSec: 0 })}
                className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 grid place-items-center hover:border-slate-300 transition-colors"
                aria-label="Close rate limit notice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                Suggested wait time
              </div>
              <div className="text-lg font-semibold text-slate-900">{Math.max(1, limitState.retryAfterSec)}s</div>
            </div>

            <button
              onClick={() => setLimitState({ open: false, retryAfterSec: 0 })}
              className="primary-action mt-6 w-full rounded-xl px-4 py-3 font-medium"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
