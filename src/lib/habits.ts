// Pure habit-tracking logic, kept separate from React so it is easy to test.

export interface Habit {
  id: string;
  name: string;
  createdAt: string; // YYYY-MM-DD
  /** Dates (YYYY-MM-DD) on which the habit was completed. */
  completions: string[];
}

/** Format a Date as YYYY-MM-DD in local time. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as a local date (avoids UTC off-by-one bugs). */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const date = fromISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function createHabit(name: string, today: string, id?: string): Habit {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Habit name cannot be empty");
  return {
    id: id ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed,
    createdAt: today,
    completions: [],
  };
}

export function isDoneOn(habit: Habit, day: string): boolean {
  return habit.completions.includes(day);
}

/** Return a new habit with `day` toggled between done / not done. */
export function toggleDay(habit: Habit, day: string): Habit {
  const completions = isDoneOn(habit, day)
    ? habit.completions.filter((d) => d !== day)
    : [...habit.completions, day].sort();
  return { ...habit, completions };
}

/**
 * Current streak: consecutive completed days ending today.
 * If today isn't done yet, the streak ending yesterday still counts,
 * so a streak doesn't "break" until the day is actually over.
 */
export function currentStreak(habit: Habit, today: string): number {
  const done = new Set(habit.completions);
  let day = done.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (done.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

/** Longest run of consecutive completed days ever. */
export function longestStreak(habit: Habit): number {
  const days = [...new Set(habit.completions)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** The last `n` days ending at `today`, oldest first. */
export function lastNDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

/** Completion rate (0-100) over the last `n` days, ignoring days before the habit existed. */
export function completionRate(habit: Habit, today: string, n = 30): number {
  const days = lastNDays(today, n).filter((d) => d >= habit.createdAt);
  if (days.length === 0) return 0;
  const done = days.filter((d) => isDoneOn(habit, d)).length;
  return Math.round((done / days.length) * 100);
}
