/**
 * PlateSync - Core Weight & Conversion Utility
 * Strict conversion standard: 1 kg = 2.2046226218 lbs
 * Theme: Midnight Neon (KG: Cyan #35D9E8, LB: Violet #A855F7)
 */

export const KG_TO_LBS = 2.2046226218;
export const LBS_TO_KG = 1 / KG_TO_LBS;

/**
 * Standard plate options
 * KG: 2.5 kg up to 30 kg in steps of 2.5 kg
 * LB: 5 lb up to 55 lb in multiples of 5 lb
 */
export const STANDARD_KG_PLATES = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30];
export const FRACTIONAL_KG_PLATES = [1.25, 0.5];

export const STANDARD_LB_PLATES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
export const FRACTIONAL_LB_PLATES = [2.5, 1.25];

/**
 * Standard barbell options
 */
export const BARBELL_PRESETS = [
  { id: 'oly-kg-20', name: 'Olympic Barbell 20 kg', weight: 20, unit: 'KG', isLegPress45: false },
  { id: 'oly-lb-45', name: 'Olympic Barbell 45 lb', weight: 45, unit: 'LB', isLegPress45: false },
  { id: 'oly-kg-15', name: "Women's Olympic Barbell 15 kg", weight: 15, unit: 'KG', isLegPress45: false },
  { id: 'oly-lb-35', name: "Women's Barbell 35 lb", weight: 35, unit: 'LB', isLegPress45: false },
  { id: 'leg-press-45', name: '45-Degree Leg Press', weight: 0, unit: 'KG', isLegPress45: true },
  { id: 'ez-curl', name: 'EZ Curl Bar 10 kg', weight: 10, unit: 'KG', isLegPress45: false },
  { id: 'smith-machine', name: 'Smith Machine Bar 7 kg', weight: 7, unit: 'KG', isLegPress45: false },
  { id: 'custom', name: 'Custom Barbell Weight', weight: 0, unit: 'KG', isLegPress45: false },
];

/**
 * Convert weight value between units
 */
export const convertWeight = (val, fromUnit, toUnit) => {
  const num = Number(val) || 0;
  const from = (fromUnit || 'KG').toUpperCase();
  const to = (toUnit || 'KG').toUpperCase();

  if (from === to) return num;
  if (from === 'KG' && to === 'LB') {
    return num * KG_TO_LBS;
  }
  if (from === 'LB' && to === 'KG') {
    return num * LBS_TO_KG;
  }
  return num;
};

/**
 * Visual styling & height scaling for barbell plates in Midnight Neon
 * KG = Cyan (#35D9E8), LB = Violet (#A855F7)
 */
