import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Flame, 
  Scale, 
  Shield, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Check,
  Vibrate,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FirebaseSetupModal } from '../../components/auth/FirebaseSetupModal';
import { isFirebaseConfigured } from '../../services/firebase/config';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { trigger5SecVibration, stopVibration } from '../../utils/audioHaptics';

export const SettingsPage = () => {
  const { currentUser, userProfile, updateProfile, logout, isDemoMode, loginAsDemo } = useAuth();
  const { addNotification } = useNotification();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const handleUnitToggle = (unit) => {
    updateProfile({ preferredUnit: unit });
    addNotification(`Global preferred unit set to ${unit}`, 'success');
  };

  const handleTest5SecVibration = () => {
    trigger5SecVibration();
    setIsVibrating(true);
    addNotification('Triggering 5-second vibration buzzer...', 'info');
    setTimeout(() => setIsVibrating(false), 5000);
  };

  const handleStopVibration = () => {
    stopVibration();
    setIsVibrating(false);
    addNotification('Vibration stopped', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-neon-cyan" />
          Platform Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage calculation standards, unit preferences, and cloud connectivity.
        </p>
      </div>

      {/* Cloud & Firebase Connection */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Firebase Authentication & Cloud Firestore
                {isFirebaseConfigured() ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-success/20 text-neon-success border border-neon-success/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-warning/20 text-neon-warning border border-neon-warning/30 font-semibold">
                    Keys Pending
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Powers cross-device profile, workout sync, and Google OAuth
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-neon-cyan text-xs font-bold rounded-xl transition"
          >
            Configure Keys
          </button>
        </div>
      </div>

      {/* Weight Unit Preferences */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-neon-cyan" />
          Unit Preferences
        </h3>
        <p className="text-xs text-slate-400">
          Choose your default unit for workout logging and plate calculations.
        </p>

        <div className="pt-1">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Active Preferred Unit
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => handleUnitToggle('KG')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${
                userProfile?.preferredUnit === 'KG'
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white'
              }`}
            >
              Metric (KG)
            </button>
            <button
              onClick={() => handleUnitToggle('LBS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${
                (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS')
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white'
              }`}
            >
              Imperial (LBS)
            </button>
          </div>
        </div>
      </div>

      {/* Phone Haptics & Rest Timer Vibration (5 Seconds) */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-neon-cyan" />
              Phone Vibration & Rest Timer Haptics
            </h3>
            <p className="text-xs text-slate-400">
              Vibration duration is configured for up to 5 full seconds of pulsating buzzer for maximum awareness on the gym floor.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-mono font-bold shrink-0">
            5s Buzzer Active
          </span>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTest5SecVibration}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 ${
              isVibrating
                ? 'bg-neon-cyan text-slate-950 animate-pulse shadow-lg shadow-neon-cyan/30'
                : 'bg-neon-cyan/15 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 border border-neon-cyan/30'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>{isVibrating ? 'Vibrating (5s)...' : 'Test 5-Second Vibration'}</span>
          </button>

          {isVibrating && (
            <button
              type="button"
              onClick={handleStopVibration}
              className="px-4 py-2.5 rounded-xl bg-midnight-bg hover:bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold transition"
            >
              Stop Vibration
            </button>
          )}
        </div>
      </div>

      {/* Account Management & Logout */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon-cyan" />
          Account & Session Control
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">
              Signed in as {currentUser?.email || userProfile?.name || 'Athlete'}
            </p>
            <p className="text-[11px] text-slate-500">
              {isDemoMode ? 'Using Local Demo Athlete Session' : 'Secured with Firebase Session Persistence'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-midnight-elevated hover:bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold"
              >
                Exit Demo Account
              </button>
            ) : (
              <button
                onClick={loginAsDemo}
                className="flex items-center gap-1.5 px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Switch to Demo Mode
              </button>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-neon-error hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-neon-error/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Firebase Setup Modal */}
      <FirebaseSetupModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />

    </div>
  );
};
