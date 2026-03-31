import React from 'react';
import { TrainFront, Search } from 'lucide-react';

interface TrainToolScaffoldProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  controls: React.ReactNode;
}

export function TrainToolScaffold({ title, subtitle, controls, children }: TrainToolScaffoldProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)] md:p-8">
        <div className="mb-5 flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)]">
            <TrainFront className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-slate-600">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.06)] md:p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Search className="h-4 w-4" /> Search Rail Data
          </div>
          <div className="mt-3">{controls}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)] md:p-7">
        {children}
      </div>
    </div>
  );
}

export function InputRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">{children}</div>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 rounded-xl border border-slate-300 px-4 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  );
}

export function ActionButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    />
  );
}
