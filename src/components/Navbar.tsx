import React from 'react';
import { ThemeType, StudyStats } from '../types';
import { sound } from '../services/soundService';
import { Volume2, VolumeX, Settings, Flame, Sparkles, Moon, Sun, Zap, ZoomIn } from 'lucide-react';

interface NavbarProps {
  stats: StudyStats;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  zoomLevel,
  onZoomChange,
}) => {
  const cycleTheme = () => {
    sound.playClick();
    const order: ThemeType[] = ['twilight', 'sunny', 'cyberpunk'];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    onThemeChange(order[nextIdx]);
  };

  return (
    <header className="pixel-panel p-2.5 sm:p-3 mb-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
      {/* Brand & Mascot Icon */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 pixel-inset flex items-center justify-center p-0.5 bg-[#1a192b] overflow-hidden shrink-0">
          <img src="/study_icon.jpg" alt="Xuan Hieu's Study Place Icon" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#8bd5ca] animate-pixel-blink inline-block"></span>
            <span className="font-pixel text-[8px] sm:text-[9px] text-[var(--color-secondary-accent)] tracking-wider uppercase">
              Daily Focus Sanctuary
            </span>
          </div>
          <h1 className="font-pixel text-xs sm:text-sm text-[var(--color-text-main)] tracking-wide">
            XUAN HIEU'S STUDY PLACE
          </h1>
        </div>
      </div>

      {/* Gamified Stats & Action Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Streak Counter */}
        <div className="pixel-inset px-2 py-0.5 flex items-center gap-1.5 text-xs text-[var(--color-warning-break)] font-retro">
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span className="font-bold">{stats.streakDays}</span>
          <span className="text-[var(--color-text-muted)] text-[10px]">DAY STREAK</span>
        </div>

        {/* Total Focus */}
        <div className="pixel-inset px-2 py-0.5 flex items-center gap-1.5 text-xs text-[var(--color-primary-accent)] font-retro">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">{stats.totalFocusMinutes}m</span>
          <span className="text-[var(--color-text-muted)] text-[10px]">FOCUSED</span>
        </div>

        {/* Zoom Level Control */}
        <div className="flex items-center pixel-inset px-2 py-0.5 gap-1.5 text-xs font-retro" title="Screen Zoom Level">
          <ZoomIn className="w-3 h-3 text-[var(--color-text-muted)] hidden sm:inline" />
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onZoomChange(Math.max(75, zoomLevel - 5));
            }}
            title="Zoom Out"
            className="pixel-button px-1.5 py-0 text-[10px] font-pixel"
          >
            -
          </button>
          <span className="text-[var(--color-secondary-accent)] font-bold min-w-[28px] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onZoomChange(Math.min(110, zoomLevel + 5));
            }}
            title="Zoom In"
            className="pixel-button px-1.5 py-0 text-[10px] font-pixel"
          >
            +
          </button>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={cycleTheme}
          title="Cycle Theme"
          className="pixel-button px-2 py-1 text-xs font-pixel flex items-center gap-1.5"
        >
          {theme === 'twilight' && <Moon className="w-3 h-3 text-[#f49ac2]" />}
          {theme === 'sunny' && <Sun className="w-3 h-3 text-[#e06d53]" />}
          {theme === 'cyberpunk' && <Zap className="w-3 h-3 text-[#00f0ff]" />}
          <span className="hidden md:inline uppercase text-[9px]">{theme}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className={`pixel-button p-1.5 ${!soundEnabled ? 'opacity-60' : ''}`}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[var(--color-secondary-accent)]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[var(--color-danger)]" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          title="Open Settings"
          className="pixel-button p-1.5"
        >
          <Settings className="w-3.5 h-3.5 text-[var(--color-text-main)]" />
        </button>
      </div>
    </header>
  );
};
