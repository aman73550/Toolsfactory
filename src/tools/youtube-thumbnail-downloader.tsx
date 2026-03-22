import React, { useState, useEffect } from 'react';
import { Download, Image as ImageIcon, Search, Loader2 } from 'lucide-react';

export default function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce URL parsing
  useEffect(() => {
    if (!url.trim()) {
      setVideoId(null);
      return;
    }

    setIsProcessing(true);
    const timer = setTimeout(() => {
      const id = extractVideoId(url);
      setVideoId(id);
      setIsProcessing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  const extractVideoId = (link: string) => {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  const qualities = [
    { label: 'Maximum Resolution (HD)', res: '1280x720', suffix: 'maxresdefault' },
    { label: 'High Quality', res: '480x360', suffix: 'hqdefault' },
    { label: 'Medium Quality', res: '320x180', suffix: 'mqdefault' },
    { label: 'Standard Quality', res: '120x90', suffix: 'default' }
  ];

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      // Fetching through client side might have CORS issues depending on browser,
      // but YouTube image servers generally allow cross-origin for images.
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (err) {
      // Fallback if fetch fails (opens in new tab)
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">YouTube Thumbnail Downloader</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract and download high-quality thumbnails from any YouTube video instantly.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8 space-y-8">
        
        {/* Input Section */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Video URL here (e.g., https://www.youtube.com/watch?v=...)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-lg shadow-sm transition-all"
          />
        </div>

        {/* Live Preview Section */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
            <p className="font-medium">Fetching thumbnails...</p>
          </div>
        ) : videoId ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Max Res Preview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 px-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Maximum Resolution</h3>
                  <p className="text-sm text-slate-500">1280x720 (HD)</p>
                </div>
                <button 
                  onClick={() => downloadImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, `thumbnail-${videoId}-max.jpg`)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download HD
                </button>
              </div>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                  alt="Max Resolution Thumbnail" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if maxres doesn't exist
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              </div>
            </div>

            {/* Other Resolutions Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {qualities.slice(1).map((q) => (
                <div key={q.suffix} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="mb-3">
                    <h4 className="font-semibold text-slate-800">{q.label}</h4>
                    <p className="text-xs text-slate-500">{q.res}</p>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mb-4">
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`} 
                      alt={`${q.label} Thumbnail`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => downloadImage(`https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`, `thumbnail-${videoId}-${q.suffix}.jpg`)}
                    className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : url.trim() ? (
          <div className="text-center py-12 text-slate-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Invalid YouTube URL. Please check the link and try again.</p>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Paste a link above to see live previews</p>
          </div>
        )}
      </div>
    </div>
  );
}
