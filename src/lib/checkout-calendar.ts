export type ScheduleDate = {
  year: number;
  month: number;
  day: number;
};

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function isScheduleDateDisabled(year: number, month: number, day: number, now = new Date()) {
  const date = new Date(year, month, day);
  if (date.getDay() === 0) return true;
  if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true;
  if (date.toDateString() === now.toDateString() && now.getHours() >= 14) return true;
  return false;
}

export function isSelectedScheduleDate(selected: ScheduleDate | null, year: number, month: number, day: number) {
  return selected !== null && selected.year === year && selected.month === month && selected.day === day;
}

export function formatDeliveryDate(selected: ScheduleDate) {
  return `${selected.year}-${String(selected.month + 1).padStart(2, "0")}-${String(selected.day).padStart(2, "0")}`;
}
