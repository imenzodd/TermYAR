// Persian digits and date utilities

export const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const PERSIAN_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
];

export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toEnglishDigits(s: string): string {
  if (!s) return '';
  return s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

export function formatToman(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return 'توافقی';
  if (amount === 0) return 'رایگان / امانت دوستانه';
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} تومان`;
}

export function getTodayJalaliString(): string {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const year = parts.find((p) => p.type === 'year')?.value || '1404';
    const month = parts.find((p) => p.type === 'month')?.value || '08';
    const day = parts.find((p) => p.type === 'day')?.value || '15';
    return `${year}/${month}/${day}`;
  } catch {
    return '1404/08/15';
  }
}

export function getPersianLongDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'پنجشنبه، ۱۵ آبان ۱۴۰۴';
  }
}

export function getJalaliWeekDays(): { name: string; dateStr: string; isToday: boolean; dayIndex: number }[] {
  const now = new Date();
  // In Persian calendar, week starts on Saturday (شنبه).
  // In JavaScript, Sunday is 0, Monday is 1, ..., Saturday is 6.
  // Persian day of week: Saturday is 0, Sunday is 1, ..., Friday is 6.
  const jsDay = now.getDay();
  const persianDayOffset = (jsDay + 1) % 7; // Saturday = 0, Sunday = 1, ...
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const diff = i - persianDayOffset;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);

    let partsStr = '';
    try {
      const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        day: 'numeric',
        month: 'short',
      }).format(d);
      partsStr = parts;
    } catch {
      partsStr = `${toPersianDigits(i + 10)} آبان`;
    }

    weekDays.push({
      name: PERSIAN_DAYS[i],
      dateStr: partsStr,
      isToday: i === persianDayOffset,
      dayIndex: i,
    });
  }
  return weekDays;
}
