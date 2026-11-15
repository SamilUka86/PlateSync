import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Dumbbell, 
  Globe2, 
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  getGlobalExercises, 
  addGlobalExercise, 
  updateGlobalExercise, 
  deleteGlobalExercise 
} from '../../../services/admin/adminDataService';
import { MAIN_MUSCLE_GROUPS, MUSCLE_SUBGROUPS } from '../../../utils/exerciseData';
import { useNotification } from '../../../context/NotificationContext';

const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Kettlebell', 'Smith Machine', 'Plate Loaded'];
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const PATTERN_OPTIONS = ['Horizontal Push', 'Vertical Push', 'Horizontal Pull', 'Vertical Pull', 'Squat', 'Hinge', 'Lunge', 'Carry', 'Isolation / Flexion'];

export const AdminExercisesTab = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('ALL');
  const [equipmentFilter, setEquipmentFilter] = useState('ALL');

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState(getBlankForm());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete Confirmation Modal
  const [deletingExercise, setDeletingExercise] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { addNotification } = useNotification();

  function getBlankForm() {
    return {
      name: '',
      muscle: 'Chest',
      subgroup: 'Middle Chest',
      primaryMuscles: 'Pectoralis Major',
      secondaryMuscles: 'Triceps, Anterior Deltoids',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      movementPattern: 'Horizontal Push',
      isCompound: true,
      startingPosition: 'Lie flat on the bench, feet firmly planted on the floor with eyes aligned directly under the barbell.',
      instructions: '1. Unrack barbell with straight arms.\n2. Inhale and lower bar with control to lower sternum.\n3. Press powerfully back up to lockout while exhaling.',
      breathing: 'Inhale on the descent; exhale forcefully upon pressing up.',
      commonMistakes: 'Bouncing the barbell off chest; flaring elbows at 90 degrees.',
      safetyPrecautions: 'Always use collars or safety catches when lifting without a spotter.',
      tips: 'Tuck shoulder blades down and back into the bench for scapular stability.',
      alternatives: 'Dumbbell Flat Press, Smith Machine Bench Press',
      instructionsHindi: '1. बारबेल को नियंत्रित गति से नीचे लाएं।\n2. छाती को छूते हुए ऊपर उठाएं और सांस छोड़ें।',
      mediaUrl: ''
    };
  }

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await getGlobalExercises();
      setExercises(data);
    } catch (err) {
      console.error('Failed to load global exercises:', err);
      addNotification('Could not load exercise library.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const openAddModal = () => {
    setEditingExercise(null);
    setFormData(getBlankForm());
    setFormErrors({});
    setIsEditorOpen(true);
  };

  const openEditModal = (ex) => {
    setEditingExercise(ex);
    setFormData({
      name: ex.name || '',
      muscle: ex.muscle || ex.category || 'Chest',
      subgroup: ex.subgroup || '',
      primaryMuscles: Array.isArray(ex.primaryMuscles) ? ex.primaryMuscles.join(', ') : (ex.primaryMuscles || ''),
      secondaryMuscles: Array.isArray(ex.secondaryMuscles) ? ex.secondaryMuscles.join(', ') : (ex.secondaryMuscles || ''),
      equipment: ex.equipment || 'Barbell',
      difficulty: ex.difficulty || 'Intermediate',
      movementPattern: ex.movementPattern || ex.pattern || 'Horizontal Push',
      isCompound: ex.isCompound !== undefined ? ex.isCompound : true,
      startingPosition: ex.startingPosition || '',
      instructions: Array.isArray(ex.instructions) ? ex.instructions.join('\n') : (ex.instructions || ''),
      breathing: ex.breathing || '',
      commonMistakes: Array.isArray(ex.commonMistakes) ? ex.commonMistakes.join('; ') : (ex.commonMistakes || ''),
      safetyPrecautions: Array.isArray(ex.safetyPrecautions) ? ex.safetyPrecautions.join('; ') : (ex.safetyPrecautions || ''),
      tips: Array.isArray(ex.tips) ? ex.tips.join('; ') : (ex.tips || ''),
      alternatives: Array.isArray(ex.alternatives) ? ex.alternatives.join(', ') : (ex.alternatives || ''),
      instructionsHindi: ex.instructionsHindi || '',
      mediaUrl: ex.mediaUrl || ex.image || ''
    });
    setFormErrors({});
    setIsEditorOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Exercise name is required';
    if (!formData.muscle) errs.muscle = 'Muscle group is required';
    if (!formData.instructions.trim()) errs.instructions = 'Step-by-step instructions required';
    
    // Check duplicate exercise names when adding a new exercise
    if (!editingExercise) {
      const exists = exercises.some(e => e.name.toLowerCase() === formData.name.trim().toLowerCase());
      if (exists) errs.name = 'An exercise with this exact name already exists in the catalog';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveExercise = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        muscle: formData.muscle,
        subgroup: formData.subgroup,
        primaryMuscles: formData.primaryMuscles.split(',').map(s => s.trim()).filter(Boolean),
        secondaryMuscles: formData.secondaryMuscles.split(',').map(s => s.trim()).filter(Boolean),
        equipment: formData.equipment,
        difficulty: formData.difficulty,
        movementPattern: formData.movementPattern,
        isCompound: Boolean(formData.isCompound),
        startingPosition: formData.startingPosition,
        instructions: formData.instructions.split('\n').filter(Boolean),
        breathing: formData.breathing,
        commonMistakes: formData.commonMistakes.split(';').map(s => s.trim()).filter(Boolean),
        safetyPrecautions: formData.safetyPrecautions.split(';').map(s => s.trim()).filter(Boolean),
        tips: formData.tips.split(';').map(s => s.trim()).filter(Boolean),
        alternatives: formData.alternatives.split(',').map(s => s.trim()).filter(Boolean),
        instructionsHindi: formData.instructionsHindi,
        mediaUrl: formData.mediaUrl
      };

      if (editingExercise) {
        await updateGlobalExercise(editingExercise.id, payload);
        addNotification(`Exercise "${payload.name}" updated successfully.`, 'success');
      } else {
        await addGlobalExercise(payload);
        addNotification(`New exercise "${payload.name}" added to global catalog.`, 'success');
      }

      setIsEditorOpen(false);
      loadExercises();
    } catch (err) {
      addNotification(err.message || 'Failed to save exercise record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExercise = async () => {
    if (!deletingExercise) return;
    setDeleteSubmitting(true);
    try {
      await deleteGlobalExercise(deletingExercise.id, deletingExercise.name);
      addNotification(`Exercise "${deletingExercise.name}" removed from library.`, 'success');
      setDeletingExercise(null);
      loadExercises();
    } catch (err) {
      addNotification('Could not remove exercise.', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filtered exercises
  const filtered = exercises.filter(ex => {
    const matchesSearch = !search.trim() || 
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(search.toLowerCase())) ||
      (ex.muscle && ex.muscle.toLowerCase().includes(search.toLowerCase()));

    const matchesMuscle = muscleFilter === 'ALL' || ex.muscle === muscleFilter || ex.category === muscleFilter;
    const matchesEquipment = equipmentFilter === 'ALL' || ex.equipment === equipmentFilter;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-midnight-card border border-midnight-border">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neon-cyan" />
            Exercise Library & Biomechanical Catalog ({exercises.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage global movements, muscle group taxonomy, execution cues, and bilingual guides
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Exercise</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-midnight-card border border-midnight-border rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises by name, equipment, muscle..."
            className="w-full pl-9 pr-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan transition"
          />
        </div>

        <select
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
        >
          <option value="ALL">All Muscle Groups</option>
          {MAIN_MUSCLE_GROUPS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
          className="px-3 py-1.5 bg-midnight-bg border border-midnight-border rounded-xl text-slate-300 text-xs font-semibold focus:outline-none focus:border-neon-cyan"
        >
          <option value="ALL">All Equipment</option>
          {EQUIPMENT_OPTIONS.map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>

        <button
          onClick={loadExercises}
          className="p-2 bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 rounded-xl transition"
          title="Refresh library"
        >
          <RefreshCw className="w-4 h-4 text-neon-cyan" />
        </button>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-midnight-card border border-midnight-border rounded-3xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-midnight-card border border-midnight-border rounded-3xl">
            <Dumbbell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-bold text-slate-300">No exercises found</p>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search or muscle filters</p>
          </div>
        ) : (
          filtered.slice(0, 60).map((ex) => (
            <div 
              key={ex.id}
              className="p-5 rounded-3xl bg-midnight-card border border-midnight-border hover:border-midnight-elevated transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{ex.name}</h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    ex.difficulty === 'Beginner' ? 'bg-neon-success/15 text-neon-success' :
                    ex.difficulty === 'Advanced' ? 'bg-rose-500/15 text-rose-300' :
                    'bg-amber-400/15 text-amber-300'
                  }`}>
                    {ex.difficulty || 'Intermediate'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                  <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold">
                    {ex.muscle || ex.category}
                  </span>
                  {ex.subgroup && (
                    <span className="px-2 py-0.5 rounded-lg bg-midnight-bg text-slate-400 border border-midnight-border">
                      {ex.subgroup}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-lg bg-midnight-bg text-slate-400 border border-midnight-border">
                    {ex.equipment || 'Barbell'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-midnight-bg text-slate-400 border border-midnight-border">
                    {ex.isCompound ? 'Compound' : 'Isolation'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {Array.isArray(ex.instructions) ? ex.instructions[0] : ex.instructions}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-midnight-border/60 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  {ex.isCustom ? 'Firestore Custom' : 'Core Preset'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(ex)}
                    className="p-1.5 rounded-xl bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan border border-midnight-border transition"
                    title="Edit exercise definition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingExercise(ex)}
                    className="p-1.5 rounded-xl bg-midnight-bg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-midnight-border transition"
                    title="Delete exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 60 && (
        <div className="text-center py-4 text-xs text-slate-500 font-mono">
          Showing 60 of {filtered.length} exercises. Refine filters to locate specific movements.
        </div>
      )}

      {/* Add / Edit Exercise Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-midnight-border">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-neon-cyan" />
                {editingExercise ? `Edit Exercise: ${editingExercise.name}` : 'Add New Global Exercise'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-midnight-bg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="space-y-4">
              
              {/* Row 1: Name, Muscle, Subgroup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Incline Barbell Bench Press"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                  {formErrors.name && <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Main Muscle Group *
                  </label>
                  <select
                    value={formData.muscle}
                    onChange={(e) => setFormData({ ...formData, muscle: e.target.value, subgroup: MUSCLE_SUBGROUPS[e.target.value]?.[0] || '' })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    {MAIN_MUSCLE_GROUPS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Anatomical Subgroup
                  </label>
                  <select
                    value={formData.subgroup}
                    onChange={(e) => setFormData({ ...formData, subgroup: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    {(MUSCLE_SUBGROUPS[formData.muscle] || []).map(sg => (
                      <option key={sg} value={sg}>{sg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Equipment, Difficulty, Movement Pattern, Compound */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Equipment
                  </label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    {EQUIPMENT_OPTIONS.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    {DIFFICULTY_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Movement Pattern
                  </label>
                  <select
                    value={formData.movementPattern}
                    onChange={(e) => setFormData({ ...formData, movementPattern: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    {PATTERN_OPTIONS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kinetic Chain
                  </label>
                  <select
                    value={formData.isCompound ? 'compound' : 'isolation'}
                    onChange={(e) => setFormData({ ...formData, isCompound: e.target.value === 'compound' })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    <option value="compound">Compound (Multi-joint)</option>
                    <option value="isolation">Isolation (Single-joint)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Primary & Secondary Muscles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Target Muscles (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.primaryMuscles}
                    onChange={(e) => setFormData({ ...formData, primaryMuscles: e.target.value })}
                    placeholder="e.g. Clavicular Head Pectoralis Major, Anterior Deltoids"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Secondary / Stabilizer Muscles
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryMuscles}
                    onChange={(e) => setFormData({ ...formData, secondaryMuscles: e.target.value })}
                    placeholder="e.g. Triceps Brachii, Serratus Anterior"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Step-by-Step Instructions (English - 1 per line) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="1. Unrack bar&#10;2. Lower to chest&#10;3. Drive upwards"
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
                />
              </div>

              {/* Hindi Guide */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                  Hindi Guide (हिन्दी निर्देश)
                </label>
                <textarea
                  rows={2}
                  value={formData.instructionsHindi}
                  onChange={(e) => setFormData({ ...formData, instructionsHindi: e.target.value })}
                  placeholder="व्यायाम करने की सही विधि हिंदी में लिखें..."
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              {/* Cues: Breathing, Mistakes, Safety, Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Breathing Technique
                  </label>
                  <input
                    type="text"
                    value={formData.breathing}
                    onChange={(e) => setFormData({ ...formData, breathing: e.target.value })}
                    placeholder="Inhale on descent, exhale on drive"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Common Mistakes (semicolon separated)
                  </label>
                  <input
                    type="text"
                    value={formData.commonMistakes}
                    onChange={(e) => setFormData({ ...formData, commonMistakes: e.target.value })}
                    placeholder="Bouncing off chest; flaring elbows"
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-border">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-midnight-bg hover:bg-midnight-elevated text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingExercise ? 'Update Exercise' : 'Save to Catalog'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-midnight-card border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Delete Exercise</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Are you sure you want to delete <span className="font-bold text-white">{deletingExercise.name}</span> from the exercise library?
            </p>

            <div className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border text-[11px] text-slate-400 space-y-1 mb-4">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Info className="w-3.5 h-3.5" />
                Historical Backward Compatibility
              </div>
              <p>
                Removing this exercise from the active catalog will not corrupt athletes' past workout logs. Past sessions referencing this exercise will retain their recorded lift data.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingExercise(null)}
                className="flex-1 py-2.5 bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold hover:bg-midnight-elevated"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleDeleteExercise}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
              >
                {deleteSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
