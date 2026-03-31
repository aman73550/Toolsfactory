import React, { useEffect, useState } from 'react';
import TypingPracticeEngine from '../components/typing/TypingPracticeEngine';
import VirtualKeyboard from '../components/typing/VirtualKeyboard';
import { getRandomText, loadTypingTexts } from '../lib/typing-data';

export default function BlindTypingTutor() {
  const [text, setText] = useState('Loading lesson...');
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    loadTypingTexts().then((payload) => {
      setText(getRandomText(payload.general));
    }).catch(() => {
      setText('Keep your index fingers on F and J keys to build home-row memory.');
    });
  }, []);

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => setPressed(event.key);
    const onUp = () => setPressed(null);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-indigo-50 p-4 text-sm text-slate-700">
        Focus on finger placement: left hand on ASDF, right hand on JKL; and eyes on screen instead of keyboard.
      </div>
      <VirtualKeyboard pressed={pressed} />
      <TypingPracticeEngine title="Blind Typing Tutor" text={text} personalBestKey="typing-best-blind" duration={75} />
    </div>
  );
}
