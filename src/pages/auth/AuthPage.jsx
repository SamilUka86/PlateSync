import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  X,
  AlertCircle,
  Settings,
  ShieldCheck,
  Check,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { FirebaseSetupModal } from '../../components/auth/FirebaseSetupModal';
import { Footer } from '../../components/layout/Footer';

export const AuthPage = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { loginGoogle, loginEmail, registerEmail, loginAsDemo, isFirebaseReady, isDevTester } = useAuth();
  const { addNotification } = useNotification();

  // Load remembered email
  useEffect(() => {
    const saved = localStorage.getItem('platesync_remembered_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return false;
    }
    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage('Please provide your full athlete name.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify both fields.');
        return false;
      }
      if (!acceptTerms) {
        setErrorMessage('You must accept the terms & conditions to create an account.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrorMessage('');

    if (rememberMe) {
      localStorage.setItem('platesync_remembered_email', email.trim());
    } else {
      localStorage.removeItem('platesync_remembered_email');
    }

    try {
      if (isSignUp) {
        await registerEmail(email.trim(), password, name.trim());
        addNotification('Athlete account registered successfully! Welcome to PlateSync.', 'success');
      } else {
        await loginEmail(email.trim(), password);
        addNotification('Welcome back to PlateSync!', 'success');
      }
      if (onClose) onClose();
    } catch (err) {
      console.error('Auth submit error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.message === 'FIREBASE_NOT_CONFIGURED') {
        msg = 'Sign-in service is temporarily connecting. Please try again or explore with the Demo Account.';
        if (isDevTester) setShowConfigModal(true);
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setErrorMessage('');

    try {
      await loginGoogle();
      addNotification('Signed in with Google successfully!', 'success');
      if (onClose) onClose();
    } catch (err) {
      let msg = 'Google authentication encountered an issue.';
      if (err.message === 'FIREBASE_NOT_CONFIGURED') {
        msg = 'Google authentication is currently connecting. Please try again or use Demo Account.';
        if (isDevTester) setShowConfigModal(true);
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completion.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'Popup blocked by browser. Please enable popups or retry.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-bg text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Subtle Midnight Neon Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-midnight-border bg-midnight-secondary/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-neon-cyan via-neon-violet to-neon-cyan shadow-glow-cyan">
            <div className="w-10 h-10 bg-midnight-card rounded-[14px] flex items-center justify-center p-1.5">
              <img src="/logo.svg" alt="PlateSync Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Plate<span className="text-neon-cyan">Sync</span>
            </span>
            <p className="hidden sm:block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Smart Barbell & Mixed-Unit System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-white transition text-xs font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="hidden sm:inline">Back to Calculator</span>
            </button>
          )}

          {isDevTester && (
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card text-slate-300 hover:text-white hover:border-neon-cyan/40 transition text-xs font-medium"
              title="Configure Firebase Keys & Google OAuth"
            >
              <Settings className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="hidden sm:inline">Firebase Setup</span>
              <span className={`w-2 h-2 rounded-full ${isFirebaseReady ? 'bg-neon-success' : 'bg-neon-warning animate-pulse'}`} />
            </button>
          )}

          <button
            onClick={() => {
              loginAsDemo();
              if (onClose) onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan transition text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
            Try Demo Account
          </button>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl shadow-card p-6 md:p-8 backdrop-blur-xl relative">
          
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-midnight-elevated rounded-xl transition"
              title="Return to Calculator"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 p-0.5 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-violet shadow-glow-cyan">
              <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center p-2">
                <img src="/logo.svg" alt="PlateSync Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp 
                ? 'Join PlateSync to calculate mixed KG & LB barbell loads with scientific precision'
                : 'Sign in to access your workout tracker, history, and plate setups'
              }
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-midnight-bg rounded-xl border border-midnight-border mb-5">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp 
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp 
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-neon-error shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google Sign-In Button (Dark Elevated Card) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting}
            className="w-full py-2.5 px-4 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1e2d4d] text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-3 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {googleSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isSignUp ? 'Sign up with Google' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-midnight-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-midnight-card px-3 text-slate-500 font-semibold text-[10px] tracking-wider">
                Or with email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Thorne"
                    className="w-full pl-9 pr-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-neon-cyan hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-10 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me / Terms Checkbox */}
            {!isSignUp ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-midnight-border bg-midnight-bg text-neon-cyan focus:ring-neon-cyan focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none cursor-pointer">
                  Remember me on this device
                </label>
              </div>
            ) : (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-midnight-border bg-midnight-bg text-neon-cyan focus:ring-neon-cyan focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="acceptTerms" className="text-xs text-slate-400 select-none cursor-pointer leading-tight">
                  I agree to the <span className="text-neon-cyan">Terms of Service</span> and <span className="text-neon-cyan">Privacy Policy</span>
                </label>
              </div>
            )}

            {/* Primary Login / Signup Button in Cyan */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 py-2.5 px-4 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Athlete Account' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Option Footer */}
          <div className="mt-5 pt-4 border-t border-midnight-border text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Don't want to sign in? Try without an account
            </p>
            <button
              type="button"
              onClick={() => {
                loginAsDemo('calculator-only');
                if (onClose) onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-neon-cyan/5"
            >
              <Calculator className="w-4 h-4 text-neon-cyan" />
              <span>Use Demo Account (Weight Calculator)</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono">
              Direct access to plate visualizer & auto solver without signing in
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        defaultEmail={email}
      />

      {isDevTester && (
        <FirebaseSetupModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};
