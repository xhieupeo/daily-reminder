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

export type AlarmSoundType =
  | 'schoolChime'
  | 'victoryFanfare'
  | 'zenGong'
  | 'cyberBeep'
  | 'sakuraHarp';

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'whitenoise';
  ambientVolume: number;
  alarmSound: AlarmSoundType;
  desktopNotifications: boolean;
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
  bestStreak: number;
  totalFocusMinutes: number;
  completedTasksCount: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export type ThemeType = 'twilight' | 'sunny' | 'cyberpunk';
