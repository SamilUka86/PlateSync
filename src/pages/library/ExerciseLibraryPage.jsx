import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Dumbbell, 
  Filter, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Info, 
  Plus, 
  Play, 
  Calendar, 
  Sparkles,
  Languages
} from 'lucide-react';
import { 
  EXERCISE_DATABASE, 
  MUSCLE_GROUPS, 
  EQUIPMENT_TYPES, 
  DIFFICULTY_LEVELS,
  EXERCISE_TYPES,
  PREBUILT_WORKOUT_PROGRAMS
} from '../../utils/exerciseData';
import { ExerciseDetailModal } from '../../components/library/ExerciseDetailModal';
import { useNotification } from '../../context/NotificationContext';

export const ExerciseLibraryPage = ({ setActiveTab }) => {
  const { addNotification } = useNotification();
  const [activeTabSub, setActiveTabSub] = useState('exercises'); // 'exercises' | 'programs'

  // Exercise filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All Equipment');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedType, setSelectedType] = useState('All Types');

  // Exercise Detail Modal with Hindi translation toggle
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Filter exercises across all 160+ database items
  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = ex.name.toLowerCase().includes(q) ||
                            ex.muscle.toLowerCase().includes(q) ||
                            ex.movementPattern?.toLowerCase().includes(q);
      const matchesMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle || ex.category === selectedMuscle;
      const matchesEquip = selectedEquipment === 'All Equipment' || ex.equipment === selectedEquipment;
      const matchesDiff = selectedDifficulty === 'All Levels' || ex.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'All Types' || ex.type === selectedType;

      return matchesSearch && matchesMuscle && matchesEquip && matchesDiff && matchesType;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty, selectedType]);

  const handleAddToWorkout = (exercise) => {
    addNotification(`"${exercise.name}" selected. Head to Workout Tracker to log your sets!`, 'success');
    if (setActiveTab) setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider">
              Comprehensive Exercise Catalog & Training Systems
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Exercise Library & Programs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse 160+ movement mechanics, bilingual Devanagari Hindi execution guides, and 12 prebuilt routines.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="p-1 bg-midnight-bg rounded-xl border border-midnight-border flex items-center shrink-0">
          <button
            onClick={() => setActiveTabSub('exercises')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'exercises'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Exercise Library ({EXERCISE_DATABASE.length})
          </button>
          <button
            onClick={() => setActiveTabSub('programs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'programs'
                ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Workout Programs ({PREBUILT_WORKOUT_PROGRAMS.length})
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
          {/* Filters Bar */}
          <div className="bg-midnight-card border border-midnight-border rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search bench press, squat, deadlift..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* Equipment Filter */}
              <div>
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

              {/* Movement Type Filter (Compound / Isolation) */}
              <div>
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

              {/* Difficulty Filter */}
              <div>
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

            {/* Muscle Group Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {MUSCLE_GROUPS.map((mg) => (
                <button
                  key={mg}
                  onClick={() => setSelectedMuscle(mg)}
                  className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                    selectedMuscle === mg
                      ? 'bg-neon-cyan text-slate-950'
                      : 'bg-midnight-bg text-slate-400 hover:text-white'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
          </div>

          {/* Results count banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-white">{filteredExercises.length}</strong> of {EXERCISE_DATABASE.length} exercises</span>
            {(searchQuery || selectedMuscle !== 'All' || selectedEquipment !== 'All Equipment' || selectedDifficulty !== 'All Levels' || selectedType !== 'All Types') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMuscle('All');
                  setSelectedEquipment('All Equipment');
                  setSelectedDifficulty('All Levels');
                  setSelectedType('All Types');
                }}
                className="text-neon-cyan hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="p-5 rounded-2xl bg-midnight-card border border-midnight-border hover:border-neon-cyan/40 cursor-pointer transition group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                      {ex.muscle}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ex.equipment}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-neon-cyan transition leading-snug">
                    {ex.name}
                  </h3>

                  {ex.isLegPress45 && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[10px] font-semibold">
                      <Info className="w-3 h-3" /> Sled Excluded (0 kg)
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {ex.instructions}
                  </p>
                </div>

                <div className="pt-3 border-t border-midnight-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px]">{ex.difficulty}</span>
                    {ex.type && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-midnight-elevated text-slate-400">
                        {ex.type}
                      </span>
                    )}
                  </div>
                  <span className="text-neon-cyan text-xs font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <Languages className="w-3 h-3" />
                    <span>Guide & Hindi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Workout Programs Section (All 12 Programs) */
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

      {/* Exercise Detail Modal with Hindi translation toggle */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        onAddToWorkout={handleAddToWorkout}
      />

    </div>
  );
};
