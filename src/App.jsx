import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AuthPage } from './pages/auth/AuthPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DemoRestrictedView } from './components/layout/DemoRestrictedView';

// Admin Suite Components
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { UserFeedbackModal } from './components/feedback/UserFeedbackModal';
import { getPlatformSettings } from './services/admin/adminDataService';
import { useUserActivityTracker } from './hooks/useUserActivityTracker';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CalculatorPage } from './pages/calculator/CalculatorPage';
import { WorkoutTrackerPage } from './pages/workout/WorkoutTrackerPage';
import { WeeklyPlannerPage } from './pages/planner/WeeklyPlannerPage';
import { ExerciseLibraryPage } from './pages/library/ExerciseLibraryPage';
import { WorkoutHistoryPage } from './pages/history/WorkoutHistoryPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { PersonalRecordsPage } from './pages/records/PersonalRecordsPage';
import { BodyWeightPage } from './pages/bodyweight/BodyWeightPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';

import { 
  LayoutDashboard, 
  Calculator, 
  Dumbbell, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Lock,
  AlertTriangle,
  Shield,
  Bell
} from 'lucide-react';

const MainAppLayout = () => {
  const { currentUser, loading, isDemoMode, demoAccessMode } = useAuth();
  const { isAdmin } = useAdmin();

  // Active user presence, session heartbeat & interaction monitoring
  useUserActivityTracker(currentUser);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [platformSettings, setPlatformSettings] = useState(null);

  // Dedicated Admin View Toggle (Activated by /admin, #admin, or admin portal button)
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const params = new URLSearchParams(window.location.search);
        return path.startsWith('/admin') || hash === '#admin' || params.get('view') === 'admin';
      }
    } catch (e) {}
    return false;
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const isDemo = localStorage.getItem('platesync_demo_active') === 'true';
      const mode = localStorage.getItem('platesync_demo_access_mode') || 'calculator-only';
      if (isDemo && mode === 'calculator-only') return 'calculator';

      const savedTab = localStorage.getItem('platesync_active_tab');
      if (savedTab) return savedTab;
    } catch (e) {}
    return 'calculator';
  });

  // Load platform settings (announcements & maintenance mode)
  useEffect(() => {
    getPlatformSettings().then(cfg => {
      if (cfg) setPlatformSettings(cfg);
    });
  }, []);

  // Listen to hash, URL, and custom events for admin navigation
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (path.startsWith('/admin') || hash === '#admin' || params.get('view') === 'admin') {
        setIsAdminViewOpen(true);
      }
    };

    const handleOpenAdminEvent = () => setIsAdminViewOpen(true);
    const handleOpenFeedbackEvent = () => setShowFeedbackModal(true);

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('platesync_open_admin', handleOpenAdminEvent);
    window.addEventListener('platesync_open_feedback', handleOpenFeedbackEvent);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('platesync_open_admin', handleOpenAdminEvent);
      window.removeEventListener('platesync_open_feedback', handleOpenFeedbackEvent);
    };
  }, []);

  // Persist activeTab across browser page reloads
  useEffect(() => {
    try {
      if (activeTab) {
        localStorage.setItem('platesync_active_tab', activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

  // Guaranteed scroll-to-top whenever activeTab changes (phone navigation / redirect)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timerId = setTimeout(scrollToTop, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [activeTab]);

  const handleSetActiveTab = (newTab) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    setActiveTab(newTab);
  };

  // If a guest user lands on 'dashboard', automatically direct them to 'calculator'
  useEffect(() => {
    if (!loading && !currentUser && !isDemoMode) {
      if (activeTab === 'dashboard') {
        setActiveTab('calculator');
      }
    }
  }, [currentUser, isDemoMode, loading, activeTab]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Admin View Active Route
  if (isAdminViewOpen) {
    if (isAdmin) {
      return (
        <AdminLayout
          onBackToApp={() => {
            setIsAdminViewOpen(false);
            if (window.location.hash === '#admin') window.location.hash = '';
          }}
        />
      );
    }
    return (
      <AdminLoginPage
        onBackToApp={() => {
          setIsAdminViewOpen(false);
          if (window.location.hash === '#admin') window.location.hash = '';
        }}
      />
    );
  }

  // Maintenance Mode (Blocks non-admin access if enabled in platform settings)
  if (platformSettings?.maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between items-center p-6 text-center relative overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="pt-8">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-violet p-0.5">
              <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center p-1.5">
                <img src="/logo.svg" alt="PlateSync Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="text-xl font-black text-white">Plate<span className="text-neon-cyan">Sync</span></span>
          </div>
        </div>

        <div className="max-w-md w-full bg-midnight-card border border-amber-400/30 rounded-3xl p-8 shadow-2xl relative my-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mb-2">
            System Maintenance in Progress
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {platformSettings.maintenanceMessage || 'PlateSync is undergoing brief scheduled maintenance. We will be back online shortly!'}
          </p>
          <div className="mt-6 pt-4 border-t border-midnight-border text-[11px] text-slate-500 font-mono">
            PlateSync High-Precision Barbell System
          </div>
        </div>

        <div className="pb-6">
          <button
            onClick={() => setIsAdminViewOpen(true)}
            className="text-[11px] text-slate-500 hover:text-amber-400 transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Access</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-bg flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-violet p-0.5 animate-pulse">
          <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center p-2">
            <img src="/logo.svg" alt="PlateSync Loading" className="w-full h-full object-contain animate-spin" />
          </div>
        </div>
        <p className="text-xs font-mono font-bold text-slate-400 tracking-wider">
          LOADING PLATESYNC...
        </p>
      </div>
    );
  }

  const isTabLocked = (!currentUser || (isDemoMode && demoAccessMode === 'calculator-only')) && activeTab !== 'calculator';

  return (
    <div className="min-h-screen bg-midnight-bg text-slate-100 flex flex-col">

      {/* Global Broadcast Announcement Banner (Controlled by Admin Settings) */}
      {platformSettings?.announcementActive && platformSettings?.announcementMessage && (
        <div className={`px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 border-b z-40 ${
          platformSettings.announcementType === 'alert' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
          platformSettings.announcementType === 'warning' ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' :
          platformSettings.announcementType === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
          'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30'
        }`}>
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span>{platformSettings.announcementMessage}</span>
        </div>
      )}

      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'} flex flex-col flex-1 pb-16 lg:pb-0`}>
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {isTabLocked ? (
            <DemoRestrictedView 
              activeTab={activeTab} 
              setActiveTab={handleSetActiveTab} 
              onOpenAuth={() => setShowAuthModal(true)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'calculator' && <CalculatorPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'tracker' && <WorkoutTrackerPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'planner' && <WeeklyPlannerPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'library' && <ExerciseLibraryPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'history' && <WorkoutHistoryPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'analytics' && <AnalyticsPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'records' && <PersonalRecordsPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'bodyweight' && <BodyWeightPage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'profile' && <ProfilePage setActiveTab={handleSetActiveTab} />}
              {activeTab === 'settings' && (
                <SettingsPage 
                  setActiveTab={handleSetActiveTab} 
                  onOpenFeedback={() => setShowFeedbackModal(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-bg/95 backdrop-blur-xl animate-in fade-in">
          <AuthPage 
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              handleSetActiveTab('dashboard');
            }}
            onActivateOwnerPortal={() => {
              setShowAuthModal(false);
              setIsAdminViewOpen(true);
            }}
          />
        </div>
      )}

      {/* User Feedback Modal */}
      <UserFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-midnight-card/95 border-t border-midnight-border px-3 py-2 flex items-center justify-around backdrop-blur-xl">
        <button
          onClick={() => handleSetActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-4 h-4" />
            {!currentUser && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-2 text-slate-500" />}
          </div>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => handleSetActiveTab('calculator')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'calculator' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] font-medium">Calc</span>
        </button>

        <button
          onClick={() => handleSetActiveTab('tracker')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'tracker' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Dumbbell className="w-4 h-4" />
            {!currentUser && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-2 text-slate-500" />}
          </div>
          <span className="text-[10px] font-medium">Workout</span>
        </button>

        <button
          onClick={() => handleSetActiveTab('library')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'library' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-4 h-4" />
            {!currentUser && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-2 text-slate-500" />}
          </div>
          <span className="text-[10px] font-medium">Library</span>
        </button>

        <button
          onClick={() => handleSetActiveTab('planner')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'planner' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Calendar className="w-4 h-4" />
            {!currentUser && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-2 text-slate-500" />}
          </div>
          <span className="text-[10px] font-medium">Planner</span>
        </button>
      </nav>
    </div>
  );
};

export function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AdminProvider>
          <WorkoutProvider>
            <MainAppLayout />
          </WorkoutProvider>
        </AdminProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
