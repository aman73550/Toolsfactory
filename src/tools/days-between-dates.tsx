import React, { useState } from 'react';
import { Calendar, Clock, Shield } from 'lucide-react';
import { differenceInDays, differenceInMonths, differenceInYears, differenceInWeeks, addDays } from 'date-fns';

export default function DaysBetweenDates() {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(addDays(new Date(), 30).toISOString().split('T')[0]);
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);

  const calculateDifferences = () => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Adjust end date if we include it in the count
    const adjustedEnd = includeEndDate ? addDays(end, 1) : end;
    
    const days = differenceInDays(adjustedEnd, start);
    const weeks = differenceInWeeks(adjustedEnd, start);
    const months = differenceInMonths(adjustedEnd, start);
    const years = differenceInYears(adjustedEnd, start);
    
    return { days, weeks, months, years };
  };

  const diff = calculateDifferences();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Days Between Dates</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Calculate the exact number of days, weeks, months, and years between two dates.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Include end date in calculation (+1 day)</span>
            </label>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">Result</h3>
            
            {diff ? (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-indigo-600">{Math.abs(diff.days)}</span>
                  <p className="text-slate-600 font-medium mt-2">Total Days</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-800">{Math.abs(diff.weeks)}</span>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Weeks</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200">
                    <span className="text-2xl font-bold text-slate-800">{Math.abs(diff.months)}</span>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Months</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-800">{Math.abs(diff.years)}</span>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Years</p>
                  </div>
                </div>
                
                {diff.days < 0 && (
                  <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg text-center border border-amber-200">
                    Note: The start date is after the end date.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Select both dates to see the difference</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
