import React, { useState, useRef } from 'react';
import { FileUp, FileText, FileMinus, Shield, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { generatePdfThumbnails, clearPdfPreviewCache } from '../lib/pdf-preview-engine';
import { SelectablePdfGrid, SelectablePageItem } from '../components/pdf/SelectablePdfGrid';
import { PdfThumbnailSkeleton } from '../components/pdf/PdfSkeleton';

export default function RemovePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SelectablePageItem[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      setTotalPages(pageCount);

      const pdfPages = await generatePdfThumbnails(selectedFile, 80);
      const selectablePages = pdfPages.map((page) => ({
        id: `page-${page.pageNumber}`,
        pageNumber: page.pageNumber,
        thumbnail: page.thumbnail || '',
      }));
      setPages(selectablePages);
    } catch (err) {
      console.error(err);
      alert('Could not read the PDF file. It might be corrupted or password protected.');
      setFile(null);
      setPages([]);
      setSelectedPages(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const removePages = async () => {
    if (!file) return;
    if (selectedPages.size === 0) {
      alert('Please select at least one page to remove.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const indicesToRemove = Array.from(selectedPages)
        .map((id) => Number(id.replace('page-', '')) - 1)
        .filter((idx) => Number.isInteger(idx) && idx >= 0)
        .sort((a, b) => a - b);

      if (indicesToRemove.length === 0) {
        alert('Please select valid pages to remove.');
        setIsProcessing(false);
        return;
      }

      if (indicesToRemove.length >= totalPages) {
        alert('You cannot remove all pages from the PDF.');
        setIsProcessing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const indicesToKeep = Array.from({ length: totalPages }, (_, i) => i)
        .filter(i => !indicesToRemove.includes(i));

      const copiedPages = await newPdf.copyPages(pdf, indicesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reduced-${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();

      setFile(null);
      setPages([]);
      setSelectedPages(new Set());
      setTotalPages(0);
      clearPdfPreviewCache();
    } catch (error) {
      console.error('Error removing pages:', error);
      alert('An error occurred while processing the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Remove PDF Pages</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Delete unwanted pages from your PDF document easily.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Files are processed locally in your browser. No data is uploaded to our servers.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 space-y-8">
        {!file ? (
          <div 
            className={`p-12 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop a PDF file here</h3>
            <p className="text-slate-500 mb-6">or click to browse from your device</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Select PDF File
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-red-500 shadow-sm">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{file.name}</h3>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} Pages</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setSelectedPages(new Set());
                  setTotalPages(0);
                  clearPdfPreviewCache();
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                Change File
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Select pages to remove</p>
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
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={removePages}
                disabled={isProcessing || selectedPages.size === 0}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-colors shadow-sm ${isProcessing || selectedPages.size === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <><FileMinus className="w-5 h-5" /> Remove Pages & Download</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
