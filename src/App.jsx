import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthPage } from './pages/auth/AuthPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DemoRestrictedView } from './components/layout/DemoRestrictedView';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CalculatorPage } from './pages/calculator/CalculatorPage';
import { WorkoutTrackerPage } from './pages/workout/WorkoutTrackerPage';
import { WeeklyPlannerPage } from './pages/planner/WeeklyPlannerPage';
import { ExerciseLibraryPage } from './pages/library/ExerciseLibraryPage';
import { WorkoutHistoryPage } from './pages/history/WorkoutHistoryPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { PersonalRecordsPage } from './pages/records/PersonalRecordsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';

import { 
  LayoutDashboard, 
  Calculator, 
  Dumbbell, 
  BookOpen,
  Calendar,
  Trophy,
  Lock
} from 'lucide-react';

const MainAppLayout = () => {
  const { currentUser, loading, isDemoMode, demoAccessMode } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  // Persist activeTab across browser page reloads
  useEffect(() => {
    try {
      if (activeTab) {
        localStorage.setItem('platesync_active_tab', activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

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
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {isTabLocked ? (
            <DemoRestrictedView 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onOpenAuth={() => setShowAuthModal(true)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
              {activeTab === 'calculator' && <CalculatorPage setActiveTab={setActiveTab} />}
              {activeTab === 'tracker' && <WorkoutTrackerPage setActiveTab={setActiveTab} />}
              {activeTab === 'planner' && <WeeklyPlannerPage setActiveTab={setActiveTab} />}
              {activeTab === 'library' && <ExerciseLibraryPage setActiveTab={setActiveTab} />}
              {activeTab === 'history' && <WorkoutHistoryPage setActiveTab={setActiveTab} />}
              {activeTab === 'analytics' && <AnalyticsPage setActiveTab={setActiveTab} />}
              {activeTab === 'records' && <PersonalRecordsPage setActiveTab={setActiveTab} />}
              {activeTab === 'profile' && <ProfilePage setActiveTab={setActiveTab} />}
              {activeTab === 'settings' && <SettingsPage setActiveTab={setActiveTab} />}
            </>
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-bg/95 backdrop-blur-xl animate-in fade-in">
          <AuthPage onClose={() => setShowAuthModal(false)} />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-midnight-card/95 border-t border-midnight-border px-3 py-2 flex items-center justify-around backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('dashboard')}
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
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeTab === 'calculator' ? 'text-neon-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] font-medium">Calc</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
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
          onClick={() => setActiveTab('library')}
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
          onClick={() => setActiveTab('planner')}
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
        <WorkoutProvider>
          <MainAppLayout />
        </WorkoutProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
