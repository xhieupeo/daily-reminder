import React, { useState } from 'react';
import { Task } from '../types';
import { sound } from '../services/soundService';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

interface PixelCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  tasks: Task[];
  onSelectDate: (date: string) => void;
}

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

export const PixelCalendar: React.FC<PixelCalendarProps> = ({
  selectedDate,
  tasks,
  onSelectDate,
}) => {
  const [currentYear, setCurrentYear] = useState(() => {
    const [y] = selectedDate.split('-').map(Number);
    return y || new Date().getFullYear();
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const [, m] = selectedDate.split('-').map(Number);
    return m ? m - 1 : new Date().getMonth();
  });

  const changeMonth = (delta: number) => {
    sound.playClick();
    let nextMonth = currentMonth + delta;
    let nextYear = currentYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const jumpToToday = () => {
    sound.playClick();
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Tasks mapped by date
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();

  return (
    <div className="space-y-3">
      {/* Calendar Header with Month Controls */}
      <div className="pixel-inset p-2.5 bg-[#131220] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => changeMonth(-1)}
            title="Previous Month"
            className="pixel-button p-1 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            title="Next Month"
            className="pixel-button p-1 text-xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="font-pixel text-[11px] text-[var(--color-primary-accent)] tracking-wider ml-1">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <button
          onClick={jumpToToday}
          title="Return to Today"
          className="pixel-button px-2 py-0.5 text-[9px] font-pixel text-[var(--color-secondary-accent)]"
        >
          TODAY
        </button>
      </div>

      {/* Weekday Labels (Sun - Sat) */}
      <div className="grid grid-cols-7 gap-1 text-center font-retro text-xs text-[var(--color-text-muted)]">
        <div>SU</div>
        <div>MO</div>
        <div>TU</div>
        <div>WE</div>
        <div>TH</div>
        <div>FR</div>
        <div>SA</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 font-retro text-sm">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-10 pixel-inset opacity-20 bg-[#12111d]" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isSelected = selectedDate === dayStr;
          const isToday = todayStr === dayStr;
          const dayTasks = tasksByDate[dayStr] || [];

          // Determine dot indicators
          const hasHigh = dayTasks.some((t) => t.priority === 'high' && !t.completed);
          const hasMed = dayTasks.some((t) => t.priority === 'med' && !t.completed);
          const allCompleted = dayTasks.length > 0 && dayTasks.every((t) => t.completed);

          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectDate(dayStr);
              }}
              className={`h-10 pixel-button p-1 flex flex-col justify-between items-center transition-all relative ${
                isSelected
                  ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17] font-bold'
                  : isToday
                  ? 'border-[var(--color-secondary-accent)] text-[var(--color-secondary-accent)]'
                  : 'text-[var(--color-text-main)]'
              }`}
            >
              <span className="text-xs">{dayNum}</span>

              {/* Task Density Indicators */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {allCompleted ? (
                  <span className="text-[10px] text-[#f9c846] leading-none">★</span>
                ) : (
                  <>
                    {hasHigh && (
                      <span className="w-1.5 h-1.5 bg-[var(--color-danger)] inline-block" />
                    )}
                    {hasMed && (
                      <span className="w-1.5 h-1.5 bg-[var(--color-warning-break)] inline-block" />
                    )}
                    {!hasHigh && !hasMed && dayTasks.length > 0 && (
                      <span className="w-1.5 h-1.5 bg-[var(--color-secondary-accent)] inline-block" />
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Selected Day Summary */}
      <div className="pixel-inset p-2.5 bg-[#131220] space-y-1.5 text-xs font-retro text-[var(--color-text-muted)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-dark)] pb-1 mb-1">
          <span className="text-[var(--color-text-main)] flex items-center gap-1">
            <CalIcon className="w-3.5 h-3.5 text-[var(--color-secondary-accent)]" />
            Selected: <strong className="text-[var(--color-secondary-accent)]">{selectedDate}</strong>
          </span>
          <span className="font-pixel text-[9px] text-[var(--color-primary-accent)]">
            {(tasksByDate[selectedDate] || []).length} TASKS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--color-danger)] inline-block" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--color-warning-break)] inline-block" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--color-secondary-accent)] inline-block" />
            <span>Low Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#f9c846] font-bold">★</span>
            <span>All Done Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

