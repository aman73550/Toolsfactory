import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings2, Wrench, Search, Github, Twitter, Linkedin } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
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
    </div>
  );
}
