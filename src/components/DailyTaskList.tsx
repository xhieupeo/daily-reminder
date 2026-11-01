import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { sound } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  Plus,
  Check,
  Trash2,
  Edit2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface DailyTaskListProps {
  selectedDate: string; // YYYY-MM-DD
  tasks: Task[];
  activeTaskId: string | null;
  onSelectDate: (date: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSetActiveTask: (id: string | null) => void;
  onTriggerCelebration: () => void;
}

export const DailyTaskList: React.FC<DailyTaskListProps> = ({
  selectedDate,
  tasks,
  activeTaskId,
  onSelectDate,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSetActiveTask,
  onTriggerCelebration,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [estPomos, setEstPomos] = useState<number>(2);
  const [tag, setTag] = useState<string>('Study');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [recentlyDeleted, setRecentlyDeleted] = useState<Task | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<number | null>(null);

  // Filter tasks for selected date
  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const displayedTasks = dayTasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // Date switching handlers
  const changeDateBy = (days: number) => {
    sound.playClick();
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);

    const newYear = dateObj.getFullYear();
    const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newDay = String(dateObj.getDate()).padStart(2, '0');
    onSelectDate(`${newYear}-${newMonth}-${newDay}`);
  };

  const jumpToToday = () => {
    sound.playClick();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${d}`);
  };

  const isToday = () => {
    const today = new Date();
    const [y, m, d] = selectedDate.split('-').map(Number);
    return (
      today.getFullYear() === y &&
      today.getMonth() + 1 === m &&
      today.getDate() === d
    );
  };

  // Add task handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    onAddTask({
      title: newTitle.trim(),
      date: selectedDate,
      priority,
      completed: false,
      estimatedPomodoros: estPomos,
      tag: tag.trim() || undefined,
    });
    setNewTitle('');
  };

  // Task completion toggle
  const handleToggleComplete = (task: Task) => {
    const nextCompleted = !task.completed;
    onUpdateTask({ ...task, completed: nextCompleted });

    if (nextCompleted) {
      sound.playLevelUp();
      onTriggerCelebration();

      // Fire retro pixel confetti particles
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f49ac2', '#8bd5ca', '#f9c846', '#f6eedb'],
        shapes: ['square'],
      });
    } else {
      sound.playClick();
    }
  };

  // Delete with Undo safeguard
  const handleDelete = (task: Task) => {
    sound.playClick();
    onDeleteTask(task.id);
    setRecentlyDeleted(task);

    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    const id = window.setTimeout(() => {
      setRecentlyDeleted(null);
    }, 6000);
    setUndoTimeoutId(id);
  };

  const handleUndo = () => {
    if (recentlyDeleted) {
      sound.playClick();
      onAddTask(recentlyDeleted);
      setRecentlyDeleted(null);
      if (undoTimeoutId) clearTimeout(undoTimeoutId);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (task: Task) => {
    if (editTitle.trim()) {
      onUpdateTask({ ...task, title: editTitle.trim() });
    }
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-4">
      {/* Date Navigator Header */}
      <div className="pixel-inset p-3 bg-[#131220] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => changeDateBy(-1)}
            title="Previous Day"
            className="pixel-button p-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeDateBy(1)}
            title="Next Day"
            className="pixel-button p-1 text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-retro text-base sm:text-lg text-[var(--color-text-main)] ml-1">
            <CalendarIcon className="w-4 h-4 text-[var(--color-secondary-accent)]" />
            <span className="font-bold">{selectedDate}</span>
            {isToday() && (
              <span className="text-[10px] bg-[var(--color-secondary-accent)] text-[#0d0c17] font-pixel px-1.5 py-0.5">
                TODAY
              </span>
            )}
          </div>
        </div>

        {!isToday() && (
          <button
            onClick={jumpToToday}
            className="pixel-button px-2 py-1 text-[10px] font-pixel text-[var(--color-secondary-accent)]"
          >
            GO TO TODAY
          </button>
        )}
      </div>

      {/* Progress & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Progress Fill */}
        <div className="w-full sm:w-auto flex-1 flex items-center gap-2">
          <span className="font-retro text-sm text-[var(--color-text-muted)]">
            Progress: {completedCount}/{totalCount} ({progressPct}%)
          </span>
          <div className="flex-1 h-2.5 bg-[#0d0c17] border border-[var(--color-border-dark)] p-0.5 max-w-[140px]">
            <div
              className="h-full bg-[var(--color-primary-accent)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {(['all', 'active', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sound.playClick();
                setFilter(mode);
              }}
              className={`pixel-button px-2 py-0.5 text-[10px] font-pixel uppercase ${
                filter === mode
                  ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17]'
                  : ''
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleCreateTask} className="pixel-panel p-3 bg-[#1e1c31] space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new study job/task..."
            className="pixel-inset bg-[#12111d] text-sm text-[var(--color-text-main)] px-3 py-2 flex-1 focus:outline-none focus:border-[var(--color-primary-accent)] font-retro placeholder:text-[#6e6779]"
          />
          <button
            type="submit"
            className="pixel-button px-3 py-2 font-pixel text-xs bg-[var(--color-secondary-accent)] text-[#0d0c17] flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ADD</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-retro">
          {/* Priority selector */}
          <div className="flex items-center gap-1">
            <span className="text-[var(--color-text-muted)]">Priority:</span>
            {(['high', 'med', 'low'] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`pixel-button px-2 py-0.5 text-[10px] font-pixel uppercase ${
                  priority === p ? 'active-pressed ring-1 ring-[var(--color-text-main)]' : 'opacity-70'
                } ${
                  p === 'high'
                    ? 'text-[var(--color-danger)]'
                    : p === 'med'
                    ? 'text-[var(--color-warning-break)]'
                    : 'text-[var(--color-secondary-accent)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Tag & Estimated Pomodoro */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-text-muted)]">Pomos:</span>
              <select
                value={estPomos}
                onChange={(e) => setEstPomos(Number(e.target.value))}
                className="pixel-inset bg-[#12111d] text-xs text-[var(--color-text-main)] px-1.5 py-0.5 focus:outline-none font-retro"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} 🍅
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[var(--color-text-muted)]">Tag:</span>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Study"
                className="pixel-inset bg-[#12111d] text-xs text-[var(--color-text-main)] px-1.5 py-0.5 w-16 focus:outline-none font-retro"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Undo Toast Notification */}
      {recentlyDeleted && (
        <div className="pixel-panel p-2.5 bg-[#2b2438] flex items-center justify-between gap-2 text-xs border-[var(--color-warning-break)] animate-pulse-pixel">
          <span className="font-retro text-[var(--color-text-main)]">
            Deleted "{recentlyDeleted.title}".
          </span>
          <button
            onClick={handleUndo}
            className="pixel-button px-2.5 py-1 text-[10px] font-pixel bg-[var(--color-warning-break)] text-[#0d0c17] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            UNDO
          </button>
        </div>
      )}

      {/* Tasks List Container */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {displayedTasks.length === 0 ? (
          <div className="pixel-inset p-8 text-center bg-[#131220] space-y-2">
            <span className="text-3xl block">🎐</span>
            <p className="font-pixel text-xs text-[var(--color-secondary-accent)]">
              No tasks for this day!
            </p>
            <p className="font-retro text-sm text-[var(--color-text-muted)]">
              {filter !== 'all'
                ? `No ${filter} tasks found.`
                : 'Enjoy your free time or add a new study goal above!'}
            </p>
          </div>
        ) : (
          displayedTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            const isActive = activeTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`pixel-panel p-3 transition-all ${
                  isActive
                    ? 'border-[var(--color-secondary-accent)] bg-[#2c2b45]'
                    : task.completed
                    ? 'opacity-65 bg-[#1e1c2e]'
                    : 'bg-[#222036]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Checkbox & Title */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      className={`w-5 h-5 pixel-button flex items-center justify-center shrink-0 ${
                        task.completed
                          ? 'bg-[var(--color-secondary-accent)] text-[#0d0c17]'
                          : 'bg-[#12111d]'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveEdit(task)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(task)}
                        autoFocus
                        className="pixel-inset bg-[#12111d] text-sm text-[var(--color-text-main)] px-2 py-0.5 flex-1 focus:outline-none font-retro"
                      />
                    ) : (
                      <span
                        className={`font-retro text-base truncate flex-1 cursor-pointer ${
                          task.completed
                            ? 'line-through text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text-main)]'
                        }`}
                        onClick={() => handleToggleComplete(task)}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Priority Badge */}
                    <span
                      className={`text-[9px] font-pixel px-1.5 py-0.5 uppercase ${
                        task.priority === 'high'
                          ? 'bg-[var(--color-danger)] text-[#0d0c17]'
                          : task.priority === 'med'
                          ? 'bg-[var(--color-warning-break)] text-[#0d0c17]'
                          : 'bg-[var(--color-secondary-accent)] text-[#0d0c17]'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Tag badge */}
                    {task.tag && (
                      <span className="text-[10px] font-retro text-[var(--color-text-muted)] pixel-inset px-1.5 py-0.2 hidden sm:inline">
                        #{task.tag}
                      </span>
                    )}

                    {/* Estimated Pomos Badge */}
                    <span className="text-xs font-retro text-[var(--color-primary-accent)] pixel-inset px-1.5 py-0.5">
                      {task.estimatedPomodoros} 🍅
                    </span>

                    {/* Active Focus Link */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSetActiveTask(isActive ? null : task.id);
                      }}
                      title={isActive ? 'Unlink Active Focus' : 'Focus on this task in Pomodoro'}
                      className={`pixel-button p-1 text-xs ${
                        isActive
                          ? 'bg-[var(--color-secondary-accent)] text-[#0d0c17]'
                          : 'text-[var(--color-secondary-accent)]'
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        startEdit(task);
                      }}
                      title="Edit Task"
                      className="pixel-button p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(task)}
                      title="Delete Task"
                      className="pixel-button p-1 text-[var(--color-danger)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

