import React, { useState, useEffect } from 'react';
import { Link, Loader2, Music, AlertCircle, Download, Settings2 } from 'lucide-react';

export default function SocialToMp3() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'unknown' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'ready'>('idle');
  const [selectedQuality, setSelectedQuality] = useState('320');

  // Debounce URL parsing
  useEffect(() => {
    if (!url.trim()) {
      setPlatform(null);
      setDownloadState('idle');
      return;
    }

    setIsProcessing(true);
    setDownloadState('idle');
    const timer = setTimeout(() => {
      detectPlatform(url);
      setIsProcessing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  const detectPlatform = (link: string) => {
    const lowerLink = link.toLowerCase();
    if (lowerLink.includes('youtube.com') || lowerLink.includes('youtu.be')) setPlatform('youtube');
    else if (lowerLink.includes('instagram.com')) setPlatform('instagram');
    else if (lowerLink.includes('tiktok.com')) setPlatform('tiktok');
    else if (lowerLink.includes('twitter.com') || lowerLink.includes('x.com')) setPlatform('twitter');
    else if (lowerLink.includes('facebook.com') || lowerLink.includes('fb.watch')) setPlatform('facebook');
    else setPlatform('unknown');
  };

  const handleConvert = () => {
    setDownloadState('ready');
  };

  const getPlatformColor = () => {
    switch(platform) {
      case 'youtube': return 'text-red-500 bg-red-50 border-red-200';
      case 'instagram': return 'text-pink-500 bg-pink-50 border-pink-200';
      case 'tiktok': return 'text-slate-900 bg-slate-100 border-slate-300';
      case 'twitter': return 'text-blue-400 bg-blue-50 border-blue-200';
      case 'facebook': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-indigo-500 bg-indigo-50 border-indigo-200';
    }
  };

  const getPlatformName = () => {
    if (!platform || platform === 'unknown') return 'Media';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Social Video to MP3</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Extract high-quality audio from YouTube, Instagram, TikTok, X, and Facebook videos.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8 space-y-8">
        
        {/* Input Section */}
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Link className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any social media video link here..."
            className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg shadow-sm transition-all bg-white"
          />
        </div>

        {/* Live Preview Section */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="font-medium">Analyzing link...</p>
          </div>
        ) : platform && platform !== 'unknown' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
              
              {downloadState === 'idle' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getPlatformColor()}`}>
                      <Music className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{getPlatformName()} Video Detected</h3>
                      <p className="text-slate-500">Ready to extract audio</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Settings2 className="w-4 h-4" /> Audio Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['320', '256', '128'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setSelectedQuality(q)}
                          className={`py-3 px-4 rounded-xl border font-medium transition-all ${
                            selectedQuality === q 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                          }`}
                        >
                          {q} kbps
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleConvert}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Download className="w-6 h-6" /> Convert to MP3
                  </button>
                </div>
              )}

              {downloadState === 'ready' && (
                <div className="flex flex-col items-center justify-center py-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 overflow-hidden">
                    <iframe 
                      style={{ width: '100%', height: '60px', border: 'none', overflow: 'hidden' }} 
                      scrolling="no" 
                      src={`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`}
                    ></iframe>
                  </div>
                  
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Note: The download button above is provided by a free third-party service. Please close any pop-up ads that may appear.
                  </p>

                  <button 
                    onClick={() => setDownloadState('idle')}
                    className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Extract another audio
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : platform === 'unknown' ? (
          <div className="text-center py-16 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Unsupported URL. Please paste a link from YouTube, Instagram, TikTok, X, or Facebook.</p>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Paste a link above to extract audio</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          40% { width: 45%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
