import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Trash2, 
  Eye, 
  Plus, 
  X,
  Trophy, 
  Filter,
  Share2
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { WorkoutShareModal } from '../../components/workout/WorkoutShareModal';

// Safe date formatter for string, Date, or Firestore Timestamp
const formatDateSafely = (val) => {
  if (!val) return 'Completed Session';
  try {
    if (typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Completed Session';
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return 'Completed Session';
  }
};

const formatModalDate = (val) => {
  if (!val) return 'Completed Session';
  try {
    if (typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Completed Session';
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return 'Completed Session';
  }
};

export const WorkoutHistoryPage = ({ setActiveTab }) => {
  const { workouts = [], deleteWorkout } = useWorkout();
  const { userProfile } = useAuth();
  const { addNotification } = useNotification();
  const preferredUnit = userProfile?.preferredUnit || 'KG';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [shareWorkout, setShareWorkout] = useState(null);

  const safeWorkouts = useMemo(() => {
    return Array.isArray(workouts) ? workouts : [];
  }, [workouts]);

  // Filtered workouts
  const filteredWorkouts = useMemo(() => {
    return safeWorkouts.filter((w) => {
      if (!w) return false;
      const q = (searchQuery || '').toLowerCase().trim();
      if (!q) return true;
      const matchesTitle = (w.workoutName || w.title || '').toLowerCase().includes(q);
      const matchesExercise = Array.isArray(w.exercises) && w.exercises.some(ex => ex?.name?.toLowerCase().includes(q));
      return matchesTitle || matchesExercise;
    });
  }, [safeWorkouts, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
            <span className="text-[10px] uppercase font-black text-neon-cyan tracking-wider">
              Training Archives & Recorded Sessions
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Workout History ({safeWorkouts.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review detailed set records, volume progression, and session durations.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          <button
            onClick={() => setActiveTab && setActiveTab('tracker')}
            className="flex items-center gap-1.5 px-4 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black rounded-xl text-xs shrink-0 shadow-lg shadow-neon-cyan/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredWorkouts.length === 0 ? (
          <div className="p-16 text-center bg-midnight-card border border-midnight-border rounded-3xl space-y-3">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No workouts found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search keyword.' : 'Complete workouts in the Workout Tracker to see them recorded here.'}
            </p>
          </div>
        ) : (
          filteredWorkouts.map((w) => {
            const durationMin = Math.round((Number(w.duration) || 3600) / 60);
            const dateStr = formatDateSafely(w.date || w.createdAt || w.startTime);

            return (
              <div
                key={w.id || `workout_${Math.random()}`}
                className="bg-midnight-card border border-midnight-border hover:border-neon-cyan/40 rounded-2xl p-4 md:p-5 transition group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div 
                  onClick={() => setSelectedWorkout(w)}
                  className="cursor-pointer flex-1 space-y-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neon-cyan font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {dateStr}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-slate-300 font-mono font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {durationMin} min
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-white group-hover:text-neon-cyan transition truncate">
                    {w.workoutName || w.title || 'Workout Session'}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Array.isArray(w.exercises) && w.exercises.map((ex, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-midnight-bg border border-midnight-border text-slate-200 font-medium">
                        {ex?.name || 'Exercise'} ({Array.isArray(ex?.sets) ? ex.sets.length : 0}s)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-midnight-border">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Volume</span>
                    <span className="text-sm md:text-base font-black font-mono text-neon-cyan">
                      {preferredUnit === 'LB'
                        ? `${(w.totalVolumeLbs || ((w.totalVolumeKg || w.totalVolume || 0) * KG_TO_LBS)).toLocaleString()} LB`
                        : `${(w.totalVolumeKg || w.totalVolume || 0).toLocaleString()} KG`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShareWorkout(w)}
                      className="p-2 text-slate-400 hover:text-neon-cyan rounded-xl hover:bg-neon-cyan/10 transition"
                      title="Share Summary Card"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedWorkout(w)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Delete this workout permanently?')) {
                          if (deleteWorkout) await deleteWorkout(w.id);
                          addNotification('Workout record deleted', 'info');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-neon-error rounded-xl hover:bg-neon-error/10 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-midnight-card border border-midnight-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="p-6 border-b border-midnight-border flex items-center justify-between">
              <div>
                <span className="text-xs text-neon-cyan font-mono font-bold block mb-1">
                  {formatModalDate(selectedWorkout.date || selectedWorkout.createdAt || selectedWorkout.startTime)}
                </span>
                <h3 className="text-lg font-black text-white">{selectedWorkout.workoutName || selectedWorkout.title || 'Workout Details'}</h3>
              </div>
              <button onClick={() => setSelectedWorkout(null)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {Array.isArray(selectedWorkout.exercises) && selectedWorkout.exercises.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-neon-cyan/20 text-neon-cyan text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {ex?.name || 'Exercise'}
                    </h4>
                    <span className="text-xs text-neon-cyan font-mono font-bold">{ex?.muscle || ex?.category || ''}</span>
                  </div>

                  <div className="space-y-1.5">
                    {Array.isArray(ex?.sets) && ex.sets.map((s, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-midnight-secondary text-xs font-mono">
                        <span className="text-slate-300 font-bold">Set {s?.setNumber || sIdx + 1}</span>
                        <span className="font-black text-white">{s?.weight || 0} {s?.unit || 'KG'} &times; {s?.reps || 0} reps</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-midnight-border flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShareWorkout(selectedWorkout);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black rounded-xl text-xs transition active:scale-95 shadow-lg shadow-neon-cyan/20"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Summary Card</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this workout permanently?')) {
                      const idToDelete = selectedWorkout.id;
                      setSelectedWorkout(null);
                      if (deleteWorkout) await deleteWorkout(idToDelete);
                      addNotification('Workout record deleted', 'info');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-neon-error/10 hover:bg-neon-error/20 text-rose-300 border border-neon-error/30 rounded-xl text-xs font-bold transition"
                  title="Delete this session"
                >
                  <Trash2 className="w-3.5 h-3.5 text-neon-error" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="px-5 py-2 bg-midnight-elevated hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Workout Share Card Modal */}
      {shareWorkout && (
        <WorkoutShareModal
          workout={shareWorkout}
          isOpen={Boolean(shareWorkout)}
          onClose={() => setShareWorkout(null)}
          addNotification={addNotification}
        />
      )}

    </div>
  );
};
