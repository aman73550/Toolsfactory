import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center">
          <div className="h-10 bg-slate-200 rounded-lg w-1/2 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div>
        </div>

        {/* Main Tool Area Skeleton */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
          <div className="h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl w-full flex items-center justify-center">
             <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
            <div className="h-10 bg-indigo-100 rounded-lg w-1/4"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 pt-8">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
