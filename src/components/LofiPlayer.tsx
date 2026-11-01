import React, { useState } from 'react';
import { sound } from '../services/soundService';
import {
  Music,
  ExternalLink,
  Sparkles,
  Link2,
  Check,
  Disc,
  Radio,
} from 'lucide-react';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface PresetItem {
  id: string;
  name: string;
  desc: string;
  tag: string;
  embedUrl: string;
}

const YOUTUBE_PRESETS: PresetItem[] = [
  {
    id: 'yt-lofigirl',
    name: '🌸 Lofi Girl 24/7 Live',
    desc: 'Beats to relax/study to (Live Stream)',
    tag: '🔴 Live Radio',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk',
  },
  {
    id: 'yt-coffee',
    name: '☕ Coffee Shop Chill (2 Hours)',
    desc: 'Cozy acoustic guitar & mellow lofi album',
    tag: '☕ Full 2-Hour Mix',
    embedUrl: 'https://www.youtube-nocookie.com/embed/-5KAN9_CzSA',
  },
  {
    id: 'yt-rain',
    name: '🌧 Rainy Tokyo Night (1 Hour)',
    desc: 'Rain sounds & smooth midnight jazzhop',
    tag: '🌧 Full 1-Hour Mix',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5qap5aO4i9A',
  },
  {
    id: 'yt-ghibli',
    name: '🎹 Ghibli Piano Study (1 Hour)',
    desc: 'Nostalgic anime piano melodies & nature',
    tag: '🌸 Ghibli Piano',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0K8b_6r0g-U',
  },
];

const SPOTIFY_PRESETS: PresetItem[] = [
  {
    id: 'sp-lofi-beats',
    name: '🌸 Lofi Beats (Official)',
    desc: 'Beats to study, relax, and chill to',
    tag: '🌸 Study Lofi',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
  },
  {
    id: 'sp-anime-chill',
    name: '🍵 Anime Lofi & Chill',
    desc: 'Nostalgic anime melodies & lofi hip-hop',
    tag: '🍵 Anime Vibe',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4t95P99mCcf?utm_source=generator&theme=0',
  },
  {
    id: 'sp-rainy-study',
    name: '🌧 Rainy Day Lofi',
    desc: 'Gentle raindrops & mellow study keys',
    tag: '🌧 Rainy Focus',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
  },
  {
    id: 'sp-deep-focus',
    name: '📚 Deep Focus Beats',
    desc: 'Instrumental chillhop for deep coding',
    tag: '📚 Coding Mode',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
  },
];

function parseYouTubeEmbedUrl(input: string): string {
  if (!input) return 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk';
  const clean = input.trim();
  if (clean.includes('youtube.com/embed/') || clean.includes('youtube-nocookie.com/embed/')) {
    return clean;
  }
  const playlistMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const standardMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);

  if (playlistMatch && !standardMatch && !shortMatch) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistMatch[1]}`;
  }
  const videoId = (standardMatch && standardMatch[1]) || (shortMatch && shortMatch[1]) || 'jfKfPfyJRdk';
  if (playlistMatch) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?list=${playlistMatch[1]}`;
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function parseSpotifyEmbedUrl(input: string): string {
  if (!input) return 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0';
  const clean = input.trim();

  if (clean.includes('open.spotify.com/embed/')) {
    return clean.includes('theme=0') ? clean : `${clean}${clean.includes('?') ? '&' : '?'}theme=0`;
  }
  if (clean.startsWith('spotify:')) {
    const parts = clean.split(':');
    const type = parts[1] || 'playlist';
    const id = parts[2];
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }
  const match = clean.match(/open\.spotify\.com\/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/);
  if (match) {
    const type = match[1];
    const id = match[2];
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }
  return `https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0`;
}

