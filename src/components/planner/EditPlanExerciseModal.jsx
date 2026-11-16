import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell, Save, Trash2, Scale } from 'lucide-react';

export const EditPlanExerciseModal = ({ 
  isOpen, 
  onClose, 
  exercise, 
  onSave, 
  onRemove 
}) => {
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

  const [targetSets, setTargetSets] = useState(exercise.targetSets || 3);
  const [targetReps, setTargetReps] = useState(exercise.targetReps || '8-10');
  const [targetWeight, setTargetWeight] = useState(exercise.targetWeight || 0);
  const [targetUnit, setTargetUnit] = useState((exercise.unit === 'LB' || exercise.unit === 'LBS') ? 'LBS' : 'KG');
  const [notes, setNotes] = useState(exercise.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...exercise,
      targetSets: Number(targetSets) || 3,
      targetReps: String(targetReps || '8-10'),
      targetWeight: Number(targetWeight) || 0,
      unit: targetUnit,
      notes: notes.trim()
    });
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Edit Routine Targets
              </h3>
              <p className="text-xs text-neon-cyan font-medium truncate max-w-[220px]">
                {exercise.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-midnight-elevated transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-200 mb-1 truncate">
                Target Sets
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={targetSets}
                onChange={(e) => setTargetSets(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-2 bg-midnight-bg border border-slate-700 rounded-xl text-white text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-200 mb-1 truncate">
                Target Reps
              </label>
              <input
                type="text"
                value={targetReps}
                onChange={(e) => setTargetReps(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-2 bg-midnight-bg border border-slate-700 rounded-xl text-white text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1 gap-1">
                <label className="text-xs font-bold text-slate-200 truncate">
                  Weight
                </label>
                <button
                  type="button"
                  onClick={() => setTargetUnit(prev => (prev === 'LB' || prev === 'LBS') ? 'KG' : 'LBS')}
                  className="text-[11px] font-mono font-bold text-neon-cyan hover:underline shrink-0"
                >
                  {targetUnit === 'LB' ? 'LBS' : targetUnit}
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full pl-2.5 sm:pl-3 pr-7 py-2 bg-midnight-bg border border-slate-700 rounded-xl text-white text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-neon-cyan"
                />
                <span className="absolute right-2 top-2 text-[11px] text-slate-400 font-mono pointer-events-none font-bold">
                  {targetUnit === 'LB' ? 'LBS' : targetUnit}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Routine Notes / Cues
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-midnight-bg border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-midnight-border">
            <button
              type="button"
              onClick={() => {
                if (onRemove) onRemove(exercise.id);
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-neon-cyan/25 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
