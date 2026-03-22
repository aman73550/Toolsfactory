import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Volume2 } from 'lucide-react';

const MORSE_CODE_DICT: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ', ': '--..--', '.': '.-.-.-', '?': '..--..',
  '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-'
};

const REVERSE_DICT: { [key: string]: string } = Object.entries(MORSE_CODE_DICT).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

export default function MorseCodeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toMorse' | 'toText'>('toMorse');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'toMorse') {
      const words = input.toUpperCase().split(' ');
      const morseWords = words.map(word => 
        word.split('').map(char => MORSE_CODE_DICT[char] || char).join(' ')
      );
      setOutput(morseWords.join(' / '));
    } else {
      const words = input.trim().split(' / ');
      const textWords = words.map(word => 
        word.split(' ').map(char => REVERSE_DICT[char] || char).join('')
      );
      setOutput(textWords.join(' '));
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'toMorse' ? 'toText' : 'toMorse');
    setInput(output);
  };

  const playMorseCode = async () => {
    if (isPlaying || mode !== 'toMorse' || !output) return;
    
    setIsPlaying(true);
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const dotDuration = 100; // ms
    
    const playTone = (duration: number) => {
      return new Promise<void>((resolve) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 600;
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Smooth envelope to prevent clicking
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.01);
        gain.gain.setValueAtTime(1, ctx.currentTime + (duration/1000) - 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (duration/1000));
        
        osc.start();
        osc.stop(ctx.currentTime + (duration/1000));
        
        setTimeout(() => resolve(), duration);
      });
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const char of output) {
      if (char === '.') {
        await playTone(dotDuration);
        await sleep(dotDuration); // Space between parts of same letter
      } else if (char === '-') {
        await playTone(dotDuration * 3);
        await sleep(dotDuration);
      } else if (char === ' ') {
        await sleep(dotDuration * 3); // Space between letters
      } else if (char === '/') {
        await sleep(dotDuration * 7); // Space between words
      }
    }
    
    setIsPlaying(false);
    ctx.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Morse Code Converter</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Translate text to Morse code and vice versa.
        </p>
      </div>

      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden p-6 md:p-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          
          {/* Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              {mode === 'toMorse' ? 'Text Input' : 'Morse Code Input'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'toMorse' ? "Enter text to convert..." : "Enter morse code (use spaces between letters, / between words)..."}
              className="w-full h-48 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button 
              onClick={toggleMode}
              className="p-3 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
            >
              <ArrowRightLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              {mode === 'toMorse' ? 'Morse Code Output' : 'Text Output'}
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="w-full h-48 p-4 rounded-xl border border-slate-300 bg-white outline-none font-mono text-sm resize-none text-slate-800"
              />
              {output && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {mode === 'toMorse' && (
                    <button
                      onClick={playMorseCode}
                      disabled={isPlaying}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPlaying ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      {isPlaying ? 'Playing...' : 'Play'}
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
