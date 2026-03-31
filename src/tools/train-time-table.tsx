import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi, formatRailTime } from '../lib/train-api';

interface TimeTableResponse {
  trainNumber: string;
  trainName: string;
  route: { code: string; name: string; schArr: string; schDep: string; distanceKm: number; haltMins: number }[];
}

export default function TrainTimeTable() {
  const [trainNumber, setTrainNumber] = useState('12627');
  const [data, setData] = useState<TimeTableResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTimeTable = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<TimeTableResponse>(`/api/train/time-table?trainNumber=${trainNumber}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Train Time Table"
      subtitle="Browse the full route schedule with station-wise halt and distance timeline."
      controls={
        <InputRow>
          <TextInput value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} placeholder="Train number" maxLength={5} />
          <div className="hidden md:block" />
          <ActionButton onClick={loadTimeTable} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View Schedule'}</ActionButton>
        </InputRow>
      }
    >
      <div className="relative pl-5">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-slate-200" />
        <div className="space-y-3">
          {data?.route.map((stop) => (
            <div key={stop.code} className="relative rounded-xl border border-slate-200 p-4">
              <span className="absolute -left-[18px] top-6 h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <p className="font-semibold text-slate-900">{stop.name} ({stop.code})</p>
              <p className="text-sm text-slate-600">Arrival {formatRailTime(stop.schArr)} | Departure {formatRailTime(stop.schDep)}</p>
              <p className="text-xs text-slate-500">Distance {stop.distanceKm} km | Halt {stop.haltMins} mins</p>
            </div>
          ))}
        </div>
      </div>
    </TrainToolScaffold>
  );
}
