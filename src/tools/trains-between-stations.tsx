import React, { useEffect, useState } from 'react';
import { Loader2, Navigation } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface TrainsBetweenResponse {
  from: string;
  to: string;
  date: string;
  trains: { number: string; name: string; departure: string; arrival: string; duration: string; classes: string[]; runningDays: string }[];
}

export default function TrainsBetweenStations() {
  const [from, setFrom] = useState('NDLS');
  const [to, setTo] = useState('BPL');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [nearest, setNearest] = useState('');
  const [data, setData] = useState<TrainsBetweenResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const nearestCode = lat > 25 ? 'NDLS' : lat > 18 ? 'BCT' : 'MAS';
        setNearest(nearestCode);
        setFrom((prev) => (prev ? prev : nearestCode));
      },
      () => {
        setNearest('NDLS');
      },
      { timeout: 5000 }
    );
  }, []);

  const search = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<TrainsBetweenResponse>(`/api/train/trains-between?from=${from}&to=${to}&date=${date}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Trains Between Stations"
      subtitle="Find direct trains, durations, classes, and departure slots for your route."
      controls={
        <div className="space-y-3">
          <InputRow>
            <TextInput value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} placeholder="From station code" maxLength={5} />
            <TextInput value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} placeholder="To station code" maxLength={5} />
            <ActionButton onClick={search} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find Trains'}</ActionButton>
          </InputRow>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-4" />
          {nearest && <p className="flex items-center gap-2 text-xs text-slate-500"><Navigation className="h-4 w-4" />Nearest suggested station: {nearest}</p>}
        </div>
      }
    >
      <div className="space-y-3">
        {data?.trains.map((train) => (
          <div key={train.number} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{train.name} ({train.number})</h3>
                <p className="text-sm text-slate-600">{train.departure} to {train.arrival} | {train.duration}</p>
              </div>
              <div className="text-right text-xs text-slate-500">Runs: {train.runningDays}</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {train.classes.map((item) => <span key={item} className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </TrainToolScaffold>
  );
}
