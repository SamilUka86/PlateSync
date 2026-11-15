import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Dumbbell, 
  Plus, 
  Play, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Edit3, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  Flame,
  ArrowRight,
  Copy,
  ChevronRight,
  ShieldCheck,
  Check,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { DAYS_OF_WEEK } from '../../utils/routinePresets';
import { AddPlanExerciseModal, SIX_BODY_PARTS } from '../../components/planner/AddPlanExerciseModal';
import { EditPlanExerciseModal } from '../../components/planner/EditPlanExerciseModal';
import { getWeightLogs } from '../../services/firestore/firestoreService';
import { KG_TO_LBS } from '../../utils/weightCalculations';

export const WeeklyPlannerPage = ({ setActiveTab }) => {
  const { userProfile, currentUser, isDemoMode } = useAuth();
  const { 
    weeklyRoutine, 
    updateDayRoutine, 
    resetWeeklyRoutine, 
    startRoutineDayWorkout 
  } = useWorkout();
  const { addNotification } = useNotification();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Fetch body weight logs to display overall trend on rest & active recovery days
  const userId = currentUser?.uid || (isDemoMode ? 'demo_athlete_platesync' : 'guest_local');
  const [weightLogs, setWeightLogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    getWeightLogs(userId).then(logs => {
      if (mounted && logs) setWeightLogs(logs);
    });
    return () => { mounted = false; };
  }, [userId, userProfile?.bodyWeight]);

  const preferredUnit = (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG';

  // Compute Current Weight & Overall Trend (identically to Weight Tracker)
  const weightTrendData = useMemo(() => {
    const baseKg = Number(userProfile?.bodyWeight) || 75;
    if (!weightLogs || weightLogs.length === 0) {
      const displayCurrent = preferredUnit === 'LBS'
        ? `${Math.round(baseKg * KG_TO_LBS * 10) / 10} lbs`
        : `${Math.round(baseKg * 10) / 10} kg`;
      return {
        current: displayCurrent,
        trend: { type: 'neutral', value: '0.0 kg' },
        hasLogs: false
      };
    }

    const currentKg = weightLogs[0].weightKg;
    const oldestKg = weightLogs[weightLogs.length - 1].weightKg;
    const diffKg = Math.round((currentKg - oldestKg) * 10) / 10;

    let trendType = 'neutral';
    let trendValue = '0.0 kg';
    if (Math.abs(diffKg) >= 0.05) {
      if (diffKg > 0) {
        trendType = 'up';
        trendValue = preferredUnit === 'LBS'
          ? `+${Math.round(diffKg * KG_TO_LBS * 10) / 10} lbs`
          : `+${diffKg} kg`;
      } else {
        trendType = 'down';
        trendValue = preferredUnit === 'LBS'
          ? `${Math.round(diffKg * KG_TO_LBS * 10) / 10} lbs`
          : `${diffKg} kg`;
      }
    }

    const displayCurrent = preferredUnit === 'LBS'
      ? `${(weightLogs[0].weightLb || Math.round(currentKg * KG_TO_LBS * 10) / 10)} lbs`
      : `${Math.round(currentKg * 10) / 10} kg`;

    return {
      current: displayCurrent,
      trend: { type: trendType, value: trendValue },
      hasLogs: true,
      totalLogs: weightLogs.length,
      latestDate: weightLogs[0].date
    };
  }, [weightLogs, preferredUnit, userProfile?.bodyWeight]);

  // Find today's day key (Mon - Sun)
  const currentDayKey = useMemo(() => {
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayMap[new Date().getDay()];
  }, []);

  // Active selected day in editor (default to current day or 'monday')
  const [selectedDayKey, setSelectedDayKey] = useState(currentDayKey || 'monday');

  // View Mode: 'focus' (deep day editor) | 'overview' (7-day grid)
  const [viewMode, setViewMode] = useState('focus');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialMuscle, setAddModalInitialMuscle] = useState('All');
  const [editingExercise, setEditingExercise] = useState(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const handleOpenAddModal = (muscle = 'All') => {
    setAddModalInitialMuscle(muscle);
    setIsAddModalOpen(true);
  };

  // Active day data
  const activeDay = weeklyRoutine?.[selectedDayKey] || {
    id: selectedDayKey,
    dayName: selectedDayKey.charAt(0).toUpperCase() + selectedDayKey.slice(1),
    isRestDay: false,
    title: `${selectedDayKey.toUpperCase()} Workout`,
    focus: 'Hypertrophy',
    targetDuration: 60,
    exercises: []
  };

  // Weekly Stats calculations
  const stats = useMemo(() => {
    let totalWorkouts = 0;
    let totalRestDays = 0;
    let totalExercises = 0;

    DAYS_OF_WEEK.forEach(({ key }) => {
      const day = weeklyRoutine?.[key];
      if (day?.isRestDay) {
        totalRestDays += 1;
      } else {
        totalWorkouts += 1;
        totalExercises += (day?.exercises?.length || 0);
      }
    });

    return { totalWorkouts, totalRestDays, totalExercises };
  }, [weeklyRoutine]);

  // Handlers for Active Day
  const handleToggleRestDay = () => {
    const nextRest = !activeDay.isRestDay;
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      isRestDay: nextRest,
      title: nextRest ? 'Rest & Active Recovery' : `${activeDay.dayName} Workout`
    });
    addNotification(
      nextRest ? `${activeDay.dayName} marked as Rest Day.` : `${activeDay.dayName} activated for training!`,
      'info'
    );
  };

  const handleUpdateTitle = (val) => {
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      title: val
    });
  };

  const handleUpdateFocus = (val) => {
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      focus: val
    });
  };

  const handleUpdateDuration = (val) => {
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      targetDuration: Number(val) || 0
    });
  };

  // Exercise manipulation in active day
  const handleAddExerciseToActiveDay = (exercise) => {
    const updatedExercises = [...(activeDay.exercises || []), exercise];
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      exercises: updatedExercises
    });
    addNotification(`Added "${exercise.name}" to ${activeDay.dayName}`, 'success');
  };

  const handleSaveEditedExercise = (updatedEx) => {
    const updatedExercises = (activeDay.exercises || []).map(ex => 
      ex.id === updatedEx.id ? updatedEx : ex
    );
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      exercises: updatedExercises
    });
    addNotification('Exercise targets updated', 'info');
  };

  const handleRemoveExercise = (exerciseId) => {
    const updatedExercises = (activeDay.exercises || []).filter(ex => ex.id !== exerciseId);
    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      exercises: updatedExercises
    });
    addNotification('Exercise removed from schedule', 'info');
  };

  const handleMoveExercise = (index, direction) => {
    const exercises = [...(activeDay.exercises || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;

    const temp = exercises[index];
    exercises[index] = exercises[targetIndex];
    exercises[targetIndex] = temp;

    updateDayRoutine(selectedDayKey, {
      ...activeDay,
      exercises
    });
  };

  // Quick Duplicate Day
  const handleCopyDayTo = (targetDayKey) => {
    if (targetDayKey === selectedDayKey) return;
    const targetDayName = DAYS_OF_WEEK.find(d => d.key === targetDayKey)?.name || targetDayKey;
    const clonedExercises = (activeDay.exercises || []).map(ex => ({
      ...ex,
      id: `plan_ex_${Date.now()}_${Math.random()}`
    }));

    updateDayRoutine(targetDayKey, {
      ...activeDay,
      id: targetDayKey,
      dayName: targetDayName,
      title: activeDay.title ? `${activeDay.title} (Copy)` : `${targetDayName} Workout`,
      exercises: clonedExercises
    });

    addNotification(`Copied ${activeDay.dayName} routine to ${targetDayName}!`, 'success');
  };

  const handleApplyTemplate = (templateKey) => {
    resetWeeklyRoutine(templateKey);
    setShowTemplateDropdown(false);
    addNotification(`Applied template preset to your weekly split!`, 'success');
  };

  const handleStartWorkout = (dayKey) => {
    startRoutineDayWorkout(dayKey, setActiveTab);
    addNotification(`Workout started for ${weeklyRoutine?.[dayKey]?.dayName}! Have a great session.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner / Hero Card */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 relative shadow-2xl">
        {/* Background decorative glow (strictly clipped inside card) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-violet/5 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>Monday to Sunday Training Split</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Weekly Workout Planner
            </h1>

            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              Design and organize your manual workouts for every day of the week. Select from our 160+ exercise database or create your own custom exercises with custom sets, reps, and weights.
            </p>
          </div>

          {/* Preset Splits Dropdown & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="p-1 bg-midnight-bg border border-midnight-border rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('focus')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  viewMode === 'focus' 
                    ? 'bg-neon-cyan text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Day Focus
              </button>
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  viewMode === 'overview' 
                    ? 'bg-neon-cyan text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7-Day Overview
              </button>
            </div>

            {/* Split Presets Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="px-3.5 py-2 rounded-2xl border border-midnight-border bg-midnight-bg hover:bg-midnight-elevated text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <Layers className="w-3.5 h-3.5 text-neon-cyan" />
                <span>Split Presets</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showTemplateDropdown && (
                <>
                  {/* Backdrop to close when clicking outside */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowTemplateDropdown(false)} 
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 max-w-[calc(100vw-2.5rem)] bg-midnight-card border border-midnight-border rounded-2xl shadow-2xl p-2 z-40 space-y-1 animate-in fade-in">
                    <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono">
                      Select Training Split:
                    </p>
                    <button
                      onClick={() => {
                        handleApplyTemplate('ppl');
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-midnight-elevated text-slate-300 hover:text-white transition flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white block">Push / Pull / Legs</span>
                        <span className="text-[10px] text-slate-400">6-Day Split &bull; High Frequency</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-neon-cyan shrink-0 ml-2" />
                    </button>
                    <button
                      onClick={() => {
                        handleApplyTemplate('upper-lower');
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-midnight-elevated text-slate-300 hover:text-white transition"
                    >
                      <span className="font-bold text-white block">Upper / Lower</span>
                      <span className="text-[10px] text-slate-400">4-Day Split &bull; Strength &amp; Mass</span>
                    </button>
                    <button
                      onClick={() => {
                        handleApplyTemplate('full-body');
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-midnight-elevated text-slate-300 hover:text-white transition"
                    >
                      <span className="font-bold text-white block">Full Body Foundation</span>
                      <span className="text-[10px] text-slate-400">3-Day Split &bull; High Efficiency</span>
                    </button>
                    <div className="border-t border-midnight-border my-1" />
                    <button
                      onClick={() => {
                        handleApplyTemplate('blank');
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear / Start Blank</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 pt-6 border-t border-midnight-border">
          <div className="p-3 md:p-4 rounded-2xl bg-midnight-bg/60 border border-midnight-border flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 font-mono tracking-wider truncate">Training Days</p>
              <p className="text-sm md:text-base font-black text-white truncate">{stats.totalWorkouts} Workouts</p>
            </div>
          </div>

          <div className="p-3 md:p-4 rounded-2xl bg-midnight-bg/60 border border-midnight-border flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center text-neon-violet shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 font-mono tracking-wider truncate">Rest Days</p>
              <p className="text-sm md:text-base font-black text-white truncate">{stats.totalRestDays} Recovery</p>
            </div>
          </div>

          <div className="p-3 md:p-4 rounded-2xl bg-midnight-bg/60 border border-midnight-border flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neon-success/10 border border-neon-success/30 flex items-center justify-center text-neon-success shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 font-mono tracking-wider truncate">Movements</p>
              <p className="text-sm md:text-base font-black text-white truncate">{stats.totalExercises} Planned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monday to Sunday Day Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map(({ key, name, short }) => {
          const isSelected = selectedDayKey === key;
          const isToday = currentDayKey === key;
          const dayData = weeklyRoutine?.[key];
          const isRest = dayData?.isRestDay;
          const exCount = dayData?.exercises?.length || 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedDayKey(key);
                if (viewMode === 'overview') setViewMode('focus');
              }}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-midnight-card border-neon-cyan shadow-lg shadow-neon-cyan/15 ring-1 ring-neon-cyan'
                  : 'bg-midnight-card/80 border-midnight-border hover:border-slate-600 hover:bg-midnight-elevated'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-neon-cyan' : 'text-slate-300'}`}>
                  {short}
                </span>

                {isToday && (
                  <span className="px-1.5 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-[9px] font-black font-mono">
                    TODAY
                  </span>
                )}
              </div>

              {/* Day Subtitle */}
              <p className="text-[11px] font-medium text-white truncate mb-2">
                {isRest ? 'Rest Day' : (dayData?.title || `${name}`)}
              </p>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 text-[10px]">
                {isRest ? (
                  <span className="px-2 py-0.5 rounded-md bg-neon-violet/10 border border-neon-violet/20 text-neon-violet font-semibold">
                    Rest
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-semibold">
                    {exCount} {exCount === 1 ? 'Exercise' : 'Exercises'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main View Area: Focus Day Editor OR 7-Day Overview Grid */}
      {viewMode === 'focus' ? (
        /* SINGLE DAY DETAILED EDITOR */
        <div className="space-y-6">
          {/* Day Controls Header */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 relative overflow-hidden space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-midnight-border">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {activeDay.dayName}
                  </h2>
                  {currentDayKey === selectedDayKey && (
                    <span className="px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-[10px] font-bold">
                      Today's Workout
                    </span>
                  )}
                  {activeDay.isRestDay && (
                    <span className="px-2.5 py-0.5 rounded-full bg-neon-violet/20 border border-neon-violet/40 text-neon-violet text-xs font-bold">
                      Rest & Recovery Day
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize routine title, planned focus, and exercises for this day.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleRestDay}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                    activeDay.isRestDay
                      ? 'bg-neon-cyan text-slate-950 border-neon-cyan shadow-sm'
                      : 'bg-midnight-bg border-midnight-border text-slate-300 hover:text-white hover:bg-midnight-elevated'
                  }`}
                >
                  {activeDay.isRestDay ? 'Activate as Workout Day' : 'Mark as Rest Day'}
                </button>

                {!activeDay.isRestDay && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal('All')}
                      className="px-4 py-2 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-neon-cyan/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Exercise</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartWorkout(selectedDayKey)}
                      className="px-4 py-2 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-neon-cyan hover:text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                      title="Load this routine into the Workout Tracker"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Workout Now</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Day Title & Focus Inline Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  value={activeDay.title || ''}
                  onChange={(e) => handleUpdateTitle(e.target.value)}
                  placeholder="e.g. Push • Chest, Shoulders & Triceps"
                  className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-neon-cyan transition truncate"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Focus / Muscle Targets
                </label>
                <input
                  type="text"
                  value={activeDay.focus || ''}
                  onChange={(e) => handleUpdateFocus(e.target.value)}
                  placeholder="e.g. Hypertrophy, Heavy Bench & Delts"
                  className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan transition truncate"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Duration (Minutes)
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={activeDay.targetDuration || 60}
                    onChange={(e) => handleUpdateDuration(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-neon-cyan transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Planned Exercises Section */}
          {activeDay.isRestDay ? (
            <div className="space-y-4">
              {/* Athlete Body Weight & Overall Trend Banner (Above Rest & Active Recovery for Phone & Desktop) */}
              <div className="bg-midnight-card border border-midnight-border rounded-3xl p-5 md:p-6 shadow-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-midnight-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
                      <span className="text-[10px] uppercase font-bold text-neon-cyan tracking-wider font-mono">
                        Rest &amp; Active Recovery &bull; Body Mass Trend
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-neon-cyan" />
                      <span>Athlete Body Weight &amp; Overall Trend</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Tracking your overall weight trajectory supports recovery nutrition, caloric budgeting, and muscle rebuilding on rest days.
                    </p>
                  </div>

                  {/* Weight Tracker Stats Chips */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-4 py-2.5 rounded-2xl bg-midnight-bg border border-midnight-border text-center min-w-[110px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Current Weight</span>
                      <span className="text-base font-black font-mono text-neon-cyan">{weightTrendData.current}</span>
                    </div>

                    <div className="px-4 py-2.5 rounded-2xl bg-midnight-bg border border-midnight-border text-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Overall Trend</span>
                      <span className={`text-base font-black font-mono flex items-center justify-center gap-1.5 ${
                        weightTrendData.trend.type === 'down' ? 'text-neon-cyan' : weightTrendData.trend.type === 'up' ? 'text-neon-violet' : 'text-slate-300'
                      }`}>
                        {weightTrendData.trend.type === 'down' && <TrendingDown className="w-4 h-4" />}
                        {weightTrendData.trend.type === 'up' && <TrendingUp className="w-4 h-4" />}
                        {weightTrendData.trend.type === 'neutral' && <Minus className="w-4 h-4" />}
                        <span>{weightTrendData.trend.value}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {weightTrendData.hasLogs 
                      ? `Latest recorded: ${weightTrendData.latestDate} (${weightTrendData.totalLogs} entries)`
                      : 'Baseline athlete profile weight'}
                  </span>
                  {setActiveTab && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('bodyweight')}
                      className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Weight Tracker</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scheduled Rest & Recovery Day Card */}
              <div className="bg-midnight-card border border-midnight-border rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center text-neon-violet mx-auto shadow-lg shadow-neon-violet/10">
                  <Coffee className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Scheduled Rest & Recovery Day</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Muscle growth and neural adaptation happen during rest. Prioritize 8 hours of sleep, clean protein hydration, and light mobility or walking today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleRestDay}
                  className="px-5 py-2 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-xs text-slate-300 hover:text-white transition font-semibold"
                >
                  Change to Active Workout Day
                </button>
              </div>
            </div>
          ) : (
            /* Exercises List */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-neon-cyan" />
                  <span>Planned Exercises ({activeDay.exercises?.length || 0})</span>
                </h3>

                <button
                  type="button"
                  onClick={() => handleOpenAddModal('All')}
                  className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Exercise</span>
                </button>
              </div>

              {(!activeDay.exercises || activeDay.exercises.length === 0) ? (
                /* Empty Day State: 6 Clickable Body Part Cards */
                <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mx-auto">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-white">Select Body Parts for {activeDay.dayName}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose any of the 6 core body parts below to view its specific workouts and add them to your {activeDay.dayName} routine:
                    </p>
                  </div>

                  {/* 6 Core Body Part Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {SIX_BODY_PARTS.map((bp) => (
                      <div
                        key={bp.id}
                        onClick={() => handleOpenAddModal(bp.id)}
                        className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 hover:bg-midnight-elevated/70 transition cursor-pointer group flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl p-2 rounded-xl bg-midnight-card border border-midnight-border group-hover:scale-110 transition shrink-0">
                              {bp.icon}
                            </span>
                            <div>
                              <h5 className="text-sm font-black text-white group-hover:text-neon-cyan transition">
                                {bp.label}
                              </h5>
                              <span className="text-[10px] text-neon-cyan font-mono font-bold">
                                {bp.count} movements
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {bp.description}
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddModal(bp.id);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-neon-cyan/10 group-hover:bg-neon-cyan text-neon-cyan group-hover:text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add {bp.label} Workouts</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal('All')}
                      className="text-xs text-slate-400 hover:text-neon-cyan transition font-semibold underline underline-offset-4"
                    >
                      Or browse all 160+ movements across all muscle groups
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Quick Add by Body Part chips */}
                  <div className="p-3.5 rounded-2xl bg-midnight-card border border-midnight-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold uppercase text-slate-400 font-mono tracking-wider">
                        Add Workouts by Body Part:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal('All')}
                        className="text-[11px] font-bold text-neon-cyan hover:underline"
                      >
                        View All Movements
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {SIX_BODY_PARTS.map((bp) => (
                        <button
                          key={bp.id}
                          type="button"
                          onClick={() => handleOpenAddModal(bp.id)}
                          className="px-3 py-1.5 rounded-xl bg-midnight-bg hover:bg-neon-cyan hover:text-slate-950 text-slate-300 text-xs font-semibold border border-midnight-border transition flex items-center gap-1.5 shrink-0"
                        >
                          <span>{bp.icon}</span>
                          <span>+ {bp.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                  {activeDay.exercises.map((ex, index) => (
                    <div
                      key={ex.id || index}
                      className="bg-midnight-card border border-midnight-border hover:border-slate-700 rounded-2xl p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      {/* Left: Reorder buttons & Exercise info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Index & Reorder Controls */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveExercise(index, -1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 h-6 rounded-lg bg-midnight-bg border border-midnight-border flex items-center justify-center text-[11px] font-mono font-black text-neon-cyan">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            disabled={index === activeDay.exercises.length - 1}
                            onClick={() => handleMoveExercise(index, 1)}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Exercise Name & Badges */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white truncate">
                              {ex.name}
                            </p>
                            {ex.isCustom && (
                              <span className="px-1.5 py-0.5 rounded bg-neon-violet/10 border border-neon-violet/30 text-neon-violet text-[9px] font-bold">
                                Custom
                              </span>
                            )}
                            {ex.isLegPress45 && (
                              <span className="px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[9px] font-bold">
                                45° Sled
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                            <span className="text-neon-cyan font-bold">{ex.muscle}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-200">{ex.equipment}</span>
                            {ex.notes && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400 italic truncate max-w-xs">{ex.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Targets & Action buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-midnight-border">
                        {/* Target Stats Box */}
                        <div className="flex items-center gap-2 text-right">
                          <div className="px-3 py-1.5 rounded-xl bg-midnight-bg border border-slate-700/80 font-mono text-center min-w-0">
                            <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider truncate">Sets × Reps</p>
                            <p className="text-xs sm:text-sm font-black text-white truncate">{ex.targetSets} × {ex.targetReps}</p>
                          </div>

                          {Number(ex.targetWeight) > 0 && (
                            <div className="px-3 py-1.5 rounded-xl bg-midnight-bg border border-slate-700/80 font-mono text-center min-w-0">
                              <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider truncate">Target Wt</p>
                              <p className="text-xs sm:text-sm font-black text-neon-cyan truncate">
                                {ex.targetWeight} {ex.unit || 'KG'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Edit & Remove Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingExercise(ex)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-midnight-elevated rounded-xl transition"
                            title="Edit Sets, Reps & Targets"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(ex.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

          {/* Bottom Duplicate Helper */}
          <div className="p-4 rounded-2xl bg-midnight-card border border-midnight-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-neon-cyan" />
              Copy this day&apos;s routine ({activeDay.dayName}) to another day:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {DAYS_OF_WEEK.filter(d => d.key !== selectedDayKey).map(({ key, short }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCopyDayTo(key)}
                  className="px-2.5 py-1 rounded-lg bg-midnight-bg hover:bg-neon-cyan hover:text-slate-950 border border-midnight-border text-[11px] font-bold text-slate-300 transition"
                  title={`Copy ${activeDay.dayName} to ${short}`}
                >
                  {short}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 7-DAY OVERVIEW GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS_OF_WEEK.map(({ key, name, short }) => {
            const day = weeklyRoutine?.[key] || { dayName: name, isRestDay: false, exercises: [] };
            const isToday = currentDayKey === key;

            return (
              <div
                key={key}
                className={`bg-midnight-card border rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 ${
                  isToday 
                    ? 'border-neon-cyan shadow-lg shadow-neon-cyan/15 ring-1 ring-neon-cyan' 
                    : 'border-midnight-border hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-neon-cyan font-mono tracking-wider">
                      {name}
                    </span>

                    {isToday && (
                      <span className="px-1.5 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-[9px] font-black font-mono">
                        TODAY
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-white mb-1 truncate">
                    {day.isRestDay ? 'Rest & Recovery' : (day.title || `${name} Workout`)}
                  </h4>

                  <p className="text-[11px] text-slate-400 mb-4 truncate">
                    {day.focus || (day.isRestDay ? 'Rest & Sleep' : 'Strength')}
                  </p>

                  {/* Exercises Mini List */}
                  {day.isRestDay ? (
                    <div className="p-4 rounded-2xl bg-midnight-bg/60 border border-midnight-border text-center space-y-1 my-3">
                      <Coffee className="w-5 h-5 text-neon-violet mx-auto" />
                      <p className="text-[11px] font-bold text-slate-300">Rest Day</p>
                      <p className="text-[10px] text-slate-500">Recovery & Nutrition</p>
                    </div>
                  ) : (!day.exercises || day.exercises.length === 0) ? (
                    <div className="p-4 rounded-2xl bg-midnight-bg/60 border border-dashed border-midnight-border text-center my-3 text-[11px] text-slate-500">
                      No exercises added yet
                    </div>
                  ) : (
                    <div className="space-y-1.5 my-3">
                      {day.exercises.slice(0, 4).map((ex, i) => (
                        <div key={ex.id || i} className="p-2 rounded-xl bg-midnight-bg/80 border border-midnight-border flex items-center justify-between text-xs">
                          <span className="text-slate-200 truncate pr-2 font-medium">
                            {ex.name}
                          </span>
                          <span className="text-[10px] font-mono text-neon-cyan shrink-0 font-bold">
                            {ex.targetSets}×{ex.targetReps}
                          </span>
                        </div>
                      ))}
                      {day.exercises.length > 4 && (
                        <p className="text-[10px] text-slate-500 text-center font-mono">
                          +{day.exercises.length - 4} more exercises
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-midnight-border flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDayKey(key);
                      setViewMode('focus');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>Edit Day</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {!day.isRestDay && (day.exercises?.length > 0) && (
                    <button
                      type="button"
                      onClick={() => handleStartWorkout(key)}
                      className="px-3 py-1.5 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-bold text-xs flex items-center gap-1 transition shadow-sm"
                      title="Start this workout in tracker"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Exercise Modal (Supports 160+ Library + Custom creation) */}
      <AddPlanExerciseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        dayKey={selectedDayKey}
        dayName={activeDay.dayName}
        onAddExercise={handleAddExerciseToActiveDay}
        initialMuscle={addModalInitialMuscle}
      />

      {/* Edit Exercise Modal */}
      <EditPlanExerciseModal
        isOpen={Boolean(editingExercise)}
        onClose={() => setEditingExercise(null)}
        exercise={editingExercise}
        onSave={handleSaveEditedExercise}
        onRemove={handleRemoveExercise}
      />

    </div>
  );
};

export default WeeklyPlannerPage;
