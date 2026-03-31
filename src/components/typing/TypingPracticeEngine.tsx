import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, Share2 } from 'lucide-react';

interface TypingPracticeEngineProps {
  title: string;
  text: string;
  personalBestKey: string;
  duration?: number;
  inputMode?: React.HTMLAttributes<HTMLTextAreaElement>['inputMode'];
}

interface SpeedPoint {
  second: number;
  wpm: number;
}

function calculateCorrectChars(target: string, typed: string) {
  let correct = 0;
  for (let i = 0; i < typed.length; i += 1) {
    if (typed[i] === target[i]) correct += 1;
  }
  return correct;
}

function computeWpm(correctChars: number, elapsedSeconds: number) {
  if (elapsedSeconds <= 0) return 0;
  return (correctChars / 5) / (elapsedSeconds / 60);
}

export default function TypingPracticeEngine({
  title,
  text,
  personalBestKey,
  duration = 60,
  inputMode
}: TypingPracticeEngineProps) {
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [chartData, setChartData] = useState<SpeedPoint[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [bestWpm, setBestWpm] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(personalBestKey);
    setBestWpm(saved ? Number(saved) : 0);
  }, [personalBestKey]);

  useEffect(() => {
    if (!startedAt || isFinished) return;
    const timer = window.setInterval(() => {
      const elapsed = Math.min(duration, Math.floor((Date.now() - startedAt) / 1000));
      setElapsedSeconds(elapsed);
      if (elapsed >= duration) {
        setIsFinished(true);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [startedAt, isFinished, duration]);

  const correctChars = useMemo(() => calculateCorrectChars(text, typed), [text, typed]);
  const totalTyped = typed.length;
  const accuracy = totalTyped === 0 ? 100 : (correctChars / totalTyped) * 100;
  const currentWpm = useMemo(() => computeWpm(correctChars, elapsedSeconds), [correctChars, elapsedSeconds]);
  const errors = Math.max(0, totalTyped - correctChars);
  const timeLeft = Math.max(0, duration - elapsedSeconds);

  useEffect(() => {
    if (!startedAt || isFinished) return;
    const everyFiveSeconds = window.setInterval(() => {
      setChartData((prev) => {
        const next = [...prev, { second: elapsedSeconds, wpm: Math.round(currentWpm) }];
        return next.slice(-24);
      });
    }, 5000);
    return () => window.clearInterval(everyFiveSeconds);
  }, [startedAt, isFinished, elapsedSeconds, currentWpm]);

  useEffect(() => {
    if (!isFinished) return;
    const finalWpm = Math.round(currentWpm);
    if (finalWpm > bestWpm) {
      localStorage.setItem(personalBestKey, String(finalWpm));
      setBestWpm(finalWpm);
    }
  }, [isFinished, currentWpm, bestWpm, personalBestKey]);

  const restart = () => {
    setTyped('');
    setStartedAt(null);
    setElapsedSeconds(0);
    setChartData([]);
    setIsFinished(false);
  };

  const shareText = `I scored ${Math.round(currentWpm)} WPM with ${Math.round(accuracy)}% accuracy on ${title}.`;
  const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const waIntent = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] md:grid-cols-5">
        <div><p className="text-xs text-slate-500">WPM</p><p className="text-2xl font-bold text-indigo-600">{Math.round(currentWpm)}</p></div>
        <div><p className="text-xs text-slate-500">Accuracy</p><p className="text-2xl font-bold text-slate-900">{Math.round(accuracy)}%</p></div>
        <div><p className="text-xs text-slate-500">Errors</p><p className="text-2xl font-bold text-rose-500">{errors}</p></div>
        <div><p className="text-xs text-slate-500">Timer</p><p className="text-2xl font-bold text-slate-900">{timeLeft}s</p></div>
        <div><p className="text-xs text-slate-500">Personal Best</p><p className="text-2xl font-bold text-emerald-600">{bestWpm}</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="mb-3 text-sm font-semibold text-slate-600">Target Text</p>
        <p className="min-h-[90px] rounded-xl bg-slate-50 p-4 leading-7 tracking-wide typing-mono">
          {text.split('').map((ch, idx) => {
            const typedChar = typed[idx];
            const isTyped = idx < typed.length;
            let className = 'text-slate-400';
            if (isTyped && typedChar === ch) className = 'text-indigo-600';
            if (isTyped && typedChar !== ch) className = 'text-red-500';
            return <span key={`${idx}-${ch}`} className={className}>{ch}</span>;
          })}
        </p>

        <textarea
          value={typed}
          onChange={(e) => {
            if (isFinished) return;
            if (!startedAt) setStartedAt(Date.now());
            setTyped(e.target.value);
          }}
          disabled={isFinished}
          inputMode={inputMode}
          className="mt-4 h-32 w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 typing-mono"
          placeholder="Start typing here..."
        />

        <div className="mt-4 flex justify-end">
          <button onClick={restart} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Restart
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
        <p className="mb-3 text-sm font-semibold text-slate-600">Live Speed Graph (5s interval)</p>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="second" tickFormatter={(s) => `${s}s`} stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="wpm" stroke="#4F46E5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isFinished && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-indigo-700"><Share2 className="h-4 w-4" /> Share Achievement</div>
          <p className="text-sm text-slate-700">{shareText}</p>
          <div className="mt-3 flex gap-2">
            <a className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white" href={xIntent} target="_blank" rel="noreferrer">Share on X</a>
            <a className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" href={waIntent} target="_blank" rel="noreferrer">Share on WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
