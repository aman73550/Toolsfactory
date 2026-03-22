import React, { useState, useRef } from 'react';
import { Image as ImageIcon, FileUp, Trash2, Download, Shield, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ImageToPdf() {
  const [files, setFiles] = useState<{file: File, preview: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    let newFiles: File[] = [];
    if ('dataTransfer' in e) {
      newFiles = Array.from(e.dataTransfer.files);
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      newFiles = Array.from((e.target as HTMLInputElement).files!);
    }

    const imageFiles = newFiles.filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
    if (imageFiles.length !== newFiles.length) {
      alert('Only JPG and PNG images are supported.');
    }
    
    const fileObjects = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const convertToPDF = async () => {
    if (files.length === 0) {
      alert('Please select at least 1 image.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      
      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await pdf.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdf.embedPng(arrayBuffer);
        } else {
          continue;
        }
        
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-images.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error converting to PDF:', error);
      alert('An error occurred while converting the images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Image to PDF</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert JPG and PNG images into a single PDF document.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Images are processed locally in your browser. No data is uploaded to our servers.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 space-y-8">
        {/* Upload Area */}
        <div 
          className={`p-12 text-center border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileUpload}
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop images here</h3>
          <p className="text-slate-500 mb-6">Supports JPG and PNG formats</p>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/jpeg, image/png" multiple className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Select Images
          </button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" /> Selected Images ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                      <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-medium text-slate-700 truncate">{item.file.name}</span>
                      <span className="text-xs text-slate-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeFile(index)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                onClick={convertToPDF}
                disabled={isProcessing || files.length === 0}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-colors shadow-sm ${isProcessing || files.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <><Download className="w-5 h-5" /> Download PDF</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
