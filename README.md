# 🌸 Xuan Hieu's Study Place
> **Daily Focus Sanctuary & 16-Bit Anime Pomodoro Study App**

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20Sync-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

A personalized, cozy 16-bit retro anime desktop study sanctuary built for **Xuan Hieu**. Designed for focused productivity with daily task management, an interactive pixel calendar, customizable Pomodoro timer, animated scenic background, custom 16-bit SoundCloud cassette tape player, Supabase cloud database synchronization, and a private passcode gatekeeper.

---

## 📑 Table of Contents
1. [Aesthetic & Design Persona](#-aesthetic--design-persona)
2. [Core Feature Suite](#-core-feature-suite)
3. [Cloud Database Integration (Supabase)](#-cloud-database-integration-supabase)
4. [Custom 16-Bit SoundCloud Cassette Player](#-custom-16-bit-soundcloud-cassette-player)
5. [Security & Passcode Gatekeeper](#-security--passcode-gatekeeper)
6. [Project Architecture](#-project-architecture)
7. [Getting Started & Local Development](#-getting-started--local-development)
8. [Vercel Deployment Guide](#-vercel-deployment-guide)
9. [Changelog & Milestone Evolution](#-changelog--milestone-evolution)

---

## 🎨 Aesthetic & Design Persona

Governed strictly by [`style.md`](./style.md):
- **16-Bit Retro Anime Aesthetic**: Chunky pixel panel borders (`border-2 border-[#12111a]`), hard drop-shadows (`shadow-[3px_3px_0px_#000]`), and no modern Gaussian blurs or rounded pill shapes.
- **Scenic Animated Background** ([`ScenicBackground.tsx`](./src/components/ScenicBackground.tsx)): Daylight anime sky gradient, mountain silhouettes, cozy suburban townscape, sakura trees, and gentle drifting blossom petals.
- **Personalized Sanctuary Branding**: Dedicated app title and custom mascot avatar ([`study_icon.jpg`](./public/study_icon.jpg) and [`favicon.svg`](./public/favicon.svg)).
- **Balanced Zoom Architecture**: Scaled at `88%` by default with inline `[-]` / `[+]` zoom controls (`75%` to `110%`) to keep all panels comfortable on desktop screens.

---

## 🌟 Core Feature Suite

### 1. 📋 Daily Jobs & Task Management (Full CRUD)
* **Create, Edit, Delete Tasks**: Form to capture task title, description, priority, date, and category tags (`#Study`, `#Math`, `#Code`, etc.).
* **Priority Matrix**: 🔴 High, 🟡 Medium, and 🟢 Low priority badges with visual color coding.
* **Pomodoro Estimates**: Allocate 1 to 6 Pomodoro cycles per task.
* **Celebration & Level-Up**: Checking off a task triggers an 8-bit level-up chime, companion celebration, and retro square pixel confetti.
* **5-Second Undo Toast**: Accidental deletions can be restored immediately with one click.
* **Active Task Linking**: Link any task directly to the Pomodoro timer to automatically increment its completed cycles.

### 2. 📅 Interactive Pixel Monthly Calendar
* Full monthly matrix with previous/next month navigation and a "Today" jump button.
* Date cells render color-coded pixel dots reflecting the tasks scheduled for that day.
* Clicking any calendar date opens that day's scheduled tasks and allows adding new ones for future dates.

### 3. ⏱️ Customizable Pomodoro & Study Timer
* **Modes**: Focus (25m), Short Break (5m), and Long Break (15m).
* **Configurable Durations**: Customize focus and break lengths in the Settings drawer or via quick `+/- 5m` buttons.
* **Stepped Pixel HP Bar**: 20-segment health/progress bar that drains as focus time progresses.
* **4-Cycle Streak Tracker**: Tracks completed cycles and automatically promotes the 4th cycle to a Long Break.

### 4. 🔥 Gamified Streak & Journey Tracker
* **Strict Streak Rules**: A streak day is formed when a task is created AND finished on that calendar date.
* **Streak Modal** ([`StreakModal.tsx`](./src/components/StreakModal.tsx)): Interactive 7-day timeline visualizer with flame icons, total focus hours, and best streak record.
* **Reset Safeguard**: Dedicated button to reset the streak counter back to 1.

### 5. 🤖 Reactive Anime Companion Mascot
* Animated companion sprite reacting dynamically to timer and task states:
  * *Focus Mode*: Typing diligently on a laptop with glasses.
  * *Break Mode*: Napping with floating `Zzz` or drinking boba tea.
  * *Task Completed*: Cheering and celebrating with sparkles.
* Interactive speech bubble providing rotating motivational study quotes.

### 6. 🔊 Procedural 8-Bit Web Audio
* Zero external audio files needed for sound effects.
* Synthesized procedural 8-bit chimes, timer alarms, button clicks, and optional calming background soundscapes (Cozy Rain 🌧️ or White Noise 📻).

---

## ☁️ Cloud Database Integration (Supabase)

Tasks are persisted both **locally** and in the **cloud** via **Supabase (`@supabase/supabase-js`)**, so your data is never lost when clearing browser storage, switching devices, or reopening the app after days.

### Features:
* **Hybrid Offline-First Sync**: App loads instantly from `localStorage`, seamlessly fetches the latest tasks from Supabase in the background, and pushes local changes up.
* **Real-time WebSockets**: Listens to PostgreSQL table changes so edits on one device reflect everywhere in real-time.
* **In-App Cloud Config & Tester** ([`SettingsModal.tsx`](./src/components/SettingsModal.tsx)):
  * Enter your **Project URL** and **Anon Public Key** directly in the Settings drawer.
  * Live **TEST & SAVE CONNECTION** button with instant feedback.
  * **1-Click SQL Setup**: Copies the database table creation script with a single click.
* **Navigation Status Indicator**: Displays `☁️ CLOUD` when connected to Supabase or `💾 LOCAL` when running offline.

### Supabase Table Schema
To set up your database, execute this in the **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'med',
  completed BOOLEAN NOT NULL DEFAULT false,
  "estimatedPomodoros" INTEGER NOT NULL DEFAULT 1,
  "completedPomodoros" INTEGER NOT NULL DEFAULT 0,
  tag TEXT DEFAULT '',
  "createdAt" BIGINT NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to tasks"
ON public.tasks
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

---

## 📼 Custom 16-Bit SoundCloud Cassette Player

Replacing generic iframe players, the app features a custom-engineered **16-Bit Retro Anime SoundCloud Cassette Player** ([`SoundCloudCustomPlayer.tsx`](./src/components/SoundCloudCustomPlayer.tsx)) powered by the official **SoundCloud Widget API (`api.js`)**:

* **Animated Spinning Tape Visualizer** ([`CassetteTapeVisualizer.tsx`](./src/components/CassetteTapeVisualizer.tsx)): Dual-spool cassette casing with tape reels that physically spin when playing and stop when paused.
* **Hardware Pixel Transport Deck**:
  * `[ ⏮ PREV ]`, `[ ▶ PLAY / ❚❚ PAUSE ]`, `[ ⏭ NEXT ]` with retro click audio feedback.
  * Realtime LCD timer display (`01:23 / 03:45`).
  * Interactive seek progress bar.
  * Volume slider (`0% - 100%`) with one-click Mute / Unmute (`🔊 / 🔇`).
* **Curated Lofi Presets**:
  * 🌸 **Lofi Hip Hop Study Beats** (ChilledCow / Lofi Girl classic study playlist)
  * ☕ **Cozy Coffee Shop Lofi** (Acoustic guitar & vinyl crackles)
  * 🎌 **Anime & Ghibli Memories** (Nostalgic Japanese melody remixes & piano)
  * 🌌 **Midnight Coding Chillhop** (Deep atmospheric study beats)
* **Custom Link Connector (`PASTE SC LINK`)**: Paste any public SoundCloud track, album, or playlist URL to stream your own music.
* **100% Full Song Playback**: Complete tracks and multi-hour mixes without 30-second preview limitations.
* **Collapsible Native Drawer**: Click `▼ Show SoundCloud Waveform` to inspect the native waveform and tracklist anytime.

---

## 🔒 Security & Passcode Gatekeeper

For private deployment on Vercel:
* **Master Passcode**: **`110907`**
* **Anime Gatekeeper Screen** ([`PasscodeLock.tsx`](./src/components/PasscodeLock.tsx)): Blocks unauthorized visitors with a retro pixel keypad, error shake animation, and audio feedback.
* **Persistent Session Token**: Keeps you signed in on your trusted device (`localStorage`).
* **Instant Re-Lock**: Click the **Lock (🔒)** button in the top navigation bar anytime to immediately secure your sanctuary.

---

## 📁 Project Architecture

```
daily-reminder/
├── public/
│   ├── favicon.svg              # 16-bit sakura pixel favicon
│   └── study_icon.jpg           # Xuan Hieu's Study Place mascot icon
├── src/
│   ├── components/
│   │   ├── CassetteTapeVisualizer.tsx  # Animated dual-spool cassette graphic
│   │   ├── CompanionMascot.tsx         # Reactive anime pixel companion
│   │   ├── DailyTaskList.tsx           # Daily task CRUD list & undo toast
│   │   ├── Navbar.tsx                  # Header, streak pill, zoom, & cloud status
│   │   ├── PasscodeLock.tsx            # Anime master passcode lock screen (110907)
│   │   ├── PixelCalendar.tsx           # Monthly pixel calendar & task dot matrix
│   │   ├── PomodoroTimer.tsx           # Pomodoro timer, HP bar & quick adjust
│   │   ├── ScenicBackground.tsx        # Daylight sky, mountains, townscape & sakura
│   │   ├── SettingsModal.tsx           # Durations, Supabase cloud sync & JSON backup
│   │   ├── SoundCloudCustomPlayer.tsx  # Custom 16-bit retro SoundCloud cassette deck
│   │   └── StreakModal.tsx             # 7-day streak tracker & reset controls
│   ├── services/
│   │   ├── soundcloudWidgetService.ts  # SoundCloud Widget API async loader & typings
│   │   ├── soundService.ts             # Procedural Web Audio API sound effects
│   │   ├── storageService.ts           # Local storage persistence & streak math
│   │   └── supabaseService.ts          # Supabase cloud synchronization & realtime events
│   ├── types.ts                        # TypeScript domain interfaces
│   ├── App.tsx                         # Master state container & layout coordinator
│   ├── main.tsx                        # React 18 DOM root
│   └── index.css                       # Retro pixel design tokens & animations
├── style.md                            # Comprehensive 16-bit styling guide
├── diagrams_and_workflow.html          # Interactive visual architectural documentation
├── vercel.json                         # Vercel SPA routing rules
├── vite.config.ts                      # Vite configuration (preserveSymlinks enabled)
└── package.json                        # Project dependencies & scripts
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Installation
```bash
cd daily-reminder
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Enter passcode `110907` to unlock.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized, production-ready bundle in `dist/`.

---

## 🌐 Vercel Deployment Guide

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the project into **[Vercel](https://vercel.com/)**:
   * **Root Directory**: `daily-reminder`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. *(Optional)* Add Supabase environment variables in Vercel:
   * `VITE_SUPABASE_URL` = `https://yourprojectid.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
4. Click **Deploy**. Vercel will build and deploy your private study sanctuary!

---

## 📜 Changelog & Milestone Evolution

| Milestone | Key Implementations & Enhancements |
| :--- | :--- |
| **v1.0 - Foundation** | Initial 16-bit retro UI, task CRUD engine, monthly pixel calendar, and customizable Pomodoro timer. |
| **v1.1 - Audio & Mascot** | Procedural Web Audio API sound effects, level-up chimes, and reactive companion mascot. |
| **v1.2 - Scenic Backdrop** | Daylight anime sky, mountain ridges, suburban houses, sakura trees, drifting petals, and 88% zoom layout. |
| **v1.3 - Streak System** | Daily streak rules (task created & finished), interactive 7-day timeline modal, and reset-to-1 capability. |
| **v1.4 - Personalization** | Renamed to "Xuan Hieu's Study Place" with custom app icon (`study_icon.jpg`) and favicon. |
| **v1.5 - Passcode Gatekeeper** | Added private gatekeeper lock screen with master PIN `110907`, persistent session, and instant re-lock. |
| **v1.6 - SoundCloud Player** | Built custom 16-bit retro cassette player with animated spinning reels, transport controls, LCD display, presets, and custom URL support. |
| **v1.7 - Supabase Cloud Sync**| Integrated `@supabase/supabase-js` for real-time cloud task persistence, 1-click SQL setup, connection testing, and navbar cloud status pill. |

---

*Crafted with 🌸 and retro pixel love for Xuan Hieu.*
