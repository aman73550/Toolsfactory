import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const calculateEMI = () => {
    const p = principal;
    const r = rate / 12 / 100; // Monthly interest rate
    const n = tenureType === 'years' ? tenure * 12 : tenure; // Total months

    if (p <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi,
      totalInterest,
      totalPayment
    };
  };

  const result = useMemo(() => calculateEMI(), [principal, rate, tenure, tenureType]);

  const chartData = [
    { name: 'Principal Amount', value: principal, color: '#4f46e5' }, // Indigo-600
    { name: 'Total Interest', value: result.totalInterest, color: '#f43f5e' } // Rose-500
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Loan / EMI Calculator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Calculate your Equated Monthly Installment (EMI) with a visual breakdown of principal and interest.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-8">
            {/* Principal */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Loan Amount</label>
                <div className="relative w-32">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-right font-semibold text-slate-800"
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="1000000" 
                step="1000"
                value={principal} 
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>$1K</span>
                <span>$1M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Interest Rate (p.a)</label>
                <div className="relative w-24">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-right font-semibold text-slate-800"
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="0.1"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Loan Tenure</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-right font-semibold text-slate-800"
                  />
                  <div className="flex bg-slate-200 p-0.5 rounded-lg">
                    <button
                      onClick={() => setTenureType('years')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tenureType === 'years' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                    >
                      Yr
                    </button>
                    <button
                      onClick={() => setTenureType('months')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tenureType === 'months' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max={tenureType === 'years' ? 30 : 360} 
                step="1"
                value={tenure} 
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>1 {tenureType === 'years' ? 'Yr' : 'Mo'}</span>
                <span>{tenureType === 'years' ? '30 Yrs' : '360 Mos'}</span>
              </div>
            </div>
          </div>

          {/* Results & Chart Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Monthly EMI</p>
              <h2 className="text-4xl font-bold text-indigo-600">{formatCurrency(result.emi)}</h2>
            </div>

            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Total Principal</p>
                <p className="text-lg font-semibold text-slate-800">{formatCurrency(principal)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Total Interest</p>
                <p className="text-lg font-semibold text-rose-500">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div className="col-span-2 pt-2">
                <p className="text-xs text-slate-500 font-medium mb-1">Total Payment (Principal + Interest)</p>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
