import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi, formatRailTime } from '../lib/train-api';

interface RescheduledResponse {
  date: string;
  list: { trainNumber: string; trainName: string; delayedByMins: number; updatedDeparture: string }[];
}

export default function RescheduledTrains() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<RescheduledResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<RescheduledResponse>(`/api/train/rescheduled-trains?date=${date}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Rescheduled Trains"
      subtitle="Get latest delays, revised departures, and diversion impact updates."
      controls={
        <InputRow>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-4" />
          <div className="hidden md:block" />
          <ActionButton onClick={fetchList} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Updates'}</ActionButton>
        </InputRow>
      }
    >
      <div className="space-y-2">
        {data?.list.map((item) => (
          <div key={item.trainNumber} className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold text-slate-900">{item.trainName} ({item.trainNumber})</p>
            <p className="text-sm text-amber-600">Delayed by {item.delayedByMins} mins</p>
            <p className="text-xs text-slate-500">Updated departure: {formatRailTime(item.updatedDeparture)}</p>
          </div>
        ))}
      </div>
    </TrainToolScaffold>
  );
}
