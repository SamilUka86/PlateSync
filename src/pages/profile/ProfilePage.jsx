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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';
import { EXERCISE_DATABASE } from '../../utils/exerciseData';
import { ExerciseDetailModal } from '../../components/library/ExerciseDetailModal';

export const ProfilePage = ({ setActiveTab }) => {
  const { userProfile, currentUser, updateProfile, isDemoMode } = useAuth();
  const { addNotification } = useNotification();

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
      [name]: name === 'height' || name === 'bodyWeight' || name === 'defaultBarbellWeight'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      addNotification('Athlete profile updated successfully!', 'success');
    } catch (err) {
      addNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const heightInInches = Math.round(formData.height / 2.54);
  const heightFeet = Math.floor(heightInInches / 12);
  const heightRem = heightInInches % 12;
  const weightInLbs = Math.round(formData.bodyWeight * KG_TO_LBS * 100) / 100;

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
                {formData.preferredUnit === 'KG' ? `≈ ${weightInLbs} lbs` : `≈ ${Math.round(formData.bodyWeight / KG_TO_LBS)} kg`}
              </span>
            </div>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="number"
                step="0.1"
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

      {/* Favorite Workouts & Exercises Section */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-midnight-border pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Favorite Workouts & Exercises
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold ml-1.5">
                {favoriteWorkouts.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Quick access to your bookmarked benchmark lifts, compound routines, and training movements.
            </p>
          </div>

          {setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-midnight-border bg-midnight-bg hover:bg-midnight-elevated text-neon-cyan hover:text-white text-xs font-bold transition shrink-0 self-start sm:self-auto"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Browse Exercise Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Favorite Workouts Grid or Empty State */}
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

                <div className="pt-2 border-t border-midnight-border/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{workout.equipment}</span>
                  <span className="text-neon-cyan font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    View Guide
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Detail Modal with complete guides & translation support */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
          isFavorite={favoriteIds.includes(selectedExerciseForModal.id)}
          onToggleFavorite={handleToggleFavoriteFromModal}
        />
      )}

    </div>
  );
};
