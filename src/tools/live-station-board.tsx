import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi, formatRailTime } from '../lib/train-api';

interface StationBoardResponse {
  stationCode: string;
  stationName: string;
  rows: { trainNumber: string; trainName: string; type: string; scheduled: string; expected: string; platform: string }[];
}

export default function LiveStationBoard() {
  const [stationCode, setStationCode] = useState('NDLS');
  const [data, setData] = useState<StationBoardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<StationBoardResponse>(`/api/train/live-station-board?stationCode=${stationCode}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Live Station Board"
      subtitle="View arrivals and departures for the next few hours in a live feed format."
      controls={
        <InputRow>
          <TextInput value={stationCode} onChange={(e) => setStationCode(e.target.value.toUpperCase())} placeholder="Station code" maxLength={5} />
          <div className="hidden md:block" />
          <ActionButton onClick={loadBoard} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Board'}</ActionButton>
        </InputRow>
      }
    >
      {data && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-3 py-2">Train</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Scheduled</th><th className="px-3 py-2">Expected</th><th className="px-3 py-2">PF</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={`${row.trainNumber}-${row.type}`} className="border-t border-slate-200">
                  <td className="px-3 py-2"><p className="font-semibold text-slate-900">{row.trainNumber}</p><p className="text-xs text-slate-500">{row.trainName}</p></td>
                  <td className="px-3 py-2">{row.type}</td>
                  <td className="px-3 py-2">{formatRailTime(row.scheduled)}</td>
                  <td className="px-3 py-2 text-amber-600">{formatRailTime(row.expected)}</td>
                  <td className="px-3 py-2">{row.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TrainToolScaffold>
  );
}
