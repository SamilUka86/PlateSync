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
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../pwa/PWAInstallModal';

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

  const currentUnit = userProfile?.preferredUnit || 'KG';

  const togglePreferredUnit = () => {
    const nextUnit = currentUnit === 'KG' ? 'LB' : 'KG';
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
          onClick={handleInstallClick}
          className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 shadow-sm ${
            isStandalone
              ? 'border-neon-success/30 bg-neon-success/10 text-neon-success cursor-default'
              : 'border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-neon-cyan/10'
          }`}
          title={isStandalone ? "PlateSync is running in installed app mode" : "Install PlateSync Progressive Web App"}
        >
          {isStandalone ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-neon-success" />
          ) : (
            <Download className="w-3.5 h-3.5 text-neon-cyan" />
          )}
          <span className="hidden sm:inline">{buttonLabel}</span>
        </button>

        {/* Global Unit Switcher */}
        <button
          onClick={togglePreferredUnit}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-200 text-xs font-bold font-mono transition"
          title="Toggle Global Preferred Unit (KG / LB)"
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
        isIOS={isIOS}
        isAndroid={isAndroid}
        hasNativePrompt={hasNativePrompt}
        onPromptInstall={handleInstallClick}
      />
    </header>
  );
};
