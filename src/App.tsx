import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  completionRate,
  createHabit,
  currentStreak,
  fromISODate,
  isDoneOn,
  lastNDays,
  longestStreak,
  toISODate,
  toggleDay,
  type Habit,
} from "./lib/habits";
import { loadHabits, saveHabits } from "./lib/storage";

const DAYS_SHOWN = 7;

function dayLabel(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, { weekday: "short" });
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = toISODate(new Date());
  const days = useMemo(() => lastNDays(today, DAYS_SHOWN), [today]);

  useEffect(() => saveHabits(habits), [habits]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    try {
      setHabits((prev) => [...prev, createHabit(newName, today)]);
      setNewName("");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function handleToggle(id: string, day: string) {
    setHabits((prev) => prev.map((h) => (h.id === id ? toggleDay(h, day) : h)));
  }

  function handleDelete(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const doneToday = habits.filter((h) => isDoneOn(h, today)).length;

  return (
    <main className="app">
      <header>
        <h1>Habit Tracker</h1>
        <p className="subtitle">
          {habits.length === 0
            ? "Add your first habit to get started."
            : `${doneToday} of ${habits.length} habits done today`}
        </p>
      </header>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          aria-label="New habit name"
          placeholder="e.g. Read 20 pages"
          value={newName}
          maxLength={60}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">Add habit</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}

      {habits.length > 0 && (
        <div className="table-wrap">
          <table className="habits">
            <thead>
              <tr>
                <th scope="col">Habit</th>
                {days.map((d) => (
                  <th scope="col" key={d} className={d === today ? "today" : undefined}>
                    {dayLabel(d)}
                  </th>
                ))}
                <th scope="col">Streak</th>
                <th scope="col">Best</th>
                <th scope="col">30d</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id}>
                  <th scope="row">{h.name}</th>
                  {days.map((d) => {
                    const done = isDoneOn(h, d);
                    return (
                      <td key={d}>
                        <button
                          className={`day ${done ? "done" : ""}`}
                          aria-pressed={done}
                          aria-label={`${h.name} on ${d}: ${done ? "done" : "not done"}`}
                          onClick={() => handleToggle(h.id, d)}
                        >
                          {done ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                  <td className="stat">🔥 {currentStreak(h, today)}</td>
                  <td className="stat">{longestStreak(h)}</td>
                  <td className="stat">{completionRate(h, today)}%</td>
                  <td>
                    <button
                      className="delete"
                      aria-label={`Delete ${h.name}`}
                      onClick={() => handleDelete(h.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>Data is saved in your browser (localStorage).</footer>
    </main>
  );
}
