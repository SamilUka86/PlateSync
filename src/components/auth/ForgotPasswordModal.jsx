import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const ForgotPasswordModal = ({ isOpen, onClose, defaultEmail = '' }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState(defaultEmail);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { resetPassword } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await resetPassword(email.trim());
      setSuccess(true);
      addNotification('Password reset instructions dispatched to your email!', 'success');
    } catch (err) {
      if (err.message === 'FIREBASE_NOT_CONFIGURED') {
        setErrorMsg('Firebase is not yet configured. Please configure your Firebase keys.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMsg('No athlete account was found with that email address.');
      } else {
        setErrorMsg(err.message || 'Failed to send password reset email.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-midnight-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reset Password</h3>
              <p className="text-[11px] text-slate-400">Recover your PlateSync athlete account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-midnight-elevated transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neon-success/10 border border-neon-success/30 flex items-center justify-center text-neon-success mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-white">
              Password reset link sent!
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Check your inbox at <span className="font-mono text-neon-cyan">{email}</span> and follow the instructions to set your new password.
            </p>
            <button
              onClick={() => { onClose(); setSuccess(false); }}
              className="mt-2 px-5 py-2 bg-midnight-elevated hover:bg-midnight-secondary text-white rounded-xl text-xs font-semibold transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-300">
              Enter your email address and we will dispatch a secure link to reset your account password.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-neon-error" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="reset-email"
                  name="username"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-neon-cyan/20 transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
