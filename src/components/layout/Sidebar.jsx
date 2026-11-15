import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Dumbbell, 
  BookOpen,
  Calendar,
  History, 
  TrendingUp, 
  Trophy,
  User, 
  Settings, 
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Lock,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calculator', label: 'Weight Calculator', icon: Calculator, badge: 'Core' },
  { id: 'tracker', label: 'Workout Tracker', icon: Dumbbell },
  { id: 'planner', label: 'Weekly Planner', icon: Calendar, badge: '7-Day' },
  { id: 'library', label: 'Exercise Library', icon: BookOpen },
  { id: 'history', label: 'Workout History', icon: History },
  { id: 'analytics', label: 'Progress & Analytics', icon: TrendingUp },
  { id: 'records', label: 'Personal Records', icon: Trophy, badge: 'PRs' },
  { id: 'bodyweight', label: 'Body Weight', icon: Scale, badge: 'Track' },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, collapsed, setCollapsed, onOpenAuth }) => {
  const { currentUser, userProfile, logout, isDemoMode, isFirebaseReady, demoAccessMode, toggleDemoAccessMode, isDevTester, toggleDevTester } = useAuth();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoAction = () => {
    if (collapsed) {
      setCollapsed(false);
      return;
    }
    // Secret 5-click toggle for developer/tester mode
    const count = logoClicks + 1;
    if (count >= 5) {
      toggleDevTester();
      setLogoClicks(0);
    } else {
      setLogoClicks(count);
      setTimeout(() => setLogoClicks(0), 3000);
    }
    handleSelectTab('dashboard');
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-midnight-bg/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-midnight-secondary border-r border-midnight-border flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          collapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top: Logo & Collapse Button */}
        <div className={`border-b border-midnight-border transition-all duration-200 shrink-0 ${
            collapsed ? 'p-3 flex flex-col items-center gap-2.5' : 'p-4 md:p-5 flex items-center justify-between'
          }`}>
            <button
              type="button"
              onClick={handleLogoAction}
              className={`flex items-center text-left group focus:outline-none rounded-xl transition ${
                collapsed 
                  ? 'justify-center cursor-pointer hover:scale-105 p-1' 
                  : 'gap-3 min-w-0 cursor-pointer'
              }`}
              title={collapsed ? 'Click logo to expand sidebar' : 'PlateSync - Dashboard'}
              aria-label={collapsed ? 'Expand sidebar' : 'PlateSync'}
            >
              <div className="relative p-0.5 rounded-xl bg-gradient-to-tr from-neon-cyan via-neon-violet to-neon-cyan shadow-glow-cyan shrink-0 group-hover:shadow-[0_0_15px_rgba(53,217,232,0.6)] transition-all">
                <div className="w-9 h-9 bg-midnight-card rounded-[10px] flex items-center justify-center p-1.5">
                  <img src="/logo.svg" alt="PlateSync" className="w-full h-full object-contain" />
                </div>
              </div>

              {!collapsed && (
                <div className="min-w-0 animate-in fade-in">
                  <h1 className="text-base font-black text-white tracking-tight leading-none">
                    Plate<span className="text-neon-cyan">Sync</span>
                  </h1>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Smart Workout Platform
                  </span>
                </div>
              )}
            </button>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:flex p-1.5 rounded-lg transition focus:outline-none ${
                collapsed 
                  ? 'text-neon-cyan hover:bg-midnight-elevated hover:text-white bg-midnight-card border border-midnight-border shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-midnight-elevated'
              }`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </div>

        {/* Scrollable Center: Navigation Links + Body Weight Tracker */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-3">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = (!currentUser || (isDemoMode && demoAccessMode === 'calculator-only')) && item.id !== 'calculator';

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={collapsed ? (isLocked ? `${item.label} (Demo Locked)` : item.label) : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-neon-cyan text-slate-950 font-bold shadow-lg shadow-neon-cyan/20'
                      : isLocked
                        ? 'text-slate-500 hover:text-slate-300 hover:bg-midnight-card/50'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-midnight-card'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-slate-950' : isLocked ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-neon-cyan group-hover:scale-110'}`} />
                    {!collapsed && <span className={`truncate ${isLocked ? 'text-slate-400 font-normal' : ''}`}>{item.label}</span>}
                  </div>

                  {!collapsed && (
                    isLocked ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-midnight-bg text-slate-500 border border-midnight-border flex items-center gap-0.5" title="Sign in to unlock">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Lock</span>
                      </span>
                    ) : item.badge ? (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-midnight-elevated text-neon-cyan border border-neon-cyan/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Session Controls */}
        <div className="p-3 border-t border-midnight-border space-y-3">
          {/* Status Chip */}
          {!collapsed && (
            <div className="p-2.5 rounded-xl bg-midnight-card border border-midnight-border text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-neon-cyan shadow-glow-cyan' : isFirebaseReady ? 'bg-neon-success' : 'bg-neon-warning'}`} />
                  <span className="text-slate-300 font-bold">
                    {isDemoMode ? (demoAccessMode === 'calculator-only' ? 'Demo (Calculator)' : 'Demo (Full Access)') : isFirebaseReady ? 'Firebase Cloud' : 'Local Sandbox'}
                  </span>
                </div>
                {isDemoMode && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 font-bold">
                    DEMO
                  </span>
                )}
              </div>

              {/* Developer Toggle: Only rendered when dev mode is active */}
              {isDemoMode && isDevTester && (
                <button
                  type="button"
                  onClick={toggleDemoAccessMode}
                  className="w-full py-1 px-2 rounded-lg bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-[10px] text-slate-300 hover:text-white transition font-mono"
                  title="Toggle full access for testing updates"
                >
                  {demoAccessMode === 'calculator-only' ? 'Testing? Unlock All Tabs' : 'Lock to Calculator Only'}
                </button>
              )}
            </div>
          )}

          {/* User Row or Guest Sign In */}
          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className={`w-full py-2.5 px-3 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs flex items-center ${collapsed ? 'justify-center' : 'justify-center gap-2'} transition shadow-lg shadow-neon-cyan/25 active:scale-95`}
              title="Sign In or Register"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign In / Register</span>}
            </button>
          ) : (
            <div className={`flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'} pt-1`}>
              <div
                onClick={() => handleSelectTab('profile')}
                title={collapsed ? (userProfile?.name || 'Athlete Profile') : undefined}
                className={`flex items-center gap-2.5 cursor-pointer group ${collapsed ? '' : 'flex-1 min-w-0 mr-1'}`}
              >
                <img
                  src={
                    userProfile?.profileImage ||
                    currentUser?.photoURL ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.name || 'athlete'}`
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-midnight-border bg-midnight-card object-cover shrink-0 group-hover:border-neon-cyan transition"
                />
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-neon-cyan transition">
                      {userProfile?.name || currentUser?.displayName || 'Athlete'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                      {currentUser?.email || 'Logged In'}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-neon-error hover:bg-neon-error/10 rounded-xl transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
