import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Calendar, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RotateCcw, 
  Check, 
  Clock, 
  Sparkles, 
  Flame, 
  ArrowRight,
  Info,
  CalendarDays
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS, LBS_TO_KG } from '../../utils/weightCalculations';
import { saveWeightLog, getWeightLogs, deleteWeightLog } from '../../services/firestore/firestoreService';
import { getTodayLocalDateStr, formatDisplayDate } from '../../components/layout/SidebarWeightTracker';
import { logUserActivityEvent } from '../../services/analytics/activityTracker';

export const BodyWeightPage = ({ setActiveTab }) => {
  const { currentUser, userProfile, updateProfile, isDemoMode } = useAuth();
  const { addNotification } = useNotification();

  const userId = currentUser?.uid || (isDemoMode ? 'demo_athlete_platesync' : 'guest_local');
  const preferredUnit = userProfile?.preferredUnit || 'KG';

  // Form State
  const [unit, setUnit] = useState(preferredUnit);
  const [weightInput, setWeightInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDateStr());
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Sync unit when user preferredUnit changes
  useEffect(() => {
    if (userProfile?.preferredUnit) {
      setUnit(userProfile.preferredUnit);
    }
  }, [userProfile?.preferredUnit]);

  // Load weight logs
  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      try {
        const fetched = await getWeightLogs(userId);
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            setLogs(fetched);
          } else if (isDemoMode) {
            // Seed sample log only in Demo Mode
            const baseKg = Number(userProfile?.bodyWeight) || 75;
            setLogs([
              {
                id: `seed_initial_${userId}`,
                date: getTodayLocalDateStr(),
                weight: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? Math.round(baseKg * KG_TO_LBS * 10) / 10 : baseKg,
                unit: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? 'LBS' : 'KG',
                weightKg: baseKg,
                weightLb: Math.round(baseKg * KG_TO_LBS * 10) / 10,
                notes: 'Baseline check-in',
                createdAt: new Date().toISOString()
              }
            ]);
          } else {
            // Real authenticated users start completely empty
            setLogs([]);
          }
        }
      } catch (err) {
        console.warn('Error fetching weight logs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();
    return () => { isMounted = false; };
  }, [userId, preferredUnit, userProfile?.bodyWeight]);

  // Current weight in KG
  const currentWeightKg = useMemo(() => {
    if (logs.length > 0) return logs[0].weightKg;
    return Number(userProfile?.bodyWeight) || null;
  }, [logs, userProfile?.bodyWeight]);

  // Display strings
  const currentWeightFormatted = useMemo(() => {
    if (!currentWeightKg) return '--';
    if (unit === 'LB' || unit === 'LBS') {
      const lbs = Math.round(currentWeightKg * KG_TO_LBS * 10) / 10;
      return `${lbs} lbs`;
    }
    return `${Math.round(currentWeightKg * 10) / 10} kg`;
  }, [currentWeightKg, unit]);

  // 30-Day Change
  const thirtyDayChange = useMemo(() => {
    if (logs.length < 2) return null;
    const current = logs[0].weightKg;
    const oldest = logs[logs.length - 1].weightKg;
    const diffKg = Math.round((current - oldest) * 10) / 10;

    if (Math.abs(diffKg) < 0.05) return { type: 'neutral', value: '0.0 kg' };
    if (diffKg > 0) {
      const val = (unit === 'LB' || unit === 'LBS') ? `+${Math.round(diffKg * KG_TO_LBS * 10) / 10} lbs` : `+${diffKg} kg`;
      return { type: 'up', value: val };
    } else {
      const val = (unit === 'LB' || unit === 'LBS') ? `${Math.round(diffKg * KG_TO_LBS * 10) / 10} lbs` : `${diffKg} kg`;
      return { type: 'down', value: val };
    }
  }, [logs, unit]);

  // Save new entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(weightInput);
    if (!num || isNaN(num) || num <= 10 || num > 500) {
      addNotification('Please enter a valid weight (e.g. 75.5 or 165)', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const isLb = (unit === 'LB' || unit === 'LBS');
      const weightKg = isLb ? Math.round((num / KG_TO_LBS) * 10) / 10 : Math.round(num * 10) / 10;
      const weightLb = unit === 'KG' ? Math.round((num * KG_TO_LBS) * 10) / 10 : Math.round(num * 10) / 10;

      const newEntry = {
        id: `bw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: selectedDate || getTodayLocalDateStr(),
        weight: num,
        unit,
        weightKg,
        weightLb,
        notes: notes.trim(),
        createdAt: new Date().toISOString()
      };

      const saved = await saveWeightLog(userId, newEntry);

      setLogs(prev => {
        const filtered = prev.filter(l => l.id !== saved.id);
        const updated = [saved, ...filtered];
        updated.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        return updated;
      });

      // Synchronize with user profile
      await updateProfile({ bodyWeight: weightKg });

      setJustSaved(true);
      setWeightInput('');
      setNotes('');
      // Automatically keep the date set to today
      setSelectedDate(getTodayLocalDateStr());

      addNotification(`Body weight logged: ${num} ${unit} (${formatDisplayDate(newEntry.date)})`, 'success');
      logUserActivityEvent('WEIGHT_LOGGED', `Logged body weight: ${num} ${unit}`, {
        weight: num,
        unit,
        weightKg
      });

      setTimeout(() => setJustSaved(false), 2500);
    } catch (err) {
      console.error('Error logging weight:', err);
      addNotification('Failed to record body weight entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete entry
  const handleDelete = async (entryId) => {
    try {
      await deleteWeightLog(userId, entryId);
      setLogs(prev => {
        const remaining = prev.filter(l => l.id !== entryId);
        if (remaining.length > 0) {
          updateProfile({ bodyWeight: remaining[0].weightKg });
        }
        return remaining;
      });
      addNotification('Weight log removed', 'info');
    } catch (err) {
      addNotification('Failed to delete log', 'error');
    }
  };

  const isToday = selectedDate === getTodayLocalDateStr();

  // Chart data
  const chartData = useMemo(() => {
    return [...logs]
      .reverse()
      .map(l => ({
        date: formatDisplayDate(l.date),
        weight: (unit === 'LB' || unit === 'LBS') ? l.weightLb : l.weightKg,
        kg: l.weightKg,
        lbs: l.weightLb,
        fullDate: l.date
      }));
  }, [logs, unit]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-midnight-card border border-midnight-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-neon-violet/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Athlete Body Composition & Mass Tracking</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Body Weight <span className="text-neon-cyan">Tracker</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              Log your body mass in KG or LBS, select dates via the calendar (defaults automatically to today), track progression curves, and keep your barbell calculations calibrated.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Current Weight</span>
              <span className="text-xl font-black font-mono text-neon-cyan">{currentWeightFormatted}</span>
            </div>

            {thirtyDayChange && (
              <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border text-center min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Overall Trend</span>
                <span className={`text-xl font-black font-mono flex items-center justify-center gap-1 ${
                  thirtyDayChange.type === 'down' ? 'text-neon-cyan' : thirtyDayChange.type === 'up' ? 'text-neon-violet' : 'text-slate-300'
                }`}>
                  {thirtyDayChange.type === 'down' && <TrendingDown className="w-4 h-4" />}
                  {thirtyDayChange.type === 'up' && <TrendingUp className="w-4 h-4" />}
                  {thirtyDayChange.type === 'neutral' && <Minus className="w-4 h-4" />}
                  <span>{thirtyDayChange.value}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Grid: Left (Add Log Form) & Right (Progression Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log Weight Card */}
        <div className="lg:col-span-5 bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                <Plus className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Log Weight Entry</h2>
            </div>

            {/* Unit Toggle Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-midnight-bg border border-midnight-border">
              <button
                type="button"
                onClick={() => setUnit('KG')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  unit === 'KG'
                    ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() => setUnit('LBS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  (unit === 'LB' || unit === 'LBS')
                    ? 'bg-neon-violet text-white shadow-md shadow-neon-violet/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LBS
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Weight Value Input */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Body Weight ({unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="500"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={`Enter weight in ${unit} (e.g. ${unit === 'KG' ? '75.5' : '165'})`}
                  className="w-full pl-4 pr-14 py-3 bg-midnight-bg border border-midnight-border rounded-2xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition"
                  required
                />
                <span className="absolute right-4 top-3.5 text-xs font-black font-mono text-slate-400">
                  {unit}
                </span>
              </div>
              {weightInput && !isNaN(parseFloat(weightInput)) && (
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {unit === 'KG' 
                    ? `≈ ${Math.round(parseFloat(weightInput) * KG_TO_LBS * 10) / 10} lbs` 
                    : `≈ ${Math.round((parseFloat(weightInput) / KG_TO_LBS) * 10) / 10} kg`}
                </p>
              )}
            </div>

            {/* Calendar / Date Picker with Automatic Today Default */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Log Date</span>
                </label>

                {isToday ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                    Today (Automatic)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(getTodayLocalDateStr())}
                    className="text-[10px] font-bold text-neon-cyan hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Today</span>
                  </button>
                )}
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan transition [color-scheme:dark]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {isToday
                  ? "Defaulting automatically to today. Click calendar if you want to log for a different date."
                  : `Recording entry for ${formatDisplayDate(selectedDate)} (${selectedDate}).`}
              </p>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Morning fasted, post-leg day, etc."
                className="w-full px-3.5 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving || !weightInput}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                justSaved
                  ? 'bg-neon-success text-slate-950 font-black'
                  : 'bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 shadow-lg shadow-neon-cyan/25 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Weight Entry Saved!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? 'Recording Entry...' : 'Save Weight Entry'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Progression Area Chart */}
        <div className="lg:col-span-7 bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-neon-cyan" />
                  Body Weight Progression Curve
                </h2>
                <p className="text-xs text-slate-400">Fluctuations and long-term trajectory ({unit})</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Current Weight</span>
                <span className="text-xs font-mono font-bold text-neon-cyan bg-neon-cyan/10 px-2.5 py-1 rounded-lg border border-neon-cyan/20">
                  {currentWeightFormatted}
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 sm:h-72 w-full pt-4">
              {chartData.length < 2 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-midnight-bg border border-midnight-border text-slate-400 text-xs space-y-2">
                  <Scale className="w-8 h-8 text-neon-cyan/50" />
                  <p>Log at least 2 entries on different dates to generate your trajectory curve.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#35D9E8" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#35D9E8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#17233B" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748B" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={{ stroke: '#26334D' }} 
                    />
                    <YAxis 
                      stroke="#64748B" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={{ stroke: '#26334D' }}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-midnight-bg border border-midnight-border p-3 rounded-xl shadow-2xl text-xs space-y-1">
                              <p className="font-bold text-white">{data.date}</p>
                              <p className="text-neon-cyan font-mono font-bold">{data.weight} {unit}</p>
                              <p className="text-slate-400 text-[10px] font-mono">
                                ({(unit === 'LB' || unit === 'LBS') ? `${data.kg} KG` : `${data.lbs} LBS`})
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#35D9E8"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#bwGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-midnight-border/60 flex items-center justify-between text-xs text-slate-400">
            <span>Total Logged Entries: <strong className="text-white font-mono">{logs.length}</strong></span>
            <span>Active Unit: <strong className="text-neon-cyan font-mono">{unit}</strong></span>
          </div>
        </div>

      </div>

      {/* 3. All Recorded History Logs Table */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Weight Log History</h2>
              <p className="text-xs text-slate-400">Complete archive of your recorded body measurements</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {logs.length} total entries
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-midnight-bg border border-midnight-border">
            No weight entries recorded yet. Use the form above to log your first weight.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-midnight-border text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-3">Date</th>
                  <th className="pb-3">Weight (KG)</th>
                  <th className="pb-3">Weight (LBS)</th>
                  <th className="pb-3">Delta</th>
                  <th className="pb-3">Notes</th>
                  <th className="pb-3 pr-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-border/50">
                {logs.map((log, index) => {
                  const prevLog = logs[index + 1];
                  let delta = null;
                  if (prevLog) {
                    const diff = Math.round((log.weightKg - prevLog.weightKg) * 10) / 10;
                    if (Math.abs(diff) >= 0.05) {
                      delta = diff;
                    }
                  }

                  return (
                    <tr key={log.id} className="hover:bg-midnight-elevated/40 transition">
                      <td className="py-3 pl-3 font-mono">
                        <div className="font-bold text-white">{formatDisplayDate(log.date)}</div>
                        <div className="text-[10px] text-slate-500">{log.date}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-neon-cyan">
                        {log.weightKg} kg
                      </td>
                      <td className="py-3 font-mono font-bold text-neon-violet">
                        {log.weightLb} lbs
                      </td>
                      <td className="py-3 font-mono">
                        {delta !== null ? (
                          <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                            delta < 0 ? 'text-neon-cyan' : 'text-neon-violet'
                          }`}>
                            {delta < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                            <span>{delta > 0 ? `+${delta}` : delta} kg</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400 max-w-xs truncate">
                        {log.notes || <span className="text-slate-600">&mdash;</span>}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(log.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-neon-error hover:bg-neon-error/10 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
