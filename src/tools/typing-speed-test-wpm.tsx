import React, { useEffect, useState } from 'react';
import TypingPracticeEngine from '../components/typing/TypingPracticeEngine';
import { getRandomText, loadTypingTexts } from '../lib/typing-data';

export default function TypingSpeedTestWpm() {
  const [text, setText] = useState('Loading typing prompt...');

  useEffect(() => {
    loadTypingTexts().then((payload) => {
      setText(getRandomText(payload.general));
    }).catch(() => {
      setText('Typing improves with deliberate and consistent daily practice. Keep your hands relaxed and avoid unnecessary corrections.');
    });
  }, []);

  return <TypingPracticeEngine title="Typing Speed Test (WPM)" text={text} personalBestKey="typing-best-wpm" duration={60} />;
}
