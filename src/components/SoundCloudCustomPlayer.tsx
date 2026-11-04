import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundService';
import {
  loadSoundCloudWidgetApi,
  SoundCloudWidget,
  SoundCloudTrackInfo,
  formatMsToTime,
} from '../services/soundcloudWidgetService';
import { CassetteTapeVisualizer } from './CassetteTapeVisualizer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Link2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Radio,
  Disc,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  X,
} from 'lucide-react';

const SoundCloudIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M11.56 8.87V17h1.09V8.58c-.34.07-.71.18-1.09.29zm-1.57.51v7.62h1.1V9.06c-.36.09-.73.2-1.1.32zm-1.56.55v7.07h1.09V9.52c-.36.11-.73.26-1.09.41zm-1.56.73v6.34h1.09V10.1c-.36.16-.72.36-1.09.56zm-1.57 1.05v5.29h1.09v-4.83c-.36.22-.72.48-1.09.76zm-1.57 1.48v3.81h1.1v-3.32c-.37.28-.73.59-1.1.91zm-1.56 1.77v2.04h1.09v-1.59c-.36.33-.72.67-1.09.98zm-1.57.87v1.17h1.09v-.81c-.36.38-.72.74-1.09 1.07zm14.33-4.63c-.45 0-.89.06-1.31.18v6.62h7.62c1.7 0 3.09-1.39 3.09-3.09 0-1.64-1.29-2.98-2.91-3.08-.22-2.14-2.02-3.82-4.22-3.82-.29 0-.57.03-.84.09-.54-1.74-2.17-3-4.1-3-.62 0-1.2.13-1.74.37v9.44c.42-.12.86-.18 1.31-.18.78 0 1.5.25 2.09.68z" />
  </svg>
);

interface PresetChannel {
  id: string;
  name: string;
  desc: string;
  tag: string;
  tapeLabel: string;
  soundCloudUrl: string;
}

const SOUNDCLOUD_PRESETS: PresetChannel[] = [
  {
    id: 'sc-lofi-beats',
    name: '🌸 Lofi Hip Hop Study Beats',
    desc: 'Classic chilled beats for deep concentration',
    tag: 'Study Lofi',
    tapeLabel: 'SIDE A • LOFI BEATS',
    soundCloudUrl: 'https://soundcloud.com/chilledcow/sets/lofi-hip-hop-radio',
  },
  {
    id: 'sc-coffee-chill',
    name: '☕ Cozy Coffee Shop Lofi',
    desc: 'Mellow acoustic chords, rain drops & vinyl crackles',
    tag: 'Coffee Focus',
    tapeLabel: 'SIDE B • COFFEE CHILL',
    soundCloudUrl: 'https://soundcloud.com/chilledcow/sets/coffee-shop-chill',
  },
  {
    id: 'sc-anime-vibes',
    name: '🎌 Anime & Ghibli Memories',
    desc: 'Nostalgic anime melody remixes & piano beats',
    tag: 'Anime Chill',
    tapeLabel: 'SIDE A • ANIME PIANO',
    soundCloudUrl: 'https://soundcloud.com/user-556108151/sets/anime-lofi',
  },
  {
    id: 'sc-midnight-deep',
    name: '🌌 Midnight Coding Chillhop',
    desc: 'Deep atmosphere & late night focus rhythms',
    tag: 'Late Night',
    tapeLabel: 'SIDE B • MIDNIGHT HOP',
    soundCloudUrl: 'https://soundcloud.com/chillhopdotcom/sets/chillhop-essentials-spring',
  },
];

