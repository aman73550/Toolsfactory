/**
 * Draggable PDF Page Grid
 * Professional drag-and-drop interface for page reordering
 * Follows 60:30:10 theme: White (60%), Slate (#E2E8F0 30%), Indigo (#4F46E5 10%)
 */

import React, { useState, useRef } from 'react';
import { Grip, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DraggablePageItem {
  id: string;
  pageNumber: number;
  thumbnail: string;
  fileName?: string;
}

interface DraggablePdfGridProps {
  pages: DraggablePageItem[];
  onReorder: (pages: DraggablePageItem[]) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function DraggablePdfGrid({
  pages,
  onReorder,
  onDelete,
  isLoading,
}: DraggablePdfGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';

    // Create custom drag image
    const page = pages.find(p => p.id === id);
    if (page && dragImageRef.current) {
      const img = new Image();
      img.src = page.thumbnail;
      e.dataTransfer.setDragImage(img, 100, 140);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropToIndex: number) => {
    e.preventDefault();
    if (!draggedId) return;

    const dragFromIndex = pages.findIndex(p => p.id === draggedId);
    if (dragFromIndex === dropToIndex) {
      setDraggedId(null);
      setDropIndex(null);
      return;
    }

    const reordered = [...pages];
    const [draggedPage] = reordered.splice(dragFromIndex, 1);
    reordered.splice(dropToIndex, 0, draggedPage);

    onReorder(reordered);
    setDraggedId(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Pages ({pages.length})
        </h3>
        <p className="text-xs text-slate-500">Drag to reorder, click to delete</p>
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pages.map((page, index) => (
          <div
            key={page.id}
            draggable={!isLoading}
            onDragStart={(e) => handleDragStart(e, page.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative h-48 rounded-lg border-2 transition-all',
              draggedId === page.id
                ? 'opacity-50 border-indigo-400 bg-indigo-50'
                : dropIndex === index
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300 bg-white cursor-move',
              !isLoading && 'hover:shadow-md'
            )}
          >
            {/* Thumbnail */}
            <img
              src={page.thumbnail}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-cover rounded-[6px]"
              loading="lazy"
            />

            {/* Page Number Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono font-semibold">
              Page {page.pageNumber}
            </div>

            {/* Drag Handle - visible on hover */}
            <div
              className={cn(
                'absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-white transition-opacity',
                draggedId === page.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <Grip size={16} strokeWidth={1.5} />
            </div>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={() => onDelete(page.id)}
                className={cn(
                  'absolute bottom-2 right-2 p-1.5 rounded transition-all',
                  'bg-red-500 text-white hover:bg-red-600 opacity-0 hover:opacity-100'
                )}
                title="Delete page"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            )}

            {/* Checkmark for selection */}
            <div className="absolute inset-0 rounded-[6px] ring-2 ring-indigo-500 opacity-0 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Hidden drag image ref */}
      <div ref={dragImageRef} className="hidden" />
    </div>
  );
}
