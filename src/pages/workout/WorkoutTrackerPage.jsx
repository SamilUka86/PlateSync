import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Dumbbell, 
  Timer, 
  Save, 
  X, 
  AlertCircle, 
  Trophy, 
  Calculator,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Copy,
  ArrowRight,
  Star,
  History,
  BookOpen,
  Languages,
  Info,
  Filter,
  Search,
  CheckCircle2,
  FolderTree,
  Maximize2,
  Minimize2,
  RotateCcw,
  Target
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  EXERCISE_DATABASE, 
  MAIN_MUSCLE_GROUPS,
  MUSCLE_GROUPS, 
  MUSCLE_SUBGROUPS,
  EQUIPMENT_TYPES, 
  DIFFICULTY_LEVELS, 
  EXERCISE_TYPES 
} from '../../utils/exerciseData';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { ExerciseDetailModal } from '../../components/library/ExerciseDetailModal';
import { RestTimerWidget } from '../../components/workout/RestTimerWidget';
import { WorkoutShareModal } from '../../components/workout/WorkoutShareModal';
import { 
  playRestFinishedChime, 
  playCountdownTick, 
  triggerVibration, 
  triggerShortHaptic 
} from '../../utils/audioHaptics';

export const WorkoutTrackerPage = ({ setActiveTab }) => {
  const { userProfile } = useAuth();
  const { stagedWeight, setStagedWeight, saveWorkout } = useWorkout();
  const { addNotification } = useNotification();

  // Active workout session state
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_live_workout');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [sessionTitle, setSessionTitle] = useState('Strength Training Session');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest Timer state
  const [restSeconds, setRestSeconds] = useState(null);
  const [initialRestSeconds, setInitialRestSeconds] = useState(90);

  // Workout Summary Share Modal state
  const [completedWorkoutForShare, setCompletedWorkoutForShare] = useState(null);

  // Exercise selector modal state
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  const [selectedSubgroupFilter, setSelectedSubgroupFilter] = useState('All');
  const [expandedMusclesInModal, setExpandedMusclesInModal] = useState({ 'Chest': true });
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState('All Equipment');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('All Levels');
  const [activeSelectorTab, setActiveSelectorTab] = useState('all'); // 'all' | 'favorites' | 'recent' | 'custom'

  const toggleMuscleExpandInModal = (muscle, e) => {
    if (e) e.stopPropagation();
    setExpandedMusclesInModal(prev => ({
      ...prev,
      [muscle]: !prev[muscle]
    }));
  };

  const handleExpandAllInModal = () => {
    const all = {};
    MAIN_MUSCLE_GROUPS.forEach(m => { all[m] = true; });
    setExpandedMusclesInModal(all);
  };

  const handleCollapseAllInModal = () => {
    const all = {};
    MAIN_MUSCLE_GROUPS.forEach(m => { all[m] = false; });
    setExpandedMusclesInModal(all);
  };

  const handleResetModalFilters = () => {
    setExerciseSearch('');
    setSelectedMuscleFilter('All');
    setSelectedSubgroupFilter('All');
    setSelectedEquipmentFilter('All Equipment');
    setSelectedTypeFilter('All Types');
    setSelectedDifficultyFilter('All Levels');
  };

  // Custom exercise modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [customEquipment, setCustomEquipment] = useState('Barbell');
  const [customType, setCustomType] = useState('Compound');
  const [customDifficulty, setCustomDifficulty] = useState('Intermediate');
  const [customInstructions, setCustomInstructions] = useState('');

  // Favorites state (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_favorite_exercises');
      return stored ? JSON.parse(stored) : ['flat-barbell-bench-press', 'barbell-back-squat', 'conventional-deadlift', 'leg-press-45-degree'];
    } catch (e) {
      return ['flat-barbell-bench-press', 'barbell-back-squat', 'conventional-deadlift', 'leg-press-45-degree'];
    }
  });

  // Recently used exercises state (persisted in localStorage)
  const [recentExerciseIds, setRecentExerciseIds] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_recent_exercises');
      return stored ? JSON.parse(stored) : ['flat-barbell-bench-press', 'barbell-row', 'leg-press-45-degree'];
    } catch (e) {
      return ['flat-barbell-bench-press', 'barbell-row', 'leg-press-45-degree'];
    }
  });

  // User created custom exercises (persisted in localStorage)
  const [customExercises, setCustomExercises] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_custom_exercises');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Preview & Hindi guide modal
  const [previewExercise, setPreviewExercise] = useState(null);

  // Sync active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('platesync_live_workout', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('platesync_live_workout');
    }
  }, [activeSession]);

  // Listen for externally loaded routine sessions (e.g. from Weekly Planner or Dashboard)
  useEffect(() => {
    const handleLoadExternalSession = (e) => {
      if (e.detail) {
        setActiveSession(e.detail);
        setSessionTitle(e.detail.workoutName || 'Strength Training Session');
        setElapsedSeconds(0);
      }
    };
    window.addEventListener('platesync_load_workout_session', handleLoadExternalSession);
    return () => window.removeEventListener('platesync_load_workout_session', handleLoadExternalSession);
  }, []);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('platesync_favorite_exercises', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Sync recent
  useEffect(() => {
    try {
      localStorage.setItem('platesync_recent_exercises', JSON.stringify(recentExerciseIds));
    } catch (e) {}
  }, [recentExerciseIds]);

  // Sync custom exercises
  useEffect(() => {
    try {
      localStorage.setItem('platesync_custom_exercises', JSON.stringify(customExercises));
    } catch (e) {}
  }, [customExercises]);

  // Elapsed timer interval
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Rest timer countdown with audio chime & haptic vibration
  useEffect(() => {
    if (restSeconds === null || restSeconds < 0) return;

    if (restSeconds === 0) {
      // Rest period elapsed!
      const soundOn = localStorage.getItem('platesync_timer_sound') !== 'false';
      if (soundOn) {
        playRestFinishedChime();
      }
      const vibrateOn = localStorage.getItem('platesync_timer_vibrate') !== 'false';
      if (vibrateOn) {
        triggerVibration([300, 100, 300, 100, 500]);
      }
      addNotification('Rest period complete! Get ready for your next set.', 'info', 4000);
      return;
    }

    // Play countdown tick on 3, 2, 1 seconds
    if (restSeconds <= 3 && restSeconds > 0) {
      const soundOn = localStorage.getItem('platesync_timer_sound') !== 'false';
      if (soundOn) playCountdownTick();
    }

    const interval = setInterval(() => {
      setRestSeconds(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restSeconds, addNotification]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartWorkout = (title = 'Strength Training Session') => {
    const newSession = {
      id: `w_${Date.now()}`,
      workoutName: title,
      date: new Date().toISOString(),
      startTime: Date.now(),
      exercises: []
    };
    setActiveSession(newSession);
    setSessionTitle(title);
    setElapsedSeconds(0);
    addNotification('Workout session started! Let\'s lift.', 'success');
  };

  // Toggle favorite
  const handleToggleFavorite = (exerciseId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(exerciseId);
      const next = isFav ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId];
      addNotification(isFav ? 'Removed from favorites' : 'Added to favorite exercises', 'info', 1500);
      return next;
    });
  };

  // Add exercise to active session
  const handleAddExercise = (exercise) => {
    if (!activeSession) return;
    const defaultUnit = userProfile?.preferredUnit || 'KG';
    const isLegPress45 = Boolean(
      exercise.isLegPress45 ||
      /45.*leg\s*press/i.test(exercise.name) ||
      /leg\s*press.*45/i.test(exercise.name)
    );

    const initialWeight = isLegPress45 ? 100 : (exercise.defaultBarbell || 20);

    const newEx = {
      id: `ex_${Date.now()}_${Math.random()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      category: exercise.category,
      isLegPress45: isLegPress45,
      sets: [
        { 
          setNumber: 1, 
          weight: initialWeight, 
          unit: defaultUnit, 
          reps: 10, 
          completed: false, 
          isPR: false,
          isLegPress45: isLegPress45
        }
      ]
    };

    setActiveSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));

    // Update recently used
    setRecentExerciseIds(prev => [exercise.id, ...prev.filter(id => id !== exercise.id)].slice(0, 15));

    setIsExerciseModalOpen(false);
    addNotification(`Added ${exercise.name}${isLegPress45 ? ' (45° Sled Excluded)' : ''}`, 'info', 2000);
  };

  // Create custom exercise
  const handleCreateCustomExercise = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      addNotification('Please enter an exercise name', 'error');
      return;
    }

    const newCustom = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      muscle: customMuscle,
      category: customMuscle,
      equipment: customEquipment,
      type: customType,
      difficulty: customDifficulty,
      startingPosition: `Position with ${customEquipment} keeping spine neutral.`,
      instructions: customInstructions.trim() || `Perform ${customName} with controlled tempo and full range of motion.`,
      technique: 'Maintain tight core and avoid momentum.',
      breathing: 'Exhale on effort; inhale returning.',
      isCustom: true
    };

    setCustomExercises(prev => [newCustom, ...prev]);
    handleAddExercise(newCustom);
    setCustomName('');
    setCustomInstructions('');
    setIsCustomModalOpen(false);
    addNotification(`Custom exercise "${newCustom.name}" created and added!`, 'success');
  };

  const handleRemoveExercise = (exIdx) => {
    setActiveSession(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== exIdx)
    }));
  };

  const handleAddSet = (exIdx) => {
    setActiveSession(prev => {
      const ex = prev.exercises[exIdx];
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet = {
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : (ex.isLegPress45 ? 100 : 20),
        unit: lastSet ? lastSet.unit : (userProfile?.preferredUnit || 'KG'),
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
        isPR: false,
        isLegPress45: Boolean(ex.isLegPress45)
      };
      const updated = [...prev.exercises];
      updated[exIdx] = { ...ex, sets: [...ex.sets, newSet] };
      return { ...prev, exercises: updated };
    });
  };

  const handleDuplicateSet = (exIdx, setIdx) => {
    setActiveSession(prev => {
      const ex = prev.exercises[exIdx];
      const sourceSet = ex.sets[setIdx];
      const duplicatedSet = {
        ...sourceSet,
        setNumber: ex.sets.length + 1,
        completed: false
      };
      const updated = [...prev.exercises];
      updated[exIdx] = { ...ex, sets: [...ex.sets, duplicatedSet] };
      return { ...prev, exercises: updated };
    });
    addNotification('Set duplicated', 'info', 1500);
  };

  const handleUpdateSet = (exIdx, setIdx, field, val) => {
    setActiveSession(prev => {
      const ex = prev.exercises[exIdx];
      const updatedSets = ex.sets.map((s, idx) => {
        if (idx === setIdx) {
          return { ...s, [field]: val };
        }
        return s;
      });
      const updated = [...prev.exercises];
      updated[exIdx] = { ...ex, sets: updatedSets };
      return { ...prev, exercises: updated };
    });
  };

  const handleToggleComplete = (exIdx, setIdx) => {
    setActiveSession(prev => {
      const ex = prev.exercises[exIdx];
      const updatedSets = ex.sets.map((s, idx) => {
        if (idx === setIdx) {
          const nextCompleted = !s.completed;
          if (nextCompleted) {
            setRestSeconds(90); // Trigger standard 90s rest timer
            setInitialRestSeconds(90);
            const vibrateOn = localStorage.getItem('platesync_timer_vibrate') !== 'false';
            if (vibrateOn) triggerShortHaptic();
          }
          return { ...s, completed: nextCompleted };
        }
        return s;
      });
      const updated = [...prev.exercises];
      updated[exIdx] = { ...ex, sets: updatedSets };
      return { ...prev, exercises: updated };
    });
  };

  const handleRemoveSet = (exIdx, setIdx) => {
    setActiveSession(prev => {
      const ex = prev.exercises[exIdx];
      const remaining = ex.sets.filter((_, idx) => idx !== setIdx).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      const updated = [...prev.exercises];
      updated[exIdx] = { ...ex, sets: remaining };
      return { ...prev, exercises: updated };
    });
  };

  const handleApplyStagedWeight = (exIdx, setIdx) => {
    if (!stagedWeight) return;
    handleUpdateSet(exIdx, setIdx, 'weight', stagedWeight.weight);
    handleUpdateSet(exIdx, setIdx, 'unit', stagedWeight.unit);
    addNotification(`Applied ${stagedWeight.weight} ${stagedWeight.unit} from Calculator!`, 'success');
  };

  // Open Plate Calculator for specific exercise
  const handleOpenCalculatorForExercise = (exercise) => {
    const isLegPress45 = Boolean(
      exercise?.isLegPress45 ||
      /45.*leg\s*press/i.test(exercise?.name) ||
      /leg\s*press.*45/i.test(exercise?.name)
    );

    if (isLegPress45) {
      setStagedWeight({
        weight: 0,
        unit: userProfile?.preferredUnit || 'KG',
        barbellId: 'leg-press-45',
        isLegPress45: true
      });
      addNotification('Configured Plate Calculator for 45-Degree Leg Press (Sled Excluded: 0 kg)', 'info');
    }
    if (setActiveTab) setActiveTab('calculator');
  };

  const handleFinishWorkout = () => {
    if (!activeSession || activeSession.exercises.length === 0) {
      addNotification('Add at least one exercise before completing workout', 'error');
      return;
    }

    let totalVolumeKg = 0;
    let totalSets = 0;
    let totalReps = 0;

    activeSession.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalSets += 1;
          const r = Number(s.reps) || 0;
          const w = Number(s.weight) || 0;
          totalReps += r;
          const wKg = s.unit === 'LB' ? w / KG_TO_LBS : w;
          totalVolumeKg += wKg * r;
        }
      });
    });

    const finished = {
      ...activeSession,
      workoutName: sessionTitle,
      duration: elapsedSeconds,
      totalVolumeKg: Math.round(totalVolumeKg),
      totalVolumeLbs: Math.round(totalVolumeKg * KG_TO_LBS),
      totalSets,
      totalReps,
      completedAt: new Date().toISOString()
    };

    // Save workout session via unified WorkoutContext handler
    if (saveWorkout) {
      saveWorkout(finished);
    }

    setActiveSession(null);
    setRestSeconds(null);
    setCompletedWorkoutForShare(finished);
    addNotification(`Workout completed! Total volume: ${Math.round(totalVolumeKg)} KG (${Math.round(totalVolumeKg * KG_TO_LBS)} LB)`, 'success');
  };

  // Unified Exercise Catalog = Custom + 194 Built-in Exercises
  const allAvailableExercises = useMemo(() => {
    return [...customExercises, ...EXERCISE_DATABASE];
  }, [customExercises]);

  // Strict 1-to-1 category and subgroup counts
  const trackerCategoryCounts = useMemo(() => {
    const counts = {
      total: allAvailableExercises.length,
      muscles: {},
      subgroups: {}
    };

    MAIN_MUSCLE_GROUPS.forEach(m => {
      counts.muscles[m] = 0;
      const subList = MUSCLE_SUBGROUPS[m] || [];
      subList.forEach(sg => {
        counts.subgroups[sg] = 0;
      });
    });

    allAvailableExercises.forEach(ex => {
      if (counts.muscles[ex.muscle] !== undefined) {
        counts.muscles[ex.muscle]++;
      }
      if (ex.subgroup && counts.subgroups[ex.subgroup] !== undefined) {
        counts.subgroups[ex.subgroup]++;
      }
    });

    return counts;
  }, [allAvailableExercises]);

  // Filtered exercises for the Selector Modal
  const modalFilteredExercises = useMemo(() => {
    return allAvailableExercises.filter(ex => {
      const q = exerciseSearch.toLowerCase();
      const primaryMatch = Array.isArray(ex.primaryMuscles) && ex.primaryMuscles.some(m => m.toLowerCase().includes(q));
      const secondaryMatch = Array.isArray(ex.secondaryMuscles) && ex.secondaryMuscles.some(m => m.toLowerCase().includes(q));
      const matchesSearch = !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.muscle.toLowerCase().includes(q) ||
        (ex.subgroup && ex.subgroup.toLowerCase().includes(q)) ||
        (ex.movementPattern && ex.movementPattern.toLowerCase().includes(q)) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(q)) ||
        primaryMatch ||
        secondaryMatch;

      const matchesMuscle = selectedMuscleFilter === 'All' || ex.muscle === selectedMuscleFilter;
      const matchesSubgroup = selectedSubgroupFilter === 'All' || ex.subgroup === selectedSubgroupFilter;
      const matchesEquip = selectedEquipmentFilter === 'All Equipment' || ex.equipment === selectedEquipmentFilter;
      const matchesType = selectedTypeFilter === 'All Types' || ex.type === selectedTypeFilter;
      const matchesDiff = selectedDifficultyFilter === 'All Levels' || ex.difficulty === selectedDifficultyFilter;

      let matchesTab = true;
      if (activeSelectorTab === 'favorites') {
        matchesTab = favorites.includes(ex.id);
      } else if (activeSelectorTab === 'recent') {
        matchesTab = recentExerciseIds.includes(ex.id);
      } else if (activeSelectorTab === 'custom') {
        matchesTab = Boolean(ex.isCustom);
      }

      return matchesSearch && matchesMuscle && matchesSubgroup && matchesEquip && matchesType && matchesDiff && matchesTab;
    });
  }, [
    allAvailableExercises,
    exerciseSearch,
    selectedMuscleFilter,
    selectedSubgroupFilter,
    selectedEquipmentFilter,
    selectedTypeFilter,
    selectedDifficultyFilter,
    activeSelectorTab,
    favorites,
    recentExerciseIds
  ]);

  // Prompt to start if no active session
  if (!activeSession) {
    return (
      <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-midnight-card border border-midnight-border flex items-center justify-center shadow-card">
          <Dumbbell className="w-10 h-10 text-neon-cyan rotate-45" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Live Workout Tracker
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Record exercises from the unified 160+ exercise catalog, calculate mixed KG/LB plates, use rest countdowns, and build custom movements.
          </p>
        </div>

        <button
          onClick={() => handleStartWorkout('Strength Training Session')}
          className="px-8 py-3.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-neon-cyan/25 flex items-center gap-2.5 transition active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Start Live Workout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Session Active Status Bar */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider">
              Live Session In Progress
            </span>
          </div>

          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            className="text-xl md:text-2xl font-black text-white bg-transparent border-b border-transparent hover:border-midnight-border focus:border-neon-cyan focus:outline-none transition w-full"
          />
        </div>

        {/* Timers & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Elapsed Timer */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-midnight-bg border border-midnight-border font-mono text-xs font-bold text-neon-cyan">
            <Clock className="w-4 h-4 text-neon-cyan" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Rest Timer Widget */}
          {restSeconds !== null ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              restSeconds > 0 
                ? 'bg-neon-blue/10 border-neon-blue/40 text-neon-blue animate-pulse'
                : 'bg-neon-success/10 border-neon-success/40 text-neon-success'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>Rest: {formatTime(restSeconds)}</span>
              <button onClick={() => setRestSeconds(null)} className="ml-1 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setRestSeconds(90);
                setInitialRestSeconds(90);
                const vibrateOn = localStorage.getItem('platesync_timer_vibrate') !== 'false';
                if (vibrateOn) triggerShortHaptic();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-midnight-border bg-midnight-bg hover:border-neon-cyan/50 text-xs font-mono font-bold text-slate-300 hover:text-white transition"
              title="Start 90s Rest Timer"
            >
              <Timer className="w-3.5 h-3.5 text-neon-blue" />
              <span>Rest Timer</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Discard current workout session?')) {
                setActiveSession(null);
                setRestSeconds(null);
                addNotification('Workout session cancelled', 'info');
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-neon-error/30 bg-neon-error/10 hover:bg-neon-error/20 text-rose-300 text-xs font-bold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleFinishWorkout}
            className="px-6 py-2 bg-neon-success hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-success/20 flex items-center gap-2 transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* 2. Staged Calculator Weight Notice */}
      {stagedWeight && (
        <div className="p-4 rounded-2xl bg-midnight-card border border-neon-cyan/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Calculated Barbell Weight Ready: <strong className="text-neon-cyan font-mono">{stagedWeight.weight} {stagedWeight.unit}</strong>
                {stagedWeight.isLegPress45 && <span className="ml-2 text-[10px] text-neon-violet">(45° Leg Press: Sled 0 kg)</span>}
              </p>
              <p className="text-[11px] text-slate-400">
                Click "Paste Calc" on any set row below to load this exact calculated weight.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStagedWeight(null)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Logged Exercises List */}
      <div className="space-y-4">
        {activeSession.exercises.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-midnight-card border border-midnight-border space-y-3">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No exercises added yet</p>
            <p className="text-xs text-slate-500">
              Select movements from the 160+ exercise database or pre-filtered routines.
            </p>
            <button
              onClick={() => setIsExerciseModalOpen(true)}
              className="mt-2 px-5 py-2.5 bg-neon-cyan text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Select First Exercise</span>
            </button>
          </div>
        ) : (
          activeSession.exercises.map((ex, exIdx) => (
            <div key={ex.id || exIdx} className="bg-midnight-card border border-midnight-border rounded-3xl p-5 md:p-6 space-y-4">
              
              {/* Exercise Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-bold text-xs font-mono">
                    {exIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {ex.name}
                      {ex.isLegPress45 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> 45° Sled 0 kg (Plates Only)
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      <span className="text-neon-cyan font-semibold">{ex.muscle}</span> &bull; {ex.sets.length} sets logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCalculatorForExercise(ex)}
                    className="p-2 text-slate-400 hover:text-neon-cyan rounded-xl hover:bg-midnight-elevated transition"
                    title={ex.isLegPress45 ? "Calculate 45-Degree Leg Press Plates (Sled 0 kg)" : "Calculate Barbell Plates"}
                  >
                    <Calculator className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-2 text-slate-400 hover:text-neon-error rounded-xl hover:bg-midnight-elevated transition"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-midnight-border text-[11px] text-slate-400 uppercase font-mono">
                      <th className="py-2 px-3 w-12 text-center">Set</th>
                      <th className="py-2 px-3">Weight</th>
                      <th className="py-2 px-3 w-20">Unit</th>
                      <th className="py-2 px-3 w-24">Reps</th>
                      <th className="py-2 px-3 w-16 text-center">Done</th>
                      <th className="py-2 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-midnight-border/50">
                    {ex.sets.map((set, setIdx) => (
                      <tr key={setIdx} className={`hover:bg-midnight-bg/40 transition ${set.completed ? 'bg-neon-success/5' : ''}`}>
                        
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-300">
                          {set.setNumber}
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={set.weight}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                            />
                            {stagedWeight && (
                              <button
                                type="button"
                                onClick={() => handleApplyStagedWeight(exIdx, setIdx)}
                                className="px-2 py-1 text-[10px] bg-neon-cyan/15 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 font-bold rounded border border-neon-cyan/30 transition"
                                title="Apply staged weight from Plate Calculator"
                              >
                                Paste Calc
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <select
                            value={set.unit}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'unit', e.target.value)}
                            className="px-2 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white text-xs font-mono font-bold focus:outline-none focus:border-neon-cyan"
                          >
                            <option value="KG">KG</option>
                            <option value="LB">LB</option>
                          </select>
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value, 10) || 0)}
                            className="w-16 px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white font-mono text-xs focus:outline-none focus:border-neon-cyan"
                          />
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(exIdx, setIdx)}
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition ${
                              set.completed
                                ? 'bg-neon-success text-slate-950 font-black shadow-sm'
                                : 'bg-midnight-elevated text-slate-400 hover:text-white'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>

                        <td className="py-2.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateSet(exIdx, setIdx)}
                              className="p-1 text-slate-500 hover:text-neon-cyan"
                              title="Duplicate Set"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(exIdx, setIdx)}
                              className="p-1 text-slate-500 hover:text-neon-error"
                              title="Delete Set"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Set & Calculator Quick Link */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleAddSet(exIdx)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-midnight-elevated hover:bg-[#1f2f50] text-neon-cyan text-xs font-bold border border-midnight-border transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Set</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCalculatorForExercise(ex)}
                  className="text-[11px] text-neon-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{ex.isLegPress45 ? 'Open 45° Leg Press Calculator (Sled = 0)' : 'Open Plate Calculator'}</span>
                </button>
              </div>

            </div>
          ))
        )}

        {/* Add Exercise CTA Button */}
        <button
          type="button"
          onClick={() => setIsExerciseModalOpen(true)}
          className="w-full py-4 border-2 border-dashed border-midnight-border hover:border-neon-cyan/50 rounded-3xl text-slate-400 hover:text-neon-cyan font-bold text-xs flex items-center justify-center gap-2 transition hover:bg-midnight-card/50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exercise from Database (160+ Exercises)</span>
        </button>
      </div>

      {/* 4. UPGRADED EXERCISE SELECTOR MODAL */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-midnight-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-neon-cyan" />
                  Select Exercise
                </h3>
                <p className="text-xs text-slate-400">Choose across 11 muscle groups, search, or add custom movements</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="px-3 py-1.5 bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-neon-cyan text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom</span>
                </button>
                <button 
                  onClick={() => setIsExerciseModalOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Mode Tabs (All, Favorites, Recent, Custom) */}
            <div className="px-5 pt-3 flex items-center gap-2 border-b border-midnight-border text-xs">
              <button
                type="button"
                onClick={() => setActiveSelectorTab('all')}
                className={`pb-2.5 px-2 font-bold border-b-2 transition ${
                  activeSelectorTab === 'all'
                    ? 'border-neon-cyan text-neon-cyan'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                All Exercises ({allAvailableExercises.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSelectorTab('favorites')}
                className={`pb-2.5 px-2 font-bold border-b-2 transition flex items-center gap-1 ${
                  activeSelectorTab === 'favorites'
                    ? 'border-neon-gold text-neon-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favorites ({favorites.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSelectorTab('recent')}
                className={`pb-2.5 px-2 font-bold border-b-2 transition flex items-center gap-1 ${
                  activeSelectorTab === 'recent'
                    ? 'border-neon-cyan text-neon-cyan'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Recent ({recentExerciseIds.length})</span>
              </button>
              {customExercises.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveSelectorTab('custom')}
                  className={`pb-2.5 px-2 font-bold border-b-2 transition ${
                    activeSelectorTab === 'custom'
                      ? 'border-neon-violet text-neon-violet'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Custom ({customExercises.length})
                </button>
              )}
            </div>

            {/* Scrollable Modal Content (Filters, 3 Dropdowns, Horizontal Muscle Scroller & Exercises all scroll together) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
              {/* Filter Controls */}
              <div className="space-y-3 pb-3 border-b border-midnight-border/60">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search 190+ exercises by name, muscle, subgroup, lats..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                    autoFocus
                  />
                  {exerciseSearch && (
                    <button
                      type="button"
                      onClick={() => setExerciseSearch('')}
                      className="absolute right-3 top-3 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sub-Filters: Equipment, Type, Difficulty */}
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={selectedEquipmentFilter}
                    onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {EQUIPMENT_TYPES.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>

                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {EXERCISE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficultyFilter}
                    onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-midnight-bg border border-midnight-border rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {DIFFICULTY_LEVELS.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                {/* 7 Main Muscle Groups in Horizontal below the 3 dropdowns */}
                <div className="space-y-2 pt-2 border-t border-midnight-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-neon-cyan" />
                      <span>Muscle Groups:</span>
                    </span>

                    {selectedMuscleFilter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMuscleFilter('All');
                          setSelectedSubgroupFilter('All');
                        }}
                        className="text-[11px] text-neon-cyan hover:underline font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Show All</span>
                      </button>
                    )}
                  </div>

                  {/* Horizontal scrollable row of the 7 Main Muscle Groups */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMuscleFilter('All');
                        setSelectedSubgroupFilter('All');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                        selectedMuscleFilter === 'All'
                          ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25 font-black'
                          : 'bg-midnight-elevated text-slate-300 hover:text-white border border-midnight-border hover:border-slate-600'
                      }`}
                    >
                      <span>All Muscles</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/25">
                        {allAvailableExercises.length}
                      </span>
                    </button>

                    {MAIN_MUSCLE_GROUPS.map((mg, idx) => {
                      const isSelected = selectedMuscleFilter === mg;
                      const count = trackerCategoryCounts.muscles[mg] || 0;

                      return (
                        <button
                          key={mg}
                          type="button"
                          onClick={() => {
                            if (selectedMuscleFilter === mg && selectedSubgroupFilter === 'All') {
                              setSelectedMuscleFilter('All');
                              setSelectedSubgroupFilter('All');
                            } else {
                              setSelectedMuscleFilter(mg);
                              setSelectedSubgroupFilter('All');
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25 font-black'
                              : 'bg-midnight-elevated text-slate-300 hover:text-white border border-midnight-border hover:border-slate-600'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-md text-[10px] flex items-center justify-center font-bold ${
                            isSelected ? 'bg-slate-950 text-neon-cyan' : 'bg-midnight-card text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span>{mg}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-black/30 text-slate-950 font-black' : 'bg-black/25 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Subgroups Horizontal Row (Appears directly underneath selected muscle group) */}
                  {selectedMuscleFilter !== 'All' && MUSCLE_SUBGROUPS[selectedMuscleFilter] && (
                    <div className="p-2.5 rounded-xl bg-midnight-card/80 border border-midnight-border space-y-1.5 animate-in fade-in duration-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {selectedMuscleFilter} Subgroups:
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        <button
                          type="button"
                          onClick={() => setSelectedSubgroupFilter('All')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 flex items-center gap-1 ${
                            selectedSubgroupFilter === 'All'
                              ? 'bg-neon-cyan text-slate-950 shadow-sm font-black'
                              : 'bg-midnight-elevated text-slate-300 hover:text-white'
                          }`}
                        >
                          <span>All {selectedMuscleFilter}</span>
                          <span className="text-[9px] font-mono opacity-80">
                            ({trackerCategoryCounts.muscles[selectedMuscleFilter] || 0})
                          </span>
                        </button>

                        {MUSCLE_SUBGROUPS[selectedMuscleFilter].map(sg => {
                          const isSgActive = selectedSubgroupFilter === sg;
                          const sgCount = trackerCategoryCounts.subgroups[sg] || 0;

                          return (
                            <button
                              key={sg}
                              type="button"
                              onClick={() => setSelectedSubgroupFilter(sg)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] transition shrink-0 flex items-center gap-1 ${
                                isSgActive
                                  ? 'bg-neon-violet text-white font-bold border border-neon-violet shadow-sm'
                                  : 'bg-midnight-elevated text-slate-300 hover:text-white'
                              }`}
                            >
                              <span>{sg}</span>
                              <span className="text-[9px] font-mono opacity-80">({sgCount})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filter Breadcrumb */}
                {(selectedMuscleFilter !== 'All' || selectedSubgroupFilter !== 'All' || exerciseSearch) && (
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>Filtering:</span>
                      {selectedMuscleFilter !== 'All' && (
                        <span className="font-bold text-neon-cyan">{selectedMuscleFilter}</span>
                      )}
                      {selectedSubgroupFilter !== 'All' && (
                        <>
                          <span>&gt;</span>
                          <span className="font-bold text-neon-violet">{selectedSubgroupFilter}</span>
                        </>
                      )}
                      <span>({modalFilteredExercises.length} matches)</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetModalFilters}
                      className="text-neon-cyan hover:underline shrink-0"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>

              {/* Exercise List */}
              <div className="space-y-2">
                {modalFilteredExercises.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No matching exercises found. Try adjusting your search or filters.
                  </div>
                ) : (
                  modalFilteredExercises.map((ex) => {
                    const isFav = favorites.includes(ex.id);
                    return (
                      <div
                        key={ex.id}
                        onClick={() => handleAddExercise(ex)}
                        className="p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white group-hover:text-neon-cyan transition truncate">
                              {ex.name}
                            </h4>
                            {ex.isLegPress45 && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 font-semibold shrink-0">
                                45° Sled 0 kg
                              </span>
                            )}
                            {ex.type && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-midnight-elevated text-slate-400 font-medium shrink-0">
                                {ex.type}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                              {ex.muscle}
                            </span>
                            {ex.subgroup && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
                                {ex.subgroup}
                              </span>
                            )}
                            <span>&bull;</span>
                            <span className="font-mono text-[10px] text-slate-300">{ex.equipment}</span>
                            <span>&bull;</span>
                            <span className="text-[10px]">{ex.difficulty}</span>
                          </div>
                        </div>

                        {/* Right action icons: Favorite, Info / Hindi, Add */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Favorite Star Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavorite(ex.id, e)}
                            className={`p-1.5 rounded-lg transition ${
                              isFav 
                                ? 'text-neon-gold hover:text-amber-300' 
                                : 'text-slate-600 hover:text-slate-300'
                            }`}
                            title={isFav ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>

                          {/* Quick Guide & Hindi Preview Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewExercise(ex);
                            }}
                            className="p-1.5 text-slate-400 hover:text-neon-cyan rounded-lg hover:bg-midnight-elevated transition"
                            title="View Guide & Hindi translation"
                          >
                            <Languages className="w-4 h-4" />
                          </button>

                          {/* Add Button */}
                          <span className="w-7 h-7 rounded-lg bg-midnight-elevated flex items-center justify-center text-slate-400 group-hover:bg-neon-cyan group-hover:text-slate-950 transition">
                            <Plus className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. CREATE CUSTOM EXERCISE MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-neon-cyan" />
                Create Custom Exercise
              </h3>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomExercise} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Landmine Reverse Lunge"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Muscle Category</label>
                  <select
                    value={customMuscle}
                    onChange={(e) => setCustomMuscle(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                  >
                    {MUSCLE_GROUPS.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Equipment</label>
                  <select
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                  >
                    {EQUIPMENT_TYPES.filter(e => e !== 'All Equipment').map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Movement Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="Compound">Compound</option>
                    <option value="Isolation">Isolation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Instructions / Notes (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Key form cues and setup instructions..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black rounded-xl shadow-md shadow-neon-cyan/20 transition active:scale-95"
                >
                  Save & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EXERCISE DETAIL & HINDI GUIDE MODAL */}
      <ExerciseDetailModal
        exercise={previewExercise}
        isOpen={Boolean(previewExercise)}
        onClose={() => setPreviewExercise(null)}
        onAddToWorkout={(ex) => {
          handleAddExercise(ex);
          setPreviewExercise(null);
        }}
        isFavorite={previewExercise ? favorites.includes(previewExercise.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 7. FLOATING REST TIMER WIDGET (AUDIO & VIBRATION) */}
      {activeSession && restSeconds !== null && (
        <RestTimerWidget
          restSeconds={restSeconds}
          initialSeconds={initialRestSeconds}
          onUpdateSeconds={(s) => {
            setRestSeconds(s);
            if (s > initialRestSeconds) setInitialRestSeconds(s);
          }}
          onDismiss={() => setRestSeconds(null)}
          addNotification={addNotification}
        />
      )}

      {/* 8. WORKOUT SUMMARY SHARE CARD MODAL */}
      {completedWorkoutForShare && (
        <WorkoutShareModal
          workout={completedWorkoutForShare}
          isOpen={Boolean(completedWorkoutForShare)}
          onClose={() => {
            setCompletedWorkoutForShare(null);
            if (setActiveTab) setActiveTab('history');
          }}
          addNotification={addNotification}
        />
      )}

    </div>
  );
};
