import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface CancelledResponse {
  date: string;
  list: { trainNumber: string; trainName: string; type: string }[];
}

export default function CancelledTrainList() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<CancelledResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<CancelledResponse>(`/api/train/cancelled-trains?date=${date}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Cancelled Train List"
      subtitle="Daily feed of fully and partially cancelled trains."
      controls={
        <InputRow>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-4" />
          <div className="hidden md:block" />
          <ActionButton onClick={fetchList} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch List'}</ActionButton>
        </InputRow>
      }
    >
      <div className="space-y-2">
        {data?.list.map((item) => (
          <div key={item.trainNumber} className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold text-slate-900">{item.trainName} ({item.trainNumber})</p>
            <p className="text-sm text-rose-600">{item.type}</p>
          </div>
        ))}
      </div>
    </TrainToolScaffold>
  );
}
