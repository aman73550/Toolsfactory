/**
 * Live Train Status Tool
 * Fetches and displays real-time train running status
 * Shows vertical timeline with stations
 */

import React, { useState } from 'react';
import { Search, AlertCircle, Clock } from 'lucide-react';
import { TrainTimeline, TimelineStation } from './TrainTimeline';

interface TrainData {
  trainNumber: string;
  trainName: string;
  status: string;
  delay: number;
  currentStation?: string;
  nextStation?: string;
  stations?: TimelineStation[];
  lastUpdated: string;
}

export function TrainStatusChecker() {
  const [trainNumber, setTrainNumber] = useState('');
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTrainData(null);

    if (!trainNumber || !/^\d{5}$/.test(trainNumber)) {
      setError('Please enter a valid 5-digit train number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/train-status/${trainNumber}`);
      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            `Error: ${data.error}. ${data.helpText || 'Please try again later.'}`
        );
        return;
      }

      // Transform response to our format
      setTrainData({
        trainNumber: data.trainNumber,
        trainName: data.trainName,
        status: data.status,
        delay: data.delay || 0,
        currentStation: data.lastStation,
        nextStation: data.nextStation,
        lastUpdated: new Date(data.lastUpdated || Date.now()).toLocaleTimeString(),
      });
    } catch (err) {
      setError('Failed to fetch train status. Please check the train number and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample timeline data (would come from API in real implementation)
  const sampleStations: TimelineStation[] = [
    {
      name: 'New Delhi',
      code: 'NDLS',
      scheduledTime: '08:00',
      actualTime: '08:02',
      delay: 2,
      status: 'done',
      distance: 0,
    },
    {
      name: 'Agra Cantt',
      code: 'AGC',
      scheduledTime: '10:45',
      actualTime: '10:50',
      delay: 5,
      status: 'done',
      distance: 206,
    },
    {
      name: 'Gwalior',
      code: 'GWL',
      scheduledTime: '12:30',
      actualTime: '12:42',
      delay: 12,
      status: 'current',
      distance: 323,
    },
    {
      name: 'Jhansi',
      code: 'JHS',
      scheduledTime: '14:15',
      status: 'pending',
      distance: 387,
    },
    {
      name: 'Bina Jn',
      code: 'BINA',
      scheduledTime: '15:45',
      status: 'pending',
      distance: 472,
    },
    {
      name: 'Mumbai CST',
      code: 'CSTM',
      scheduledTime: '22:50',
      status: 'pending',
      distance: 1285,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Live Train Status
        </h1>
        <p className="text-lg text-slate-600">
          Check real-time running status and see where your train is
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Train Number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g., 12001 (Rajdhani), 20501 (Shatabdi)"
                maxLength={5}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || trainNumber.length !== 5}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search size={18} />
                {isLoading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Enter a 5-digit train number. Example: 12001 (Rajdhani), 20501 (Shatabdi)
            </p>
          </div>
        </form>

        {/* Popular Trains Quick Links */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-3">Popular Trains:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { num: '12001', name: 'Rajdhani (Delhi-Mumbai)' },
              { num: '20501', name: 'Shatabdi (Delhi-Agra)' },
              { num: '12399', name: 'Shatabdi (Delhi-Lucknow)' },
            ].map((train) => (
              <button
                key={train.num}
                onClick={() => {
                  setTrainNumber(train.num);
                  setError(null);
                }}
                className="px-3 py-1.5 text-xs rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {train.num} • {train.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Unable to fetch train status</p>
            <p className="text-sm text-red-800 mt-1">{error}</p>
            <p className="text-xs text-red-700 mt-2">
              Try checking{' '}
              <a
                href="https://www.ntes.indianrailways.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NTES.gov.in
              </a>{' '}
              directly for official status.
            </p>
          </div>
        </div>
      )}

      {/* Timeline Display */}
      {trainData && (
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Train</p>
              <p className="font-mono font-semibold text-slate-900">{trainData.trainNumber}</p>
              <p className="text-xs text-slate-500 mt-1">{trainData.trainName}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <p
                className={`font-semibold ${
                  trainData.status === 'On Time'
                    ? 'text-green-600'
                    : trainData.status === 'Delayed'
                    ? 'text-red-600'
                    : 'text-slate-900'
                }`}
              >
                {trainData.status}
              </p>
              {trainData.delay > 0 && (
                <p className="text-xs text-red-600 mt-1">+{trainData.delay}m late</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Current Station</p>
              <p className="font-semibold text-slate-900">
                {trainData.currentStation || 'Loading...'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Last Updated</p>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <p className="font-mono text-xs text-slate-700">{trainData.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <TrainTimeline
            stations={sampleStations}
            trainNumber={trainData.trainNumber}
            trainName={trainData.trainName}
            lastUpdated={trainData.lastUpdated}
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ℹ️ Train status updates every 5 minutes. For real-time updates, visit{' '}
              <a
                href="https://www.ntes.indianrailways.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                NTES.gov.in
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Default Timeline (When no search) */}
      {!trainData && !error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">Search for a train to see its live status</p>
          <p className="text-sm text-slate-400">
            Enter any 5-digit Indian Railways train number above
          </p>
        </div>
      )}
    </div>
  );
}
