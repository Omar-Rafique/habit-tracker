import type { Habit } from "./habits";

const KEY = "habit-tracker:v1";

function isHabit(value: unknown): value is Habit {
  const h = value as Habit;
  return (
    typeof h === "object" &&
    h !== null &&
    typeof h.id === "string" &&
    typeof h.name === "string" &&
    typeof h.createdAt === "string" &&
    Array.isArray(h.completions)
  );
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isHabit) : [];
  } catch {
    return []; // storage unavailable or corrupted - start fresh
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(habits));
  } catch {
    // storage full or blocked (e.g. private mode) - ignore
  }
}
