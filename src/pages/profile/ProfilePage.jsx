import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Ruler, 
  Scale, 
  Dumbbell, 
  Save, 
  Check, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';

export const ProfilePage = () => {
  const { userProfile, currentUser, updateProfile, isDemoMode } = useAuth();
  const { addNotification } = useNotification();

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
        preferredUnit: userProfile?.preferredUnit || 'KG',
        defaultBarbellWeight: userProfile?.defaultBarbellWeight || 20,
        defaultBarbellUnit: userProfile?.defaultBarbellUnit || 'KG',
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
  const weightInLbs = Math.round(formData.bodyWeight * KG_TO_LBS * 10) / 10;

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
              <option value="LB">Pounds (LB)</option>
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
                <option value="LB">LB</option>
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

    </div>
  );
};
