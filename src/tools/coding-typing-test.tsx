import React, { useEffect, useState } from 'react';
import TypingPracticeEngine from '../components/typing/TypingPracticeEngine';
import { getRandomText, loadTypingTexts } from '../lib/typing-data';

export default function CodingTypingTest() {
  const [text, setText] = useState('Loading code snippet...');

  useEffect(() => {
    loadTypingTexts().then((payload) => {
      setText(getRandomText(payload.code));
    }).catch(() => {
      setText("const sum = (a, b) => a + b;\nconsole.log(sum(10, 20));");
    });
  }, []);

  return <TypingPracticeEngine title="Coding Typing Test" text={text} personalBestKey="typing-best-code" duration={90} />;
}
