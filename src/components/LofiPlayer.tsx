import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../services/soundService';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Radio,
  Music,
} from 'lucide-react';

export interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  src: string;
}

export const LOFI_PLAYLIST: LofiTrack[] = [
  {
    id: 'track-1',
    title: 'Morning Coffee & Chill',
    artist: 'Lofi Study Beats',
    mood: '🌸 Warm Acoustic',
    src: 'https://ia800701.us.archive.org/26/items/LofiHipHop_201905/01.%20Morning%20Coffee.mp3',
  },
  {
    id: 'track-2',
    title: 'Rainy Sidewalk in Shibuya',
    artist: 'Tokyo Midnight Beats',
    mood: '🌧 Rainy Jazzhop',
    src: 'https://ia800701.us.archive.org/26/items/LofiHipHop_201905/02.%20Rainy%20Window.mp3',
  },
  {
    id: 'track-3',
    title: 'Midnight Coding Sanctuary',
    artist: 'Sakura Avenue',
    mood: '☕ Fender Rhodes',
    src: 'https://ia800701.us.archive.org/26/items/LofiHipHop_201905/03.%20Late%20Night%20Study.mp3',
  },
  {
    id: 'track-4',
    title: 'Chillhop Reverie',
    artist: 'Study Camp Records',
    mood: '📚 Downtempo Piano',
    src: 'https://ia801503.us.archive.org/15/items/chill-lofi-song/Chill%20Lofi%20Song.mp3',
  },
  {
    id: 'track-5',
    title: '24/7 Lofi Chill Radio',
    artist: 'Worldwide Stream',
    mood: '📻 Live 24/7 Radio',
    src: 'https://stream.zeno.fm/0r0xa792kwzuv',
  },
];

