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
  Volume2,
  Globe,
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useNotification } from '../../context/NotificationContext';
import { FirebaseSetupModal } from '../../components/auth/FirebaseSetupModal';
import { isFirebaseConfigured } from '../../services/firebase/config';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { 
  getBuzzerDuration, 
  setBuzzerDuration, 
  triggerConfiguredBuzzer, 
  stopVibration 
} from '../../utils/audioHaptics';
import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  changeWebsiteLanguage
} from '../../services/translation/websiteTranslator';

export const SettingsPage = ({ onOpenFeedback, onOpenAdmin }) => {
  const { currentUser, userProfile, updateProfile, logout, isDemoMode, loginAsDemo } = useAuth();
  const { isAdmin, adminSession } = useAdmin();
  const { addNotification } = useNotification();

  // Switch to admin portal & admin features available strictly ONLY if logged-in user email is platesync86@gmail.com
  const isAdminUser = Boolean(
    currentUser &&
    !isDemoMode &&
    (currentUser.email?.toLowerCase() === 'platesync86@gmail.com' ||
     currentUser.email?.toLowerCase() === 'samilplatesync@gmail.com')
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [buzzerDuration, setBuzzerDurationState] = useState(() => getBuzzerDuration());
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    setBuzzerDurationState(getBuzzerDuration());
  }, []);

  const handleBuzzerDurationChange = (seconds) => {
    const val = setBuzzerDuration(seconds);
    setBuzzerDurationState(val);
    updateProfile({ buzzerDuration: val });
    addNotification(`Rest timer buzzer & vibration set to ${val} seconds`, 'success');
  };

  const handleTestBuzzer = () => {
    triggerConfiguredBuzzer(buzzerDuration);
    setIsVibrating(true);
    addNotification(`Triggering ${buzzerDuration}-second buzzer & vibration...`, 'info');
    setTimeout(() => setIsVibrating(false), buzzerDuration * 1000);
  };

  const handleStopVibration = () => {
    stopVibration();
    setIsVibrating(false);
    addNotification('Buzzer & vibration stopped', 'info');
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
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${userProfile?.preferredUnit === 'KG'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white'
                }`}
            >
              Metric (KG)
            </button>
            <button
              onClick={() => handleUnitToggle('LBS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition ${(userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS')
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white'
                }`}
            >
              Imperial (LBS)
            </button>
          </div>
        </div>
      </div>

      {/* Website Language Translation */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-neon-cyan" />
            Website Language &amp; Translation (English &bull; हिन्दी)
          </h3>
          <p className="text-xs text-slate-400">
            Switch the entire application and website between English and Hindi.
          </p>
        </div>

        <div className="pt-1">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Active Language
          </label>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isSelected
                      ? 'bg-neon-cyan text-slate-950 font-black shadow-md shadow-neon-cyan/20'
                      : 'bg-midnight-bg border border-midnight-border text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name} ({lang.nativeName})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User-Configurable Rest Timer Buzzer & Phone Vibration Duration */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-neon-cyan" />
              Rest Timer Buzzer &amp; Phone Vibration Time
            </h3>
            <p className="text-xs text-slate-400">
              Customize the exact duration you want the audible buzzer and device vibration to pulse when your rest timer finishes.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-mono font-bold shrink-0 self-start sm:self-auto">
            {buzzerDuration}s Buzzer Active
          </span>
        </div>

        {/* Preset Duration Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Preset Duration (Seconds)
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 5, 8, 10, 15].map((sec) => {
              const isSelected = buzzerDuration === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleBuzzerDurationChange(sec)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95 ${
                    isSelected
                      ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20 border border-neon-cyan'
                      : 'bg-midnight-bg border border-midnight-border text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {sec}s {sec === 5 && <span className="text-[10px] opacity-80">(Default)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Range Slider & Input */}
        <div className="bg-midnight-bg border border-midnight-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Fine-Tune Buzzer Time</span>
            <span className="font-mono text-neon-cyan font-bold">{buzzerDuration} Seconds</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={buzzerDuration}
              onChange={(e) => handleBuzzerDurationChange(Number(e.target.value))}
              className="w-full accent-[#35D9E8] h-2 bg-midnight-elevated rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="1"
              max="30"
              value={buzzerDuration}
              onChange={(e) => handleBuzzerDurationChange(Number(e.target.value))}
              className="w-16 px-2.5 py-1 bg-midnight-card border border-midnight-border rounded-lg text-white text-xs font-mono font-bold text-center focus:outline-none focus:border-neon-cyan"
            />
          </div>
        </div>

        {/* Test Buzzer & Vibration Controls */}
        <div className="pt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTestBuzzer}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer ${
              isVibrating
                ? 'bg-neon-cyan text-slate-950 animate-pulse shadow-lg shadow-neon-cyan/30'
                : 'bg-neon-cyan/15 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 border border-neon-cyan/30'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>{isVibrating ? `Buzzer Active (${buzzerDuration}s)...` : `Test ${buzzerDuration}-Second Buzzer & Vibration`}</span>
          </button>

          {isVibrating && (
            <button
              type="button"
              onClick={handleStopVibration}
              className="px-4 py-2.5 rounded-xl bg-midnight-bg hover:bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold transition cursor-pointer"
            >
              Stop Buzzer
            </button>
          )}
        </div>
      </div>

      {/* Athlete Feedback & Bug Reports */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neon-cyan" />
              Athlete Feedback & Issue Reporting
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Encountered a barbell load calculation glitch or have an idea for a new feature? Send a report directly to platform operations.
            </p>
          </div>

          <button
            onClick={onOpenFeedback || (() => window.dispatchEvent(new CustomEvent('platesync_open_feedback')))}
            className="px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Feedback / Report Bug</span>
          </button>
        </div>
      </div>

      {/* Switch to Admin Portal (Available ONLY if logged in using admin email) */}
      {isAdminUser && (
        <div className="bg-gradient-to-r from-midnight-card via-midnight-elevated to-midnight-card border border-amber-400/30 rounded-3xl p-6 space-y-3 shadow-lg shadow-amber-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  Administrator Portal Access
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 font-mono">
                  {currentUser?.email || 'platesync86@gmail.com'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                You are currently logged in with verified administrative credentials. You can switch to the Admin Portal at any time.
              </p>
            </div>

            <button
              onClick={onOpenAdmin || (() => window.dispatchEvent(new CustomEvent('platesync_open_admin')))}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition flex items-center gap-2 active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

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
