/**
 * PDF Preview Component
 * Main interface for displaying and interacting with PDFs
 * Handles loading, error states, and pagination
 */

import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import {
  generatePdfThumbnails,
  clearPdfPreviewCache,
  PdfPage,
} from '../../lib/pdf-preview-engine';
import { PdfThumbnailSkeleton } from './PdfSkeleton';
import { cn } from '../../lib/utils';

export interface PdfPreviewProps {
  file: File;
  maxPreviewPages?: number;
  onLoadComplete?: (pages: PdfPage[]) => void;
  onError?: (error: string) => void;
  children: (pages: PdfPage[], isLoading: boolean) => React.ReactNode;
}

export function PdfPreview({
  file,
  maxPreviewPages = 5,
  onLoadComplete,
  onError,
  children,
}: PdfPreviewProps) {
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadPdfPages();
    return () => clearPdfPreviewCache();
  }, [file]);

  const loadPdfPages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedPages = await generatePdfThumbnails(
        file,
        maxPreviewPages,
        () => {
          // Progress callback - can be used for progress bars
        }
      );

      setPages(loadedPages);
      // Try to get total page count (may fail for large PDFs)
      try {
        // We can infer total from the generation
        setTotalPages(loadedPages.length);
      } catch {}

      onLoadComplete?.(loadedPages);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load PDF';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PdfThumbnailSkeleton count={Math.min(maxPreviewPages, 5)} />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-900">Failed to load PDF</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          {error.includes('password') && (
            <p className="text-xs text-red-600 mt-2">
              Password-protected PDFs are not supported. Please remove the protection first.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No pages could be loaded from this PDF</p>
      </div>
    );
  }

  return <div>{children(pages, isLoading)}</div>;
}

/**
 * PDF Info Bar
 * Shows file metadata and page count info
 */
export function PdfInfoBar({
  file,
  pageCount,
  className,
}: {
  file: File;
  pageCount: number;
  className?: string;
}) {
  const fileSize = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div
      className={cn(
        'flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
          <span className="text-xs font-bold text-red-700">PDF</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {pageCount} page{pageCount !== 1 ? 's' : ''} • {fileSize} MB
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * PDF Load More Button
 * For handling large PDFs with limited previews
 */
export function PdfLoadMoreButton({
  isVisible,
  isLoading,
  onLoadMore,
}: {
  isVisible: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onLoadMore}
      disabled={isLoading}
      className="w-full py-3 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 transition-colors"
    >
      <ChevronDown size={18} />
      {isLoading ? 'Loading more...' : 'Load more pages'}
    </button>
  );
}
