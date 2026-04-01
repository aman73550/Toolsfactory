/**
 * Split PDF Tool - Enhanced with Visual Page Selection
 * User selects pages by clicking thumbnails with Indigo checkmarks
 * Much more intuitive than typing page ranges
 */

import React, { useState, useRef } from 'react';
import { FileUp, Download, Shield, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { generatePdfThumbnails, clearPdfPreviewCache } from '../lib/pdf-preview-engine';
import { SelectablePdfGrid, SelectablePageItem } from '../components/pdf/SelectablePdfGrid';
import { PdfThumbnailSkeleton } from '../components/pdf/PdfSkeleton';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SelectablePageItem[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    e.preventDefault();
    setIsDragging(false);

    let selectedFile: File | null = null;
    if ('dataTransfer' in e) {
      selectedFile = e.dataTransfer.files[0];
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      selectedFile = (e.target as HTMLInputElement).files![0];
    }

    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setPages([]);
    setSelectedPages(new Set());

    try {
      const pdfPages = await generatePdfThumbnails(selectedFile, 50); // Load up to 50 pages for preview
      const selectablePages = pdfPages.map((page) => ({
        id: `page-${page.pageNumber}`,
        pageNumber: page.pageNumber,
        thumbnail: page.thumbnail || '',
      }));
      setPages(selectablePages);

      // Pre-select all pages by default
      setSelectedPages(new Set(selectablePages.map(p => p.id)));
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Could not read the PDF file. It might be corrupted or password protected.');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const splitPDF = async () => {
    if (!file || selectedPages.size === 0) {
      alert('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    try {
      // Convert selected page IDs to page numbers
      const selectedPageNumbers = Array.from(selectedPages)
        .map((id: string) => parseInt(id.replace('page-', '')))
        .sort((a, b) => a - b)
        .map(num => num - 1); // Convert to 0-indexed

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(pdf, selectedPageNumbers);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `split-${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();

      // Reset
      setFile(null);
      setPages([]);
      setSelectedPages(new Set());
      clearPdfPreviewCache();
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('An error occurred while splitting the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Split PDF</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract specific pages from your PDF by clicking them. Get instant visual feedback on what you're selecting.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Processed locally. No server uploads.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 space-y-8">
        {!file ? (
          // Upload Area
          <div
            className={`p-12 text-center border-2 border-dashed rounded-lg transition-colors ${
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
              Drag & Drop a PDF file here
            </h3>
            <p className="text-slate-500 mb-6">or click to browse from your device</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Select PDF File
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {pages.length} Pages
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setSelectedPages(new Set());
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Change File
              </button>
            </div>

            {/* Page Selection */}
            {isLoading ? (
              <PdfThumbnailSkeleton count={6} />
            ) : (
              <SelectablePdfGrid
                pages={pages}
                selectedIds={selectedPages}
                onSelectionChange={setSelectedPages}
                mode="multi"
                isLoading={isProcessing}
              />
            )}

            {/* Extract Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={splitPDF}
                disabled={isProcessing || selectedPages.size === 0}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-colors shadow-sm ${
                  isProcessing || selectedPages.size === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Scissors size={20} />
                    Extract Selected Pages
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
