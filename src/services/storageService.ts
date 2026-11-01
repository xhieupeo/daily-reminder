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
};

export const DEFAULT_STATS: StudyStats = {
  streakDays: 3,
  totalFocusMinutes: 125,
  completedTasksCount: 8,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

export const storageService = {
  loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // First run: save and return samples
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
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
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