export const getPlateStyle = (weight, unit) => {
  const isKg = unit.toUpperCase() === 'KG';
  const val = Number(weight);

  if (isKg) {
    // KG Plates (Electric Cyan Gradient Scaling)
    if (val >= 30) return { bg: 'bg-[#35D9E8]', border: 'border-cyan-100', text: 'text-slate-950 font-black', height: 'h-44', width: 'w-8', ring: 'ring-cyan-400/40' };
    if (val >= 27.5) return { bg: 'bg-[#2fc5d3]', border: 'border-cyan-200', text: 'text-slate-950 font-black', height: 'h-42', width: 'w-7.5', ring: 'ring-cyan-400/40' };
    if (val >= 25) return { bg: 'bg-[#2ab8c5]', border: 'border-cyan-200', text: 'text-slate-950 font-black', height: 'h-40', width: 'w-7', ring: 'ring-cyan-400/40' };
    if (val >= 22.5) return { bg: 'bg-[#24aab6]', border: 'border-cyan-300', text: 'text-slate-950 font-black', height: 'h-38', width: 'w-6.5', ring: 'ring-cyan-400/35' };
    if (val >= 20) return { bg: 'bg-[#1f9da8]', border: 'border-cyan-300', text: 'text-slate-950 font-black', height: 'h-36', width: 'w-6', ring: 'ring-cyan-400/35' };
    if (val >= 17.5) return { bg: 'bg-[#1a8f9a]', border: 'border-cyan-400', text: 'text-white font-bold', height: 'h-34', width: 'w-5.5', ring: 'ring-cyan-500/30' };
    if (val >= 15) return { bg: 'bg-[#16828d]', border: 'border-cyan-400', text: 'text-white font-bold', height: 'h-32', width: 'w-5', ring: 'ring-cyan-500/30' };
    if (val >= 12.5) return { bg: 'bg-[#12757f]', border: 'border-cyan-500', text: 'text-white font-bold', height: 'h-30', width: 'w-4.5', ring: 'ring-cyan-500/30' };
    if (val >= 10) return { bg: 'bg-[#0f6871]', border: 'border-cyan-500', text: 'text-white font-bold', height: 'h-28', width: 'w-4.5', ring: 'ring-cyan-500/30' };
    if (val >= 7.5) return { bg: 'bg-[#0d5b63]', border: 'border-cyan-600', text: 'text-cyan-100 font-bold', height: 'h-26', width: 'w-4', ring: 'ring-cyan-600/30' };
    if (val >= 5) return { bg: 'bg-[#0a4e55]', border: 'border-cyan-600', text: 'text-cyan-100 font-bold', height: 'h-24', width: 'w-4', ring: 'ring-cyan-600/30' };
    if (val >= 2.5) return { bg: 'bg-[#084147]', border: 'border-cyan-700', text: 'text-cyan-200 font-bold', height: 'h-20', width: 'w-3.5', ring: 'ring-cyan-700/30' };
    return { bg: 'bg-[#063439]', border: 'border-cyan-800', text: 'text-cyan-300 font-bold', height: 'h-16', width: 'w-3', ring: 'ring-cyan-800/30' };
  } else {
    // LB Plates (Electric Violet Gradient Scaling)
    if (val >= 55) return { bg: 'bg-[#A855F7]', border: 'border-purple-200', text: 'text-white font-black', height: 'h-44', width: 'w-8', ring: 'ring-purple-400/40' };
    if (val >= 50) return { bg: 'bg-[#9e46ea]', border: 'border-purple-300', text: 'text-white font-black', height: 'h-42', width: 'w-7.5', ring: 'ring-purple-400/40' };
    if (val >= 45) return { bg: 'bg-[#9333ea]', border: 'border-purple-300', text: 'text-white font-black', height: 'h-40', width: 'w-7', ring: 'ring-purple-400/35' };
    if (val >= 40) return { bg: 'bg-[#892de0]', border: 'border-purple-400', text: 'text-white font-bold', height: 'h-38', width: 'w-6.5', ring: 'ring-purple-400/35' };
    if (val >= 35) return { bg: 'bg-[#7e22ce]', border: 'border-purple-400', text: 'text-purple-100 font-bold', height: 'h-36', width: 'w-6', ring: 'ring-purple-500/30' };
    if (val >= 30) return { bg: 'bg-[#731dc2]', border: 'border-purple-500', text: 'text-purple-100 font-bold', height: 'h-34', width: 'w-5.5', ring: 'ring-purple-500/30' };
    if (val >= 25) return { bg: 'bg-[#6b21a8]', border: 'border-purple-500', text: 'text-purple-200 font-bold', height: 'h-30', width: 'w-5', ring: 'ring-purple-500/30' };
    if (val >= 20) return { bg: 'bg-[#5f1d96]', border: 'border-purple-600', text: 'text-purple-200 font-bold', height: 'h-28', width: 'w-4.5', ring: 'ring-purple-600/30' };
    if (val >= 15) return { bg: 'bg-[#581c87]', border: 'border-purple-600', text: 'text-purple-200 font-bold', height: 'h-26', width: 'w-4', ring: 'ring-purple-600/30' };
    if (val >= 10) return { bg: 'bg-[#4c1975]', border: 'border-purple-700', text: 'text-purple-300 font-bold', height: 'h-24', width: 'w-4', ring: 'ring-purple-700/30' };
    if (val >= 5) return { bg: 'bg-[#44176d]', border: 'border-purple-700', text: 'text-purple-300 font-bold', height: 'h-20', width: 'w-3.5', ring: 'ring-purple-700/30' };
    return { bg: 'bg-[#321251]', border: 'border-purple-800', text: 'text-purple-300 font-bold', height: 'h-16', width: 'w-3', ring: 'ring-purple-800/30' };
  }
};

