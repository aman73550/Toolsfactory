import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Dynamic Breadcrumb Navigation
 * Automatically generates from URL path
 * SEO: Includes JSON-LD schema
 */
export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      // Convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, href };
    }),
  ];

  // Current page shouldn't be clickable
  breadcrumbs[breadcrumbs.length - 1].href = undefined;

  return (
    <>
      {/* Visual Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] overflow-x-auto"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
            {idx > 0 && <ChevronRight size={16} className="text-[var(--text-secondary)] flex-shrink-0" />}

            {item.href ? (
              <Link
                to={item.href}
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--text-secondary)]">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* JSON-LD Schema (for Google) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs
            .filter(item => item.href !== undefined)
            .map((item, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: item.label,
              item: item.href ? `${window.location.origin}${item.href}` : undefined,
            })),
        })}
      </script>
    </>
  );
}
