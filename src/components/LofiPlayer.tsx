import React, { useState } from 'react';
import { sound } from '../services/soundService';
import {
  Music,
  ExternalLink,
  Sparkles,
  Link2,
  Check,
  Disc,
} from 'lucide-react';

interface SpotifyPreset {
  id: string;
  name: string;
  desc: string;
  tag: string;
  spotifyId: string;
}

const PRESET_PLAYLISTS: SpotifyPreset[] = [
  {
    id: 'lofi-beats',
    name: 'Lofi Beats (Official)',
    desc: 'Beats to study, relax, and chill to',
    tag: '🌸 Study Lofi',
    spotifyId: '37i9dQZF1DX8Uebhn9wzrS',
  },
  {
    id: 'anime-chill',
    name: 'Anime Lofi & Ghibli Chill',
    desc: 'Nostalgic anime melodies & lofi hip-hop',
    tag: '🍵 Anime Vibe',
    spotifyId: '37i9dQZF1DX4t95P99mCcf',
  },
  {
    id: 'rainy-study',
    name: 'Rainy Day Lofi',
    desc: 'Gentle raindrops & mellow study keys',
    tag: '🌧 Rainy Focus',
    spotifyId: '37i9dQZF1DXdLEN7aqioXM',
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus & Ambient Beats',
    desc: 'Instrumental chillhop for deep coding',
    tag: '📚 Coding Mode',
    spotifyId: '37i9dQZF1DWZeKCadgRdKQ',
  },
];

const DEFAULT_CUSTOM_URL = 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS';

