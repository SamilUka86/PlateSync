import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Scale, 
  Dumbbell, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Calculator,
  ArrowRight,
  Info
} from 'lucide-react';
import { KG_TO_LBS, LBS_TO_KG } from '../../utils/weightCalculations';
import { useWorkout } from '../../context/WorkoutContext';
import { useNotification } from '../../context/NotificationContext';

export const WeightConverter = ({ isEmbedded = false, setActiveTab = null }) => {
  const { setStagedWeight } = useWorkout();
  const { addNotification } = useNotification();

  // Active primary input unit ('KG' or 'LBS')
  const [activeUnit, setActiveUnit] = useState('KG');
  const [kgValue, setKgValue] = useState('100');
  const [lbsValue, setLbsValue] = useState(() => (100 * KG_TO_LBS).toFixed(2));
  const [copiedKey, setCopiedKey] = useState(null);

  // Update LBS when KG changes (always 2 decimal places)
  const handleKgChange = (val) => {
    setKgValue(val);
    setActiveUnit('KG');
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setLbsValue((num * KG_TO_LBS).toFixed(2));
    } else {
      setLbsValue('');
    }
  };

  // Update KG when LBS changes (always 2 decimal places)
  const handleLbsChange = (val) => {
    setLbsValue(val);
    setActiveUnit('LBS');
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setKgValue((num * LBS_TO_KG).toFixed(2));
    } else {
      setKgValue('');
    }
  };

  // Swap Units
  const handleSwapUnits = () => {
    const currentKg = kgValue;
    const currentLbs = lbsValue;
    setActiveUnit(prev => (prev === 'KG' ? 'LBS' : 'KG'));
    // Swap the values into the opposite fields
    setKgValue(currentLbs);
    const num = parseFloat(currentLbs);
    if (!isNaN(num) && num >= 0) {
      setLbsValue((num * KG_TO_LBS).toFixed(2));
    }
    addNotification('Swapped conversion values', 'info');
  };

  // Reset to default
  const handleReset = () => {
    setKgValue('100');
    setLbsValue((100 * KG_TO_LBS).toFixed(2));
    setActiveUnit('KG');
  };

  // Copy result to clipboard
  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    addNotification(`Copied ${text} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Quick increment/decrement adjustments
  const adjustKg = (delta) => {
    const current = parseFloat(kgValue) || 0;
    const next = Math.max(0, current + delta);
    handleKgChange(next % 1 === 0 ? next.toString() : Number(next.toFixed(2)).toString());
  };

  const adjustLbs = (delta) => {
    const current = parseFloat(lbsValue) || 0;
    const next = Math.max(0, current + delta);
    handleLbsChange(next % 1 === 0 ? next.toString() : Number(next.toFixed(2)).toString());
  };

  // Common gym weight reference milestones
  const GYM_MILESTONES = [
    { label: 'Olympic Bar', kg: 20, lbs: 44.09, plates: 'Barbell Only' },
    { label: '1 Plate (135 lbs)', kg: 61.23, lbs: 135.00, plates: '1 × 45 lb plate per side' },
    { label: '1 Plate (60 kg)', kg: 60, lbs: 132.28, plates: '1 × 20 kg plate per side' },
    { label: '2 Plates (225 lbs)', kg: 102.06, lbs: 225.00, plates: '2 × 45 lb plates per side' },
    { label: '2 Plates (100 kg)', kg: 100, lbs: 220.46, plates: '2 × 20 kg plates per side' },
    { label: '3 Plates (315 lbs)', kg: 142.88, lbs: 315.00, plates: '3 × 45 lb plates per side' },
    { label: '3 Plates (140 kg)', kg: 140, lbs: 308.65, plates: '3 × 20 kg plates per side' },
    { label: '4 Plates (405 lbs)', kg: 183.70, lbs: 405.00, plates: '4 × 45 lb plates per side' },
    { label: '4 Plates (180 kg)', kg: 180, lbs: 396.83, plates: '4 × 20 kg plates per side' },
    { label: '5 Plates (495 lbs)', kg: 224.53, lbs: 495.00, plates: '5 × 45 lb plates per side' },
    { label: '5 Plates (220 kg)', kg: 220, lbs: 485.02, plates: '5 × 20 kg plates per side' },
  ];

  // Send converted weight into Barbell Calculator
  const handleLoadIntoCalculator = (weight, unit) => {
    if (setStagedWeight) {
      setStagedWeight({
        targetWeight: parseFloat(weight) || 20,
        unit: unit || 'KG',
        timestamp: Date.now()
      });
    }
    if (setActiveTab) {
      setActiveTab('calculator');
    }
    addNotification(`Loaded ${weight} ${unit} into Barbell Calculator!`, 'success');
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? 'mt-8 pt-8 border-t border-midnight-border' : ''}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 rounded-3xl bg-midnight-card border border-midnight-border shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shadow-lg shadow-neon-cyan/10 shrink-0">
            <ArrowLeftRight className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Weight Conversion
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 text-[10px] font-black font-mono tracking-wider">
                KG ⇄ LBS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant bidirectional conversion between Kilograms and Pounds with precision barbell math
            </p>
          </div>
        </div>

        {/* Reset Action */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-300 hover:text-white text-xs font-semibold transition active:scale-95 shadow-sm"
            title="Reset to 100 kg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Dual Converter Box */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        
        {/* Left Side: Kilograms (KG) Box */}
        <div className={`lg:col-span-5 p-5 md:p-6 rounded-3xl border transition-all ${
          activeUnit === 'KG'
            ? 'bg-midnight-card/90 border-neon-cyan/50 shadow-xl shadow-neon-cyan/5 ring-1 ring-neon-cyan/30'
            : 'bg-midnight-card/60 border-midnight-border'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-neon-cyan flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Kilograms (KG)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(kgValue, 'kg')}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-midnight-bg transition"
            >
              {copiedKey === 'kg' ? <Check className="w-3 h-3 text-neon-success" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'kg' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={kgValue}
              onChange={(e) => handleKgChange(e.target.value)}
              placeholder="0.0"
              className="w-full bg-midnight-bg border border-midnight-border focus:border-neon-cyan text-white text-3xl md:text-4xl font-black font-mono px-4 py-3.5 rounded-2xl outline-none transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-neon-cyan/70 select-none">
              KG
            </span>
          </div>

          {/* Quick Adjustment Pills for KG */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-midnight-border/60">
            <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
            {[1, 2.5, 5, 10, 20, 25].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => adjustKg(amt)}
                className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-neon-cyan/20 text-slate-200 hover:text-neon-cyan border border-midnight-border hover:border-neon-cyan/40 text-[10.5px] font-bold font-mono transition active:scale-95"
              >
                +{amt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => adjustKg(-2.5)}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-midnight-border text-[10.5px] font-bold font-mono transition active:scale-95"
            >
              -2.5
            </button>
            <button
              type="button"
              onClick={() => handleKgChange('0')}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-midnight-elevated text-slate-400 hover:text-white border border-midnight-border text-[10.5px] font-bold transition ml-auto"
            >
              Clear
            </button>
          </div>

          {/* Barbell Quick Action */}
          {setActiveTab && (
            <button
              type="button"
              onClick={() => handleLoadIntoCalculator(kgValue, 'KG')}
              className="w-full mt-3.5 py-2 px-3 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Load {kgValue || 0} KG in Barbell Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>

        {/* Center: Swap Direction Button */}
        <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
          <button
            type="button"
            onClick={handleSwapUnits}
            className="w-12 h-12 rounded-2xl bg-midnight-card hover:bg-midnight-elevated border border-midnight-border hover:border-neon-cyan/50 text-slate-200 hover:text-neon-cyan flex items-center justify-center shadow-lg transition duration-200 transform hover:scale-110 active:scale-95 group"
            title="Swap conversion direction (KG ⇄ LBS)"
          >
            <ArrowLeftRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Right Side: Pounds (LBS) Box */}
        <div className={`lg:col-span-5 p-5 md:p-6 rounded-3xl border transition-all ${
          activeUnit === 'LBS'
            ? 'bg-midnight-card/90 border-neon-violet/50 shadow-xl shadow-neon-violet/5 ring-1 ring-neon-violet/30'
            : 'bg-midnight-card/60 border-midnight-border'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-neon-violet flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Pounds (LBS)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(lbsValue, 'lbs')}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-midnight-bg transition"
            >
              {copiedKey === 'lbs' ? <Check className="w-3 h-3 text-neon-success" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'lbs' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={lbsValue}
              onChange={(e) => handleLbsChange(e.target.value)}
              placeholder="0.0"
              className="w-full bg-midnight-bg border border-midnight-border focus:border-neon-violet text-white text-3xl md:text-4xl font-black font-mono px-4 py-3.5 rounded-2xl outline-none transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black font-mono text-neon-violet/70 select-none">
              LBS
            </span>
          </div>

          {/* Quick Adjustment Pills for LBS */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-midnight-border/60">
            <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
            {[2.5, 5, 10, 25, 35, 45].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => adjustLbs(amt)}
                className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-neon-violet/20 text-slate-200 hover:text-neon-violet border border-midnight-border hover:border-neon-violet/40 text-[10.5px] font-bold font-mono transition active:scale-95"
              >
                +{amt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => adjustLbs(-5)}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-midnight-border text-[10.5px] font-bold font-mono transition active:scale-95"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleLbsChange('0')}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-midnight-elevated text-slate-400 hover:text-white border border-midnight-border text-[10.5px] font-bold transition ml-auto"
            >
              Clear
            </button>
          </div>

          {/* Barbell Quick Action */}
          {setActiveTab && (
            <button
              type="button"
              onClick={() => handleLoadIntoCalculator(lbsValue, 'LBS')}
              className="w-full mt-3.5 py-2 px-3 rounded-xl bg-neon-violet/10 hover:bg-neon-violet/20 border border-neon-violet/30 text-neon-violet text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Load {lbsValue || 0} LBS in Barbell Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>

      </div>

      {/* Conversion Standard & Formula Bar */}
      <div className="p-4 rounded-2xl bg-midnight-bg/80 border border-midnight-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-neon-cyan shrink-0" />
          <span>
            Strict Scientific Standard: <strong className="text-white font-mono">1 KG = 2.20462 LBS</strong> &bull; <strong className="text-white font-mono">1 LB = 0.45359 KG</strong>
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Formula: <span className="text-neon-cyan">KG × 2.20462</span> = <span className="text-neon-violet">LBS</span>
        </div>
      </div>

      {/* Common Gym Milestones Table */}
      <div className="p-5 md:p-6 rounded-3xl bg-midnight-card border border-midnight-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-gold" />
            <h3 className="text-sm font-bold text-white">
              Common Barbell &amp; Plate Milestones
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Click any row to load into converter
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-midnight-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-midnight-bg/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-midnight-border">
              <tr>
                <th className="py-2.5 px-4 font-bold">Milestone / Standard</th>
                <th className="py-2.5 px-4 font-bold text-neon-cyan">Kilograms (KG)</th>
                <th className="py-2.5 px-4 font-bold text-neon-violet">Pounds (LBS)</th>
                <th className="py-2.5 px-4 font-bold text-slate-400 hidden sm:table-cell">Plate Breakdown</th>
                <th className="py-2.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-border/60 bg-midnight-bg/40 font-mono text-[11px]">
              {GYM_MILESTONES.map((row, idx) => {
                const isMatch = Math.abs((parseFloat(kgValue) || 0) - row.kg) < 0.5;
                return (
                  <tr 
                    key={idx}
                    onClick={() => {
                      handleKgChange(row.kg.toString());
                      addNotification(`Loaded ${row.label} (${row.kg} KG / ${row.lbs} LBS)`, 'info');
                    }}
                    className={`cursor-pointer transition-colors ${
                      isMatch 
                        ? 'bg-neon-cyan/15 hover:bg-neon-cyan/20' 
                        : 'hover:bg-midnight-elevated/80'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-neon-cyan animate-pulse' : 'bg-slate-600'}`} />
                      {row.label}
                    </td>
                    <td className="py-2.5 px-4 font-black text-neon-cyan">
                      {typeof row.kg === 'number' ? row.kg.toFixed(2) : row.kg} KG
                    </td>
                    <td className="py-2.5 px-4 font-black text-neon-violet">
                      {typeof row.lbs === 'number' ? row.lbs.toFixed(2) : row.lbs} LBS
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans text-[10.5px] hidden sm:table-cell">
                      {row.plates}
                    </td>
                    <td className="py-2.5 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadIntoCalculator(row.kg, 'KG');
                        }}
                        className="px-2 py-1 rounded-lg bg-midnight-card hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 text-[10px] font-bold transition active:scale-95"
                        title="Load into 2D Barbell Visualizer"
                      >
                        Calculate ➔
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
