import React, { useEffect, useState } from 'react';
import TypingPracticeEngine from '../components/typing/TypingPracticeEngine';
import { getRandomText, loadTypingTexts } from '../lib/typing-data';

export default function NumpadTypingTest() {
  const [text, setText] = useState('Loading numpad sequence...');

  useEffect(() => {
    loadTypingTexts().then((payload) => {
      setText(getRandomText(payload.numbers));
    }).catch(() => {
      setText('9412673085 6204135798 3001298741 7765432801');
    });
  }, []);

  return <TypingPracticeEngine title="Numpad Typing Test" text={text} personalBestKey="typing-best-numpad" duration={60} inputMode="numeric" />;
}
