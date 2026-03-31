interface TypingTextPayload {
  general: string[];
  code: string[];
  numbers: string[];
}

let cache: TypingTextPayload | null = null;

export async function loadTypingTexts(): Promise<TypingTextPayload> {
  if (cache) return cache;
  const response = await fetch('/data/typing-texts.json');
  if (!response.ok) {
    throw new Error('Unable to load typing text data');
  }
  cache = (await response.json()) as TypingTextPayload;
  return cache;
}

export function getRandomText(items: string[]) {
  if (items.length === 0) return '';
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
