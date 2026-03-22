import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { HelpCircle, Settings, ChevronRight } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

// Dynamically import all tools
const toolModules = import.meta.glob('../tools/*.tsx');

interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export default function ToolLoader() {
  const { slug } = useParams<{ slug: string }>();
  const [toolConfig, setToolConfig] = useState<ToolConfig | null>(null);
  const [relatedTools, setRelatedTools] = useState<ToolConfig[]>([]);

  useEffect(() => {
    // Fetch tool metadata
    fetch('/api/tools')
      .then(res => res.json())
      .then((data: ToolConfig[]) => {
        const current = data.find(t => t.slug === slug);
        if (current) {
          setToolConfig(current);
          setRelatedTools(data.filter(t => t.category === current.category && t.slug !== slug).slice(0, 4));
        }
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const importFn = toolModules[`../tools/${slug}.tsx`];

  if (!importFn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Tool Not Found</h2>
        <p className="text-slate-600">The tool you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const ToolComponent = lazy(importFn as any);

  // Generate JSON-LD Schema
  const schemaData = toolConfig ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the ${toolConfig.name} free to use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, our ${toolConfig.name} is completely free to use with no hidden charges or subscriptions required.`
        }
      },
      {
        "@type": "Question",
        "name": `Is my data secure when using the ${toolConfig.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We prioritize your privacy. Most of our tools process files locally in your browser, meaning your data never leaves your device."
        }
      },
      {
        "@type": "Question",
        "name": `How do I use the ${toolConfig.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your file or enter your input in the tool interface above, adjust any necessary settings, and click the action button to get your instant results."
        }
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {schemaData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      )}

      {/* Section 1: Tool Hero (The Utility) */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {toolConfig && (
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{toolConfig.name}</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">{toolConfig.description}</p>
            </div>
          )}
          
          <div className="w-full">
            <Suspense fallback={<SkeletonLoader />}>
              <ToolComponent />
            </Suspense>
          </div>
        </div>
      </section>

      {toolConfig && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-16">
          
          {/* Section 2: Step-by-Step Guide */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to use {toolConfig.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                <h3 className="font-semibold text-slate-800 mb-2">Upload / Input</h3>
                <p className="text-sm text-slate-600">Select your file or paste your input into the tool interface above.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                <h3 className="font-semibold text-slate-800 mb-2">Process</h3>
                <p className="text-sm text-slate-600">Adjust any optional settings and let our fast engine process your request.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                <h3 className="font-semibold text-slate-800 mb-2">Download</h3>
                <p className="text-sm text-slate-600">Get your results instantly. Download the output file securely to your device.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Technical Blog/Article */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding the {toolConfig.name}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              In today's fast-paced digital world, efficiency is key. Our <strong>{toolConfig.name}</strong> is designed to streamline your workflow by providing a fast, reliable, and secure way to handle your {toolConfig.category.toLowerCase()} tasks. Whether you are a professional developer, a digital marketer, or a student, this tool eliminates the need for complex software installations.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Built with modern web technologies, this utility ensures that your processing is done with maximum performance. For many of our tools, the processing happens entirely within your browser (client-side), which means your sensitive data never touches our servers, guaranteeing 100% privacy.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Why use our tool?</h3>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li><strong>Speed:</strong> Instant processing without queue times.</li>
              <li><strong>Security:</strong> Privacy-first architecture.</li>
              <li><strong>Accessibility:</strong> Works on Windows, Mac, Linux, iOS, and Android.</li>
              <li><strong>Cost:</strong> 100% free with no hidden limits.</li>
            </ul>
          </section>

          {/* Section 4: FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Is the {toolConfig.name} free to use?</h4>
                <p className="text-slate-600 text-sm">Yes, our {toolConfig.name} is completely free to use with no hidden charges or subscriptions required.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Is my data secure when using the {toolConfig.name}?</h4>
                <p className="text-slate-600 text-sm">Absolutely. We prioritize your privacy. Most of our tools process files locally in your browser, meaning your data never leaves your device.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Do I need to install any software?</h4>
                <p className="text-slate-600 text-sm">No installation is required. This is a web-based tool that works directly in your modern web browser (Chrome, Firefox, Safari, Edge).</p>
              </div>
            </div>
          </section>

          {/* Section 5: Internal Linking (Related Tools) */}
          {relatedTools.length > 0 && (
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Related {toolConfig.category} Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map(tool => (
                  <Link 
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <Settings className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{tool.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
