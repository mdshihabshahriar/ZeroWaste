export function formatTime(d: Date = new Date()): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m < 10 ? '0' : ''}${m} ${ampm}`;
}

export function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// '2026-11-05' -> { day: '05', month: 'NOV' }
export function splitDate(date: string) {
  const [, m, d] = date.split('-');
  return { day: d, month: MONTHS[Number(m) - 1] ?? '' };
}

export function addHours(hours: number): string {
  return formatTime(new Date(Date.now() + hours * 60 * 60 * 1000));
}

export function formatKm(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}