import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Mail, 
  FileText, 
  X,
  Bug,
  Sparkles,
  HelpCircle,
  Smartphone,
  Calculator
} from 'lucide-react';
import { 
  getAllFeedback, 
  updateFeedbackStatus 
} from '../../../services/admin/adminDataService';
import { useNotification } from '../../../context/NotificationContext';

export const AdminFeedbackTab = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Detail Modal
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [status, setStatus] = useState('pending');
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const { addNotification } = useNotification();

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const data = await getAllFeedback(statusFilter, categoryFilter);
      setFeedbackList(data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [statusFilter, categoryFilter]);

  const openDetailModal = (item) => {
    setSelectedFeedback(item);
    setStatus(item.status || 'pending');
    setInternalNotes(item.internalNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    setUpdating(true);
    try {
      await updateFeedbackStatus(selectedFeedback.id, status, internalNotes);
      addNotification(`Feedback report marked as ${status}.`, 'success');
      setSelectedFeedback(null);
      loadFeedback();
    } catch (err) {
      addNotification('Could not update feedback status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'bug':
        return { label: 'Bug Report', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: Bug };
      case 'feature':
        return { label: 'Feature Request', color: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30', icon: Sparkles };
      case 'calculation':
        return { label: 'Calculation Issue', color: 'bg-amber-400/15 text-amber-300 border-amber-400/30', icon: Calculator };
      case 'install':
        return { label: 'Installation / PWA', color: 'bg-neon-violet/15 text-neon-violet border-neon-violet/30', icon: Smartphone };
      default:
        return { label: 'General Feedback', color: 'bg-slate-800 text-slate-300 border-slate-700', icon: HelpCircle };
    }
  };

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-midnight-card border border-midnight-border">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neon-cyan" />
            Athlete Feedback & Quality Reports ({feedbackList.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor incoming bug reports, feature suggestions, PWA install queries, and barbell calculation tickets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
          >
            <option value="ALL">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
          >
            <option value="ALL">All Categories</option>
            <option value="bug">Bug Reports</option>
            <option value="feature">Feature Requests</option>
            <option value="calculation">Calculation Issues</option>
            <option value="install">Installation Issues</option>
            <option value="general">General</option>
          </select>

          <button
            onClick={loadFeedback}
            className="p-2 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 rounded-xl transition"
            title="Reload reports"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-midnight-card border border-midnight-border rounded-2xl animate-pulse" />
          ))
        ) : feedbackList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-midnight-card border border-midnight-border rounded-3xl">
            <CheckCircle2 className="w-8 h-8 mx-auto text-neon-success mb-2" />
            <p className="font-bold text-slate-200">No reports found</p>
            <p className="text-xs text-slate-500 mt-1">All athlete feedback has been reviewed and addressed.</p>
          </div>
        ) : (
          feedbackList.map((item) => {
            const cat = getCategoryBadge(item.category);
            const IconComponent = cat.icon;
            const isResolved = item.status === 'resolved';

            return (
              <div 
                key={item.id}
                onClick={() => openDetailModal(item)}
                className={`p-5 rounded-2xl bg-midnight-card border transition cursor-pointer hover:border-midnight-elevated ${
                  isResolved ? 'border-midnight-border opacity-70' : 'border-midnight-border/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cat.color}`}>
                      <IconComponent className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </span>
                    <span className="font-bold text-white text-xs">{item.subject || 'User Feedback Report'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'resolved' ? 'bg-neon-success/15 text-neon-success border border-neon-success/30' :
                      item.status === 'in-progress' ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-midnight-border/60 text-[11px] text-slate-500">
                  <span className="font-mono">From: {item.userEmail || 'Anonymous Athlete'}</span>
                  {item.internalNotes && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Internal Notes Attached
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Detail & Action Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-midnight-border">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-cyan" />
                Review Feedback Report
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-midnight-bg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-midnight-bg rounded-2xl border border-midnight-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                  <span>Author: <b className="text-white">{selectedFeedback.userEmail}</b></span>
                  <span>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
                </div>
                <div className="font-bold text-white text-sm pt-1">
                  {selectedFeedback.subject || 'Athlete Report'}
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap pt-1">
                  {selectedFeedback.message}
                </p>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ticket Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-bold"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="in-progress">In Progress (Engineering)</option>
                    <option value="resolved">Resolved / Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Internal Admin Notes (Private)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add operational notes or fix tracking references..."
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-2 bg-midnight-bg hover:bg-midnight-elevated text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Resolution'}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
