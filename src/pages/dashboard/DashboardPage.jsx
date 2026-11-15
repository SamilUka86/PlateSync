import React, { useMemo } from 'react';
import { 
  Trophy, 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Calculator, 
  Clock,
  ArrowRight,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';

export const DashboardPage = ({ setActiveTab }) => {
  const { userProfile, currentUser } = useAuth();
  const { workouts, metrics } = useWorkout();

  const athleteName = userProfile?.name || currentUser?.displayName || 'Athlete';
  const preferredUnit = userProfile?.preferredUnit || 'KG';

  // Weekly 7-day activity data for the Recharts BarChart
  const weeklyActivityData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toDateString();

      const dayWorkouts = workouts.filter(w => new Date(w.date || w.createdAt).toDateString() === dateStr);
      let volume = 0;
      dayWorkouts.forEach(w => {
        const v = preferredUnit === 'LB' 
          ? (w.totalVolumeLbs || (w.totalVolumeKg || w.totalVolume || 0) * KG_TO_LBS)
          : (w.totalVolumeKg || w.totalVolume || 0);
        volume += v;
      });

      result.push({
        day: dayName,
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        volume: Math.round(volume),
        workoutsCount: dayWorkouts.length
      });
    }

    return result;
  }, [workouts, preferredUnit]);

  // Key Strength Progression items derived dynamically from personal records
  const strengthOverviewList = useMemo(() => {
    const prs = metrics?.personalRecords || {};
    const prKeys = Object.keys(prs);
    if (prKeys.length === 0) return [];

    return prKeys.slice(0, 4).map(name => {
      const pr = prs[name];
      return {
        name,
        maxWeightKg: pr.maxWeightKg || 0,
        reps: pr.reps || 1,
        change: 'Personal Record',
        positive: true
      };
    });
  }, [metrics?.personalRecords]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-midnight-card border border-midnight-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-neon-violet/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Smart Barbell & Mixed-Unit Analytics</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {workouts.length === 0 ? (
                <>Welcome to PlateSync, <span className="text-neon-cyan">{athleteName}</span>!</>
              ) : (
                <>Welcome back, <span className="text-neon-cyan">{athleteName}</span>!</>
              )}
            </h1>

            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              {workouts.length === 0
                ? "Your training journey starts now! Calculate mixed KG and LB barbell setups, record your sets, and start building your Personal Records."
                : "Ready to crush today's lifting targets? Calculate mixed KG and LB plates, log your sets without manual conversion, and track your PRs."}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1f2f50] text-slate-200 text-xs font-bold transition hover:text-white"
            >
              <Calculator className="w-4 h-4 text-neon-cyan" />
              <span>Open Weight Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className="flex items-center gap-2 px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Start Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Individual Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Workouts */}
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-5 hover:border-neon-cyan/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Workouts</span>
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              {metrics.totalWorkouts}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">completed</span>
          </div>
          <p className="text-[11px] text-neon-success mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {workouts.length === 0 ? 'Start your first session' : 'All sessions recorded'}
          </p>
        </div>

        {/* Card 2: Total Weight Lifted */}
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-5 hover:border-neon-violet/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Weight Lifted</span>
            <div className="w-9 h-9 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              {preferredUnit === 'LB'
                ? (metrics.totalLiftedLbs || 0).toLocaleString()
                : (metrics.totalLiftedKg || 0).toLocaleString()}
            </span>
            <span className="text-xs text-neon-cyan ml-1.5 font-mono font-bold">
              {preferredUnit}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {preferredUnit === 'LB'
              ? `≈ ${(metrics.totalLiftedKg || 0).toLocaleString()} KG`
              : `≈ ${(metrics.totalLiftedLbs || 0).toLocaleString()} LB`}
          </p>
        </div>

        {/* Card 3: Current Workout Streak */}
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-5 hover:border-neon-gold/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Streak</span>
            <div className="w-9 h-9 rounded-xl bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              {metrics.currentStreak}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">days active</span>
          </div>
          <p className="text-[11px] text-neon-gold mt-1 font-medium">
            {metrics.currentStreak === 0 ? 'Log a session to start streak' : 'Consistent training rhythm'}
          </p>
        </div>

        {/* Card 4: Personal Records */}
        <div className="bg-midnight-card border border-midnight-border rounded-2xl p-5 hover:border-neon-cyan/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Personal Records</span>
            <div className="w-9 h-9 rounded-xl bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white tracking-tight font-mono">
              {Object.keys(metrics.personalRecords || {}).length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">PR milestones</span>
          </div>
          <p className="text-[11px] text-neon-cyan mt-1 font-medium">
            {Object.keys(metrics.personalRecords || {}).length === 0 ? 'Record sets to set PRs' : 'Bench, Squat & Deadlift PRs'}
          </p>
        </div>

      </div>

      {/* 3. Main Grid: Weekly Activity Chart (B) & Strength Overview (C) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart (Recharts) */}
        <div className="lg:col-span-2 bg-midnight-card border border-midnight-border rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neon-cyan" />
                Weekly Workout Activity
              </h3>
              <p className="text-xs text-slate-400">
                Total training volume lifted over the past 7 days ({preferredUnit})
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-midnight-elevated text-neon-cyan border border-midnight-border">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17233B" vertical={false} />
                <XAxis 
                  dataKey="day" 
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
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(53, 217, 232, 0.06)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-midnight-bg border border-midnight-border p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-white">{data.day} ({data.date})</p>
                          <p className="text-neon-cyan font-mono font-bold">
                            Volume: {data.volume.toLocaleString()} {preferredUnit}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            Workouts: {data.workoutsCount}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#35D9E8" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength Overview (C) */}
        <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-violet" />
                Strength Overview
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-neon-cyan hover:underline font-semibold flex items-center gap-1"
              >
                Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {strengthOverviewList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-midnight-bg border border-midnight-border text-center space-y-2.5 my-auto">
                <div className="w-10 h-10 mx-auto rounded-xl bg-neon-gold/10 border border-neon-gold/20 flex items-center justify-center text-neon-gold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">No PRs Logged Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    Record your working sets in the Workout Tracker to establish your Personal Records.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Workout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {strengthOverviewList.map((item) => {
                  const displayWeight = preferredUnit === 'LB'
                    ? Math.round(item.maxWeightKg * KG_TO_LBS * 10) / 10
                    : item.maxWeightKg;

                  return (
                    <div
                      key={item.name}
                      className="p-3 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-between hover:border-midnight-border/80 transition"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.reps} reps peak set
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-neon-cyan">
                          {displayWeight} {preferredUnit}
                        </span>
                        <span className="block text-[10px] text-neon-gold font-mono font-bold">
                          {item.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-midnight-border">
            <button
              onClick={() => setActiveTab('records')}
              className="w-full py-2 px-3 rounded-xl bg-midnight-elevated hover:bg-[#1e2f50] text-neon-gold text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View All Personal Records</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Section A: Recent Workouts & Section E: Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Workouts (A) */}
        <div className="lg:col-span-2 bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neon-cyan" />
                Recent Workout Sessions
              </h3>
              <p className="text-xs text-slate-400">
                Last recorded sessions with exercises and volume
              </p>
            </div>

            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-neon-cyan hover:underline font-semibold flex items-center gap-1"
            >
              Full History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {workouts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-midnight-bg border border-midnight-border text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No workouts recorded yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Welcome to PlateSync! Start tracking your training or calculate your first barbell load to begin building your workout history.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neon-cyan text-slate-950 font-black text-xs rounded-xl shadow-md shadow-neon-cyan/20 hover:bg-[#29bfcd] transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start First Workout</span>
                </button>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight-elevated text-slate-200 hover:text-white border border-midnight-border font-bold text-xs rounded-xl transition"
                >
                  <Calculator className="w-4 h-4 text-neon-cyan" />
                  <span>Calculate Load</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((w) => {
                const durationMin = Math.round((w.duration || 3600) / 60);
                const dateStr = new Date(w.date || w.createdAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={w.id}
                    onClick={() => setActiveTab('history')}
                    className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/40 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-neon-cyan flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {durationMin} min
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-neon-cyan transition truncate">
                        {w.workoutName}
                      </h4>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {w.exercises?.map((ex, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-midnight-card border border-midnight-border text-slate-300">
                            {ex.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-midnight-border">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Volume</span>
                      <span className="text-sm font-black font-mono text-neon-cyan">
                        {preferredUnit === 'LB'
                          ? `${(w.totalVolumeLbs || ((w.totalVolumeKg || w.totalVolume || 0) * KG_TO_LBS)).toLocaleString()} LB`
                          : `${(w.totalVolumeKg || w.totalVolume || 0).toLocaleString()} KG`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section E: Quick Actions */}
        <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-cyan" />
              Quick Actions
            </h3>
            <p className="text-xs text-slate-400">
              Shortcuts for gym floor operations
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('tracker')}
              className="w-full p-3 rounded-2xl bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-neon-cyan">
                    Start Workout
                  </span>
                  <span className="text-[10px] text-slate-400">Launch live workout tracker</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className="w-full p-3 rounded-2xl bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-neon-cyan">
                    Calculate Weight
                  </span>
                  <span className="text-[10px] text-slate-400">Load mixed KG & LB barbell</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className="w-full p-3 rounded-2xl bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-neon-violet">
                    View History
                  </span>
                  <span className="text-[10px] text-slate-400">Inspect past logs & sets</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-violet transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full p-3 rounded-2xl bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-neon-blue">
                    View Analytics
                  </span>
                  <span className="text-[10px] text-slate-400">Track tonnage progression</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-blue transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
