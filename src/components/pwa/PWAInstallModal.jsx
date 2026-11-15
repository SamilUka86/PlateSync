import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export const PWAInstallModal = ({
  isOpen,
  onClose,
  isIOS = false,
  isAndroid = false
}) => {
  // Default tab based on device detection
  const [activePlatform, setActivePlatform] = useState(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'android';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-midnight-border flex items-center justify-between bg-midnight-card">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Install PlateSync App</h3>
              <p className="text-[11px] text-slate-400">Add to your home screen for native app experience</p>
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
        <div className="p-3 bg-midnight-bg border-b border-midnight-border flex items-center gap-1.5">
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
          
          {activePlatform === 'ios' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">
                  Safari on iOS does not support one-click prompts. Follow these 3 simple steps:
                </span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>Tap the Safari Share button</span>
                    <Share className="w-4 h-4 text-neon-cyan" />
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Look for the square icon with an arrow pointing up at the bottom of your Safari browser bar.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>Select "Add to Home Screen"</span>
                    <PlusSquare className="w-4 h-4 text-neon-violet" />
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Scroll down through the share menu options and tap <strong className="text-slate-200">"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white">Tap "Add" in Top Right Corner</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Confirm by tapping <strong className="text-neon-cyan">Add</strong>. PlateSync will appear on your iPhone/iPad home screen like a native app.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'android' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">
                  Follow these steps in Google Chrome or your default Android browser:
                </span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>Tap the Three Dots Menu</span>
                    <MoreVertical className="w-4 h-4 text-neon-cyan" />
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tap the vertical three dots (⋮) located in the top-right corner of Chrome.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>Select "Install app" or "Add to Home screen"</span>
                    <Download className="w-4 h-4 text-neon-violet" />
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tap <strong className="text-slate-200">"Install app"</strong> (or "Add to Home screen" depending on your browser version).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
                <div className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white">Tap "Install" to Confirm</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    PlateSync will download and install directly to your app launcher with full offline support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-neon-cyan" />
                  <span>Desktop Chrome, Edge, or Brave:</span>
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Look for the <strong className="text-neon-cyan">Install icon</strong> (a computer monitor or down arrow icon) on the far right side of your browser's URL address bar, then click <strong className="text-white">Install</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border space-y-1">
                <p className="font-bold text-white text-[11px]">Alternative Menu Option:</p>
                <p className="text-[11px] text-slate-400">
                  Click the 3-dots browser menu &gt; <strong className="text-slate-200">"Save and share"</strong> or <strong className="text-slate-200">"Cast, save, and share"</strong> &gt; <strong className="text-neon-cyan">"Install PlateSync..."</strong>
                </p>
              </div>
            </div>
          )}

          {/* Benefits summary */}
          <div className="p-3 rounded-2xl bg-midnight-elevated border border-midnight-border space-y-1.5">
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider block">
              PWA App Features:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>Full-screen view</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>Offline logging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>Instant load speed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-success shrink-0" />
                <span>No app store needed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-midnight-border flex items-center justify-end bg-midnight-card">
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
