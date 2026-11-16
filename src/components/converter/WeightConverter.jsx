import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Scale, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2, 
  Info 
} from 'lucide-react';
import { KG_TO_LBS, LBS_TO_KG } from '../../utils/weightCalculations';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const WeightConverter = ({ isEmbedded = false }) => {
  const { userProfile } = useAuth();
  const { addNotification } = useNotification();

  // Detect header unit preference ('KG' or 'LBS')
  const headerUnit = (userProfile?.preferredUnit === 'LB' || userProfile?.preferredUnit === 'LBS') ? 'LBS' : 'KG';

  // Active primary input unit ('KG' or 'LBS')
  const [activeUnit, setActiveUnit] = useState(headerUnit);
  const [kgValue, setKgValue] = useState(() => headerUnit === 'LBS' ? (100 * LBS_TO_KG).toFixed(2) : '100');
  const [lbsValue, setLbsValue] = useState(() => headerUnit === 'LBS' ? '100' : (100 * KG_TO_LBS).toFixed(2));
  const [copiedKey, setCopiedKey] = useState(null);

  // When user toggles KG/LBS in header, update active unit and recalculate formula accordingly
  useEffect(() => {
    setActiveUnit(headerUnit);
    if (headerUnit === 'LBS') {
      setLbsValue('100');
      setKgValue((100 * LBS_TO_KG).toFixed(2));
    } else {
      setKgValue('100');
      setLbsValue((100 * KG_TO_LBS).toFixed(2));
    }
  }, [headerUnit]);

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

  // Swap conversion direction (KG ⇄ LBS) properly without compounding values
  const handleSwapUnits = () => {
    const nextUnit = activeUnit === 'KG' ? 'LBS' : 'KG';
    setActiveUnit(nextUnit);

    // Take the user's primary input value from the currently active unit
    const currentValue = activeUnit === 'KG' ? kgValue : lbsValue;
    const num = parseFloat(currentValue);

    if (!isNaN(num) && num > 0) {
      if (nextUnit === 'LBS') {
        // Transfer the base number into LBS and convert properly to KG
        setLbsValue(currentValue);
        setKgValue((num * LBS_TO_KG).toFixed(2));
      } else {
        // Transfer the base number into KG and convert properly to LBS
        setKgValue(currentValue);
        setLbsValue((num * KG_TO_LBS).toFixed(2));
      }
    } else {
      if (nextUnit === 'LBS') {
        setLbsValue(currentValue || '');
        setKgValue('');
      } else {
        setKgValue(currentValue || '');
        setLbsValue('');
      }
    }

    addNotification(`Swapped direction: now converting ${nextUnit} ➔ ${nextUnit === 'KG' ? 'LBS' : 'KG'}`, 'info');
  };

  // Reset to default 100 of active unit
  const handleReset = () => {
    if (activeUnit === 'LBS') {
      setLbsValue('100');
      setKgValue((100 * LBS_TO_KG).toFixed(2));
    } else {
      setKgValue('100');
      setLbsValue((100 * KG_TO_LBS).toFixed(2));
    }
    addNotification(`Reset conversion to default (100 ${activeUnit})`, 'success');
  };

  // Clear all inputs
  const handleClearAll = () => {
    setKgValue('');
    setLbsValue('');
    addNotification('Cleared conversion inputs', 'info');
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
              Bidirectional real-time conversion between Kilograms and Pounds (Standard 2 Decimal Precision)
            </p>
          </div>
        </div>

        {/* Clear & Reset Actions */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-bg hover:bg-rose-500/10 border border-midnight-border hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-medium transition active:scale-95 shadow-sm cursor-pointer"
            title="Clear all values"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border hover:border-neon-cyan/40 text-slate-300 hover:text-neon-cyan text-xs font-bold transition active:scale-95 shadow-sm cursor-pointer"
            title="Reset to 100"
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
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-midnight-bg transition cursor-pointer"
              title="Copy KG value"
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
              placeholder="0.00"
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
                className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-neon-cyan/20 text-slate-200 hover:text-neon-cyan border border-midnight-border hover:border-neon-cyan/40 text-[10.5px] font-bold font-mono transition active:scale-95 cursor-pointer"
              >
                +{amt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => adjustKg(-2.5)}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-midnight-border text-[10.5px] font-bold font-mono transition active:scale-95 cursor-pointer"
            >
              -2.5
            </button>
          </div>
        </div>

        {/* Center: Swap Direction Button */}
        <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
          <button
            type="button"
            onClick={handleSwapUnits}
            className="w-12 h-12 rounded-2xl bg-midnight-card hover:bg-midnight-elevated border border-midnight-border hover:border-neon-cyan/50 text-slate-200 hover:text-neon-cyan flex items-center justify-center shadow-lg transition duration-200 transform hover:scale-110 active:scale-95 group cursor-pointer"
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
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-midnight-bg transition cursor-pointer"
              title="Copy LBS value"
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
              placeholder="0.00"
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
                className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-neon-violet/20 text-slate-200 hover:text-neon-violet border border-midnight-border hover:border-neon-violet/40 text-[10.5px] font-bold font-mono transition active:scale-95 cursor-pointer"
              >
                +{amt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => adjustLbs(-5)}
              className="px-2 py-1 rounded-lg bg-midnight-bg hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-midnight-border text-[10.5px] font-bold font-mono transition active:scale-95 cursor-pointer"
            >
              -5
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Conversion Standard & Formula Bar (Changes automatically when KG / LBS is switched in Header) */}
      <div className="p-4 rounded-2xl bg-midnight-bg/90 border border-midnight-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shadow-md">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-neon-cyan shrink-0" />
          {activeUnit === 'KG' ? (
            <span>
              Standard Formula: <strong className="text-white font-mono">1 KG = 2.20462 LBS</strong> &bull; Multiply KG by 2.20462 to get Pounds
            </span>
          ) : (
            <span>
              Standard Formula: <strong className="text-white font-mono">1 LB = 0.45359 KG</strong> &bull; Multiply LBS by 0.45359 to get Kilograms
            </span>
          )}
        </div>

        <div className="font-mono text-xs font-bold flex items-center gap-1.5">
          <span className="text-slate-400">Formula:</span>
          {activeUnit === 'KG' ? (
            <span className="text-white bg-midnight-card px-3 py-1 rounded-lg border border-neon-cyan/30 text-xs">
              <strong className="text-neon-cyan">KG</strong> × <span className="text-slate-200">2.20462</span> = <strong className="text-neon-violet">LBS</strong>
            </span>
          ) : (
            <span className="text-white bg-midnight-card px-3 py-1 rounded-lg border border-neon-violet/30 text-xs">
              <strong className="text-neon-violet">LBS</strong> × <span className="text-slate-200">0.45359</span> = <strong className="text-neon-cyan">KG</strong>
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