function parseSpotifyEmbedUrl(input: string): string {
  if (!input) return 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0';
  
  // Clean query string
  const clean = input.trim();

  // If already an embed url
  if (clean.includes('open.spotify.com/embed/')) {
    return clean.includes('theme=0') ? clean : `${clean}${clean.includes('?') ? '&' : '?'}theme=0`;
  }

  // Handle spotify:playlist:xxxx or spotify:track:xxxx
  if (clean.startsWith('spotify:')) {
    const parts = clean.split(':');
    const type = parts[1] || 'playlist';
    const id = parts[2];
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Handle https://open.spotify.com/playlist/ID, /track/ID, /album/ID
  const match = clean.match(/open\.spotify\.com\/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/);
  if (match) {
    const type = match[1];
    const id = match[2];
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Fallback
  return `https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0`;
}

export const LofiPlayer: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('lofi-beats');
  const [customUrl, setCustomUrl] = useState<string>(() => {
    return localStorage.getItem('xuan_hieu_spotify_url') || DEFAULT_CUSTOM_URL;
  });
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string>(() => {
    const saved = localStorage.getItem('xuan_hieu_spotify_url');
    return parseSpotifyEmbedUrl(saved || 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS');
  });

  const [isCustomInputOpen, setIsCustomInputOpen] = useState<boolean>(false);
  const [inputBuffer, setInputBuffer] = useState<string>(customUrl);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [playerHeight, setPlayerHeight] = useState<'compact' | 'expanded'>('compact');

  const currentPreset = PRESET_PLAYLISTS.find((p) => p.id === selectedPreset);

  const selectPreset = (preset: SpotifyPreset) => {
    sound.playClick();
    setSelectedPreset(preset.id);
    const embedUrl = `https://open.spotify.com/embed/playlist/${preset.spotifyId}?utm_source=generator&theme=0`;
    setActiveEmbedUrl(embedUrl);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (!inputBuffer.trim()) return;

    const parsed = parseSpotifyEmbedUrl(inputBuffer.trim());
    setActiveEmbedUrl(parsed);
    setCustomUrl(inputBuffer.trim());
    setSelectedPreset('custom');
    localStorage.setItem('xuan_hieu_spotify_url', inputBuffer.trim());

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsCustomInputOpen(false);
    }, 1200);
  };

  return (
    <div className="mt-3 space-y-2">
      {/* =========================================================================
          TIER 1: SONG BANNER (NOW PLAYING SPOTIFY HEADER + MARQUEE + EQUALIZER)
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
              <div className="w-3 h-1 bg-[#f49ac2]" />
              <div className="w-3 h-3 bg-[#f6eedb] border border-[#0d0c17] rounded-full flex items-center justify-center animate-spool">
                <div className="w-1 h-1 bg-[#0d0c17]" />
              </div>
            </div>
          </div>

          {/* Marquee Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#8bd5ca] animate-pixel-blink inline-block shrink-0" />
              <span className="font-pixel text-[8px] sm:text-[9px] text-[var(--color-secondary-accent)] uppercase tracking-wider">
                SPOTIFY LOFI SANCTUARY
              </span>
              <span className="text-[10px] pixel-inset px-1.5 py-0 text-[var(--color-primary-accent)] font-retro hidden sm:inline">
                {selectedPreset === 'custom' ? '★ Xuan Hieu\'s Choice' : currentPreset?.tag}
              </span>
            </div>
            <div className="font-retro text-sm sm:text-base text-[var(--color-text-main)] truncate mt-0.5">
              <strong>{selectedPreset === 'custom' ? 'My Custom Spotify Playlist' : currentPreset?.name}</strong>
              <span className="text-[var(--color-text-muted)] text-xs ml-1.5 font-retro">
                — {selectedPreset === 'custom' ? 'Connected from Spotify' : currentPreset?.desc}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Equalizer + Connect My Playlist Button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Dancing Pixel Equalizer */}
          <div className="flex items-end gap-1 h-5 px-2 pixel-inset bg-[#12111d] py-1" title="Spotify Audio Visualizer">
            <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-1" />
            <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-2" />
            <div className="w-1.5 bg-[var(--color-warning-break)] animate-eq-3" />
            <div className="w-1.5 bg-[var(--color-secondary-accent)] animate-eq-4" />
            <div className="w-1.5 bg-[var(--color-primary-accent)] animate-eq-5" />
          </div>

          {/* Connect Custom Playlist Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCustomInputOpen(!isCustomInputOpen);
            }}
            title="Paste any Spotify playlist, album, or song link"
            className={`pixel-button px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1.5 ${
              isCustomInputOpen || selectedPreset === 'custom'
                ? 'bg-[var(--color-primary-accent)] text-[#0d0c17]'
                : 'text-[var(--color-text-main)]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>CONNECT SPOTIFY</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: QUICK PRESET CHANNELS + CUSTOM URL DRAWER
         ========================================================================= */}
      <div className="pixel-panel p-2 bg-[#1b192ffa] flex flex-wrap items-center justify-between gap-2">
        {/* Preset Channel Pills */}
        <div className="flex flex-wrap items-center gap-1 text-xs font-retro">
          <span className="text-[var(--color-text-muted)] text-[11px] font-pixel mr-1 hidden sm:inline">
            CHANNELS:
          </span>
          {PRESET_PLAYLISTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset)}
              className={`pixel-button px-2 py-0.5 text-xs font-retro ${
                selectedPreset === preset.id
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
              setSelectedPreset('custom');
              setActiveEmbedUrl(parseSpotifyEmbedUrl(customUrl));
            }}
            className={`pixel-button px-2 py-0.5 text-xs font-retro flex items-center gap-1 ${
              selectedPreset === 'custom'
                ? 'active-pressed bg-[var(--color-primary-accent)] text-[#0d0c17] font-bold'
                : 'text-[var(--color-primary-accent)]'
            }`}
          >
            <Disc className="w-3 h-3" />
            <span>My Playlist</span>
          </button>
        </div>

        {/* View Size Toggle (Compact 80px vs Full 152px) */}
        <div className="flex items-center gap-1 text-[10px] font-pixel">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setPlayerHeight(playerHeight === 'compact' ? 'expanded' : 'compact');
            }}
            className="pixel-button px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          >
            {playerHeight === 'compact' ? '▲ EXPAND' : '▼ COMPACT'}
          </button>
        </div>
      </div>

      {/* Custom URL Input Drawer */}
      {isCustomInputOpen && (
        <form onSubmit={handleApplyCustomUrl} className="pixel-panel p-2.5 bg-[#25223c] space-y-2 border-[var(--color-primary-accent)]">
          <div className="flex items-center justify-between text-xs font-retro text-[var(--color-text-muted)]">
            <span className="text-[var(--color-text-main)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary-accent)]" />
              <strong>Connect Any Spotify Song, Album, or Playlist</strong>
            </span>
            <span className="text-[11px]">Copy link from Spotify app ➔ Paste below</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://open.spotify.com/playlist/... or track/..."
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
                  <span>LOAD SPOTIFY</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TIER 3: EMBEDDED SPOTIFY WEB PLAYER
         ========================================================================= */}
      <div className="pixel-panel p-1 bg-[#12111d] overflow-hidden border-2 border-[var(--color-border-dark)] shadow-pixel">
        <iframe
          src={activeEmbedUrl}
          width="100%"
          height={playerHeight === 'compact' ? '80' : '152'}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-none border-0 block"
          title="Spotify Study Player"
        />
      </div>

      {/* Help Note on Log In */}
      <div className="flex items-center justify-between text-[11px] font-retro text-[var(--color-text-muted)] px-1">
        <span className="flex items-center gap-1">
          <span>💡 <strong>Tip:</strong> Click "Log In" inside the Spotify player to play full-length songs from your Spotify account.</span>
        </span>
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-primary-accent)] flex items-center gap-1"
        >
          <span>Open Spotify Web</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
