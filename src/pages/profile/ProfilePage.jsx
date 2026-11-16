import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Mail,
  Ruler,
  Scale,
  Dumbbell,
  Save,
  Check,
  Calendar,
  Sparkles,
  Star,
  ChevronRight,
  Flame,
  ExternalLink,
  Trash2,
  Calculator,
  Bookmark,
  Zap,
  Search,
  Plus,
  X,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { EXERCISE_DATABASE } from '../../utils/exerciseData';
import { ExerciseDetailModal } from '../../components/library/ExerciseDetailModal';

export const ProfilePage = ({ setActiveTab, onOpenAuth }) => {
  const { userProfile, currentUser, updateProfile, isDemoMode } = useAuth();
  const { savedConfigurations = [], deletePlateConfiguration, setStagedWeight } = useWorkout();
  const { addNotification } = useNotification();

  // Active Favorites Tab: 'barbell' | 'exercises'
  const [favoriteTab, setFavoriteTab] = useState('barbell');

  // Modals for loading weight directly on exercises
  const [setupToApply, setSetupToApply] = useState(null);
  const [exerciseToLoadWeight, setExerciseToLoadWeight] = useState(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedNumSets, setSelectedNumSets] = useState(3);
  const [customWeightInput, setCustomWeightInput] = useState('60');
  const [customWeightUnit, setCustomWeightUnit] = useState(() => {
    return (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG';
  });

  // Load weight directly onto an exercise and launch in Workout Tracker
  const loadWeightOntoExercise = (exercise, weightKg, weightLbs, numSets = 3, setupName = '') => {
    const preferredUnit = (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG';
    const targetWeight = preferredUnit === 'LBS' 
      ? (Number(weightLbs) || (Number(weightKg) * KG_TO_LBS) || 0)
      : (Number(weightKg) || (Number(weightLbs) / KG_TO_LBS) || 0);

    const roundedWeight = Math.round(targetWeight * 100) / 100;
    const isLegPress45 = Boolean(
      exercise.isLegPress45 ||
      /45.*leg\s*press/i.test(exercise.name) ||
      /leg\s*press.*45/i.test(exercise.name)
    );

    // 1. Stage weight in WorkoutContext so it's ready in top banner & Paste Calc
    if (setStagedWeight) {
      setStagedWeight({
        weight: roundedWeight,
        unit: preferredUnit,
        kg: Number(weightKg) || (roundedWeight / KG_TO_LBS),
        lbs: Number(weightLbs) || (roundedWeight * KG_TO_LBS),
        isLegPress45,
        exerciseName: exercise.name,
        setupName: setupName || exercise.name
      });
    }

    // 2. Check if an active workout session already exists in localStorage
    let activeSession = null;
    try {
      const stored = localStorage.getItem('platesync_live_workout');
      if (stored) activeSession = JSON.parse(stored);
    } catch (e) {}

    const setsArray = Array.from({ length: Math.max(1, Number(numSets) || 3) }).map((_, idx) => ({
      setNumber: idx + 1,
      weight: roundedWeight,
      unit: preferredUnit,
      reps: 10,
      completed: false,
      isPR: false,
      isLegPress45
    }));

    const newExerciseEntry = {
      id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      exerciseId: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle || 'Compound',
      category: exercise.category || 'Strength',
      equipment: exercise.equipment || 'Barbell',
      isLegPress45,
      sets: setsArray
    };

    let updatedSession;
    if (activeSession && Array.isArray(activeSession.exercises)) {
      // Append to existing active session
      updatedSession = {
        ...activeSession,
        exercises: [...activeSession.exercises, newExerciseEntry]
      };
    } else {
      // Start fresh new session
      updatedSession = {
        id: `w_${Date.now()}`,
        workoutName: `${exercise.name} Focused Workout`,
        date: new Date().toISOString(),
        startTime: Date.now(),
        exercises: [newExerciseEntry]
      };
    }

    try {
      localStorage.setItem('platesync_live_workout', JSON.stringify(updatedSession));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('platesync_load_workout_session', { detail: updatedSession }));
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    } catch (err) {}

    addNotification(`Loaded ${roundedWeight.toFixed(2)} ${preferredUnit} on ${exercise.name} in Workout Tracker! ⚡`, 'success');

    if (setActiveTab) {
      setActiveTab('tracker');
    }
  };

  // Load setup in calculator
  const handleLoadSetupInCalculator = (cfg) => {
    if (setStagedWeight) {
      setStagedWeight({ configToLoad: cfg });
    }
    if (setActiveTab) {
      setActiveTab('calculator');
    }
    addNotification(`Loaded setup "${cfg.name}" in Weight Calculator!`, 'info');
  };

  // Remove setup from favorites
  const handleRemoveSavedConfig = (cfgId, e) => {
    if (e) e.stopPropagation();
    if (deletePlateConfiguration) {
      deletePlateConfiguration(cfgId);
    }
    addNotification('Barbell setup removed from favorites', 'info');
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Favorite Workouts & Exercises State
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_favorite_exercises');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  const handleRemoveFavorite = (exerciseId, e) => {
    if (e) e.stopPropagation();
    const updated = favoriteIds.filter(id => id !== exerciseId);
    setFavoriteIds(updated);
    try {
      localStorage.setItem('platesync_favorite_exercises', JSON.stringify(updated));
    } catch (err) { }
    addNotification('Removed workout from favorites', 'info');
  };

  const handleToggleFavoriteFromModal = (exerciseId) => {
    if (favoriteIds.includes(exerciseId)) {
      handleRemoveFavorite(exerciseId);
    } else {
      const updated = [...favoriteIds, exerciseId];
      setFavoriteIds(updated);
      try {
        localStorage.setItem('platesync_favorite_exercises', JSON.stringify(updated));
      } catch (err) { }
      addNotification('Added workout to favorites ⭐', 'success');
    }
  };

  const favoriteWorkouts = useMemo(() => {
    return favoriteIds
      .map(id => EXERCISE_DATABASE.find(ex => ex.id === id))
      .filter(Boolean);
  }, [favoriteIds]);

  const filteredExercises = useMemo(() => {
    if (!exerciseSearch.trim()) {
      return EXERCISE_DATABASE.slice(0, 24);
    }
    const q = exerciseSearch.toLowerCase();
    return EXERCISE_DATABASE.filter(ex => 
      ex.name?.toLowerCase().includes(q) ||
      ex.muscle?.toLowerCase().includes(q) ||
      ex.equipment?.toLowerCase().includes(q)
    );
  }, [exerciseSearch]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: 178,
    bodyWeight: 75,
    preferredUnit: 'KG',
    defaultBarbellWeight: 20,
    defaultBarbellUnit: 'KG',
    bio: '',
    profileImage: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile || currentUser) {
      setFormData({
        name: userProfile?.name || currentUser?.displayName || 'Athlete',
        email: userProfile?.email || currentUser?.email || '',
        height: userProfile?.height || 178,
        bodyWeight: userProfile?.bodyWeight || 75,
        preferredUnit: (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG',
        defaultBarbellWeight: userProfile?.defaultBarbellWeight || 20,
        defaultBarbellUnit: (userProfile?.defaultBarbellUnit === 'LB' || userProfile?.defaultBarbellUnit === 'LBS') ? 'LBS' : 'KG',
        bio: userProfile?.bio || '',
        profileImage: userProfile?.profileImage || currentUser?.photoURL || ''
      });
    }
  }, [userProfile, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const numericHeight = Number(formData.height) || 178;
      const numericBodyWeight = Number(formData.bodyWeight) || 75;
      const numericBarbellWeight = Number(formData.defaultBarbellWeight) || 20;

      await updateProfile({
        ...formData,
        height: numericHeight,
        bodyWeight: numericBodyWeight,
        defaultBarbellWeight: numericBarbellWeight
      });
      addNotification('Athlete profile updated successfully!', 'success');
    } catch (err) {
      addNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const heightInInches = Math.round((Number(formData.height) || 0) / 2.54);
  const heightFeet = Math.floor(heightInInches / 12);
  const heightRem = heightInInches % 12;
  const weightInLbs = ((Number(formData.bodyWeight) || 0) * KG_TO_LBS).toFixed(2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">

      {/* Top Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <img
          src={
            formData.profileImage ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name || 'athlete'}`
          }
          alt="Athlete Avatar"
          className="w-24 h-24 rounded-3xl border-2 border-neon-cyan/40 bg-midnight-bg object-cover shadow-card"
        />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black text-white">
              {formData.name || 'Athlete'}
            </h2>
            {isDemoMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-gold/20 text-neon-gold border border-neon-gold/30">
                Demo Athlete
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono">{formData.email}</p>
          <p className="text-xs text-slate-300 pt-1">
            {formData.bio || 'Strength Athlete & Barbell Powerlifter'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-midnight-border pb-3">
          <User className="w-4 h-4 text-neon-cyan" />
          Athlete Metrics & Body Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3.5 py-2.5 bg-midnight-bg/50 border border-midnight-border rounded-xl text-slate-500 text-xs font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Height (cm)</label>
              <span className="text-[11px] text-slate-400 font-mono">{heightFeet}&apos;{heightRem}&quot;</span>
            </div>
            <div className="relative">
              <Ruler className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Body Weight ({formData.preferredUnit})</label>
              <span className="text-[11px] text-slate-400 font-mono">
                {formData.preferredUnit === 'KG' ? `≈ ${weightInLbs} lbs` : `≈ ${((Number(formData.bodyWeight) || 0) / KG_TO_LBS).toFixed(2)} kg`}
              </span>
            </div>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="number"
                step="any"
                min="0"
                name="bodyWeight"
                value={formData.bodyWeight}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Weight Unit</label>
            <select
              name="preferredUnit"
              value={formData.preferredUnit}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
            >
              <option value="KG">Kilograms (KG)</option>
              <option value="LBS">Pounds (LBS)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Barbell Weight</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="defaultBarbellWeight"
                value={formData.defaultBarbellWeight}
                onChange={handleChange}
                className="px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
              />
              <select
                name="defaultBarbellUnit"
                value={formData.defaultBarbellUnit}
                onChange={handleChange}
                className="px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
              >
                <option value="KG">KG</option>
                <option value="LBS">LBS</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Athlete Bio & Targets</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-midnight-border">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 transition active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Favorite Setups & Workouts Section */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-midnight-border pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Athlete Favorites & Saved Setups
            </h3>
            <p className="text-xs text-slate-400">
              Quick access to your saved barbell configurations from the calculator and bookmarked training movements.
            </p>
          </div>

          {/* Toggle between Barbell Setups & Favorite Exercises */}
          <div className="flex items-center p-1 rounded-xl bg-midnight-bg border border-midnight-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFavoriteTab('barbell')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                favoriteTab === 'barbell'
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Barbell Setups ({savedConfigurations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFavoriteTab('exercises')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                favoriteTab === 'exercises'
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Exercises ({favoriteWorkouts.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Favorite Barbell Configurations */}
        {favoriteTab === 'barbell' && (
          <div>
            {savedConfigurations.length === 0 ? (
              <div className="p-8 rounded-2xl bg-midnight-bg border border-dashed border-midnight-border text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">No Favorite Barbell Setups Saved Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Load your plates in the Smart Weight Calculator and tap &quot;Favorite Rack&quot; to bookmark your custom lifts and rack configurations here.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {(!currentUser && !isDemoMode) && onOpenAuth && (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition shadow-md shadow-amber-400/20"
                    >
                      <Star className="w-4 h-4 fill-slate-950" />
                      <span>Sign In to Save Favorites</span>
                    </button>
                  )}
                  {setActiveTab && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('calculator')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan text-slate-950 text-xs font-bold hover:bg-[#29bfcd] transition shadow-md shadow-neon-cyan/20"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Open Weight Calculator</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {savedConfigurations.map((cfg) => {
                  const leftSummary = cfg.leftPlates && cfg.leftPlates.length > 0 
                    ? cfg.leftPlates.map(p => `${p.weight}${p.unit}`).join(', ') 
                    : 'Empty';
                  const rightSummary = cfg.rightPlates && cfg.rightPlates.length > 0 
                    ? cfg.rightPlates.map(p => `${p.weight}${p.unit}`).join(', ') 
                    : 'Empty';
                  return (
                    <div
                      key={cfg.id}
                      className="group p-4 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 hover:bg-midnight-secondary/60 transition flex flex-col justify-between space-y-3 relative shadow-sm"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-neon-cyan text-neon-cyan" />
                            <span>Favorite Setup</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSavedConfig(cfg.id, e)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-neon-cyan transition line-clamp-1">
                          {cfg.name}
                        </h4>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-black font-mono text-neon-cyan">
                            {(Number(cfg.totalKg) || 0).toFixed(2)} KG
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            / {(Number(cfg.totalLbs) || 0).toFixed(2)} LBS
                          </span>
                        </div>

                        <div className="mt-2.5 text-[10px] font-mono text-slate-400 space-y-1 bg-midnight-card/80 p-2.5 rounded-xl border border-midnight-border/50">
                          <p><span className="text-slate-500 font-bold">Barbell:</span> {cfg.barbellWeight} {cfg.barbellUnit || 'KG'}</p>
                          <p className="truncate"><span className="text-slate-500 font-bold">Left:</span> [{leftSummary}]</p>
                          <p className="truncate"><span className="text-slate-500 font-bold">Right:</span> [{rightSummary}]</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-midnight-border/60 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSetupToApply(cfg)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs transition shadow-md shadow-neon-cyan/20 active:scale-95"
                          title="Load this weight setup directly onto an exercise in Workout Tracker"
                        >
                          <Zap className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Load on Exercise</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadSetupInCalculator(cfg)}
                          className="p-2 rounded-xl bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan border border-midnight-border text-xs font-bold transition active:scale-95 flex items-center gap-1"
                          title="Load setup in Barbell Visualizer"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Calc</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Favorite Exercises */}
        {favoriteTab === 'exercises' && (
          <div>
            {favoriteWorkouts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-midnight-bg border border-dashed border-midnight-border text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">No Favorite Workouts Added Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    While browsing the Exercise Library or logging workouts in the Tracker, tap the ⭐ star icon on any movement to save it here for rapid access.
                  </p>
                </div>
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan text-slate-950 text-xs font-bold hover:bg-[#29bfcd] transition shadow-md shadow-neon-cyan/20"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>Explore Exercise Library</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {favoriteWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => setSelectedExerciseForModal(workout)}
                    className="group p-4 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 hover:bg-midnight-secondary/60 transition cursor-pointer flex flex-col justify-between space-y-3 relative shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                          {workout.muscle}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFavorite(workout.id, e)}
                          className="p-1 rounded-lg text-amber-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Remove from favorites"
                        >
                          <Star className="w-4 h-4 fill-amber-400" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-neon-cyan transition line-clamp-1">
                        {workout.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {workout.subgroup || workout.category || workout.equipment}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-midnight-border/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExerciseToLoadWeight(workout);
                          setCustomWeightInput(String(workout.defaultBarbell || (userProfile?.preferredUnit === 'LBS' ? 45 : 20)));
                          setCustomWeightUnit((userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 font-bold text-xs transition border border-neon-cyan/30 active:scale-95"
                        title="Load weight setup onto this exercise"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Load Weight</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedExerciseForModal(workout)}
                        className="px-2.5 py-1.5 rounded-xl bg-midnight-elevated hover:bg-[#1e2f50] text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                        title="View Exercise Guide"
                      >
                        <span>Guide</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exercise Detail Modal with complete guides & translation support */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          isOpen={Boolean(selectedExerciseForModal)}
          onClose={() => setSelectedExerciseForModal(null)}
          isFavorite={favoriteIds.includes(selectedExerciseForModal.id)}
          onToggleFavorite={handleToggleFavoriteFromModal}
          onAddToWorkout={(ex) => {
            setSelectedExerciseForModal(null);
            setExerciseToLoadWeight(ex);
            setCustomWeightInput(String(ex.defaultBarbell || (userProfile?.preferredUnit === 'LBS' ? 45 : 20)));
            setCustomWeightUnit((userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG');
          }}
        />
      )}

      {/* MODAL 1: Apply Barbell Weight Setup to Exercise */}
      {setupToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-midnight-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                  <Zap className="w-5 h-5 fill-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Load Weight onto Exercise
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select an exercise to load with this exact barbell weight setup in Workout Tracker
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSetupToApply(null); setExerciseSearch(''); }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1 custom-scrollbar">
              {/* Selected Setup Banner */}
              <div className="p-3.5 rounded-2xl bg-midnight-bg border border-neon-cyan/40 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-wider block">
                    Selected Weight Setup
                  </span>
                  <p className="text-xs font-bold text-white truncate">{setupToApply.name}</p>
                  <p className="text-sm font-black font-mono text-neon-cyan mt-0.5">
                    {(Number(setupToApply.totalKg) || 0).toFixed(2)} KG &bull; {(Number(setupToApply.totalLbs) || 0).toFixed(2)} LBS
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  <p>Bar: {setupToApply.barbellWeight} {setupToApply.barbellUnit || 'KG'}</p>
                  <p>{setupToApply.leftPlates?.length || 0} plates/side</p>
                </div>
              </div>

              {/* Number of Sets Selector */}
              <div className="flex items-center justify-between bg-midnight-bg/60 p-3 rounded-2xl border border-midnight-border">
                <div>
                  <label className="text-xs font-bold text-white block">Preloaded Working Sets</label>
                  <p className="text-[11px] text-slate-400">Sets will be created with this exact weight</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedNumSets(s)}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition ${
                        selectedNumSets === s
                          ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                          : 'bg-midnight-elevated text-slate-300 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section A: Quick Select from Favorite Exercises */}
              {favoriteWorkouts.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Favorite Exercises (1-Click Load)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {favoriteWorkouts.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => {
                          loadWeightOntoExercise(ex, setupToApply.totalKg, setupToApply.totalLbs, selectedNumSets, setupToApply.name);
                          setSetupToApply(null);
                          setExerciseSearch('');
                        }}
                        className="p-3 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan text-left group transition flex items-center justify-between active:scale-95"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-white group-hover:text-neon-cyan transition truncate">
                            {ex.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{ex.muscle} &bull; {ex.equipment}</p>
                        </div>
                        <Zap className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section B: Search Any Movement */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Or Choose from Exercise Database
                </label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search exercise by name or muscle (e.g. Bench, Squat, Overhead)..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        loadWeightOntoExercise(ex, setupToApply.totalKg, setupToApply.totalLbs, selectedNumSets, setupToApply.name);
                        setSetupToApply(null);
                        setExerciseSearch('');
                      }}
                      className="w-full p-2.5 rounded-xl bg-midnight-bg/70 border border-midnight-border/60 hover:border-neon-cyan/40 hover:bg-midnight-elevated text-left flex items-center justify-between text-xs transition"
                    >
                      <div>
                        <span className="font-bold text-slate-200">{ex.name}</span>
                        <span className="text-[10px] text-slate-400 block">{ex.muscle} &bull; {ex.equipment}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neon-cyan font-bold text-xs">
                        <span>Load</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-midnight-border flex items-center justify-end">
              <button
                type="button"
                onClick={() => { setSetupToApply(null); setExerciseSearch(''); }}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Load Weight for Favorite Exercise */}
      {exerciseToLoadWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-midnight-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Load Weight onto {exerciseToLoadWeight.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pick a favorite barbell rack setup or set a custom target weight to begin lifting
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExerciseToLoadWeight(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1 custom-scrollbar">
              {/* Option 1: Saved Barbell Setups */}
              {savedConfigurations.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-neon-cyan mb-2 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Choose from Your Saved Barbell Setups (1-Click)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedConfigurations.map((cfg) => (
                      <button
                        key={cfg.id}
                        type="button"
                        onClick={() => {
                          loadWeightOntoExercise(exerciseToLoadWeight, cfg.totalKg, cfg.totalLbs, 3, cfg.name);
                          setExerciseToLoadWeight(null);
                        }}
                        className="p-3 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan text-left group transition flex items-center justify-between active:scale-95"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-white group-hover:text-neon-cyan transition truncate">
                            {cfg.name}
                          </p>
                          <p className="text-[11px] font-mono text-neon-cyan mt-0.5">
                            {(Number(cfg.totalKg) || 0).toFixed(2)} KG &bull; {(Number(cfg.totalLbs) || 0).toFixed(2)} LBS
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 2: Custom Target Weight */}
              <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  Or Enter Target Weight for Sets
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={customWeightInput}
                      onChange={(e) => setCustomWeightInput(e.target.value)}
                      placeholder="e.g. 60 or 135"
                      className="w-full px-3.5 py-2.5 bg-midnight-card border border-midnight-border rounded-xl text-white font-mono text-sm font-bold focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div className="flex items-center p-1 bg-midnight-card rounded-xl border border-midnight-border">
                    <button
                      type="button"
                      onClick={() => setCustomWeightUnit('KG')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        customWeightUnit === 'KG'
                          ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomWeightUnit('LBS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        customWeightUnit === 'LBS'
                          ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      LBS
                    </button>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Presets:</span>
                  {(customWeightUnit === 'KG' ? [20, 40, 60, 80, 100, 140] : [45, 95, 135, 185, 225, 315]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCustomWeightInput(String(p))}
                      className="px-2 py-0.5 rounded-md bg-midnight-card hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan text-[11px] font-mono border border-midnight-border transition"
                    >
                      {p} {customWeightUnit}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const val = parseFloat(customWeightInput) || 0;
                    const kgVal = customWeightUnit === 'KG' ? val : val / KG_TO_LBS;
                    const lbsVal = customWeightUnit === 'LBS' ? val : val * KG_TO_LBS;
                    loadWeightOntoExercise(exerciseToLoadWeight, kgVal, lbsVal, 3);
                    setExerciseToLoadWeight(null);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs transition shadow-lg shadow-neon-cyan/20 active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Workout with {customWeightInput || '0'} {customWeightUnit} ⚡</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-midnight-border flex items-center justify-end">
              <button
                type="button"
                onClick={() => setExerciseToLoadWeight(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
