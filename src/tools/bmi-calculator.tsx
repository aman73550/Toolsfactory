import React, { useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';

export default function BmiCalculator() {
  const [system, setSystem] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');

  const calculateBMI = () => {
    let h = 0;
    let w = parseFloat(weight);

    if (system === 'metric') {
      h = parseFloat(height) / 100; // cm to meters
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      h = (ft * 12 + inch) * 0.0254; // inches to meters
      w = w * 0.453592; // lbs to kg
    }

    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '0.0';
  };

  const bmi = parseFloat(calculateBMI());

  const getCategory = (bmiValue: number) => {
    if (bmiValue === 0) return { label: 'Enter details', color: 'text-slate-400', bg: 'bg-slate-100', position: 0 };
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-500', position: Math.min(Math.max((bmiValue - 10) / 8.5 * 25, 0), 25) };
    if (bmiValue >= 18.5 && bmiValue < 25) return { label: 'Normal Weight', color: 'text-emerald-500', bg: 'bg-emerald-500', position: 25 + ((bmiValue - 18.5) / 6.5 * 25) };
    if (bmiValue >= 25 && bmiValue < 30) return { label: 'Overweight', color: 'text-amber-500', bg: 'bg-amber-500', position: 50 + ((bmiValue - 25) / 5 * 25) };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500', position: Math.min(75 + ((bmiValue - 30) / 10 * 25), 100) };
  };

  const category = getCategory(bmi);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">BMI Calculator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Calculate your Body Mass Index (BMI) to understand your weight category.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          {/* Toggle System */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSystem('metric')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${system === 'metric' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Metric (cm/kg)
            </button>
            <button
              onClick={() => setSystem('imperial')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${system === 'imperial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Imperial (ft/lbs)
            </button>
          </div>

          <div className="space-y-4">
            {system === 'metric' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Height (ft)</label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Height (in)</label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="e.g. 9"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Weight ({system === 'metric' ? 'kg' : 'lbs'})</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={system === 'metric' ? "e.g. 70" : "e.g. 150"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your BMI</h3>
            <div className="text-6xl font-bold text-slate-900 tracking-tight">
              {bmi > 0 ? bmi : '--'}
            </div>
            <p className={`text-xl font-medium ${category.color}`}>
              {category.label}
            </p>
          </div>

          {/* Visual Scale */}
          <div className="w-full space-y-2 pt-4">
            <div className="relative h-4 rounded-full overflow-hidden flex">
              <div className="h-full w-1/4 bg-blue-400"></div>
              <div className="h-full w-1/4 bg-emerald-400"></div>
              <div className="h-full w-1/4 bg-amber-400"></div>
              <div className="h-full w-1/4 bg-red-400"></div>
            </div>
            {bmi > 0 && (
              <div className="relative w-full h-4">
                <div 
                  className="absolute top-0 -ml-2 transition-all duration-500 ease-out"
                  style={{ left: `${category.position}%` }}
                >
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-slate-800"></div>
                </div>
              </div>
            )}
            <div className="flex justify-between text-xs font-medium text-slate-400 px-1 pt-2">
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
