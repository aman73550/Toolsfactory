export async function fetchTrainApi<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json'
    }
  });

  const raw = await response.text();
  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    const fallbackMessage = raw && raw.toLowerCase().includes('page could not be found')
      ? 'Train API endpoint is not available in this deployment.'
      : 'Train API returned an invalid response.';

    throw new Error(fallbackMessage);
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data as T;
}

export function formatRailTime(value: string) {
  if (!value || value === '--') return '--';
  const [hour, minute] = value.split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

export function formatFare(value: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
