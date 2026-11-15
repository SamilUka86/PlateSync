import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wand2, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Settings2, 
  Plus, 
  Minus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  solvePlateCombination, 
  getPlateStyle 
} from '../../utils/weightCalculations';

export const AutoPlateSolver = ({
  barbellConfig,
  activeUnit = 'KG',
  onApplyPlates,
  addNotification
}) => {
  const [targetWeight, setTargetWeight] = useState('');
  const [targetUnit, setTargetUnit] = useState(activeUnit);
  const [plateUnit, setPlateUnit] = useState(activeUnit);
  const [maxPlateWeight, setMaxPlateWeight] = useState('');
  const [allowFractional, setAllowFractional] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync unit when activeUnit changes from parent
  useEffect(() => {
    if (!targetWeight) {
      setTargetUnit(activeUnit);
      setPlateUnit(activeUnit);
    }
  }, [activeUnit]);

  // Quick weight presets
  const quickPresets = targetUnit === 'KG'
    ? [60, 80, 100, 120, 140, 160, 180, 200]
    : [135, 185, 225, 275, 315, 365, 405, 495];

  // Max plate options
  const maxPlateOptions = plateUnit === 'KG'
    ? [
        { label: 'Any Plate Size', value: '' },
        { label: 'Max 25 KG', value: '25' },
        { label: 'Max 20 KG', value: '20' },
        { label: 'Max 15 KG', value: '15' },
        { label: 'Max 10 KG', value: '10' }
      ]
    : [
        { label: 'Any Plate Size', value: '' },
        { label: 'Max 45 LBS', value: '45' },
        { label: 'Max 35 LBS', value: '35' },
        { label: 'Max 25 LBS', value: '25' }
      ];

  // Calculate plate combination
  const solution = useMemo(() => {
    if (!targetWeight || Number(targetWeight) <= 0) return null;

    return solvePlateCombination({
      targetWeight: Number(targetWeight),
      targetUnit,
      barbellWeight: barbellConfig.weight,
      barbellUnit: barbellConfig.unit,
      isLegPress45: Boolean(barbellConfig.isLegPress45),
      plateUnit,
      maxPlateWeight: maxPlateWeight ? Number(maxPlateWeight) : null,
      allowFractional
    });
  }, [
    targetWeight, 
    targetUnit, 
    barbellConfig.weight, 
    barbellConfig.unit, 
    barbellConfig.isLegPress45, 
    plateUnit, 
    maxPlateWeight, 
    allowFractional
  ]);

  // Step increments
  const handleStep = (delta) => {
    const current = Number(targetWeight) || (targetUnit === 'KG' ? 60 : 135);
    const step = targetUnit === 'KG' ? 2.5 : 5;
    const nextVal = Math.max(0, current + delta * step);
    setTargetWeight(String(nextVal));
  };

  // Load onto barbell
  const handleLoad = () => {
    if (!solution || !solution.isValid) {
      if (solution?.error && addNotification) {
        addNotification(solution.error, 'error');
      }
      return;
    }

    if (onApplyPlates) {
      onApplyPlates(solution.flatPlatesPerSide, solution);
    }

    if (addNotification) {
      addNotification(
        `Loaded ${solution.achievedTotalWeight} ${solution.targetUnit} onto barbell`,
        'success'
      );
    }
  };

  return (
    <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 relative overflow-hidden shadow-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[70px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              Auto Plate Solver
            </h3>
            <p className="text-[11px] text-slate-400">
              Enter target weight to calculate plates per side
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
            showAdvanced 
              ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan' 
              : 'bg-midnight-bg border-midnight-border text-slate-400 hover:text-white'
          }`}
          title="Toggle Solver Settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Advanced Solver Settings Drawer */}
      {showAdvanced && (
        <div className="mb-4 p-4 rounded-2xl bg-midnight-bg border border-midnight-border space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                Plate Unit
              </label>
              <select
                value={plateUnit}
                onChange={(e) => setPlateUnit(e.target.value)}
                className="w-full px-3 py-2 bg-midnight-card border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
              >
                <option value="KG">Use KG Plates</option>
                <option value="LBS">Use LBS Plates</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                Max Plate Size
              </label>
              <select
                value={maxPlateWeight}
                onChange={(e) => setMaxPlateWeight(e.target.value)}
                className="w-full px-3 py-2 bg-midnight-card border border-midnight-border rounded-xl text-white text-xs focus:outline-none focus:border-neon-cyan"
              >
                {maxPlateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={allowFractional}
                onChange={(e) => setAllowFractional(e.target.checked)}
                className="rounded border-midnight-border bg-midnight-card text-neon-cyan focus:ring-0"
              />
              <span>Allow Fractional Plates</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setPlateUnit(targetUnit);
                setMaxPlateWeight('');
                setAllowFractional(true);
              }}
              className="text-[11px] text-slate-400 hover:text-neon-cyan flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Settings
            </button>
          </div>
        </div>
      )}

      {/* Target Weight Input Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Minus Button */}
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="w-11 h-11 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
            title="Decrease Weight"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Main Number Input */}
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 140"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full h-11 px-4 bg-midnight-bg border border-midnight-border rounded-2xl text-white font-mono text-lg font-black tracking-wide focus:outline-none focus:border-neon-cyan placeholder:text-slate-600"
            />
          </div>

          {/* Plus Button */}
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="w-11 h-11 rounded-2xl bg-midnight-bg border border-midnight-border hover:border-neon-cyan/50 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
            title="Increase Weight"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Target Unit Toggle */}
          <div className="flex items-center p-1 bg-midnight-bg rounded-2xl border border-midnight-border h-11">
            <button
              type="button"
              onClick={() => {
                setTargetUnit('KG');
                setPlateUnit('KG');
              }}
              className={`h-full px-3 rounded-xl text-xs font-mono font-black transition ${
                targetUnit === 'KG'
                  ? 'bg-neon-cyan text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              KG
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetUnit('LBS');
                setPlateUnit('LBS');
              }}
              className={`h-full px-3 rounded-xl text-xs font-mono font-black transition ${
                (targetUnit === 'LB' || targetUnit === 'LBS')
                  ? 'bg-neon-violet text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LBS
            </button>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap mr-1">
            Presets:
          </span>
          {quickPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setTargetWeight(String(val))}
              className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-bold transition whitespace-nowrap active:scale-95 ${
                targetWeight === String(val)
                  ? 'bg-neon-cyan text-slate-950 border-neon-cyan font-black'
                  : 'bg-midnight-bg border-midnight-border text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Solution Card */}
      {solution && (
        <div className="mt-4 pt-4 border-t border-midnight-border space-y-3 animate-in fade-in">
          {solution.isValid ? (
            <>
              {/* Solution Summary Header */}
              <div className="p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Per Side Loading
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black font-mono text-neon-cyan">
                      {solution.weightPerSideAchieved} {solution.plateUnit}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      each {barbellConfig.isLegPress45 ? 'horn' : 'sleeve'}
                    </span>
                  </div>
                </div>

                {/* Accuracy Status Badge */}
                <div>
                  {solution.isExact ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neon-success/10 border border-neon-success/20 text-neon-success text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Exact Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neon-warning/10 border border-neon-warning/20 text-neon-warning text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Achieved {solution.achievedTotalWeight} {solution.targetUnit} ({solution.difference > 0 ? `-${solution.difference}` : `+${Math.abs(solution.difference)}`})
                    </span>
                  )}
                </div>
              </div>

              {/* Plates per side badges */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Plates Needed Per Side:
                </span>

                {solution.platesPerSide.length === 0 ? (
                  <div className="p-3 rounded-xl bg-midnight-bg border border-midnight-border text-center text-xs text-slate-400">
                    No plates needed. Barbell alone matches target weight.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {solution.platesPerSide.map((p, idx) => {
                      const isKg = p.unit === 'KG';
                      const style = getPlateStyle(p.weight, p.unit);
                      return (
                        <div
                          key={`sol_${p.weight}_${idx}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight-bg border border-midnight-border"
                        >
                          <div className={`w-2.5 h-6 ${style.bg} rounded-sm`} />
                          <div className="font-mono text-xs">
                            <span className="font-black text-white">
                              {p.count} &times;
                            </span>{' '}
                            <span className={isKg ? 'text-neon-cyan font-bold' : 'text-neon-violet font-bold'}>
                              {p.weight} {p.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Button: Load Onto Barbell */}
              <button
                type="button"
                onClick={handleLoad}
                className="w-full py-3 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-neon-cyan/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Load Onto Barbell</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="p-3 rounded-xl bg-neon-error/10 border border-neon-error/20 text-neon-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{solution.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
