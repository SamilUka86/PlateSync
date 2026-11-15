import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Star, 
  Dumbbell, 
  Clock, 
  Award, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';
import { 
  getAdminWorkoutPrograms, 
  createWorkoutProgram, 
  updateWorkoutProgram, 
  deleteWorkoutProgram, 
  toggleProgramPublish 
} from '../../../services/admin/adminDataService';
import { useNotification } from '../../../context/NotificationContext';

export const AdminProgramsTab = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [goalFilter, setGoalFilter] = useState('ALL');

  // Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState(getBlankProgramForm());
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deletingProgram, setDeletingProgram] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { addNotification } = useNotification();

  function getBlankProgramForm() {
    return {
      title: '',
      description: '',
      goal: 'Hypertrophy',
      level: 'Intermediate',
      daysPerWeek: 4,
      schedule: 'Upper / Lower Split (Mon, Tue, Thu, Fri)',
      recommendedEquipment: 'Full Gym (Barbell, Dumbbells, Cables, Machines)',
      notes: 'Progressive overload recommended: increase weight when reaching top of rep range.',
      published: true,
      featured: false
    };
  }

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await getAdminWorkoutPrograms();
      setPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      addNotification('Could not load workout programs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const openAddModal = () => {
    setEditingProgram(null);
    setFormData(getBlankProgramForm());
    setIsEditorOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    setFormData({
      title: prog.title || '',
      description: prog.description || '',
      goal: prog.goal || 'Hypertrophy',
      level: prog.level || 'Intermediate',
      daysPerWeek: prog.daysPerWeek || 4,
      schedule: prog.schedule || '',
      recommendedEquipment: prog.recommendedEquipment || '',
      notes: prog.notes || '',
      published: prog.published !== false,
      featured: Boolean(prog.featured)
    });
    setIsEditorOpen(true);
  };

  const handleTogglePublish = async (prog) => {
    try {
      await toggleProgramPublish(prog.id, prog.published, prog.title);
      addNotification(`Program "${prog.title}" is now ${!prog.published ? 'Published' : 'Unpublished'}.`, 'success');
      loadPrograms();
    } catch (err) {
      addNotification('Failed to toggle publication status.', 'error');
    }
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addNotification('Program title is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingProgram) {
        await updateWorkoutProgram(editingProgram.id, formData);
        addNotification(`Program "${formData.title}" updated.`, 'success');
      } else {
        await createWorkoutProgram(formData);
        addNotification(`Program "${formData.title}" created.`, 'success');
      }
      setIsEditorOpen(false);
      loadPrograms();
    } catch (err) {
      addNotification(err.message || 'Failed to save workout program.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;
    setDeleteSubmitting(true);
    try {
      await deleteWorkoutProgram(deletingProgram.id, deletingProgram.title);
      addNotification(`Program "${deletingProgram.title}" removed.`, 'success');
      setDeletingProgram(null);
      loadPrograms();
    } catch (err) {
      addNotification('Could not delete program.', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const filtered = programs.filter(p => {
    const matchesLevel = levelFilter === 'ALL' || (p.level || '').toLowerCase() === levelFilter.toLowerCase();
    const matchesGoal = goalFilter === 'ALL' || (p.goal || '').toLowerCase().includes(goalFilter.toLowerCase());
    return matchesLevel && matchesGoal;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-midnight-card border border-midnight-border">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neon-cyan" />
            Workout Programs & Training Systems ({programs.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage periodized training splits, community presets, and featured programs visible in user planners
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Program</span>
        </button>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-midnight-card border border-midnight-border rounded-3xl animate-pulse" />
          ))
        ) : (
          filtered.map((prog) => (
            <div 
              key={prog.id}
              className="p-5 rounded-3xl bg-midnight-card border border-midnight-border hover:border-midnight-elevated transition flex flex-col justify-between space-y-3 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {prog.featured && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" title="Featured Program" />
                    )}
                    <h3 className="font-bold text-white text-sm truncate">{prog.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    prog.published 
                      ? 'bg-neon-success/15 text-neon-success border border-neon-success/30' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {prog.published ? 'Published' : 'Draft / Hidden'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold">
                    {prog.level || 'Intermediate'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-midnight-bg text-slate-400 border border-midnight-border">
                    {prog.daysPerWeek ? `${prog.daysPerWeek} Days/Wk` : 'Flexible'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-midnight-bg text-slate-400 border border-midnight-border">
                    {prog.goal || 'Hypertrophy'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {prog.description || 'Comprehensive multi-day structured resistance training program.'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-midnight-border/60 text-xs">
                <button
                  onClick={() => handleTogglePublish(prog)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition border ${
                    prog.published
                      ? 'bg-midnight-bg hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 border-midnight-border hover:border-rose-500/30'
                      : 'bg-neon-success/10 hover:bg-neon-success/20 text-neon-success border-neon-success/30'
                  }`}
                  title={prog.published ? 'Hide program from athletes' : 'Publish program to user planner'}
                >
                  {prog.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{prog.published ? 'Unpublish' : 'Publish'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(prog)}
                    className="p-1.5 rounded-xl bg-midnight-bg hover:bg-midnight-elevated text-slate-300 hover:text-neon-cyan border border-midnight-border transition"
                    title="Edit program"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingProgram(prog)}
                    className="p-1.5 rounded-xl bg-midnight-bg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-midnight-border transition"
                    title="Delete program"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Program Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-midnight-border">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neon-cyan" />
                {editingProgram ? `Edit Program: ${editingProgram.title}` : 'Create Workout Program'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-midnight-bg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 4-Day Powerbuilding Hypertrophy Split"
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Program overview, progression scheme, target audience..."
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    <option value="Hypertrophy">Hypertrophy (Muscle Size)</option>
                    <option value="Strength">Max Strength (Powerlifting)</option>
                    <option value="Conditioning">General Fitness & Endurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Days Per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.daysPerWeek}
                    onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-neon-cyan bg-midnight-bg border-midnight-border"
                  />
                  <span>Publish immediately to all athletes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 bg-midnight-bg border-midnight-border"
                  />
                  <span>Feature on Dashboard & Planner banner</span>
                </label>
              </div>

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
                  {saving ? 'Saving...' : editingProgram ? 'Update Program' : 'Save Program'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-midnight-card border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-black text-white">Delete Workout Program</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to remove <span className="font-bold text-white">{deletingProgram.title}</span>? Unpublishing or deleting a program will not erase copies previously applied by athletes to their weekly routines.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingProgram(null)}
                className="flex-1 py-2.5 bg-midnight-bg text-slate-300 rounded-xl text-xs font-bold hover:bg-midnight-elevated"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleDeleteProgram}
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
