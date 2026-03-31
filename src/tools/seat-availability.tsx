import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface SeatAvailabilityResponse {
  trainNumber: string;
  classCode: string;
  calendar: { date: string; status: string }[];
}

export default function SeatAvailability() {
  const [trainNumber, setTrainNumber] = useState('12627');
  const [classCode, setClassCode] = useState('3A');
  const [data, setData] = useState<SeatAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<SeatAvailabilityResponse>(`/api/train/seat-availability?trainNumber=${trainNumber}&classCode=${classCode}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Seat Availability"
      subtitle="Track berth availability snapshots across upcoming dates."
      controls={
        <InputRow>
          <TextInput value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} placeholder="Train number" maxLength={5} />
          <TextInput value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="Class (SL/3A/2A)" maxLength={3} />
          <ActionButton onClick={check} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check Seats'}</ActionButton>
        </InputRow>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {data?.calendar.map((entry) => {
          const green = entry.status.includes('AVAILABLE');
          const amber = entry.status.includes('RAC');
          return (
            <div key={entry.date} className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">{entry.date}</p>
              <p className={`mt-1 text-sm font-bold ${green ? 'text-emerald-600' : amber ? 'text-amber-600' : 'text-rose-600'}`}>{entry.status}</p>
            </div>
          );
        })}
      </div>
    </TrainToolScaffold>
  );
}
