/**
 * Client-Side PDF Preview Engine
 * Renders high-fidelity thumbnails and previews using pdf.js
 * Zero server load - all processing in browser
 */

import * as pdfjsLib from 'pdfjs-dist';
import { configurePdfWorker } from './pdf-worker';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  configurePdfWorker();
}

export interface PdfPage {
  pageNumber: number;
  width: number;
  height: number;
  thumbnail?: string; // Blob URL or Data URL
  isSelected?: boolean;
  error?: string; // For error states
}

export interface PdfDocument {
  file: File;
  pageCount: number;
  pages: PdfPage[];
  isLoading: boolean;
  error?: string;
}

const THUMBNAIL_WIDTH = 200;
const THUMBNAIL_QUALITY = 2; // Device pixel ratio for crisp rendering
const CACHE_SIZE = 50; // Cache last 50 rendered pages

class PdfPreviewCache {
  private cache = new Map<string, string>();
  private queue: string[] = [];

  set(key: string, value: string) {
    if (this.cache.size >= CACHE_SIZE) {
      const oldest = this.queue.shift();
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, value);
    this.queue.push(key);
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.queue = [];
  }
}

const previewCache = new PdfPreviewCache();

/**
 * Render a PDF page to a canvas thumbnail
 * Returns image data URL for display
 */
export async function renderPdfPageThumbnail(
  pdfFile: File,
  pageNumber: number,
  width: number = THUMBNAIL_WIDTH
): Promise<string> {
  const cacheKey = `${pdfFile.name}-${pdfFile.size}-${pageNumber}-${width}`;
  const cached = previewCache.get(cacheKey);
  if (cached) return cached;

  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(pageNumber);

    // Calculate dimensions maintaining aspect ratio
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = width / baseViewport.width;
    const viewport = page.getViewport({ scale: scale * THUMBNAIL_QUALITY });

    // Create canvas and render
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');

    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    } as any);

    await renderTask.promise;

    // Convert to blob URL
    const dataUrl = canvas.toDataURL('image/png', 0.95);
    previewCache.set(cacheKey, dataUrl);

    return dataUrl;
  } catch (error) {
    console.error(`Failed to render page ${pageNumber}:`, error);
    throw error;
  }
}

/**
 * Extract page count from PDF
 */
export async function getPdfPageCount(pdfFile: File): Promise<number> {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Failed to get PDF page count:', error);
    throw new Error('Invalid PDF file or file is password protected');
  }
}

/**
 * Generate all thumbnails for a PDF (with performance limits)
 */
export async function generatePdfThumbnails(
  pdfFile: File,
  maxPages: number = 5,
  onProgress?: (current: number, total: number) => void
): Promise<PdfPage[]> {
  try {
    const pageCount = await getPdfPageCount(pdfFile);
    const pages: PdfPage[] = [];
    const pagesToRender = Math.min(pageCount, maxPages);

    for (let i = 1; i <= pagesToRender; i++) {
      try {
        const thumbnail = await renderPdfPageThumbnail(pdfFile, i);
        pages.push({
          pageNumber: i,
          width: THUMBNAIL_WIDTH,
          height: Math.round(THUMBNAIL_WIDTH * 1.414), // A4 aspect ratio
          thumbnail,
          isSelected: false,
        });
        onProgress?.(i, pagesToRender);
      } catch (error) {
        console.error(`Failed to render page ${i}:`, error);
        pages.push({
          pageNumber: i,
          width: THUMBNAIL_WIDTH,
          height: Math.round(THUMBNAIL_WIDTH * 1.414),
          error: 'Failed to render page',
          isSelected: false,
        });
      }
    }

    return pages;
  } catch (error) {
    console.error('Failed to generate thumbnails:', error);
    throw error;
  }
}

/**
 * Get page dimensions for layout calculation
 */
export async function getPdfPageDimensions(
  pdfFile: File,
  pageNumber: number
): Promise<{ width: number; height: number }> {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    return {
      width: viewport.width,
      height: viewport.height,
    };
  } catch (error) {
    console.error('Failed to get page dimensions:', error);
    throw error;
  }
}

/**
 * Clear preview cache (call when component unmounts)
 */
export function clearPdfPreviewCache() {
  previewCache.clear();
}
