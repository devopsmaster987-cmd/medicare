function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIcsDate(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

function escapeIcs(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('\n', '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');
}

export type IcsEvent = {
  title: string;
  description: string;
  date: Date;
  url?: string;
  durationMinutes?: number;
};

export function buildIcs(event: IcsEvent): string {
  const start = toIcsDate(event.date);
  const endDate = new Date(event.date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const end = toIcsDate(endDate);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const uid = `medicareclear-${stamp}-${Math.random().toString(36).slice(2, 9)}@medicareclear`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MedicareClear//Calculator Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    ...(event.url ? [`URL:${escapeIcs(event.url)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
