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
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../pwa/PWAInstallModal';
import { 
  SUPPORTED_LANGUAGES, 
  getCurrentLanguage, 
  changeWebsiteLanguage 
} from '../../services/translation/websiteTranslator';

export const Header = ({ activeTab, setActiveTab, onOpenMobileMenu, collapsed, setCollapsed, onOpenAuth }) => {
  const { currentUser, userProfile, updateProfile, isDemoMode, isDevTester, demoAccessMode, toggleDemoAccessMode, logout } = useAuth();
  const { addNotification } = useNotification();

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

  // Global Website Language Translation State
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleSelectLanguage = (lang) => {
    setIsLangMenuOpen(false);
    setCurrentLang(lang);
    addNotification(
      lang.code === 'en' 
        ? 'Restored English original language' 
        : `Translating whole website to ${lang.name} (${lang.nativeName})...`,
      'info'
    );
    changeWebsiteLanguage(lang.code);
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

  return (
    <header className="sticky top-0 z-30 h-16 bg-midnight-bg/85 backdrop-blur-md border-b border-midnight-border px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile menu & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-xl lg:hidden hover:bg-midnight-card transition"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-neon-cyan hover:text-white text-xs font-semibold transition"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
            <span>Open Menu</span>
          </button>
        )}

        <div>
          <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="hidden md:block text-[11px] text-slate-400 font-mono">
            Smart Barbell &bull; Mixed-Unit Weight Tracking
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2.5">
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

        {/* PWA Install Button */}
        <button
          type="button"
          onClick={handleInstallClick}
          className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm ${
            isStandalone
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400 shadow-emerald-500/10'
              : 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-slate-950 hover:shadow-neon-cyan/25 shadow-neon-cyan/10'
          }`}
          title={isStandalone ? "PlateSync is running in installed app mode (Click for details)" : "Install PlateSync Progressive Web App (iOS, Android, Desktop)"}
        >
          {isStandalone ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Download className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="text-xs font-bold">{buttonLabel}</span>
        </button>

        {/* Global Website Translation Button (Left to KG) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(prev => !prev)}
            className="shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-200 text-xs font-bold transition active:scale-95 shadow-sm"
            title="Translate website / entire app to any language"
            aria-label="Translate whole website"
          >
            <Globe className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="text-[13px] leading-none shrink-0">{currentLang.flag}</span>
            <span className="hidden sm:inline font-mono text-xs">{currentLang.shortCode || currentLang.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Full-screen Backdrop for click-outside */}
          {isLangMenuOpen && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsLangMenuOpen(false)} 
            />
          )}

          {/* Dropdown Menu */}
          {isLangMenuOpen && (
            <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-midnight-card/95 backdrop-blur-xl border border-midnight-border shadow-2xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-midnight-border">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-neon-cyan" />
                  <span className="text-xs font-bold text-white">Translate Website</span>
                </div>
                {currentLang.code !== 'en' && (
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage(SUPPORTED_LANGUAGES[0])}
                    className="text-[10px] text-neon-cyan hover:underline font-semibold"
                  >
                    Reset (EN)
                  </button>
                )}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                  autoFocus
                />
              </div>

              {/* Language list */}
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {SUPPORTED_LANGUAGES.filter(l => 
                  !langSearch || 
                  l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
                  l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
                  l.code.toLowerCase().includes(langSearch.toLowerCase())
                ).map(lang => {
                  const isSelected = lang.code === currentLang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition text-left ${
                        isSelected 
                          ? 'bg-neon-cyan/15 text-neon-cyan font-bold border border-neon-cyan/30' 
                          : 'text-slate-300 hover:bg-midnight-elevated hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <div className="min-w-0 truncate">
                          <span className="block truncate font-medium text-white text-xs">{lang.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{lang.nativeName}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-neon-cyan shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-midnight-border text-center">
                <p className="text-[10px] text-slate-400">
                  Translates all pages & components across PlateSync
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Global Unit Switcher */}
        <button
          onClick={togglePreferredUnit}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-200 text-xs font-bold font-mono transition"
          title="Toggle Global Preferred Unit (KG / LBS)"
        >
          <Scale className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{currentUnit}</span>
        </button>

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
