import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Dumbbell, 
  Filter, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  ChevronDown,
  Info, 
  Plus, 
  Play, 
  Calendar, 
  Sparkles,
  Languages,
  Star,
  Clock,
  Wand2,
  FolderTree,
  RotateCcw,
  CheckCircle2,
  X,
  Target,
  Maximize2,
  Minimize2,
  CalendarPlus
} from 'lucide-react';
import { 
  EXERCISE_DATABASE, 
  MAIN_MUSCLE_GROUPS,
  MUSCLE_GROUPS, 
  MUSCLE_SUBGROUPS,
  EQUIPMENT_TYPES, 
  DIFFICULTY_LEVELS,
  EXERCISE_TYPES,
  PREBUILT_WORKOUT_PROGRAMS
} from '../../utils/exerciseData';
import { ExerciseDetailModal } from '../../components/library/ExerciseDetailModal';
import { AddToPlannerModal } from '../../components/planner/AddToPlannerModal';
import { useNotification } from '../../context/NotificationContext';

export const ExerciseLibraryPage = ({ setActiveTab }) => {
  const { addNotification } = useNotification();
  const [activeTabSub, setActiveTabSub] = useState('exercises'); // 'exercises' | 'programs'
  const [librarySection, setLibrarySection] = useState('all'); // 'all' | 'favorites' | 'recent' | 'custom'

  // Hierarchical category selection
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedSubgroup, setSelectedSubgroup] = useState('All');
  
  // Accordion expand/collapse state for each of the 7 main muscle groups
  const [expandedMuscles, setExpandedMuscles] = useState(() => {
    // Expand Chest by default
    const init = {};
    MAIN_MUSCLE_GROUPS.forEach(m => {
      init[m] = m === 'Chest';
    });
    return init;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('All Equipment');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedType, setSelectedType] = useState('All Types');

  // Favorites state (persisted with platesync_favorite_exercises)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_favorite_exercises');
      return stored ? JSON.parse(stored) : ['flat-barbell-bench-press', 'barbell-back-squat', 'conventional-deadlift', 'leg-press-45-degree'];
    } catch (e) {
      return ['flat-barbell-bench-press', 'barbell-back-squat', 'conventional-deadlift', 'leg-press-45-degree'];
    }
  });

  // Recently viewed exercises state (persisted with platesync_recent_exercises)
  const [recentExerciseIds, setRecentExerciseIds] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_recent_exercises');
      return stored ? JSON.parse(stored) : ['flat-barbell-bench-press', 'barbell-row', 'leg-press-45-degree'];
    } catch (e) {
      return ['flat-barbell-bench-press', 'barbell-row', 'leg-press-45-degree'];
    }
  });

  // Custom exercises created by the user (persisted with platesync_custom_exercises)
  const [customExercises, setCustomExercises] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_custom_exercises');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Custom exercise modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [customSubgroup, setCustomSubgroup] = useState('Upper Chest');
  const [customEquipment, setCustomEquipment] = useState('Barbell');
  const [customType, setCustomType] = useState('Compound');
  const [customDifficulty, setCustomDifficulty] = useState('Intermediate');
  const [customInstructions, setCustomInstructions] = useState('');

  // Selected exercise for detail modal
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Selected exercise for Add to Weekly Planner modal (Day 1 - Day 7)
  const [plannerExercise, setPlannerExercise] = useState(null);

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

  // Combine built-in exercises with user custom exercises
  const allExercises = useMemo(() => {
    return [...customExercises, ...EXERCISE_DATABASE];
  }, [customExercises]);

  // Strict 1-to-1 category and subgroup counts
  const categoryCounts = useMemo(() => {
    const counts = {
      total: allExercises.length,
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

    allExercises.forEach(ex => {
      if (counts.muscles[ex.muscle] !== undefined) {
        counts.muscles[ex.muscle]++;
      }
      if (ex.subgroup && counts.subgroups[ex.subgroup] !== undefined) {
        counts.subgroups[ex.subgroup]++;
      }
    });

    return counts;
  }, [allExercises]);

  // Toggle favorite status
  const handleToggleFavorite = (exerciseId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(exerciseId);
      const next = isFav ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId];
      addNotification(isFav ? 'Removed from favorites' : 'Added to favorites ⭐', 'info', 1500);
      return next;
    });
  };

  // Open exercise detail & register as recently viewed
  const handleOpenExerciseDetail = (exercise) => {
    setSelectedExercise(exercise);
    setRecentExerciseIds(prev => [exercise.id, ...prev.filter(id => id !== exercise.id)].slice(0, 25));
  };

  // Toggle accordion expand/collapse for a specific muscle group
  const toggleMuscleExpand = (muscle, e) => {
    if (e) e.stopPropagation();
    setExpandedMuscles(prev => ({
      ...prev,
      [muscle]: !prev[muscle]
    }));
  };

  // Expand all muscle categories
  const handleExpandAll = () => {
    const allExpanded = {};
    MAIN_MUSCLE_GROUPS.forEach(m => { allExpanded[m] = true; });
    setExpandedMuscles(allExpanded);
  };

  // Collapse all muscle categories
  const handleCollapseAll = () => {
    const allCollapsed = {};
    MAIN_MUSCLE_GROUPS.forEach(m => { allCollapsed[m] = false; });
    setExpandedMuscles(allCollapsed);
  };

  // Select a main muscle category
  const handleSelectMuscle = (muscle) => {
    if (selectedMuscle === muscle && selectedSubgroup === 'All') {
      setSelectedMuscle('All');
      setSelectedSubgroup('All');
    } else {
      setSelectedMuscle(muscle);
      setSelectedSubgroup('All');
      setExpandedMuscles(prev => ({ ...prev, [muscle]: true }));
    }
  };

  // Select a specific subgroup under a main muscle category
  const handleSelectSubgroup = (muscle, subgroup, e) => {
    if (e) e.stopPropagation();
    setSelectedMuscle(muscle);
    setSelectedSubgroup(subgroup);
    setExpandedMuscles(prev => ({ ...prev, [muscle]: true }));
  };

  // Filter exercises based on section, search, hierarchy, and filters
  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      // 1. Section filtering
      if (librarySection === 'favorites') {
        if (!favorites.includes(ex.id)) return false;
      } else if (librarySection === 'recent') {
        if (!recentExerciseIds.includes(ex.id)) return false;
      } else if (librarySection === 'custom') {
        if (!ex.isCustom) return false;
      }

      // 2. Search query across all fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const primaryMatch = Array.isArray(ex.primaryMuscles) && ex.primaryMuscles.some(m => m.toLowerCase().includes(q));
        const secondaryMatch = Array.isArray(ex.secondaryMuscles) && ex.secondaryMuscles.some(m => m.toLowerCase().includes(q));
        const matchesSearch = 
          ex.name.toLowerCase().includes(q) ||
          ex.muscle.toLowerCase().includes(q) ||
          (ex.subgroup && ex.subgroup.toLowerCase().includes(q)) ||
          (ex.movementPattern && ex.movementPattern.toLowerCase().includes(q)) ||
          (ex.equipment && ex.equipment.toLowerCase().includes(q)) ||
          primaryMatch ||
          secondaryMatch;

        if (!matchesSearch) return false;
      }

      // 3. Hierarchical category filtering
      if (selectedMuscle !== 'All' && ex.muscle !== selectedMuscle) {
        return false;
      }

      if (selectedSubgroup !== 'All' && ex.subgroup !== selectedSubgroup) {
        return false;
      }

      // 4. Equipment filter
      if (selectedEquipment !== 'All Equipment' && ex.equipment !== selectedEquipment) {
        return false;
      }

      // 5. Difficulty filter
      if (selectedDifficulty !== 'All Levels' && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      // 6. Compound / Isolation type filter
      if (selectedType !== 'All Types' && ex.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [
    allExercises, 
    librarySection, 
    favorites, 
    recentExerciseIds, 
    searchQuery, 
    selectedMuscle, 
    selectedSubgroup, 
    selectedEquipment, 
    selectedDifficulty, 
    selectedType
  ]);

  // Create custom exercise handler
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
      subgroup: customSubgroup,
      subgroups: [customSubgroup],
      primaryMuscles: [customSubgroup],
      secondaryMuscles: [],
      equipment: customEquipment,
      type: customType,
      difficulty: customDifficulty,
      movementPattern: customType === 'Compound' ? 'Compound Movement' : 'Isolation Movement',
      startingPosition: `Position with ${customEquipment} keeping spine neutral and core engaged.`,
      instructions: customInstructions.trim() || `Perform ${customName} with controlled tempo and full range of motion.`,
      technique: 'Maintain tight core, control the eccentric phase, and avoid momentum.',
      breathing: 'Inhale during the eccentric phase; exhale forcefully on exertion.',
      commonMistakes: ['Rushing through reps', 'Improper joint alignment'],
      safetyNotes: 'Choose an appropriate weight and stop if joint discomfort occurs.',
      alternatives: [],
      isCustom: true
    };

    setCustomExercises(prev => [newCustom, ...prev]);
    setCustomName('');
    setCustomInstructions('');
    setIsCustomModalOpen(false);
    setLibrarySection('custom');
    addNotification(`Custom exercise "${newCustom.name}" created!`, 'success');
  };

  const handleAddToWorkout = (exercise) => {
    addNotification(`"${exercise.name}" selected. Head to Workout Tracker to log your sets!`, 'success');
    if (setActiveTab) setActiveTab('tracker');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('All');
    setSelectedSubgroup('All');
    setSelectedEquipment('All Equipment');
    setSelectedDifficulty('All Levels');
    setSelectedType('All Types');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider">
              Hierarchical Workout Database & Bilingual Guides
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Workout Library & Programs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse {allExercises.length} unique exercises across 7 main muscle groups and 32 anatomical subgroups with English & Hindi execution guides.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="p-1 bg-midnight-bg rounded-xl border border-midnight-border flex items-center shrink-0 flex-wrap gap-1">
          <button
            onClick={() => setActiveTabSub('exercises')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabSub === 'exercises'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exercise Library ({allExercises.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSub('programs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabSub === 'programs'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Workout Programs ({PREBUILT_WORKOUT_PROGRAMS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('planner')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition hover:bg-midnight-elevated"
            title="Create and organize custom 7-day manual workouts"
          >
            <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Weekly Planner (Mon - Sun)</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'exercises' ? (
        <>
          {/* Section Selector: All Exercises, Favourites, Recently Viewed, Custom */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-midnight-card border border-midnight-border rounded-2xl p-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setLibrarySection('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  librarySection === 'all'
                    ? 'bg-neon-cyan text-slate-950 shadow-sm'
                    : 'bg-midnight-bg text-slate-400 hover:text-white hover:bg-midnight-elevated'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>All Exercises ({allExercises.length})</span>
              </button>

              <button
                onClick={() => setLibrarySection('favorites')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  librarySection === 'favorites'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-midnight-bg text-slate-400 hover:text-amber-400 hover:bg-midnight-elevated'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favourites ({favorites.length})</span>
              </button>

              <button
                onClick={() => setLibrarySection('recent')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  librarySection === 'recent'
                    ? 'bg-neon-violet text-white shadow-sm'
                    : 'bg-midnight-bg text-slate-400 hover:text-white hover:bg-midnight-elevated'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Recently Viewed ({recentExerciseIds.length})</span>
              </button>

              <button
                onClick={() => setLibrarySection('custom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  librarySection === 'custom'
                    ? 'bg-neon-gold text-slate-950 shadow-sm'
                    : 'bg-midnight-bg text-slate-400 hover:text-white hover:bg-midnight-elevated'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Custom Exercises ({customExercises.length})</span>
              </button>
            </div>

            {/* Create Custom Exercise Button */}
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3.5 py-1.5 bg-midnight-elevated hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Custom Exercise</span>
            </button>
          </div>

          {/* Unified Filters Bar: Search, 3 Dropdowns, 7 Horizontal Muscle Groups & Subgroups */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-5 md:p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 190+ exercises by name, muscle, subgroup, lats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* The 3 Dropdowns: Equipment, Type, Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase tracking-wider">Equipment</label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                >
                  {EQUIPMENT_TYPES.map(eq => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase tracking-wider">Exercise Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                >
                  {EXERCISE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase tracking-wider">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                >
                  {DIFFICULTY_LEVELS.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* THE 7 MAIN MUSCLE GROUPS IN HORIZONTAL BELOW THE 3 DROPDOWNS */}
            <div className="space-y-2 pt-3 border-t border-midnight-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>7 Muscle Groups:</span>
                </span>

                {selectedMuscle !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMuscle('All');
                      setSelectedSubgroup('All');
                    }}
                    className="text-xs text-neon-cyan hover:underline font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Show All Muscles</span>
                  </button>
                )}
              </div>

              {/* Horizontal scrollable row of the 7 Main Muscle Groups */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMuscle('All');
                    setSelectedSubgroup('All');
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                    selectedMuscle === 'All'
                      ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25 font-black'
                      : 'bg-midnight-bg text-slate-300 hover:text-white border border-midnight-border hover:border-slate-600'
                  }`}
                >
                  <span>All Muscles</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/25">
                    {allExercises.length}
                  </span>
                </button>

                {MAIN_MUSCLE_GROUPS.map((mg, idx) => {
                  const isSelected = selectedMuscle === mg;
                  const count = categoryCounts.muscles[mg] || 0;

                  return (
                    <button
                      key={mg}
                      type="button"
                      onClick={() => handleSelectMuscle(mg)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
                        isSelected
                          ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/25 font-black'
                          : 'bg-midnight-bg text-slate-300 hover:text-white border border-midnight-border hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[10px] flex items-center justify-center font-bold ${
                        isSelected ? 'bg-slate-950 text-neon-cyan' : 'bg-midnight-elevated text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{mg}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-black/30 text-slate-950 font-black' : 'bg-black/25 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Horizontal Subgroups row appearing directly underneath selected muscle group */}
              {selectedMuscle !== 'All' && MUSCLE_SUBGROUPS[selectedMuscle] && (
                <div className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-neon-cyan" />
                      <span>{selectedMuscle} Subgroups ({MUSCLE_SUBGROUPS[selectedMuscle].length} anatomical regions):</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Click a subgroup to filter exercises</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setSelectedSubgroup('All')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                        selectedSubgroup === 'All'
                          ? 'bg-neon-cyan text-slate-950 font-black'
                          : 'bg-midnight-elevated text-slate-300 hover:text-white border border-midnight-border'
                      }`}
                    >
                      <span>All {selectedMuscle}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-black/20">
                        {categoryCounts.muscles[selectedMuscle] || 0}
                      </span>
                    </button>

                    {MUSCLE_SUBGROUPS[selectedMuscle].map(sg => {
                      const isSgActive = selectedSubgroup === sg;
                      const sgCount = categoryCounts.subgroups[sg] || 0;

                      return (
                        <button
                          key={sg}
                          type="button"
                          onClick={(e) => handleSelectSubgroup(selectedMuscle, sg, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                            isSgActive
                              ? 'bg-neon-violet text-white font-bold shadow-md shadow-neon-violet/30 border border-neon-violet'
                              : 'bg-midnight-elevated text-slate-300 hover:text-white border border-midnight-border'
                          }`}
                        >
                          <span>{sg}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${
                            isSgActive ? 'bg-black/30 text-white' : 'bg-black/20 text-slate-400'
                          }`}>
                            {sgCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Summary & Reset */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 gap-2 border-t border-midnight-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing <strong className="text-white">{filteredExercises.length}</strong> of {allExercises.length} exercises
                </span>
                {selectedMuscle !== 'All' && (
                  <span className="px-2 py-0.5 rounded-md bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[10px] font-bold">
                    Group: {selectedMuscle}
                  </span>
                )}
                {selectedSubgroup !== 'All' && (
                  <span className="px-2 py-0.5 rounded-md bg-neon-violet/10 text-neon-violet border border-neon-violet/20 text-[10px] font-bold">
                    Subgroup: {selectedSubgroup}
                  </span>
                )}
              </div>

              {(searchQuery || selectedMuscle !== 'All' || selectedSubgroup !== 'All' || selectedEquipment !== 'All Equipment' || selectedDifficulty !== 'All Levels' || selectedType !== 'All Types') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-neon-cyan hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Exercise Cards Grid */}
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((ex) => {
                const isFav = favorites.includes(ex.id);
                const isLegPress45 = Boolean(
                  ex.isLegPress45 ||
                  /45.*leg\s*press/i.test(ex.name) ||
                  /leg\s*press.*45/i.test(ex.name)
                );

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleOpenExerciseDetail(ex)}
                    className="p-5 rounded-2xl bg-midnight-card border border-midnight-border hover:border-neon-cyan/50 cursor-pointer transition group flex flex-col justify-between space-y-3 relative hover:shadow-xl hover:shadow-neon-cyan/5 active:scale-[0.99]"
                  >
                    <div>
                      {/* Top Badges & Favorite Star Button */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25 uppercase tracking-wider">
                            {ex.muscle}
                          </span>
                          {ex.subgroup && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neon-violet/15 text-neon-violet border border-neon-violet/25">
                              {ex.subgroup}
                            </span>
                          )}
                        </div>

                        {/* Favorite button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(ex.id, e)}
                          className={`p-1.5 rounded-lg border transition ${
                            isFav
                              ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                              : 'bg-midnight-bg text-slate-500 hover:text-amber-400 border-midnight-border'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Exercise Name */}
                      <h3 className="text-sm font-black text-white group-hover:text-neon-cyan transition leading-snug">
                        {ex.name}
                      </h3>

                      {/* 45-Degree Leg Press Notice */}
                      {isLegPress45 && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[10px] font-semibold">
                          <Info className="w-3 h-3" /> Sled Excluded (0 kg)
                        </div>
                      )}

                      {/* Instructions snippet */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {ex.instructions}
                      </p>
                    </div>

                    {/* Card Footer: Equipment, Difficulty, Hindi Guide Link & Add to Planner */}
                    <div className="pt-3 border-t border-midnight-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-300 font-mono">
                          {ex.equipment}
                        </span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-slate-400 text-[10px]">{ex.difficulty}</span>
                        {ex.type && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-midnight-elevated text-slate-300 border border-midnight-border">
                            {ex.type}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Quick Add to Weekly Planner Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlannerExercise(ex);
                          }}
                          className="px-2 py-1 rounded-lg bg-midnight-elevated hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 text-[10px] font-bold flex items-center gap-1 transition active:scale-95"
                          title="Add to Day 1 - Day 7 in Weekly Planner"
                        >
                          <CalendarPlus className="w-3 h-3" />
                          <span>+ Plan</span>
                        </button>

                        <span className="text-neon-cyan text-xs font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <Languages className="w-3 h-3" />
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-midnight-elevated flex items-center justify-center mx-auto text-slate-400">
                {librarySection === 'favorites' ? (
                  <Star className="w-6 h-6 text-amber-400" />
                ) : librarySection === 'recent' ? (
                  <Clock className="w-6 h-6 text-neon-violet" />
                ) : librarySection === 'custom' ? (
                  <Wand2 className="w-6 h-6 text-neon-cyan" />
                ) : (
                  <Search className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {librarySection === 'favorites'
                    ? 'No favorite exercises saved yet'
                    : librarySection === 'recent'
                    ? 'No recently viewed exercises'
                    : librarySection === 'custom'
                    ? 'No custom exercises created yet'
                    : 'No exercises match your search or filter'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {librarySection === 'favorites'
                    ? 'Click the star icon on any exercise card or within the exercise guide to save your top movements here.'
                    : librarySection === 'recent'
                    ? 'Exercises you view or select will automatically appear here for quick access.'
                    : librarySection === 'custom'
                    ? 'Create your own personalized movements with specific equipment, muscles, and cues.'
                    : 'Try clearing your search terms or resetting the muscle group filters above.'}
                </p>
              </div>

              {librarySection === 'custom' ? (
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="px-5 py-2.5 bg-neon-cyan text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-neon-cyan/20 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Exercise</span>
                </button>
              ) : (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-midnight-elevated hover:bg-[#1e2f50] text-neon-cyan rounded-xl text-xs font-bold border border-midnight-border inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Workout Programs Section (All 12 Prebuilt Programs) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREBUILT_WORKOUT_PROGRAMS.map((prog) => (
              <div key={prog.id} className="bg-midnight-card border border-midnight-border rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-violet/10 text-neon-violet border border-neon-violet/20 font-mono">
                      {prog.splitType}
                    </span>
                    <span className="text-[10px] text-neon-cyan font-bold">{prog.level}</span>
                  </div>

                  <h3 className="text-base font-black text-white">{prog.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{prog.description}</p>
                </div>

                {/* Days Schedule Preview */}
                <div className="space-y-2 pt-2 border-t border-midnight-border">
                  <span className="text-[11px] font-bold text-slate-300 block">Schedule ({prog.days.length} Days):</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {prog.days.map((day) => (
                      <div key={day.dayNumber} className="p-2.5 rounded-xl bg-midnight-bg border border-midnight-border text-xs">
                        <p className="font-bold text-white text-[11px]">{day.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {day.exercises.map(e => e.name).join(' • ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addNotification(`Program "${prog.title}" ready! Head to Workout Tracker to log.`, 'success');
                    if (setActiveTab) setActiveTab('tracker');
                  }}
                  className="w-full py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Start This Program</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Detail Modal with Hindi translation toggle & favorite support */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        onAddToWorkout={handleAddToWorkout}
        onAddToPlanner={(ex) => setPlannerExercise(ex)}
        isFavorite={selectedExercise ? favorites.includes(selectedExercise.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Add To Weekly Planner (Day 1 - Day 7) Modal */}
      <AddToPlannerModal
        isOpen={Boolean(plannerExercise)}
        onClose={() => setPlannerExercise(null)}
        exercise={plannerExercise}
        setActiveTab={setActiveTab}
      />

      {/* Create Custom Exercise Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-midnight-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-neon-cyan" />
                <h3 className="text-base font-black text-white">Create Custom Exercise</h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomExercise} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pause Deficit Deadlift"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Main Muscle Group</label>
                  <select
                    value={customMuscle}
                    onChange={(e) => {
                      const m = e.target.value;
                      setCustomMuscle(m);
                      setCustomSubgroup(MUSCLE_SUBGROUPS[m]?.[0] || 'General');
                    }}
                    className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {MAIN_MUSCLE_GROUPS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Muscle Subgroup</label>
                  <select
                    value={customSubgroup}
                    onChange={(e) => setCustomSubgroup(e.target.value)}
                    className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {(MUSCLE_SUBGROUPS[customMuscle] || []).map(sg => (
                      <option key={sg} value={sg}>{sg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Equipment</label>
                  <select
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="w-full px-2.5 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    {EQUIPMENT_TYPES.filter(e => e !== 'All Equipment').map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full px-2.5 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="Compound">Compound</option>
                    <option value="Isolation">Isolation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value)}
                    className="w-full px-2.5 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Instructions & Technique Cues</label>
                <textarea
                  rows={3}
                  placeholder="Describe proper setup, execution cues, breathing..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black rounded-xl shadow-md shadow-neon-cyan/20 active:scale-95 transition"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default ExerciseLibraryPage;