import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  KeyRound,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { 
  checkAdminLockout, 
  sendAdminPasswordReset, 
  provisionOwnerAccount,
  OWNER_EMAIL 
} from '../../services/admin/adminAuthService';
import { useNotification } from '../../context/NotificationContext';

export const AdminLoginPage = ({ onBackToApp }) => {
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(OWNER_EMAIL);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // First-time owner setup modal
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupSubmitting, setSetupSubmitting] = useState(false);
  const [setupError, setSetupError] = useState('');

  const { loginAdminAccount } = useAdmin();
  const { addNotification } = useNotification();

  const lockoutStatus = checkAdminLockout();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await loginAdminAccount(email.trim(), password);
      addNotification('Authenticated as Administrator. Welcome back.', 'success');
    } catch (err) {
      console.error('Admin login error:', err);
      let msg = err.message || 'Invalid administrative credentials.';
      if (err.code === 'auth/unauthorized-admin') {
        msg = 'Access Denied: This account is authenticated but does not possess administrative privileges for PlateSync.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please verify administrative credentials.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitting(true);
    try {
      await sendAdminPasswordReset(forgotEmail.trim());
      setForgotSuccess(true);
      addNotification('Administrative password reset link dispatched.', 'success');
    } catch (err) {
      addNotification(err.message || 'Could not dispatch reset email.', 'error');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleOwnerSetup = async (e) => {
    e.preventDefault();
    if (setupPassword.length < 8) {
      setSetupError('Password must be at least 8 characters in length.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('Passwords do not match.');
      return;
    }

    setSetupSubmitting(true);
    setSetupError('');

    try {
      await provisionOwnerAccount(setupPassword);
      addNotification('Owner account provisioned in Firebase Auth. Logging in...', 'success');
      setShowSetupModal(false);
      setPassword(setupPassword);
      await loginAdminAccount(OWNER_EMAIL, setupPassword);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setSetupError('The owner account already exists in Firebase Auth. Please log in directly with your password or use "Forgot Password".');
      } else {
        setSetupError(err.message || 'Failed to provision owner account.');
      }
    } finally {
      setSetupSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-midnight-border bg-midnight-secondary/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-neon-cyan to-neon-violet p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center p-2">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                Plate<span className="text-neon-cyan">Sync</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-black text-amber-300 font-mono tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Restricted Administrative Access
            </p>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-white transition text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Return to Athlete App</span>
          </button>
        )}
      </header>

      {/* Central Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-xl relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Administrative Sign In
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Authenticate with your verified PlateSync administrator credentials to manage the platform
            </p>
          </div>

          {/* Brute-force Lockout Warning */}
          {lockoutStatus.locked && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-in fade-in">
              <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-200">Security Lockout Active</p>
                <p className="text-[11px] text-rose-300/80 mt-0.5">
                  Too many consecutive failed attempts. Admin portal is locked for {lockoutStatus.remainingMinutes} more minute(s).
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-neon-error shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@platesync.app"
                  className="w-full pl-9 pr-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-neon-cyan hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
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
            </div>

            <button
              type="submit"
              disabled={submitting || lockoutStatus.locked}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authenticate to Admin Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* First-time Admin Setup Helper */}
          <div className="mt-6 pt-4 border-t border-midnight-border text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              First time logging into the Administrator Account?
            </p>
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Account Setup ({OWNER_EMAIL})</span>
            </button>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-neon-cyan" />
              Reset Administrator Password
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your verified administrative email to receive a secure password recovery link via Firebase Authentication.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-neon-success/10 border border-neon-success/30 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-neon-success mx-auto" />
                <p className="text-xs text-slate-200">
                  Password reset link sent to <span className="font-mono text-neon-cyan">{forgotEmail}</span>. Please check your inbox.
                </p>
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}
                  className="w-full py-2 bg-midnight-elevated text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold hover:bg-midnight-elevated"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="flex-1 py-2 bg-neon-cyan text-slate-950 rounded-xl text-xs font-black shadow-md shadow-neon-cyan/20 disabled:opacity-50"
                  >
                    {forgotSubmitting ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Admin Setup Modal (Configures password directly in Firebase Auth without hardcoding) */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-midnight-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Shield className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Admin Account Initial Provisioning</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Designated Admin Email: <span className="text-amber-300 font-mono font-bold">{OWNER_EMAIL}</span>.
              <br />Set your secure password directly in Firebase Authentication to activate the Admin Panel.
            </p>

            {setupError && (
              <div className="mb-4 p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-neon-error shrink-0 mt-0.5" />
                <span>{setupError}</span>
              </div>
            )}

            <form onSubmit={handleOwnerSetup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Administrator Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Administrator Password
                </label>
                <input
                  type="password"
                  required
                  value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-midnight-bg border border-midnight-border text-[11px] text-slate-400">
                🔒 Your password is encrypted and managed exclusively through Firebase Authentication. It is never stored in plain text or public repositories.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="flex-1 py-2.5 bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold hover:bg-midnight-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={setupSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {setupSubmitting ? 'Provisioning...' : 'Provision Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center border-t border-midnight-border text-[11px] text-slate-500 font-mono">
        PlateSync Security Architecture • Enterprise Authorization Protocol • TLS 1.3
      </footer>

    </div>
  );
};
