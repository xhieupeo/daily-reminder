import React from 'react';
import { TimerMode, PomodoroSettings } from '../types';
import { sound } from '../services/soundService';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

interface PomodoroTimerProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  cyclesCompleted: number;
  settings: PomodoroSettings;
  activeTaskTitle: string | null;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipMode: () => void;
  onSelectMode: (mode: TimerMode) => void;
  onQuickAdjust: (minutes: number) => void;
  onOpenSettings: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  mode,
  timeLeft,
  isRunning,
  cyclesCompleted,
  settings,
  activeTaskTitle,
  onToggleTimer,
  onResetTimer,
  onSkipMode,
  onSelectMode,
  onQuickAdjust,
  onOpenSettings,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate percentage of timer completed for HP bar
  const totalSeconds =
    mode === 'focus'
      ? settings.focusMinutes * 60
      : mode === 'shortBreak'
      ? settings.shortBreakMinutes * 60
      : settings.longBreakMinutes * 60;

  const progressPercentage = Math.max(0, Math.min(100, (timeLeft / (totalSeconds || 1)) * 100));

  return (
    <div className="space-y-3">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={() => {
            sound.playClick();
            onSelectMode('focus');
          }}
          className={`pixel-button py-1.5 px-2 text-[10px] font-pixel text-center ${
            mode === 'focus' ? 'active-pressed bg-[var(--color-secondary-accent)] text-[#0d0c17]' : ''
          }`}
        >
          FOCUS
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectMode('shortBreak');
          }}
          className={`pixel-button py-1.5 px-2 text-[10px] font-pixel text-center ${
            mode === 'shortBreak' ? 'active-pressed bg-[var(--color-warning-break)] text-[#0d0c17]' : ''
          }`}
        >
          SHORT
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectMode('longBreak');
          }}
          className={`pixel-button py-1.5 px-2 text-[10px] font-pixel text-center ${
            mode === 'longBreak' ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17]' : ''
          }`}
        >
          LONG
        </button>
      </div>

      {/* Main Digital Clock Inset */}
      <div className="pixel-inset p-4 bg-[#12111d] text-center relative">
        {/* Linked Active Task Pill */}
        {activeTaskTitle && (
          <div className="mb-2 truncate text-xs text-[var(--color-secondary-accent)] font-retro flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--color-secondary-accent)] inline-block"></span>
            <span className="truncate">Active: "{activeTaskTitle}"</span>
          </div>
        )}

        {/* Big Retro Numbers */}
        <div className="font-retro text-6xl tracking-widest text-[var(--color-text-main)] my-1">
          {timeFormatted}
        </div>

        {/* Stepped Pixel Progress / HP Bar */}
        <div className="w-full h-3.5 bg-[#0d0c17] border border-[var(--color-border-dark)] p-0.5 mt-2">
          <div
            className={`h-full transition-all duration-300 ${
              mode === 'focus'
                ? 'bg-[var(--color-secondary-accent)]'
                : mode === 'shortBreak'
                ? 'bg-[var(--color-warning-break)]'
                : 'bg-[var(--color-primary-accent)]'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Cycle indicator */}
        <div className="flex justify-between items-center text-[11px] text-[var(--color-text-muted)] font-retro mt-2">
          <span>Mode: {mode.toUpperCase()}</span>
          <span>CYCLE: {(cyclesCompleted % 4) + 1} / 4</span>
        </div>
      </div>

      {/* Play / Pause / Reset Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onToggleTimer();
          }}
          className={`pixel-button flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-pixel text-xs ${
            isRunning
              ? 'bg-[var(--color-warning-break)] text-[#0d0c17]'
              : 'bg-[var(--color-secondary-accent)] text-[#0d0c17]'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>START</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onResetTimer();
          }}
          title="Reset Timer"
          className="pixel-button p-2.5 text-[var(--color-text-main)]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSkipMode();
          }}
          title="Skip to Next Phase"
          className="pixel-button p-2.5 text-[var(--color-text-main)]"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Time Adjusters */}
      <div className="pixel-inset p-2 flex items-center justify-between text-xs text-[var(--color-text-muted)] font-retro">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Quick Adjust:</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick();
              onQuickAdjust(-5);
            }}
            className="pixel-button px-2 py-0.5 text-xs font-retro"
          >
            -5m
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onQuickAdjust(5);
            }}
            className="pixel-button px-2 py-0.5 text-xs font-retro"
          >
            +5m
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="pixel-button px-2 py-0.5 text-[10px] font-pixel text-[var(--color-primary-accent)]"
          >
            CONFIG
          </button>
        </div>
      </div>
    </div>
  );
};