export const LofiPlayer: React.FC = () => {
  // Source State: YouTube (Full Songs) vs Spotify
  const [musicSource, setMusicSource] = useState<'youtube' | 'spotify'>(() => {
    const saved = localStorage.getItem('xuan_hieu_music_source');
    return saved === 'spotify' ? 'spotify' : 'youtube'; // Default to YouTube so full songs play right away!
  });

  // YouTube Active State
  const [selectedYTPreset, setSelectedYTPreset] = useState<string>('yt-lofigirl');
  const [customYTUrl, setCustomYTUrl] = useState<string>(() => {
    return localStorage.getItem('xuan_hieu_youtube_url') || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
  });
  const [activeYTEmbedUrl, setActiveYTEmbedUrl] = useState<string>(() => {
    const saved = localStorage.getItem('xuan_hieu_youtube_url');
    return parseYouTubeEmbedUrl(saved || 'https://www.youtube.com/watch?v=jfKfPfyJRdk');
  });

  // Spotify Active State
  const [selectedSPPreset, setSelectedSPPreset] = useState<string>('sp-lofi-beats');
  const [customSPUrl, setCustomSPUrl] = useState<string>(() => {
    return localStorage.getItem('xuan_hieu_spotify_url') || 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS';
  });
  const [activeSPEmbedUrl, setActiveSPEmbedUrl] = useState<string>(() => {
    const saved = localStorage.getItem('xuan_hieu_spotify_url');
    return parseSpotifyEmbedUrl(saved || 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS');
  });

  const [isCustomInputOpen, setIsCustomInputOpen] = useState<boolean>(false);
  const [inputBuffer, setInputBuffer] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [playerHeight, setPlayerHeight] = useState<'compact' | 'expanded'>('compact');

  const switchSource = (source: 'youtube' | 'spotify') => {
    sound.playClick();
    setMusicSource(source);
    localStorage.setItem('xuan_hieu_music_source', source);
    setIsCustomInputOpen(false);
  };

  const handleSelectYTPreset = (preset: PresetItem) => {
    sound.playClick();
    setSelectedYTPreset(preset.id);
    setActiveYTEmbedUrl(preset.embedUrl);
  };

  const handleSelectSPPreset = (preset: PresetItem) => {
    sound.playClick();
    setSelectedSPPreset(preset.id);
    setActiveSPEmbedUrl(preset.embedUrl);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (!inputBuffer.trim()) return;

    if (musicSource === 'youtube') {
      const parsed = parseYouTubeEmbedUrl(inputBuffer.trim());
      setActiveYTEmbedUrl(parsed);
      setCustomYTUrl(inputBuffer.trim());
      setSelectedYTPreset('custom-yt');
      localStorage.setItem('xuan_hieu_youtube_url', inputBuffer.trim());
    } else {
      const parsed = parseSpotifyEmbedUrl(inputBuffer.trim());
      setActiveSPEmbedUrl(parsed);
      setCustomSPUrl(inputBuffer.trim());
      setSelectedSPPreset('custom-sp');
      localStorage.setItem('xuan_hieu_spotify_url', inputBuffer.trim());
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsCustomInputOpen(false);
      setInputBuffer('');
    }, 1200);
  };

  const currentYTPreset = YOUTUBE_PRESETS.find((p) => p.id === selectedYTPreset);
  const currentSPPreset = SPOTIFY_PRESETS.find((p) => p.id === selectedSPPreset);

  const activeTitle =
    musicSource === 'youtube'
      ? selectedYTPreset === 'custom-yt'
        ? 'Custom YouTube Track / Playlist'
        : currentYTPreset?.name
      : selectedSPPreset === 'custom-sp'
      ? 'Custom Spotify Playlist'
      : currentSPPreset?.name;

  const activeDesc =
    musicSource === 'youtube'
      ? selectedYTPreset === 'custom-yt'
        ? '100% Full Song Playing from YouTube'
        : currentYTPreset?.desc
      : selectedSPPreset === 'custom-sp'
      ? 'Connected from your Spotify Account'
      : currentSPPreset?.desc;

  const activeTag =
    musicSource === 'youtube'
      ? selectedYTPreset === 'custom-yt'
        ? '🔴 Full Audio (No 30s Limit)'
        : currentYTPreset?.tag
      : selectedSPPreset === 'custom-sp'
      ? '🟢 Spotify Connected'
      : currentSPPreset?.tag;

  return (
    <div className="mt-3 space-y-2">
      {/* =========================================================================
          SOURCE SELECTOR TABS: YOUTUBE FULL SONGS vs SPOTIFY
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 font-retro text-xs">
          <span className="font-pixel text-[9px] text-[var(--color-text-muted)] mr-1">
            PLAYER SOURCE:
          </span>

          {/* YouTube Tab (Full Songs) */}
          <button
            type="button"
            onClick={() => switchSource('youtube')}
            className={`pixel-button px-2.5 py-1 text-xs font-retro flex items-center gap-1.5 transition-all ${
              musicSource === 'youtube'
                ? 'active-pressed bg-[var(--color-danger)] text-[#0d0c17] font-bold shadow-pixel-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <YouTubeIcon className="w-3.5 h-3.5" />
            <span>YouTube (Full Songs 100%)</span>
          </button>

          {/* Spotify Tab */}
          <button
            type="button"
            onClick={() => switchSource('spotify')}
            className={`pixel-button px-2.5 py-1 text-xs font-retro flex items-center gap-1.5 transition-all ${
              musicSource === 'spotify'
                ? 'active-pressed bg-[var(--color-secondary-accent)] text-[#0d0c17] font-bold shadow-pixel-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Spotify</span>
          </button>
        </div>

        {/* View Size Toggle */}
        <div className="flex items-center gap-1 text-[10px] font-pixel">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setPlayerHeight(playerHeight === 'compact' ? 'expanded' : 'compact');
            }}
            className="pixel-button px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          >
            {playerHeight === 'compact' ? '▲ EXPAND PLAYER' : '▼ COMPACT'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          TIER 1: SONG BANNER (NOW PLAYING MARQUEE + EQUALIZER)
         ========================================================================= */}
      <div className="pixel-panel p-2.5 bg-[#201e33fa] flex flex-col sm:flex-row items-center justify-between gap-2.5 border-[var(--color-primary-accent)]">
        {/* Left: 16-Bit Cassette & Active Track Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
          {/* Animated Pixel Cassette Tape */}
          <div className="w-12 h-8 pixel-inset p-0.5 bg-[#141324] shrink-0 relative flex items-center justify-center">
            <div className="w-full h-full bg-[#3d3858] border border-[#0d0c17] relative flex items-center justify-around px-1">
              <div className="w-3 h-3 bg-[#f6eedb] border border-[#0d0c17] rounded-full flex items-center justify-center animate-spool">
                <div className="w-1 h-1 bg-[#0d0c17]" />
              </div>
              <div
                className={`w-3 h-1 ${
                  musicSource === 'youtube' ? 'bg-[#ea7679]' : 'bg-[#8bd5ca]'
                }`}
              />
              <div className="w-3 h-3 bg-[#f6eedb] border border-[#0d0c17] rounded-full flex items-center justify-center animate-spool">
                <div className="w-1 h-1 bg-[#0d0c17]" />
              </div>
            </div>
          </div>

          {/* Marquee Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-none animate-pixel-blink inline-block shrink-0 ${
                  musicSource === 'youtube' ? 'bg-[#ea7679]' : 'bg-[#8bd5ca]'
                }`}
              />
              <span className="font-pixel text-[8px] sm:text-[9px] text-[var(--color-secondary-accent)] uppercase tracking-wider">
                {musicSource === 'youtube' ? 'YOUTUBE STUDY STREAM' : 'SPOTIFY STREAM'}
              </span>
              <span className="text-[10px] pixel-inset px-1.5 py-0 text-[var(--color-primary-accent)] font-retro hidden sm:inline">
                {activeTag}
              </span>
            </div>
            <div className="font-retro text-sm sm:text-base text-[var(--color-text-main)] truncate mt-0.5">
              <strong>{activeTitle}</strong>
              <span className="text-[var(--color-text-muted)] text-xs ml-1.5 font-retro">
                — {activeDesc}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Equalizer + Connect Link Button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Dancing Pixel Equalizer */}
          <div
            className="flex items-end gap-1 h-5 px-2 pixel-inset bg-[#12111d] py-1"
            title="Audio Playing..."
          >
            <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-1" />
            <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-2" />
            <div className="w-1.5 bg-[var(--color-warning-break)] animate-eq-3" />
            <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-4" />
            <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-5" />
          </div>

          {/* Connect Custom Link Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCustomInputOpen(!isCustomInputOpen);
              setInputBuffer(musicSource === 'youtube' ? customYTUrl : customSPUrl);
            }}
            title={
              musicSource === 'youtube'
                ? 'Paste any YouTube song, album, or playlist link'
                : 'Paste any Spotify link'
            }
            className={`pixel-button px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1.5 ${
              isCustomInputOpen
                ? 'bg-[var(--color-primary-accent)] text-[#0d0c17]'
                : 'text-[var(--color-text-main)]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>
              {musicSource === 'youtube' ? 'PASTE YT LINK' : 'PASTE SPOTIFY'}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: QUICK PRESET CHANNELS
         ========================================================================= */}
      <div className="pixel-panel p-2 bg-[#1b192ffa] flex flex-wrap items-center justify-between gap-2">
        {/* Preset Channels for Current Source */}
        <div className="flex flex-wrap items-center gap-1 text-xs font-retro">
          <span className="text-[var(--color-text-muted)] text-[11px] font-pixel mr-1 hidden sm:inline">
            CHANNELS:
          </span>

          {musicSource === 'youtube' ? (
            <>
              {YOUTUBE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectYTPreset(preset)}
                  className={`pixel-button px-2 py-0.5 text-xs font-retro ${
                    selectedYTPreset === preset.id
                      ? 'active-pressed bg-[var(--color-danger)] text-[#0d0c17] font-bold'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedYTPreset('custom-yt');
                  setActiveYTEmbedUrl(parseYouTubeEmbedUrl(customYTUrl));
                }}
                className={`pixel-button px-2 py-0.5 text-xs font-retro flex items-center gap-1 ${
                  selectedYTPreset === 'custom-yt'
                    ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17] font-bold'
                    : 'text-[var(--color-primary-accent)]'
                }`}
              >
                <YouTubeIcon className="w-3 h-3" />
                <span>My YouTube</span>
              </button>
            </>
          ) : (
            <>
              {SPOTIFY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectSPPreset(preset)}
                  className={`pixel-button px-2 py-0.5 text-xs font-retro ${
                    selectedSPPreset === preset.id
                      ? 'active-pressed bg-[var(--color-secondary-accent)] text-[#0d0c17] font-bold'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedSPPreset('custom-sp');
                  setActiveSPEmbedUrl(parseSpotifyEmbedUrl(customSPUrl));
                }}
                className={`pixel-button px-2 py-0.5 text-xs font-retro flex items-center gap-1 ${
                  selectedSPPreset === 'custom-sp'
                    ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17] font-bold'
                    : 'text-[var(--color-primary-accent)]'
                }`}
              >
                <Disc className="w-3 h-3" />
                <span>My Spotify</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Custom Link Input Drawer */}
      {isCustomInputOpen && (
        <form
          onSubmit={handleApplyCustomUrl}
          className="pixel-panel p-2.5 bg-[#25223c] space-y-2 border-[var(--color-primary-accent)]"
        >
          <div className="flex items-center justify-between text-xs font-retro text-[var(--color-text-muted)]">
            <span className="text-[var(--color-text-main)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary-accent)]" />
              <strong>
                {musicSource === 'youtube'
                  ? 'Connect Any YouTube Song, Album, or Playlist (100% Full Playback)'
                  : 'Connect Any Spotify Song, Album, or Playlist'}
              </strong>
            </span>
            <span className="text-[11px]">Copy link from browser / app ➔ Paste below</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                musicSource === 'youtube'
                  ? 'https://www.youtube.com/watch?v=... or youtu.be/...'
                  : 'https://open.spotify.com/playlist/... or track/...'
              }
              value={inputBuffer}
              onChange={(e) => setInputBuffer(e.target.value)}
              className="pixel-inset bg-[#12111d] text-xs text-[var(--color-text-main)] px-3 py-1.5 flex-1 focus:outline-none focus:border-[var(--color-primary-accent)] font-retro"
            />
            <button
              type="submit"
              className="pixel-button px-3 py-1.5 font-pixel text-xs bg-[var(--color-primary-accent)] text-[#0d0c17] flex items-center gap-1 shrink-0"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>CONNECTED!</span>
                </>
              ) : (
                <>
                  <Music className="w-3.5 h-3.5" />
                  <span>LOAD LINK</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TIER 3: ACTIVE PLAYER EMBED (YOUTUBE or SPOTIFY)
         ========================================================================= */}
      <div className="pixel-panel p-1 bg-[#12111d] overflow-hidden border-2 border-[var(--color-border-dark)] shadow-pixel">
        {musicSource === 'youtube' ? (
          /* YouTube Embed Player (Plays Full-length Songs & Live Streams) */
          <iframe
            src={activeYTEmbedUrl}
            width="100%"
            height={playerHeight === 'compact' ? '95' : '220'}
            title="YouTube Study Music Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-none border-0 block"
          />
        ) : (
          /* Spotify Embed Player */
          <iframe
            src={activeSPEmbedUrl}
            width="100%"
            height={playerHeight === 'compact' ? '80' : '152'}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-none border-0 block"
            title="Spotify Study Player"
          />
        )}
      </div>

      {/* Bottom Helpful Tips & External Links */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-retro text-[var(--color-text-muted)] px-1 gap-1">
        {musicSource === 'youtube' ? (
          <span className="flex items-center gap-1 text-[var(--color-secondary-accent)]">
            <Radio className="w-3 h-3 animate-pixel-blink" />
            <span>
              <strong>Full Songs Enabled:</strong> YouTube plays 100% of songs, 1-hour albums & live streams without 30s limits.
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span>
              💡 <strong>Tip:</strong> Click "Log In" inside Spotify player for full songs, or toggle to <strong>YouTube</strong> above for zero-restriction listening!
            </span>
          </span>
        )}

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {musicSource === 'youtube' ? (
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary-accent)] flex items-center gap-1"
            >
              <span>Open YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary-accent)] flex items-center gap-1"
            >
              <span>Open Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
