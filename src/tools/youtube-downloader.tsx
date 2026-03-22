import React, { useState, useEffect } from 'react';
import { Search, Loader2, Download, Video, Music, AlertCircle, Youtube, CheckCircle2 } from 'lucide-react';

export default function YoutubeDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'ready'>('idle');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  // Debounce URL parsing
  useEffect(() => {
    if (!url.trim()) {
      setVideoId(null);
      setDownloadState('idle');
      return;
    }

    setIsProcessing(true);
    setDownloadState('idle');
    const timer = setTimeout(() => {
      const id = extractVideoId(url);
      setVideoId(id);
      setIsProcessing(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [url]);

  const extractVideoId = (link: string) => {
    // Handles standard, shortened, and shorts URLs
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&?]{11})/);
    return match ? match[1] : null;
  };

  const formats = [
    { id: '1080p', type: 'video', label: '1080p (HD)', size: '~45 MB', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: '720p', type: 'video', label: '720p', size: '~22 MB', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: '480p', type: 'video', label: '480p', size: '~12 MB', icon: Video, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: 'mp3', type: 'audio', label: 'MP3 (Audio)', size: '~4 MB', icon: Music, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const handleDownload = (formatId: string) => {
    setSelectedFormat(formatId);
    setDownloadState('ready');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">YouTube Video & Shorts Downloader</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Download YouTube videos and Shorts in MP4 or MP3 formats instantly.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8 space-y-8">
        
        {/* Input Section */}
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Youtube className="h-6 w-6 text-red-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Video or Shorts URL here..."
            className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-lg shadow-sm transition-all bg-white"
          />
        </div>

        {/* Live Preview Section */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
            <p className="font-medium">Analyzing video link...</p>
          </div>
        ) : videoId ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Thumbnail Side */}
              <div className="md:w-2/5 bg-slate-100 relative">
                <div className="aspect-video md:aspect-auto md:h-full w-full relative">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs font-bold rounded backdrop-blur-sm">
                      Ready to Download
                    </span>
                  </div>
                </div>
              </div>

              {/* Options Side */}
              <div className="md:w-3/5 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-6 line-clamp-2">
                  YouTube Media Found
                </h3>

                {downloadState === 'idle' && (
                  <div className="space-y-3 flex-1">
                    {formats.map((format) => {
                      const Icon = format.icon;
                      return (
                        <button
                          key={format.id}
                          onClick={() => handleDownload(format.id)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${format.bg} ${format.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">{format.label}</p>
                              <p className="text-xs text-slate-500">{format.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-400">{format.size}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors text-slate-400">
                              <Download className="w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {downloadState === 'ready' && selectedFormat && (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 overflow-hidden">
                      <iframe 
                        style={{ width: '100%', height: '60px', border: 'none', overflow: 'hidden' }} 
                        scrolling="no" 
                        src={`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=${selectedFormat}`}
                      ></iframe>
                    </div>
                    
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Note: The download button above is provided by a free third-party service. Please close any pop-up ads that may appear.
                    </p>

                    <button 
                      onClick={() => setDownloadState('idle')}
                      className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                    >
                      Choose a different format
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        ) : url.trim() ? (
          <div className="text-center py-16 text-slate-500">
            <Youtube className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Invalid YouTube URL. Please check the link and try again.</p>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Download className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Paste a link above to fetch video formats</p>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
