export type Priority = 'low' | 'med' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tag?: string;
  createdAt: number;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'whitenoise';
  ambientVolume: number;
}

export interface PomodoroState {
  mode: TimerMode;
  isRunning: boolean;
  timeLeft: number; // in seconds
  cyclesCompleted: number;
  activeTaskId: string | null;
}

export interface StudyStats {
  streakDays: number;
  totalFocusMinutes: number;
  completedTasksCount: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export type ThemeType = 'twilight' | 'sunny' | 'cyberpunk';

