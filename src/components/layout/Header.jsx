import React, { useState, useEffect } from 'react';
import {
  Menu,
  Scale,
  Download,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  LogIn,
  CheckCircle2,
  Globe,
  ChevronDown,
  Search,
  Check,
  MessageSquare,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAdmin } from '../../context/AdminContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../pwa/PWAInstallModal';
import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  changeWebsiteLanguage,
  toggleEnglishHindi
} from '../../services/translation/websiteTranslator';
import { isDesignatedAdminEmail } from '../../utils/adminSecurity';

export const Header = ({ activeTab, setActiveTab, onOpenMobileMenu, collapsed, setCollapsed, onOpenAuth, onOpenFeedback, onOpenAdmin }) => {
  const { currentUser, userProfile, updateProfile, isDemoMode, isDevTester, demoAccessMode, toggleDemoAccessMode, logout } = useAuth();
  const { isAdmin, adminSession } = useAdmin();
  const { addNotification } = useNotification();

  // Switch to admin portal & admin features available strictly ONLY if logged-in user email is authorized administrator
  const isAdminUser = Boolean(
    currentUser &&
    !isDemoMode &&
    isDesignatedAdminEmail(currentUser.email)
  );

  // Integrated PWA Installation Hook with Android, iOS and Desktop support
  const {
    isStandalone,
    isIOS,
    isAndroid,
    buttonLabel,
    hasNativePrompt,
    isModalOpen,
    setIsModalOpen,
    promptInstall
  } = usePWAInstall();

  const handleInstallClick = () => {
    promptInstall(
      (msg) => addNotification(msg, 'success'),
      (err) => addNotification(err, 'info')
    );
  };

  // 5-second popup near download button when user refreshes or first visits the website (strictly for non-signed-in visitors)
  const [showInstallPromptBubble, setShowInstallPromptBubble] = useState(() => {
    try {
      const isStandaloneMode = 
        window.matchMedia?.('(display-mode: standalone)')?.matches ||
        window.navigator?.standalone === true ||
        document.referrer?.includes('android-app://');
      return !isStandaloneMode;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (isStandalone || currentUser || isDemoMode) {
      setShowInstallPromptBubble(false);
      return;
    }

    setShowInstallPromptBubble(true);
    const timer = setTimeout(() => {
      setShowInstallPromptBubble(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isStandalone, currentUser, isDemoMode]);

  // Global Website Language Translation State (English <-> Hindi)
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleToggleLanguage = () => {
    const nextLangCode = currentLang.code === 'hi' ? 'en' : 'hi';
    const nextLang = SUPPORTED_LANGUAGES.find(l => l.code === nextLangCode) || SUPPORTED_LANGUAGES[0];
    setCurrentLang(nextLang);
    addNotification(
      nextLangCode === 'en'
        ? 'Switched back to English'
        : 'पूरे ऐप का हिंदी में अनुवाद किया जा रहा है (Translating to Hindi)...',
      'info'
    );
    toggleEnglishHindi();
  };

  const currentUnit = (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG';

  const togglePreferredUnit = () => {
    const nextUnit = currentUnit === 'KG' ? 'LBS' : 'KG';
    updateProfile({ preferredUnit: nextUnit });
    addNotification(`Default weight unit set to ${nextUnit}`, 'success');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'calculator': return 'Smart Barbell Calculator';
      case 'converter': return 'Weight Conversion (KG ⇄ LBS)';
      case 'tracker': return 'Workout Tracker & Logging';
      case 'planner': return 'Weekly Workout Planner (Mon - Sun)';
      case 'library': return 'Exercise Library & Programs';
      case 'history': return 'Workout History & Logs';
      case 'analytics': return 'Performance & Analytics';
      case 'records': return 'Personal Records & Achievements';
      case 'bodyweight': return 'Body Weight Tracker & Analytics';
      case 'profile': return 'Athlete Profile';
      case 'settings': return 'Platform Settings';
      default: return 'PlateSync';
    }
  };

  const getMobileTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'calculator': return 'Calculator';
      case 'converter': return 'Conversion';
      case 'tracker': return 'Tracker';
      case 'planner': return 'Weekly Planner';
      case 'library': return 'Exercises';
      case 'history': return 'History';
      case 'analytics': return 'Analytics';
      case 'records': return 'PR Records';
      case 'bodyweight': return 'Body Weight';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return 'PlateSync';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-midnight-bg/85 backdrop-blur-md border-b border-midnight-border px-3 sm:px-6 md:px-8 flex items-center justify-between">
      {/* Left: Mobile menu & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl lg:hidden hover:bg-midnight-card transition shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-neon-cyan hover:text-white text-xs font-semibold transition shrink-0"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Open Menu</span>
          </button>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight truncate">
            <span className="sm:hidden">{getMobileTitle()}</span>
            <span className="hidden sm:inline">{getPageTitle()}</span>
          </h2>
          <p className="hidden md:block text-[11px] text-slate-400 font-mono truncate">
            Smart Barbell &bull; Mixed-Unit Weight Tracking
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Demo Mode Controller Badge & Toggle */}
        {isDemoMode && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-midnight-card border border-neon-cyan/30 text-xs">
            <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 text-neon-cyan font-bold font-mono text-[10px]">
              {isDevTester
                ? (demoAccessMode === 'calculator-only' ? 'Demo: Calc Only' : 'Demo: Testing Full')
                : 'Demo Mode'}
            </span>

            {/* Developer Toggle: Only rendered when dev mode is active */}
            {isDevTester && (
              <button
                onClick={() => {
                  const next = toggleDemoAccessMode();
                  addNotification(
                    next === 'full'
                      ? 'Unlocked all tabs in Demo Mode for testing updates'
                      : 'Switched Demo Account back to Calculator-Only mode',
                    'info'
                  );
                }}
                className="px-2 py-0.5 rounded-lg bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-white font-mono text-[10px] border border-midnight-border transition"
                title={demoAccessMode === 'calculator-only' ? 'Click to unlock all tabs for testing updates' : 'Click to lock to calculator only'}
              >
                {demoAccessMode === 'calculator-only' ? 'Unlock All' : 'Lock Calc'}
              </button>
            )}

            <button
              onClick={logout}
              className="px-2 py-0.5 rounded-lg bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-[10px] transition"
              title="Sign in to your account"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Guest Sign In Button */}
        {!currentUser && !isDemoMode && (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs transition shadow-md shadow-neon-cyan/25 active:scale-95"
            title="Sign in or register account"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        {/* PWA Install Button with 5-Second "Click here to install" Pop-Up (Strictly for non-signed-in users, no logo inside) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowInstallPromptBubble(false);
              handleInstallClick();
            }}
            className={`shrink-0 flex items-center justify-center p-2 rounded-xl border transition active:scale-95 cursor-pointer shadow-sm ${
              showInstallPromptBubble && !isStandalone && !currentUser && !isDemoMode
                ? 'border-neon-cyan bg-neon-cyan text-slate-950 shadow-glow-cyan ring-2 ring-neon-cyan ring-offset-2 ring-offset-midnight-bg animate-pulse'
                : isStandalone
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400 shadow-emerald-500/10'
                  : 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-slate-950 hover:shadow-neon-cyan/25 shadow-neon-cyan/10'
            }`}
            title={isStandalone ? "PlateSync is running in installed app mode (Click for details)" : "Install PlateSync Progressive Web App"}
            aria-label="Install App"
          >
            {isStandalone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Download className="w-4 h-4 shrink-0" />
            )}
          </button>

          {/* 5-second popup on first visit / refresh - only for non-signed-in users with no logo */}
          {showInstallPromptBubble && !isStandalone && !currentUser && !isDemoMode && (
            <div 
              onClick={() => {
                setShowInstallPromptBubble(false);
                handleInstallClick();
              }}
              className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 z-[100] cursor-pointer animate-in fade-in slide-in-from-top-2 duration-200 select-none"
              title="Click here to install PlateSync"
            >
              {/* Upward triangular arrow pointing directly at the download icon */}
              <div className="flex justify-end sm:justify-center pr-3 sm:pr-0 -mb-[1px]">
                <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-neon-cyan drop-shadow-sm" />
              </div>
              
              {/* Badge bubble - Just 'Click here to install' without logo */}
              <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-[#22d3ee] text-slate-950 text-xs sm:text-[13px] font-black shadow-[0_10px_25px_-5px_rgba(53,217,232,0.6),0_0_15px_rgba(53,217,232,0.4)] flex items-center gap-2 border-2 border-white/60 tracking-tight whitespace-nowrap hover:scale-105 transition active:scale-95">
                <span className="font-black text-slate-950">Click here to install</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInstallPromptBubble(false);
                  }}
                  className="ml-1 p-0.5 hover:bg-black/25 rounded-full transition text-slate-950"
                  aria-label="Dismiss install tip"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* English <-> Hindi Live Translation Button (Directly Left to KG) */}
        <button
          type="button"
          onClick={handleToggleLanguage}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 shadow-sm cursor-pointer ${
            currentLang.code === 'hi'
              ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
              : 'border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-200 hover:text-white'
          }`}
          title={currentLang.code === 'hi' ? 'Switch website back to English' : 'पूरे ऐप को हिंदी में बदलें (Translate whole website to Hindi)'}
          aria-label="Toggle language between English and Hindi"
        >
          <Globe className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
          <span className="text-xs">{currentLang.code === 'hi' ? '🇮🇳 हिन्दी' : '🇺🇸 EN'}</span>
          <span className="hidden md:inline text-[10px] text-slate-400 font-normal">
            {currentLang.code === 'hi' ? '→ EN' : '→ हिन्दी'}
          </span>
        </button>

        {/* Global Unit Switcher */}
        <button
          onClick={togglePreferredUnit}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-200 text-xs font-bold font-mono transition"
          title="Toggle Global Preferred Unit (KG / LBS)"
        >
          <Scale className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{currentUnit}</span>
        </button>

        {/* Feedback Button */}
        <button
          type="button"
          onClick={onOpenFeedback || (() => window.dispatchEvent(new CustomEvent('platesync_open_feedback')))}
          className="shrink-0 p-2 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan transition"
          title="Send Feedback or Report Bug"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        {/* Switch to Admin Portal (Available ONLY if logged in using admin email) */}
        {isAdminUser && (
          <button
            type="button"
            onClick={onOpenAdmin || (() => window.dispatchEvent(new CustomEvent('platesync_open_admin')))}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold transition active:scale-95 shadow-sm shadow-amber-500/10"
            title="Switch to Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>
        )}

        {/* User Avatar */}
        <button
          onClick={() => {
            if (!currentUser) {
              if (onOpenAuth) onOpenAuth();
            } else {
              setActiveTab('profile');
            }
          }}
          className="shrink-0 w-8 h-8 rounded-full border border-midnight-border bg-midnight-elevated p-0.5 hover:border-neon-cyan transition flex items-center justify-center"
          title={currentUser ? "Open Profile" : "Sign In to create profile"}
        >
          {currentUser ? (
            <img
              src={
                userProfile?.profileImage ||
                currentUser?.photoURL ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.name || 'athlete'}`
              }
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* PWA Step-by-Step Installation Modal */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isStandalone={isStandalone}
        isIOS={isIOS}
        isAndroid={isAndroid}
        hasNativePrompt={hasNativePrompt}
        onPromptInstall={handleInstallClick}
      />
    </header>
  );
};
