import React, { useState, useEffect } from 'react';
import { Key, Copy, RefreshCw, Shield, Check } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('Please select at least one option');
      return;
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (password && password !== 'Please select at least one option') {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateStrength = () => {
    if (password === 'Please select at least one option') return 0;
    let strength = 0;
    if (length >= 12) strength += 25;
    if (length >= 16) strength += 25;
    if (includeUppercase) strength += 12.5;
    if (includeLowercase) strength += 12.5;
    if (includeNumbers) strength += 12.5;
    if (includeSymbols) strength += 12.5;
    return Math.min(100, strength);
  };

  const strength = calculateStrength();
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  if (strength >= 100) { strengthLabel = 'Very Strong'; strengthColor = 'bg-emerald-500'; }
  else if (strength >= 75) { strengthLabel = 'Strong'; strengthColor = 'bg-indigo-500'; }
  else if (strength >= 50) { strengthLabel = 'Medium'; strengthColor = 'bg-amber-500'; }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Secure Password Generator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Generate strong, random, and secure passwords instantly.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Generated locally on your device. Never sent to the internet.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 space-y-8">
        {/* Password Display */}
        <div className="relative">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 pr-32 break-all font-mono text-2xl text-slate-800 min-h-[80px] flex items-center">
            {password}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
              onClick={generatePassword}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Generate New"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-600">Password Strength</span>
            <span className={strengthColor.replace('bg-', 'text-')}>{strengthLabel}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${strengthColor} transition-all duration-300`} 
              style={{ width: `${strength}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <label className="flex justify-between text-sm font-medium text-slate-700">
              <span>Password Length</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{length}</span>
            </label>
            <input 
              type="range" min="8" max="64" value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" checked={includeUppercase} 
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" checked={includeLowercase} 
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" checked={includeNumbers} 
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" checked={includeSymbols} 
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
