import React from 'react';
import { 
  Lock, 
  Calculator, 
  ArrowRight, 
  LogIn,
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DemoRestrictedView = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { currentUser, logout, toggleDemoAccessMode, demoAccessMode, isDevTester } = useAuth();

  const getTabName = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'tracker': return 'Workout Tracker & Set Logger';
      case 'planner': return 'Weekly Workout Planner';
      case 'library': return 'Exercise Library & Programs';
      case 'history': return 'Workout History & Logs';
      case 'analytics': return 'Progress & Performance Analytics';
      case 'records': return 'Personal Records & Milestones';
      case 'profile': return 'Athlete Profile';
      case 'settings': return 'Platform Settings';
      default: return 'Feature';
    }
  };

  const isGuest = !currentUser;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-8 relative overflow-hidden shadow-2xl text-center space-y-6">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-violet/5 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-midnight-bg border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mx-auto shadow-lg shadow-neon-cyan/10">
          <Lock className="w-8 h-8" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold font-mono">
            <span>{isGuest ? 'Athlete Account Required' : 'Demo Account • Weight Calculator Access Only'}</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {getTabName()} is Locked
          </h2>

          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {isGuest 
              ? `Sign in or create a free athlete account to access ${getTabName()}, record custom workouts, and save your Personal Records.`
              : 'The Demo Account provides unrestricted access to the Smart Weight Calculator, plate racks, 45° leg press, and auto plate solver.'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isGuest
              ? 'Our Smart Barbell Calculator is 100% free and open for everyone. Create a free account anytime to unlock all features.'
              : 'To track live sets, save exercise histories, and analyze performance records, please create a free account or sign in.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenAuth || logout}
            className="w-full sm:w-auto px-6 py-3 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-neon-cyan/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In or Register</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className="w-full sm:w-auto px-6 py-3 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-200 hover:text-white font-bold text-xs rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-neon-cyan" />
            <span>Return to Weight Calculator</span>
          </button>
        </div>

        {/* Developer / Update Verification Section (Only visible when developer mode is active) */}
        {!isGuest && isDevTester && (
          <div className="pt-6 border-t border-midnight-border/80 text-center animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-midnight-bg/60 border border-dashed border-midnight-border flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                  Testing Application Updates?
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Unlock all tabs and features in this demo account to inspect and verify updates.
                </span>
              </div>

              <button
                type="button"
                onClick={toggleDemoAccessMode}
                className="px-3.5 py-1.5 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 text-xs font-bold transition shrink-0 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{demoAccessMode === 'calculator-only' ? 'Unlock All Tabs' : 'Lock to Calc'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
