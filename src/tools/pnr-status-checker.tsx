import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface PnrResponse {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  doj: string;
  chartStatus: string;
  probability: number;
  passengers: { passenger: number; bookingStatus: string; currentStatus: string }[];
}

export default function PnrStatusChecker() {
  const [pnr, setPnr] = useState('1234567890');
  const [data, setData] = useState<PnrResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkPnr = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchTrainApi<PnrResponse>(`/api/train/pnr-status?pnr=${pnr}`);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch PNR status.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = data?.passengers?.[0]?.currentStatus || '';
  const confirmed = currentStatus.includes('CNF');

  return (
    <TrainToolScaffold
      title="PNR Status Checker"
      subtitle="Check confirmation probability, coach-seat status, and chart status instantly."
      controls={
        <InputRow>
          <TextInput value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="Enter 10-digit PNR" maxLength={10} />
          <div className="hidden md:block" />
          <ActionButton onClick={checkPnr} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check PNR'}</ActionButton>
        </InputRow>
      }
    >
      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {data && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-slate-500">PNR {data.pnr}</p>
              <h3 className="text-xl font-bold text-slate-900">{data.trainName} ({data.trainNumber})</h3>
              <p className="text-sm text-slate-600">{data.from} to {data.to} | Journey {data.doj}</p>
            </div>
            <div className={`rounded-xl px-3 py-2 text-sm font-bold ${confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {currentStatus}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Chart Status</p>
              <p className="font-semibold text-slate-800">{data.chartStatus}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Confirmation Probability</p>
              <p className="font-semibold text-slate-800">{data.probability}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Passenger 1</p>
              <p className="font-semibold text-slate-800">{data.passengers[0]?.bookingStatus} to {data.passengers[0]?.currentStatus}</p>
            </div>
          </div>

          <div className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${confirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {confirmed ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {confirmed ? 'Ticket looks confirmed as per current charting data.' : 'Ticket is waitlisted/RAC as of latest public feed.'}
          </div>
        </div>
      )}
    </TrainToolScaffold>
  );
}
