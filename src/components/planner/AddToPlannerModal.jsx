import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  CalendarPlus, 
  Calendar, 
  X, 
  Check, 
  Dumbbell, 
  Plus, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Flame
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { DAYS_OF_WEEK } from '../../utils/routinePresets';

export const AddToPlannerModal = ({ isOpen, onClose, exercise, setActiveTab }) => {
  const { weeklyRoutine, addExerciseToDayPlan } = useWorkout();
  const { userProfile } = useAuth();
  const { addNotification } = useNotification();

  // Selected day key (defaults to 'monday')
  const [selectedDayKey, setSelectedDayKey] = useState('monday');
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState('8-10');
  const [targetWeight, setTargetWeight] = useState(() => {
    if (exercise?.isLegPress45 || /45.*leg\s*press/i.test(exercise?.name || '')) return 100;
    return 20;
  });
  const [unit, setUnit] = useState(() => (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Prevent background scrolling while modal is open & handle escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !exercise) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        exerciseId: exercise.id,
        name: exercise.name,
        muscle: exercise.muscle || exercise.category || 'Other',
        category: exercise.muscle || exercise.category || 'Other',
        subgroup: exercise.subgroup || '',
        equipment: exercise.equipment || 'Barbell',
        targetSets: parseInt(targetSets, 10) || 3,
        targetReps: targetReps || '8-10',
        targetWeight: parseFloat(targetWeight) || 0,
        unit,
        notes: notes.trim(),
        isLegPress45: Boolean(exercise.isLegPress45 || /45.*leg\s*press/i.test(exercise.name))
      };

      const result = await addExerciseToDayPlan(selectedDayKey, payload);

      const dayObj = DAYS_OF_WEEK.find(d => d.key === selectedDayKey);
      const dayIndex = DAYS_OF_WEEK.findIndex(d => d.key === selectedDayKey) + 1;
      const dayDisplayName = `Day ${dayIndex} (${dayObj?.name || result.dayName})`;

      setIsAddedSuccess(true);
      addNotification(`Added "${exercise.name}" to ${dayDisplayName}!`, 'success');

      setTimeout(() => {
        setIsAddedSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Failed to add exercise to planner:', err);
      addNotification('Failed to add exercise to planner', 'error');
      setIsSubmitting(false);
    }
  };

  const selectedDayIndex = DAYS_OF_WEEK.findIndex(d => d.key === selectedDayKey) + 1;
  const selectedDayInfo = DAYS_OF_WEEK.find(d => d.key === selectedDayKey);
  const currentPlanForSelectedDay = weeklyRoutine?.[selectedDayKey];

  const modalContent = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-5 md:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-midnight-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Add to Weekly Planner
              </h3>
              <p className="text-[11px] text-slate-400">
                Insert exercise into your 7-day routine schedule (Day 1 - Day 7)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-midnight-elevated transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Exercise Banner */}
        <div className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{exercise.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
              <span className="font-semibold text-neon-cyan">{exercise.muscle}</span>
              {exercise.subgroup && (
                <>
                  <span>&bull;</span>
                  <span className="text-neon-violet">{exercise.subgroup}</span>
                </>
              )}
              <span>&bull;</span>
              <span>{exercise.equipment}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-midnight-elevated text-slate-300 border border-midnight-border shrink-0">
            {exercise.type || 'Exercise'}
          </span>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleAdd} className="space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-thin">
          
          {/* Day 1 to Day 7 Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Select Workout Day (Day 1 to Day 7)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DAYS_OF_WEEK.map((d, index) => {
                const dayNumber = index + 1;
                const isSelected = selectedDayKey === d.key;
                const dayPlan = weeklyRoutine?.[d.key];
                const exerciseCount = dayPlan?.exercises?.length || 0;
                const isRest = dayPlan?.isRestDay;

                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDayKey(d.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-neon-cyan/10 border-neon-cyan shadow-sm shadow-neon-cyan/20'
                        : 'bg-midnight-bg border-midnight-border hover:border-slate-600 hover:bg-midnight-elevated'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black font-mono px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-neon-cyan text-slate-950'
                            : 'bg-midnight-elevated text-slate-400'
                        }`}>
                          Day {dayNumber}
                        </span>
                        <span className={`text-xs font-bold truncate ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                          {d.name}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        {isRest ? (
                          <span className="text-amber-400/90 font-medium">Rest Day</span>
                        ) : (
                          <span>{dayPlan?.title || `${d.name} Routine`}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-semibold block ${
                        isSelected ? 'text-neon-cyan' : 'text-slate-500'
                      }`}>
                        {exerciseCount} {exerciseCount === 1 ? 'ex' : 'exs'}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-neon-cyan ml-auto mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Sets, Reps & Weight */}
          <div className="p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border space-y-3">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Target Parameters for Day {selectedDayIndex} ({selectedDayInfo?.name})
            </h5>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {/* Sets */}
              <div className="min-w-0">
                <label className="text-[10px] font-bold text-slate-300 block mb-1 truncate">
                  Target Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={targetSets}
                  onChange={(e) => setTargetSets(e.target.value)}
                  className="w-full px-2 py-1.5 bg-midnight-card border border-slate-700/80 rounded-xl text-white text-xs font-mono text-center focus:outline-none focus:border-neon-cyan"
                  required
                />
              </div>

              {/* Reps */}
              <div className="min-w-0">
                <label className="text-[10px] font-bold text-slate-300 block mb-1 truncate">
                  Target Reps
                </label>
                <input
                  type="text"
                  value={targetReps}
                  onChange={(e) => setTargetReps(e.target.value)}
                  placeholder="e.g. 8-10"
                  className="w-full px-2 py-1.5 bg-midnight-card border border-slate-700/80 rounded-xl text-white text-xs font-mono text-center focus:outline-none focus:border-neon-cyan"
                  required
                />
              </div>

              {/* Weight & Unit */}
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-1 gap-1">
                  <label className="text-[10px] font-bold text-slate-300 truncate">
                    Weight
                  </label>
                  <button
                    type="button"
                    onClick={() => setUnit(u => (u === 'LB' || u === 'LBS') ? 'KG' : 'LBS')}
                    className="text-[9px] font-mono font-bold text-neon-cyan hover:underline shrink-0"
                  >
                    {unit === 'LB' ? 'LBS' : unit}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="500"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full pl-2 pr-6 py-1.5 bg-midnight-card border border-slate-700/80 rounded-xl text-white text-xs font-mono text-center focus:outline-none focus:border-neon-cyan"
                  />
                  <span className="absolute right-1.5 top-1.5 text-[9px] font-mono text-slate-400 font-bold pointer-events-none">
                    {unit === 'LB' ? 'LBS' : unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Cue / Notes */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Notes / Cue (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on chest contraction, 90 sec rest..."
                className="w-full px-3 py-1.5 bg-midnight-card border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                isAddedSuccess
                  ? 'bg-neon-success text-slate-950 font-black'
                  : 'bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 shadow-lg shadow-neon-cyan/25 disabled:opacity-50'
              }`}
            >
              {isAddedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Day {selectedDayIndex} ({selectedDayInfo?.name})!</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Adding...'
                      : `Insert into Day ${selectedDayIndex}: ${selectedDayInfo?.name}`}
                  </span>
                </>
              )}
            </button>

            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('planner');
                }}
                className="py-3 px-3.5 rounded-xl bg-midnight-bg border border-midnight-border hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
                title="Open Weekly Planner"
              >
                <span>View Planner</span>
                <ArrowRight className="w-3.5 h-3.5 text-neon-cyan" />
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
