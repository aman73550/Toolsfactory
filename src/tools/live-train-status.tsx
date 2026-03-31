import React, { useState } from 'react';
import { Loader2, MapPin, TrainFront } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi, formatRailTime } from '../lib/train-api';

interface RouteStop {
  code: string;
  name: string;
  schArr: string;
  schDep: string;
  actArr: string;
  actDep: string;
  delayMins: number;
  status: 'Departed' | 'Current' | 'Upcoming';
}

interface LiveStatusResponse {
  trainNumber: string;
  trainName: string;
  delayMins: number;
  currentStationCode: string;
  route: RouteStop[];
}

export default function LiveTrainStatus() {
  const [trainNumber, setTrainNumber] = useState('12627');
  const [data, setData] = useState<LiveStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchTrainApi<LiveStatusResponse>(`/api/train/live-status?trainNumber=${trainNumber}`);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch live status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Live Train Status"
      subtitle="Track real-time train movement with route timeline and delay insights."
      controls={
        <InputRow>
          <TextInput value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} placeholder="Enter 5-digit train number" maxLength={5} />
          <div className="hidden md:block" />
          <ActionButton onClick={fetchStatus} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}</ActionButton>
        </InputRow>
      }
    >
      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      {data && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{data.trainName}</h3>
                <p className="text-sm text-slate-500">Train {data.trainNumber}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" /> Current Location
              </div>
            </div>
            <p className="mt-2 text-sm text-amber-600">Delayed by {data.delayMins} mins</p>
          </div>

          <div className="relative pl-4">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-200" />
            <div className="space-y-4">
              {data.route.map((stop) => (
                <div key={stop.code} className="relative rounded-xl border border-slate-200 p-4">
                  <span className={`absolute -left-1.5 top-6 h-3 w-3 rounded-full ${stop.status === 'Current' ? 'bg-emerald-500' : stop.status === 'Departed' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                  {stop.status === 'Current' && <TrainFront className="absolute -left-8 top-4 h-5 w-5 text-indigo-600" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{stop.name} ({stop.code})</p>
                      <p className="text-xs text-slate-500">Scheduled {formatRailTime(stop.schArr)} / {formatRailTime(stop.schDep)}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-slate-700">Actual {formatRailTime(stop.actArr)} / {formatRailTime(stop.actDep)}</p>
                      <p className="text-amber-600">{stop.delayMins > 0 ? `${stop.delayMins} mins late` : 'On time'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-4 w-4" />
            Data sourced from public railway web sources with no-login backend fetch.
          </div>
        </div>
      )}
    </TrainToolScaffold>
  );
}
