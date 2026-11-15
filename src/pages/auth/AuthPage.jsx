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
  Shield,
  Check,
  Calculator,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useNotification } from '../../context/NotificationContext';
import { OWNER_EMAIL } from '../../services/admin/adminAuthService';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';
import { FirebaseSetupModal } from '../../components/auth/FirebaseSetupModal';
import { GoogleAuthSetupModal } from '../../components/auth/GoogleAuthSetupModal';
import { Footer } from '../../components/layout/Footer';

export const AuthPage = ({ onClose, onSuccess, onActivateOwnerPortal }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOwnerLogin, setIsOwnerLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time Name Validation
  const trimmedName = name.trim();
  const nameRegex = /^[a-zA-Z\s'.'-]{2,50}$/;
  const isNameLengthValid = trimmedName.length >= 2;
  const isNamePatternValid = nameRegex.test(trimmedName);
  const isNameValid = isNameLengthValid && isNamePatternValid;

  // Real-time Password Requirements (for Sign Up)
  const reqLength = password.length >= 8;
  const reqUpper = /[A-Z]/.test(password);
  const reqLower = /[a-z]/.test(password);
  const reqUpperLower = reqUpper && reqLower;
  const reqNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Password Strength Score (0 to 3)
  const strengthScore = (reqLength ? 1 : 0) + (reqUpperLower ? 1 : 0) + (reqNumberOrSymbol ? 1 : 0);
  const strengthLabel = 
    password.length === 0 ? '' : 
    strengthScore === 3 ? 'Strong' : 
    strengthScore === 2 ? 'Medium' : 'Weak';
  const strengthColor = 
    strengthScore === 3 ? 'bg-neon-success' : 
    strengthScore === 2 ? 'bg-amber-400' : 'bg-rose-500';
  const strengthTextColor = 
    strengthScore === 3 ? 'text-neon-success' : 
    strengthScore === 2 ? 'text-amber-400' : 'text-rose-400';

  // Password Confirmation State
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const { loginGoogle, loginEmail, registerEmail, loginAsDemo, isFirebaseReady, isDevTester } = useAuth();
  const { loginAdminAccount } = useAdmin();
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
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (isSignUp) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setErrorMessage('Please provide your full athlete name.');
        return false;
      }
      if (trimmedName.length < 2) {
        setErrorMessage('Full name must be at least 2 characters in length.');
        return false;
      }
      const nameRegex = /^[a-zA-Z\s'.'-]{2,50}$/;
      if (!nameRegex.test(trimmedName)) {
        setErrorMessage('Full name should contain letters, spaces, hyphens, or apostrophes only.');
        return false;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters in length.');
        return false;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        setErrorMessage('Password must include both uppercase and lowercase letters.');
        return false;
      }
      if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        setErrorMessage('Password must include at least one number (0-9) or special symbol.');
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
    } else {
      if (!password || password.length < 6) {
        setErrorMessage('Please enter your password (at least 6 characters).');
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

    const trimmedEmail = email.trim().toLowerCase();
    const isOwnerTarget = isOwnerLogin || (!isSignUp && trimmedEmail === (OWNER_EMAIL || 'samilplatesync@gmail.com').toLowerCase());

    if (isOwnerTarget) {
      try {
        await loginAdminAccount(trimmedEmail, password);
        try {
          await loginEmail(trimmedEmail, password);
        } catch (authErr) {
          // If standard athlete profile is not linked, admin session is already secured
        }
        addNotification('Authenticated as Owner. Activating Owner Suite...', 'success');
        if (onActivateOwnerPortal) {
          onActivateOwnerPortal();
        } else if (onSuccess) {
          onSuccess();
        } else if (onClose) {
          onClose();
        }
        return;
      } catch (adminErr) {
        console.error('Owner authentication failed:', adminErr);
        let msg = adminErr.message || 'Invalid owner credentials.';
        if (adminErr.code === 'auth/unauthorized-admin') {
          msg = 'Access Denied: This account does not possess owner administration privileges.';
        } else if (adminErr.code === 'auth/invalid-credential' || adminErr.code === 'auth/wrong-password' || adminErr.code === 'auth/user-not-found') {
          msg = 'Invalid owner email or password. Please verify your credentials.';
        }
        setErrorMessage(msg);
        return;
      } finally {
        setSubmitting(false);
      }
    }

    try {
      if (isSignUp) {
        await registerEmail(email.trim(), password, name.trim());
        addNotification('Athlete account registered successfully! Welcome to PlateSync.', 'success');
      } else {
        await loginEmail(email.trim(), password);
        addNotification('Welcome back to PlateSync!', 'success');
      }

      // Explicitly trigger Google Password Manager & Chromium Credential Manager prompt to save credentials
      if (typeof window !== 'undefined' && window.PasswordCredential && navigator.credentials?.store) {
        try {
          const cred = new window.PasswordCredential({
            id: email.trim(),
            password: password,
            name: isSignUp ? (name.trim() || undefined) : undefined
          });
          await navigator.credentials.store(cred);
        } catch (credErr) {
          // Non-blocking browser heuristic
          console.debug('Credential store event:', credErr);
        }
      }

      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }
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
        msg = 'Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.';
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
      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }
    } catch (err) {
      if (err.message === 'GOOGLE_AUTH_NOT_CONFIGURED' || err.message === 'FIREBASE_NOT_CONFIGURED') {
        setShowGoogleAuthModal(true);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed before completion.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Popup blocked by browser. Please enable popups or retry.');
      } else if (err.message) {
        setErrorMessage(err.message);
      }
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
            <>
              <button
                onClick={() => setShowGoogleAuthModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-white hover:border-neon-cyan/40 transition text-xs font-medium"
                title="Configure Google OAuth Client ID"
              >
                <KeyRound className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="hidden sm:inline">Google Auth</span>
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card text-slate-300 hover:text-white hover:border-neon-cyan/40 transition text-xs font-medium"
                title="Configure Firebase Keys & Google OAuth"
              >
                <Settings className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="hidden sm:inline">Firebase Setup</span>
                <span className={`w-2 h-2 rounded-full ${isFirebaseReady ? 'bg-neon-success' : 'bg-neon-warning animate-pulse'}`} />
              </button>
            </>
          )}

          <button
            onClick={() => {
              loginAsDemo();
              if (onSuccess) {
                onSuccess();
              } else if (onClose) {
                onClose();
              }
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
          {isOwnerLogin ? (
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 p-0.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-amber-400" />
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 font-mono uppercase tracking-wider">
                Owner Authentication
              </span>

              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-2">
                PlateSync Owner Suite
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your designated owner email and password to activate the Owner Portal.
              </p>
            </div>
          ) : (
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
                  ? 'Join PlateSync to calculate mixed KG & LBS barbell loads with scientific precision'
                  : 'Sign in to access your workout tracker, history, and plate setups'
                }
              </p>
            </div>
          )}

          {/* Tab Selector */}
          {!isOwnerLogin && (
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
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-neon-error shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google Sign-In Button (Dark Elevated Card) */}
          {!isOwnerLogin && (
            <>
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
            </>
          )}

          {/* Email / Password Form with Google Password Manager Integration */}
          <form 
            onSubmit={handleFormSubmit} 
            method="post" 
            action="#" 
            autoComplete="on" 
            className="space-y-3.5"
          >
            {isSignUp && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-name" className="text-xs font-semibold text-slate-300">
                    Full Athlete Name
                  </label>
                  {trimmedName.length > 0 && (
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${isNameValid ? 'text-neon-success font-bold' : 'text-slate-400'}`}>
                      {isNameValid ? (
                        <>
                          <Check className="w-3 h-3 text-neon-success" />
                          <span>Valid name</span>
                        </>
                      ) : (
                        <span>Min. 2 letters</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Thorne"
                    className={`w-full pl-9 pr-8 py-2 bg-midnight-bg border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none transition ${
                      trimmedName.length > 0 && !isNameValid 
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : trimmedName.length > 0 && isNameValid
                          ? 'border-neon-success/50 focus:border-neon-success focus:ring-1 focus:ring-neon-success'
                          : 'border-midnight-border focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan'
                    }`}
                  />
                  {trimmedName.length > 0 && isNameValid && (
                    <Check className="w-4 h-4 text-neon-success absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  At least 2 characters (letters, spaces, hyphens).
                </p>
              </div>
            )}

            <div>
              <label htmlFor="auth-username" className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="auth-username"
                  name="username"
                  type="email"
                  required
                  autoComplete="username"
                  spellCheck="false"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={isSignUp ? "auth-new-password" : "auth-password"} className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {!isSignUp ? (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-neon-cyan hover:underline"
                  >
                    Forgot password?
                  </button>
                ) : (
                  password.length > 0 && (
                    <span className={`text-[10px] font-bold ${strengthTextColor}`}>
                      Strength: {strengthLabel}
                    </span>
                  )
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  id={isSignUp ? "auth-new-password" : "auth-password"}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Min. 8 chars (Upper, lower, number)" : "Enter your password"}
                  className="w-full pl-9 pr-10 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Password Requirements Checklist & Strength Bar for Sign-Up */}
              {isSignUp && (
                <div className="mt-2 space-y-2 animate-in fade-in">
                  {/* Strength Bar */}
                  {password.length > 0 && (
                    <div className="w-full bg-midnight-bg h-1.5 rounded-full overflow-hidden border border-midnight-border">
                      <div 
                        className={`h-full transition-all duration-300 ${strengthColor}`} 
                        style={{ width: `${(strengthScore / 3) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Requirements List */}
                  <div className="p-2.5 rounded-xl bg-midnight-bg border border-midnight-border/80 space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Password Requirements:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10.5px]">
                      <div className={`flex items-center gap-1.5 transition ${reqLength ? 'text-neon-success font-medium' : 'text-slate-500'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${reqLength ? 'bg-neon-success/20 text-neon-success' : 'bg-midnight-card border border-midnight-border text-transparent'}`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>8+ characters</span>
                      </div>

                      <div className={`flex items-center gap-1.5 transition ${reqUpperLower ? 'text-neon-success font-medium' : 'text-slate-500'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${reqUpperLower ? 'bg-neon-success/20 text-neon-success' : 'bg-midnight-card border border-midnight-border text-transparent'}`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>Upper & lowercase</span>
                      </div>

                      <div className={`flex items-center gap-1.5 transition ${reqNumberOrSymbol ? 'text-neon-success font-medium' : 'text-slate-500'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${reqNumberOrSymbol ? 'bg-neon-success/20 text-neon-success' : 'bg-midnight-card border border-midnight-border text-transparent'}`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>Number or symbol</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-confirm-password" className="text-xs font-semibold text-slate-300">
                    Confirm Password
                  </label>
                  {confirmPassword.length > 0 && (
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${passwordsMatch ? 'text-neon-success font-bold' : 'text-rose-400'}`}>
                      {passwordsMatch ? (
                        <>
                          <Check className="w-3 h-3 text-neon-success" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <span>Does not match</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="auth-confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-10 py-2 bg-midnight-bg border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none transition ${
                      passwordsMismatch
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : passwordsMatch
                          ? 'border-neon-success/50 focus:border-neon-success focus:ring-1 focus:ring-neon-success'
                          : 'border-midnight-border focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Google Password Manager Integration Indicator */}
            <div className="p-2 rounded-xl bg-midnight-bg/60 border border-midnight-border flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <span>Google Password Manager & browser auto-save supported</span>
            </div>

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

            {/* Primary Login / Signup Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-3 py-2.5 px-4 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 ${
                isOwnerLogin
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 shadow-neon-cyan/25'
              }`}
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isOwnerLogin 
                      ? 'Authenticate & Launch Owner Suite'
                      : isSignUp ? 'Create Athlete Account' : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Owner Mode Return Switch */}
          {isOwnerLogin ? (
            <div className="mt-4 pt-3 border-t border-midnight-border text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOwnerLogin(false);
                  setEmail('');
                  setPassword('');
                  setErrorMessage('');
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Athlete Sign In</span>
              </button>
            </div>
          ) : (
            <>
              {/* Quick Demo Option Footer */}
              <div className="mt-5 pt-4 border-t border-midnight-border text-center space-y-2">
                <p className="text-[11px] text-slate-400">
                  Don't want to sign in? Try without an account
                </p>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemo('calculator-only');
                    if (onSuccess) {
                      onSuccess();
                    } else if (onClose) {
                      onClose();
                    }
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

              {/* Discreet Owner Portal Entry on Signing Page */}
              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsOwnerLogin(true);
                    setIsSignUp(false);
                    setEmail(OWNER_EMAIL || 'samilplatesync@gmail.com');
                    setPassword('');
                    setErrorMessage('');
                  }}
                  className="text-[11px] text-slate-500 hover:text-amber-400 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Portal Sign In</span>
                </button>
              </div>
            </>
          )}
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

      <GoogleAuthSetupModal
        isOpen={showGoogleAuthModal}
        onClose={() => setShowGoogleAuthModal(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
