import React from 'react';
import { Task, StudyStats } from '../types';
import { sound } from '../services/soundService';
import { calculateStreakFromTasks, getTodayString } from '../services/storageService';
import { Flame, X, CheckCircle, Clock, RotateCcw, Award, Calendar } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  tasks: Task[];
  stats: StudyStats;
  onClose: () => void;
  onResetStreakToOne: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  tasks,
  stats,
  onClose,
  onResetStreakToOne,
}) => {
  if (!isOpen) return null;

  const streakInfo = calculateStreakFromTasks(tasks);
  const todayStr = getTodayString();

  // Generate the last 7 days history
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isCompleted = tasks.some((t) => t.date === dateStr && t.completed);
    const isToday = dateStr === todayStr;

    return {
      dateStr,
      dayName,
      isCompleted,
      isToday,
      dayNumber: d.getDate(),
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-[2px]">
      <div className="pixel-panel w-full max-w-lg bg-[#222036] p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--color-border-dark)] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
            <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-main)]">
              STREAK TRACKER & STATS
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="pixel-button p-1 text-[var(--color-danger)] font-pixel text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Flame Streak Hero Card */}
        <div className="pixel-inset p-4 bg-[#141324] text-center space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-10 h-10 text-orange-400 fill-orange-400 animate-sprite-bob" />
            <div className="text-left">
              <span className="font-pixel text-2xl sm:text-3xl text-[var(--color-warning-break)] tracking-wider">
                {stats.streakDays} DAY{stats.streakDays > 1 ? 'S' : ''}
              </span>
              <p className="font-retro text-xs text-[var(--color-text-muted)]">
                CURRENT STUDY STREAK
              </p>
            </div>
          </div>

          {/* Today's Streak Status Banner */}
          <div
            className={`pixel-panel p-2 mt-2 flex items-center justify-center gap-2 text-xs font-retro ${
              streakInfo.todayCompleted
                ? 'bg-[#1b382b] border-[#8bd5ca] text-[#8bd5ca]'
                : 'bg-[#3b2b1a] border-[#f9c846] text-[#f9c846]'
            }`}
          >
            {streakInfo.todayCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#8bd5ca]" />
                <span className="font-bold">TODAY'S STREAK IS ACTIVE! (Task completed)</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-[#f9c846] animate-pixel-blink" />
                <span className="font-bold">PENDING: Finish at least 1 task today to keep it burning!</span>
              </>
            )}
          </div>
        </div>

        {/* How Streak is Formed Rule Card */}
        <div className="pixel-inset p-3 bg-[#181628] space-y-1 text-xs font-retro text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5 text-[var(--color-secondary-accent)] font-pixel text-[10px]">
            <span>★</span>
            <span>HOW STREAKS WORK</span>
          </div>
          <p className="text-[var(--color-text-main)]">
            Your daily study streak is formed whenever you <strong className="text-[var(--color-primary-accent)]">create AND finish at least 1 task</strong> for that day.
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Checking off a task on consecutive days builds and maintains your flame!
          </p>
        </div>

        {/* 7-Day Streak Timeline / Journey */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-retro text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-primary-accent)]" />
              LAST 7 DAYS ACTIVITY:
            </span>
            <span className="text-[11px]">Today: {todayStr}</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-retro text-xs">
            {last7Days.map((day) => (
              <div
                key={day.dateStr}
                className={`pixel-inset p-2 flex flex-col items-center justify-between ${
                  day.isToday ? 'border-2 border-[var(--color-primary-accent)] bg-[#262038]' : 'bg-[#141324]'
                }`}
              >
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase">
                  {day.dayName}
                </span>
                <span className="text-xs text-[var(--color-text-main)] my-1 font-bold">
                  {day.dayNumber}
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  {day.isCompleted ? (
                    <span title="Streak Completed!"><Flame className="w-4 h-4 text-orange-400 fill-orange-400" /></span>
                  ) : day.isToday ? (
                    <span className="w-2.5 h-2.5 border border-dashed border-[var(--color-warning-break)] rounded-full animate-pixel-blink" title="In Progress" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-[#4a445f] inline-block" title="No task completed" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifetime Stats Matrix */}
        <div className="grid grid-cols-3 gap-2 text-center font-retro text-xs">
          <div className="pixel-inset p-2.5 bg-[#141324]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">CURRENT</span>
            <span className="text-lg font-bold text-[var(--color-warning-break)] font-pixel">
              {stats.streakDays}d
            </span>
          </div>
          <div className="pixel-inset p-2.5 bg-[#141324]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">BEST STREAK</span>
            <span className="text-lg font-bold text-[var(--color-secondary-accent)] font-pixel flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 inline text-[var(--color-secondary-accent)]" />
              {Math.max(stats.bestStreak || 1, stats.streakDays)}d
            </span>
          </div>
          <div className="pixel-inset p-2.5 bg-[#141324]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">FINISHED JOBS</span>
            <span className="text-lg font-bold text-[var(--color-primary-accent)] font-pixel">
              {tasks.filter((t) => t.completed).length}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-[var(--color-border-dark)]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onResetStreakToOne();
            }}
            title="Reset your streak counter back to 1"
            className="pixel-button px-2.5 py-1 text-xs font-retro text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[var(--color-warning-break)]" />
            Reset Streak to 1
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="pixel-button px-4 py-1.5 font-pixel text-xs bg-[var(--color-secondary-accent)] text-[#0d0c17]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
