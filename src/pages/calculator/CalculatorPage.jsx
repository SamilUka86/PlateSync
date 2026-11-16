import React, { useState, useMemo, useEffect } from 'react';
import { 
  Scale, 
  Trash2, 
  Plus, 
  Dumbbell, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  BookmarkPlus, 
  Bookmark, 
  Sparkles, 
  Layers, 
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  STANDARD_KG_PLATES, 
  STANDARD_LB_PLATES, 
  BARBELL_PRESETS,
  calculateTotalWeight,
  convertWeight,
  formatWeight,
  getPlateStyle
} from '../../utils/weightCalculations';
import { BarbellVisualizer } from '../../components/calculator/BarbellVisualizer';
import { AutoPlateSolver } from '../../components/calculator/AutoPlateSolver';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useNotification } from '../../context/NotificationContext';
import { logUserActivityEvent } from '../../services/analytics/activityTracker';

export const CalculatorPage = ({ setActiveTab, onOpenAuth }) => {
  const { currentUser, userProfile, updateProfile, isDemoMode } = useAuth();
  const { 
    savedConfigurations, 
    savePlateConfiguration, 
    deletePlateConfiguration, 
    stagedWeight,
    setStagedWeight 
  } = useWorkout();
  const { addNotification } = useNotification();

  // Barbell Configuration
  const [selectedBarbellId, setSelectedBarbellId] = useState(() => {
    return stagedWeight?.isLegPress45 ? 'leg-press-45' : 'oly-kg-20';
  });
  const [customBarbellWeight, setCustomBarbellWeight] = useState(20);
  const [customBarbellUnit, setCustomBarbellUnit] = useState('KG');

  // Ensure screen always starts from the top on mobile and desktop
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (stagedWeight?.isLegPress45) {
      setSelectedBarbellId('leg-press-45');
    } else if (stagedWeight?.configToLoad) {
      const cfg = stagedWeight.configToLoad;
      setSelectedBarbellId('custom');
      setCustomBarbellWeight(cfg.barbellWeight || 20);
      setCustomBarbellUnit(cfg.barbellUnit || 'KG');
      setLeftPlates(cfg.leftPlates || []);
      setRightPlates(cfg.rightPlates || []);
      setCenterPlates(cfg.centerPlates || []);
      setStagedWeight(null);
      addNotification(`Loaded favorite setup "${cfg.name}" ⭐`, 'success');
    }
  }, [stagedWeight]);

  // Loading destination mode: 'both' | 'left' | 'right' | 'center'
  const [loadMode, setLoadMode] = useState('both');
  const [plateQuantity, setPlateQuantity] = useState(1); // 1x, 2x, 4x

  // Active loaded plates: { id, weight, unit }
  // Initial demo setup: 20kg barbell + 20kg plate + 10lb plate + 5kg plate on each side
  const [leftPlates, setLeftPlates] = useState([
    { id: 'l_1', weight: 20, unit: 'KG' },
    { id: 'l_2', weight: 10, unit: 'LB' },
    { id: 'l_3', weight: 5, unit: 'KG' }
  ]);

  const [rightPlates, setRightPlates] = useState([
    { id: 'r_1', weight: 20, unit: 'KG' },
    { id: 'r_2', weight: 10, unit: 'LB' },
    { id: 'r_3', weight: 5, unit: 'KG' }
  ]);

  // Dedicated Center Horn for 45-degree Leg Press machines
  const [centerPlates, setCenterPlates] = useState([]);

  // Display unit toggle without changing physical plates
  const [displayUnit, setDisplayUnit] = useState(userProfile?.preferredUnit || 'KG');

  // Synchronize displayUnit instantly when global unit preference changes
  useEffect(() => {
    if (userProfile?.preferredUnit && userProfile.preferredUnit !== displayUnit) {
      setDisplayUnit(userProfile.preferredUnit);
    }
  }, [userProfile?.preferredUnit]);

  const handleToggleDisplayUnit = (unit) => {
    setDisplayUnit(unit);
    if (updateProfile) {
      updateProfile({ preferredUnit: unit });
    }
  };

  // Custom plate entry
  const [customPlateWeight, setCustomPlateWeight] = useState('');
  const [customPlateUnit, setCustomPlateUnit] = useState('KG');

  // Copy feedback
  const [copied, setCopied] = useState(false);

  // Configuration name modal state
  const [configNameInput, setConfigNameInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Barbell config resolution
  const barbellConfig = useMemo(() => {
    if (selectedBarbellId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom Barbell Weight',
        weight: Number(customBarbellWeight) || 0,
        unit: customBarbellUnit,
        isLegPress45: false
      };
    }
    const found = BARBELL_PRESETS.find(p => p.id === selectedBarbellId);
    return {
      id: found ? found.id : 'oly-kg-20',
      name: found ? found.name : 'Olympic Barbell (20 kg)',
      weight: found ? found.weight : 20,
      unit: found ? found.unit : 'KG',
      isLegPress45: Boolean(found?.isLegPress45)
    };
  }, [selectedBarbellId, customBarbellWeight, customBarbellUnit]);

  // Fallback loadMode if user switches away from leg press while on 'center'
  useEffect(() => {
    if (!barbellConfig.isLegPress45 && loadMode === 'center') {
      setLoadMode('both');
    }
  }, [barbellConfig.isLegPress45, loadMode]);

  // Mathematical Calculation including center horn plates for 45° Leg Press
  const weightSummary = useMemo(() => {
    return calculateTotalWeight(
      barbellConfig.weight,
      barbellConfig.unit,
      leftPlates,
      rightPlates,
      barbellConfig.isLegPress45,
      centerPlates
    );
  }, [barbellConfig, leftPlates, rightPlates, centerPlates]);

  // Add plate handler
  const handleAddPlate = (weight, unit) => {
    const w = Number(weight);
    if (!w || w <= 0) return;

    const count = Number(plateQuantity) || 1;
    const newLeft = [];
    const newRight = [];
    const newCenter = [];

    for (let i = 0; i < count; i++) {
      if (barbellConfig.isLegPress45 && loadMode === 'center') {
        newCenter.push({ id: `c_${Date.now()}_${Math.random()}`, weight: w, unit });
      } else {
        if (loadMode === 'both' || loadMode === 'left') {
          newLeft.push({ id: `l_${Date.now()}_${Math.random()}`, weight: w, unit });
        }
        if (loadMode === 'both' || loadMode === 'right') {
          newRight.push({ id: `r_${Date.now()}_${Math.random()}`, weight: w, unit });
        }
      }
    }

    if (newLeft.length > 0) setLeftPlates(prev => [...prev, ...newLeft]);
    if (newRight.length > 0) setRightPlates(prev => [...prev, ...newRight]);
    if (newCenter.length > 0) setCenterPlates(prev => [...prev, ...newCenter]);

    const targetDesc = loadMode === 'center' 
      ? 'Center Horn' 
      : loadMode === 'both' 
        ? 'both sleeves' 
        : `${loadMode} sleeve`;

    addNotification(`Added ${count}x ${w} ${unit} to ${targetDesc}`, 'info', 2000);
  };

  // Add custom plate
  const handleAddCustomPlate = (e) => {
    e.preventDefault();
    const w = parseFloat(customPlateWeight);
    if (isNaN(w) || w <= 0) {
      addNotification('Please enter a valid plate weight greater than 0', 'error');
      return;
    }
    handleAddPlate(w, customPlateUnit);
    setCustomPlateWeight('');
  };

  // Remove plate
  const handleRemovePlate = (side, index) => {
    if (side === 'left') {
      setLeftPlates(prev => prev.filter((_, idx) => idx !== index));
    } else if (side === 'center') {
      setCenterPlates(prev => prev.filter((_, idx) => idx !== index));
    } else {
      setRightPlates(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  // Reset calculator
  const handleReset = () => {
    setLeftPlates([]);
    setRightPlates([]);
    setCenterPlates([]);
    addNotification('Unracked all plates', 'info');
  };

  // Mirror Left to Right
  const handleMirrorLeftToRight = () => {
    const mirrored = leftPlates.map(p => ({
      id: `r_mir_${Date.now()}_${Math.random()}`,
      weight: p.weight,
      unit: p.unit
    }));
    setRightPlates(mirrored);
    addNotification('Mirrored left plates to right sleeve (Balanced)', 'success');
  };

  // Mirror Right to Left
  const handleMirrorRightToLeft = () => {
    const mirrored = rightPlates.map(p => ({
      id: `l_mir_${Date.now()}_${Math.random()}`,
      weight: p.weight,
      unit: p.unit
    }));
    setLeftPlates(mirrored);
    addNotification('Mirrored right plates to left sleeve (Balanced)', 'success');
  };

  // Apply Auto Plate Solver combination
  const handleApplyAutoSolverPlates = (flatPlatesList, solution) => {
    const left = flatPlatesList.map((p, idx) => ({
      id: `l_sol_${Date.now()}_${idx}_${Math.random()}`,
      weight: p.weight,
      unit: p.unit
    }));

    const right = flatPlatesList.map((p, idx) => ({
      id: `r_sol_${Date.now()}_${idx}_${Math.random()}`,
      weight: p.weight,
      unit: p.unit
    }));

    setLeftPlates(left);
    setRightPlates(right);

    if (barbellConfig.isLegPress45) {
      setCenterPlates([]);
    }

    if (solution?.targetUnit && solution.targetUnit !== displayUnit) {
      setDisplayUnit(solution.targetUnit);
    }

    logUserActivityEvent('CALCULATOR_LOAD_SOLVED', `Solved plate load: ${solution?.targetWeight || 'Target'} ${solution?.targetUnit || displayUnit}`, {
      targetWeight: solution?.targetWeight,
      unit: solution?.targetUnit || displayUnit
    });
  };

  // Copy total weight to clipboard
  const handleCopyWeight = () => {
    const text = displayUnit === 'KG'
      ? `${(Math.round(weightSummary.totalKg * 100) / 100).toFixed(2)} KG`
      : `${(Math.round(weightSummary.totalLbs * 100) / 100).toFixed(2)} LBS`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addNotification(`Copied ${text} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Save current plate configuration
  const handleSaveClick = () => {
    if (!currentUser || isDemoMode) {
      addNotification('Please sign in to save barbell setups to your profile favorites ⭐', 'info');
      if (onOpenAuth) {
        onOpenAuth();
      } else if (setActiveTab) {
        setActiveTab('profile');
      }
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const name = configNameInput.trim() || `Barbell Load (${weightSummary.totalKg.toFixed(2)}kg)`;
    savePlateConfiguration({
      name,
      barbellWeight: barbellConfig.weight,
      barbellUnit: barbellConfig.unit,
      leftPlates,
      rightPlates,
      centerPlates,
      totalKg: Math.round(weightSummary.totalKg * 100) / 100,
      totalLbs: Math.round(weightSummary.totalLbs * 100) / 100,
      isFavorite: true
    });
    addNotification(`Saved "${name}" to Profile Favorites ⭐!`, 'success');
    logUserActivityEvent('CALCULATOR_CONFIG_SAVED', `Saved plate configuration: "${name}" (${weightSummary.totalKg.toFixed(2)} KG)`, {
      name,
      totalKg: weightSummary.totalKg
    });
    setConfigNameInput('');
    setShowSaveModal(false);
  };

  // Load a saved configuration
  const handleLoadSavedConfig = (cfg) => {
    setSelectedBarbellId('custom');
    setCustomBarbellWeight(cfg.barbellWeight);
    setCustomBarbellUnit(cfg.barbellUnit || 'KG');
    setLeftPlates(cfg.leftPlates || []);
    setRightPlates(cfg.rightPlates || []);
    setCenterPlates(cfg.centerPlates || []);
    addNotification(`Loaded configuration "${cfg.name}"`, 'success');
  };

  // Preset combinations
  const handleApplyPreset = (targetKg, targetUnit = 'KG') => {
    const barKg = 20;
    setSelectedBarbellId('oly-kg-20');
    setCenterPlates([]);
    const plateWeightPerSide = (targetKg - barKg) / 2;

    if (targetKg === 60) {
      // 20kg bar + 20kg each side
      setLeftPlates([{ id: 'p_1', weight: 20, unit: 'KG' }]);
      setRightPlates([{ id: 'p_2', weight: 20, unit: 'KG' }]);
    } else if (targetKg === 100) {
      // 20kg bar + 20+20 each side
      setLeftPlates([{ id: 'p_1', weight: 20, unit: 'KG' }, { id: 'p_2', weight: 20, unit: 'KG' }]);
      setRightPlates([{ id: 'p_3', weight: 20, unit: 'KG' }, { id: 'p_4', weight: 20, unit: 'KG' }]);
    } else if (targetKg === 140) {
      // 20kg bar + 20+20+20 each side
      setLeftPlates([{ id: 'p_1', weight: 20, unit: 'KG' }, { id: 'p_2', weight: 20, unit: 'KG' }, { id: 'p_3', weight: 20, unit: 'KG' }]);
      setRightPlates([{ id: 'p_4', weight: 20, unit: 'KG' }, { id: 'p_5', weight: 20, unit: 'KG' }, { id: 'p_6', weight: 20, unit: 'KG' }]);
    } else if (targetKg === 102.05) {
      // 225 lbs (45lb bar + 2x 45lb plates per side)
      setSelectedBarbellId('oly-lb-45');
      setLeftPlates([{ id: 'p_1', weight: 45, unit: 'LB' }, { id: 'p_2', weight: 45, unit: 'LB' }]);
      setRightPlates([{ id: 'p_3', weight: 45, unit: 'LB' }, { id: 'p_4', weight: 45, unit: 'LB' }]);
    } else if (targetKg === 61.23) {
      // 135 lbs (45lb bar + 1x 45lb plate per side)
      setSelectedBarbellId('oly-lb-45');
      setLeftPlates([{ id: 'p_1', weight: 45, unit: 'LB' }]);
      setRightPlates([{ id: 'p_2', weight: 45, unit: 'LB' }]);
    } else if (targetKg === 142.88) {
      // 315 lbs (45lb bar + 3x 45lb plates per side)
      setSelectedBarbellId('oly-lb-45');
      setLeftPlates([{ id: 'p_1', weight: 45, unit: 'LB' }, { id: 'p_2', weight: 45, unit: 'LB' }, { id: 'p_3', weight: 45, unit: 'LB' }]);
      setRightPlates([{ id: 'p_4', weight: 45, unit: 'LB' }, { id: 'p_5', weight: 45, unit: 'LB' }, { id: 'p_6', weight: 45, unit: 'LB' }]);
    }

    addNotification(`Applied ${(targetUnit === 'LB' || targetUnit === 'LBS') ? 'Imperial' : 'Metric'} Barbell Preset`, 'info');
  };

  // Transfer weight to tracker
  const handleUseInWorkout = () => {
    const finalWeight = displayUnit === 'KG'
      ? Math.round(weightSummary.totalKg * 100) / 100
      : Math.round(weightSummary.totalLbs * 100) / 100;

    setStagedWeight({
      weight: finalWeight,
      unit: displayUnit,
      kg: weightSummary.totalKg,
      lbs: weightSummary.totalLbs,
      isLegPress45: Boolean(barbellConfig.isLegPress45),
      centerPlates: centerPlates
    });

    addNotification(`Calculated ${finalWeight} ${displayUnit} transferred to Workout Tracker!`, 'success');
    if (setActiveTab) setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Calculated Weight Hero Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-neon-violet/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Main Calculated Total Display */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                {barbellConfig.isLegPress45 ? '45-Degree Leg Press' : 'Barbell Total'}
              </span>
            </div>

            {barbellConfig.isLegPress45 && (
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium">
                <Info className="w-4 h-4 shrink-0" />
                <span>45-Degree Leg Press mode: Sled weight is excluded. Calculation includes loaded plates only.</span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                {displayUnit === 'KG'
                  ? (Math.round(weightSummary.totalKg * 100) / 100).toFixed(2)
                  : (Math.round(weightSummary.totalLbs * 100) / 100).toFixed(2)}
              </span>
              <span className="text-xl md:text-2xl font-black text-neon-cyan font-mono">
                {displayUnit}
              </span>

              {/* Exact Secondary Display in Opposite Unit */}
              <div className="ml-4 pl-4 border-l border-midnight-border text-slate-400">
                <span className="block text-[10px] uppercase text-slate-400 font-bold">Exact Equivalent</span>
                <span className="text-lg md:text-xl font-bold text-slate-200 font-mono">
                  {displayUnit === 'KG'
                    ? `${(Math.round(weightSummary.totalLbs * 100) / 100).toFixed(2)} LBS`
                    : `${(Math.round(weightSummary.totalKg * 100) / 100).toFixed(2)} KG`}
                </span>
              </div>
            </div>

            {/* Calculations Breakdown Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-midnight-bg border border-midnight-border">
                {barbellConfig.isLegPress45 ? (
                  <>Sled: <strong className="text-neon-cyan">0 KG</strong></>
                ) : (
                  <>Barbell: <strong className="text-white">{barbellConfig.weight} {barbellConfig.unit === 'LB' ? 'LBS' : barbellConfig.unit}</strong></>
                )}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-midnight-bg border border-midnight-border">
                Total Plates: <strong className="text-slate-100">{displayUnit === 'KG' ? `${weightSummary.totalPlateWeightKg.toFixed(2)} KG` : `${weightSummary.totalPlateWeightLbs.toFixed(2)} LBS`}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-midnight-bg border border-midnight-border">
                {barbellConfig.isLegPress45 ? 'Left Horn: ' : 'Left: '}<strong className="text-neon-cyan">{displayUnit === 'KG' ? `${weightSummary.leftWeightKg.toFixed(2)} KG` : `${weightSummary.leftWeightLbs.toFixed(2)} LBS`}</strong>
              </span>
              {barbellConfig.isLegPress45 && (
                <span className="px-2.5 py-1 rounded-lg bg-midnight-bg border border-neon-cyan/40">
                  Center Horn: <strong className="text-neon-cyan">{displayUnit === 'KG' ? `${weightSummary.centerWeightKg.toFixed(2)} KG` : `${weightSummary.centerWeightLbs.toFixed(2)} LBS`}</strong>
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-midnight-bg border border-midnight-border">
                {barbellConfig.isLegPress45 ? 'Right Horn: ' : 'Right: '}<strong className="text-neon-violet">{displayUnit === 'KG' ? `${weightSummary.rightWeightKg.toFixed(2)} KG` : `${weightSummary.rightWeightLbs.toFixed(2)} LBS`}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons & Unit Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 shrink-0">
            {/* Display Switcher Toggle without changing loaded plates */}
            <div className="p-1 bg-midnight-bg rounded-xl border border-midnight-border flex items-center">
              <button
                type="button"
                onClick={() => handleToggleDisplayUnit('KG')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black font-mono transition ${
                  displayUnit === 'KG'
                    ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Display in KG
              </button>
              <button
                type="button"
                onClick={() => handleToggleDisplayUnit('LBS')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black font-mono transition ${
                  (displayUnit === 'LB' || displayUnit === 'LBS')
                    ? 'bg-neon-cyan text-slate-950 shadow-md shadow-neon-cyan/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Display in LBS
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyWeight}
              className="p-2.5 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1e2f50] text-slate-300 hover:text-neon-cyan transition flex items-center justify-center gap-1.5 text-xs font-semibold"
              title="Copy weight value"
            >
              {copied ? <Check className="w-4 h-4 text-neon-success" /> : <Copy className="w-4 h-4" />}
              <span className="sm:hidden">Copy</span>
            </button>

            {/* Save Config Button */}
            <button
              onClick={handleSaveClick}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1e2f50] text-slate-200 text-xs font-bold transition hover:text-neon-cyan"
            >
              <BookmarkPlus className="w-4 h-4 text-neon-cyan" />
              <span>Save Setup</span>
            </button>

            {/* Transfer to Tracker Button */}
            <button
              onClick={handleUseInWorkout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-neon-cyan/25 transition active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Use In Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Barbell Representation */}
      <BarbellVisualizer
        barbellWeight={barbellConfig.weight}
        barbellUnit={barbellConfig.unit}
        leftPlates={leftPlates}
        rightPlates={rightPlates}
        centerPlates={centerPlates}
        onRemovePlate={handleRemovePlate}
        isSymmetric={weightSummary.isSymmetric}
        onMirrorLeftToRight={handleMirrorLeftToRight}
        onMirrorRightToLeft={handleMirrorRightToLeft}
        isLegPress45={barbellConfig.isLegPress45}
        onSelectLoadMode={setLoadMode}
      />

      {/* 3. Controls & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-midnight-card border border-midnight-border">
        {/* Load Destination Mode */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-neon-cyan" />
            Loading Target:
          </span>
          <div className={`grid ${barbellConfig.isLegPress45 ? 'grid-cols-4' : 'grid-cols-3'} p-1 bg-midnight-bg rounded-xl border border-midnight-border`}>
            <button
              type="button"
              onClick={() => setLoadMode('both')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                loadMode === 'both' ? 'bg-neon-cyan text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Both Sides
            </button>
            <button
              type="button"
              onClick={() => setLoadMode('left')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                loadMode === 'left' ? 'bg-neon-cyan text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {barbellConfig.isLegPress45 ? 'Left Horn' : 'Left Sleeve'}
            </button>
            {barbellConfig.isLegPress45 && (
              <button
                type="button"
                onClick={() => setLoadMode('center')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  loadMode === 'center' ? 'bg-neon-cyan text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Center Horn
              </button>
            )}
            <button
              type="button"
              onClick={() => setLoadMode('right')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                loadMode === 'right' ? 'bg-neon-cyan text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {barbellConfig.isLegPress45 ? 'Right Horn' : 'Right Sleeve'}
            </button>
          </div>

          {/* Quantity Multiplier */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Qty:</span>
            {[1, 2, 4].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setPlateQuantity(q)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                  plateQuantity === q 
                    ? 'bg-midnight-elevated text-neon-cyan border border-neon-cyan/40' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
        </div>

        {/* Balancing & Unrack Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMirrorLeftToRight}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1f2f50] text-neon-cyan text-xs font-semibold transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Mirror L&rarr;R</span>
          </button>

          <button
            onClick={handleMirrorRightToLeft}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-midnight-border bg-midnight-elevated hover:bg-[#1f2f50] text-neon-violet text-xs font-semibold transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Mirror R&rarr;L</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neon-error/30 bg-neon-error/10 hover:bg-neon-error/20 text-rose-300 text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-neon-error" />
            <span>Unrack Bar</span>
          </button>
        </div>
      </div>

      {/* 4. Barbell Configuration & Plate Racks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Barbell Selection & Custom Plate Entry */}
        <div className="space-y-6">
          
          {/* Section A: Barbell Configuration */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-neon-cyan" />
              Barbell Selection
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Select Barbell Type</label>
              <select
                value={selectedBarbellId}
                onChange={(e) => setSelectedBarbellId(e.target.value)}
                className="w-full px-3 py-2.5 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-neon-cyan"
              >
                {BARBELL_PRESETS.map((bar) => (
                  <option key={bar.id} value={bar.id}>
                    {bar.name} {bar.weight > 0 ? `(${bar.weight} ${bar.unit})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {barbellConfig.isLegPress45 && (
              <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Info className="w-4 h-4 text-neon-cyan" />
                  <span>45-Degree Leg Press Mode</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  45-Degree Leg Press mode: Sled weight is excluded. Calculation includes loaded plates only.
                </p>
              </div>
            )}

            {selectedBarbellId === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Custom Weight</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={customBarbellWeight}
                    onChange={(e) => setCustomBarbellWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Barbell Unit</label>
                  <select
                    value={customBarbellUnit}
                    onChange={(e) => setCustomBarbellUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="KG">KG</option>
                    <option value="LBS">LBS</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section: 45° Leg Press Center Weight Horn Station */}
          {barbellConfig.isLegPress45 && (
            <div className="bg-midnight-card border border-neon-cyan/40 rounded-3xl p-6 space-y-4 relative overflow-hidden shadow-lg shadow-neon-cyan/5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
                  <h3 className="text-sm font-black text-white">Center Weight Horn</h3>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30">
                  Middle Sled Post
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Standard on heavy-duty 45° leg press sleds for stacking additional plates directly in the center.
              </p>

              {/* Status & Active Target Controller */}
              <div className="p-3 bg-midnight-bg rounded-2xl border border-midnight-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Center Horn Load</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black font-mono text-neon-cyan">
                      {displayUnit === 'KG'
                        ? `${weightSummary.centerWeightKg.toFixed(2)} KG`
                        : `${weightSummary.centerWeightLbs.toFixed(2)} LBS`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({centerPlates.length}p)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoadMode('center')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      loadMode === 'center'
                        ? 'bg-neon-cyan text-slate-950 font-black shadow-md shadow-neon-cyan/20'
                        : 'bg-midnight-elevated text-slate-300 hover:text-white border border-midnight-border'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{loadMode === 'center' ? 'Active Target' : 'Target Center'}</span>
                  </button>

                  {centerPlates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCenterPlates([])}
                      className="p-1.5 text-slate-400 hover:text-neon-error transition rounded-lg hover:bg-neon-error/10"
                      title="Clear Center Horn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Add Buttons to Center Horn */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">Quick Add to Center Horn:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { w: 25, u: 'KG' },
                    { w: 20, u: 'KG' },
                    { w: 10, u: 'KG' },
                    { w: 45, u: 'LB' },
                    { w: 25, u: 'LB' },
                    { w: 10, u: 'LB' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCenterPlates(prev => [...prev, { id: `c_${Date.now()}_${Math.random()}`, weight: p.w, unit: p.u }]);
                        addNotification(`Added ${p.w} ${p.u} to Center Horn`, 'info', 1500);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-midnight-elevated hover:bg-[#1e2f50] border border-midnight-border text-[11px] font-mono font-bold text-slate-200 hover:text-neon-cyan transition"
                    >
                      +{p.w} {p.u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loaded Plates list on Center Horn */}
              {centerPlates.length > 0 && (
                <div className="pt-2 border-t border-midnight-border">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Plates on Center Horn (tap to remove):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {centerPlates.map((plate, idx) => (
                      <button
                        key={plate.id || idx}
                        type="button"
                        onClick={() => handleRemovePlate('center', idx)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-midnight-bg border border-midnight-border text-[11px] font-mono text-white hover:border-neon-error hover:text-neon-error cursor-pointer transition group"
                        title="Click to remove"
                      >
                        <span className={plate.unit === 'KG' ? 'text-neon-cyan font-bold' : 'text-neon-violet font-bold'}>
                          {plate.weight} {plate.unit}
                        </span>
                        <Trash2 className="w-3 h-3 text-slate-500 group-hover:text-neon-error" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Plate Entry Form */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-neon-cyan" />
              Add Custom Plate Weight
            </h3>
            <p className="text-xs text-slate-400">
              For fractional plates, chains, or non-standard weights
            </p>

            <form onSubmit={handleAddCustomPlate} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 7.5 or 12.5"
                    value={customPlateWeight}
                    onChange={(e) => setCustomPlateWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <select
                    value={customPlateUnit}
                    onChange={(e) => setCustomPlateUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="KG">KG</option>
                    <option value="LBS">LBS</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-midnight-elevated hover:bg-[#1f2f50] border border-midnight-border text-neon-cyan text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Plate</span>
              </button>
            </form>
          </div>

          {/* Quick Preset Combinations */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-gold" />
              Quick Combinations
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => handleApplyPreset(60, 'KG')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan text-slate-200 hover:text-white transition text-center"
              >
                60 KG
              </button>
              <button
                onClick={() => handleApplyPreset(100, 'KG')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan text-slate-200 hover:text-white transition text-center"
              >
                100 KG
              </button>
              <button
                onClick={() => handleApplyPreset(140, 'KG')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan text-slate-200 hover:text-white transition text-center"
              >
                140 KG
              </button>
              <button
                onClick={() => handleApplyPreset(102.05, 'LB')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-violet text-slate-200 hover:text-white transition text-center"
              >
                225 LBS
              </button>
              <button
                onClick={() => handleApplyPreset(61.23, 'LB')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-violet text-slate-200 hover:text-white transition text-center"
              >
                135 LBS
              </button>
              <button
                onClick={() => handleApplyPreset(142.88, 'LB')}
                className="p-2 rounded-xl bg-midnight-bg border border-midnight-border hover:border-neon-violet text-slate-200 hover:text-white transition text-center"
              >
                315 LBS
              </button>
              <button
                onClick={() => {
                  setSelectedBarbellId('leg-press-45');
                  setLeftPlates([{ id: 'lp_1', weight: 20, unit: 'KG' }, { id: 'lp_2', weight: 20, unit: 'KG' }]);
                  setRightPlates([{ id: 'lp_3', weight: 20, unit: 'KG' }, { id: 'lp_4', weight: 20, unit: 'KG' }]);
                  setCenterPlates([{ id: 'lp_c1', weight: 20, unit: 'KG' }]);
                  addNotification('Applied 45° Leg Press Setup', 'info');
                }}
                className="col-span-2 p-2 rounded-xl bg-midnight-bg border border-neon-cyan/40 hover:bg-neon-cyan/10 text-neon-cyan transition text-center font-bold"
              >
                45° Leg Press: 100 KG Setup
              </button>
            </div>
          </div>

        </div>

        {/* Right Columns (2-Span): KG and LB Plate Racks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Auto Plate Solver */}
          <AutoPlateSolver
            barbellConfig={barbellConfig}
            activeUnit={displayUnit}
            onApplyPlates={handleApplyAutoSolverPlates}
            addNotification={addNotification}
          />

          {/* Section B: KG Plates Rack */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">KG Plates</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {STANDARD_KG_PLATES.map((w) => {
                const style = getPlateStyle(w, 'KG');
                return (
                  <button
                    key={`kg_${w}`}
                    onClick={() => handleAddPlate(w, 'KG')}
                    className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/60 hover:bg-midnight-secondary transition flex items-center justify-between group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-8 ${style.bg} rounded-sm shadow-sm`} />
                      <div className="text-left">
                        <span className="text-sm font-black font-mono text-white block group-hover:text-neon-cyan">
                          {w} <span className="text-xs text-slate-400 font-semibold font-mono">KG</span>
                        </span>
                      </div>
                    </div>

                    <span className="w-6 h-6 rounded-lg bg-midnight-elevated flex items-center justify-center text-slate-400 group-hover:text-slate-950 group-hover:bg-neon-cyan transition font-bold">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: LBS Plates Rack */}
          <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">LBS Plates</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {STANDARD_LB_PLATES.map((w) => {
                const style = getPlateStyle(w, 'LB');
                return (
                  <button
                    key={`lb_${w}`}
                    onClick={() => handleAddPlate(w, 'LB')}
                    className="p-3 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-violet/60 hover:bg-midnight-secondary transition flex items-center justify-between group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-8 ${style.bg} rounded-sm shadow-sm`} />
                      <div className="text-left">
                        <span className="text-sm font-black font-mono text-white block group-hover:text-neon-violet">
                          {w} <span className="text-xs text-slate-400 font-semibold font-mono">LBS</span>
                        </span>
                      </div>
                    </div>

                    <span className="w-6 h-6 rounded-lg bg-midnight-elevated flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-neon-violet transition font-bold">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plate Arrangements Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Sleeve Breakdown */}
            <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neon-cyan flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                  Left Sleeve Arrangement
                </span>
                <span className="font-mono text-slate-400">{leftPlates.length} plates</span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {leftPlates.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">Empty sleeve</span>
                ) : (
                  leftPlates.map((p, idx) => (
                    <span 
                      key={p.id || idx}
                      onClick={() => handleRemovePlate('left', idx)}
                      className={`px-2 py-0.5 rounded-md border text-xs font-mono cursor-pointer transition ${
                        p.unit === 'KG'
                          ? 'bg-neon-cyan/10 border-neon-cyan/30 text-cyan-200 hover:border-neon-error hover:text-rose-300'
                          : 'bg-neon-violet/10 border-neon-violet/30 text-purple-200 hover:border-neon-error hover:text-rose-300'
                      }`}
                      title="Click to remove"
                    >
                      {p.weight} {(p.unit === 'LB' || p.unit === 'LBS') ? 'LBS' : 'KG'} &times;
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Right Sleeve Breakdown */}
            <div className="p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neon-violet flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-violet" />
                  Right Sleeve Arrangement
                </span>
                <span className="font-mono text-slate-400">{rightPlates.length} plates</span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {rightPlates.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">Empty sleeve</span>
                ) : (
                  rightPlates.map((p, idx) => (
                    <span 
                      key={p.id || idx}
                      onClick={() => handleRemovePlate('right', idx)}
                      className={`px-2 py-0.5 rounded-md border text-xs font-mono cursor-pointer transition ${
                        p.unit === 'KG'
                          ? 'bg-neon-cyan/10 border-neon-cyan/30 text-cyan-200 hover:border-neon-error hover:text-rose-300'
                          : 'bg-neon-violet/10 border-neon-violet/30 text-purple-200 hover:border-neon-error hover:text-rose-300'
                      }`}
                      title="Click to remove"
                    >
                      {p.weight} {(p.unit === 'LB' || p.unit === 'LBS') ? 'LBS' : 'KG'} &times;
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Saved Configurations Carousel / List */}
          {savedConfigurations && savedConfigurations.length > 0 ? (
            <div className="p-4 rounded-2xl bg-midnight-card border border-midnight-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-neon-cyan" />
                  Saved Plate Configurations ({savedConfigurations.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedConfigurations.map((cfg) => (
                  <div
                    key={cfg.id}
                    className="p-3 rounded-xl bg-midnight-bg border border-midnight-border flex items-center justify-between group hover:border-neon-cyan/40 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-white truncate">{cfg.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {cfg.totalKg} KG &bull; {cfg.totalLbs} LBS
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleLoadSavedConfig(cfg)}
                        className="px-2.5 py-1 rounded-lg bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-slate-950 text-xs font-bold transition"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePlateConfiguration(cfg.id)}
                        className="p-1 text-slate-500 hover:text-neon-error transition"
                        title="Delete saved configuration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-midnight-card/50 border border-midnight-border/60 text-center space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-midnight-bg border border-midnight-border flex items-center justify-center text-slate-500 mx-auto">
                <Bookmark className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-bold text-white">The Rack is Empty</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Load your barbell setup and click &quot;Save Configuration&quot; above to store custom setups on your rack.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Save Configuration Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-neon-cyan" />
              Save Plate Configuration
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Give your current barbell plate setup a memorable name to recall anytime.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Configuration Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. PR Deadlift 200kg (Mixed Plates)"
                  value={configNameInput}
                  onChange={(e) => setConfigNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-midnight-bg border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-neon-cyan/20 transition active:scale-95"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
