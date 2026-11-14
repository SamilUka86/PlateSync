import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  X, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  SmartphoneNfc,
  ChevronUp, 
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  playRestFinishedChime, 
  playCountdownTick, 
  triggerVibration, 
  triggerShortHaptic 
} from '../../utils/audioHaptics';

export const RestTimerWidget = ({
  restSeconds,
  initialSeconds = 90,
  onUpdateSeconds,
  onDismiss,
  addNotification
}) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('platesync_timer_sound') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const [vibrateEnabled, setVibrateEnabled] = useState(() => {
    try {
      return localStorage.getItem('platesync_timer_vibrate') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const [isMinimized, setIsMinimized] = useState(false);

  // Toggle sound
  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('platesync_timer_sound', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Toggle vibration
  const handleToggleVibrate = () => {
    setVibrateEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('platesync_timer_vibrate', String(next));
      } catch (e) {}
      if (next) triggerShortHaptic();
      return next;
    });
  };

  // Adjust seconds (+30s or -15s)
  const handleAdjust = (delta) => {
    if (onUpdateSeconds) {
      onUpdateSeconds(Math.max(0, restSeconds + delta));
      if (vibrateEnabled) triggerShortHaptic();
    }
  };

  // Preset setter
  const handleSetPreset = (secs) => {
    if (onUpdateSeconds) {
      onUpdateSeconds(secs);
      if (vibrateEnabled) triggerShortHaptic();
    }
  };

  if (restSeconds === null) return null;

  const mins = Math.floor(restSeconds / 60);
  const secs = restSeconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const maxSecs = Math.max(initialSeconds, restSeconds, 1);
  const progressPercent = Math.min(100, Math.max(0, ((maxSecs - restSeconds) / maxSecs) * 100));

  // If minimized, display compact floating pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-midnight-card border border-neon-cyan/50 text-white shadow-2xl shadow-neon-cyan/20 hover:border-neon-cyan transition group"
        >
          <div className="relative flex items-center justify-center">
            <Timer className="w-4 h-4 text-neon-cyan animate-pulse" />
          </div>
          <span className="font-mono text-sm font-black text-neon-cyan">
            {formattedTime}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-midnight-card/95 backdrop-blur-xl border border-neon-cyan/40 rounded-3xl p-4 shadow-2xl shadow-neon-cyan/15 animate-in fade-in slide-in-from-bottom-3">
      {/* Progress Bar Top Track */}
      <div className="w-full h-1.5 bg-midnight-bg rounded-full overflow-hidden mb-3.5">
        <div 
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-glow-cyan animate-ping" />
          <span className="font-bold text-white uppercase text-[10px] tracking-wider flex items-center gap-1">
            Rest Period
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan'
                : 'bg-midnight-bg border-midnight-border text-slate-500'
            }`}
            title={soundEnabled ? 'Sound alerts on' : 'Sound alerts muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Vibration Toggle */}
          <button
            type="button"
            onClick={handleToggleVibrate}
            className={`p-1.5 rounded-lg border transition ${
              vibrateEnabled
                ? 'bg-neon-violet/10 border-neon-violet/40 text-neon-violet'
                : 'bg-midnight-bg border-midnight-border text-slate-500'
            }`}
            title={vibrateEnabled ? 'Vibration haptics on' : 'Vibration haptics off'}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white transition"
            title="Minimize"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss / Close Button */}
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg bg-midnight-bg border border-midnight-border text-slate-400 hover:text-neon-error transition"
            title="Skip Rest"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Countdown Display & Adjustment */}
      <div className="flex items-center justify-between py-2 px-1">
        <button
          type="button"
          onClick={() => handleAdjust(-15)}
          className="px-2.5 py-1.5 rounded-xl bg-midnight-bg border border-midnight-border text-slate-300 hover:text-white hover:border-slate-500 text-xs font-mono font-bold transition active:scale-95"
          title="Subtract 15 seconds"
        >
          -15s
        </button>

        <div className="flex flex-col items-center">
          <span className="text-4xl font-black font-mono text-white tracking-wider">
            {formattedTime}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {restSeconds === 0 ? 'Rest Complete!' : 'Remaining'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleAdjust(30)}
          className="px-2.5 py-1.5 rounded-xl bg-midnight-bg border border-midnight-border text-neon-cyan hover:border-neon-cyan/50 text-xs font-mono font-bold transition active:scale-95"
          title="Add 30 seconds"
        >
          +30s
        </button>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-midnight-border">
        {[60, 90, 120, 180].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSetPreset(s)}
            className={`py-1 rounded-lg text-[11px] font-mono font-bold transition ${
              restSeconds === s
                ? 'bg-neon-cyan text-slate-950'
                : 'bg-midnight-bg hover:bg-midnight-elevated text-slate-400 hover:text-white border border-midnight-border'
            }`}
          >
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>
    </div>
  );
};
