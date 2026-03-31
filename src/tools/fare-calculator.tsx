import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi, formatFare } from '../lib/train-api';

interface FareResponse {
  classCode: string;
  distanceKm: number;
  breakup: { baseFare: number; reservation: number; superfast: number; gst: number };
  total: number;
}

export default function FareCalculator() {
  const [distanceKm, setDistanceKm] = useState('750');
  const [classCode, setClassCode] = useState('3A');
  const [data, setData] = useState<FareResponse | null>(null);

  const calculateFare = async () => {
    const response = await fetchTrainApi<FareResponse>(`/api/train/fare-calculator?distanceKm=${distanceKm}&classCode=${classCode}`);
    setData(response);
  };

  return (
    <TrainToolScaffold
      title="Fare Calculator"
      subtitle="Estimate total ticket fare with base fare, surcharge, and GST."
      controls={
        <InputRow>
          <TextInput value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="Distance in KM" />
          <TextInput value={classCode} onChange={(e) => setClassCode(e.target.value.toUpperCase())} placeholder="Class code (SL/3A/2A)" />
          <ActionButton onClick={calculateFare}>Calculate</ActionButton>
        </InputRow>
      }
    >
      {data && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Class</p>
            <p className="font-bold text-slate-900">{data.classCode}</p>
            <p className="mt-4 text-sm text-slate-500">Distance</p>
            <p className="font-bold text-slate-900">{data.distanceKm} km</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-indigo-600"><Calculator className="h-4 w-4" /> Fare Breakup</div>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>Base: {formatFare(data.breakup.baseFare)}</p>
              <p>Reservation: {formatFare(data.breakup.reservation)}</p>
              <p>Superfast: {formatFare(data.breakup.superfast)}</p>
              <p>GST: {formatFare(data.breakup.gst)}</p>
              <p className="pt-2 text-base font-bold text-slate-900">Total: {formatFare(data.total)}</p>
            </div>
          </div>
        </div>
      )}
    </TrainToolScaffold>
  );
}
