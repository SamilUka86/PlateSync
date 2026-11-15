import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bug, 
  Sparkles, 
  Calculator, 
  Smartphone, 
  HelpCircle, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';
import { submitUserFeedback } from '../../services/admin/adminDataService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, desc: 'Visual glitched, button unresponsive, broken flow' },
  { id: 'feature', label: 'Feature Request', icon: Sparkles, desc: 'Suggest a new capability, plate size, or split' },
  { id: 'calculation', label: 'Calculation Issue', icon: Calculator, desc: 'Barbell or mixed KG/LBS load inaccuracy' },
  { id: 'install', label: 'App Install Issue', icon: Smartphone, desc: 'PWA icon, homescreen, or offline cache problem' },
  { id: 'general', label: 'General Feedback', icon: HelpCircle, desc: 'Your experience and thoughts on PlateSync' }
];

export const UserFeedbackModal = ({ isOpen, onClose }) => {
  const { currentUser, isDemoMode } = useAuth();
  const { addNotification } = useNotification();

  const [category, setCategory] = useState('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide feedback details in the message box.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitUserFeedback({
        category,
        subject: subject.trim() || `${category.toUpperCase()} Report`,
        message: message.trim(),
        contactEmail: contactEmail.trim()
      });
      setSubmitted(true);
      addNotification('Feedback submitted to PlateSync engineering team. Thank you!', 'success');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setSubject('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-midnight-bg hover:bg-midnight-elevated transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-violet p-0.5">
            <div className="w-full h-full bg-midnight-card rounded-[14px] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-neon-cyan" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-white">Send Athlete Feedback & Reports</h3>
            <p className="text-[11px] text-slate-400">Directly connected to PlateSync Platform Operations</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-neon-success mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your report has been logged into the administrator portal. Our engineering team reviews all athlete tickets to continuously improve calculation precision and workout tracking.
            </p>
            <button
              onClick={resetAndClose}
              className="mt-4 px-6 py-2.5 bg-neon-cyan text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            {error && (
              <div className="p-3 rounded-xl bg-neon-error/10 border border-neon-error/30 flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-neon-error shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-2xl text-left border transition flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-neon-cyan/15 border-neon-cyan text-white shadow-sm' 
                          : 'bg-midnight-bg border-midnight-border text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-neon-cyan' : 'text-slate-500'}`} />
                      <span className="text-[11px] font-bold block">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue or idea..."
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Feedback *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain what happened, what device you're on, or what you'd like to see added..."
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Email (for follow-up if needed)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="athlete@domain.com"
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-midnight-border">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 bg-midnight-bg hover:bg-midnight-elevated text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
