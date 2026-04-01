/**
 * PDF Loading Skeleton
 * Animated skeleton loaders while thumbnails render
 * Professional gradient animation - no jitter
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface PdfSkeletonProps {
  count?: number;
  className?: string;
}

export function PdfThumbnailSkeleton({ count = 4, className }: PdfSkeletonProps) {
  return (
    <div className={cn('grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg bg-slate-100 border border-slate-200 h-56"
        >
          {/* Shimmer animation */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100"
            style={{
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
            }}
          />

          {/* Page indicator skeleton */}
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded bg-slate-300" />

          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              50% { background-position: 0 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}

export function PdfGridSkeleton({ count = 6 }: PdfSkeletonProps) {
  return (
    <div className="space-y-4">
      <PdfThumbnailSkeleton count={count} />
    </div>
  );
}
