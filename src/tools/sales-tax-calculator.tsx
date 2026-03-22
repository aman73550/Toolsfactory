import React, { useState } from 'react';
import { Calculator, DollarSign, Percent } from 'lucide-react';

export default function SalesTaxCalculator() {
  const [amount, setAmount] = useState<string>('100');
  const [taxRate, setTaxRate] = useState<string>('5');
  const [calculationType, setCalculationType] = useState<'add' | 'extract'>('add');

  const calculateTax = () => {
    const numAmount = parseFloat(amount) || 0;
    const numRate = parseFloat(taxRate) || 0;

    if (calculationType === 'add') {
      // Amount is before tax
      const taxAmount = numAmount * (numRate / 100);
      const grossAmount = numAmount + taxAmount;
      return { net: numAmount, tax: taxAmount, gross: grossAmount };
    } else {
      // Amount is after tax (inclusive)
      const netAmount = numAmount / (1 + (numRate / 100));
      const taxAmount = numAmount - netAmount;
      return { net: netAmount, tax: taxAmount, gross: numAmount };
    }
  };

  const result = calculateTax();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Sales Tax Calculator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Easily add or extract sales tax from any amount.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setCalculationType('add')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${calculationType === 'add' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Add Tax (Exclusive)
              </button>
              <button
                onClick={() => setCalculationType('extract')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${calculationType === 'extract' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Extract Tax (Inclusive)
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {calculationType === 'add' ? 'Amount Before Tax' : 'Total Amount (Inc. Tax)'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Tax Rate (%)</label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
                  placeholder="5"
                />
              </div>
            </div>

          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">Calculation Result</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Net Amount (Before Tax)</span>
                <span className="text-lg font-semibold text-slate-800">{formatCurrency(result.net)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Tax Amount ({taxRate}%)</span>
                <span className="text-lg font-semibold text-rose-600">+{formatCurrency(result.tax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4">
                <span className="text-slate-800 font-bold text-lg">Gross Amount (Total)</span>
                <span className="text-3xl font-bold text-indigo-600">{formatCurrency(result.gross)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