/**
 * Calculate weight for an array of plates
 */
export const calculateSideWeight = (plates = []) => {
  let totalKg = 0;
  let totalLbs = 0;

  for (const plate of plates) {
    const w = Number(plate.weight) || 0;
    const u = (plate.unit || 'KG').toUpperCase();

    if (u === 'KG') {
      totalKg += w;
      totalLbs += w * KG_TO_LBS;
    } else {
      totalLbs += w;
      totalKg += w * LBS_TO_KG;
    }
  }

  return {
    kg: totalKg,
    lbs: totalLbs,
    count: plates.length,
  };
};

/**
 * Total weight = Barbell weight + Left-side plates + Right-side plates + Center horn plates
 * In 45-Degree Leg Press mode, sled weight is strictly excluded (sled = 0)
 * Many 45-degree leg press machines feature a middle/center horn for additional plate capacity
 */
export const calculateTotalWeight = (
  barbellWeight = 20,
  barbellUnit = 'KG',
  leftPlates = [],
  rightPlates = [],
  isLegPress45 = false,
  centerPlates = []
) => {
  const bWeight = isLegPress45 ? 0 : (Number(barbellWeight) || 0);
  const bUnit = (barbellUnit || 'KG').toUpperCase();

  const barbellKg = bUnit === 'KG' ? bWeight : bWeight * LBS_TO_KG;
  const barbellLbs = bUnit === 'LB' ? bWeight : bWeight * KG_TO_LBS;

  const left = calculateSideWeight(leftPlates);
  const right = calculateSideWeight(rightPlates);
  const center = calculateSideWeight(centerPlates);

  const totalKg = (isLegPress45 ? 0 : barbellKg) + left.kg + right.kg + center.kg;
  const totalLbs = (isLegPress45 ? 0 : barbellLbs) + left.lbs + right.lbs + center.lbs;

  const isSymmetric = Math.abs(left.kg - right.kg) < 0.01;

  return {
    totalKg,
    totalLbs,
    leftWeightKg: left.kg,
    leftWeightLbs: left.lbs,
    rightWeightKg: right.kg,
    rightWeightLbs: right.lbs,
    centerWeightKg: center.kg,
    centerWeightLbs: center.lbs,
    totalPlateWeightKg: left.kg + right.kg + center.kg,
    totalPlateWeightLbs: left.lbs + right.lbs + center.lbs,
    barbellKg: isLegPress45 ? 0 : barbellKg,
    barbellLbs: isLegPress45 ? 0 : barbellLbs,
    barbellWeight: isLegPress45 ? 0 : bWeight,
    barbellUnit: bUnit,
    isLegPress45: Boolean(isLegPress45),
    isSymmetric,
    totalPlatesCount: leftPlates.length + rightPlates.length + centerPlates.length,
    centerPlatesCount: centerPlates.length,
  };
};

export const formatWeight = (value, unit = 'KG', decimals = 2) => {
  const num = Number(value);
  if (isNaN(num)) return `0 ${unit}`;
  return `${parseFloat(num.toFixed(decimals))} ${unit}`;
};

/**
 * Auto Plate Solver:
 * Calculates optimal plate combinations to load on each sleeve/horn to achieve target weight.
 */
