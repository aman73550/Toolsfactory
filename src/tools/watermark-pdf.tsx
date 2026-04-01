/**
 * Watermark PDF Tool - Enhanced with Live Preview
 * Shows real-time watermark preview on the first page
 * User sees exactly what the final PDF will look like
 */

import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Stamp, Shield, Download, Eye } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { renderPdfPageThumbnail, clearPdfPreviewCache } from '../lib/pdf-preview-engine';
import { PdfThumbnailSkeleton } from '../components/pdf/PdfSkeleton';

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [rotation, setRotation] = useState(45);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when watermark settings change
  useEffect(() => {
    if (file) {
      updateWatermarkPreview();
    }
  }, [watermarkText, opacity, fontSize, rotation]);

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
    setPreviewImage(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
      updateWatermarkPreview();
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Could not read the PDF file. It might be corrupted or password protected.');
      setFile(null);
    }
  };

  const updateWatermarkPreview = async () => {
    if (!file) return;

    setIsLoadingPreview(true);
    try {
      // Get first page thumbnail
      const firstPageThumbnail = await renderPdfPageThumbnail(file, 1, 400);

      // Create canvas and draw watermark on top
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original page
        ctx.drawImage(img, 0, 0);

        // Draw watermark
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();

        const previewUrl = canvas.toDataURL('image/png');
        setPreviewImage(previewUrl);
        setIsLoadingPreview(false);
      };
      img.src = firstPageThumbnail;
    } catch (error) {
      console.error('Error generating preview:', error);
      setIsLoadingPreview(false);
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
          opacity: opacity,
          rotate: degrees(rotation),
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

      // Reset
      setFile(null);
      setPreviewImage(null);
      setWatermarkText('CONFIDENTIAL');
      clearPdfPreviewCache();
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('An error occurred while adding the watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Add Watermark to PDF
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Customize your watermark with live preview. See exactly how it will look on your PDF pages.
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
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} Pages
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewImage(null);
                  setWatermarkText('CONFIDENTIAL');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Change File
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g., CONFIDENTIAL"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Rotation: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="lg:col-span-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Live Preview (First Page)</h3>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    {isLoadingPreview ? (
                      <PdfThumbnailSkeleton count={1} />
                    ) : previewImage ? (
                      <img
                        src={previewImage}
                        alt="Watermark preview"
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="h-96 flex items-center justify-center">
                        <p className="text-slate-400">Loading preview...</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 text-center">
                    This preview shows how your watermark will appear on the first page.
                    It will be applied to all {totalPages} pages.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={addWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-colors shadow-sm ${
                  isProcessing || !watermarkText.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download size={20} />
                    Apply & Download
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
