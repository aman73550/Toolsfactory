import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Download, Shield, GripVertical, Trash2, Loader2, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageThumbnail {
  id: string;
  originalIndex: number;
  dataUrl: string;
}

export default function ReorderPdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageThumbnail[]>([]);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
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
    await generateThumbnails(selectedFile);
  };

  const generateThumbnails = async (pdfFile: File) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      setPdfBytes(arrayBuffer);
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const newPages: PageThumbnail[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Low res for thumbnails
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        newPages.push({
          id: `page-${i}-${Date.now()}`,
          originalIndex: i - 1, // 0-indexed for pdf-lib
          dataUrl: canvas.toDataURL('image/jpeg', 0.7)
        });
      }
      
      setPages(newPages);
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      alert('Could not read the PDF file. It might be corrupted or password protected.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop Logic for Grid
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image transparent or custom if desired
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Live reordering preview
    const newPages = [...pages];
    const draggedItem = newPages[draggedItemIndex];
    newPages.splice(draggedItemIndex, 1);
    newPages.splice(index, 0, draggedItem);
    
    setPages(newPages);
    setDraggedItemIndex(index); // Update dragged index to current position
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const removePage = (index: number) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
  };

  const exportPdf = async () => {
    if (!pdfBytes || pages.length === 0 || !file) return;
    
    setIsProcessing(true);
    try {
      const originalPdf = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const indicesToCopy = pages.map(p => p.originalIndex);
      const copiedPages = await newPdf.copyPages(originalPdf, indicesToCopy);
      
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const savedBytes = await newPdf.save();
      const blob = new Blob([savedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reordered-${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('An error occurred while saving the reordered PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Reorder PDF Pages</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Drag and drop page thumbnails to reorder or delete pages visually.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Processed locally in your browser. No data leaves your device.
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
            <p className="text-slate-500 mb-6">Visual preview will be generated instantly</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Select PDF File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-red-500 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{file.name}</h3>
                  <p className="text-xs text-slate-500">{pages.length} Pages remaining</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setPages([]); setPdfBytes(null); }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                Upload Different File
              </button>
            </div>

            {isProcessing && pages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="font-medium">Generating high-fidelity thumbnails...</p>
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 min-h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {pages.map((page, index) => (
                    <div 
                      key={page.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group bg-white rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing ${
                        draggedItemIndex === index 
                          ? 'border-indigo-500 shadow-lg scale-105 z-10 opacity-90' 
                          : 'border-slate-200 hover:border-indigo-300 shadow-sm'
                      }`}
                    >
                      {/* Page Number Badge */}
                      <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-slate-900/80 text-white text-xs font-bold rounded-full flex items-center justify-center backdrop-blur-sm">
                        {index + 1}
                      </div>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => removePage(index)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                        title="Remove page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Thumbnail */}
                      <div className="aspect-[1/1.4] w-full overflow-hidden p-2 pointer-events-none">
                        <img 
                          src={page.dataUrl} 
                          alt={`Page ${index + 1}`} 
                          className="w-full h-full object-contain border border-slate-100" 
                        />
                      </div>
                      
                      {/* Drag Handle Indicator */}
                      <div className="absolute bottom-0 left-0 right-0 py-1.5 bg-slate-50 border-t border-slate-200 flex justify-center text-slate-400 group-hover:text-indigo-500 transition-colors rounded-b-lg">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {pages.length === 0 && (
                  <div className="text-center py-20 text-slate-500">
                    <p>All pages removed. Please upload a new file.</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button 
                onClick={exportPdf}
                disabled={isProcessing || pages.length === 0}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : (
                  <><Download className="w-5 h-5" /> Save & Download PDF</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
