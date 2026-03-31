import React, { useState } from 'react';
import { Loader2, MapPinned } from 'lucide-react';
import { ActionButton, InputRow, TextInput, TrainToolScaffold } from '../components/train/TrainToolScaffold';
import { fetchTrainApi } from '../lib/train-api';

interface PlatformLocatorResponse {
  stationCode: string;
  stationName: string;
  recent: { date: string; platform: string }[];
}

export default function PlatformLocator() {
  const [trainNumber, setTrainNumber] = useState('12627');
  const [stationCode, setStationCode] = useState('NDLS');
  const [data, setData] = useState<PlatformLocatorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const locate = async () => {
    setLoading(true);
    try {
      const response = await fetchTrainApi<PlatformLocatorResponse>(`/api/train/platform-locator?trainNumber=${trainNumber}&stationCode=${stationCode}`);
      setData(response);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainToolScaffold
      title="Platform Locator"
      subtitle="Use historical station records to estimate likely platform numbers."
      controls={
        <InputRow>
          <TextInput value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} placeholder="Train number" maxLength={5} />
          <TextInput value={stationCode} onChange={(e) => setStationCode(e.target.value.toUpperCase())} placeholder="Station code" maxLength={5} />
          <ActionButton onClick={locate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Locate Platform'}</ActionButton>
        </InputRow>
      }
    >
      <p className="text-sm text-slate-600">Tap locate to open platform suggestion pop-up.</p>

      {showPopup && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm" onClick={() => setShowPopup(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.22)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-indigo-600"><MapPinned className="h-5 w-5" /> Platform trend at {data.stationName}</div>
            <div className="mt-3 space-y-2">
              {data.recent.map((item) => (
                <div key={item.date} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-sm text-slate-600">{item.date}</span>
                  <span className="font-bold text-slate-900">PF {item.platform}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopup(false)} className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Close</button>
          </div>
        </div>
      )}
    </TrainToolScaffold>
  );
}
