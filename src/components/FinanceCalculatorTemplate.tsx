import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FinanceField {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
  display?: (value: number) => string;
}

interface FinanceResult {
  invested: number;
  returns: number;
  total: number;
}

interface FinanceCalculatorTemplateProps {
  title: string;
  fields: FinanceField[];
  calculate: (values: Record<string, number>) => FinanceResult;
  tabs?: string[];
  summaryLabels?: {
    invested: string;
    returns: string;
    total: string;
  };
  ctaLabel?: string;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export default function FinanceCalculatorTemplate({
  title,
  fields,
  calculate,
  tabs,
  summaryLabels,
  ctaLabel = 'INVEST NOW'
}: FinanceCalculatorTemplateProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    fields.forEach((field) => {
      initial[field.key] = field.defaultValue;
    });
    return initial;
  });

  const result = useMemo(() => calculate(values), [calculate, values]);

  const investedValue = Math.max(0, Number.isFinite(result.invested) ? result.invested : 0);
  const returnsValue = Math.max(0, Number.isFinite(result.returns) ? result.returns : 0);
  const totalValue = Math.max(0, Number.isFinite(result.total) ? result.total : 0);

  const chartData = [
    { name: 'Invested amount', value: investedValue, color: '#d4d8e8' },
    { name: 'Est. returns', value: returnsValue, color: '#4e63f2' }
  ];

  const chartTotal = investedValue + returnsValue;
  const safeChartData = chartTotal === 0
    ? [
        { name: 'Invested amount', value: 1, color: '#d4d8e8' },
        { name: 'Est. returns', value: 0, color: '#4e63f2' }
      ]
    : chartData;

  const labels = summaryLabels ?? {
    invested: 'Invested amount',
    returns: 'Est. returns',
    total: 'Total value'
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5 md:p-8">
      <h2 className="text-3xl font-bold text-slate-700 mb-8">{title}</h2>

      {tabs && tabs.length > 0 && (
        <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 mb-6">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className={index === 0
                ? 'rounded-full bg-[#d8ece8] px-4 py-1.5 text-sm font-semibold text-[#0b9d8a]'
                : 'px-2 py-1.5 text-sm font-semibold text-slate-500'}
            >
              {tab}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-9">
          {fields.map((field) => {
            const currentValue = values[field.key] ?? field.defaultValue;
            return (
              <div key={field.key} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[26px] leading-snug md:text-xl font-medium text-slate-600">{field.label}</label>
                  <div className="min-w-[120px] rounded-md bg-[#d8ece8] px-3 py-1.5 text-right text-2xl md:text-3xl font-bold text-[#0b9d8a]">
                    {field.display
                      ? field.display(currentValue)
                      : `${field.prefix ?? ''}${Math.round(currentValue)}${field.suffix ?? ''}`}
                  </div>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={currentValue}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: clampNumber(nextValue, field.min, field.max)
                    }));
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0bb39c]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-end gap-8 pb-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-8 rounded-full bg-[#d4d8e8]" />
                Invested amount
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-8 rounded-full bg-[#4e63f2]" />
                Est. returns
              </span>
            </div>

            <div className="mx-auto h-[260px] w-full max-w-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={105}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {safeChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid grid-cols-[1fr_auto] gap-y-3 text-sm md:text-base">
              <p className="font-semibold text-slate-500">{labels.invested}</p>
              <p className="font-bold text-slate-700">{currencyFormatter.format(investedValue)}</p>
              <p className="font-semibold text-slate-500">{labels.returns}</p>
              <p className="font-bold text-slate-700">{currencyFormatter.format(returnsValue)}</p>
              <p className="font-semibold text-slate-500">{labels.total}</p>
              <p className="font-bold text-slate-800">{currencyFormatter.format(totalValue)}</p>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-[#12b491] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0f9b7d]"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
