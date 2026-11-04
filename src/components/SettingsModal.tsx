import React, { useState, useEffect } from 'react';
import { PomodoroSettings } from '../types';
import { sound } from '../services/soundService';
import {
  getSupabaseConfig,
  saveLocalSupabaseCredentials,
  supabaseService,
} from '../services/supabaseService';
import {
  X,
  Sliders,
  Volume2,
  Cloud,
  Download,
  Upload,
  Check,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: PomodoroSettings;
  onClose: () => void;
  onSaveSettings: (settings: PomodoroSettings) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onCloudSyncTrigger?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
  onExportData,
  onImportData,
  onCloudSyncTrigger,
}) => {
  const [formState, setFormState] = useState<PomodoroSettings>(settings);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      if (config) {
        setSupabaseUrl(config.url);
        setSupabaseKey(config.anonKey);
        setSyncStatus('Connected to Supabase cloud database 🟢');
      } else {
        setSyncStatus(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onSaveSettings(formState);
    sound.setAmbient(formState.ambientSound, formState.ambientVolume);
    onClose();
  };

  const handleAmbientChange = (val: 'none' | 'rain' | 'whitenoise') => {
    setFormState((prev) => ({ ...prev, ambientSound: val }));
    sound.setAmbient(val, formState.ambientVolume);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          onImportData(content);
          alert('Data imported successfully!');
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-[2px]">
      <div className="pixel-panel w-full max-w-lg bg-[#222036] p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--color-border-dark)] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--color-secondary-accent)]" />
            <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-main)]">
              STUDY & TIMER CONFIG
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Section 1: Timer Durations */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-[var(--color-primary-accent)] uppercase">
              1. Timer Durations (Minutes)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="pixel-inset p-2.5 bg-[#141324]">
                <label className="block text-[11px] font-retro text-[var(--color-text-muted)] mb-1">
                  Focus Work:
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formState.focusMinutes}
                  onChange={(e) =>
                    setFormState({ ...formState, focusMinutes: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full pixel-inset bg-[#1f1d30] text-center font-retro text-lg text-[var(--color-text-main)] py-1 focus:outline-none"
                />
              </div>

              <div className="pixel-inset p-2.5 bg-[#141324]">
                <label className="block text-[11px] font-retro text-[var(--color-text-muted)] mb-1">
                  Short Break:
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formState.shortBreakMinutes}
                  onChange={(e) =>
                    setFormState({ ...formState, shortBreakMinutes: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full pixel-inset bg-[#1f1d30] text-center font-retro text-lg text-[var(--color-text-main)] py-1 focus:outline-none"
                />
              </div>

              <div className="pixel-inset p-2.5 bg-[#141324]">
                <label className="block text-[11px] font-retro text-[var(--color-text-muted)] mb-1">
                  Long Break:
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formState.longBreakMinutes}
                  onChange={(e) =>
                    setFormState({ ...formState, longBreakMinutes: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full pixel-inset bg-[#1f1d30] text-center font-retro text-lg text-[var(--color-text-main)] py-1 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Audio & Lofi Ambiance */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-[var(--color-secondary-accent)] uppercase flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              2. Ambiance & Audio
            </h3>
            <div className="pixel-inset p-3 bg-[#141324] space-y-2.5 font-retro text-xs">
              <div className="flex items-center justify-between">
                <span>Sound Effects (Chimes & Clicks):</span>
                <input
                  type="checkbox"
                  checked={formState.soundEnabled}
                  onChange={(e) =>
                    setFormState({ ...formState, soundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Ambient Study Background:</span>
                <select
                  value={formState.ambientSound}
                  onChange={(e) =>
                    handleAmbientChange(e.target.value as 'none' | 'rain' | 'whitenoise')
                  }
                  className="pixel-inset bg-[#1f1d30] px-2 py-1 text-xs text-[var(--color-text-main)] focus:outline-none"
                >
                  <option value="none">None (Silent)</option>
                  <option value="rain">Cozy Lofi Rain 🌧</option>
                  <option value="whitenoise">Study White Noise 📻</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Cloud Database Sync (Supabase) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-[10px] text-[var(--color-warning-break)] uppercase flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" />
                3. Supabase Cloud Database (Task Persistence)
              </h3>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-retro text-[var(--color-secondary-accent)] hover:underline flex items-center gap-0.5"
              >
                supabase.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="pixel-inset p-3 bg-[#141324] space-y-2.5 font-retro text-xs">
              <p className="text-[var(--color-text-muted)] text-[11px]">
                Connect your free Supabase database so your daily tasks and streak history are safely saved in the cloud across all your devices.
              </p>

              {/* SQL Setup Helper */}
              <div className="bg-[#1c1a2d] border border-[#313244] p-2 rounded-xs flex items-center justify-between gap-2">
                <div className="text-[10px] text-[var(--color-text-main)]">
                  <span className="font-pixel text-[9px] text-[#e5c890] block">STEP 1: DATABASE TABLE</span>
                  Run SQL in Supabase SQL Editor to initialize the tasks table.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    const sql = `CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'med',
  completed BOOLEAN NOT NULL DEFAULT false,
  "estimatedPomodoros" INTEGER NOT NULL DEFAULT 1,
  "completedPomodoros" INTEGER NOT NULL DEFAULT 0,
  tag TEXT DEFAULT '',
  "createdAt" BIGINT NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to tasks"
ON public.tasks
FOR ALL
TO anon
USING (true)
WITH CHECK (true);`;
                    navigator.clipboard.writeText(sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="pixel-button px-2 py-1 text-[10px] font-pixel flex items-center gap-1 shrink-0 text-[#8bd5ca]"
                  title="Copy SQL table setup"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-[#a6e3a1]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'SQL COPIED!' : 'COPY SQL'}</span>
                </button>
              </div>

              {/* Credentials Form */}
              <div>
                <label className="block text-[11px] text-[var(--color-text-muted)] mb-0.5">
                  Project URL:
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full pixel-inset bg-[#1f1d30] px-2 py-1 text-xs text-[var(--color-text-main)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--color-text-muted)] mb-0.5">
                  Anon Public Key:
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full pixel-inset bg-[#1f1d30] px-2 py-1 text-xs text-[var(--color-text-main)] focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={async () => {
                    sound.playClick();
                    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
                      setSyncStatus('⚠️ Please enter both Project URL and Anon Key');
                      return;
                    }
                    setIsTesting(true);
                    setSyncStatus('Testing connection to Supabase...');
                    const result = await supabaseService.testConnection(supabaseUrl, supabaseKey);
                    setIsTesting(false);

                    if (result.success) {
                      saveLocalSupabaseCredentials(supabaseUrl, supabaseKey);
                      setSyncStatus('Connected & Saved! Cloud sync is now active 🟢');
                      if (onCloudSyncTrigger) onCloudSyncTrigger();
                    } else {
                      setSyncStatus(`⚠️ ${result.message}`);
                    }
                  }}
                  className="pixel-button px-3 py-1 font-pixel text-[9px] text-[#0d0c17] bg-[var(--color-warning-break)] flex items-center gap-1 font-bold"
                >
                  <Check className="w-3 h-3" />
                  {isTesting ? 'CONNECTING...' : 'TEST & SAVE CONNECTION'}
                </button>

                {supabaseUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      saveLocalSupabaseCredentials('', '');
                      setSupabaseUrl('');
                      setSupabaseKey('');
                      setSyncStatus('Disconnected. Running in offline/local storage mode.');
                    }}
                    className="pixel-button px-2 py-1 font-pixel text-[9px] text-[var(--color-danger)] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    DISCONNECT
                  </button>
                )}
              </div>

              {syncStatus && (
                <div className={`p-1.5 rounded-xs text-[11px] font-retro ${
                  syncStatus.includes('🟢') || syncStatus.includes('Saved')
                    ? 'bg-[#a6e3a1]/20 text-[#a6e3a1] border border-[#a6e3a1]/40'
                    : syncStatus.includes('⚠️')
                    ? 'bg-[#ea7679]/20 text-[#ea7679] border border-[#ea7679]/40'
                    : 'text-[#e5c890]'
                }`}>
                  {syncStatus}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Backup Export & Import */}
          <div className="flex items-center justify-between pt-1 text-xs font-retro">
            <button
              type="button"
              onClick={onExportData}
              className="pixel-button px-2.5 py-1.5 flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON Backup
            </button>

            <label className="pixel-button px-2.5 py-1.5 flex items-center gap-1 cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
              <Upload className="w-3.5 h-3.5" />
              Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[var(--color-border-dark)]">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="pixel-button px-4 py-2 font-pixel text-xs text-[var(--color-text-muted)]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="pixel-button px-4 py-2 font-pixel text-xs bg-[var(--color-primary-accent)] text-[#0d0c17]"
            >
              SAVE SETTINGS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

