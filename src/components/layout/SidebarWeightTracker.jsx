import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Calendar, 
  Plus, 
  Trash2, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  RotateCcw, 
  X,
  LineChart as ChartIcon,
  Sparkles,
  Lock,
  LogIn,
  Maximize2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS, LBS_TO_KG } from '../../utils/weightCalculations';
import { saveWeightLog, getWeightLogs, deleteWeightLog } from '../../services/firestore/firestoreService';

/**
 * Helper to get today's date formatted as YYYY-MM-DD in local time
 * (guarantees local timezone accuracy regardless of UTC offsets)
 */
export const getTodayLocalDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display: "Today", "Yesterday", or "Nov 15"
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const todayStr = getTodayLocalDateStr();
  if (dateStr === todayStr) return 'Today';

  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yYear = d.getFullYear();
  const yMonth = String(d.getMonth() + 1).padStart(2, '0');
  const yDay = String(d.getDate()).padStart(2, '0');
  if (dateStr === `${yYear}-${yMonth}-${yDay}`) return 'Yesterday';

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const parsed = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  } catch (e) {}
  return dateStr;
};

export const SidebarWeightTracker = ({ collapsed = false, onExpandSidebar, onOpenAuth, onNavigateToSection }) => {
  const { currentUser, userProfile, updateProfile, isDemoMode, demoAccessMode } = useAuth();
  const { addNotification } = useNotification();

  const isLocked = (!currentUser || (isDemoMode && demoAccessMode === 'calculator-only'));

  const userId = currentUser?.uid || (isDemoMode ? 'demo_athlete_platesync' : 'guest_local');
  const preferredUnit = userProfile?.preferredUnit || 'KG';

  // State
  const [unit, setUnit] = useState(preferredUnit);
  const [weightValue, setWeightValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDateStr());
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync unit when user profile preferredUnit changes
  useEffect(() => {
    if (userProfile?.preferredUnit) {
      setUnit(userProfile.preferredUnit);
    }
  }, [userProfile?.preferredUnit]);

  // Load existing weight logs from Firestore / local cache
  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      try {
        const fetched = await getWeightLogs(userId);
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            setLogs(fetched);
          } else {
            // Initial seed logs for a rich first experience
            const baseKg = Number(userProfile?.bodyWeight) || 75;
            const seedLogs = [
              {
                id: `seed_1_${userId}`,
                date: getTodayLocalDateStr(),
                weight: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? Math.round(baseKg * KG_TO_LBS * 100) / 100 : baseKg,
                unit: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? 'LBS' : 'KG',
                weightKg: baseKg,
                weightLb: Math.round(baseKg * KG_TO_LBS * 100) / 100,
                createdAt: new Date().toISOString()
              }
            ];
            setLogs(seedLogs);
          }
        }
      } catch (err) {
        console.warn('Weight logs fetch notice:', err);
      }
    };

    fetchLogs();
    return () => { isMounted = false; };
  }, [userId, preferredUnit, userProfile?.bodyWeight]);

  // Compute latest logged entry and current weight
  const latestLog = useMemo(() => {
    if (!logs || logs.length === 0) return null;
    return logs[0];
  }, [logs]);

  // Current weight in KG
  const currentWeightKg = useMemo(() => {
    if (latestLog) return latestLog.weightKg;
    return Number(userProfile?.bodyWeight) || 75;
  }, [latestLog, userProfile?.bodyWeight]);

  // Current weight formatted in active unit
  const displayCurrentWeight = useMemo(() => {
    if (unit === 'LB' || unit === 'LBS') {
      const lbs = Math.round(currentWeightKg * KG_TO_LBS * 100) / 100;
      return `${lbs.toFixed(2)} lbs`;
    }
    return `${(Math.round(currentWeightKg * 100) / 100).toFixed(2)} kg`;
  }, [currentWeightKg, unit]);

  // Trend vs previous log
  const weightTrend = useMemo(() => {
    if (!logs || logs.length < 2) return null;
    const current = logs[0].weightKg;
    const prev = logs[1].weightKg;
    const diffKg = Math.round((current - prev) * 100) / 100;

    if (Math.abs(diffKg) < 0.01) return { type: 'neutral', label: '0.00 kg' };
    if (diffKg > 0) {
      const val = (unit === 'LB' || unit === 'LBS') ? `+${Math.round(diffKg * KG_TO_LBS * 100) / 100} lbs` : `+${diffKg} kg`;
      return { type: 'up', label: val };
    } else {
      const val = (unit === 'LB' || unit === 'LBS') ? `${Math.round(diffKg * KG_TO_LBS * 100) / 100} lbs` : `${diffKg} kg`;
      return { type: 'down', label: val };
    }
  }, [logs, unit]);

  // Save new body weight entry
  const handleSaveWeight = async (e) => {
    if (e) e.preventDefault();
    const num = parseFloat(weightValue);
    if (!num || isNaN(num) || num <= 0 || num > 500) {
      addNotification('Please enter a valid weight (e.g. 75.5 or 165)', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const weightKg = (unit === 'LB' || unit === 'LBS') ? Math.round((num / KG_TO_LBS) * 100) / 100 : Math.round(num * 100) / 100;
      const weightLb = unit === 'KG' ? Math.round((num * KG_TO_LBS) * 100) / 100 : Math.round(num * 100) / 100;

      const newEntry = {
        id: `bw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: selectedDate || getTodayLocalDateStr(),
        weight: num,
        unit,
        weightKg,
        weightLb,
        createdAt: new Date().toISOString()
      };

      const saved = await saveWeightLog(userId, newEntry);

      // Optimistically update local logs state
      setLogs(prev => {
        const filtered = prev.filter(l => l.id !== saved.id);
        const updated = [saved, ...filtered];
        updated.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        return updated;
      });

      // Synchronize with user profile so the entire app reflects the new body weight
      await updateProfile({
        bodyWeight: weightKg
      });

      setJustSaved(true);
      setWeightValue('');
      // Keep selectedDate at today's date automatically
      setSelectedDate(getTodayLocalDateStr());

      addNotification(`Body weight recorded: ${num} ${unit} (${formatDisplayDate(newEntry.date)})`, 'success');

      setTimeout(() => {
        setJustSaved(false);
      }, 2500);

      if (showModal) {
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to save weight log:', err);
      addNotification('Failed to save body weight entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a weight log entry
  const handleDeleteLog = async (logId, e) => {
    if (e) e.stopPropagation();
    try {
      await deleteWeightLog(userId, logId);
      setLogs(prev => {
        const remaining = prev.filter(l => l.id !== logId);
        // If we deleted the latest log and have a previous log, update user profile
        if (remaining.length > 0) {
          updateProfile({ bodyWeight: remaining[0].weightKg });
        }
        return remaining;
      });
      addNotification('Weight entry removed', 'info');
    } catch (err) {
      addNotification('Failed to remove entry', 'error');
    }
  };

  // Reset date picker back to today's date
  const handleResetToToday = () => {
    setSelectedDate(getTodayLocalDateStr());
  };

  const isToday = selectedDate === getTodayLocalDateStr();

  // Chart data for trend modal
  const chartData = useMemo(() => {
    return [...logs]
      .reverse()
      .map(l => ({
        date: formatDisplayDate(l.date),
        weight: (unit === 'LB' || unit === 'LBS') ? l.weightLb : l.weightKg,
        fullDate: l.date
      }));
  }, [logs, unit]);

  // ==========================================
  // 1. COLLAPSED SIDEBAR VIEW
  // ==========================================
  if (collapsed) {
    if (isLocked) {
      return (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenAuth}
            className="relative p-2.5 rounded-xl bg-midnight-card border border-midnight-border hover:border-neon-cyan/50 text-slate-500 hover:text-white transition group"
            title="Sign in to track Body Weight"
            aria-label="Sign in to track Body Weight"
          >
            <Scale className="w-4 h-4" />
            <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-neon-cyan" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="relative p-2.5 rounded-xl bg-midnight-card border border-midnight-border hover:border-neon-cyan/50 text-slate-300 hover:text-neon-cyan transition group"
          title={`Body Weight Tracker: ${displayCurrentWeight} (Click to log)`}
          aria-label="Open Body Weight Tracker"
        >
          <Scale className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
        </button>

        {/* Collapsed Popover / Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-midnight-card border border-midnight-border rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Log Body Weight</h3>
                    <p className="text-[10px] text-slate-400">Current: <span className="text-neon-cyan font-mono font-bold">{displayCurrentWeight}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-midnight-elevated transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveWeight} className="space-y-3">
                {/* Unit Toggle & Weight Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Body Weight</label>
                    <div className="flex items-center p-0.5 rounded-lg bg-midnight-bg border border-midnight-border">
                      <button
                        type="button"
                        onClick={() => setUnit('KG')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                          unit === 'KG'
                            ? 'bg-neon-cyan text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        KG
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('LBS')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                          (unit === 'LB' || unit === 'LBS')
                            ? 'bg-neon-violet text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        LBS
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="500"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                      placeholder={`Enter weight in ${unit} (e.g. ${unit === 'KG' ? '75.5' : '165'})`}
                      className="w-full pl-3 pr-12 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                      autoFocus
                    />
                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">
                      {unit}
                    </span>
                  </div>
                </div>

                {/* Calendar Date Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neon-cyan" />
                      <span>Log Date</span>
                    </label>
                    {isToday ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                        Today (Auto)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResetToToday}
                        className="text-[9px] font-bold text-neon-cyan hover:underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Reset to Today</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan [color-scheme:dark]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {isToday
                      ? "Automatically recording for today. Use calendar to pick a different date."
                      : `Selected date: ${formatDisplayDate(selectedDate)}.`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSaving || !weightValue}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                      justSaved
                        ? 'bg-neon-success text-slate-950'
                        : 'bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 shadow-lg shadow-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {justSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Weight Logged!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save Entry'}</span>
                      </>
                    )}
                  </button>

                  {logs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setShowTrendModal(true);
                      }}
                      className="p-2.5 rounded-xl bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white transition"
                      title="View Weight Trend & History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. EXPANDED SIDEBAR VIEW
  // ==========================================
  if (isLocked) {
    return (
      <div className="rounded-2xl bg-midnight-card border border-midnight-border p-3 transition-all duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-midnight-border/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-500">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-300">Body Weight</span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-midnight-bg text-slate-500 border border-midnight-border flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5 text-neon-cyan" />
            <span>Login Required</span>
          </span>
        </div>
        <div className="pt-2.5 text-center space-y-2">
          <p className="text-[10px] text-slate-400 leading-tight">
            Sign in to record body weight in KG/LBS and view your progression curve.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-1.5 px-3 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <LogIn className="w-3 h-3" />
            <span>Sign In to Track</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-midnight-card border border-midnight-border p-3 transition-all duration-200 hover:border-neon-cyan/30">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-midnight-border/60">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white tracking-tight">Body Weight</span>
                {weightTrend && (
                  <span className={`text-[9px] font-mono font-bold flex items-center gap-0.5 ${
                    weightTrend.type === 'down' ? 'text-neon-cyan' : weightTrend.type === 'up' ? 'text-neon-violet' : 'text-slate-400'
                  }`}>
                    {weightTrend.type === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                    {weightTrend.type === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                    {weightTrend.type === 'neutral' && <Minus className="w-2.5 h-2.5" />}
                    <span>{weightTrend.label}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded border border-neon-cyan/20">
              {displayCurrentWeight}
            </span>
            {onNavigateToSection && (
              <button
                type="button"
                onClick={() => onNavigateToSection('bodyweight')}
                className="p-1 rounded text-slate-400 hover:text-neon-cyan transition"
                title="Open full Body Weight section"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              title={isExpanded ? "Collapse tracker" : "Expand tracker"}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Form Body */}
        {isExpanded && (
          <form onSubmit={handleSaveWeight} className="space-y-2.5 pt-2.5 animate-in fade-in">
            {/* Weight Input & Unit Switcher */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Weight</span>
                {/* KG / LBS Unit Toggle */}
                <div className="flex items-center p-0.5 rounded-lg bg-midnight-bg border border-midnight-border">
                  <button
                    type="button"
                    onClick={() => setUnit('KG')}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition ${
                      unit === 'KG'
                        ? 'bg-neon-cyan text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    KG
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('LBS')}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition ${
                      (unit === 'LB' || unit === 'LBS')
                        ? 'bg-neon-violet text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    LBS
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="500"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder={`Weight in ${unit} (e.g. ${unit === 'KG' ? '75.5' : '165'})`}
                  className="w-full pl-2.5 pr-10 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition"
                />
                <span className="absolute right-2.5 top-1.5 text-[10px] font-mono font-bold text-slate-400">
                  {unit}
                </span>
              </div>
            </div>

            {/* Calendar / Date Picker with Automatic Today Default */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-neon-cyan" />
                  <span>Date</span>
                </span>

                {isToday ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                    Today
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetToToday}
                    className="text-[9px] font-bold text-neon-cyan hover:underline flex items-center gap-0.5"
                    title="Reset to today's date"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Today</span>
                  </button>
                )}
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan transition [color-scheme:dark]"
              />
            </div>

            {/* Action Buttons: Log Weight & History Toggle */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="submit"
                disabled={isSaving || !weightValue}
                className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 ${
                  justSaved
                    ? 'bg-neon-success text-slate-950 font-black'
                    : 'bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 shadow-md shadow-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {justSaved ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Logged!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>{isSaving ? 'Saving...' : 'Log Weight'}</span>
                  </>
                )}
              </button>

              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-1.5 rounded-xl border transition ${
                    showHistory
                      ? 'bg-midnight-elevated text-neon-cyan border-neon-cyan/40'
                      : 'bg-midnight-bg text-slate-400 hover:text-white border-midnight-border'
                  }`}
                  title="Toggle recent logs"
                >
                  <History className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Recent Logs Drawer */}
            {showHistory && logs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-midnight-border/60 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>Recent Logs</span>
                  <button
                    type="button"
                    onClick={() => setShowTrendModal(true)}
                    className="text-neon-cyan hover:underline flex items-center gap-0.5 text-[9px]"
                  >
                    <ChartIcon className="w-2.5 h-2.5" />
                    <span>View Chart</span>
                  </button>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                  {logs.slice(0, 5).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-midnight-bg border border-midnight-border/50 text-[10px]"
                    >
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-slate-400">{formatDisplayDate(l.date)}</span>
                        <span className="text-white font-bold">
                          {(unit === 'LB' || unit === 'LBS')
                            ? `${(Number(l.weightLb) || 0).toFixed(2)} lbs`
                            : `${(Number(l.weightKg) || 0).toFixed(2)} kg`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteLog(l.id, e)}
                        className="text-slate-500 hover:text-neon-error p-0.5 rounded transition"
                        title="Delete this entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* ========================================== */}
      {/* 3. TREND PROGRESSION & FULL HISTORY MODAL   */}
      {/* ========================================== */}
      {showTrendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-midnight-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Body Weight Progression
                    <span className="text-xs font-mono font-bold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full border border-neon-cyan/20">
                      {displayCurrentWeight}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Track your daily body mass fluctuations and long-term trend
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrendModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-midnight-elevated transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Trend Chart */}
            {chartData.length > 1 ? (
              <div className="bg-midnight-bg border border-midnight-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-300">Trend Curve ({unit})</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {chartData.length} records
                  </span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2f50" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a101d',
                          border: '1px solid #1f2f50',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                        formatter={(val) => [`${val} ${unit}`, 'Body Weight']}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#35d9e8"
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: '#35d9e8', strokeWidth: 1, stroke: '#0a101d' }}
                        activeDot={{ r: 6, fill: '#35d9e8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-midnight-bg border border-midnight-border text-xs text-slate-400">
                Log at least 2 entries across different dates to visualize your weight curve.
              </div>
            )}

            {/* History Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-300">All Logged Records ({logs.length})</h4>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {logs.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-midnight-card flex items-center justify-center text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {(Number(l.weightKg) || 0).toFixed(2)} kg <span className="text-slate-500 font-normal">/</span> {(Number(l.weightLb) || 0).toFixed(2)} lb
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatDisplayDate(l.date)} ({l.date})
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteLog(l.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-neon-error hover:bg-neon-error/10 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTrendModal(false)}
                className="px-4 py-2 rounded-xl bg-midnight-elevated text-xs font-bold text-white hover:bg-midnight-border transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
