import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  ExternalLink, 
  Check, 
  Copy, 
  Save, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  firebaseConfig, 
  saveRuntimeFirebaseConfig, 
  clearRuntimeFirebaseConfig, 
  isFirebaseConfigured 
} from '../../services/firebase/config';

export const FirebaseSetupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    apiKey: firebaseConfig.apiKey || '',
    authDomain: firebaseConfig.authDomain || '',
    projectId: firebaseConfig.projectId || '',
    storageBucket: firebaseConfig.storageBucket || '',
    messagingSenderId: firebaseConfig.messagingSenderId || '',
    appId: firebaseConfig.appId || '',
  });

  const [copiedRule, setCopiedRule] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value.trim()
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveRuntimeFirebaseConfig(formData);
  };

  const handleReset = () => {
    if (window.confirm('Reset saved Firebase configuration back to environment variables?')) {
      clearRuntimeFirebaseConfig();
    }
  };

  const copyRulesToClipboard = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }
    function isValidUnit(unit) { return unit == 'KG' || unit == 'LB' || unit == 'LBS'; }
    function isPositive(val) { return val is number && val >= 0; }
    function isStrictPositive(val) { return val is number && val > 0; }
    function isValidStr(val, maxLen) { return val is string && val.size() <= maxLen; }

    match /users/{userId} {
      allow read, delete: if isOwner(userId);
      allow create, update: if isOwner(userId)
        && (!('uid' in request.resource.data) || request.resource.data.uid == userId)
        && (!('preferredUnit' in request.resource.data) || isValidUnit(request.resource.data.preferredUnit))
        && (!('defaultBarbellUnit' in request.resource.data) || isValidUnit(request.resource.data.defaultBarbellUnit))
        && (!('height' in request.resource.data) || (isStrictPositive(request.resource.data.height) && request.resource.data.height <= 300))
        && (!('bodyWeight' in request.resource.data) || (isStrictPositive(request.resource.data.bodyWeight) && request.resource.data.bodyWeight <= 600))
        && (!('defaultBarbellWeight' in request.resource.data) || (isPositive(request.resource.data.defaultBarbellWeight) && request.resource.data.defaultBarbellWeight <= 200));

      match /workouts/{workoutId} {
        allow read, delete: if isOwner(userId);
        allow create, update: if isOwner(userId)
          && (!('userId' in request.resource.data) || request.resource.data.userId == userId)
          && (!('workoutName' in request.resource.data) || isValidStr(request.resource.data.workoutName, 150))
          && (!('duration' in request.resource.data) || isPositive(request.resource.data.duration))
          && (!('exercises' in request.resource.data) || request.resource.data.exercises is list)
          && (!('totalVolumeKg' in request.resource.data) || isPositive(request.resource.data.totalVolumeKg));
      }

      match /plateConfigurations/{configId} {
        allow read, delete: if isOwner(userId);
        allow create, update: if isOwner(userId)
          && (!('name' in request.resource.data) || isValidStr(request.resource.data.name, 100))
          && (!('barbellWeight' in request.resource.data) || isPositive(request.resource.data.barbellWeight))
          && (!('barbellUnit' in request.resource.data) || isValidUnit(request.resource.data.barbellUnit));
      }

      match /personalRecords/{recordId} {
        allow read, delete: if isOwner(userId);
        allow create, update: if isOwner(userId)
          && (!('maxWeightKg' in request.resource.data) || isPositive(request.resource.data.maxWeightKg));
      }

      match /templates/{templateId} {
        allow read, write: if isOwner(userId);
      }

      match /customExercises/{exerciseId} {
        allow read, write: if isOwner(userId);
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-midnight-border bg-midnight-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Firebase & Google OAuth Setup
                </h3>
                {isFirebaseConfigured() ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-success/20 text-neon-success border border-neon-success/30 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-warning/20 text-neon-warning border border-neon-warning/30 font-semibold">
                    Keys Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Connect your real Firebase project for Google Sign-In and Cloud Firestore
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Instructions Box */}
          <div className="bg-midnight-secondary border border-midnight-border rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-neon-cyan" />
              Quick Setup Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>
                Open the{' '}
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-neon-cyan hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Firebase Console <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and create a project named <strong>PlateSync</strong>.
              </li>
              <li>
                In <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong>, enable:
                <div className="mt-1 ml-4 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-midnight-elevated text-neon-cyan font-mono text-[11px] font-bold">Google</span>
                  <span className="px-2 py-0.5 rounded bg-midnight-elevated text-neon-violet font-mono text-[11px] font-bold">Email/Password</span>
                </div>
              </li>
              <li>
                In <strong>Firestore Database</strong>, create a database in production mode and paste the security rules provided below.
              </li>
              <li>
                Go to <strong>Project Settings</strong> &rarr; <strong>General</strong> &rarr; <strong>Your apps</strong> &rarr; Add Web App (<code>&lt;/&gt;</code>) and paste the keys below.
              </li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  API Key (VITE_FIREBASE_API_KEY)
                </label>
                <input
                  type="text"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Auth Domain (VITE_FIREBASE_AUTH_DOMAIN)
                </label>
                <input
                  type="text"
                  name="authDomain"
                  value={formData.authDomain}
                  onChange={handleChange}
                  placeholder="platesync-app.firebaseapp.com"
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Project ID (VITE_FIREBASE_PROJECT_ID)
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  placeholder="platesync-app"
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Storage Bucket (VITE_FIREBASE_STORAGE_BUCKET)
                </label>
                <input
                  type="text"
                  name="storageBucket"
                  value={formData.storageBucket}
                  onChange={handleChange}
                  placeholder="platesync-app.appspot.com"
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Messaging Sender ID (VITE_FIREBASE_MESSAGING_SENDER_ID)
                </label>
                <input
                  type="text"
                  name="messagingSenderId"
                  value={formData.messagingSenderId}
                  onChange={handleChange}
                  placeholder="123456789012"
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  App ID (VITE_FIREBASE_APP_ID)
                </label>
                <input
                  type="text"
                  name="appId"
                  value={formData.appId}
                  onChange={handleChange}
                  placeholder="1:123456:web:abcd123"
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-neon-error hover:underline"
              >
                Clear Runtime Overrides
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-bold rounded-xl shadow-lg shadow-neon-cyan/20 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                Save & Connect
              </button>
            </div>
          </form>

          {/* Firestore Security Rules Box */}
          <div className="bg-midnight-bg border border-midnight-border rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
                Firestore Security Rules (firestore.rules)
              </span>
              <button
                type="button"
                onClick={copyRulesToClipboard}
                className="flex items-center gap-1 text-[11px] text-neon-cyan hover:underline"
              >
                {copiedRule ? <Check className="w-3 h-3 text-neon-success" /> : <Copy className="w-3 h-3" />}
                {copiedRule ? 'Copied!' : 'Copy Rules'}
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-2.5 bg-midnight-secondary rounded-xl border border-midnight-border max-h-48">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
      match /workouts/{workoutId} { allow read, write: if isOwner(userId); }
      match /plateConfigurations/{configId} { allow read, write: if isOwner(userId); }
      match /personalRecords/{recordId} { allow read, write: if isOwner(userId); }
      match /templates/{templateId} { allow read, write: if isOwner(userId); }
      match /customExercises/{exerciseId} { allow read, write: if isOwner(userId); }
    }
    match /{document=**} { allow read, write: if false; }
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
