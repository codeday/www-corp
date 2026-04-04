const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseIsoString(s: string): Date {
  const b = s.split(/\D+/).map(Number);
  return new Date(Date.UTC(b[0], b[1] - 1, b[2], b[3], b[4], b[5], b[6]));
}

export function formatShortDate(d: Date, withMonth?: boolean, withYear?: boolean): string {
  return `${withMonth ? `${MONTHS[d.getMonth()]} ` : ""}${d.getDate()}${withYear ? `, ${d.getFullYear()}` : ""}`;
}

export function formatInterval(start: Date, end: Date): string {
  const differentMonths = start.getMonth() !== end.getMonth();
  const differentYears = start.getFullYear() !== end.getFullYear();

  return [
    formatShortDate(start, true, differentYears),
    formatShortDate(end, differentMonths, true),
  ].join(" — ");
}

interface EventWithDates {
  startsAt?: string;
  endsAt?: string;
}

interface ParsedEvent {
  startsAt: Date;
  endsAt: Date;
}

export function upcomingEvents(events: EventWithDates[]): ParsedEvent[] {
  const now = new Date();
  return (
    events
      .filter((e) => e.startsAt && e.endsAt)
      .map((e) => ({
        startsAt: parseIsoString(e.startsAt!),
        endsAt: parseIsoString(e.endsAt!),
      }))
      .filter((e) => e.endsAt > now)
      .sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime()) || []
  );
}

export function nextUpcomingEvent(events: EventWithDates[]): ParsedEvent | null {
  return upcomingEvents(events || [])[0] || null;
}
