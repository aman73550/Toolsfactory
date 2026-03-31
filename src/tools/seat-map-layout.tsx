import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface SeatMapResponse {
  classCode: string;
  rows: { row: number; berths: { number: number; type: string; isWindow: boolean }[] }[];
}

export default function SeatMapLayout() {
  const [classCode, setClassCode] = useState('3A');
  const [data, setData] = useState<SeatMapResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMap = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<SeatMapResponse>(`/api/train/seat-map?classCode=${classCode}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Seat Map / Layout"
      subtitle="Visual berth blueprint for Sleeper, 3A, 2A, and Chair Car configurations."
      controls={
        <InputRow>
          <TextInput value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="Class code (SL/3A/2A/CC)" maxLength={3} />
          <div className="hidden md:block" />
          <ActionButton onClick={loadMap} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Show Layout'}</ActionButton>
        </InputRow>
      }
    >
      <svg viewBox="0 0 1000 540" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3">
        {data?.rows.slice(0, 6).map((row, rowIndex) => (
          <g key={row.row} transform={`translate(10, ${rowIndex * 86 + 10})`}>
            <text x="0" y="24" className="fill-slate-500 text-xs">Row {row.row}</text>
            {row.berths.map((berth, berthIndex) => (
              <g key={berth.number} transform={`translate(${berthIndex * 180 + 80}, 0)`}>
                <rect width="160" height="54" rx="10" fill={berth.isWindow ? '#dbeafe' : '#e2e8f0'} stroke="#94a3b8" />
                <text x="10" y="24" className="fill-slate-800 text-xs font-bold">{berth.number}</text>
                <text x="10" y="42" className="fill-slate-600 text-[11px]">{berth.type}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </TrainToolScaffold>
  );
}
