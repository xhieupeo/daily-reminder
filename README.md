# 🍵 Anime Pixel Study — Daily Reminders & Pomodoro App

A cozy, 16-bit retro anime desktop study sanctuary built with **React, Vite, and Tailwind CSS**. Designed for focused productivity with daily task management, an interactive pixel calendar, customizable Pomodoro timer, procedural 8-bit sound effects, and a reactive anime pixel companion.

---

## ✨ Features

- **📋 Daily Task / Job Management (CRUD)**:
  - Create, view, edit, and delete daily tasks with priority flags (🔴 High, 🟡 Medium, 🟢 Low) and tags (`#Study`, `#Math`, etc.).
  - Estimated Pomodoros counter (1 to 6 🍅).
  - Checkbox toggle triggers level-up retro chime and square pixel confetti celebration!
  - 5-second **Undo** toast safeguard for accidental deletions.
  - Active task linking directly to the Pomodoro timer.
- **📅 Interactive Pixel Calendar**:
  - Full monthly grid with previous/next month navigation and "Today" jump button.
  - Date cells display task indicators / color-coded dots according to priority.
  - Selecting any date immediately opens that day's task list.
- **⏱ Customizable Pomodoro & Study Timer**:
  - Focus (25m), Short Break (5m), and Long Break (15m) modes.
  - Configurable focus & break durations directly from the settings drawer or quick +/- 5m controls.
  - Stepped pixel HP/progress bar that drains as you study.
  - 4-cycle Pomodoro streak tracker.
- **🐱 Reactive Anime Pixel Mascot**:
  - Animated companion sprite reacting dynamically to timer and task states:
    - *Study Mode*: Typing on a laptop with focused glasses.
    - *Break Mode*: Napping with floating `Zzz` or drinking boba tea.
    - *Task Done*: Cheering with pixel sparkles!
  - Motivational speech bubble with rotating study quotes.
- **🔊 Procedural 8-Bit Web Audio**:
  - Zero external sound files — procedurally synthesized retro chimes, clicks, and optional calming pink-noise rain / white noise.
- **🎨 Multi-Theme System**:
  - Follows [`style.md`](./style.md) strictly.
  - *Twilight Lo-Fi Study* (default starry night), *Sunny Classroom*, and *Cyberpunk Arcade*.
- **💾 Dual-Layer Persistence**:
  - Works instantly offline with `localStorage`.
  - Supabase cloud database credentials input ready for multi-device sync.
  - Export and Import JSON backup utility.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📐 Architecture & Styling Rules
- Visual Guidelines & Tokens: See [`style.md`](./style.md)
- Interactive Diagrams & Flowcharts: Open [`diagrams_and_workflow.html`](./diagrams_and_workflow.html) in your browser!
