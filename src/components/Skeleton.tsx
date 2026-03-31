import React from 'react';

/**
 * Skeleton Loader - Animated placeholder matching layout
 * Use instead of spinners or "Loading..." text
 */

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${width} ${height} ${className}
            bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
            rounded-lg
            animate-pulse
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </>
  );
};

// Pre-built skeleton loaders for common use cases

export const ToolSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Title skeleton */}
    <div className="space-y-2">
      <Skeleton width="w-2/3" height="h-8" />
      <Skeleton width="w-1/2" height="h-4" />
    </div>

    {/* Upload area skeleton */}
    <div className="h-48 bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg" />

    {/* Stats skeleton */}
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2 p-4 bg-white border border-slate-200 rounded-lg">
          <Skeleton width="w-full" height="h-6" />
          <Skeleton width="w-3/4" height="h-3" />
        </div>
      ))}
    </div>

    {/* Preview area skeleton */}
    <div className="grid grid-cols-2 gap-4">
      <div className="h-40 bg-slate-100 rounded-lg" />
      <div className="h-40 bg-slate-100 rounded-lg" />
    </div>

    {/* Button skeleton */}
    <Skeleton width="w-1/4" height="h-10" />
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200 animate-pulse">
    <div className="space-y-2">
      <Skeleton width="w-3/4" height="h-5" />
      <Skeleton width="w-full" height="h-4" count={2} />
    </div>
    <Skeleton width="w-1/3" height="h-8" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2 animate-pulse">
    {/* Header */}
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={`header-${i}`} width="w-full" height="h-4" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={`row-${rowIdx}`} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, colIdx) => (
          <Skeleton key={`cell-${rowIdx}-${colIdx}`} width="w-full" height="h-4" />
        ))}
      </div>
    ))}
  </div>
);

export const GridSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
        <div className="h-24 bg-slate-100 rounded" />
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-3/4" height="h-3" />
        <Skeleton width="w-1/3" height="h-8" />
      </div>
    ))}
  </div>
);
