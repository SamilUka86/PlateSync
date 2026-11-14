import React from 'react';
import { Trash2, AlertTriangle, CheckCircle2, ArrowRightLeft, Plus } from 'lucide-react';
import { getPlateStyle } from '../../utils/weightCalculations';

export const BarbellVisualizer = ({
  barbellWeight,
  barbellUnit,
  leftPlates,
  rightPlates,
  centerPlates = [],
  onRemovePlate,
  isSymmetric,
  onMirrorLeftToRight,
  onMirrorRightToLeft,
  isLegPress45 = false,
  onSelectLoadMode
}) => {
  return (
    <div className="w-full bg-midnight-bg border border-midnight-border rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background technical grid markings */}
      <div className="absolute inset-0 bg-[radial-gradient(#17233B_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      {/* Top Sleeve Headers & Symmetry Indicator */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-2 z-10">
        <span className="font-bold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
          {isLegPress45 ? 'Left Horn' : 'Left Sleeve'}
        </span>

        {/* Symmetry & Center Horn Status */}
        <div className="flex items-center gap-2">
          {isLegPress45 && (
            <span className="px-2.5 py-0.5 rounded-full bg-midnight-card border border-neon-cyan/40 text-neon-cyan text-[11px] font-mono font-bold flex items-center gap-1">
              Center Horn
            </span>
          )}

          {isSymmetric ? (
            <span className="px-2.5 py-0.5 rounded-full bg-neon-success/10 text-neon-success border border-neon-success/20 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Balanced {isLegPress45 ? 'Horns' : 'Load'}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-neon-warning/10 text-neon-warning border border-neon-warning/20 text-[11px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Asymmetrical Load
              </span>
              <button
                onClick={onMirrorLeftToRight}
                className="text-[10px] bg-midnight-elevated hover:bg-[#1e2f50] text-neon-cyan px-2 py-0.5 rounded border border-neon-cyan/30 flex items-center gap-1 transition"
                title="Mirror Left to Right to balance bar"
              >
                <ArrowRightLeft className="w-3 h-3" /> Balance L&rarr;R
              </button>
            </div>
          )}
        </div>

        <span className="font-bold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neon-violet shadow-glow-violet" />
          {isLegPress45 ? 'Right Horn' : 'Right Sleeve'}
        </span>
      </div>

      {/* Barbell / Leg Press Graphic Render */}
      <div className="w-full overflow-x-auto py-8 px-2 flex justify-center items-center z-10">
        <div className="min-w-[620px] max-w-full flex items-center justify-center relative">
          
          {/* LEFT SLEEVE & PLATES */}
          <div className="flex items-center justify-end flex-1">
            {/* Plates on left sleeve (rendered inside-out) */}
            <div className="flex items-center justify-end gap-1 px-1">
              {leftPlates.map((plate, index) => {
                const style = getPlateStyle(plate.weight, plate.unit);
                const isKg = plate.unit.toUpperCase() === 'KG';
                return (
                  <button
                    key={plate.id || `left_${index}`}
                    onClick={() => onRemovePlate('left', index)}
                    title={`Left: Click to remove ${plate.weight} ${plate.unit}`}
                    className={`group relative ${style.height} ${style.width} ${style.bg} border ${style.border} rounded-md shadow-lg flex flex-col items-center justify-between py-1 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ${style.ring}`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 text-white">
                      {plate.unit}
                    </span>
                    <span className={`text-[10px] font-extrabold font-mono leading-none rotate-[-90deg] ${isKg ? 'text-slate-950 font-black' : 'text-white'}`}>
                      {plate.weight}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-midnight-bg/80 rounded-md flex items-center justify-center text-white">
                      <Trash2 className="w-3.5 h-3.5 text-neon-error" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Left Bar Collar & Sleeve Base */}
            <div className="w-4 h-14 bg-gradient-to-r from-slate-500 to-slate-400 rounded-l border-y border-l border-slate-300 shadow-inner" />
            <div className="w-2 h-16 bg-gradient-to-r from-slate-400 to-slate-300 rounded-sm border border-slate-200 shadow" />
          </div>

          {/* CENTER SECTION: EITHER 45° LEG PRESS SLED WITH CENTER HORN OR STANDARD BARBELL SHAFT */}
          {isLegPress45 ? (
            <div className="min-w-[190px] sm:min-w-[250px] px-3 py-3 rounded-2xl bg-gradient-to-b from-midnight-elevated via-midnight-card to-midnight-bg border-2 border-slate-600/70 shadow-2xl flex flex-col items-center justify-center relative z-20">
              {/* Sled Top Plate / Rail Label */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-midnight-bg/90 border border-midnight-border text-[9px] font-mono font-black text-neon-cyan tracking-wider mb-2">
                <span>45° LEG PRESS SLED</span>
              </div>

              {/* Center Horn Post & Plates Container */}
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-[9px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> Center Weight Horn
                </span>

                {/* Center Horn Peg Shaft with Stacked Plates */}
                <div className="flex items-center justify-center gap-1 min-h-[56px] px-2 py-1 bg-midnight-bg/80 border border-dashed border-midnight-border rounded-xl w-full">
                  {centerPlates.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => onSelectLoadMode && onSelectLoadMode('center')}
                      className="text-[10px] font-mono text-neon-cyan hover:underline flex items-center gap-1 py-1 px-2"
                      title="Select Center Horn to load plates"
                    >
                      <Plus className="w-3 h-3" /> Add plates to Center Horn
                    </button>
                  ) : (
                    centerPlates.map((plate, index) => {
                      const style = getPlateStyle(plate.weight, plate.unit);
                      const isKg = plate.unit.toUpperCase() === 'KG';
                      return (
                        <button
                          key={plate.id || `center_${index}`}
                          onClick={() => onRemovePlate('center', index)}
                          title={`Center Horn: Click to remove ${plate.weight} ${plate.unit}`}
                          className={`group relative ${style.height} ${style.width} ${style.bg} border ${style.border} rounded-md shadow-lg flex flex-col items-center justify-between py-1 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ${style.ring}`}
                        >
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 text-white">
                            {plate.unit}
                          </span>
                          <span className={`text-[10px] font-extrabold font-mono leading-none rotate-[-90deg] ${isKg ? 'text-slate-950 font-black' : 'text-white'}`}>
                            {plate.weight}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-midnight-bg/80 rounded-md flex items-center justify-center text-white">
                            <Trash2 className="w-3.5 h-3.5 text-neon-error" />
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-40 sm:w-56 h-4 bg-gradient-to-b from-[#94A3B8] via-[#64748B] to-[#334155] border-y border-[#475569] shadow-inner flex items-center justify-center relative">
              {/* Center knurling marking */}
              <div className="px-2 h-3.5 bg-midnight-bg/60 rounded-sm mx-auto flex items-center justify-center">
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-200">
                  {barbellWeight} {barbellUnit}
                </span>
              </div>
            </div>
          )}

          {/* RIGHT SLEEVE & PLATES */}
          <div className="flex items-center justify-start flex-1">
            {/* Right Bar Collar */}
            <div className="w-2 h-16 bg-gradient-to-r from-slate-300 to-slate-400 rounded-sm border border-slate-200 shadow" />
            <div className="w-4 h-14 bg-gradient-to-r from-slate-400 to-slate-500 rounded-r border-y border-r border-slate-300 shadow-inner" />

            {/* Plates on right sleeve */}
            <div className="flex items-center justify-start gap-1 px-1">
              {rightPlates.map((plate, index) => {
                const style = getPlateStyle(plate.weight, plate.unit);
                const isKg = plate.unit.toUpperCase() === 'KG';
                return (
                  <button
                    key={plate.id || `right_${index}`}
                    onClick={() => onRemovePlate('right', index)}
                    title={`Right: Click to remove ${plate.weight} ${plate.unit}`}
                    className={`group relative ${style.height} ${style.width} ${style.bg} border ${style.border} rounded-md shadow-lg flex flex-col items-center justify-between py-1 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ${style.ring}`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 text-white">
                      {plate.unit}
                    </span>
                    <span className={`text-[10px] font-extrabold font-mono leading-none rotate-90 ${isKg ? 'text-slate-950 font-black' : 'text-white'}`}>
                      {plate.weight}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-midnight-bg/80 rounded-md flex items-center justify-center text-white">
                      <Trash2 className="w-3.5 h-3.5 text-neon-error" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 mt-2 text-center z-10">
        {isLegPress45 ? (
          <span className="text-neon-cyan font-semibold">
            &bull; 45° Leg Press &bull; Center Horn
          </span>
        ) : (
          <span className="hidden sm:inline">&bull; Click plate to remove</span>
        )}
      </div>
    </div>
  );
};
