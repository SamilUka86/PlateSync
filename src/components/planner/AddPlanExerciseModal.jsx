import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Dumbbell, 
  Plus, 
  Sparkles, 
  Check, 
  Filter, 
  Layers,
  Info,
  Scale
} from 'lucide-react';
import { 
  EXERCISE_DATABASE, 
  MAIN_MUSCLE_GROUPS,
  MUSCLE_GROUPS, 
  MUSCLE_SUBGROUPS,
  EQUIPMENT_TYPES 
} from '../../utils/exerciseData';
import { useAuth } from '../../context/AuthContext';

export const AddPlanExerciseModal = ({ 
  isOpen, 
  onClose, 
  dayKey, 
  dayName, 
  onAddExercise 
}) => {
  if (!isOpen) return null;

  const { userProfile } = useAuth();
  const defaultUnit = userProfile?.preferredUnit || 'KG';

  // Mode: 'library' | 'custom'
  const [activeTab, setActiveTab] = useState('library');

  // Library Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedSubgroup, setSelectedSubgroup] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All Equipment');

  // Selected Library Exercise
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Common target parameters
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState('8-10');
  const [targetWeight, setTargetWeight] = useState(20);
  const [targetUnit, setTargetUnit] = useState(defaultUnit);
  const [notes, setNotes] = useState('');

  // Custom Exercise Fields
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [customEquipment, setCustomEquipment] = useState('Barbell');

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        ex.name.toLowerCase().includes(q) || 
        ex.muscle.toLowerCase().includes(q) ||
        (ex.subgroup && ex.subgroup.toLowerCase().includes(q));
      const matchesMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle || ex.category === selectedMuscle;
      const matchesSubgroup = selectedSubgroup === 'All' || ex.subgroup === selectedSubgroup;
      const matchesEquip = selectedEquipment === 'All Equipment' || ex.equipment === selectedEquipment;
      return matchesSearch && matchesMuscle && matchesSubgroup && matchesEquip;
    });
  }, [searchQuery, selectedMuscle, selectedSubgroup, selectedEquipment]);

  const handleSelectLibraryItem = (ex) => {
    setSelectedExercise(ex);
    const isLegPress = Boolean(ex.isLegPress45 || /45.*leg\s*press/i.test(ex.name));
    setTargetWeight(isLegPress ? 140 : (ex.defaultBarbell || 20));
    setNotes(ex.instructions ? `${ex.instructions.slice(0, 100)}...` : '');
  };

  const handleConfirmLibraryAdd = () => {
    if (!selectedExercise) return;
    const isLegPress = Boolean(selectedExercise.isLegPress45 || /45.*leg\s*press/i.test(selectedExercise.name));

    onAddExercise({
      id: `plan_ex_${Date.now()}_${Math.random()}`,
      exerciseId: selectedExercise.id,
      name: selectedExercise.name,
      muscle: selectedExercise.muscle || selectedExercise.category || 'Other',
      category: selectedExercise.category || selectedExercise.muscle || 'Other',
      equipment: selectedExercise.equipment || 'Gym Equipment',
      isLegPress45: isLegPress,
      targetSets: Number(targetSets) || 3,
      targetReps: String(targetReps || '8-10'),
      targetWeight: Number(targetWeight) || 0,
      unit: targetUnit,
      notes: notes.trim(),
      isCustom: false
    });

    onClose();
  };

  const handleConfirmCustomAdd = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddExercise({
      id: `plan_custom_${Date.now()}_${Math.random()}`,
      exerciseId: `custom_${Date.now()}`,
      name: customName.trim(),
      muscle: customMuscle,
      category: customMuscle,
      equipment: customEquipment,
      isLegPress45: /45.*leg\s*press/i.test(customName),
      targetSets: Number(targetSets) || 3,
      targetReps: String(targetReps || '10-12'),
      targetWeight: Number(targetWeight) || 0,
      unit: targetUnit,
      notes: notes.trim(),
      isCustom: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-midnight-border flex items-center justify-between shrink-0 bg-midnight-secondary/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shadow-glow-cyan">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Add Exercise to {dayName}
              </h3>
              <p className="text-xs text-slate-400">
                Choose from 160+ database movements or build your own custom exercise
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-4 md:px-6 pt-4 pb-2 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-midnight-bg rounded-2xl border border-midnight-border">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'library'
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Existing Library (160+ Exercises)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Custom Exercise</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search exercises by name (e.g. Bench, Squat, Lat Pulldown)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition"
                  />
                </div>

                {/* Muscle Group Horizontal Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['All', ...MAIN_MUSCLE_GROUPS].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMuscle(m);
                        setSelectedSubgroup('All');
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
                        selectedMuscle === m
                          ? 'bg-neon-cyan text-slate-950 font-bold'
                          : 'bg-midnight-bg text-slate-400 hover:text-white border border-midnight-border'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Subgroups under selected muscle group */}
                {selectedMuscle !== 'All' && MUSCLE_SUBGROUPS[selectedMuscle] && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-l-2 border-neon-cyan/40 pl-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubgroup('All')}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition ${
                        selectedSubgroup === 'All'
                          ? 'bg-neon-cyan text-slate-950'
                          : 'bg-midnight-elevated text-slate-300 hover:text-white'
                      }`}
                    >
                      All {selectedMuscle}
                    </button>
                    {MUSCLE_SUBGROUPS[selectedMuscle].map(sg => (
                      <button
                        key={sg}
                        type="button"
                        onClick={() => setSelectedSubgroup(sg)}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] transition whitespace-nowrap ${
                          selectedSubgroup === sg
                            ? 'bg-neon-violet text-white font-bold border border-neon-violet'
                            : 'bg-midnight-elevated text-slate-300 hover:text-white'
                        }`}
                      >
                        {sg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* List of Filtered Exercises */}
              <div className="border border-midnight-border rounded-2xl bg-midnight-bg/60 overflow-hidden divide-y divide-midnight-border max-h-56 overflow-y-auto">
                {filteredExercises.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No matching exercises found. Try searching another term or build a custom one!
                  </div>
                ) : (
                  filteredExercises.map((ex) => {
                    const isSelected = selectedExercise?.id === ex.id;
                    return (
                      <div
                        key={ex.id}
                        onClick={() => handleSelectLibraryItem(ex)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-neon-cyan/15 border-l-4 border-l-neon-cyan'
                            : 'hover:bg-midnight-elevated'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-neon-cyan' : 'text-white'}`}>
                            {ex.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-midnight-card border border-midnight-border text-slate-300">
                              {ex.muscle}
                            </span>
                            {ex.subgroup && (
                              <span className="px-1.5 py-0.5 rounded bg-neon-violet/10 text-neon-violet border border-neon-violet/20 font-semibold">
                                {ex.subgroup}
                              </span>
                            )}
                            <span>•</span>
                            <span>{ex.equipment}</span>
                            {ex.type && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400">{ex.type}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="w-6 h-6 rounded-full bg-neon-cyan text-slate-950 flex items-center justify-center font-bold">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-midnight-card hover:bg-neon-cyan hover:text-slate-950 border border-midnight-border text-slate-300 text-[10px] font-bold transition">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Target Sets, Reps, Weight Config for Selected Exercise */}
              {selectedExercise && (
                <div className="p-4 rounded-2xl bg-midnight-secondary border border-neon-cyan/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                      Configure Targets for: <span className="text-neon-cyan">{selectedExercise.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedExercise.equipment}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Target Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={targetSets}
                        onChange={(e) => setTargetSets(e.target.value)}
                        className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Target Reps
                      </label>
                      <input
                        type="text"
                        value={targetReps}
                        onChange={(e) => setTargetReps(e.target.value)}
                        placeholder="e.g. 8-10 or 12"
                        className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-300">
                          Target Weight
                        </label>
                        <button
                          type="button"
                          onClick={() => setTargetUnit(prev => prev === 'KG' ? 'LB' : 'KG')}
                          className="text-[10px] font-mono font-bold text-neon-cyan hover:underline"
                        >
                          {targetUnit}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={targetWeight}
                          onChange={(e) => setTargetWeight(e.target.value)}
                          className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono pointer-events-none">
                          {targetUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Routine Notes / Rest Guidance (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. 2 min rest, focus on slow eccentric"
                      className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Custom Exercise Form */
            <form onSubmit={handleConfirmCustomAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Incline Cable Flyes, Paused Front Squat..."
                  className="w-full px-3.5 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Muscle Group
                  </label>
                  <select
                    value={customMuscle}
                    onChange={(e) => setCustomMuscle(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                  >
                    {MUSCLE_GROUPS.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Equipment Type
                  </label>
                  <select
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                  >
                    {EQUIPMENT_TYPES.filter(e => e !== 'All Equipment').map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Parameters */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={targetSets}
                    onChange={(e) => setTargetSets(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Reps
                  </label>
                  <input
                    type="text"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                    placeholder="e.g. 10-12"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Target Weight
                    </label>
                    <button
                      type="button"
                      onClick={() => setTargetUnit(prev => prev === 'KG' ? 'LB' : 'KG')}
                      className="text-[10px] font-mono font-bold text-neon-cyan hover:underline"
                    >
                      {targetUnit}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono pointer-events-none">
                      {targetUnit}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technique Notes & Form Cues
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Keep chest up, slow 3-second descent, squeeze hard at peak contraction..."
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-midnight-border text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-neon-cyan/25"
                >
                  Add Custom Exercise to {dayName}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer (for library mode) */}
        {activeTab === 'library' && (
          <div className="p-4 md:p-6 border-t border-midnight-border flex items-center justify-between shrink-0 bg-midnight-secondary/40">
            <span className="text-[11px] text-slate-400">
              {selectedExercise ? (
                <>Selected: <strong className="text-white">{selectedExercise.name}</strong></>
              ) : (
                'Select an exercise from above to configure sets & reps'
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedExercise}
                onClick={handleConfirmLibraryAdd}
                className="px-5 py-2.5 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-neon-cyan/20 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to {dayName}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
