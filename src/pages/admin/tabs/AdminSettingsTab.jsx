import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  AlertTriangle, 
  Bell, 
  Globe2, 
  Scale, 
  Mail, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  getPlatformSettings, 
  updatePlatformSettings,
  getGlobalExercises,
  getAdminWorkoutPrograms 
} from '../../../services/admin/adminDataService';
import { useNotification } from '../../../context/NotificationContext';

export const AdminSettingsTab = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [programs, setPrograms] = useState([]);

  const { addNotification } = useNotification();

  const loadData = async () => {
    setLoading(true);
    try {
      const [cfg, exList, progList] = await Promise.all([
        getPlatformSettings(),
        getGlobalExercises(),
        getAdminWorkoutPrograms()
      ]);
      setSettings(cfg);
      setExercises(exList);
      setPrograms(progList);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePlatformSettings(settings);
      addNotification('Platform application configuration updated successfully.', 'success');
    } catch (err) {
      addNotification('Failed to update platform settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neon-cyan mb-2" />
        <span>Loading platform configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-6 rounded-3xl bg-midnight-card border border-midnight-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-neon-cyan" />
            Global Platform Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage application-wide maintenance windows, announcement banners, and default standards
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-neon-cyan to-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/20 flex items-center gap-2 transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating...' : 'Publish Configuration'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Section 1: Maintenance Mode */}
        <div className="p-6 rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Application Maintenance Mode
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                When enabled, normal athletes see an emergency maintenance screen while admins retain full access
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {settings.maintenanceMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Maintenance Notice Message
              </label>
              <textarea
                rows={2}
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
              />
            </div>
          )}
        </div>

        {/* Section 2: Global Announcement Banner */}
        <div className="p-6 rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-neon-cyan" />
                Broadcast Announcement Banner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Display a priority announcement across the top header of all athlete screens
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan" />
            </label>
          </div>

          {settings.announcementActive && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={settings.announcementMessage}
                  onChange={(e) => setSettings({ ...settings, announcementMessage: e.target.value })}
                  placeholder="e.g. PlateSync v1.2 is live! New 45° Leg Press calculator released."
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Banner Color Theme
                </label>
                <select
                  value={settings.announcementType}
                  onChange={(e) => setSettings({ ...settings, announcementType: e.target.value })}
                  className="w-full sm:w-60 px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-bold"
                >
                  <option value="info">Cyan Info Banner</option>
                  <option value="success">Emerald Success Banner</option>
                  <option value="warning">Amber Warning Banner</option>
                  <option value="alert">Rose Alert Banner</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Featured Programs & Exercises */}
        <div className="p-6 rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Featured Content
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Featured Workout Program
              </label>
              <select
                value={settings.featuredProgramId || ''}
                onChange={(e) => setSettings({ ...settings, featuredProgramId: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
              >
                <option value="">Default (None Selected)</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Featured Benchmark Exercise
              </label>
              <select
                value={settings.featuredExerciseId || ''}
                onChange={(e) => setSettings({ ...settings, featuredExerciseId: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs"
              >
                <option value="">Default (None Selected)</option>
                {exercises.slice(0, 50).map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Defaults & Support */}
        <div className="p-6 rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            Platform Defaults & Public Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Weight Unit
              </label>
              <select
                value={settings.defaultUnit}
                onChange={(e) => setSettings({ ...settings, defaultUnit: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
              >
                <option value="KG">Kilograms (KG)</option>
                <option value="LBS">Pounds (LBS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Language
              </label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
              >
                <option value="en">English (US)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Public Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="support@platesync.app"
                className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
