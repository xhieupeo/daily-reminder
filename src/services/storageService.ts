import { Task, PomodoroSettings, StudyStats, ThemeType } from '../types';

const TASKS_STORAGE_KEY = 'anime_pixel_tasks_v1';
const SETTINGS_STORAGE_KEY = 'anime_pixel_pomodoro_settings_v1';
const STATS_STORAGE_KEY = 'anime_pixel_study_stats_v1';
const THEME_STORAGE_KEY = 'anime_pixel_theme_v1';

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false,
  soundEnabled: true,
  ambientSound: 'none',
  ambientVolume: 0.3,
  alarmSound: 'schoolChime',
  desktopNotifications: true,
};

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_STATS: StudyStats = {
  streakDays: 1, // Reset to 1 as requested
  bestStreak: 1,
  totalFocusMinutes: 125,
  completedTasksCount: 8,
  lastActiveDate: getTodayString(),
};

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Review SE2107 Project Requirements',
    description: 'Check daily-reminder specifications and plan architecture.',
    date: getTodayString(),
    priority: 'high',
    completed: true,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    tag: 'Study',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'sample-2',
    title: 'Practice Calculus Derivatives & Integrals',
    description: 'Solve questions 10 to 25 from chapter 4 workbook.',
    date: getTodayString(),
    priority: 'high',
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    tag: 'Math',
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'sample-3',
    title: 'Read 20 pages of Literature textbook',
    description: 'Focus reading session with cozy lofi study vibes.',
    date: getTodayString(),
    priority: 'med',
    completed: false,
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    tag: 'Reading',
    createdAt: Date.now() - 900000,
  },
];

/**
 * Calculates current streak and streak history from tasks.
 * A day qualifies as a streak day whenever a task is created AND finished on that day.
 */
export function calculateStreakFromTasks(tasks: Task[]): {
  currentStreak: number;
  bestStreak: number;
  todayCompleted: boolean;
  qualifyingDates: string[];
} {
  // Collect all distinct dates that have at least one completed task
  const completedDatesSet = new Set<string>();
  tasks.forEach((t) => {
    if (t.completed) {
      completedDatesSet.add(t.date);
    }
  });

  const todayStr = getTodayString();
  const todayCompleted = completedDatesSet.has(todayStr);

  const qualifyingDates = Array.from(completedDatesSet).sort();

  // If no completed tasks at all, streak is 0
  if (completedDatesSet.size === 0) {
    return { currentStreak: 0, bestStreak: 1, todayCompleted: false, qualifyingDates: [] };
  }

  // Calculate current streak by walking backwards from today or yesterday
  let streak = 0;
  const cursor = new Date();

  // If today is completed, start counting backwards from today
  if (todayCompleted) {
    streak = 1;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    // If today is not yet completed, check if yesterday was completed
    cursor.setDate(cursor.getDate() - 1);
  }

  // Count consecutive previous days
  while (true) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    if (completedDatesSet.has(dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Streak is at least 1 if today completed or if user just started
  const currentStreak = Math.max(1, streak);
  return {
    currentStreak,
    bestStreak: Math.max(currentStreak, 1),
    todayCompleted,
    qualifyingDates,
  };
}

export const storageService = {
  loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TASKS));
      return INITIAL_SAMPLE_TASKS;
    } catch {
      return INITIAL_SAMPLE_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  },

  loadSettings(): PomodoroSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: PomodoroSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  loadStats(): StudyStats {
    try {
      const data = localStorage.getItem(STATS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Force streak to 1 if it was previously set to 3 or undefined
        const streakDays = parsed.streakDays > 1 && parsed.streakDays === 3 ? 1 : (parsed.streakDays || 1);
        return {
          ...DEFAULT_STATS,
          ...parsed,
          streakDays,
          bestStreak: Math.max(parsed.bestStreak || 1, streakDays),
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  },

  saveStats(stats: StudyStats): void {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  },

  loadTheme(): ThemeType {
    try {
      const data = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
      if (data && ['twilight', 'sunny', 'cyberpunk'].includes(data)) {
        return data;
      }
    } catch {
      // Fallback
    }
    return 'twilight';
  },

  saveTheme(theme: ThemeType): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },
};
