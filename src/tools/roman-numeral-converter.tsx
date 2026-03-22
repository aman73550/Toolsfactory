import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

export default function RomanNumeralConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [error, setError] = useState('');

  const intToRoman = (num: number): string => {
    if (num < 1 || num > 3999) throw new Error('Number must be between 1 and 3999');
    const romanMap: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let result = '';
    for (let key in romanMap) {
      while (num >= romanMap[key]) {
        result += key;
        num -= romanMap[key];
      }
    }
    return result;
  };

  const romanToInt = (s: string): number => {
    const romanMap: { [key: string]: number } = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };
    let result = 0;
    for (let i = 0; i < s.length; i++) {
      const current = romanMap[s[i]];
      const next = romanMap[s[i + 1]];
      if (!current) throw new Error('Invalid Roman Numeral character');
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    // Validate by converting back
    if (intToRoman(result) !== s) throw new Error('Invalid Roman Numeral format');
    return result;
  };

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'toRoman') {
        const num = parseInt(input, 10);
        if (isNaN(num)) throw new Error('Please enter a valid number');
        setOutput(intToRoman(num));
      } else {
        const upperStr = input.trim().toUpperCase();
        setOutput(romanToInt(upperStr).toString());
      }
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'toRoman' ? 'toNumber' : 'toRoman');
    setInput(output);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Roman Numeral Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Convert numbers to Roman Numerals and vice versa instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {mode === 'toRoman' ? 'Number (1 - 3999)' : 'Roman Numeral'}
            </label>
            <input
              type={mode === 'toRoman' ? 'number' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'toRoman' ? 'e.g. 2024' : 'e.g. MMXXIV'}
              className="w-full px-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-xl text-center font-medium uppercase"
            />
          </div>

          <button 
            onClick={toggleMode}
            className="p-4 bg-slate-50 border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm mt-6 md:mt-0"
            title="Swap conversion direction"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {mode === 'toRoman' ? 'Roman Numeral' : 'Number'}
            </label>
            <div className={`w-full px-4 py-4 rounded-xl border ${error ? 'border-rose-300 bg-rose-50' : 'border-indigo-200 bg-indigo-50'} text-xl text-center font-bold min-h-[60px] flex items-center justify-center`}>
              {error ? (
                <span className="text-rose-500 text-sm font-medium">{error}</span>
              ) : (
                <span className="text-indigo-700">{output || '-'}</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
