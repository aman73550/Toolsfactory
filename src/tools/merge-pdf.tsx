/**
 * Merge PDF Tool - Enhanced with High-Fidelity Visual Preview
 * Displays PDF page thumbnails with drag-and-drop reordering
 * Client-side processing with zero server load
 */

import React, { useState, useRef } from 'react';
import { FileUp, Download, Shield, Plus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { generatePdfThumbnails, clearPdfPreviewCache, getPdfPageCount } from '../lib/pdf-preview-engine';
import { DraggablePdfGrid, DraggablePageItem } from '../components/pdf/DraggablePdfGrid';
import { PdfThumbnailSkeleton } from '../components/pdf/PdfSkeleton';
import { PdfInfoBar } from '../components/pdf/PdfPreview';

interface MergePdfFile {
  id: string;
  file: File;
  pages: DraggablePageItem[];
  totalPages: number;
  isLoading: boolean;
  error?: string;
}

export default function MergePdf() {
  const [pdfFiles, setPdfFiles] = useState<MergePdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    e.preventDefault();
    setIsDragging(false);

    let newFiles: File[] = [];
    if ('dataTransfer' in e) {
      newFiles = Array.from(e.dataTransfer.files);
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      newFiles = Array.from((e.target as HTMLInputElement).files!);
    }

    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length !== newFiles.length) {
      alert('Only PDF files are allowed.');
    }

    // Load each PDF with thumbnail previews
    for (const pdfFile of pdfFiles) {
      const id = `${pdfFile.name}-${Date.now()}`;
      const newMergePdf: MergePdfFile = {
        id,
        file: pdfFile,
        pages: [],
        totalPages: 0,
        isLoading: true,
      };

      setPdfFiles(prev => [...prev, newMergePdf]);

      try {
        const totalPages = await getPdfPageCount(pdfFile);
        const pages = await generatePdfThumbnails(pdfFile, Math.min(totalPages, 20));

        setPdfFiles(prev =>
          prev.map(f =>
            f.id === id
              ? {
                  ...f,
                  totalPages,
                  pages: pages.map((page, idx) => ({
                    id: `${id}-page-${page.pageNumber}`,
                    pageNumber: page.pageNumber,
                    thumbnail: page.thumbnail || '',
                    fileName: pdfFile.name,
                  })),
                  isLoading: false,
                }
              : f
          )
        );
      } catch (error) {
        setPdfFiles(prev =>
          prev.map(f =>
            f.id === id
              ? {
                  ...f,
                  isLoading: false,
                  error: 'Failed to load PDF preview. Try another file or re-upload.',
                }
              : f
          )
        );
      }
    }
  };

  const removeFile = (id: string) => {
    setPdfFiles(files => files.filter(f => f.id !== id));
  };

  const handleReorderPages = (fileId: string, reorderedPages: DraggablePageItem[]) => {
    setPdfFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? { ...f, pages: reorderedPages }
          : f
      )
    );
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      // Process files in order
      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        // Get page order from reordered pages
        const pageIndices = pdfFile.pages.map(p => p.pageNumber - 1);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pageIndices.length > 0 ? pageIndices : pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();

      // Reset
      setPdfFiles([]);
      clearPdfPreviewCache();
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert(
        'An error occurred while merging the PDFs. Ensure they are valid and not password protected.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Merge PDF</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Combine multiple PDF files with visual page preview. Drag & drop to reorder pages before merging.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Files are processed locally in your browser. Zero server load.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 space-y-8">
        {pdfFiles.length === 0 ? (
          // Upload Area
          <div
            className={`p-12 text-center border-2 border-dashed rounded-xl transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Drag & Drop PDF files here
            </h3>
            <p className="text-slate-500 mb-6">or click to browse from your device</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Select PDF Files
            </button>
          </div>
        ) : (
          <>
            {/* Files with Previews */}
            <div className="space-y-8">
              {pdfFiles.map((pdfFile, fileIndex) => (
                <div
                  key={pdfFile.id}
                  className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
                >
                  {/* File Header */}
                  <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 p-2">
                      <div>
                        <p className="font-medium text-slate-900">{pdfFile.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {pdfFile.totalPages || pdfFile.pages.length} pages • {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                        #{fileIndex + 1}
                      </span>
                      <button
                        onClick={() => removeFile(pdfFile.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {pdfFile.isLoading ? (
                      <PdfThumbnailSkeleton count={5} />
                    ) : pdfFile.error ? (
                      <div className="text-center py-8 text-red-600">
                        <p>{pdfFile.error}</p>
                      </div>
                    ) : pdfFile.pages.length === 0 ? (
                      <div className="text-center py-8 text-amber-600">
                        <p>No preview pages could be rendered for this file.</p>
                      </div>
                    ) : (
                      <DraggablePdfGrid
                        pages={pdfFile.pages}
                        onReorder={(pages) => handleReorderPages(pdfFile.id, pages)}
                        onDelete={(id) => {
                          const newPages = pdfFile.pages.filter(p => p.id !== id);
                          handleReorderPages(pdfFile.id, newPages);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Files Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 font-medium hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add More PDF Files
            </button>

            {/* Merge Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={mergePDFs}
                disabled={isProcessing || pdfFiles.length < 2}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-colors shadow-sm ${
                  isProcessing || pdfFiles.length < 2
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download size={20} /> Merge & Download
                  </>
                )}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              multiple
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
}
