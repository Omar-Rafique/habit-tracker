import { describe, expect, it } from "vitest";
import {
  addDays,
  completionRate,
  createHabit,
  currentStreak,
  lastNDays,
  longestStreak,
  toggleDay,
  type Habit,
} from "./habits";

const TODAY = "2026-03-10";

function habitWith(days: string[], createdAt = "2026-01-01"): Habit {
  return { id: "h1", name: "Read", createdAt, completions: days };
}

describe("dates", () => {
  it("adds days across month boundaries", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29"); // leap year
  });

  it("lists the last n days oldest first", () => {
    expect(lastNDays(TODAY, 3)).toEqual(["2026-03-08", "2026-03-09", "2026-03-10"]);
  });
});

describe("createHabit", () => {
  it("trims the name", () => {
    expect(createHabit("  Gym  ", TODAY, "x").name).toBe("Gym");
  });

  it("rejects empty names", () => {
    expect(() => createHabit("   ", TODAY)).toThrow();
  });
});

describe("toggleDay", () => {
  it("adds then removes a completion without mutating", () => {
    const h = habitWith([]);
    const done = toggleDay(h, TODAY);
    expect(done.completions).toEqual([TODAY]);
    expect(h.completions).toEqual([]);
    expect(toggleDay(done, TODAY).completions).toEqual([]);
  });
});

describe("streaks", () => {
  it("counts consecutive days ending today", () => {
    const h = habitWith(["2026-03-08", "2026-03-09", "2026-03-10"]);
    expect(currentStreak(h, TODAY)).toBe(3);
  });

  it("keeps yesterday's streak alive if today isn't done yet", () => {
    const h = habitWith(["2026-03-08", "2026-03-09"]);
    expect(currentStreak(h, TODAY)).toBe(2);
  });

  it("is zero after a missed day", () => {
    const h = habitWith(["2026-03-07", "2026-03-08"]);
    expect(currentStreak(h, TODAY)).toBe(0);
  });

  it("finds the longest streak ever", () => {
    const h = habitWith(["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-05", "2026-03-06"]);
    expect(longestStreak(h)).toBe(3);
    expect(longestStreak(habitWith([]))).toBe(0);
  });
});

describe("completionRate", () => {
  it("only counts days since the habit was created", () => {
    const h = habitWith(["2026-03-09", "2026-03-10"], "2026-03-07");
    // 4 days since creation (7th-10th), 2 done -> 50%
    expect(completionRate(h, TODAY, 30)).toBe(50);
  });
});
