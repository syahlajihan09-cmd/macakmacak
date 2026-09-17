// Web Audio API Synthesizer for MASAK MASAK

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  // --- Sound Effects ---

  // 0. Soft UI button click / pop
  public playClick() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 0b. Spatula flip clink sound
  public playSpatulaFlip() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.07);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 0c. Customer footsteps walking
  public playFootsteps() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.12].forEach((offset, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + idx * 25, now + offset);
      osc.frequency.exponentialRampToValueAtTime(80, now + offset + 0.05);

      gain.gain.setValueAtTime(this.sfxVolume * 0.15, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });
  }

  // 0d. Drink dispenser pour sound
  public playPour() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.25);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 0e. Oven beep / chime
  public playOvenBeep() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.12].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now + offset); // A6

      gain.gain.setValueAtTime(this.sfxVolume * 0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  // 1. Ding! when food is cooked
  public playDing() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // 2. Sizzle sound (frying/grilling)
  public playSizzle() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 3. Chopping / Prep sound
  public playChop() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 4. Doorbell / Customer enters
  public playDoorbell() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Two tone ding-dong: 659Hz (E5) -> 523Hz (C5)
    [
      { freq: 659.25, time: now, dur: 0.3 },
      { freq: 523.25, time: now + 0.22, dur: 0.45 },
    ].forEach((tone) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.freq, tone.time);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, tone.time);
      gain.gain.exponentialRampToValueAtTime(0.001, tone.time + tone.dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(tone.time);
      osc.stop(tone.time + tone.dur);
    });
  }

  // 5. Customer happy / order served
  public playOrderServed() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Cheerful ascending chime (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // 6. Customer angry / urgent tick
  public playUrgentTick() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.05);

    gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 7. Customer left / kabur sound (disappointment tone)
  public playCustomerLost() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Descending sad slide
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.45);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 8. Burning warning alarm
  public playBurnAlarm() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.setValueAtTime(1150, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 9. Burnt food sizzle & crackle
  public playFoodBurnt() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 10. Trash discard sound
  public playTrash() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 11. Coin sound
  public playCoin() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.08);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.25);
  }

  // 12. Combo flourish
  public playCombo(level: number) {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 440 + level * 70;
    [0, 4, 7, 12].forEach((interval, idx) => {
      const f = baseFreq * Math.pow(2, interval / 12);
      const startTime = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // 13. Level Completed Victory
  public playLevelWon() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { note: 523.25, time: 0, dur: 0.15 },
      { note: 659.25, time: 0.15, dur: 0.15 },
      { note: 783.99, time: 0.3, dur: 0.15 },
      { note: 1046.5, time: 0.45, dur: 0.4 },
    ];

    melody.forEach((m) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(m.note, now + m.time);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now + m.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + m.time + m.dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + m.time);
      osc.stop(now + m.time + m.dur);
    });
  }

  public playVictory() {
    this.playLevelWon();
  }

  // 14. Game Over sound
  public playGameOver() {
    if (this.isMuted || this.sfxVolume === 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const tones = [440, 392, 349.23, 261.63];
    tones.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 0.3);
    });
  }

  // 15. Light pleasant background cafe rhythm/music (synthesized)
  public startMusic() {
    if (this.isMuted || this.musicVolume === 0 || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const chords = [
      [261.63, 329.63, 392.0], // C
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
    ];
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || this.musicVolume === 0) return;
      const now = this.ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(this.musicVolume * 0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.2);
      });
    }, 1800);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
