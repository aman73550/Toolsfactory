/**
 * SEO Metadata System
 * Automatically generates SEO-optimized metadata for tools
 */

export interface ToolMetadata {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  blogContent?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schema: Record<string, unknown>;
}

/**
 * Generate SEO metadata for a tool
 */
export function generateToolMetadata(tool: any, baseUrl = typeof window !== 'undefined' ? window.location.origin : ''): GeneratedMetadata {
  const url = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: tool.title || `${tool.name} - Free Online Tool | Toolsfactory`,
    description: tool.description || `${tool.name}: A professional online tool for ${tool.category}. Fast, secure, and free. No installation required.`,
    keywords: [tool.name, tool.category, 'free tool', 'online', ...((tool.keywords || []) as string[])].join(', '),
    ogTitle: tool.title || tool.name,
    ogDescription: tool.description,
    ogImage: tool.ogImage || `${baseUrl}/og-tools.png`,
    ogUrl: url,
    twitterTitle: tool.title || `${tool.name}`,
    twitterDescription: tool.description,
    twitterImage: tool.ogImage || `${baseUrl}/og-tools.png`,
    schema: generateJSONLDSchema(tool, url),
  };
}

/**
 * Generate JSON-LD schema for Google Search
 */
function generateJSONLDSchema(tool: any, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: url,
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    image: tool.ogImage || '/og-tools.png',
    screenshot: tool.ogImage || '/og-tools.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  };
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Set HTML head tags for SEO
 */
export function setMetaTags(metadata: GeneratedMetadata) {
  // Title
  document.title = metadata.title;

  // Meta tags
  const metaTags = [
    { name: 'description', content: metadata.description },
    { name: 'keywords', content: metadata.keywords },
    { property: 'og:title', content: metadata.ogTitle },
    { property: 'og:description', content: metadata.ogDescription },
    { property: 'og:image', content: metadata.ogImage },
    { property: 'og:url', content: metadata.ogUrl },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.twitterTitle },
    { name: 'twitter:description', content: metadata.twitterDescription },
    { name: 'twitter:image', content: metadata.twitterImage },
  ];

  metaTags.forEach(tag => {
    let element = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(tag.property ? 'property' : 'name', tag.property || tag.name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', tag.content);
  });

  // JSON-LD schema
  let schemaScript = document.querySelector('script[type="application/ld+json"]');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(metadata.schema);
}

/**
 * Hook to set metadata on component mount
 */
export function useToolMetadata(tool: any) {
  React.useEffect(() => {
    const metadata = generateToolMetadata(tool);
    setMetaTags(metadata);
  }, [tool]);
}

// Add React import for the hook's useEffect
import React from 'react';
