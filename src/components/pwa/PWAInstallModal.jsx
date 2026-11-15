import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Download, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Sparkles,
  Compass,
  Check
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

  // Lock body scroll when modal is open so underlying page never moves
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] w-screen h-[100dvh] overflow-y-auto bg-midnight-bg/90 backdrop-blur-md p-2.5 sm:p-4 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md sm:max-w-lg my-auto bg-midnight-card border border-midnight-border rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[82vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (pinned top) */}
        <div className="p-4 sm:p-5 border-b border-midnight-border flex items-center justify-between bg-midnight-card shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white truncate">Install PlateSync App</h3>
                {isIOS && (
                  <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    iOS Device
                  </span>
                )}
                {isAndroid && (
                  <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
                    Android Device
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">Add to your device for instant offline gym access</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition shrink-0 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs (pinned under header) */}
        <div className="p-2 sm:p-2.5 bg-midnight-bg border-b border-midnight-border flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'ios'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>Apple iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'android'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('desktop')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePlatform === 'desktop'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 shrink-0" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Scrollable Content Body (strictly contained inside modal height) */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 text-xs flex-1 overscroll-contain">
          
          {/* Status if already running in standalone mode */}
          {isStandalone && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PlateSync is Already Installed!</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-medium">
                You are currently running PlateSync in standalone app mode with full offline access, no browser URL bars, and instant launch capability.
              </p>
            </div>
          )}

          {/* 1-Click Native Install (If supported on Android Chrome or Desktop) */}
          {!isStandalone && hasNativePrompt && onPromptInstall && (
            <div className="p-3.5 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  <span>1-Tap Install Ready</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-neon-cyan text-slate-950 font-black">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium">
                Your browser supports direct 1-tap installation to your home screen right now.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onPromptInstall) onPromptInstall();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-neon-cyan/25 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install PlateSync Now</span>
              </button>
            </div>
          )}

          {/* iOS INSTRUCTIONS */}
          {activePlatform === 'ios' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>iOS Requirement: Use Apple Safari</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                  Apple does not allow automated 1-click install popups. To install on iPhone or iPad, follow these 3 quick steps in <strong>Safari</strong>:
                </p>
              </div>

              {/* iOS Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Tap Safari &quot;Share&quot; Icon</span>
                    <Share className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Look for the square icon with an arrow pointing up at the bottom of your Safari screen (or top right on iPad).
                  </p>
                </div>
              </div>

              {/* iOS Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Select &quot;Add to Home Screen&quot;</span>
                    <PlusSquare className="w-3.5 h-3.5 text-neon-violet shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Scroll down the share sheet and tap <strong className="text-white font-bold">&quot;Add to Home Screen&quot;</strong>.
                  </p>
                </div>
              </div>

              {/* iOS Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white">Tap &quot;Add&quot; in Top-Right Corner</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Confirm by tapping <strong className="text-neon-cyan font-bold">Add</strong>. PlateSync will appear on your home screen with its app icon and full offline mode.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-[11px] text-slate-300">
                <span className="font-bold text-white">Chrome on iOS?</span> Tap the Share icon in Chrome&apos;s address bar &gt; select <strong className="text-white">&quot;Add to Home Screen&quot;</strong>.
              </div>
            </div>
          )}

          {/* ANDROID INSTRUCTIONS */}
          {activePlatform === 'android' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-neon-cyan shrink-0" />
                  <span>Google Chrome or Android Browser</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                  On Android, you can install PlateSync directly into your phone&apos;s app launcher with full offline capabilities:
                </p>
              </div>

              {/* Android Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Tap the Three Dots Menu</span>
                    <MoreVertical className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tap the vertical three dots (⋮) located at the top-right corner of Google Chrome.
                  </p>
                </div>
              </div>

              {/* Android Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Tap &quot;Install app&quot;</span>
                    <Download className="w-3.5 h-3.5 text-neon-violet shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Select <strong className="text-white font-bold">&quot;Install app&quot;</strong> (or &quot;Add to Home screen&quot; depending on Chrome version).
                  </p>
                </div>
              </div>

              {/* Android Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white">Tap &quot;Install&quot; to Confirm</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    PlateSync will download and appear in your phone&apos;s app drawer with instant launch speed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP INSTRUCTIONS */}
          {activePlatform === 'desktop' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border space-y-1">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-neon-cyan shrink-0" />
                  <span>Desktop Chrome, Edge, or Brave:</span>
                </p>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Look for the <strong className="text-neon-cyan font-bold">Install icon</strong> (computer monitor or down arrow icon) on the far right side of your browser&apos;s URL address bar, then click <strong className="text-white font-bold">Install</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white">Check URL Address Bar</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    At the top-right of your browser address bar next to the star bookmark icon, click the <strong className="text-neon-cyan font-bold">Install PlateSync</strong> button.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold text-white">Alternative: 3-Dots Menu</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Click browser menu (⋮) &gt; <strong className="text-white">&quot;Save and share&quot;</strong> &gt; <strong className="text-neon-cyan">&quot;Install PlateSync...&quot;</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits summary (compact 2-col) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-midnight-elevated border border-midnight-border space-y-1.5">
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider block">
              Installed App Features:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>Full-screen (no URL bar)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>100% Offline logging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>5s Heavy Gym Buzzer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>Instant home launch</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer (pinned bottom) */}
        <div className="p-3.5 sm:p-4 border-t border-midnight-border flex items-center justify-between bg-midnight-card shrink-0">
          <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
            Free PWA &bull; No App Store Required
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full xs:w-auto px-6 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 transition active:scale-95 text-center ml-auto"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
