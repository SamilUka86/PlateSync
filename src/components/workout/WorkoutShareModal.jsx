import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Calendar, 
  Clock, 
  Flame, 
  Dumbbell, 
  Sparkles,
  Zap
} from 'lucide-react';
import { KG_TO_LBS } from '../../utils/weightCalculations';

export const WorkoutShareModal = ({
  workout,
  isOpen,
  onClose,
  addNotification
}) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!isOpen || !workout) return null;

  const durationMin = Math.round((workout.duration || 3600) / 60);
  const dateStr = new Date(workout.date || workout.completedAt || Date.now()).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const totalVolumeKg = Math.round(workout.totalVolumeKg || workout.totalVolume || 0);
  const totalVolumeLbs = Math.round(workout.totalVolumeLbs || (totalVolumeKg * KG_TO_LBS));
  const totalSets = workout.totalSets || workout.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0) || 0;
  const totalReps = workout.totalReps || workout.exercises?.reduce((acc, ex) => acc + (ex.sets?.reduce((rAcc, s) => rAcc + (Number(s.reps) || 0), 0) || 0), 0) || 0;

  // Extract PRs or top sets
  const prList = [];
  const topExercises = [];

  workout.exercises?.forEach(ex => {
    let topWeight = 0;
    let topUnit = 'KG';
    let topReps = 0;

    ex.sets?.forEach(s => {
      const w = Number(s.weight) || 0;
      if (s.isPR) {
        prList.push({ exercise: ex.name, weight: w, unit: s.unit || 'KG', reps: s.reps });
      }
      if (w > topWeight) {
        topWeight = w;
        topUnit = s.unit || 'KG';
        topReps = s.reps;
      }
    });

    if (topWeight > 0) {
      topExercises.push({ name: ex.name, weight: topWeight, unit: topUnit, reps: topReps });
    }
  });

  // Generate plain text summary for clipboard
  const generateTextSummary = () => {
    let text = `⚡ PlateSync Workout Summary\n`;
    text += `🏋️ ${workout.workoutName || 'Strength Session'}\n`;
    text += `📅 ${dateStr} • ⏱️ ${durationMin} min\n`;
    text += `📊 Total Volume: ${totalVolumeKg.toLocaleString()} KG (${totalVolumeLbs.toLocaleString()} LB)\n`;
    text += `🔥 ${totalSets} sets • ${totalReps} total reps\n\n`;

    if (prList.length > 0) {
      text += `🏆 PRs Hit:\n`;
      prList.forEach(pr => {
        text += `• ${pr.exercise}: ${pr.weight} ${pr.unit} × ${pr.reps} reps\n`;
      });
      text += `\n`;
    }

    if (topExercises.length > 0) {
      text += `Top Lifts:\n`;
      topExercises.slice(0, 4).forEach(t => {
        text += `• ${t.name}: ${t.weight} ${t.unit} × ${t.reps}\n`;
      });
    }

    text += `\nCalculated & Tracked with PlateSync`;
    return text;
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    const text = generateTextSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (addNotification) addNotification('Workout summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2200);
  };

  // Native share sheet if supported
  const handleNativeShare = async () => {
    const text = generateTextSummary();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PlateSync: ${workout.workoutName}`,
          text: text
        });
        if (addNotification) addNotification('Shared successfully!', 'success');
      } catch (err) {
        // User cancelled or aborted
      }
    } else {
      handleCopyText();
    }
  };

  // Render high-res Canvas card and download PNG
  const handleDownloadImage = () => {
    setIsGeneratingImage(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGeneratingImage(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient: #080D1B to #111A2E
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#080D1B');
    bgGrad.addColorStop(0.5, '#0D1425');
    bgGrad.addColorStop(1, '#111A2E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative ambient circles
    ctx.save();
    ctx.beginPath();
    ctx.arc(width - 150, 150, 300, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(53, 217, 232, 0.08)'; // Cyan glow
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, height - 150, 350, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'; // Violet glow
    ctx.fill();
    ctx.restore();

    // Outer Border
    ctx.strokeStyle = '#26334D';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Header: PlateSync Branding
    ctx.fillStyle = '#35D9E8';
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillText('PLATESYNC', 80, 110);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 18px "Segoe UI", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('SMART WORKOUT TRACKING & WEIGHT CALCULATION', 80, 142);

    // Divider Line
    const lineGrad = ctx.createLinearGradient(80, 0, width - 80, 0);
    lineGrad.addColorStop(0, '#35D9E8');
    lineGrad.addColorStop(0.5, '#A855F7');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 175);
    ctx.lineTo(width - 80, 175);
    ctx.stroke();

    // Workout Title
    ctx.fillStyle = '#F1F5F9';
    ctx.font = '900 52px "Segoe UI", sans-serif';
    const titleText = workout.workoutName || 'Strength Training Session';
    ctx.fillText(titleText, 80, 255);

    // Date & Duration Subheading
    ctx.fillStyle = '#35D9E8';
    ctx.font = '700 24px "Segoe UI", monospace';
    ctx.fillText(`${dateStr.toUpperCase()}  •  ${durationMin} MIN DURATION`, 80, 305);

    // Big Stats Panel
    const panelY = 360;
    const panelHeight = 260;
    ctx.fillStyle = '#17233B';
    ctx.fillRect(80, panelY, width - 160, panelHeight);
    ctx.strokeStyle = '#26334D';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, panelY, width - 160, panelHeight);

    // Stat 1: Total Volume
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 18px "Segoe UI", sans-serif';
    ctx.fillText('TOTAL VOLUME LIFTED', 120, panelY + 60);

    ctx.fillStyle = '#35D9E8';
    ctx.font = '900 64px "Segoe UI", monospace';
    ctx.fillText(`${totalVolumeKg.toLocaleString()} KG`, 120, panelY + 135);

    ctx.fillStyle = '#A855F7';
    ctx.font = '700 24px "Segoe UI", monospace';
    ctx.fillText(`(${totalVolumeLbs.toLocaleString()} LB)`, 120, panelY + 185);

    // Stat 2: Total Sets & Reps
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 18px "Segoe UI", sans-serif';
    ctx.fillText('SETS & REPS', 680, panelY + 60);

    ctx.fillStyle = '#F1F5F9';
    ctx.font = '900 56px "Segoe UI", monospace';
    ctx.fillText(`${totalSets} SETS`, 680, panelY + 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 24px "Segoe UI", monospace';
    ctx.fillText(`${totalReps} TOTAL REPS`, 680, panelY + 180);

    // PR Achievement Banner (if PRs hit)
    let currentY = panelY + panelHeight + 40;
    if (prList.length > 0) {
      ctx.fillStyle = 'rgba(245, 196, 81, 0.15)';
      ctx.fillRect(80, currentY, width - 160, 90);
      ctx.strokeStyle = '#F5C451';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, currentY, width - 160, 90);

      ctx.fillStyle = '#F5C451';
      ctx.font = '900 24px "Segoe UI", sans-serif';
      ctx.fillText('🏆 PERSONAL RECORD ACHIEVED', 120, currentY + 40);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 22px "Segoe UI", monospace';
      const prText = `${prList[0].exercise}: ${prList[0].weight} ${prList[0].unit} × ${prList[0].reps} reps`;
      ctx.fillText(prText, 120, currentY + 70);

      currentY += 120;
    }

    // Top Exercises Section
    ctx.fillStyle = '#F1F5F9';
    ctx.font = '900 28px "Segoe UI", sans-serif';
    ctx.fillText('KEY LIFTS & PROGRESSION', 80, currentY + 30);
    currentY += 60;

    const displayExercises = topExercises.slice(0, 5);
    displayExercises.forEach((ex, idx) => {
      ctx.fillStyle = '#111A2E';
      ctx.fillRect(80, currentY, width - 160, 65);
      ctx.strokeStyle = '#26334D';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(80, currentY, width - 160, 65);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 22px "Segoe UI", sans-serif';
      ctx.fillText(ex.name, 110, currentY + 40);

      ctx.fillStyle = '#35D9E8';
      ctx.font = '900 24px "Segoe UI", monospace';
      const weightText = `${ex.weight} ${ex.unit} × ${ex.reps}`;
      ctx.fillText(weightText, width - 260, currentY + 40);

      currentY += 80;
    });

    // Footer Watermark
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 18px "Segoe UI", sans-serif';
    ctx.fillText('Tracked with PlateSync • Exact Barbell & Plate Math', 80, height - 70);

    ctx.fillStyle = '#35D9E8';
    ctx.font = '900 20px "Segoe UI", sans-serif';
    ctx.fillText('platesync.app', width - 220, height - 70);

    // Export image download
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PlateSync-${(workout.workoutName || 'Workout').replace(/\s+/g, '_')}-${dateStr.replace(/[\s,]+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      if (addNotification) addNotification('Workout card saved as image!', 'success');
    } catch (e) {
      if (addNotification) addNotification('Could not export image in this browser.', 'error');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-bg/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      {/* Offscreen Canvas used for crisp image generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="w-full max-w-lg bg-midnight-card border border-midnight-border rounded-3xl p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-midnight-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Workout Summary Card</h3>
              <p className="text-[11px] text-slate-400">Share your achievements and lifting volume</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-midnight-bg border border-midnight-border text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Visual Card Preview */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-b from-midnight-elevated via-midnight-card to-midnight-bg border-2 border-midnight-border relative overflow-hidden shadow-inner">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-violet/10 rounded-full blur-3xl pointer-events-none" />

          {/* PlateSync Brand Watermark */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1.5 font-black text-neon-cyan tracking-wider font-mono">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>PLATESYNC</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono">
              {dateStr}
            </span>
          </div>

          {/* Workout Title & Duration */}
          <div className="space-y-1 mb-4">
            <h4 className="text-lg font-black text-white leading-tight">
              {workout.workoutName || 'Strength Session'}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neon-cyan" /> {durationMin} min
              </span>
              <span>&bull;</span>
              <span>{totalSets} sets</span>
              <span>&bull;</span>
              <span>{totalReps} reps</span>
            </div>
          </div>

          {/* Total Volume Stat Card */}
          <div className="p-3.5 rounded-xl bg-midnight-bg border border-midnight-border mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Volume
              </span>
              <span className="text-2xl font-black font-mono text-neon-cyan block">
                {totalVolumeKg.toLocaleString()} KG
              </span>
              <span className="text-xs text-neon-violet font-mono font-semibold">
                {totalVolumeLbs.toLocaleString()} LB
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Intensity
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold font-mono">
                <Flame className="w-3 h-3" /> Heavy
              </span>
            </div>
          </div>

          {/* PR Banner if achieved */}
          {prList.length > 0 && (
            <div className="mb-3 p-2.5 rounded-xl bg-neon-gold/10 border border-neon-gold/30 text-neon-gold flex items-center gap-2 text-xs font-bold">
              <Trophy className="w-4 h-4 shrink-0 text-neon-gold" />
              <div className="truncate">
                <span>PR: {prList[0].exercise} — {prList[0].weight} {prList[0].unit} × {prList[0].reps}</span>
              </div>
            </div>
          )}

          {/* Top Exercises */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Top Lifts
            </span>
            {topExercises.slice(0, 3).map((ex, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-midnight-bg/80 border border-midnight-border/60"
              >
                <span className="text-slate-200 font-medium truncate max-w-[200px]">
                  {ex.name}
                </span>
                <span className="font-mono font-bold text-neon-cyan">
                  {ex.weight} {ex.unit} &times; {ex.reps}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-midnight-border/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>platesync.app</span>
            <span>Smart Lifting Platform</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
          {/* Download Image Button */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neon-cyan hover:bg-[#29bfcd] text-slate-950 transition active:scale-95 shadow-lg shadow-neon-cyan/20"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingImage ? 'Saving...' : 'Save Image'}</span>
          </button>

          {/* Copy Text Summary */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-slate-200 hover:text-white transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-neon-success" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {/* Native Share / Direct Share */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-midnight-bg hover:bg-midnight-elevated border border-midnight-border text-neon-cyan hover:border-neon-cyan/40 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

      </div>
    </div>
  );
};
