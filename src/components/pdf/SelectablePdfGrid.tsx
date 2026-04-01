/**
 * Selectable PDF Page Grid
 * For Split, Extract, Delete operations
 * Indigo (#4F46E5) selection with checkmarks
 */

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectablePageItem {
  id: string;
  pageNumber: number;
  thumbnail: string;
}

interface SelectablePdfGridProps {
  pages: SelectablePageItem[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  mode?: 'single' | 'multi';
  isLoading?: boolean;
}

export function SelectablePdfGrid({
  pages,
  selectedIds,
  onSelectionChange,
  mode = 'multi',
  isLoading,
}: SelectablePdfGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    if (isLoading) return;

    const newSelection = new Set(selectedIds);
    if (mode === 'single') {
      newSelection.clear();
    }

    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }

    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    if (isLoading) return;
    onSelectionChange(new Set(pages.map(p => p.id)));
  };

  const clearSelection = () => {
    if (isLoading) return;
    onSelectionChange(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">
            Selected: {selectedIds.size} / {pages.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pages.map((page) => {
          const isSelected = selectedIds.has(page.id);
          const isHovered = hoveredId === page.id;

          return (
            <button
              key={page.id}
              onClick={() => toggleSelection(page.id)}
              onMouseEnter={() => setHoveredId(page.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={isLoading}
              className={cn(
                'relative h-48 rounded-lg border-2 transition-all overflow-hidden',
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white',
                !isLoading && 'cursor-pointer',
                isLoading && 'opacity-60 pointer-events-none'
              )}
            >
              {/* Thumbnail */}
              <img
                src={page.thumbnail}
                alt={`Page ${page.pageNumber}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono font-semibold">
                Page {page.pageNumber}
              </div>

              {/* Selection Checkmark */}
              <div
                className={cn(
                  'absolute top-2 right-2 w-6 h-6 rounded bg-white border-2 flex items-center justify-center transition-all',
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-300 opacity-0',
                  (isSelected || isHovered) && 'opacity-100'
                )}
              >
                {isSelected && (
                  <Check size={16} strokeWidth={3} className="text-white" />
                )}
              </div>

              {/* Ring overlay when selected */}
              {isSelected && (
                <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-[6px]" />
              )}

              {/* Hover overlay */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 bg-black/10 rounded-[6px]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {pages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">No pages to display</p>
        </div>
      )}
    </div>
  );
}
