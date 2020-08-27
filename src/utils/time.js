const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function parseIsoString(s) {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], b[1] - 1, b[2], b[3], b[4], b[5], b[6]));
}

export function formatShortDate(d, withMonth, withYear) {
  return `${withMonth ? `${MONTHS[d.getMonth()]} ` : ''}${d.getDate()}${withYear ? `, ${d.getFullYear()}` : ''}`;
}

export function formatInterval(start, end) {
  const differentMonths = start.getMonth() !== end.getMonth();
  const differentYears = start.getFullYear() !== end.getFullYear();

  return [
    formatShortDate(start, true, differentYears),
    formatShortDate(end, differentMonths, true),
  ].join(' — ');
}

export function upcomingEvents(events) {
  const now = new Date();
  return events.map((e) => ({
    startsAt: parseIsoString(e.startsAt),
    endsAt: parseIsoString(e.endsAt),
  }))
    .filter((e) => e.endsAt > now)
    .sort((a, b) => a.endsAt - b.endsAt)
    || [];
}

export function nextUpcomingEvent(events) {
  return upcomingEvents(events || [])[0] || null;
}
