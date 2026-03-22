import React, { useState, useRef } from 'react';
import { FileUp, FileText, Stamp, Shield, Download } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
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
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
    } catch (err) {
      console.error(err);
      alert('Could not read the PDF file. It might be corrupted or password protected.');
      setFile(null);
    }
  };

  const addWatermark = async () => {
    if (!file) return;
    if (!watermarkText.trim()) {
      alert('Please enter text for the watermark.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      
      const pages = pdf.getPages();
      const fontSize = 60;
      
      pages.forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);
        
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('An error occurred while adding the watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Add Watermark to PDF</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Stamp your PDF documents with a custom text watermark.
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
                onClick={() => { setFile(null); setWatermarkText('CONFIDENTIAL'); setTotalPages(0); }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                Change File
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g., CONFIDENTIAL, DRAFT, DO NOT COPY"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
              />
              <p className="text-sm text-slate-500">
                This text will be stamped diagonally across the center of all pages.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={addWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-colors shadow-sm ${isProcessing || !watermarkText.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <><Stamp className="w-5 h-5" /> Add Watermark & Download</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
