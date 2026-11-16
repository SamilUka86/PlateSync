import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Dumbbell, 
  Calendar, 
  BarChart3, 
  Layers, 
  Award,
  ChevronDown,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { getWeightLogs } from '../../services/firestore/firestoreService';

export const AnalyticsPage = () => {
  const { workouts, metrics } = useWorkout();
  const { userProfile, currentUser, isDemoMode } = useAuth();
  const rawUnit = userProfile?.preferredUnit || 'KG';
  const preferredUnit = (rawUnit === 'LB' || rawUnit === 'LBS') ? 'LBS' : 'KG';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [selectedExerciseName, setSelectedExerciseName] = useState('Barbell Bench Press');
  const [weightLogs, setWeightLogs] = useState([]);

  const userId = currentUser?.uid || (isDemoMode ? 'demo_athlete_platesync' : 'guest_local');

  useEffect(() => {
    let mounted = true;
    getWeightLogs(userId).then(logs => {
      if (mounted && logs) setWeightLogs(logs);
    });
    return () => { mounted = false; };
  }, [userId, userProfile?.bodyWeight]);

  // Body weight progression over time
  const weightTrendData = useMemo(() => {
    if (!weightLogs || weightLogs.length === 0) {
      const baseKg = Number(userProfile?.bodyWeight) || 75;
      return [
        {
          date: 'Current',
          weight: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? Math.round(baseKg * KG_TO_LBS * 100) / 100 : baseKg,
          kg: baseKg,
          lbs: Math.round(baseKg * KG_TO_LBS * 100) / 100
        }
      ];
    }
    return [...weightLogs].reverse().map(l => ({
      date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: (preferredUnit === 'LB' || preferredUnit === 'LBS') ? (l.weightLb || Math.round(l.weightKg * KG_TO_LBS * 100) / 100) : l.weightKg,
      kg: l.weightKg,
      lbs: l.weightLb || Math.round(l.weightKg * KG_TO_LBS * 100) / 100,
      fullDate: l.date
    }));
  }, [weightLogs, preferredUnit, userProfile?.bodyWeight]);

  // Volume progression over time data
  const volumeData = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
    return sorted.map((w) => {
      const isLb = (preferredUnit === 'LB' || preferredUnit === 'LBS');
      const vol = isLb
        ? (w.totalVolumeLbs || ((w.totalVolumeKg || w.totalVolume || 0) * KG_TO_LBS))
        : (w.totalVolumeKg || w.totalVolume || 0);
      return {
        date: new Date(w.date || w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        volume: Math.round(vol),
        name: w.workoutName || w.title
      };
    });
  }, [workouts, preferredUnit]);

  // Exercise strength progression curve
  const exerciseStrengthData = useMemo(() => {
    const list = [];
    const sorted = [...workouts].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

    sorted.forEach((w) => {
      const match = w.exercises?.find(e => e.name.toLowerCase().includes(selectedExerciseName.toLowerCase()));
      if (match && match.sets) {
        let maxWeightKg = 0;
        match.sets.forEach((s) => {
          const isLb = (s.unit === 'LB' || s.unit === 'LBS');
          const wKg = isLb ? (Number(s.weight) || 0) / KG_TO_LBS : (Number(s.weight) || 0);
          if (wKg > maxWeightKg) maxWeightKg = wKg;
        });

        if (maxWeightKg > 0) {
          const isLb = (preferredUnit === 'LB' || preferredUnit === 'LBS');
          const displayW = isLb
            ? Math.round(maxWeightKg * KG_TO_LBS * 100) / 100
            : Math.round(maxWeightKg * 100) / 100;

          list.push({
            date: new Date(w.date || w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            weight: displayW,
            kg: Math.round(maxWeightKg * 100) / 100,
            lbs: Math.round(maxWeightKg * KG_TO_LBS * 100) / 100
          });
        }
      }
    });

    return list;
  }, [workouts, selectedExerciseName, preferredUnit]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider">
              Strength Analytics & Volume Tonnage Curves
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Progress & Performance Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive charts displaying strength progression and training tonnage.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-midnight-bg border border-midnight-border text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">All-Time Volume</span>
          <span className="text-lg font-black font-mono text-neon-cyan">
            {preferredUnit === 'LBS' ? `${(metrics.totalLiftedLbs || 0).toLocaleString()} LBS` : `${(metrics.totalLiftedKg || 0).toLocaleString()} KG`}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Volume Over Time (Area Chart - Cyan) */}
        <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-cyan" />
                Training Volume Progression
              </h3>
              <p className="text-xs text-slate-400">Total weight lifted per session ({preferredUnit})</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#35D9E8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#35D9E8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#17233B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#26334D' }} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#26334D' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-midnight-bg border border-midnight-border p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="text-neon-cyan font-mono font-bold">Volume: {data.volume.toLocaleString()} {preferredUnit}</p>
                          <p className="text-slate-400 text-[10px]">{data.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#35D9E8" strokeWidth={2.5} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Exercise Strength Progression (Line Chart - Violet) */}
        <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-neon-violet" />
                Exercise Strength Curve
              </h3>
              <p className="text-xs text-slate-400">Peak working load per session ({preferredUnit})</p>
            </div>

            <select
              value={selectedExerciseName}
              onChange={(e) => setSelectedExerciseName(e.target.value)}
              className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
            >
              <option value="Barbell Bench Press">Barbell Bench Press</option>
              <option value="Deadlift">Deadlift</option>
              <option value="Barbell Squat">Barbell Squat</option>
              <option value="Standing Barbell Shoulder Press">Shoulder Press (OHP)</option>
              <option value="Barbell Row">Barbell Row</option>
            </select>
          </div>

          <div className="h-64 w-full">
            {exerciseStrengthData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Log sessions with {selectedExerciseName} to see your curve!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseStrengthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17233B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#26334D' }} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#26334D' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-midnight-bg border border-midnight-border p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white">{selectedExerciseName}</p>
                            <p className="text-neon-violet font-mono font-bold">{data.weight} {preferredUnit}</p>
                            <p className="text-slate-400 text-[10px] font-mono">({preferredUnit === 'LBS' ? `${data.kg} KG` : `${data.lbs} LBS`}) &bull; {data.date}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#A855F7" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#A855F7', r: 4 }} 
                    activeDot={{ r: 6, fill: '#c084fc' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Body Weight Progression (Cyan Area Chart) */}
        <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-neon-cyan" />
                Athlete Body Weight Trajectory
              </h3>
              <p className="text-xs text-slate-400">Track body weight fluctuations over time ({preferredUnit})</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Current Weight</span>
              <span className="text-xs font-mono font-bold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                {preferredUnit === 'LBS' ? `${Math.round((userProfile?.bodyWeight || 75) * KG_TO_LBS * 100) / 100} lbs` : `${userProfile?.bodyWeight || 75} kg`}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {weightTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Log your body weight in the sidebar to see your progression curve!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#35D9E8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#35D9E8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17233B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#26334D' }} />
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
                          <div className="bg-midnight-bg border border-midnight-border p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white">Body Weight</p>
                            <p className="text-neon-cyan font-mono font-bold">{data.weight} {preferredUnit}</p>
                            <p className="text-slate-400 text-[10px] font-mono">
                              ({preferredUnit === 'LBS' ? `${data.kg} KG` : `${data.lbs} LBS`}) &bull; {data.date}
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
                    fill="url(#weightGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