export const LofiPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('anime_pixel_lofi_volume');
    return saved ? Number(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = LOFI_PLAYLIST[currentTrackIndex];

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = track.src;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLooping;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const onEnded = () => {
      if (!isLooping) {
        nextTrack();
      }
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.src = '';
    };
  }, []);

  // Track change handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying) {
        setIsLoading(true);
        audioRef.current
          .play()
          .then(() => setIsLoading(false))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('anime_pixel_lofi_volume', String(volume));
  }, [volume, isMuted]);

  // Loop sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = () => {
    sound.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const nextTrack = () => {
    sound.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % LOFI_PLAYLIST.length);
  };

  const prevTrack = () => {
    sound.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return 'LIVE';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isLiveStream = track.id === 'track-5';

  return (
    <div className="mt-3 space-y-2">
      {/* =========================================================================
          TIER 1: SONG BANNER (NOW PLAYING MARQUEE + EQUALIZER)
         ========================================================================= */}
      <div className="pixel-panel p-2.5 bg-[#201e33fa] flex items-center justify-between gap-3 border-[var(--color-primary-accent)]">
        {/* Left: Pixel Cassette Artwork & Track Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Animated 16-Bit Cassette Tape Graphic */}
          <div className="w-12 h-8 pixel-inset p-0.5 bg-[#141324] shrink-0 relative flex items-center justify-center">
            {/* Cassette Shell */}
            <div className="w-full h-full bg-[#3d3858] border border-[#0d0c17] relative flex items-center justify-around px-1">
              {/* Left Spool */}
              <div
                className={`w-3 h-3 bg-[#f6eedb] border border-[#0d0c17] rounded-full flex items-center justify-center ${
                  isPlaying ? 'animate-spool' : ''
                }`}
              >
                <div className="w-1 h-1 bg-[#0d0c17]" />
              </div>

              {/* Tape Label Line */}
              <div className="w-3 h-1 bg-[#ea7679]" />

              {/* Right Spool */}
              <div
                className={`w-3 h-3 bg-[#f6eedb] border border-[#0d0c17] rounded-full flex items-center justify-center ${
                  isPlaying ? 'animate-spool' : ''
                }`}
              >
                <div className="w-1 h-1 bg-[#0d0c17]" />
              </div>
            </div>
          </div>

          {/* Marquee Track Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#f49ac2] animate-pixel-blink inline-block shrink-0" />
              <span className="font-pixel text-[9px] text-[var(--color-primary-accent)] uppercase tracking-wider">
                {isLoading ? 'BUFFERING LOFI BEATS...' : isPlaying ? 'NOW PLAYING' : 'STUDY RADIO PAUSED'}
              </span>
              <span className="text-[10px] pixel-inset px-1.5 py-0 text-[var(--color-secondary-accent)] font-retro hidden sm:inline">
                {track.mood}
              </span>
            </div>
            <div className="font-retro text-sm sm:text-base text-[var(--color-text-main)] truncate mt-0.5">
              <strong className="text-[var(--color-text-main)]">{track.title}</strong>
              <span className="text-[var(--color-text-muted)] text-xs ml-1.5 font-retro">
                — {track.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Dancing Pixel Equalizer Bars */}
        <div className="flex items-end gap-1 h-5 shrink-0 px-2 pixel-inset bg-[#12111d] py-1">
          {isPlaying ? (
            <>
              <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-1" />
              <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-2" />
              <div className="w-1.5 bg-[var(--color-warning-break)] animate-eq-3" />
              <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-4" />
              <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-5" />
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 bg-[#4a445f]" />
              <div className="w-1.5 h-1.5 bg-[#4a445f]" />
              <div className="w-1.5 h-1.5 bg-[#4a445f]" />
              <div className="w-1.5 h-1.5 bg-[#4a445f]" />
              <div className="w-1.5 h-1.5 bg-[#4a445f]" />
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          TIER 2: PLAY MUSIC CONTROL BAR
         ========================================================================= */}
      <div className="pixel-panel p-2.5 bg-[#1b192ffa] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Playback Tactile Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={prevTrack}
            title="Previous Track"
            className="pixel-button p-2 text-xs"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play Lofi Music'}
            className={`pixel-button px-3.5 py-2 font-pixel text-xs flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-[var(--color-primary-accent)] text-[#0d0c17]'
                : 'bg-[var(--color-secondary-accent)] text-[#0d0c17]'
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
            onClick={nextTrack}
            title="Next Track"
            className="pixel-button p-2 text-xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsLooping(!isLooping);
            }}
            title={isLooping ? 'Loop Enabled' : 'Loop Disabled'}
            className={`pixel-button p-2 text-xs ${
              isLooping
                ? 'bg-[var(--color-warning-break)] text-[#0d0c17]'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Audio Seek Progress Bar */}
        <div className="w-full sm:w-auto flex-1 flex items-center gap-2 font-retro text-xs text-[var(--color-text-muted)] px-1">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>

          {isLiveStream ? (
            <div className="flex-1 pixel-inset p-1 bg-[#12111d] flex items-center justify-center gap-1.5 text-[var(--color-secondary-accent)] font-pixel text-[10px]">
              <Radio className="w-3 h-3 animate-pixel-blink" />
              <span>LIVE LOFI STREAMING RADIO</span>
            </div>
          ) : (
            <div className="flex-1 flex items-center relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-[#0d0c17] appearance-none cursor-pointer border border-[var(--color-border-dark)] accent-[var(--color-primary-accent)]"
              />
            </div>
          )}

          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* Right: Volume & Playlist Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Volume Control */}
          <div className="flex items-center gap-1.5 pixel-inset px-2 py-1 bg-[#141324]">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-[var(--color-danger)]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[var(--color-secondary-accent)]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-14 h-1.5 bg-[#0d0c17] appearance-none cursor-pointer border border-[#3f395b] accent-[var(--color-secondary-accent)]"
            />
          </div>

          {/* Playlist Track Picker Dropdown */}
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-[var(--color-primary-accent)] hidden sm:inline" />
            <select
              value={currentTrackIndex}
              onChange={(e) => {
                sound.playClick();
                setCurrentTrackIndex(Number(e.target.value));
              }}
              className="pixel-button px-2 py-1 text-xs font-retro bg-[#222036] text-[var(--color-text-main)] focus:outline-none"
            >
              {LOFI_PLAYLIST.map((t, idx) => (
                <option key={t.id} value={idx}>
                  {idx + 1}. {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
