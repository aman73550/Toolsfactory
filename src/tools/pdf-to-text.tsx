import React, { useState, useRef } from 'react';
import { FileUp, FileText, Copy, Download, Shield, Check, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
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
    await extractText(selectedFile);
  };

  const extractText = async (pdfFile: File) => {
    setIsProcessing(true);
    setText('');
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      
      setText(fullText.trim());
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('An error occurred while extracting text from the PDF. It might be scanned or password protected.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}-extracted.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">PDF to Text</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract all readable text from your PDF document instantly.
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
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-red-500 shadow-sm">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{file.name}</h3>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setText(''); }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                Change File
              </button>
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                <p className="text-lg font-medium">Extracting text from PDF...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">Extracted Text</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download .txt
                    </button>
                  </div>
                </div>
                <textarea
                  value={text}
                  readOnly
                  className="w-full h-96 p-4 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none font-mono text-sm resize-y"
                  placeholder="Extracted text will appear here..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
