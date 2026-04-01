/**
 * Train Status Timeline Component
 * Professional vertical timeline with real data
 * 60:30:10 design: White background, Slate text, Indigo actions
 */

import React, { useState } from 'react';
import { Clock, MapPin, AlertCircle, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TimelineStation {
  name: string;
  code: string;
  scheduledTime: string;
  actualTime?: string;
  delay?: number; // minutes
  status: 'done' | 'current' | 'pending';
  distance?: number; // km from start
}

interface TrainTimelineProps {
  stations: TimelineStation[];
  isLoading?: boolean;
  trainNumber: string;
  trainName: string;
  lastUpdated?: string;
}

export function TrainTimeline({
  stations,
  isLoading,
  trainNumber,
  trainName,
  lastUpdated,
}: TrainTimelineProps) {
  return (
    <div className="w-full max-w-2xl mx-auto backdrop-filter backdrop-blur-sm rounded-xl border border-slate-200 bg-white p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">{trainNumber}</p>
            <h2 className="text-2xl font-bold text-slate-900">{trainName}</h2>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Last updated</p>
              <p className="text-sm font-mono text-slate-700">{lastUpdated}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : stations.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No station data available</p>
        </div>
      ) : (
        <div className="space-y-0">
          {stations.map((station, index) => {
            const isLast = index === stations.length - 1;
            const delay = station.delay || 0;
            const hasDelay = delay > 0;

            return (
              <div key={station.code} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-5 top-12 w-0.5 h-16 transition-colors',
                      station.status === 'done'
                        ? 'bg-green-500'
                        : station.status === 'current'
                        ? 'bg-amber-400'
                        : 'bg-slate-300'
                    )}
                  />
                )}

                {/* Station Row */}
                <div className="flex gap-4 pb-6">
                  {/* Status Indicator */}
                  <div
                    className={cn(
                      'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 flex-shrink-0 transition-all',
                      station.status === 'done'
                        ? 'border-green-500 bg-green-50'
                        : station.status === 'current'
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {station.status === 'done' && (
                      <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                    )}
                    {station.status === 'current' && (
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    )}
                    {station.status === 'pending' && (
                      <MapPin className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Station Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{station.name}</p>
                        <p className="text-sm text-slate-500">{station.code}</p>
                      </div>

                      {/* Delay Badge */}
                      {hasDelay && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 border border-red-200 flex-shrink-0">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-semibold text-red-700">
                            {delay}m late
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Times */}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono">{station.scheduledTime}</span>
                      </div>

                      {station.actualTime && (
                        <>
                          <span className="text-slate-300">→</span>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <span>{station.actualTime}</span>
                            {hasDelay && (
                              <span className="text-red-600 text-xs">+{delay}m</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {station.distance !== undefined && (
                      <p className="text-xs text-slate-400 mt-1">
                        {station.distance} km from start
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Data Source Note */}
      <div className="text-xs text-slate-500 border-t border-slate-200 pt-4">
        <p>
          Data from public railway servers. Refreshes every 5 minutes.{' '}
          <a
            href="https://www.ntes.indianrailways.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Official NTES
          </a>
        </p>
      </div>
    </div>
  );
}
