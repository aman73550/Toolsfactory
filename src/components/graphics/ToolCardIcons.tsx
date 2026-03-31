import React from 'react';
import {
  Image,
  FileText,
  Music,
  Code,
  Zap,
  Shield,
  Palette,
  Video,
  BarChart3,
  Mail,
  Share2,
  Lock,
  Smartphone,
  Database,
  Globe,
  RotateCcw,
  Layers,
  Type,
  Download,
  Upload,
  Clock,
  Eye,
  Trash2,
  Copy,
} from 'lucide-react';

/**
 * ToolCardIconWrapper - Monochromatic Lucide Icons
 *
 * Features:
 * - Consistent icon sizing (8pt grid)
 * - Monochromatic styling (#1E293B = Slate)
 * - Minimal background container
 * - Zero external dependencies (Lucide-React included)
 * - Scalable and crisp (inline SVG)
 *
 * Performance: ~0KB (icons shipped with lucide-react)
 */

// Map of tool categories to Lucide icons
export const TOOL_ICONS = {
  image: { Component: Image, label: 'Image Tools' },
  pdf: { Component: FileText, label: 'PDF Tools' },
  audio: { Component: Music, label: 'Audio Tools' },
  code: { Component: Code, label: 'Code Tools' },
  productivity: { Component: Zap, label: 'Productivity' },
  security: { Component: Shield, label: 'Security' },
  design: { Component: Palette, label: 'Design' },
  video: { Component: Video, label: 'Video' },
  analytics: { Component: BarChart3, label: 'Analytics' },
  email: { Component: Mail, label: 'Email' },
  social: { Component: Share2, label: 'Social' },
  encryption: { Component: Lock, label: 'Encryption' },
  mobile: { Component: Smartphone, label: 'Mobile' },
  database: { Component: Database, label: 'Database' },
  web: { Component: Globe, label: 'Web' },
  converter: { Component: RotateCcw, label: 'Converter' },
  layering: { Component: Layers, label: 'Layering' },
  text: { Component: Type, label: 'Text' },
  download: { Component: Download, label: 'Download' },
  upload: { Component: Upload, label: 'Upload' },
  timer: { Component: Clock, label: 'Timer' },
  viewer: { Component: Eye, label: 'Viewer' },
  delete: { Component: Trash2, label: 'Delete' },
  duplicate: { Component: Copy, label: 'Duplicate' },
} as const;

type IconKey = keyof typeof TOOL_ICONS;

interface ToolCardIconProps {
  category?: IconKey;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBackground?: boolean;
}

/**
 * ToolCardIcon - Monochromatic Icon Component
 *
 * @param category - Icon category (defaults to 'code')
 * @param size - Icon size: 'sm' (16px), 'md' (24px), 'lg' (32px)
 * @param showBackground - Show subtle background container
 * @param className - Additional Tailwind classes
 */
export function ToolCardIcon({
  category = 'code',
  size = 'md',
  className = '',
  showBackground = true,
}: ToolCardIconProps) {
  const icon = TOOL_ICONS[category] || TOOL_ICONS.code;
  const Icon = icon.Component;

  // Size mapping (8pt grid)
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  };

  const sizeClasses = sizes[size];

  return (
    <div
      className={`
        ${sizeClasses.container}
        ${showBackground ? 'bg-indigo-50 rounded-lg flex items-center justify-center' : ''}
        ${className}
      `}
    >
      <Icon
        className={`${sizeClasses.icon} text-slate-900`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * ToolCardGrid - Grid of tool cards with icons
 *
 * Usage:
 * <ToolCardGrid tools={toolsList} />
 */
interface ToolCardGridItemProps {
  id: string;
  name: string;
  description: string;
  category: IconKey;
}

interface ToolCardGridProps {
  tools: ToolCardGridItemProps[];
}

export function ToolCardGrid({ tools }: ToolCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors hover:shadow-sm"
        >
          {/* Icon */}
          <ToolCardIcon
            category={tool.category}
            size="md"
            showBackground={true}
            className="mb-4"
          />

          {/* Content */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.name}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{tool.description}</p>

          {/* Optional: Click to access link */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <a
              href={`/tools/${tool.id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Open Tool →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ToolCardIconLegend - Show all available icons (for design reference)
 */
export function ToolCardIconLegend() {
  return (
    <div className="p-8 bg-slate-50 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-8">Available Tool Icons</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {(Object.entries(TOOL_ICONS) as [IconKey, typeof TOOL_ICONS[IconKey]][]).map(
          ([key, { label }]) => (
            <div key={key} className="flex flex-col items-center gap-3">
              <ToolCardIcon category={key} size="lg" />
              <p className="text-xs font-medium text-slate-600 text-center">{label}</p>
              <code className="text-xs text-slate-500">"{key}"</code>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ToolCardIcon;
