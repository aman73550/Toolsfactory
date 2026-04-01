/**
 * Sticky Navigation Header
 * Glassmorphism design with backdrop blur
 * Professional navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StickyHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', active: location.pathname === '/' },
    { label: 'All Tools', href: '/tools', active: location.pathname === '/tools' },
    { label: 'PDF Tools', href: '/tools?category=PDF', active: false },
    { label: 'Train Status', href: '/tools?category=Train', active: false },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/60'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors"
        >
          Toolsfactory
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                link.active
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <button
            onClick={() => navigate('/tools')}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors hidden sm:flex"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <nav className="flex flex-col divide-y divide-slate-200">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  navigate(link.href);
                  setIsOpen(false);
                }}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium transition-colors',
                  link.active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
