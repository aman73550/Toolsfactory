import React from 'react';
import { Activity } from 'lucide-react';

export default function SpeedTest() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Internet Speed Test</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Check your download, upload, and ping speeds instantly using our embedded speed test.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-4 md:p-6 shadow-sm">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-[600px] relative">
          {/* Fallback/Loading state behind the iframe */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 -z-10 bg-slate-50">
            <Activity className="w-12 h-12 animate-pulse mb-4 text-indigo-400" />
            <p className="font-medium">Loading Speed Test Engine...</p>
          </div>
          
          <iframe 
            src="https://librespeed.org/" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Internet Speed Test"
            allow="geolocation"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
