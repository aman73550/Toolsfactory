import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface CoachPositionResponse {
  coach: string;
  platformSide: string;
  expectedPlatform: string;
  coaches: string[];
}

export default function CoachPositionFinder() {
  const [trainNumber, setTrainNumber] = useState('12627');
  const [coach, setCoach] = useState('B2');
  const [data, setData] = useState<CoachPositionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const searchCoach = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<CoachPositionResponse>(`/api/train/coach-position?trainNumber=${trainNumber}&coach=${coach}`);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Coach Position Finder"
      subtitle="Locate coach order and expected platform alignment before train arrival."
      controls={
        <InputRow>
          <TextInput value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} placeholder="Train number" maxLength={5} />
          <TextInput value={coach} onChange={(e) => setCoach(e.target.value.toUpperCase())} placeholder="Coach (S1/B2/A1)" maxLength={3} />
          <ActionButton onClick={searchCoach} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find Coach'}</ActionButton>
        </InputRow>
      }
    >
      {data && (
        <div className="space-y-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">Expected at Platform {data.expectedPlatform} | {data.platformSide}</div>
          <div className="overflow-x-auto">
            <div className="inline-flex rounded-xl border border-slate-300 p-2">
              {data.coaches.map((code) => (
                <div key={code} className={`mx-1 flex h-14 w-14 items-center justify-center rounded-lg border text-xs font-bold ${code === data.coach ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {code}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </TrainToolScaffold>
  );
}
