# Habit Tracker ✅

![CI](https://github.com/Omar-Rafique/habit-tracker/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

A clean, fast habit tracker built with **React + TypeScript + Vite**.
Tick off habits each day, keep your streak alive, and see your 30-day completion rate.

**Live demo:** https://omar-rafique.github.io/habit-tracker/

## Features

- Add and delete habits
- Weekly grid: tick any of the last 7 days
- 🔥 Current streak (stays alive until the day is actually over), best streak, 30-day completion %
- Data saved in the browser with `localStorage`, safely handling blocked or corrupted storage
- Accessible: keyboard friendly, `aria-pressed` toggles, labelled buttons
- Responsive dark UI with no CSS framework

## Tech stack

| Layer   | Choice                    |
| ------- | ------------------------- |
| UI      | React 18, TypeScript (strict) |
| Build   | Vite                      |
| Tests   | Vitest                    |
| CI / CD | GitHub Actions → GitHub Pages |

## Run locally

```bash
git clone https://github.com/Omar-Rafique/habit-tracker.git
cd habit-tracker
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests
npm run build    # production build in dist/
```

## Project structure

```text
src/
  App.tsx            # UI and state
  lib/habits.ts      # pure logic: streaks, toggling, completion rate
  lib/habits.test.ts # unit tests for the logic
  lib/storage.ts     # localStorage load/save with validation
```

The business logic lives in `lib/habits.ts` as pure functions with no React,
so it is simple to unit test, and the component stays focused on rendering.

Dates are handled as local `YYYY-MM-DD` strings, which avoids the classic UTC
off-by-one bug where "today" flips at 5 AM in Pakistan.

## Roadmap

- [ ] Weekly / custom-frequency habits
- [ ] Calendar heatmap view
- [ ] Export / import data as JSON
- [ ] Sync across devices with a backend

## License

MIT
