import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Activity,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { getPrimaryAdminEmail } from '../../utils/adminSecurity';
import { AdminDashboardTab } from './tabs/AdminDashboardTab';
import { AdminLiveUsersTab } from './tabs/AdminLiveUsersTab';
import { AdminUsersTab } from './tabs/AdminUsersTab';
import { AdminFeedbackTab } from './tabs/AdminFeedbackTab';
import { AdminAnalyticsTab } from './tabs/AdminAnalyticsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminLogsTab } from './tabs/AdminLogsTab';

const normalizeTab = (raw) => {
  if (!raw) return 'dashboard';
  const cleaned = raw.toLowerCase().trim();
  if (cleaned === 'overview' || cleaned === 'platform' || cleaned === 'platform-overview') return 'dashboard';
  return cleaned;
};

export const AdminLayout = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#admin/')) {
          const tabPart = hash.replace('#admin/', '').trim();
          if (tabPart) return normalizeTab(tabPart);
        }
        const saved = localStorage.getItem('platesync_admin_active_tab');
        if (saved) return normalizeTab(saved);
      }
    } catch (e) {}
    return 'dashboard';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { adminSession, isOwner, logoutAdminAccount } = useAdmin();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'liveUsers', label: 'Live Active Users', icon: Activity, badge: 'Live' },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'feedback', label: 'Feedback & Reports', icon: MessageSquare },
    { id: 'analytics', label: 'Training Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
    { id: 'logs', label: 'Security Audit Logs', icon: FileText }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
    try {
      localStorage.setItem('platesync_admin_active_tab', tabId);
      window.location.hash = `admin/${tabId}`;
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row relative">

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-midnight-card border-b border-midnight-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-midnight-bg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-black text-sm text-white">PlateSync Admin</span>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-2.5 py-1 text-xs font-bold text-neon-cyan border border-neon-cyan/30 rounded-xl bg-neon-cyan/10"
          >
            App
          </button>
        )}
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-midnight-card border-r border-midnight-border z-50 flex flex-col justify-between transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header */}
        <div className="p-5 border-b border-midnight-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-midnight-card rounded-[13px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                Plate<span className="text-neon-cyan">Sync</span>
              </span>
              <span className="text-[10px] text-amber-300/90 font-mono font-bold block uppercase tracking-wider">
                Platform Administrator
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition active:scale-[0.98] ${isActive
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/10 text-neon-cyan border border-neon-cyan/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-midnight-elevated border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neon-cyan' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-neon-cyan" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Identity & Logout */}
        <div className="p-4 border-t border-midnight-border space-y-2 bg-midnight-elevated/20">
          <div className="p-2.5 rounded-xl bg-midnight-bg border border-midnight-border flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white truncate font-mono">
                {adminSession?.email || getPrimaryAdminEmail()}
              </p>
              <p className="text-[9.5px] text-neon-success flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-success animate-pulse" />
                Verified Admin Session
              </p>
            </div>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="w-full py-2 px-3 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Return to Athlete App</span>
            </button>
          )}

          <button
            onClick={logoutAdminAccount}
            className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-midnight-card/80 backdrop-blur-md border-b border-midnight-border sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Section:</span>
            <span className="px-3 py-1 rounded-xl bg-midnight-bg border border-midnight-border text-xs font-black text-white">
              {NAV_ITEMS.find(i => i.id === (activeTab === 'overview' ? 'dashboard' : activeTab))?.label || 'Platform Overview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-white text-xs font-bold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-neon-cyan" />
                <span>Return to App</span>
              </button>
            )}

            <button
              onClick={logoutAdminAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {(activeTab === 'dashboard' || activeTab === 'overview' || !NAV_ITEMS.some(i => i.id === activeTab)) && (
            <AdminDashboardTab onNavigateTab={handleSelectTab} />
          )}
          {activeTab === 'liveUsers' && <AdminLiveUsersTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'feedback' && <AdminFeedbackTab />}
          {activeTab === 'analytics' && <AdminAnalyticsTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
          {activeTab === 'logs' && <AdminLogsTab />}
        </main>

        <footer className="py-4 text-center border-t border-midnight-border/60 text-[10.5px] text-slate-500 font-mono">
          PlateSync Operations Command • Verified Session • Cloud Firestore Sync
        </footer>
      </div>

    </div>
  );
};