export const solvePlateCombination = ({
  targetWeight,
  targetUnit = 'KG',
  barbellWeight = 20,
  barbellUnit = 'KG',
  isLegPress45 = false,
  plateUnit = 'KG',
  maxPlateWeight = null,
  allowFractional = true,
  availablePlates = null
}) => {
  const target = Number(targetWeight);
  if (isNaN(target) || target <= 0) {
    return {
      isValid: false,
      error: 'Enter a valid target weight greater than 0'
    };
  }

  const effectiveBarWeight = isLegPress45 ? 0 : (Number(barbellWeight) || 0);
  const barKg = barbellUnit.toUpperCase() === 'KG' ? effectiveBarWeight : effectiveBarWeight * LBS_TO_KG;
  const barInTargetUnit = targetUnit.toUpperCase() === 'KG' ? barKg : barKg * KG_TO_LBS;

  if (target < barInTargetUnit && !isLegPress45) {
    return {
      isValid: false,
      error: `Target weight cannot be less than barbell weight (${effectiveBarWeight} ${barbellUnit})`
    };
  }

  const totalPlatesWeightInTarget = Math.max(0, target - barInTargetUnit);
  const perSideInTarget = totalPlatesWeightInTarget / 2;

  // Convert needed per side to plateUnit
  const perSideInPlateUnit = (plateUnit.toUpperCase() === targetUnit.toUpperCase())
    ? perSideInTarget
    : (plateUnit.toUpperCase() === 'KG' ? perSideInTarget * LBS_TO_KG : perSideInTarget * KG_TO_LBS);

  // Available plates
  let plates = availablePlates;
  if (!plates || !Array.isArray(plates)) {
    if (plateUnit.toUpperCase() === 'KG') {
      plates = [...STANDARD_KG_PLATES];
      if (allowFractional) plates.push(...FRACTIONAL_KG_PLATES);
    } else {
      plates = [...STANDARD_LB_PLATES];
      if (allowFractional) plates.push(...FRACTIONAL_LB_PLATES);
    }
  }

  if (maxPlateWeight && Number(maxPlateWeight) > 0) {
    plates = plates.filter(p => p <= Number(maxPlateWeight));
  }

  // Deduplicate and sort descending
  const uniquePlates = Array.from(new Set(plates)).sort((a, b) => b - a);

  let remaining = Math.round(perSideInPlateUnit * 1000) / 1000;
  const platesPerSide = [];
  const flatPlatesPerSide = [];

  for (const p of uniquePlates) {
    if (p <= 0) continue;
    const count = Math.floor((remaining + 0.0001) / p);
    if (count > 0) {
      platesPerSide.push({ weight: p, count, unit: plateUnit.toUpperCase() });
      for (let i = 0; i < count; i++) {
        flatPlatesPerSide.push({ weight: p, unit: plateUnit.toUpperCase() });
      }
      remaining = Math.round((remaining - count * p) * 1000) / 1000;
    }
  }

  const achievedPerSideInPlateUnit = platesPerSide.reduce((sum, item) => sum + item.weight * item.count, 0);
  const totalPlateWeightInPlateUnit = achievedPerSideInPlateUnit * 2;

  const totalPlateWeightInTarget = (plateUnit.toUpperCase() === targetUnit.toUpperCase())
    ? totalPlateWeightInPlateUnit
    : (targetUnit.toUpperCase() === 'KG' ? totalPlateWeightInPlateUnit * LBS_TO_KG : totalPlateWeightInPlateUnit * KG_TO_LBS);

  const achievedTotalWeight = barInTargetUnit + totalPlateWeightInTarget;
  const difference = Math.round((target - achievedTotalWeight) * 100) / 100;
  const isExact = Math.abs(difference) < 0.05;

  return {
    isValid: true,
    targetWeight: target,
    targetUnit: targetUnit.toUpperCase(),
    barbellWeight: effectiveBarWeight,
    barbellUnit: barbellUnit.toUpperCase(),
    isLegPress45: Boolean(isLegPress45),
    plateUnit: plateUnit.toUpperCase(),
    platesPerSide,
    flatPlatesPerSide,
    weightPerSideNeeded: Math.round(perSideInPlateUnit * 100) / 100,
    weightPerSideAchieved: Math.round(achievedPerSideInPlateUnit * 100) / 100,
    totalPlateWeightAchieved: Math.round(totalPlateWeightInPlateUnit * 100) / 100,
    achievedTotalWeight: Math.round(achievedTotalWeight * 100) / 100,
    difference,
    isExact,
    totalPlatesCount: flatPlatesPerSide.length * 2
  };
};
