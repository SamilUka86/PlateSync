import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Download, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Compass,
  Info
} from 'lucide-react';

export const PWAInstallModal = ({
  isOpen,
  onClose,
  isStandalone = false,
  isIOS = false,
  isAndroid = false,
  hasNativePrompt = false,
  onPromptInstall
}) => {
  // Default tab based on device detection
  const [activePlatform, setActivePlatform] = useState(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  });

  // Keep active platform in sync when modal opens or platform detected
  useEffect(() => {
    if (isOpen) {
      if (isIOS) setActivePlatform('ios');
      else if (isAndroid) setActivePlatform('android');
      else setActivePlatform('desktop');
    }
  }, [isOpen, isIOS, isAndroid]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-midnight-border flex items-center justify-between bg-midnight-card shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Install PlateSync App</h3>
              <p className="text-[11px] text-slate-400">Add to your home screen or desktop for native app experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="p-3 bg-midnight-bg border-b border-midnight-border flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'ios'
                ? 'bg-neon-cyan text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'android'
                ? 'bg-neon-cyan text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setActivePlatform('desktop')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'desktop'
                ? 'bg-neon-cyan text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Status if already running in standalone mode */}
          {isStandalone && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>PlateSync is Already Installed!</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                You are currently running PlateSync in standalone app mode. You have full offline access, no browser URL bar, hardware-accelerated workouts, and instant launcher access.
              </p>
            </div>
          )}

          {/* Quick Native Install Button if browser supports 1-click prompt */}
          {!isStandalone && hasNativePrompt && onPromptInstall && (
            <div className="p-4 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  <span>1-Click Native Install Available</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-neon-cyan text-slate-950 font-black">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                Your browser is ready to install PlateSync directly to your home screen or desktop with a single tap.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onPromptInstall) onPromptInstall();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-neon-cyan/25 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install PlateSync Now</span>
              </button>
            </div>
          )}

          {activePlatform === 'ios' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Requires Apple Safari Browser on iOS</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Apple does not allow automated 1-click install popups on iOS. To install PlateSync on your iPhone or iPad, follow these 3 quick steps inside Safari:
                </p>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Tap the Safari Share button</span>
                    <Share className="w-4 h-4 text-neon-cyan shrink-0" />
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Look for the square icon with an arrow pointing up at the bottom of your Safari browser bar (or top right on iPad).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Select &quot;Add to Home Screen&quot;</span>
                    <PlusSquare className="w-4 h-4 text-neon-violet shrink-0" />
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Scroll down in the Safari share sheet and tap <strong className="text-white font-bold">&quot;Add to Home Screen&quot;</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white">Tap &quot;Add&quot; in Top-Right Corner</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Confirm by tapping <strong className="text-neon-cyan font-bold">Add</strong>. PlateSync will appear on your iPhone/iPad home screen as an app with full offline support.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-300">
                <span className="font-bold text-white">Using Chrome on iOS?</span> Tap the Share icon in Chrome&apos;s address bar &gt; scroll down and select <strong className="text-white font-bold">&quot;Add to Home Screen&quot;</strong>.
              </div>
            </div>
          )}

          {activePlatform === 'android' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-slate-200">
                  Follow these steps in Google Chrome or your default Android browser:
                </span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Tap the Three Dots Menu</span>
                    <MoreVertical className="w-4 h-4 text-neon-cyan shrink-0" />
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tap the vertical three dots (⋮) located in the top-right corner of Chrome.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Select &quot;Install app&quot; or &quot;Add to Home screen&quot;</span>
                    <Download className="w-4 h-4 text-neon-violet shrink-0" />
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tap <strong className="text-white font-bold">&quot;Install app&quot;</strong> (or &quot;Add to Home screen&quot; depending on your Android version).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white">Tap &quot;Install&quot; to Confirm</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    PlateSync will download and install directly to your device launcher with full offline barbell calculator support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2">
                <p className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-neon-cyan shrink-0" />
                  <span>Desktop Chrome, Edge, or Brave:</span>
                </p>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Look for the <strong className="text-neon-cyan font-bold">Install icon</strong> (computer monitor or down arrow icon) on the far right side of your browser&apos;s URL address bar, then click <strong className="text-white font-bold">Install</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white">Check URL Address Bar</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    At the top-right of your browser address bar next to the bookmark star icon, click the <strong className="text-neon-cyan font-bold">Install PlateSync</strong> button.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-7 h-7 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-white">Alternative Menu Method</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click the 3-dots browser menu &gt; <strong className="text-white font-bold">&quot;Save and share&quot;</strong> or <strong className="text-white font-bold">&quot;Cast, save, and share&quot;</strong> &gt; <strong className="text-neon-cyan font-bold">&quot;Install PlateSync...&quot;</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits summary */}
          <div className="p-4 rounded-2xl bg-midnight-elevated border border-midnight-border space-y-2">
            <span className="text-xs uppercase font-black text-neon-cyan tracking-wider block">
              PlateSync App Benefits:
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-success shrink-0" />
                <span>Full-screen view (no URL bar)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-success shrink-0" />
                <span>100% Offline logging & calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-success shrink-0" />
                <span>5-Second heavy haptic buzzers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-success shrink-0" />
                <span>Instant launch from home screen</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-midnight-border flex items-center justify-end bg-midnight-card shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 transition active:scale-95"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
