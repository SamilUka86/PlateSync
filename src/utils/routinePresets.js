/**
 * PlateSync - Weekly Routine Presets & Data Structures
 * Mon - Sun workout scheduling with full mixed-unit and exercise integration
 */

export const DAYS_OF_WEEK = [
  { key: 'monday', name: 'Monday', short: 'Mon' },
  { key: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { key: 'thursday', name: 'Thursday', short: 'Thu' },
  { key: 'friday', name: 'Friday', short: 'Fri' },
  { key: 'saturday', name: 'Saturday', short: 'Sat' },
  { key: 'sunday', name: 'Sunday', short: 'Sun' }
];

export const DEFAULT_WEEKLY_ROUTINE = {
  monday: {
    id: 'monday',
    dayName: 'Monday',
    shortName: 'Mon',
    isRestDay: false,
    title: 'Push • Chest, Shoulders & Triceps',
    focus: 'Hypertrophy & Strength',
    targetDuration: 60,
    exercises: [
      {
        id: 'plan_mon_1',
        exerciseId: 'flat-barbell-bench-press',
        name: 'Flat Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '6-8',
        targetWeight: 80,
        unit: 'KG',
        notes: '2-3 min rest between heavy working sets'
      },
      {
        id: 'plan_mon_2',
        exerciseId: 'incline-barbell-bench-press',
        name: 'Incline Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 65,
        unit: 'KG',
        notes: 'Set incline angle at 30-45 degrees'
      },
      {
        id: 'plan_mon_3',
        exerciseId: 'standing-overhead-barbell-press',
        name: 'Standing Overhead Barbell Press',
        muscle: 'Shoulders',
        category: 'Shoulders',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 45,
        unit: 'KG',
        notes: 'Brace core and lock out elbows overhead'
      },
      {
        id: 'plan_mon_4',
        exerciseId: 'dips-chest-triceps',
        name: 'Chest & Tricep Dips',
        muscle: 'Triceps',
        category: 'Triceps',
        equipment: 'Bodyweight',
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 0,
        unit: 'KG',
        notes: 'Lean forward slightly to engage lower pecs'
      }
    ]
  },
  tuesday: {
    id: 'tuesday',
    dayName: 'Tuesday',
    shortName: 'Tue',
    isRestDay: false,
    title: 'Pull • Back & Biceps',
    focus: 'Back Thickness & Lat Width',
    targetDuration: 60,
    exercises: [
      {
        id: 'plan_tue_1',
        exerciseId: 'barbell-bent-over-row',
        name: 'Barbell Bent Over Row',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '8-10',
        targetWeight: 70,
        unit: 'KG',
        notes: 'Pull to lower sternum, squeeze shoulder blades'
      },
      {
        id: 'plan_tue_2',
        exerciseId: 'lat-pulldown-wide-grip',
        name: 'Lat Pulldown (Wide Grip)',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Cable Machine',
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 55,
        unit: 'KG',
        notes: 'Control eccentric return'
      },
      {
        id: 'plan_tue_3',
        exerciseId: 'barbell-bicep-curl',
        name: 'Barbell Bicep Curl',
        muscle: 'Biceps',
        category: 'Biceps',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 30,
        unit: 'KG',
        notes: 'Keep elbows tucked and avoid swinging'
      }
    ]
  },
  wednesday: {
    id: 'wednesday',
    dayName: 'Wednesday',
    shortName: 'Wed',
    isRestDay: false,
    title: 'Legs • Quads, Hamstrings & Calves',
    focus: 'Squats & Lower Body Power',
    targetDuration: 65,
    exercises: [
      {
        id: 'plan_wed_1',
        exerciseId: 'barbell-back-squat',
        name: 'Barbell Back Squat',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '6-8',
        targetWeight: 100,
        unit: 'KG',
        notes: 'Break parallel with upright torso'
      },
      {
        id: 'plan_wed_2',
        exerciseId: 'leg-press-45-degree',
        name: '45° Incline Leg Press',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Weight Machines',
        isLegPress45: true,
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 180,
        unit: 'KG',
        notes: '45-degree sled incline mechanics'
      },
      {
        id: 'plan_wed_3',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        muscle: 'Hamstrings & Glutes',
        category: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 80,
        unit: 'KG',
        notes: 'Hinge back at the hips, feel the hamstring stretch'
      }
    ]
  },
  thursday: {
    id: 'thursday',
    dayName: 'Thursday',
    shortName: 'Thu',
    isRestDay: false,
    title: 'Upper Body Hypertrophy',
    focus: 'Chest Volume & Shoulder Caps',
    targetDuration: 55,
    exercises: [
      {
        id: 'plan_thu_1',
        exerciseId: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Dumbbell',
        targetSets: 4,
        targetReps: '8-10',
        targetWeight: 32,
        unit: 'KG',
        notes: 'Full stretch at bottom of each rep'
      },
      {
        id: 'plan_thu_2',
        exerciseId: 'seated-cable-row',
        name: 'Seated Cable Row (Close Grip)',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Cable Machine',
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 60,
        unit: 'KG',
        notes: 'Pause for 1 second at full peak contraction'
      },
      {
        id: 'plan_thu_3',
        exerciseId: 'dumbbell-lateral-raise',
        name: 'Dumbbell Lateral Raise',
        muscle: 'Shoulders',
        category: 'Shoulders',
        equipment: 'Dumbbell',
        targetSets: 4,
        targetReps: '12-15',
        targetWeight: 12,
        unit: 'KG',
        notes: 'Lead with elbows and avoid shrugging'
      }
    ]
  },
  friday: {
    id: 'friday',
    dayName: 'Friday',
    shortName: 'Fri',
    isRestDay: false,
    title: 'Posterior Chain & Deadlift',
    focus: 'Deadlift Strength & Pulling Power',
    targetDuration: 60,
    exercises: [
      {
        id: 'plan_fri_1',
        exerciseId: 'conventional-deadlift',
        name: 'Conventional Barbell Deadlift',
        muscle: 'Hamstrings & Glutes',
        category: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '5',
        targetWeight: 120,
        unit: 'KG',
        notes: 'Full reset from floor between repetitions'
      },
      {
        id: 'plan_fri_2',
        exerciseId: 'pull-ups',
        name: 'Bodyweight Pull-ups',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Bodyweight',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 0,
        unit: 'KG',
        notes: 'Full dead-hang stretch at bottom'
      }
    ]
  },
  saturday: {
    id: 'saturday',
    dayName: 'Saturday',
    shortName: 'Sat',
    isRestDay: false,
    title: 'Conditioning, Calves & Abs',
    focus: 'Core Stability & Calves',
    targetDuration: 45,
    exercises: [
      {
        id: 'plan_sat_1',
        exerciseId: 'hanging-leg-raise',
        name: 'Hanging Leg Raise',
        muscle: 'Abs & Core',
        category: 'Abs & Core',
        equipment: 'Bodyweight',
        targetSets: 3,
        targetReps: '12-15',
        targetWeight: 0,
        unit: 'KG',
        notes: 'Control the descent without swinging'
      },
      {
        id: 'plan_sat_2',
        exerciseId: 'standing-calf-raise',
        name: 'Standing Calf Raise',
        muscle: 'Calves',
        category: 'Calves',
        equipment: 'Weight Machines',
        targetSets: 4,
        targetReps: '15-20',
        targetWeight: 60,
        unit: 'KG',
        notes: 'Deep stretch at bottom and 2-sec peak hold'
      }
    ]
  },
  sunday: {
    id: 'sunday',
    dayName: 'Sunday',
    shortName: 'Sun',
    isRestDay: true,
    title: 'Rest & Active Recovery',
    focus: 'Mobility, Hydration & Muscle Recovery',
    targetDuration: 30,
    exercises: []
  }
};

export const UPPER_LOWER_ROUTINE = {
  monday: {
    id: 'monday',
    dayName: 'Monday',
    shortName: 'Mon',
    isRestDay: false,
    title: 'Upper Body (Power)',
    focus: 'Heavy Bench Press & Heavy Rows',
    targetDuration: 60,
    exercises: [
      {
        id: 'ul_mon_1',
        exerciseId: 'flat-barbell-bench-press',
        name: 'Flat Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '5',
        targetWeight: 90,
        unit: 'KG',
        notes: 'Heavy working sets with 3 min rest'
      },
      {
        id: 'ul_mon_2',
        exerciseId: 'barbell-bent-over-row',
        name: 'Barbell Bent Over Row',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '6',
        targetWeight: 80,
        unit: 'KG',
        notes: 'Explosive pull to sternum'
      }
    ]
  },
  tuesday: {
    id: 'tuesday',
    dayName: 'Tuesday',
    shortName: 'Tue',
    isRestDay: false,
    title: 'Lower Body (Power)',
    focus: 'Squats & Heavy Deadlifts',
    targetDuration: 65,
    exercises: [
      {
        id: 'ul_tue_1',
        exerciseId: 'barbell-back-squat',
        name: 'Barbell Back Squat',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '5',
        targetWeight: 110,
        unit: 'KG',
        notes: 'Heavy compound leg drive'
      },
      {
        id: 'ul_tue_2',
        exerciseId: 'conventional-deadlift',
        name: 'Conventional Barbell Deadlift',
        muscle: 'Hamstrings & Glutes',
        category: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '5',
        targetWeight: 130,
        unit: 'KG',
        notes: 'Brace lats and core before breaking floor'
      }
    ]
  },
  wednesday: {
    id: 'wednesday',
    dayName: 'Wednesday',
    shortName: 'Wed',
    isRestDay: true,
    title: 'Midweek Rest & Mobility',
    focus: 'Stretching & Joint Recovery',
    targetDuration: 30,
    exercises: []
  },
  thursday: {
    id: 'thursday',
    dayName: 'Thursday',
    shortName: 'Thu',
    isRestDay: false,
    title: 'Upper Body (Hypertrophy)',
    focus: 'Incline Press, Pulldowns & Arms',
    targetDuration: 55,
    exercises: [
      {
        id: 'ul_thu_1',
        exerciseId: 'incline-barbell-bench-press',
        name: 'Incline Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 4,
        targetReps: '8-10',
        targetWeight: 70,
        unit: 'KG',
        notes: 'Moderate tempo and squeeze'
      },
      {
        id: 'ul_thu_2',
        exerciseId: 'lat-pulldown-wide-grip',
        name: 'Lat Pulldown (Wide Grip)',
        muscle: 'Back',
        category: 'Back',
        equipment: 'Cable Machine',
        targetSets: 3,
        targetReps: '10-12',
        targetWeight: 60,
        unit: 'KG',
        notes: 'Focus on lat contraction'
      }
    ]
  },
  friday: {
    id: 'friday',
    dayName: 'Friday',
    shortName: 'Fri',
    isRestDay: false,
    title: 'Lower Body (Hypertrophy)',
    focus: 'Leg Press, Romanian Deadlift & Calves',
    targetDuration: 60,
    exercises: [
      {
        id: 'ul_fri_1',
        exerciseId: 'leg-press-45-degree',
        name: '45° Incline Leg Press',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Weight Machines',
        isLegPress45: true,
        targetSets: 4,
        targetReps: '10-12',
        targetWeight: 200,
        unit: 'KG',
        notes: 'Deep knee flexion without lifting lower back'
      },
      {
        id: 'ul_fri_2',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        muscle: 'Hamstrings & Glutes',
        category: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 85,
        unit: 'KG',
        notes: 'Great hamstring stretch'
      }
    ]
  },
  saturday: {
    id: 'saturday',
    dayName: 'Saturday',
    shortName: 'Sat',
    isRestDay: true,
    title: 'Weekend Rest & Active Recovery',
    focus: 'Walking, Light Cardio & Recovery',
    targetDuration: 30,
    exercises: []
  },
  sunday: {
    id: 'sunday',
    dayName: 'Sunday',
    shortName: 'Sun',
    isRestDay: true,
    title: 'Rest & Nutrition Reset',
    focus: 'Mental & Physical Reset for Next Week',
    targetDuration: 0,
    exercises: []
  }
};

export const FULL_BODY_ROUTINE = {
  monday: {
    id: 'monday',
    dayName: 'Monday',
    shortName: 'Mon',
    isRestDay: false,
    title: 'Full Body Session A (Squat & Bench)',
    focus: 'Squats, Bench Press & Barbell Rows',
    targetDuration: 60,
    exercises: [
      {
        id: 'fb_mon_1',
        exerciseId: 'barbell-back-squat',
        name: 'Barbell Back Squat',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8',
        targetWeight: 90,
        unit: 'KG',
        notes: 'Compound squatting pattern'
      },
      {
        id: 'fb_mon_2',
        exerciseId: 'flat-barbell-bench-press',
        name: 'Flat Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8',
        targetWeight: 75,
        unit: 'KG',
        notes: 'Primary upper push'
      }
    ]
  },
  tuesday: {
    id: 'tuesday',
    dayName: 'Tuesday',
    shortName: 'Tue',
    isRestDay: true,
    title: 'Rest Day',
    focus: 'Recovery',
    targetDuration: 0,
    exercises: []
  },
  wednesday: {
    id: 'wednesday',
    dayName: 'Wednesday',
    shortName: 'Wed',
    isRestDay: false,
    title: 'Full Body Session B (Deadlift & Press)',
    focus: 'Deadlifts & Overhead Press',
    targetDuration: 60,
    exercises: [
      {
        id: 'fb_wed_1',
        exerciseId: 'conventional-deadlift',
        name: 'Conventional Barbell Deadlift',
        muscle: 'Hamstrings & Glutes',
        category: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '5',
        targetWeight: 115,
        unit: 'KG',
        notes: 'Posterior chain builder'
      },
      {
        id: 'fb_wed_2',
        exerciseId: 'standing-overhead-barbell-press',
        name: 'Standing Overhead Barbell Press',
        muscle: 'Shoulders',
        category: 'Shoulders',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8',
        targetWeight: 45,
        unit: 'KG',
        notes: 'Vertical push'
      }
    ]
  },
  thursday: {
    id: 'thursday',
    dayName: 'Thursday',
    shortName: 'Thu',
    isRestDay: true,
    title: 'Rest Day',
    focus: 'Recovery',
    targetDuration: 0,
    exercises: []
  },
  friday: {
    id: 'friday',
    dayName: 'Friday',
    shortName: 'Fri',
    isRestDay: false,
    title: 'Full Body Session C (Leg Press & Incline)',
    focus: 'Leg Press, Incline Press & Pull-ups',
    targetDuration: 60,
    exercises: [
      {
        id: 'fb_fri_1',
        exerciseId: 'leg-press-45-degree',
        name: '45° Incline Leg Press',
        muscle: 'Quadriceps',
        category: 'Quadriceps',
        equipment: 'Weight Machines',
        isLegPress45: true,
        targetSets: 4,
        targetReps: '10',
        targetWeight: 180,
        unit: 'KG',
        notes: '45-degree sled volume'
      },
      {
        id: 'fb_fri_2',
        exerciseId: 'incline-barbell-bench-press',
        name: 'Incline Barbell Bench Press',
        muscle: 'Chest',
        category: 'Chest',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: '8-10',
        targetWeight: 65,
        unit: 'KG',
        notes: 'Upper chest angle'
      }
    ]
  },
  saturday: {
    id: 'saturday',
    dayName: 'Saturday',
    shortName: 'Sat',
    isRestDay: true,
    title: 'Rest Day',
    focus: 'Recovery',
    targetDuration: 0,
    exercises: []
  },
  sunday: {
    id: 'sunday',
    dayName: 'Sunday',
    shortName: 'Sun',
    isRestDay: true,
    title: 'Rest Day',
    focus: 'Weekly Review',
    targetDuration: 0,
    exercises: []
  }
};

export const BLANK_WEEKLY_ROUTINE = {
  monday: { id: 'monday', dayName: 'Monday', shortName: 'Mon', isRestDay: false, title: 'Monday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  tuesday: { id: 'tuesday', dayName: 'Tuesday', shortName: 'Tue', isRestDay: false, title: 'Tuesday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  wednesday: { id: 'wednesday', dayName: 'Wednesday', shortName: 'Wed', isRestDay: false, title: 'Wednesday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  thursday: { id: 'thursday', dayName: 'Thursday', shortName: 'Thu', isRestDay: false, title: 'Thursday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  friday: { id: 'friday', dayName: 'Friday', shortName: 'Fri', isRestDay: false, title: 'Friday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  saturday: { id: 'saturday', dayName: 'Saturday', shortName: 'Sat', isRestDay: false, title: 'Saturday Workout', focus: 'Custom Focus', targetDuration: 60, exercises: [] },
  sunday: { id: 'sunday', dayName: 'Sunday', shortName: 'Sun', isRestDay: true, title: 'Sunday Rest Day', focus: 'Recovery', targetDuration: 0, exercises: [] }
};
