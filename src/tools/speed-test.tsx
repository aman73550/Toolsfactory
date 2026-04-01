import React, { useState } from 'react';
import { Activity, ShieldCheck, Gauge, Globe } from 'lucide-react';

export default function SpeedTest() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <Gauge className="h-3.5 w-3.5" />
              Live Network Diagnostics
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Internet Speed Test</h1>
            <p className="max-w-2xl text-slate-600 md:text-lg">
              Measure download speed, upload speed, latency, and jitter in real time using our embedded tester.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2 md:grid-cols-1">
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              No file upload required
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium">
              <Globe className="h-4 w-4 text-indigo-600" />
              Server auto-selection enabled
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm font-medium text-slate-700">Testing powered by LibreSpeed</p>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isLoaded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <span className={`h-2 w-2 rounded-full ${isLoaded ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isLoaded ? 'Engine ready' : 'Initializing engine'}
          </span>
        </div>

        <div className="relative h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {!isLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-50/90 text-slate-500">
              <Activity className="h-12 w-12 animate-pulse text-indigo-500" />
              <p className="font-semibold text-slate-700">Loading Speed Test Engine...</p>
              <p className="text-sm">Preparing benchmark server and test scripts.</p>
            </div>
          )}

          <iframe
            src="https://librespeed.org/"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="Internet Speed Test"
            allow="geolocation"
            onLoad={() => setIsLoaded(true)}
          />

          <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/75 px-2.5 py-1 text-xs text-slate-100">
            Tip: close heavy downloads for accurate results
          </div>
        </div>
      </div>
    </div>
  );
}
