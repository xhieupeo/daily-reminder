// SoundCloud Widget API Loader & Typing Service

export interface SoundCloudTrackInfo {
  title?: string;
  user?: {
    username?: string;
    permalink_url?: string;
  };
  duration?: number;
  artwork_url?: string;
  permalink_url?: string;
  genre?: string;
}

export interface SoundCloudWidget {
  play(): void;
  pause(): void;
  toggle(): void;
  seekTo(milliseconds: number): void;
  setVolume(volume: number): void;
  getVolume(callback: (volume: number) => void): void;
  getDuration(callback: (durationMs: number) => void): void;
  getPosition(callback: (positionMs: number) => void): void;
  getSounds(callback: (sounds: SoundCloudTrackInfo[]) => void): void;
  getCurrentSound(callback: (sound: SoundCloudTrackInfo | null) => void): void;
  getCurrentSoundIndex(callback: (index: number) => void): void;
  isPaused(callback: (paused: boolean) => void): void;
  next(): void;
  prev(): void;
  skip(soundIndex: number): void;
  load(url: string, options?: Record<string, any>): void;
  bind(eventName: string, listener: (...args: any[]) => void): void;
  unbind(eventName: string): void;
}

declare global {
  interface Window {
    SC?: {
      Widget: {
        (iframe: HTMLIFrameElement | string): SoundCloudWidget;
        Events: {
          READY: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
          SEEK: string;
          PLAY_PROGRESS: string;
          LOAD_PROGRESS: string;
          ERROR: string;
        };
      };
    };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

export function loadSoundCloudWidgetApi(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).SC && typeof (window as any).SC.Widget === 'function') {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector('script[src*="soundcloud.com/player/api.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function formatMsToTime(ms: number): string {
  if (!ms || isNaN(ms) || ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
