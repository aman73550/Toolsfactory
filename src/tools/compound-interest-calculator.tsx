import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(7);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // 12 = monthly

  const calculateData = () => {
    let currentPrincipal = principal;
    let totalContributions = principal;
    const data = [];
    
    // Add year 0
    data.push({
      year: 0,
      principal: currentPrincipal,
      interest: 0,
      total: currentPrincipal
    });

    for (let y = 1; y <= years; y++) {
      // Calculate for this year
      // A = P(1 + r/n)^(nt) + PMT × {[(1 + r/n)^(nt) - 1] / (r/n)}
      // We will do it step by step per month to be accurate with monthly contributions
      
      let yearInterest = 0;
      for (let m = 1; m <= 12; m++) {
        // Add contribution at start of month
        currentPrincipal += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Calculate interest for this month (if compounding monthly)
        // For simplicity, we'll apply (rate/100)/12 each month
        const monthlyInterest = currentPrincipal * ((rate / 100) / 12);
        currentPrincipal += monthlyInterest;
      }

      data.push({
        year: y,
        principal: totalContributions,
        interest: Math.round(currentPrincipal - totalContributions),
        total: Math.round(currentPrincipal)
      });
    }

    return data;
  };

  const chartData = useMemo(() => calculateData(), [principal, monthlyContribution, years, rate, compoundFreq]);
  
  const finalResult = chartData[chartData.length - 1];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Compound Interest Calculator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Visualize how your money grows over time with the power of compound interest.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Initial Investment</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Monthly Contribution</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Investment Time (Years)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="w-12 text-right font-bold text-slate-800">{years} Yrs</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Estimated Interest Rate (%)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="0.1"
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="w-12 text-right font-bold text-slate-800">{rate}%</span>
              </div>
            </div>
          </div>

          {/* Chart & Results Section */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total Principal</p>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(finalResult.principal)}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total Interest</p>
                <p className="text-xl font-bold text-emerald-600">+{formatCurrency(finalResult.interest)}</p>
              </div>
              <div className="bg-indigo-600 p-4 rounded-xl border border-indigo-700 shadow-sm text-white">
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider mb-1">Total Balance</p>
                <p className="text-xl font-bold">{formatCurrency(finalResult.total)}</p>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="year" 
                    tickFormatter={(val) => `Yr ${val}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area 
                    type="monotone" 
                    dataKey="principal" 
                    name="Principal (Deposits)"
                    stackId="1" 
                    stroke="#4f46e5" 
                    fill="url(#colorPrincipal)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interest" 
                    name="Accrued Interest"
                    stackId="1" 
                    stroke="#10b981" 
                    fill="url(#colorInterest)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
