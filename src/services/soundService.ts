import { AlarmSoundType } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tactile 8-bit button click
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // 8-bit Error Buzz for wrong passcode
  public playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  // Level-up / Task Completed victory chime
  public playLevelUp() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx!.currentTime + idx * 0.08 + 0.15
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.15);
      });
    } catch {
      // Ignore
    }
  }

  // 🔔 1. Anime School Chime (Westminster Bell melody)
  public playSchoolChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // F4, A4, G4, C4 -> F4, G4, A4, F4
      const notes = [
        { freq: 349.23, time: 0.0, dur: 0.35 },
        { freq: 440.0, time: 0.35, dur: 0.35 },
        { freq: 392.0, time: 0.7, dur: 0.35 },
        { freq: 261.63, time: 1.05, dur: 0.6 },
        { freq: 349.23, time: 1.65, dur: 0.35 },
        { freq: 392.0, time: 2.0, dur: 0.35 },
        { freq: 440.0, time: 2.35, dur: 0.35 },
        { freq: 349.23, time: 2.7, dur: 0.75 },
      ];

      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, this.ctx!.currentTime + n.time);

        gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx!.currentTime + n.time + n.dur
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + n.time);
        osc.stop(this.ctx!.currentTime + n.time + n.dur);
      });
    } catch {
      // Ignore
    }
  }

  // 🎮 2. Victory Fanfare (RPG Level Up arpeggio)
  public playVictoryFanfare() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const melody = [
        { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.1, dur: 0.12 }, // E5
        { freq: 783.99, time: 0.2, dur: 0.12 }, // G5
        { freq: 1046.5, time: 0.3, dur: 0.15 }, // C6
        { freq: 783.99, time: 0.45, dur: 0.12 }, // G5
        { freq: 1046.5, time: 0.55, dur: 0.6 }, // C6 (long hold)
      ];

      melody.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, this.ctx!.currentTime + n.time);

        gain.gain.setValueAtTime(0.16, this.ctx!.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx!.currentTime + n.time + n.dur
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + n.time);
        osc.stop(this.ctx!.currentTime + n.time + n.dur);
      });
    } catch {
      // Ignore
    }
  }

  // 🍵 3. Zen Singing Bowl / Crystal Gong
  public playZenGong() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const frequencies = [220.0, 440.0, 660.0, 880.0];
      const gains = [0.15, 0.08, 0.04, 0.02];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        gain.gain.setValueAtTime(gains[idx], this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx!.currentTime + 2.5
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime);
        osc.stop(this.ctx!.currentTime + 2.5);
      });
    } catch {
      // Ignore
    }
  }

  // ⏰ 4. Digital Cyber Triple Beep
  public playCyberBeep() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const beeps = [
        { freq: 880, time: 0.0 },
        { freq: 1100, time: 0.12 },
        { freq: 1400, time: 0.24 },
      ];

      beeps.forEach((b) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(b.freq, this.ctx!.currentTime + b.time);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + b.time);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx!.currentTime + b.time + 0.08
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + b.time);
        osc.stop(this.ctx!.currentTime + b.time + 0.08);
      });
    } catch {
      // Ignore
    }
  }

  // 🌸 5. Sakura Pentatonic Harp Sweep
  public playSakuraHarp() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Pentatonic harp sweep: D5, F5, G5, A5, C6, D6
      const harpNotes = [
        { freq: 587.33, time: 0.0 },
        { freq: 698.46, time: 0.08 },
        { freq: 783.99, time: 0.16 },
        { freq: 880.0, time: 0.24 },
        { freq: 1046.5, time: 0.32 },
        { freq: 1174.66, time: 0.4 },
      ];

      harpNotes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, this.ctx!.currentTime + n.time);

        gain.gain.setValueAtTime(0.14, this.ctx!.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          this.ctx!.currentTime + n.time + 0.45
        );

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + n.time);
        osc.stop(this.ctx!.currentTime + n.time + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  // Master Dispatcher for Alarm Sound
  public playAlarmSound(type: AlarmSoundType = 'schoolChime') {
    switch (type) {
      case 'schoolChime':
        this.playSchoolChime();
        break;
      case 'victoryFanfare':
        this.playVictoryFanfare();
        break;
      case 'zenGong':
        this.playZenGong();
        break;
      case 'cyberBeep':
        this.playCyberBeep();
        break;
      case 'sakuraHarp':
        this.playSakuraHarp();
        break;
      default:
        this.playSchoolChime();
        break;
    }
  }

  // Legacy alias
  public playTimerDone() {
    this.playSchoolChime();
  }

  // Soft Ambient Rain noise generator
  public setAmbient(type: 'none' | 'rain' | 'whitenoise', volume: number = 0.2) {
    try {
      this.stopAmbient();
      if (type === 'none' || !this.enabled) return;

      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        // Pink / Brown noise simulation for relaxing rain
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else {
          data[i] = white * 0.1;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 800 : 1200;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      noise.start();
      this.ambientSource = noise;
    } catch {
      // Ignore
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
        this.ambientSource.disconnect();
      } catch {
        // Ignore
      }
      this.ambientSource = null;
    }
  }
}

export const sound = new SoundService();
