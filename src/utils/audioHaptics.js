/**
 * PlateSync - Web Audio & Haptic Feedback Utility
 * Pure browser APIs: Web Audio API & navigator.vibrate
 * Zero external audio files required
 */

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Play a synthesized tone
 */
export const playTone = (frequency = 880, duration = 0.15, type = 'sine') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Autoplay restrictions or unsupported
  }
};

/**
 * Play standard rest-completed sound chime (2-tone chord)
 */
export const playRestFinishedChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Tone 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch (e) {}
};

/**
 * Play short tick for countdown warning (3, 2, 1)
 */
export const playCountdownTick = () => {
  playTone(520, 0.08, 'sine');
};

/**
 * Get configured buzzer and vibration duration in seconds (default 5s)
 */
export const getBuzzerDuration = () => {
  if (typeof window === 'undefined') return 5;
  const stored = localStorage.getItem('platesync_buzzer_duration');
  const num = parseInt(stored, 10);
  return (!isNaN(num) && num >= 1 && num <= 30) ? num : 5;
};

/**
 * Save user preferred buzzer duration in seconds (1 to 30s)
 */
export const setBuzzerDuration = (seconds) => {
  if (typeof window === 'undefined') return 5;
  const clamped = Math.max(1, Math.min(30, parseInt(seconds, 10) || 5));
  try {
    localStorage.setItem('platesync_buzzer_duration', String(clamped));
  } catch (e) {}
  return clamped;
};

/**
 * Generate rhythmic gym buzzer vibration pattern for N seconds
 */
export const generateVibrationPattern = (seconds = 5) => {
  const totalMs = Math.max(1, Math.min(30, seconds)) * 1000;
  const pattern = [];
  let elapsed = 0;
  const pulseOn = 700;
  const pulseOff = 200;

  while (elapsed < totalMs) {
    const remaining = totalMs - elapsed;
    if (remaining <= pulseOn) {
      pattern.push(remaining);
      break;
    }
    pattern.push(pulseOn);
    elapsed += pulseOn;

    if (totalMs - elapsed <= pulseOff) {
      break;
    }
    pattern.push(pulseOff);
    elapsed += pulseOff;
  }
  return pattern.length > 0 ? pattern : [totalMs];
};

let activeBuzzerStopFn = null;

/**
 * Play audible gym buzzer tone pulsing for the configured duration
 */
export const playBuzzerSound = (durationSeconds = 5) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (activeBuzzerStopFn) {
      activeBuzzerStopFn();
    }

    const now = ctx.currentTime;
    const totalSecs = Math.max(1, Math.min(30, durationSeconds));

    // Initial chime
    playRestFinishedChime();

    // Pulsing gym buzzer tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);

    let t = now + 0.1;
    const endTime = now + totalSecs;
    gain.gain.setValueAtTime(0.001, now);

    while (t < endTime) {
      const burstEnd = Math.min(t + 0.45, endTime);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.setValueAtTime(0.001, burstEnd);
      t += 0.65;
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(endTime);

    activeBuzzerStopFn = () => {
      try {
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        osc.stop(ctx.currentTime);
      } catch (e) {}
      activeBuzzerStopFn = null;
    };
  } catch (e) {}
};

/**
 * Trigger device vibration (Haptic feedback)
 * Heavy gym buzzer: pulsating haptic buzzes
 */
export const triggerVibration = (pattern = [800, 200, 800, 200, 800, 200, 800, 200, 1000]) => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
};

/**
 * Trigger buzzer and vibration for user-configured duration
 */
export const triggerConfiguredBuzzer = (customSeconds) => {
  const duration = customSeconds || getBuzzerDuration();
  const pattern = generateVibrationPattern(duration);
  triggerVibration(pattern);
  playBuzzerSound(duration);
  return duration;
};

/**
 * Explicit 5-second long vibration (backward compatibility)
 */
export const trigger5SecVibration = () => {
  triggerConfiguredBuzzer(5);
};

/**
 * Cancel any ongoing vibration and audio buzzer
 */
export const stopVibration = () => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (e) {}
  }
  if (activeBuzzerStopFn) {
    activeBuzzerStopFn();
  }
};

/**
 * Short tap haptic
 */
export const triggerShortHaptic = () => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(60);
    } catch (e) {}
  }
};
