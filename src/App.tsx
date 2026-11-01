import { useState, useEffect } from 'react';
import { Task, TimerMode, PomodoroSettings, StudyStats, ThemeType } from './types';
import { storageService, calculateStreakFromTasks, getTodayString } from './services/storageService';
import { sound } from './services/soundService';
import { Navbar } from './components/Navbar';
import { CompanionMascot } from './components/CompanionMascot';
import { PomodoroTimer } from './components/PomodoroTimer';
import { DailyTaskList } from './components/DailyTaskList';
import { PixelCalendar } from './components/PixelCalendar';
import { SettingsModal } from './components/SettingsModal';
import { ScenicBackground } from './components/ScenicBackground';
import { StreakModal } from './components/StreakModal';
import { PasscodeLock } from './components/PasscodeLock';
import { LofiPlayer } from './components/LofiPlayer';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => storageService.loadTasks());
  const [settings, setSettings] = useState<PomodoroSettings>(() => storageService.loadSettings());
  const [stats, setStats] = useState<StudyStats>(() => storageService.loadStats());
  const [theme, setTheme] = useState<ThemeType>(() => storageService.loadTheme());

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('xuan_hieu_auth_token_v1') === 'unlocked_110907';
  });

  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    const saved = localStorage.getItem('anime_pixel_zoom_level');
    return saved ? Number(saved) : 88;
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString);
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(() => settings.focusMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [celebrating, setCelebrating] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);

  // Sync theme to body class
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    storageService.saveTheme(theme);
  }, [theme]);

  // Sync sound settings
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
    storageService.saveSettings(settings);
  }, [settings]);

  // Persist tasks and stats
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storageService.saveStats(stats);
  }, [stats]);

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    localStorage.setItem('anime_pixel_zoom_level', String(newZoom));
  };

  // Streak synchronization on mount: default back to 1
  useEffect(() => {
    const streakInfo = calculateStreakFromTasks(tasks);
    setStats((prev) => ({
      ...prev,
      streakDays: Math.max(1, streakInfo.currentStreak),
      bestStreak: Math.max(prev.bestStreak || 1, streakInfo.currentStreak, 1),
    }));
  }, []);

  // Timer Tick Interval
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerCompleted();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode, cyclesCompleted, settings, activeTaskId]);

  const handleTimerCompleted = () => {
    sound.playTimerDone();

    if (timerMode === 'focus') {
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);

      // Increment stats
      setStats((prev) => ({
        ...prev,
        totalFocusMinutes: prev.totalFocusMinutes + settings.focusMinutes,
      }));

      // Increment active task completed pomodoros
      if (activeTaskId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeTaskId
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          )
        );
      }

      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 8000);

      // Switch to break mode
      if (nextCycles % 4 === 0) {
        setTimerMode('longBreak');
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setTimerMode('shortBreak');
        setTimeLeft(settings.shortBreakMinutes * 60);
      }

      if (!settings.autoStartBreaks) {
        setIsTimerRunning(false);
      }
    } else {
      // Break finished -> back to focus
      setTimerMode('focus');
      setTimeLeft(settings.focusMinutes * 60);
      setIsTimerRunning(false);
    }
  };

  // Timer Controls
  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'focus') setTimeLeft(settings.focusMinutes * 60);
    else if (timerMode === 'shortBreak') setTimeLeft(settings.shortBreakMinutes * 60);
    else setTimeLeft(settings.longBreakMinutes * 60);
  };

  const selectMode = (mode: TimerMode) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') setTimeLeft(settings.focusMinutes * 60);
    else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakMinutes * 60);
    else setTimeLeft(settings.longBreakMinutes * 60);
  };

  const skipMode = () => {
    if (timerMode === 'focus') {
      selectMode('shortBreak');
    } else {
      selectMode('focus');
    }
  };

  const quickAdjust = (deltaMinutes: number) => {
    setTimeLeft((prev) => Math.max(60, prev + deltaMinutes * 60));
  };

  // Task Actions & Streak Tracking
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
      completedPomodoros: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (updated: Task) => {
    const nextTasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    setTasks(nextTasks);

    // When a task is completed, evaluate streak: streak is formed when created & finished
    if (updated.completed) {
      const streakInfo = calculateStreakFromTasks(nextTasks);
      setStats((prev) => ({
        ...prev,
        completedTasksCount: prev.completedTasksCount + 1,
        streakDays: Math.max(1, streakInfo.currentStreak),
        bestStreak: Math.max(prev.bestStreak || 1, streakInfo.currentStreak),
        lastActiveDate: getTodayString(),
      }));
    }
  };

  const handleDeleteTask = (id: string) => {
    const nextTasks = tasks.filter((t) => t.id !== id);
    setTasks(nextTasks);
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const handleResetStreakToOne = () => {
    setStats((prev) => ({
      ...prev,
      streakDays: 1,
      bestStreak: Math.max(prev.bestStreak || 1, 1),
    }));
  };

  const handleLockApp = () => {
    localStorage.removeItem('xuan_hieu_auth_token_v1');
    setIsUnlocked(false);
  };

  const triggerCelebration = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 5000);
  };

  // Export / Import Backup Data
  const handleExportData = () => {
    const payload = {
      tasks,
      settings,
      stats,
      theme,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anime-pixel-study-backup-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const data = JSON.parse(jsonStr);
    if (data.tasks) setTasks(data.tasks);
    if (data.settings) setSettings(data.settings);
    if (data.stats) setStats(data.stats);
    if (data.theme) setTheme(data.theme);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="relative min-h-screen">
      {/* 1. Scenic Anime Background */}
      <ScenicBackground />

      {/* 2. Scaled / Zoomed-out Content Container */}
      <div
        className="relative z-10 max-w-[1320px] mx-auto p-2 sm:p-4 min-h-screen flex flex-col justify-between"
        style={{
          zoom: `${zoomLevel}%`,
        }}
      >
        <div>
          {/* Navigation Bar */}
          <Navbar
            stats={stats}
            theme={theme}
            onThemeChange={setTheme}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() =>
              setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
            }
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenStreakModal={() => setIsStreakModalOpen(true)}
            zoomLevel={zoomLevel}
            onZoomChange={handleZoomChange}
            onLockApp={handleLockApp}
          />

          {/* 3-Column Main Dashboard Grid */}
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* LEFT COLUMN: Anime Companion & Pomodoro (4 columns) */}
            <section className="lg:col-span-4 pixel-panel p-3.5 bg-[#201e33f5] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-[var(--color-border-dark)] pb-2 mb-2.5">
                  <span className="font-pixel text-[11px] text-[var(--color-primary-accent)]">
                    ★ STUDY COMPANION
                  </span>
                  <span className="font-retro text-xs text-[var(--color-secondary-accent)]">
                    CYCLE {(cyclesCompleted % 4) + 1}/4
                  </span>
                </div>

                {/* Reactive Mascot */}
                <CompanionMascot
                  timerMode={timerMode}
                  isTimerRunning={isTimerRunning}
                  celebrating={celebrating}
                />

                {/* Pomodoro Timer */}
                <PomodoroTimer
                  mode={timerMode}
                  timeLeft={timeLeft}
                  isRunning={isTimerRunning}
                  cyclesCompleted={cyclesCompleted}
                  settings={settings}
                  activeTaskTitle={activeTask ? activeTask.title : null}
                  onToggleTimer={toggleTimer}
                  onResetTimer={resetTimer}
                  onSkipMode={skipMode}
                  onSelectMode={selectMode}
                  onQuickAdjust={quickAdjust}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>
            </section>

            {/* MIDDLE COLUMN: Daily Jobs / Task CRUD (5 columns) */}
            <section className="lg:col-span-5 pixel-panel p-3.5 bg-[#201e33f5]">
              <div className="flex items-center justify-between border-b-2 border-[var(--color-border-dark)] pb-2 mb-2.5">
                <span className="font-pixel text-[11px] text-[var(--color-secondary-accent)]">
                  ★ DAILY JOBS & TASKS
                </span>
                <span className="font-retro text-xs text-[var(--color-text-muted)]">
                  CRUD ENGINE
                </span>
              </div>

              <DailyTaskList
                selectedDate={selectedDate}
                tasks={tasks}
                activeTaskId={activeTaskId}
                onSelectDate={setSelectedDate}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onSetActiveTask={setActiveTaskId}
                onTriggerCelebration={triggerCelebration}
              />
            </section>

            {/* RIGHT COLUMN: Pixel Calendar & Monthly View (3 columns) */}
            <section className="lg:col-span-3 pixel-panel p-3.5 bg-[#201e33f5]">
              <div className="flex items-center justify-between border-b-2 border-[var(--color-border-dark)] pb-2 mb-2.5">
                <span className="font-pixel text-[11px] text-[var(--color-warning-break)]">
                  ★ STUDY CALENDAR
                </span>
                <span className="font-retro text-xs text-[var(--color-text-muted)]">
                  SCHEDULE
                </span>
              </div>

              <PixelCalendar
                selectedDate={selectedDate}
                tasks={tasks}
                onSelectDate={setSelectedDate}
              />
            </section>
          </main>
        </div>

        {/* Lofi Music Player Console & Song Banner (Replaces Old Footer) */}
        <LofiPlayer />

        {/* Configuration Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onSaveSettings={(newSettings) => {
            setSettings(newSettings);
            if (!isTimerRunning) {
              if (timerMode === 'focus') setTimeLeft(newSettings.focusMinutes * 60);
              else if (timerMode === 'shortBreak') setTimeLeft(newSettings.shortBreakMinutes * 60);
              else setTimeLeft(newSettings.longBreakMinutes * 60);
            }
          }}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        {/* Streak Tracker & Journey Modal */}
        <StreakModal
          isOpen={isStreakModalOpen}
          tasks={tasks}
          stats={stats}
          onClose={() => setIsStreakModalOpen(false)}
          onResetStreakToOne={handleResetStreakToOne}
        />
      </div>

      {/* 3. Passcode Gatekeeper Lock (Master Code: 110907) */}
      {!isUnlocked && (
        <PasscodeLock onUnlock={() => setIsUnlocked(true)} />
      )}
    </div>
  );
}
