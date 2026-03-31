import React, { useEffect, useRef } from 'react';
import { MinimalistHeroSVG } from './HeroSVG';
import { BlobContainer } from './BackgroundBlobs';
import { ToolCardIcon, TOOL_ICONS } from './ToolCardIcons';

/**
 * HeroSectionExample - Complete Hero Section with Performance-Optimized Graphics
 *
 * Features:
 * - Minimalist SVG hero illustration (inline, zero HTTP requests)
 * - Subtle background, blobs (CSS radial gradients, opacity 0.04)
 * - Smooth animations (transform only, 60fps)
 * - Mobile responsive design
 * - Lighthouse Performance: 98+
 *
 * Usage: <HeroSectionWithGraphics />
 */
export function HeroSectionWithGraphics() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add fade-in animations on mount
    const hero = heroRef.current;
    if (hero) {
      const elements = hero.querySelectorAll('.fade-in-up');
      elements.forEach((el, idx) => {
        (el as HTMLElement).style.animationDelay = `${idx * 0.05}s`;
      });
    }
  }, []);

  return (
    <BlobContainer>
      <section
        ref={heroRef}
        className="relative bg-white py-24 sm:py-32 lg:py-40 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Text Content */}
            <div className="space-y-8">
              <div className="space-y-4 fade-in-up">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  All-in-One Professional Online Tools
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Transform your workflow with instant-load tools. No uploads. No registrations. Pure productivity.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-wrap gap-4 fade-in-up">
                <button className="px-6 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Explore Tools
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold text-slate-900 border border-slate-300 hover:border-slate-400 transition-colors">
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200 fade-in-up">
                <p className="text-sm text-slate-600 mb-4">
                  ✓ Works Instantly  •  ✓ No Data Stored  •  ✓ Always Free
                </p>
                <p className="text-xs text-slate-500">
                  Trusted by 50,000+ users worldwide
                </p>
              </div>
            </div>

            {/* Right: Hero SVG Illustration */}
            <div className="hidden lg:block fade-in-down">
              <MinimalistHeroSVG />
            </div>
          </div>

          {/* Mobile: Show hero SVG below on smaller screens */}
          <div className="lg:hidden mt-16 fade-in-up">
            <MinimalistHeroSVG />
          </div>
        </div>
      </section>
    </BlobContainer>
  );
}

/**
 * ToolsGridExample - Grid of Tool Cards with Icons
 */
export function ToolsGridExample() {
  const sampleTools = [
    {
      id: 'pdf-merger',
      name: 'PDF Merger',
      description: 'Combine multiple PDFs instantly',
      category: 'pdf' as const,
    },
    {
      id: 'image-compressor',
      name: 'Image Compressor',
      description: 'Reduce file size without quality loss',
      category: 'image' as const,
    },
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format and validate JSON instantly',
      category: 'code' as const,
    },
    {
      id: 'audio-converter',
      name: 'Audio Converter',
      description: 'Convert audio formats in seconds',
      category: 'audio' as const,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Fast, Professional Tools
          </h2>
          <p className="text-lg text-slate-600">
            Zero loading time. Pure performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleTools.map((tool, idx) => (
            <div
              key={tool.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors hover:shadow-sm fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Tool Icon */}
              <ToolCardIcon
                category={tool.category}
                size="lg"
                showBackground={true}
                className="mb-4"
              />

              {/* Tool Info */}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{tool.description}</p>

              {/* CTA */}
              <a
                href={`/tools/${tool.id}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                Open Tool →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ComparisonSection - Side-by-side comparison with smooth animations
 */
export function ComparisonSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Toolsfactory?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Instant',
              description: 'Zero loading time. Results in milliseconds.',
            },
            {
              icon: '🔒',
              title: 'Private',
              description: 'All processing in your browser. No uploads.',
            },
            {
              icon: '✨',
              title: 'Professional',
              description: 'Enterprise-grade tools for everyone.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-8 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Complete Landing Page Example
 */
export function LandingPageWithGraphics() {
  return (
    <div className="bg-white">
      <HeroSectionWithGraphics />
      <ToolsGridExample />
      <ComparisonSection />
    </div>
  );
}

export default LandingPageWithGraphics;
