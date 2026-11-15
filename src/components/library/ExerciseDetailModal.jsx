import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Plus, 
  Languages, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Shield,
  Dumbbell,
  Target,
  Activity,
  Star,
  Zap,
  Repeat,
  CalendarPlus,
  Compass
} from 'lucide-react';
import { translateExerciseGuide } from '../../services/translation/translationService';

export const ExerciseDetailModal = ({
  exercise,
  isOpen,
  onClose,
  onAddToWorkout,
  onAddToPlanner,
  isFavorite = false,
  onToggleFavorite = null
}) => {
  const [isHindi, setIsHindi] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  const isLegPress45 = Boolean(
    exercise.isLegPress45 ||
    /45.*leg\s*press/i.test(exercise.name) ||
    /leg\s*press.*45/i.test(exercise.name)
  );

  const guide = isHindi ? translateExerciseGuide(exercise) : null;

  // Safe Movement Pattern
  const movementPattern = exercise.movementPattern || exercise.pattern || exercise.movement_pattern || (exercise.type ? `${exercise.type} Movement` : 'Compound Movement');

  // Primary & Secondary muscles targeted
  const primaryMuscles = Array.isArray(exercise.primaryMuscles) && exercise.primaryMuscles.length > 0
    ? exercise.primaryMuscles
    : [exercise.subgroup || exercise.muscle];

  const secondaryMuscles = Array.isArray(exercise.secondaryMuscles) && exercise.secondaryMuscles.length > 0
    ? exercise.secondaryMuscles
    : [];

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] w-screen h-[100dvh] overflow-y-auto bg-midnight-bg/90 backdrop-blur-md p-2.5 sm:p-4 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl my-auto bg-midnight-card border border-midnight-border rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88dvh] sm:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header (pinned top) */}
        <div className="p-4 sm:p-6 border-b border-midnight-border flex items-start justify-between gap-4 bg-midnight-card shrink-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Meta Tags: Main Group, Subgroup, Equipment, Difficulty, Compound/Isolation */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Main Muscle Group */}
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 uppercase tracking-wider">
                {isHindi ? (guide?.muscleHindi || exercise.muscle) : exercise.muscle}
              </span>

              {/* Subgroup / Muscle Region */}
              {exercise.subgroup && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neon-violet/15 text-neon-violet border border-neon-violet/30">
                  {isHindi ? (guide?.subgroupHindi || exercise.subgroup) : exercise.subgroup}
                </span>
              )}

              {/* Movement Pattern Tag */}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-midnight-elevated text-slate-200 border border-slate-700 flex items-center gap-1">
                <Activity className="w-3 h-3 text-neon-cyan" />
                <span>{isHindi ? (guide?.movementPatternHindi || movementPattern) : movementPattern}</span>
              </span>

              <span className="text-slate-500 text-xs hidden sm:inline">&bull;</span>
              
              {/* Equipment */}
              <span className="text-[11px] text-slate-300 font-mono hidden sm:flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-slate-400" />
                {isHindi ? (guide?.equipmentHindi || exercise.equipment) : exercise.equipment}
              </span>

              <span className="text-slate-500 text-xs hidden sm:inline">&bull;</span>

              {/* Difficulty */}
              <span className="text-[11px] text-neon-gold font-bold hidden sm:inline">
                {isHindi ? (guide?.difficultyHindi || exercise.difficulty) : exercise.difficulty}
              </span>
            </div>

            {/* Exercise Title */}
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug">
              {isHindi && guide?.nameHindi ? (
                <>
                  <span>{guide.nameHindi}</span>
                  <span className="text-xs font-normal text-slate-400 ml-2">({exercise.name})</span>
                </>
              ) : (
                exercise.name
              )}
            </h3>
          </div>

          {/* Action buttons: Favorite, Hindi Toggle & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(exercise.id)}
                className={`p-2 rounded-xl border transition active:scale-95 ${
                  isFavorite
                    ? 'bg-amber-400/20 text-amber-400 border-amber-400/40 shadow-sm shadow-amber-400/20'
                    : 'bg-midnight-elevated text-slate-400 hover:text-amber-400 border-midnight-border hover:border-amber-400/30'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Dedicated Hindi / English Toggle Button */}
            <button
              type="button"
              onClick={() => setIsHindi(!isHindi)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border active:scale-95 ${
                isHindi
                  ? 'bg-neon-cyan text-slate-950 border-neon-cyan shadow-md shadow-neon-cyan/30'
                  : 'bg-midnight-elevated text-neon-cyan border-neon-cyan/30 hover:bg-[#1e2f50]'
              }`}
              title="Toggle Devanagari Hindi / English Translation"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isHindi ? 'English' : 'Hindi'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-midnight-elevated transition"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 overscroll-contain">
          
          {/* Movement Pattern & Biomechanical Classification Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-midnight-bg border border-neon-cyan/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-neon-cyan" />
                <span>{isHindi ? 'मूवमेंट पैटर्न एवं बायोमैकेनिक्स' : 'Movement Pattern & Mechanics'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 text-[10px] font-mono font-bold">
                {isHindi ? (guide?.movementPatternHindi || movementPattern) : movementPattern}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-midnight-card border border-midnight-border">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Pattern</span>
                <span className="font-bold text-white text-xs truncate block">{movementPattern}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-card border border-midnight-border">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Mechanics</span>
                <span className="font-bold text-neon-cyan text-xs truncate block">{exercise.type || 'Compound'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-card border border-midnight-border">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Equipment</span>
                <span className="font-bold text-slate-200 text-xs truncate block">{exercise.equipment}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-card border border-midnight-border">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Difficulty</span>
                <span className="font-bold text-neon-gold text-xs truncate block">{exercise.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Target Muscle Anatomical Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
            {/* Primary Target */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-neon-cyan tracking-wider flex items-center gap-1">
                <Target className="w-3 h-3 text-neon-cyan" />
                {isHindi ? 'प्राथमिक मांसपेशियां (Primary Muscles):' : 'Primary Target Muscles:'}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {primaryMuscles.map((pm, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan font-bold text-[11px]">
                    {pm}
                  </span>
                ))}
              </div>
            </div>

            {/* Secondary Synergy */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-neon-violet" />
                {isHindi ? 'सहायक मांसपेशियां (Secondary / Synergists):' : 'Secondary / Synergist Muscles:'}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {secondaryMuscles.length > 0 ? (
                  secondaryMuscles.map((sm, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-midnight-elevated border border-midnight-border text-slate-300 text-[11px]">
                      {sm}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px] italic">
                    {isHindi ? 'प्रत्यक्ष पृथक्करण (Direct Isolation)' : 'Direct targeted isolation'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 45-Degree Leg Press Sled Notice */}
          {isLegPress45 && (
            <div className="p-3.5 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-xs">
                <Info className="w-4 h-4 text-neon-cyan shrink-0" />
                <span>45-Degree Leg Press Sled Weight Excluded</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHindi 
                  ? '45-डिग्री लेग प्रेस मोड: स्लेड का वजन शामिल नहीं किया जाता है (स्लेड = 0 kg)। गणना केवल दोनों तरफ लोडेड प्लेट्स पर आधारित होती है।'
                  : '45-Degree Leg Press mode: Sled weight is excluded (Sled = 0 kg). Calculation includes loaded plates only.'}
              </p>
            </div>
          )}

          {/* Starting Position */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neon-cyan flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'शुरुआती स्थिति (Starting Position):' : 'Starting Position:'}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs bg-midnight-bg p-3.5 rounded-xl border border-midnight-border">
              {isHindi ? (guide?.startingPosition || exercise.startingPosition) : exercise.startingPosition}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-neon-success" />
              <span>{isHindi ? 'चरण-दर-चरण निर्देश (Step-by-Step Instructions):' : 'Step-by-Step Instructions:'}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs bg-midnight-bg p-3.5 rounded-xl border border-midnight-border">
              {isHindi ? (guide?.instructions || exercise.instructions) : exercise.instructions}
            </p>
          </div>

          {/* Technique & Breathing Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
              <h5 className="font-bold text-neon-cyan text-xs">
                {isHindi ? 'उचित तकनीक एवं टिप्स (Proper Technique Tips):' : 'Practical Technique Tips:'}
              </h5>
              <p className="text-slate-300 text-xs leading-relaxed mt-1">
                {isHindi ? (guide?.technique || exercise.technique) : exercise.technique}
              </p>
            </div>

            <div className="space-y-1 p-3.5 rounded-2xl bg-midnight-bg border border-midnight-border">
              <h5 className="font-bold text-neon-violet text-xs">
                {isHindi ? 'श्वास निर्देश (Correct Breathing Technique):' : 'Correct Breathing Technique:'}
              </h5>
              <p className="text-slate-300 text-xs leading-relaxed mt-1">
                {isHindi ? (guide?.breathing || exercise.breathing) : exercise.breathing}
              </p>
            </div>
          </div>

          {/* Common Mistakes */}
          {((isHindi ? guide?.commonMistakes : exercise.commonMistakes) || []).length > 0 && (
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-rose-500/5 border border-neon-error/20">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-neon-error" />
                <span>{isHindi ? 'सामान्य गलतियाँ (Common Mistakes to Avoid):' : 'Common Mistakes to Avoid:'}</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                {(isHindi ? guide.commonMistakes : exercise.commonMistakes).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Precautions */}
          {(exercise.safetyNotes || guide?.safetyNotes) && (
            <div className="space-y-1 p-3 rounded-xl bg-midnight-elevated border border-midnight-border">
              <h5 className="font-bold text-neon-warning flex items-center gap-1.5 text-[11px]">
                <Shield className="w-3 h-3 text-neon-warning" />
                <span>{isHindi ? 'सुरक्षा सावधानियां (Safety Precautions):' : 'Safety Precautions:'}</span>
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                {isHindi ? (guide?.safetyNotes || exercise.safetyNotes) : exercise.safetyNotes}
              </p>
            </div>
          )}

          {/* Recommendations & Alternatives */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-midnight-border text-xs">
            <div className="text-slate-300 font-mono">
              Sets: <strong className="text-white">{exercise.recommendedSets || '3-4'}</strong> &bull; Reps: <strong className="text-white">{exercise.recommendedReps || '8-12'}</strong> &bull; Rest: <strong className="text-neon-cyan">{exercise.recommendedRest || 90}s</strong>
            </div>

            {exercise.alternatives && exercise.alternatives.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-slate-400" />
                  {isHindi ? 'विकल्प (Alternatives):' : 'Alternatives:'}
                </span>
                {exercise.alternatives.map((alt, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-midnight-elevated border border-midnight-border text-slate-200 text-[11px]">
                    {alt}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer CTA (pinned bottom) */}
        <div className="p-4 border-t border-midnight-border flex items-center justify-between gap-3 bg-midnight-card shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            {isHindi ? 'बंद करें (Close)' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            {onAddToPlanner && (
              <button
                type="button"
                onClick={() => onAddToPlanner(exercise)}
                className="px-4 py-2.5 bg-midnight-elevated hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-sm"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{isHindi ? 'साप्ताहिक योजना में जोड़ें' : 'Add to Plan'}</span>
              </button>
            )}

            {onAddToWorkout && (
              <button
                type="button"
                onClick={() => {
                  onAddToWorkout(exercise);
                  onClose();
                }}
                className="px-5 py-2.5 bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-neon-cyan/25 flex items-center gap-2 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? 'वर्कआउट में जोड़ें' : 'Add to Workout'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