export const SoundCloudCustomPlayer: React.FC = () => {
  // Widget iframe ref
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentPositionMs, setCurrentPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('xuan_hieu_sc_volume');
    return saved ? Number(saved) : 80;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Advanced Playlist Options: Shuffle & Loop Modes
  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    return localStorage.getItem('xuan_hieu_sc_shuffle') === 'true';
  });
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() => {
    const saved = localStorage.getItem('xuan_hieu_sc_repeat');
    if (saved === 'off' || saved === 'all' || saved === 'one') return saved;
    return 'all'; // Default to continuous loop for study sessions
  });

  // Active Track & Playlist Sounds
  const [currentTrack, setCurrentTrack] = useState<SoundCloudTrackInfo | null>(null);
  const [playlistSounds, setPlaylistSounds] = useState<SoundCloudTrackInfo[]>([]);
  const [currentSoundIndex, setCurrentSoundIndex] = useState<number>(0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sc-lofi-beats');
  const [customUrl, setCustomUrl] = useState<string>(() => {
    return (
      localStorage.getItem('xuan_hieu_custom_sc_url') ||
      'https://soundcloud.com/chilledcow/sets/lofi-hip-hop-radio'
    );
  });
  const [activeUrl, setActiveUrl] = useState<string>(() => {
    const preset = SOUNDCLOUD_PRESETS[0];
    return preset ? preset.soundCloudUrl : 'https://soundcloud.com/chilledcow/sets/lofi-hip-hop-radio';
  });

  // UI Drawer States
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('xuan_hieu_sc_collapsed') === 'true';
  });
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState<boolean>(false);
  const [isTracklistOpen, setIsTracklistOpen] = useState<boolean>(false);
  const [inputBuffer, setInputBuffer] = useState<string>('');
  const [showNativeWidget, setShowNativeWidget] = useState<boolean>(false);

  // Active Tape Label
  const activePreset = SOUNDCLOUD_PRESETS.find((p) => p.id === selectedPresetId);
  const currentTapeLabel = activePreset ? activePreset.tapeLabel : 'SIDE X • CUSTOM MIX';

  // Refs for access inside callbacks
  const isShuffleRef = useRef(isShuffle);
  const repeatModeRef = useRef(repeatMode);
  const playlistSoundsRef = useRef(playlistSounds);
  const currentSoundIndexRef = useRef(currentSoundIndex);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    playlistSoundsRef.current = playlistSounds;
  }, [playlistSounds]);

  useEffect(() => {
    currentSoundIndexRef.current = currentSoundIndex;
  }, [currentSoundIndex]);

  // Helper to get random shuffle track index
  const getRandomTrackIndex = (total: number, current: number): number => {
    if (total <= 1) return 0;
    let nextIdx = Math.floor(Math.random() * total);
    if (nextIdx === current) {
      nextIdx = (current + 1) % total;
    }
    return nextIdx;
  };

  // Initialize SoundCloud Widget API
  useEffect(() => {
    let isCancelled = false;

    loadSoundCloudWidgetApi()
      .then(() => {
        if (isCancelled || !iframeRef.current || !window.SC) return;

        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(window.SC.Widget.Events.READY, () => {
          if (isCancelled) return;
          setIsReady(true);
          widget.setVolume(volume);

          widget.getCurrentSound((soundInfo) => {
            if (soundInfo) {
              setCurrentTrack(soundInfo);
              if (soundInfo.duration) setDurationMs(soundInfo.duration);
            }
          });

          widget.getSounds((sounds) => {
            if (sounds && Array.isArray(sounds)) {
              setPlaylistSounds(sounds);
            }
          });

          widget.getCurrentSoundIndex((idx) => {
            if (typeof idx === 'number') setCurrentSoundIndex(idx);
          });
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          if (isCancelled) return;
          setIsPlaying(true);
          widget.getCurrentSound((soundInfo) => {
            if (soundInfo) {
              setCurrentTrack(soundInfo);
              if (soundInfo.duration) setDurationMs(soundInfo.duration);
            }
          });

          widget.getSounds((sounds) => {
            if (sounds && Array.isArray(sounds)) {
              setPlaylistSounds(sounds);
            }
          });

          widget.getCurrentSoundIndex((idx) => {
            if (typeof idx === 'number') setCurrentSoundIndex(idx);
          });
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          if (isCancelled) return;
          setIsPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          if (isCancelled || !widgetRef.current) return;

          const currentRepeat = repeatModeRef.current;
          const currentShuffle = isShuffleRef.current;
          const sounds = playlistSoundsRef.current;
          const currentIdx = currentSoundIndexRef.current;

          // Single track repeat
          if (currentRepeat === 'one') {
            widgetRef.current.seekTo(0);
            widgetRef.current.play();
            return;
          }

          // Shuffle mode on finish
          if (currentShuffle && sounds.length > 1) {
            const nextIdx = getRandomTrackIndex(sounds.length, currentIdx);
            setCurrentSoundIndex(nextIdx);
            widgetRef.current.skip(nextIdx);
            widgetRef.current.play();
            return;
          }

          // Loop playlist
          if (currentRepeat === 'all') {
            if (currentIdx >= sounds.length - 1) {
              // Wrap back to beginning
              widgetRef.current.skip(0);
              widgetRef.current.play();
            }
            return;
          }

          // Off: Stop playback
          setIsPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data: any) => {
          if (isCancelled || !data) return;
          if (typeof data.currentPosition === 'number') {
            setCurrentPositionMs(data.currentPosition);
          }
          if (typeof data.duration === 'number' && data.duration > 0) {
            setDurationMs(data.duration);
          }
        });
      })
      .catch((err) => {
        console.warn('SoundCloud Widget failed to load:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeUrl]);

  // Handle Play/Pause
  const togglePlay = () => {
    sound.playClick();
    if (!widgetRef.current) return;

    if (isPlaying) {
      widgetRef.current.pause();
      setIsPlaying(false);
    } else {
      widgetRef.current.play();
      setIsPlaying(true);
    }
  };

  // Next Track with Shuffle Support
  const handleNext = () => {
    sound.playClick();
    if (!widgetRef.current) return;

    if (isShuffle && playlistSounds.length > 1) {
      const nextIdx = getRandomTrackIndex(playlistSounds.length, currentSoundIndex);
      setCurrentSoundIndex(nextIdx);
      widgetRef.current.skip(nextIdx);
      widgetRef.current.play();
    } else {
      widgetRef.current.next();
    }
  };

  // Previous Track
  const handlePrev = () => {
    sound.playClick();
    if (widgetRef.current) {
      widgetRef.current.prev();
    }
  };

  // Toggle Shuffle Mode
  const toggleShuffle = () => {
    sound.playClick();
    const nextVal = !isShuffle;
    setIsShuffle(nextVal);
    localStorage.setItem('xuan_hieu_sc_shuffle', String(nextVal));
  };

  // Cycle Repeat Mode (all -> one -> off)
  const cycleRepeat = () => {
    sound.playClick();
    const modes: ('all' | 'one' | 'off')[] = ['all', 'one', 'off'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setRepeatMode(nextMode);
    localStorage.setItem('xuan_hieu_sc_repeat', nextMode);
  };

  // Jump directly to track index from tracklist
  const handleSelectTrack = (index: number) => {
    sound.playClick();
    if (widgetRef.current) {
      setCurrentSoundIndex(index);
      widgetRef.current.skip(index);
      widgetRef.current.play();
      setIsPlaying(true);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = Number(e.target.value);
    setCurrentPositionMs(newPosition);
    if (widgetRef.current) {
      widgetRef.current.seekTo(newPosition);
    }
  };

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    localStorage.setItem('xuan_hieu_sc_volume', String(val));
    if (widgetRef.current) {
      widgetRef.current.setVolume(val);
    }
  };

  const toggleMute = () => {
    sound.playClick();
    if (!widgetRef.current) return;

    if (isMuted) {
      const restored = volume || 70;
      setIsMuted(false);
      widgetRef.current.setVolume(restored);
    } else {
      setIsMuted(true);
      widgetRef.current.setVolume(0);
    }
  };

  // Preset Selection
  const selectPreset = (preset: PresetChannel) => {
    sound.playClick();
    setSelectedPresetId(preset.id);
    setActiveUrl(preset.soundCloudUrl);
    if (widgetRef.current) {
      widgetRef.current.load(preset.soundCloudUrl, {
        auto_play: true,
        show_artwork: true,
        color: 'ea76cb',
      });
      setIsPlaying(true);
    }
  };

  // Custom URL Submit
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBuffer.trim()) return;

    sound.playClick();
    const clean = inputBuffer.trim();
    setCustomUrl(clean);
    localStorage.setItem('xuan_hieu_custom_sc_url', clean);
    setSelectedPresetId('custom-sc');
    setActiveUrl(clean);
    setIsCustomUrlOpen(false);

    if (widgetRef.current) {
      widgetRef.current.load(clean, {
        auto_play: true,
        show_artwork: true,
        color: 'ea76cb',
      });
      setIsPlaying(true);
    }
  };

  const toggleCollapse = () => {
    sound.playClick();
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    localStorage.setItem('xuan_hieu_sc_collapsed', String(nextCollapsed));
  };

  // Build iframe src
  const embedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    activeUrl
  )}&color=%23ea76cb&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;

  return (
    <footer className="w-full max-w-7xl mx-auto mt-4 mb-3 px-2 z-20">
      {/* 1. RETRO NOW-PLAYING BANNER WITH MINI TRANSPORT CONTROLS */}
      <div className="bg-[#1c1a2cf0] border-2 border-[#12111a] rounded-t-sm px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-pixel-sm">
        {/* Left: Soundwave & Dynamic Track Metadata */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ff550022] border border-[#ff5500] rounded-xs text-[#ff5500] shrink-0">
            <SoundCloudIcon className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-pixel text-[9px] uppercase tracking-wider font-bold">
              SOUNDCLOUD
            </span>
          </div>

          {/* Dancing Pixel Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-4 px-1 shrink-0">
            {[40, 90, 60, 100, 75, 45, 85, 55].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-[#ea76cb] transition-all rounded-xs"
                style={{
                  height: isPlaying ? `${height}%` : '20%',
                  opacity: isPlaying ? 0.95 : 0.4,
                  animation: isPlaying
                    ? `soundwave ${0.6 + (i % 4) * 0.2}s infinite alternate ease-in-out`
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Current Track Details */}
          <div className="truncate min-w-0">
            <span className="font-retro text-xs text-[#f5e0dc] font-bold">
              {currentTrack?.title || activePreset?.name || 'Lofi Chill Tape'}
            </span>
            <span className="font-pixel text-[9px] text-[#a6adc8] ml-2 hidden sm:inline">
              by {currentTrack?.user?.username || 'Community Beats'}
            </span>
          </div>
        </div>

        {/* Center/Right: Quick Mini Transport & Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mini Transport Buttons (Always functional, perfect when collapsed!) */}
          <div className="flex items-center gap-1 bg-[#141220] border border-[#2a273f] rounded-xs px-1.5 py-0.5">
            <button
              type="button"
              onClick={handlePrev}
              className="text-[#a6adc8] hover:text-[#fff] p-1 transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className={`p-1 rounded-xs transition-colors ${
                isPlaying
                  ? 'text-[#e5c890] hover:text-[#fff]'
                  : 'text-[#ea76cb] hover:text-[#fff]'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="text-[#a6adc8] hover:text-[#fff] p-1 transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Shuffle Toggle */}
          <button
            type="button"
            onClick={toggleShuffle}
            title={isShuffle ? 'Shuffle: ON (Randomizing tracks)' : 'Shuffle: OFF'}
            className={`pixel-button px-1.5 py-0.5 text-xs flex items-center gap-1 ${
              isShuffle
                ? 'active-pressed bg-[#8bd5ca] text-[#0d0c17] font-bold'
                : 'text-[#a6adc8] hover:text-[#cdd6f4]'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span className="text-[9px] font-pixel hidden lg:inline">
              {isShuffle ? 'SHUF' : ''}
            </span>
          </button>

          {/* Quick Repeat Toggle */}
          <button
            type="button"
            onClick={cycleRepeat}
            title={
              repeatMode === 'all'
                ? 'Loop Mode: REPEAT PLAYLIST 🔁'
                : repeatMode === 'one'
                ? 'Loop Mode: REPEAT CURRENT TRACK 🔂'
                : 'Loop Mode: OFF'
            }
            className={`pixel-button px-1.5 py-0.5 text-xs flex items-center gap-1 ${
              repeatMode !== 'off'
                ? 'active-pressed bg-[#ea76cb] text-[#0d0c17] font-bold'
                : 'text-[#a6adc8] hover:text-[#cdd6f4]'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-3 h-3" />
            ) : (
              <Repeat className="w-3 h-3" />
            )}
            <span className="text-[9px] font-pixel hidden lg:inline">
              {repeatMode === 'all' ? 'ALL' : repeatMode === 'one' ? 'ONE' : ''}
            </span>
          </button>

          {/* Tracklist Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsTracklistOpen(!isTracklistOpen);
            }}
            title="Browse all tracks in current playlist"
            className={`pixel-button px-1.5 py-0.5 text-xs flex items-center gap-1 ${
              isTracklistOpen
                ? 'active-pressed bg-[#e5c890] text-[#0d0c17] font-bold'
                : 'text-[#a6adc8] hover:text-[#cdd6f4]'
            }`}
          >
            <ListMusic className="w-3 h-3" />
            <span className="text-[9px] font-pixel hidden md:inline">
              LIST {playlistSounds.length > 0 ? `(${playlistSounds.length})` : ''}
            </span>
          </button>

          {/* Custom URL Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setInputBuffer(customUrl);
              setIsCustomUrlOpen(!isCustomUrlOpen);
            }}
            className="pixel-button px-2 py-0.5 text-xs font-retro flex items-center gap-1 text-[#e5c890] hover:text-[#fff]"
            title="Paste any SoundCloud track or playlist URL"
          >
            <Link2 className="w-3 h-3" />
            <span className="hidden xl:inline">LINK</span>
          </button>

          {/* External Link to SoundCloud */}
          {currentTrack?.permalink_url && (
            <a
              href={currentTrack.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a6adc8] hover:text-[#ea76cb] p-1 transition-colors"
              title="Open track on SoundCloud"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Collapse / Expand Console */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`pixel-button px-1.5 py-0.5 text-xs font-pixel flex items-center gap-1 ${
              isCollapsed ? 'text-[#a6e3a1]' : 'text-[#cdd6f4]'
            }`}
            title={isCollapsed ? 'Expand Custom Player' : 'Collapse Player'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span className="text-[9px] hidden sm:inline">
              {isCollapsed ? 'EXPAND' : 'MIN'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 16-BIT CASSETTE CONSOLE (Hidden via CSS when collapsed to preserve audio) */}
      <div
        className={`bg-[#181628f5] border-2 border-t-0 border-[#12111a] rounded-b-sm shadow-pixel transition-all duration-300 ease-in-out ${
          isCollapsed
            ? 'max-h-0 opacity-0 p-0 overflow-hidden border-b-0 border-l-0 border-r-0 pointer-events-none'
            : 'max-h-[1200px] opacity-100 p-3'
        }`}
      >
        {/* Preset Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-[#2a273f]">
          <div className="flex items-center gap-1.5 text-[10px] font-pixel text-[#ea76cb]">
            <Sparkles className="w-3 h-3" />
            <span>LOFI PRESET CHANNELS:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SOUNDCLOUD_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`pixel-button px-2 py-1 text-xs font-retro flex items-center gap-1 transition-all ${
                  selectedPresetId === preset.id
                    ? 'active-pressed bg-[#ea76cb] text-[#0d0c17] font-bold shadow-pixel-sm'
                    : 'text-[#cdd6f4] hover:text-[#fff]'
                }`}
              >
                <Disc className="w-3 h-3" />
                <span>{preset.name}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedPresetId('custom-sc');
                setActiveUrl(customUrl);
                if (widgetRef.current) {
                  widgetRef.current.load(customUrl, { auto_play: true });
                  setIsPlaying(true);
                }
              }}
              className={`pixel-button px-2 py-1 text-xs font-retro flex items-center gap-1 ${
                selectedPresetId === 'custom-sc'
                  ? 'active-pressed bg-[#8bd5ca] text-[#0d0c17] font-bold'
                  : 'text-[#8bd5ca]'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>My Saved Link</span>
            </button>
          </div>
        </div>

        {/* Custom Link Input Drawer */}
        {isCustomUrlOpen && (
          <form
            onSubmit={handleApplyCustomUrl}
            className="mb-3 p-2 bg-[#201e33] border border-[#ff5500] rounded-xs flex flex-col sm:flex-row items-stretch gap-2"
          >
            <div className="flex-1 flex items-center gap-2">
              <span className="font-pixel text-[10px] text-[#ff5500] whitespace-nowrap">
                SC URL:
              </span>
              <input
                type="text"
                value={inputBuffer}
                onChange={(e) => setInputBuffer(e.target.value)}
                placeholder="https://soundcloud.com/artist/track or /sets/playlist"
                className="pixel-input flex-1 px-2 py-1 text-xs font-mono bg-[#12111a] text-[#fff] border border-[#313244]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="pixel-button px-3 py-1 text-xs font-retro bg-[#ff5500] text-[#0d0c17] font-bold"
              >
                LOAD TAPE
              </button>
              <button
                type="button"
                onClick={() => setIsCustomUrlOpen(false)}
                className="pixel-button px-2 py-1 text-xs font-retro text-[#a6adc8]"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {/* Center Deck: Cassette Visualizer + Hardware Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Left: 16-Bit Cassette Tape Visualizer (5 columns) */}
          <div className="md:col-span-5 flex justify-center">
            <CassetteTapeVisualizer
              isPlaying={isPlaying}
              trackTitle={currentTrack?.title || activePreset?.name}
              artistName={currentTrack?.user?.username || 'SoundCloud Artist'}
              tapeLabel={currentTapeLabel}
            />
          </div>

          {/* Right: Hardware Playback Deck & Progress Bar (7 columns) */}
          <div className="md:col-span-7 flex flex-col justify-between h-full bg-[#1e1c2f] border border-[#2a273f] rounded-xs p-3">
            {/* LCD Display */}
            <div className="bg-[#0f0e18] border-2 border-[#12111a] rounded-xs p-2 mb-3 shadow-inner flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full border border-[#000] ${
                    isPlaying ? 'bg-[#a6e3a1] animate-pulse' : 'bg-[#e5c890]'
                  }`}
                ></div>
                <span className="font-pixel text-[9px] text-[#a6adc8] uppercase">
                  STATUS: {isPlaying ? 'PLAYING' : isReady ? 'READY' : 'LOADING...'}
                </span>
                {isShuffle && (
                  <span className="font-pixel text-[8px] bg-[#8bd5ca]/20 text-[#8bd5ca] px-1 rounded-xs border border-[#8bd5ca]/40">
                    SHUF
                  </span>
                )}
                {repeatMode !== 'off' && (
                  <span className="font-pixel text-[8px] bg-[#ea76cb]/20 text-[#ea76cb] px-1 rounded-xs border border-[#ea76cb]/40">
                    LOOP: {repeatMode.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="font-mono text-xs text-[#a6e3a1] font-bold tracking-widest">
                {formatMsToTime(currentPositionMs)} / {formatMsToTime(durationMs)}
              </div>
            </div>

            {/* Seek Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[9px] font-pixel text-[#a6adc8] mb-1">
                <span>TRACK POSITION</span>
                <span>
                  {durationMs > 0
                    ? `${Math.round((currentPositionMs / durationMs) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={durationMs || 100}
                value={currentPositionMs}
                onChange={handleSeek}
                className="w-full accent-[#ea76cb] bg-[#12111a] h-2 rounded-xs cursor-pointer border border-[#313244]"
              />
            </div>

            {/* Hardware Transport Buttons, Modes & Volume */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2a273f]">
              {/* Transport Buttons: Prev, Play/Pause, Next */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="pixel-button px-2.5 py-1.5 text-xs text-[#cdd6f4] hover:text-[#fff]"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className={`pixel-button px-4 py-1.5 text-xs font-retro flex items-center gap-1.5 font-bold ${
                    isPlaying
                      ? 'bg-[#e5c890] text-[#0d0c17]'
                      : 'bg-[#ea76cb] text-[#0d0c17]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="pixel-button px-2.5 py-1.5 text-xs text-[#cdd6f4] hover:text-[#fff]"
                  title="Next Track (Randomized if Shuffle is active)"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                {/* Shuffle Button */}
                <button
                  type="button"
                  onClick={toggleShuffle}
                  className={`pixel-button px-2 py-1.5 text-xs flex items-center gap-1 ${
                    isShuffle
                      ? 'active-pressed bg-[#8bd5ca] text-[#0d0c17] font-bold'
                      : 'text-[#a6adc8] hover:text-[#fff]'
                  }`}
                  title={isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
                >
                  <Shuffle className="w-3 h-3" />
                  <span className="text-[9px] font-pixel hidden sm:inline">SHUFFLE</span>
                </button>

                {/* Repeat Button */}
                <button
                  type="button"
                  onClick={cycleRepeat}
                  className={`pixel-button px-2 py-1.5 text-xs flex items-center gap-1 ${
                    repeatMode !== 'off'
                      ? 'active-pressed bg-[#ea76cb] text-[#0d0c17] font-bold'
                      : 'text-[#a6adc8] hover:text-[#fff]'
                  }`}
                  title={`Loop Mode: ${repeatMode.toUpperCase()} (Click to toggle)`}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="w-3 h-3" />
                  ) : (
                    <Repeat className="w-3 h-3" />
                  )}
                  <span className="text-[9px] font-pixel hidden sm:inline">
                    {repeatMode === 'all' ? 'LOOP ALL' : repeatMode === 'one' ? 'LOOP 1' : 'NO LOOP'}
                  </span>
                </button>

                {/* Tracklist Drawer Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsTracklistOpen(!isTracklistOpen);
                  }}
                  className={`pixel-button px-2 py-1.5 text-xs flex items-center gap-1 ${
                    isTracklistOpen
                      ? 'active-pressed bg-[#e5c890] text-[#0d0c17] font-bold'
                      : 'text-[#a6adc8] hover:text-[#fff]'
                  }`}
                  title="Browse Tracklist"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-pixel hidden sm:inline">SONGS</span>
                </button>
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-[#a6adc8] hover:text-[#ea76cb]"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[#ea7679]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#8bd5ca]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 accent-[#8bd5ca] bg-[#12111a] h-1.5 rounded-xs cursor-pointer border border-[#313244]"
                />
                <span className="font-mono text-[10px] text-[#8bd5ca] w-7 text-right">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tracklist Browser Drawer */}
        {isTracklistOpen && (
          <div className="mt-3 bg-[#13111f] border-2 border-[#2a273f] rounded-xs p-2.5">
            <div className="flex items-center justify-between border-b border-[#2a273f] pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-[#e5c890]" />
                <span className="font-pixel text-[10px] text-[#e5c890]">
                  PLAYLIST TRACKLIST ({playlistSounds.length} TRACKS)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTracklistOpen(false)}
                className="text-[#a6adc8] hover:text-[#ea7679] text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {playlistSounds.length === 0 ? (
              <div className="text-center py-4 font-retro text-xs text-[#a6adc8]">
                Loading tracklist from SoundCloud...
              </div>
            ) : (
              <div className="max-h-44 overflow-y-auto space-y-1 pr-1 font-retro text-xs">
                {playlistSounds.map((soundItem, idx) => {
                  const isCurrent = idx === currentSoundIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTrack(idx)}
                      className={`w-full text-left px-2 py-1 rounded-xs flex items-center justify-between gap-2 transition-all ${
                        isCurrent
                          ? 'bg-[#ea76cb] text-[#0d0c17] font-bold shadow-pixel-sm'
                          : 'bg-[#1b192c] hover:bg-[#25223c] text-[#cdd6f4]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        <span className="font-mono text-[10px] opacity-70 w-5">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {isCurrent && <span className="text-[10px]">★</span>}
                        <span className="truncate">{soundItem.title || `Track #${idx + 1}`}</span>
                        {soundItem.user?.username && (
                          <span className="text-[10px] opacity-60 hidden sm:inline">
                            - {soundItem.user.username}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] opacity-80 shrink-0">
                        {soundItem.duration ? formatMsToTime(soundItem.duration) : '--:--'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Toggle Native SoundCloud Embed Drawer */}
        <div className="mt-2.5 pt-2 border-t border-[#2a273f] flex items-center justify-between text-[10px] font-retro text-[#a6adc8]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowNativeWidget(!showNativeWidget);
            }}
            className="hover:text-[#ea76cb] flex items-center gap-1 transition-colors"
          >
            <span>{showNativeWidget ? '▲ Hide' : '▼ Show'} SoundCloud Waveform / Tracklist</span>
          </button>
          <span className="font-pixel text-[9px] text-[#e5c890]">
            100% FULL PLAYBACK • ZERO 30S CUTOFFS
          </span>
        </div>
      </div>

      {/* 3. PERSISTENT HEADLESS AUDIO BRIDGE (ALWAYS MOUNTED IN DOM SO COLLAPSING NEVER KILLS AUDIO) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showNativeWidget && !isCollapsed
            ? 'mt-2 max-h-48 opacity-100'
            : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <iframe
          ref={iframeRef}
          title="SoundCloud Player Bridge"
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={embedSrc}
          className="border border-[#2a273f] rounded-xs"
        ></iframe>
      </div>
    </footer>
  );
};
