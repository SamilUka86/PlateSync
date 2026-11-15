import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Save, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  KeyRound,
  Info
} from 'lucide-react';
import { 
  getGoogleClientId, 
  saveGoogleClientId, 
  isGoogleAuthConfigured 
} from '../../services/auth/googleAuthService';
import { useNotification } from '../../context/NotificationContext';

export const GoogleAuthSetupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { addNotification } = useNotification();
  const [clientId, setClientId] = useState(getGoogleClientId());
  const [copiedOrigin, setCopiedOrigin] = useState('');

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://platesyncapp.vercel.app';

  const handleSave = (e) => {
    e.preventDefault();
    saveGoogleClientId(clientId.trim());
    addNotification('Google OAuth Client ID saved successfully!', 'success');
    onClose();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedOrigin(label);
    addNotification(`Copied ${label} to clipboard!`, 'info', 2000);
    setTimeout(() => setCopiedOrigin(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-midnight-border flex items-center justify-between shrink-0 bg-midnight-secondary/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shadow-glow-cyan">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Google Auth Setup (Client ID)</span>
                <span className={`w-2 h-2 rounded-full ${isGoogleAuthConfigured() ? 'bg-neon-success' : 'bg-amber-400'}`} />
              </h3>
              <p className="text-xs text-slate-400">
                Shift directly to Google Identity Services with just 1 Client ID (Zero Firebase required)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          
          {/* Quick Explanation */}
          <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neon-cyan">
              <Sparkles className="w-4 h-4" />
              <span>Why Google Auth is Much Simpler than Firebase:</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Firebase requires creating a database, setting rules, and managing 6 API keys. With Google Auth (Google Identity Services), you only need <strong>1 single Google Client ID</strong> from Google Cloud Console.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Google OAuth 2.0 Client ID</span>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neon-cyan hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. 123456789-abcdefg.apps.googleusercontent.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan font-mono transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                You can also set this as <code className="text-neon-cyan">VITE_GOOGLE_CLIENT_ID</code> in Vercel Environment Variables.
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-4 rounded-2xl bg-midnight-bg/60 border border-midnight-border space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Step-by-Step Guide to get your Client ID:
              </p>
              
              <ol className="text-xs text-slate-300 space-y-2.5 list-decimal pl-4">
                <li>
                  Open <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline font-semibold">Google Cloud Console</a> and create or select your project.
                </li>
                <li>
                  Go to <strong>APIs & Services</strong> &gt; <strong>OAuth consent screen</strong>, choose <strong>External</strong>, and type <em>PlateSync</em> as the app name.
                </li>
                <li>
                  Go to <strong>Credentials</strong> &gt; <strong>Create Credentials</strong> &gt; <strong>OAuth client ID</strong>.
                </li>
                <li>
                  Choose <strong>Web application</strong> as the Application Type.
                </li>
                <li>
                  Under <strong>Authorized JavaScript origins</strong>, add these exact URLs:
                  <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-midnight-card border border-midnight-border flex items-center justify-between">
                      <span className="text-slate-200">http://localhost:5173</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('http://localhost:5173', 'localhost URL')}
                        className="text-neon-cyan hover:text-white px-2 py-0.5 rounded bg-midnight-bg border border-midnight-border text-[10px]"
                      >
                        {copiedOrigin === 'localhost URL' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-midnight-card border border-midnight-border flex items-center justify-between">
                      <span className="text-slate-200">https://platesyncapp.vercel.app</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('https://platesyncapp.vercel.app', 'Vercel URL')}
                        className="text-neon-cyan hover:text-white px-2 py-0.5 rounded bg-midnight-bg border border-midnight-border text-[10px]"
                      >
                        {copiedOrigin === 'Vercel URL' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-midnight-card border border-midnight-border flex items-center justify-between">
                      <span className="text-slate-200">https://platesyncapp.com</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('https://platesyncapp.com', 'Custom Domain')}
                        className="text-neon-cyan hover:text-white px-2 py-0.5 rounded bg-midnight-bg border border-midnight-border text-[10px]"
                      >
                        {copiedOrigin === 'Custom Domain' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  Click <strong>Create</strong> and copy your new <strong>Client ID</strong> into the input box above!
                </li>
              </ol>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-neon-cyan/25 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Google Client ID</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
