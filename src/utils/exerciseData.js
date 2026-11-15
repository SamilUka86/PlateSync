/**
 * PlateSync - Comprehensive Exercise & Training Systems Database
 * Production-grade dataset covering 180 categorized movements & 12 complete training programs.
 * Strictly adheres to hierarchical 7 main muscle groups and specific anatomical subgroups.
 */

export const MAIN_MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs'
];

export const MUSCLE_GROUPS = [
  'All',
  ...MAIN_MUSCLE_GROUPS
];

export const MUSCLE_SUBGROUPS = {
  'Chest': [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    'Inner Chest',
    'Outer Chest'
  ],
  'Back': [
    'Upper Back',
    'Middle Back',
    'Lower Back',
    'Lats (Latissimus Dorsi)',
    'Traps (Trapezius)',
    'Spinal Erectors'
  ],
  'Shoulders': [
    'Front Delts (Anterior Deltoids)',
    'Side Delts (Lateral Deltoids)',
    'Rear Delts (Posterior Deltoids)',
    'Rotator Cuff'
  ],
  'Biceps': [
    'Biceps Long Head',
    'Biceps Short Head',
    'Brachialis',
    'Brachioradialis'
  ],
  'Triceps': [
    'Long Head',
    'Lateral Head',
    'Medial Head'
  ],
  'Legs': [
    'Quadriceps',
    'Hamstrings',
    'Adductors (Inner Thigh)',
    'Abductors (Outer Hip)',
    'Glutes'
  ],
  'Thighs': [
    'Quadriceps',
    'Hamstrings',
    'Adductors (Inner Thigh)',
    'Abductors (Outer Hip)',
    'Glutes'
  ],
  'Abs': [
    'Upper Abs',
    'Lower Abs',
    'Obliques',
    'Deep Core / Transverse Abdominis'
  ]
};

export const EQUIPMENT_TYPES = [
  'All Equipment',
  'Barbell',
  'Dumbbell',
  'Dumbbells',
  'Smith Machine',
  'Cable Machine',
  'Weight Machines',
  'Plate-loaded Machines',
  'Bodyweight',
  'Resistance Bands',
  'EZ Bar',
  'Kettlebells',
  'Pull-up Bar',
  'Bench',
  'Other Gym Equipment'
];

export const DIFFICULTY_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
export const EXERCISE_TYPES = ['All Types', 'Compound', 'Isolation'];

export const EXERCISE_DATABASE = [
  {
    "id": "flat-barbell-bench-press",
    "name": "Flat Barbell Bench Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on the bench with eyes directly under the racked barbell. Plant feet firmly into the floor. Grip the barbell slightly wider than shoulder-width with straight wrists.",
    "instructions": "Unrack bar, pull shoulder blades back and depress them into the bench. Lower the barbell under strict control to touch your mid-chest/sternum. Drive upward forcefully while pushing through the floor until arms are extended without unlocking shoulder blades.",
    "technique": "Maintain a natural lumbar arch, tuck elbows at 45 to 70 degrees from torso, keep glutes pressed flat on the pad throughout.",
    "breathing": "Inhale deep into the diaphragm and brace on descent; exhale forcefully through the sticking point on ascent.",
    "commonMistakes": [
      "Bouncing the bar off ribs",
      "Flaring elbows outward at 90 degrees",
      "Lifting buttocks off the bench",
      "Bent wrists collapsing backward"
    ],
    "safetyNotes": "Always use safety pins or a spotter on heavy maximal sets. Never use a thumbless (suicide) grip.",
    "alternatives": [
      "Flat Dumbbell Press",
      "Floor Press",
      "Smith Machine Bench Press"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "5-8",
    "recommendedRest": 120,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Incline Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Set an incline bench to 30-45 degrees. Lie back, plant feet firmly, and grip the bar slightly wider than shoulder-width.",
    "instructions": "Unrack bar and establish vertical balance over upper chest. Lower bar smoothly to the clavicle area. Press upward and slightly backward towards eye level.",
    "technique": "Keep chest high and shoulder blades retracted. Angle bench no higher than 45 degrees to avoid shifting emphasis to deltoids.",
    "breathing": "Inhale and brace core on descent; exhale as you press past the midway point.",
    "commonMistakes": [
      "Excessive bench angle",
      "Bouncing off upper chest",
      "Flaring elbows excessively"
    ],
    "safetyNotes": "Pay close attention to shoulder capsule integrity during unracking.",
    "alternatives": [
      "Incline Dumbbell Press",
      "Incline Smith Machine Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Upper Chest",
    "subgroups": [
      "Upper Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Head)"
    ]
  },
  {
    "id": "decline-barbell-bench-press",
    "name": "Decline Barbell Bench Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Decline Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Secure legs under the roller pads of a decline bench. Lie back and grip barbell slightly wider than shoulder-width.",
    "instructions": "Unrack and position bar over lower chest. Lower smoothly to touch lower sternum. Press barbell straight up with control.",
    "technique": "Keep scapulae firmly anchored against the pad. Keep descent controlled to prevent slipping.",
    "breathing": "Inhale on descent; exhale forcefully on the push.",
    "commonMistakes": [
      "Letting bar drift over throat",
      "Lifting legs from the secure roller pads"
    ],
    "safetyNotes": "Have a spotter hand off and rack the barbell due to awkward unrack geometry.",
    "alternatives": [
      "Chest Dips",
      "Decline Dumbbell Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10",
    "recommendedRest": 90,
    "subgroup": "Lower Chest",
    "subgroups": [
      "Lower Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Abdominal/Costal Head)"
    ]
  },
  {
    "id": "flat-dumbbell-press",
    "name": "Flat Dumbbell Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbell",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Sit on bench with dumbbells resting on thighs. Kick knees up one by one while lying back to bring weights to shoulder height.",
    "instructions": "Press dumbbells up in a slight converging arc above mid-chest without banging them together. Lower weights under control until hands are parallel to chest level.",
    "technique": "Rotate palms slightly inward (semi-neutral 45-degree angle) to protect shoulder rotators.",
    "breathing": "Inhale deeply as dumbbells lower; exhale forcefully while pressing up.",
    "commonMistakes": [
      "Banging dumbbells at top",
      "Dropping elbows too low below shoulder joint depth",
      "Arching excessively"
    ],
    "safetyNotes": "When finished, bring dumbbells back to knees before sitting up, or drop safely to rubber matting.",
    "alternatives": [
      "Flat Barbell Bench Press",
      "Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "incline-dumbbell-press",
    "name": "Incline Dumbbell Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "equipment": "Dumbbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Incline Push",
    "startingPosition": "Set bench to 30-45 degrees. Kick dumbbells up to shoulder level and plant feet firmly on the floor.",
    "instructions": "Press dumbbells vertically above clavicles with arms extended. Lower under 3-second eccentric control until you feel a deep, comfortable stretch in the upper pectorals.",
    "technique": "Focus on contracting the upper clavicular chest fibers at the top peak.",
    "breathing": "Inhale on way down; exhale as you drive weights upward.",
    "commonMistakes": [
      "Over-arching lower back to turn it into a flat press",
      "Using excessive angle"
    ],
    "safetyNotes": "Control dumbbells throughout descent to safeguard shoulder anterior joint.",
    "alternatives": [
      "Incline Barbell Bench Press",
      "Low-to-High Cable Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Upper Chest",
    "subgroups": [
      "Upper Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Head)"
    ]
  },
  {
    "id": "decline-dumbbell-press",
    "name": "Decline Dumbbell Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Decline Push",
    "startingPosition": "Hook ankles under pads on decline bench holding dumbbells on thighs. Carefully lie back bringing weights to lower chest level.",
    "instructions": "Press dumbbells directly above lower chest. Lower smoothly until weights touch sides of lower chest, then drive back up.",
    "technique": "Maintain constant muscular tension and steady wrist orientation.",
    "breathing": "Inhale descending; exhale driving upward.",
    "commonMistakes": [
      "Dumbbells drifting over the face",
      "Dropping weights uncontrollably"
    ],
    "safetyNotes": "Sit up promptly after completing set to normalize cranial blood flow.",
    "alternatives": [
      "Decline Barbell Bench Press",
      "High-to-Low Cable Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Lower Chest",
    "subgroups": [
      "Lower Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Abdominal/Costal Head)"
    ]
  },
  {
    "id": "dumbbell-fly",
    "name": "Dumbbell Fly",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Fly",
    "startingPosition": "Lie flat holding light-to-moderate dumbbells over chest, palms facing each other, elbows slightly unlocked.",
    "instructions": "Lower weights out to the sides in a wide arc until chest reaches a full stretch at bench height. Bring arms back together in the same arc as if hugging a large barrel.",
    "technique": "Keep elbow bend static throughout the entire movement. Do not turn this into a pressing motion.",
    "breathing": "Inhale deeply as chest opens wide; exhale while contracting chest to bring dumbbells together.",
    "commonMistakes": [
      "Excessive depth causing shoulder hyperextension",
      "Bending elbows into a press",
      "Using too heavy weight"
    ],
    "safetyNotes": "Keep movement strictly controlled; never drop elbows below torso plane.",
    "alternatives": [
      "Cable Chest Fly",
      "Pec Deck"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "incline-dumbbell-fly",
    "name": "Incline Dumbbell Fly",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Incline Fly",
    "startingPosition": "Set bench to 30 degrees. Hold dumbbells overhead with palms facing and soft bend in elbows.",
    "instructions": "Lower dumbbells out and back in an arc targeting upper chest stretch. Squeeze upper chest fibers to draw weights back together above eyes.",
    "technique": "Maintain constant tension at the stretch point without allowing shoulders to rotate forward.",
    "breathing": "Inhale during outward stretch; exhale pulling upward.",
    "commonMistakes": [
      "Locking elbows straight",
      "Dropping weights too fast"
    ],
    "safetyNotes": "Select manageable weight prioritizing mind-muscle connection.",
    "alternatives": [
      "Low-to-High Cable Fly",
      "Incline Cable Crossover"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Upper Chest",
    "subgroups": [
      "Upper Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Head)"
    ]
  },
  {
    "id": "cable-chest-fly",
    "name": "Cable Chest Fly",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cable Machine",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Horizontal Fly",
    "startingPosition": "Set cable pulleys at chest height. Grasp D-handles, step forward into a staggered stance with chest up and core engaged.",
    "instructions": "With elbows slightly bent, sweep hands forward in a circular hug movement until knuckles nearly touch. Squeeze chest for 1 second, then control return.",
    "technique": "Maintain static torso posture without rocking backward or forward.",
    "breathing": "Exhale bringing cables together; inhale smoothly on the eccentric return.",
    "commonMistakes": [
      "Using momentum from torso",
      "Allowing hands to fly too far behind shoulders"
    ],
    "safetyNotes": "Release handles steadily to the weight stack; never let weights slam.",
    "alternatives": [
      "Pec Deck",
      "Dumbbell Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "low-to-high-cable-fly",
    "name": "Low-to-High Cable Fly",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cable Machine",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Incline Fly",
    "startingPosition": "Set pulleys to bottom floor position. Hold D-handles with palms facing forward, take one step forward.",
    "instructions": "Keeping slight elbow bend, drive cables upward and inward towards eye level. Contract clavicular pectorals hard at the top, then lower slowly.",
    "technique": "Drive through palms while keeping chest elevated and shoulders pinned back.",
    "breathing": "Exhale driving upward; inhale lowering slowly.",
    "commonMistakes": [
      "Swinging torso back",
      "Using traps rather than upper chest"
    ],
    "safetyNotes": "Keep core firmly braced to protect lumbar spine.",
    "alternatives": [
      "Incline Dumbbell Fly",
      "Incline Dumbbell Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Upper Chest",
    "subgroups": [
      "Upper Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Head)"
    ]
  },
  {
    "id": "high-to-low-cable-fly",
    "name": "High-to-Low Cable Fly",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cable Machine",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Decline Fly",
    "startingPosition": "Set pulleys above head level. Grasp handles, hinge slightly at hips with tight core.",
    "instructions": "Pull cables downward and inward crossing in front of hips or lower abdomen. Squeeze lower chest firmly, then return with control.",
    "technique": "Keep elbows slightly bent and fixed. Focus on pulling down with lower chest fibers.",
    "breathing": "Exhale pulling down; inhale releasing back up.",
    "commonMistakes": [
      "Bending too far forward into a pushdown",
      "Excessive shoulder roll"
    ],
    "safetyNotes": "Maintain stable staggered stance for pelvic balance.",
    "alternatives": [
      "Chest Dips",
      "Decline Dumbbell Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lower Chest",
    "subgroups": [
      "Lower Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Costal Head)"
    ]
  },
  {
    "id": "pec-deck",
    "name": "Pec Deck",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Weight Machines",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Horizontal Fly",
    "startingPosition": "Adjust seat height so handles align with mid-chest. Sit with back flat against pad and elbows aligned with handles.",
    "instructions": "Squeeze handles together in front of chest until they touch. Hold peak contraction for 1 second, then open arms smoothly until feeling a comfortable stretch.",
    "technique": "Keep scapula retracted against pad throughout. Do not let shoulders roll forward at peak squeeze.",
    "breathing": "Exhale closing arms; inhale as arms open.",
    "commonMistakes": [
      "Allowing elbows to drop below handle line",
      "Letting weights slam"
    ],
    "safetyNotes": "Never adjust pin while seated inside the machine arm radius.",
    "alternatives": [
      "Cable Chest Fly",
      "Dumbbell Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Inner Chest",
    "subgroups": [
      "Inner Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Peak Sternal Adduction)"
    ]
  },
  {
    "id": "machine-chest-press",
    "name": "Machine Chest Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Weight Machines",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Adjust seat so handles align with mid-chest line. Feet flat on floor, back firmly supported.",
    "instructions": "Grip handles, retract shoulder blades, and press handles forward until arms are fully extended without locking elbows. Return smoothly to starting stretch.",
    "technique": "Fixed path allows safe overloading; keep elbows tracking in line with handles.",
    "breathing": "Exhale pressing forward; inhale returning with control.",
    "commonMistakes": [
      "Rounding shoulders at end of press",
      "Seat height set too high or low"
    ],
    "safetyNotes": "Use foot assist pedal to bring handles forward before gripping.",
    "alternatives": [
      "Flat Barbell Bench Press",
      "Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "smith-machine-bench-press",
    "name": "Smith Machine Bench Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Smith Machine",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Center flat bench directly under Smith machine bar. Lie down so bar aligns with lower-mid chest.",
    "instructions": "Rotate wrists to unhook bar. Lower bar with controlled cadence to lower chest. Press upwards vigorously along the fixed track.",
    "technique": "Fixed vertical track eliminates stabilization demands, allowing concentrated pectoral loading.",
    "breathing": "Inhale on descent; exhale pressing upward.",
    "commonMistakes": [
      "Bench off-center",
      "Elbows flared too high"
    ],
    "safetyNotes": "Always set mechanical safety stops 2 inches below chest height before beginning.",
    "alternatives": [
      "Flat Barbell Bench Press",
      "Machine Chest Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head)"
    ]
  },
  {
    "id": "push-ups",
    "name": "Push-ups",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Abs & Core"
    ],
    "equipment": "Bodyweight",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Hands slightly wider than shoulders on floor, feet together, body forming a straight plank from head to heels.",
    "instructions": "Brace core and glutes. Lower body until chest touches or hovers 1 inch from floor. Press through palms to return to full arm extension.",
    "technique": "Do not allow hips to sag or pike upwards. Keep neck in neutral alignment.",
    "breathing": "Inhale on way down; exhale pushing up.",
    "commonMistakes": [
      "Sagging lower back",
      "Flaring elbows to 90 degrees",
      "Partial range of motion"
    ],
    "safetyNotes": "Place hands on push-up bars if experiencing wrist compression discomfort.",
    "alternatives": [
      "Dumbbell Press",
      "Incline Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-25",
    "recommendedRest": 60,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major",
      "Triceps Brachii"
    ]
  },
  {
    "id": "weighted-push-ups",
    "name": "Weighted Push-ups",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Abs & Core"
    ],
    "equipment": "Bodyweight",
    "category": "Chest",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Standard push-up position with a weight plate or weighted vest placed securely across mid/upper back.",
    "instructions": "Lower chest steadily under extra load. Drive upward dynamically through the floor keeping core locked rigid.",
    "technique": "Ensure plate stays centered between scapulae without sliding toward neck.",
    "breathing": "Inhale down; exhale pressing up.",
    "commonMistakes": [
      "Allowing lower back to hyperextend under plate weight"
    ],
    "safetyNotes": "Have a training partner place and remove plate safely.",
    "alternatives": [
      "Flat Barbell Bench Press",
      "Chest Dips"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major",
      "Triceps Brachii"
    ]
  },
  {
    "id": "chest-dips",
    "name": "Chest Dips",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Decline Push",
    "startingPosition": "Support weight on parallel bars with arms extended. Lean torso forward approximately 30 degrees with knees bent.",
    "instructions": "Lower body by bending elbows until upper arms are parallel to floor and chest feels a deep stretch. Push through palms to return to top.",
    "technique": "Keep forward torso lean throughout to emphasize lower pectorals over triceps.",
    "breathing": "Inhale on descent; exhale driving body upward.",
    "commonMistakes": [
      "Staying completely upright (shifts load to triceps)",
      "Dropping too low causing shoulder strain"
    ],
    "safetyNotes": "Avoid excessive depth if you have a history of anterior shoulder impingement.",
    "alternatives": [
      "Decline Barbell Bench Press",
      "Assisted Chest Dips"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Lower Chest",
    "subgroups": [
      "Lower Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Costal Head)",
      "Triceps"
    ]
  },
  {
    "id": "assisted-chest-dips",
    "name": "Assisted Chest Dips",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Weight Machines",
    "category": "Chest",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Decline Push",
    "startingPosition": "Place knees on padded counterweight platform. Grasp wide dip handles and lean torso forward 30 degrees.",
    "instructions": "Lower smoothly with control until upper arms reach parallel. Drive through palms to return to starting position.",
    "technique": "Gradually decrease counterweight as upper body pushing strength increases.",
    "breathing": "Inhale lowering; exhale pressing up.",
    "commonMistakes": [
      "Relying too heavily on counterweight momentum",
      "Vertical posture"
    ],
    "safetyNotes": "Step off machine carefully to avoid sudden pad spring-back.",
    "alternatives": [
      "Chest Dips",
      "Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Lower Chest",
    "subgroups": [
      "Lower Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Costal Head)"
    ]
  },
  {
    "id": "conventional-deadlift",
    "name": "Conventional Deadlift",
    "muscle": "Back",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Quadriceps",
      "Forearms",
      "Abs & Core"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Feet hip-width apart under barbell, shins 1 inch from bar. Hinge at hips to grip bar just outside shins. Pull chest high, flatten back, and engage lats.",
    "instructions": "Drive through heels pushing floor away while keeping barbell scraping shins and thighs. Lock out hips and knees simultaneously at the top. Reverse movement with control.",
    "technique": "Keep spine neutral, core braced via Valsalva maneuver. Bar path must be strictly vertical.",
    "breathing": "Deep diaphragmatic breath at bottom; brace whole rep; exhale upon locking out or returning bar.",
    "commonMistakes": [
      "Rounding lumbar spine",
      "Letting bar drift away from body",
      "Hyperextending back at lockout"
    ],
    "safetyNotes": "Never lift beyond technical failure on deadlifts to protect spinal discs.",
    "alternatives": [
      "Romanian Deadlift",
      "Trap Bar Deadlift",
      "Rack Pull"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "3-6",
    "recommendedRest": 180,
    "subgroup": "Spinal Erectors",
    "subgroups": [
      "Spinal Erectors"
    ],
    "primaryMuscles": [
      "Erector Spinae",
      "Gluteus Maximus",
      "Hamstrings"
    ]
  },
  {
    "id": "romanian-deadlift",
    "name": "Romanian Deadlift",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall holding barbell at thigh level with overhand grip, slight soft bend in knees.",
    "instructions": "Push hips backward while tracing bar down thighs. Lower until hamstrings reach peak stretch (typically just below knees). Contract glutes to drive hips forward to standing.",
    "technique": "Keep knee angle fixed throughout; this is a pure hip hinge, not a squat.",
    "breathing": "Inhale descending; exhale driving hips through.",
    "commonMistakes": [
      "Squatting instead of hinging",
      "Allowing bar to swing forward away from legs"
    ],
    "safetyNotes": "Stop descent if lower back starts rounding.",
    "alternatives": [
      "Dumbbell Romanian Deadlift",
      "Good Mornings"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (Biceps Femoris)",
      "Gluteus Maximus",
      "Erector Spinae"
    ]
  },
  {
    "id": "rack-pull",
    "name": "Rack Pull",
    "muscle": "Back",
    "secondaryMuscles": [
      "Trapezius",
      "Forearms",
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Set power rack safety pins just below knee height. Stand with bar against shins in deadlift stance.",
    "instructions": "Hinge at hips, grip bar firmly, pull slack out of barbell, and drive hips through to complete lockout. Lower bar back to pins with control.",
    "technique": "Emphasizes upper back thickness, spinal erectors, and lockout strength.",
    "breathing": "Inhale and brace before pull; exhale at lockout.",
    "commonMistakes": [
      "Bouncing bar hard off safety pins",
      "Leaning excessively backward"
    ],
    "safetyNotes": "Heavy loads demand strict spinal stiffness.",
    "alternatives": [
      "Conventional Deadlift",
      "Barbell Shrugs"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "4-8",
    "recommendedRest": 120,
    "subgroup": "Lower Back",
    "subgroups": [
      "Lower Back"
    ],
    "primaryMuscles": [
      "Lower Erector Spinae",
      "Trapezius (Mid/Lower)"
    ]
  },
  {
    "id": "barbell-row",
    "name": "Barbell Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Posterior Deltoids",
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Hinge forward at hips at roughly a 45-degree torso angle with flat back. Grip barbell slightly wider than shoulder-width.",
    "instructions": "Pull elbows back driving bar towards lower ribs/belly button. Squeeze lats and rhomboids firmly at peak, then lower under control.",
    "technique": "Keep torso stationary; avoid using hip extension momentum to swing the bar up.",
    "breathing": "Exhale rowing bar upward; inhale lowering bar.",
    "commonMistakes": [
      "Standing too upright",
      "Yanking weight with lower back momentum",
      "Flaring elbows excessively"
    ],
    "safetyNotes": "Drop weight if lower back posture cannot be maintained.",
    "alternatives": [
      "Pendlay Row",
      "T-Bar Row",
      "Dumbbell Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Mid Trapezius"
    ]
  },
  {
    "id": "pendlay-row",
    "name": "Pendlay Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Posterior Deltoids",
      "Abs & Core"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Torso strictly parallel to floor, bar resting on deadlift mats/floor. Overhand grip slightly wider than shoulder-width.",
    "instructions": "Explosively row barbell off floor to touch sternum without raising torso angle. Lower bar completely back to dead stop on floor between reps.",
    "technique": "Each rep starts from a dead stop on the ground to build pure explosive pulling power.",
    "breathing": "Inhale and brace on floor; exhale pulling dynamically.",
    "commonMistakes": [
      "Rising torso upward above parallel",
      "Using leg drive to heave the weight"
    ],
    "safetyNotes": "Requires high hamstring and hip mobility to maintain parallel posture.",
    "alternatives": [
      "Barbell Row",
      "T-Bar Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "5-8",
    "recommendedRest": 120,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Erector Spinae"
    ]
  },
  {
    "id": "t-bar-row",
    "name": "T-Bar Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Trapezius"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Straddle landmine or T-bar apparatus. Hinge hips to 45 degrees, grip close-grip V-handle under bar.",
    "instructions": "Pull handle up towards sternum leading with elbows. Squeeze scapulae together at top, lower slowly to full lat stretch.",
    "technique": "Neutral close-grip provides optimal mechanical advantage for latissimus dorsi thickness.",
    "breathing": "Exhale rowing up; inhale lowering.",
    "commonMistakes": [
      "Using excessive momentum",
      "Rounding lower back"
    ],
    "safetyNotes": "Ensure landmine base is solidly anchored.",
    "alternatives": [
      "Chest-Supported Row",
      "Barbell Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Middle Trapezius",
      "Rhomboids",
      "Latissimus Dorsi"
    ]
  },
  {
    "id": "chest-supported-row",
    "name": "Chest-Supported Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Posterior Deltoids",
      "Rhomboids"
    ],
    "equipment": "Weight Machines",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Lie face down on incline bench or position chest firmly against machine pad. Grasp handles.",
    "instructions": "Pull handles back, retracting scapulae fully without lifting chest off pad. Squeeze back musculature for 1 second before lowering.",
    "technique": "Removes all lower back strain, isolating upper back and lats with zero spinal loading.",
    "breathing": "Exhale pulling back; inhale extending arms.",
    "commonMistakes": [
      "Peeling chest off support pad",
      "Using arms rather than back"
    ],
    "safetyNotes": "Ideal for athletes with lower back fatigue or disc issues.",
    "alternatives": [
      "Seated Cable Row",
      "T-Bar Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Upper Back",
    "subgroups": [
      "Upper Back"
    ],
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Rear Deltoids"
    ]
  },
  {
    "id": "seated-cable-row",
    "name": "Seated Cable Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Forearms"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Sit with feet braced on footrests, knees slightly bent. Grasp V-bar handle with arms extended and torso upright.",
    "instructions": "Pull handle into lower abdomen keeping elbows close to ribs. Squeeze shoulder blades together, then extend arms smoothly allowing a full forward lat stretch.",
    "technique": "Avoid excessive rocking back and forth; keep torso nearly perpendicular to floor.",
    "breathing": "Exhale pulling into torso; inhale extending forward.",
    "commonMistakes": [
      "Swinging torso back 45 degrees",
      "Rounding shoulders forward on pull"
    ],
    "safetyNotes": "Do not lock out knees completely on footrests.",
    "alternatives": [
      "Barbell Row",
      "Chest-Supported Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids"
    ]
  },
  {
    "id": "close-grip-cable-row",
    "name": "Close-Grip Cable Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Lats"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Seated cable machine with close neutral V-handle attached. Upright posture.",
    "instructions": "Drive elbows back scraping past obliques. Squeeze lower lat insertions hard before returning under control.",
    "technique": "Focus on drawing elbows as far back as anatomically possible.",
    "breathing": "Exhale pulling in; inhale extending arms.",
    "commonMistakes": [
      "Shrugging shoulders upward during pull"
    ],
    "safetyNotes": "Keep lumbar spine braced neutrally.",
    "alternatives": [
      "Seated Cable Row",
      "Single-Arm Dumbbell Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids"
    ]
  },
  {
    "id": "wide-grip-lat-pulldown",
    "name": "Wide-Grip Lat Pulldown",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Posterior Deltoids"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Sit at pulldown station with thighs secured under roller pads. Grip long bar with overhand grip roughly 1.5x shoulder-width.",
    "instructions": "Lean torso back slightly (10-15 degrees). Pull bar down smoothly to touch upper chest by driving elbows down and back. Control return to full arm extension.",
    "technique": "Think about driving elbows down into your back pockets.",
    "breathing": "Exhale pulling bar down; inhale returning bar overhead.",
    "commonMistakes": [
      "Pulling bar behind neck",
      "Swinging torso excessively back and forth",
      "Using forearm momentum"
    ],
    "safetyNotes": "Never pull bar behind neck as this stresses cervical vertebrae and shoulder capsule.",
    "alternatives": [
      "Pull-ups",
      "Single-Arm Lat Pulldown"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ]
  },
  {
    "id": "close-grip-lat-pulldown",
    "name": "Close-Grip Lat Pulldown",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Lower Lats"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Attach V-bar to high pulldown cable. Sit with thighs locked under pads.",
    "instructions": "Pull V-handle down to upper chest, emphasizing full contraction of lower lat fibers. Slowly allow handle to rise to full stretch.",
    "technique": "Neutral hand position reduces strain on wrists and rotators while maximizing lat stretch.",
    "breathing": "Exhale down; inhale up.",
    "commonMistakes": [
      "Leaning too far backward"
    ],
    "safetyNotes": "Maintain controlled return to protect shoulder joints.",
    "alternatives": [
      "Chin-ups",
      "Wide-Grip Lat Pulldown"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Biceps"
    ]
  },
  {
    "id": "single-arm-lat-pulldown",
    "name": "Single-Arm Lat Pulldown",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Obliques"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Attach single D-handle to high cable. Kneel or sit sideways under pulley grasping handle.",
    "instructions": "Pull handle down driving elbow into hip while slightly flexing torso laterally into the working lat. Hold peak squeeze 1 second before extending.",
    "technique": "Allows unilateral focus to correct strength imbalances and achieve maximum lat shortening.",
    "breathing": "Exhale pulling down; inhale extending up.",
    "commonMistakes": [
      "Rotating torso away from the pulley"
    ],
    "safetyNotes": "Keep non-working hand anchored for core stabilization.",
    "alternatives": [
      "Single-Arm Dumbbell Row",
      "Wide-Grip Lat Pulldown"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi (Unilateral Iliac Bias)"
    ]
  },
  {
    "id": "pull-ups",
    "name": "Pull-ups",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Back",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Hang from pull-up bar with overhand grip wider than shoulders, arms fully extended (dead hang), core engaged.",
    "instructions": "Retract shoulder blades and pull chest up towards bar until chin clears the bar. Lower under control back to full dead hang.",
    "technique": "Perform strict repetitions without swinging legs or kipping.",
    "breathing": "Exhale pulling up; inhale lowering down.",
    "commonMistakes": [
      "Kipping or swinging",
      "Cutting range of motion at bottom",
      "Craning neck forward over bar"
    ],
    "safetyNotes": "Use resistance bands for assistance if full pull-ups are not yet achievable.",
    "alternatives": [
      "Wide-Grip Lat Pulldown",
      "Assisted Pull-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-12",
    "recommendedRest": 90,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ]
  },
  {
    "id": "chin-ups",
    "name": "Chin-ups",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Hang from bar with supinated (underhand, palms facing you) grip at shoulder-width.",
    "instructions": "Pull body up vertically until chin clears bar, heavily recruiting biceps and lower lats. Lower smoothly to full stretch.",
    "technique": "Supinated grip provides great leverage for biceps and latissimus dorsi.",
    "breathing": "Exhale pulling up; inhale lowering.",
    "commonMistakes": [
      "Partial reps",
      "Dropping down abruptly without control"
    ],
    "safetyNotes": "If elbows ache, switch to neutral-grip pull-ups.",
    "alternatives": [
      "Pull-ups",
      "Close-Grip Lat Pulldown"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Biceps Brachii"
    ]
  },
  {
    "id": "assisted-pull-ups",
    "name": "Assisted Pull-ups",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Weight Machines",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Place knees on counterweight pad, grip wide handles with overhand grip.",
    "instructions": "Pull chest toward bar smoothly. Lower under control to full extension.",
    "technique": "Focus on lat activation while systematically reducing counterweight pin over weeks.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Bouncing on counterweight pad"
    ],
    "safetyNotes": "Step off cautiously to prevent knee pad slamming.",
    "alternatives": [
      "Lat Pulldown",
      "Inverted Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi"
    ]
  },
  {
    "id": "single-arm-dumbbell-row",
    "name": "Single-Arm Dumbbell Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Place one knee and same-side hand on flat bench for support. Other foot firmly on floor. Grasp dumbbell in free hand with arm hanging straight down.",
    "instructions": "Pull dumbbell towards hip driving elbow straight up and back. Squeeze lat at top, then lower dumbbell allowing a full stretch at bottom.",
    "technique": "Keep back flat parallel to floor; avoid twisting torso excessively during pull.",
    "breathing": "Exhale pulling dumbbell up; inhale lowering.",
    "commonMistakes": [
      "Twisting torso to throw dumbbell up",
      "Rounding spine"
    ],
    "safetyNotes": "Maintain 3-point support foundation on bench.",
    "alternatives": [
      "Barbell Row",
      "Cable Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids"
    ]
  },
  {
    "id": "straight-arm-pulldown",
    "name": "Straight-Arm Pulldown",
    "muscle": "Back",
    "secondaryMuscles": [
      "Triceps Long Head",
      "Teres Major",
      "Core"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Stand facing high cable pulley with wide or straight bar. Arms extended overhead with slight bend in elbows, slight forward torso hinge.",
    "instructions": "Keeping elbows locked in slight bend, sweep bar down in an arc to touch upper thighs. Squeeze lats intensely for 1 second, then control return to eye level.",
    "technique": "Pure lat isolation without bicep contribution. Drive movement from shoulder extension.",
    "breathing": "Exhale sweeping bar down; inhale returning up.",
    "commonMistakes": [
      "Bending elbows into a tricep pushdown",
      "Leaning torso forward and backward"
    ],
    "safetyNotes": "Keep core braced to stabilize lumbar spine.",
    "alternatives": [
      "Dumbbell Pullover",
      "Cable Pullover"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ]
  },
  {
    "id": "machine-row",
    "name": "Machine Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids"
    ],
    "equipment": "Weight Machines",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Sit with chest pressed against support pad. Adjust seat so handles are at chest level. Grip handles.",
    "instructions": "Pull handles back retracting shoulder blades. Pause at full contraction, then return smoothly.",
    "technique": "Excellent for overloading back musculature safely without lower back fatigue.",
    "breathing": "Exhale pulling back; inhale returning.",
    "commonMistakes": [
      "Allowing weight stack to crash between reps"
    ],
    "safetyNotes": "Keep chest glued to pad.",
    "alternatives": [
      "Seated Cable Row",
      "Barbell Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Middle Back",
    "subgroups": [
      "Middle Back"
    ],
    "primaryMuscles": [
      "Middle Trapezius",
      "Rhomboids"
    ]
  },
  {
    "id": "face-pulls",
    "name": "Face Pulls",
    "muscle": "Back",
    "secondaryMuscles": [
      "Posterior Deltoids",
      "Trapezius",
      "Rotator Cuff"
    ],
    "equipment": "Cable Machine",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Attach rope to cable pulley at upper chest/face level. Grip rope with thumbs pointing back towards you.",
    "instructions": "Step back to create tension. Pull center of rope towards face, separating rope ends so hands finish beside ears in a double bicep pose. Squeeze rear delts and mid-traps.",
    "technique": "Focus on external shoulder rotation at end of pull. Essential for postural health and shoulder longevity.",
    "breathing": "Exhale pulling towards face; inhale returning.",
    "commonMistakes": [
      "Using too heavy weight",
      "Turning it into an upright row or bicep curl",
      "Shrugging shoulders up"
    ],
    "safetyNotes": "Light to moderate weights with high rep precision provide best shoulder health results.",
    "alternatives": [
      "Rear Delt Fly",
      "Band Pull-Aparts"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-20",
    "recommendedRest": 60,
    "subgroup": "Upper Back",
    "subgroups": [
      "Upper Back"
    ],
    "primaryMuscles": [
      "Rear Deltoids",
      "Rhomboids",
      "External Rotators"
    ]
  },
  {
    "id": "back-extensions",
    "name": "Back Extensions",
    "muscle": "Back",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Spinal Erectors"
    ],
    "equipment": "Weight Machines",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Hinge",
    "startingPosition": "Hook ankles under rollers on 45-degree hyperextension bench, thighs resting against hip pad just below hip crease. Cross arms over chest.",
    "instructions": "Hinge forward at hips lowering torso towards floor until comfortable stretch. Raise torso by contracting hamstrings, glutes, and spinal erectors until body forms a straight line.",
    "technique": "Do not hyperextend spine backward at the top. Form a clean straight line.",
    "breathing": "Inhale lowering; exhale raising torso.",
    "commonMistakes": [
      "Flailing or swinging torso",
      "Excessive hyperextension bending backwards"
    ],
    "safetyNotes": "Hold a weight plate across chest once bodyweight becomes easy.",
    "alternatives": [
      "Good Mornings",
      "Romanian Deadlift"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lower Back",
    "subgroups": [
      "Lower Back"
    ],
    "primaryMuscles": [
      "Erector Spinae (Lumbar Region)",
      "Glutes"
    ]
  },
  {
    "id": "standing-barbell-shoulder-press",
    "name": "Standing Barbell Shoulder Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Upper Chest",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Shoulders",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall with feet hip-width apart. Rest barbell across front deltoids/clavicles with overhand grip just outside shoulders. Elbows slightly in front of bar.",
    "instructions": "Brace core and glutes. Pull head back slightly to clear bar path, then press bar vertically overhead. Once bar passes forehead, push head through window and lock out overhead.",
    "technique": "Maintain a rigid torso pillar without excessive backward lumbar arching.",
    "breathing": "Inhale at bottom; brace and press; exhale at top lockout.",
    "commonMistakes": [
      "Over-arching lower back into an incline press",
      "Pressing bar forward rather than straight up",
      "Using leg drive (which makes it a push press)"
    ],
    "safetyNotes": "Ensure adequate thoracic spine and shoulder mobility before loading heavy.",
    "alternatives": [
      "Seated Dumbbell Shoulder Press",
      "Smith Machine Shoulder Press"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "5-8",
    "recommendedRest": 120,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids",
      "Triceps Brachii"
    ]
  },
  {
    "id": "seated-dumbbell-shoulder-press",
    "name": "Seated Dumbbell Shoulder Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Upper Chest"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "startingPosition": "Sit on upright bench (80-90 degrees). Kick dumbbells up to shoulder level with palms facing forward or slightly angled.",
    "instructions": "Press dumbbells vertically upward until arms are extended overhead without banging weights together. Lower smoothly to ear/chin height.",
    "technique": "Keep lower back pressed against seat pad and feet firmly planted on floor.",
    "breathing": "Inhale down; exhale pressing overhead.",
    "commonMistakes": [
      "Arching lower back off the pad",
      "Dropping dumbbells too fast"
    ],
    "safetyNotes": "Use knees to safely catch dumbbells when terminating set.",
    "alternatives": [
      "Standing Barbell Shoulder Press",
      "Arnold Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids"
    ]
  },
  {
    "id": "arnold-press",
    "name": "Arnold Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps",
      "Rotator Cuff"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "startingPosition": "Sit upright holding dumbbells at chest height with palms facing your body (supinated) like top of a bicep curl.",
    "instructions": "As you press overhead, rotate wrists smoothly so palms face forward at top lockout. Reverse rotation as you lower back to chin level.",
    "technique": "Continuous rotational movement stimulates all three deltoid heads throughout the arc.",
    "breathing": "Inhale lowering; exhale pressing and rotating up.",
    "commonMistakes": [
      "Choppy disjointed rotation",
      "Using excessively heavy weight"
    ],
    "safetyNotes": "Maintain smooth rotational control to protect rotator cuff.",
    "alternatives": [
      "Seated Dumbbell Press",
      "Machine Shoulder Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 75,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids",
      "Lateral Deltoids"
    ]
  },
  {
    "id": "machine-shoulder-press",
    "name": "Machine Shoulder Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Triceps"
    ],
    "equipment": "Weight Machines",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "startingPosition": "Adjust seat so handles start at ear/shoulder level. Plant feet firmly, back pressed to pad.",
    "instructions": "Press handles upward to full arm extension without locking elbows hard. Return under controlled tempo.",
    "technique": "Guided track provides safe shoulder loading without stabilization failure.",
    "breathing": "Exhale pressing up; inhale lowering down.",
    "commonMistakes": [
      "Shrugging traps up towards ears at top"
    ],
    "safetyNotes": "Adjust seat correctly to avoid excessive shoulder depression at bottom.",
    "alternatives": [
      "Seated Dumbbell Press",
      "Smith Machine Shoulder Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ]
  },
  {
    "id": "dumbbell-lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Lateral Abduction",
    "startingPosition": "Stand tall holding light dumbbells at sides, slight bend in elbows, slight forward lean (5-10 degrees).",
    "instructions": "Raise dumbbells out to the sides in the scapular plane until upper arms are parallel to floor. Lead with elbows, pause briefly at top, and lower under 2-second control.",
    "technique": "Do not raise weights higher than shoulder level to prevent impingement. Pour from pitcher mental cue.",
    "breathing": "Exhale raising outward; inhale lowering.",
    "commonMistakes": [
      "Swinging body to throw dumbbells up",
      "Using too heavy weight",
      "Shrugging traps"
    ],
    "safetyNotes": "Keep movement strictly in scapular plane (30 degrees forward of direct sides).",
    "alternatives": [
      "Cable Lateral Raise",
      "Machine Lateral Raise"
    ],
    "recommendedSets": "4-5",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Side Delts (Lateral Deltoids)",
    "subgroups": [
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Lateral Deltoids"
    ]
  },
  {
    "id": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Cable Machine",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Lateral Abduction",
    "startingPosition": "Set cable pulley to lowest position. Stand sideways to machine, grasp handle with far-side hand across body.",
    "instructions": "Raise handle out to side until arm reaches shoulder height. Feel constant tension from bottom to top. Lower under control.",
    "technique": "Unlike dumbbells, cable provides maximum muscular tension at the bottom stretched position.",
    "breathing": "Exhale raising out; inhale lowering across body.",
    "commonMistakes": [
      "Using torso momentum to jerk cable"
    ],
    "safetyNotes": "Use cuff attachments around wrist if grip fatigues.",
    "alternatives": [
      "Dumbbell Lateral Raise",
      "Machine Lateral Raise"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Side Delts (Lateral Deltoids)",
    "subgroups": [
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Lateral Deltoids"
    ]
  },
  {
    "id": "machine-lateral-raise",
    "name": "Machine Lateral Raise",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Weight Machines",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Lateral Abduction",
    "startingPosition": "Sit with chest against pad or upright, elbows placed against lateral raise arm pads.",
    "instructions": "Raise elbows out and upward against pads until upper arms are parallel to floor. Hold peak contraction 1 second, then lower slowly.",
    "technique": "Pads eliminate hand and forearm grip involvement, directing 100% load to lateral deltoid.",
    "breathing": "Exhale raising; inhale lowering.",
    "commonMistakes": [
      "Shrugging shoulders into ears"
    ],
    "safetyNotes": "Align machine axis of rotation directly with shoulder joint center.",
    "alternatives": [
      "Cable Lateral Raise",
      "Dumbbell Lateral Raise"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Side Delts (Lateral Deltoids)",
    "subgroups": [
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Lateral Deltoids"
    ]
  },
  {
    "id": "front-raise",
    "name": "Front Raise",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Upper Chest"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Anterior Flexion",
    "startingPosition": "Stand tall holding dumbbells resting on front of thighs with overhand or neutral grip.",
    "instructions": "Raise dumbbells forward in front of body until parallel to floor at eye level. Pause momentarily and lower under control.",
    "technique": "Avoid swinging torso back. Maintain soft elbow unlock throughout.",
    "breathing": "Exhale raising up; inhale lowering down.",
    "commonMistakes": [
      "Swinging hips for momentum",
      "Lifting way above head height"
    ],
    "safetyNotes": "Keep weights moderate to avoid anterior shoulder impingement.",
    "alternatives": [
      "Cable Front Raise",
      "Barbell Front Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids"
    ]
  },
  {
    "id": "rear-delt-fly",
    "name": "Rear Delt Fly",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Rhomboids",
      "Trapezius"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Abduction",
    "startingPosition": "Hinge forward at hips until torso is nearly parallel to floor holding light dumbbells below chest.",
    "instructions": "With slight bend in elbows, raise dumbbells out to sides squeezing rear delts at top. Lower weights slowly.",
    "technique": "Think about pushing dumbbells outward to walls rather than rowing them upward.",
    "breathing": "Exhale raising out; inhale lowering.",
    "commonMistakes": [
      "Bending elbows and turning into a row",
      "Using too heavy weight"
    ],
    "safetyNotes": "Support forehead against an incline bench to prevent lower back strain.",
    "alternatives": [
      "Reverse Pec Deck",
      "Face Pulls"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Rear Delts (Posterior Deltoids)",
    "subgroups": [
      "Rear Delts (Posterior Deltoids)"
    ],
    "primaryMuscles": [
      "Posterior Deltoids"
    ]
  },
  {
    "id": "reverse-pec-deck",
    "name": "Reverse Pec Deck",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "equipment": "Weight Machines",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Horizontal Abduction",
    "startingPosition": "Sit facing the pec deck machine pad. Adjust seat so arms are parallel to floor when grasping handles.",
    "instructions": "Push handles backward and outward in a wide arc using posterior deltoids. Squeeze shoulder blades together, then return under control.",
    "technique": "Keep arms nearly straight with soft elbows. Focus entirely on rear shoulder contraction.",
    "breathing": "Exhale pushing back; inhale returning forward.",
    "commonMistakes": [
      "Seat height incorrect",
      "Letting weights slam"
    ],
    "safetyNotes": "Keep wrist neutral throughout range.",
    "alternatives": [
      "Rear Delt Fly",
      "Face Pulls"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Rear Delts (Posterior Deltoids)",
    "subgroups": [
      "Rear Delts (Posterior Deltoids)"
    ],
    "primaryMuscles": [
      "Posterior Deltoids",
      "Rhomboids"
    ]
  },
  {
    "id": "upright-row",
    "name": "Upright Row",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius",
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Pull",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall holding barbell with overhand grip slightly wider than shoulder-width.",
    "instructions": "Pull barbell vertically along body up to chest height leading with elbows. Keep elbows higher than wrists at all times. Lower smoothly.",
    "technique": "Use a wide grip (shoulder-width or wider) to avoid internal rotation impingement associated with narrow grip.",
    "breathing": "Exhale pulling up; inhale lowering.",
    "commonMistakes": [
      "Grip too narrow",
      "Pulling bar up to neck height causing shoulder pinching"
    ],
    "safetyNotes": "Do not pull higher than mid-chest to protect rotator cuff tendons.",
    "alternatives": [
      "Dumbbell Lateral Raise",
      "Cable Upright Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Side Delts (Lateral Deltoids)",
    "subgroups": [
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Lateral Deltoids",
      "Upper Trapezius"
    ]
  },
  {
    "id": "dumbbell-shrugs",
    "name": "Dumbbell Shrugs",
    "muscle": "Back",
    "secondaryMuscles": [
      "Trapezius",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Scapular Elevation",
    "startingPosition": "Stand upright holding heavy dumbbells at sides with neutral grip, arms straight.",
    "instructions": "Elevate shoulders straight up towards ears as high as possible. Squeeze upper trapezius at top for 2 full seconds, then lower under control.",
    "technique": "Move straight up and down. Never roll shoulders in circles, which grinds cervical and shoulder joints.",
    "breathing": "Exhale shrugging up; inhale lowering.",
    "commonMistakes": [
      "Rolling shoulders in circles",
      "Bending elbows to pull weight"
    ],
    "safetyNotes": "Keep neck relaxed and head looking straight ahead.",
    "alternatives": [
      "Barbell Shrugs",
      "Cable Shrugs"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Traps (Trapezius)",
    "subgroups": [
      "Traps (Trapezius)"
    ],
    "primaryMuscles": [
      "Upper Trapezius"
    ]
  },
  {
    "id": "barbell-shrugs",
    "name": "Barbell Shrugs",
    "muscle": "Back",
    "secondaryMuscles": [
      "Trapezius",
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Scapular Elevation",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Hold barbell with overhand grip at shoulder-width, standing tall with shoulders retracted.",
    "instructions": "Shrug shoulders straight up towards ears. Hold peak contraction at top, then lower smoothly.",
    "technique": "Can handle heavy progressive overload; keep movement purely vertical.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Jerking weight with knees",
      "Rolling shoulders"
    ],
    "safetyNotes": "Use lifting straps on heavy sets to focus entirely on traps.",
    "alternatives": [
      "Dumbbell Shrugs",
      "Trap Bar Shrugs"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Traps (Trapezius)",
    "subgroups": [
      "Traps (Trapezius)"
    ],
    "primaryMuscles": [
      "Upper Trapezius"
    ]
  },
  {
    "id": "cable-shrugs",
    "name": "Cable Shrugs",
    "muscle": "Back",
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Cable Machine",
    "category": "Shoulders",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Scapular Elevation",
    "startingPosition": "Attach straight bar or handles to low cable pulley. Stand holding handles with arms straight.",
    "instructions": "Shrug shoulders up and slightly back against the cable angle. Squeeze traps hard, then lower smoothly.",
    "technique": "The angled line of pull matches the diagonal fiber orientation of upper traps.",
    "breathing": "Exhale shrugging; inhale lowering.",
    "commonMistakes": [
      "Bending elbows"
    ],
    "safetyNotes": "Maintain upright spine.",
    "alternatives": [
      "Dumbbell Shrugs",
      "Barbell Shrugs"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Traps (Trapezius)",
    "subgroups": [
      "Traps (Trapezius)"
    ],
    "primaryMuscles": [
      "Upper Trapezius"
    ]
  },
  {
    "id": "barbell-curl",
    "name": "Barbell Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms",
      "Brachialis"
    ],
    "equipment": "Barbell",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall with feet hip-width. Hold barbell with underhand shoulder-width grip, arms extended, elbows pinned by sides.",
    "instructions": "Curl barbell up towards shoulders keeping elbows stationary. Squeeze biceps hard at top contraction, then lower under 3-second control.",
    "technique": "Do not swing torso or sway backward. Only forearm should move around the elbow hinge.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Swinging lower back to gain momentum",
      "Letting elbows drift forward into front deltoid raise"
    ],
    "safetyNotes": "Switch to EZ-bar if straight barbell creates wrist discomfort.",
    "alternatives": [
      "EZ-Bar Curl",
      "Dumbbell Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10",
    "recommendedRest": 75,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Short Head & Long Head)"
    ]
  },
  {
    "id": "ez-bar-curl",
    "name": "EZ-Bar Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms",
      "Brachialis"
    ],
    "equipment": "EZ Bar",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Hold undulating EZ-bar on the inner angled grips with palms semi-supinated.",
    "instructions": "Curl bar up to chin level while keeping elbows tucked against ribs. Squeeze biceps, lower slowly.",
    "technique": "Angled grip places wrists in natural ergonomic alignment, reducing forearm splints.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Swinging body",
      "Flaring elbows outward"
    ],
    "safetyNotes": "Ideal for lifters prone to wrist strain on straight bars.",
    "alternatives": [
      "Barbell Curl",
      "Dumbbell Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii"
    ]
  },
  {
    "id": "dumbbell-curl",
    "name": "Dumbbell Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Stand or sit holding dumbbells at sides with palms facing forward.",
    "instructions": "Curl dumbbells simultaneously up towards shoulders. Squeeze biceps at peak, lower with control.",
    "technique": "Both arms work independently, preventing bilateral strength discrepancies.",
    "breathing": "Exhale curling up; inhale lowering.",
    "commonMistakes": [
      "Swinging torso",
      "Dropping weights fast"
    ],
    "safetyNotes": "Keep chest upright throughout.",
    "alternatives": [
      "Alternating Dumbbell Curl",
      "Cable Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii"
    ]
  },
  {
    "id": "alternating-dumbbell-curl",
    "name": "Alternating Dumbbell Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms",
      "Brachialis"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Stand holding dumbbells with neutral grip (palms facing body) at sides.",
    "instructions": "Curl one dumbbell up, supinating wrist (turning palm up) as it passes hip level. Squeeze at top, lower slowly while initiating curl with opposite arm.",
    "technique": "Supination against gravity activates the primary physiological function of the biceps brachii.",
    "breathing": "Exhale on each curl; inhale on each lower.",
    "commonMistakes": [
      "Leaning sideways toward working arm",
      "Failing to fully supinate wrist"
    ],
    "safetyNotes": "Keep core tight to eliminate lateral spinal sway.",
    "alternatives": [
      "Incline Dumbbell Curl",
      "Hammer Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12 each arm",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii"
    ]
  },
  {
    "id": "hammer-curl",
    "name": "Hammer Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Stand tall holding dumbbells at sides with neutral grip (palms facing each other) like holding a hammer.",
    "instructions": "Curl dumbbells up towards front deltoids keeping wrists strictly neutral. Squeeze brachialis and forearms, lower slowly.",
    "technique": "Heavily builds the brachialis muscle underneath the bicep, pushing bicep peak higher and expanding arm thickness.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Supinating wrists during curl",
      "Using swinging momentum"
    ],
    "safetyNotes": "Can handle heavier loads than traditional curls with zero wrist strain.",
    "alternatives": [
      "Cross-Body Hammer Curl",
      "Reverse Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Brachialis",
    "subgroups": [
      "Brachialis"
    ],
    "primaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ]
  },
  {
    "id": "cross-body-hammer-curl",
    "name": "Cross-Body Hammer Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Brachialis",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Stand holding dumbbells at sides with neutral palms-in grip.",
    "instructions": "Curl one dumbbell across chest towards opposite shoulder, keeping palm facing body. Squeeze brachialis hard, lower under control, then alternate.",
    "technique": "Cross-body angle maximizes brachialis activation and lateral bicep head emphasis.",
    "breathing": "Exhale across; inhale returning down.",
    "commonMistakes": [
      "Rotating shoulders forward during curl"
    ],
    "safetyNotes": "Maintain upright posture.",
    "alternatives": [
      "Hammer Curl",
      "Reverse Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12 each",
    "recommendedRest": 60,
    "subgroup": "Brachialis",
    "subgroups": [
      "Brachialis"
    ],
    "primaryMuscles": [
      "Brachialis",
      "Biceps Long Head"
    ]
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Long Head Biceps",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Sit on incline bench set to 45-60 degrees. Let dumbbells hang straight down behind torso with arms fully extended.",
    "instructions": "Curl dumbbells up while keeping upper arms pointed vertically toward floor. Squeeze biceps hard at top, lower under 3-second eccentric stretch.",
    "technique": "Puts the long head of the bicep into passive stretch behind torso, providing exceptional growth stimulus.",
    "breathing": "Exhale curling up; inhale stretching down.",
    "commonMistakes": [
      "Swinging elbows forward to cheat the stretch",
      "Lifting shoulders off bench"
    ],
    "safetyNotes": "Do not use excessively heavy weights to protect anterior shoulder capsule.",
    "alternatives": [
      "Bayesian Cable Curl",
      "Preacher Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Long Head",
    "subgroups": [
      "Biceps Long Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Long Head)"
    ]
  },
  {
    "id": "concentration-curl",
    "name": "Concentration Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Sit on bench edge, legs spread wide. Brace back of upper arm against inside of same-side thigh, dumbbell hanging down.",
    "instructions": "Curl dumbbell up towards face without moving the braced arm position. Squeeze bicep peak intensely for 1 second, lower smoothly.",
    "technique": "Thigh bracing completely eliminates body momentum, providing pure bicep peak isolation.",
    "breathing": "Exhale curling; inhale lowering.",
    "commonMistakes": [
      "Lifting elbow off thigh during curl",
      "Rocking torso"
    ],
    "safetyNotes": "Focus on maximum mind-muscle contraction.",
    "alternatives": [
      "Preacher Curl",
      "Spider Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Peak Short Head)"
    ]
  },
  {
    "id": "preacher-curl",
    "name": "Preacher Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Short Head Biceps",
      "Forearms"
    ],
    "equipment": "EZ Bar",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Sit at preacher bench with armpits resting firmly against top of angled pad. Grasp EZ-bar with underhand grip, arms extended.",
    "instructions": "Curl bar up towards shoulders without lifting elbows off pad. Squeeze biceps at top, lower slowly until arms are nearly straight (do not hyperextend).",
    "technique": "Pad eliminates cheat momentum and emphasizes short head of bicep and bottom tension.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Hyperextending elbows at bottom",
      "Lifting body off seat"
    ],
    "safetyNotes": "Stop 5 degrees short of full lockout at bottom to protect distal bicep tendon from rupture.",
    "alternatives": [
      "Machine Preacher Curl",
      "Spider Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Short Head Focus)"
    ]
  },
  {
    "id": "machine-preacher-curl",
    "name": "Machine Preacher Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Weight Machines",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Adjust seat so armpits sit comfortably on edge of angled preacher pad. Grasp machine handles.",
    "instructions": "Curl handles toward chin smoothly. Squeeze biceps, return with controlled tempo.",
    "technique": "Machine cam maintains constant resistance throughout the entire strength curve.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Slamming weight stack"
    ],
    "safetyNotes": "Maintain controlled descent to safeguard bicep tendons.",
    "alternatives": [
      "Preacher Curl",
      "Cable Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Short Head Focus)"
    ]
  },
  {
    "id": "cable-curl",
    "name": "Cable Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cable Machine",
    "category": "Biceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Attach straight or EZ-bar to low cable pulley. Stand facing machine holding bar with underhand grip.",
    "instructions": "Curl bar up while keeping elbows pinned to sides. Squeeze biceps against continuous cable tension, lower slowly.",
    "technique": "Continuous tension prevents bicep deloading at top or bottom.",
    "breathing": "Exhale curling up; inhale lowering.",
    "commonMistakes": [
      "Standing too close to pulley causing awkward angle"
    ],
    "safetyNotes": "Keep elbows tucked.",
    "alternatives": [
      "Barbell Curl",
      "Dumbbell Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii"
    ]
  },
  {
    "id": "reverse-curl",
    "name": "Reverse Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Brachioradialis",
      "Forearm Extensors"
    ],
    "equipment": "EZ Bar",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall holding EZ-bar or barbell with overhand (pronated, knuckles facing up) shoulder-width grip.",
    "instructions": "Curl bar up towards chest while keeping wrists straight and firm. Squeeze outer forearms and brachialis, lower under control.",
    "technique": "Pronated grip inhibits biceps brachii, forcing brachioradialis and forearm extensors to do the work.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Allowing wrists to collapse downward into flexion"
    ],
    "safetyNotes": "Use lighter weights to maintain strict wrist integrity.",
    "alternatives": [
      "Hammer Curl",
      "Reverse Barbell Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Brachioradialis",
      "Brachialis"
    ]
  },
  {
    "id": "spider-curl",
    "name": "Spider Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Short Head Biceps"
    ],
    "equipment": "Barbell",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie face down on an incline bench set to 45 degrees, chest supported, arms hanging straight down with barbell or EZ-bar.",
    "instructions": "Curl bar upward keeping upper arms completely vertical. Squeeze inner bicep heads hard at peak, lower under control.",
    "technique": "Zero possibility of cheating with back momentum; creates massive peak contraction.",
    "breathing": "Exhale curling; inhale lowering.",
    "commonMistakes": [
      "Swinging elbows back toward hips"
    ],
    "safetyNotes": "Ensure bench is stable.",
    "alternatives": [
      "Preacher Curl",
      "Concentration Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Short Head",
    "subgroups": [
      "Biceps Short Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Peak Short Head)"
    ]
  },
  {
    "id": "bayesian-cable-curl",
    "name": "Bayesian Cable Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Long Head Biceps"
    ],
    "equipment": "Cable Machine",
    "category": "Biceps",
    "difficulty": "Advanced",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Set low cable pulley. Stand facing away from machine holding D-handle behind torso in extended arm position.",
    "instructions": "Take a step forward to stretch the bicep. Curl handle forward and up while keeping elbow behind torso, then extend back to full stretch.",
    "technique": "Provides maximum tension in the extreme lengthened stretch position of the long bicep head.",
    "breathing": "Exhale curling forward; inhale returning back.",
    "commonMistakes": [
      "Stepping too far forward losing balance"
    ],
    "safetyNotes": "Warm up thoroughly before loading heavy in full stretch.",
    "alternatives": [
      "Incline Dumbbell Curl",
      "Cable Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Biceps Long Head",
    "subgroups": [
      "Biceps Long Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Long Head - Lengthened Position)"
    ]
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close-Grip Bench Press",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on bench. Grip barbell with hands shoulder-width apart (roughly 12-14 inches apart, not touching).",
    "instructions": "Unrack bar, tuck elbows close to ribcage, lower bar to lower sternum. Drive bar upward by forcefully contracting triceps to full arm extension.",
    "technique": "Grip should be shoulder-width; grips narrower than 8 inches cause severe wrist shear without added tricep gain.",
    "breathing": "Inhale lowering; exhale pressing forcefully.",
    "commonMistakes": [
      "Hands placed too close together",
      "Flaring elbows outward"
    ],
    "safetyNotes": "Keep wrists straight and stacked over elbows.",
    "alternatives": [
      "Dips",
      "JM Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Lateral & Medial Heads)",
      "Pectoralis Major"
    ]
  },
  {
    "id": "tricep-rope-pushdown",
    "name": "Tricep Rope Pushdown",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Lateral Head Triceps"
    ],
    "equipment": "Cable Machine",
    "category": "Triceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Attach rope to high cable pulley. Stand with slight forward torso lean, elbows tucked at sides bent at 90 degrees.",
    "instructions": "Push rope down extending elbows fully. At bottom, spread rope ends outward apart, forcefully contracting lateral triceps. Control return to chest height.",
    "technique": "Elbows must remain glued to sides; do not allow upper arms to swing forward and back.",
    "breathing": "Exhale pushing down; inhale returning up.",
    "commonMistakes": [
      "Using shoulder momentum to heave down",
      "Elbows drifting forward and back"
    ],
    "safetyNotes": "Keep wrists rigid at bottom spread.",
    "alternatives": [
      "Straight-Bar Cable Pushdown",
      "Overhead Cable Tricep Extension"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Lateral Head)"
    ]
  },
  {
    "id": "straight-bar-cable-pushdown",
    "name": "Straight-Bar Cable Pushdown",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Medial Head Triceps"
    ],
    "equipment": "Cable Machine",
    "category": "Triceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Grip straight or V-bar on high cable pulley with overhand grip, elbows tight to ribs.",
    "instructions": "Press bar down until arms are fully locked out. Squeeze triceps, then control return to 90 degrees.",
    "technique": "Enables heavier progressive overload than the rope attachment.",
    "breathing": "Exhale pushing down; inhale returning up.",
    "commonMistakes": [
      "Standing too far away",
      "Allowing shoulders to roll forward"
    ],
    "safetyNotes": "Keep spine neutral.",
    "alternatives": [
      "Tricep Rope Pushdown",
      "Dips"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Lateral Head)"
    ]
  },
  {
    "id": "skull-crushers",
    "name": "Skull Crushers",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Long Head Triceps"
    ],
    "equipment": "EZ Bar",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on bench holding EZ-bar overhead with narrow overhand grip, arms angled slightly backward towards head (not straight vertical).",
    "instructions": "Keeping upper arms stationary, bend elbows to lower bar smoothly down towards forehead or crown of head. Extend elbows forcefully to return to angled lockout.",
    "technique": "Angling upper arms backward 10-15 degrees keeps continuous tension on triceps at top lockout.",
    "breathing": "Inhale lowering bar towards head; exhale extending arms.",
    "commonMistakes": [
      "Flaring elbows outward",
      "Moving upper arms back and forth like a pullover"
    ],
    "safetyNotes": "Maintain strict control over descent to safeguard skull and elbows.",
    "alternatives": [
      "Overhead Dumbbell Tricep Extension",
      "Close-Grip Bench Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Long Head",
    "subgroups": [
      "Long Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Long Head)"
    ]
  },
  {
    "id": "overhead-dumbbell-tricep-extension",
    "name": "Overhead Dumbbell Tricep Extension",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Long Head Triceps"
    ],
    "equipment": "Dumbbell",
    "category": "Triceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Sit upright on bench. Cup heavy dumbbell vertically with both hands under upper plate weight overhead.",
    "instructions": "Lower dumbbell behind head by bending elbows until forearms touch biceps. Drive weight back overhead to full arm lockout.",
    "technique": "Overhead arm position places long head of triceps under maximum stretch, stimulating hypertrophy.",
    "breathing": "Inhale lowering behind head; exhale pressing overhead.",
    "commonMistakes": [
      "Flaring elbows wide",
      "Arching lower back excessively"
    ],
    "safetyNotes": "Ensure palms are firmly cupped under dumbbell plate before lifting.",
    "alternatives": [
      "Overhead Cable Tricep Extension",
      "Skull Crushers"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Long Head",
    "subgroups": [
      "Long Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Long Head)"
    ]
  },
  {
    "id": "overhead-cable-tricep-extension",
    "name": "Overhead Cable Tricep Extension",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Long Head Triceps"
    ],
    "equipment": "Cable Machine",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Set pulley to chest height. Attach rope, face away from machine, hold rope behind head with elbows pointed forward.",
    "instructions": "Step into a forward lunge stance. Extend arms forward and upward until arms are straight. Spread rope slightly, return under control.",
    "technique": "Provides constant resistance through the entire deep stretch range without dumping weight on elbows.",
    "breathing": "Exhale extending; inhale returning.",
    "commonMistakes": [
      "Letting cable yank arms backward too quickly"
    ],
    "safetyNotes": "Keep core braced to protect lower back.",
    "alternatives": [
      "Overhead Dumbbell Extension",
      "Skull Crushers"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Long Head",
    "subgroups": [
      "Long Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Long Head)"
    ]
  },
  {
    "id": "dips",
    "name": "Dips",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "startingPosition": "Mount parallel dip bars with arms straight and torso completely vertical. Legs bent or crossed.",
    "instructions": "Lower body by bending elbows straight back, keeping torso upright. Lower until upper arms reach parallel with floor, then push through palms to lockout.",
    "technique": "To isolate triceps over chest, maintain an upright vertical torso and keep elbows tucked close to body.",
    "breathing": "Inhale down; exhale pushing up.",
    "commonMistakes": [
      "Leaning forward (which activates chest)",
      "Going too deep causing anterior shoulder impingement"
    ],
    "safetyNotes": "Avoid bouncing at bottom of dip.",
    "alternatives": [
      "Close-Grip Bench Press",
      "Bench Dips"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Medial Head",
    "subgroups": [
      "Medial Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Medial & Lateral Heads)",
      "Pectoralis Major"
    ]
  },
  {
    "id": "bench-dips",
    "name": "Bench Dips",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "category": "Triceps",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "startingPosition": "Sit on bench edge, hands gripping edge beside hips. Extend legs out with heels on floor.",
    "instructions": "Slide hips forward off bench. Bend elbows lowering hips straight down until elbows reach 90 degrees. Push through palms to return to top.",
    "technique": "Keep back skimming close to bench edge to prevent shoulder strain.",
    "breathing": "Inhale lowering; exhale pressing up.",
    "commonMistakes": [
      "Letting hips drift far forward from bench",
      "Shoulders rolling forward"
    ],
    "safetyNotes": "Elevate feet on second bench to increase intensity, but do not exceed 90-degree elbow bend.",
    "alternatives": [
      "Dips",
      "Straight-Bar Pushdown"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Medial Head",
    "subgroups": [
      "Medial Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Medial Head)"
    ]
  },
  {
    "id": "kickbacks",
    "name": "Kickbacks",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "equipment": "Dumbbell",
    "category": "Triceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Hinge forward with one knee on bench, upper arm held parallel to torso, elbow bent at 90 degrees with dumbbell.",
    "instructions": "Keeping upper arm completely fixed against ribcage, extend forearm straight backward until arm is fully extended. Squeeze tricep hard, lower back to 90 degrees.",
    "technique": "Peak contraction occurs at full horizontal lockout; use light weights with strict tempo.",
    "breathing": "Exhale extending arm; inhale returning.",
    "commonMistakes": [
      "Dropping upper arm down into a swing",
      "Using heavy weight and yanking"
    ],
    "safetyNotes": "Keep neck in neutral alignment.",
    "alternatives": [
      "Cable Tricep Kickback",
      "Tricep Rope Pushdown"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Lateral Head)"
    ]
  },
  {
    "id": "jm-press",
    "name": "JM Press",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Triceps",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Hybrid Press-Extension",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie on flat bench gripping barbell with narrow shoulder-width grip, bar held directly over chest.",
    "instructions": "Lower bar down towards throat/upper chest by bending elbows while allowing elbows to point slightly forward, hybridizing a close-grip press and skull crusher. Drive back up explosively.",
    "technique": "Legendary powerlifting movement for developing monstrous lockout strength.",
    "breathing": "Inhale down; exhale pressing up.",
    "commonMistakes": [
      "Turning it into an ordinary close-grip press"
    ],
    "safetyNotes": "Master light weights before loading heavy.",
    "alternatives": [
      "Close-Grip Bench Press",
      "Skull Crushers"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ]
  },
  {
    "id": "tate-press",
    "name": "Tate Press",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Chest"
    ],
    "equipment": "Dumbbell",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Tricep Extension",
    "startingPosition": "Lie flat on bench holding dumbbells overhead, elbows pointing out to sides, dumbbell inner heads touching.",
    "instructions": "Bend elbows inward lowering dumbbells towards sternum so weights touch chest. Extend triceps outwards and upwards back to top.",
    "technique": "Isolates medial and lateral tricep heads from unique transverse plane.",
    "breathing": "Inhale lowering; exhale pressing up.",
    "commonMistakes": [
      "Flaring wrists awkwardly"
    ],
    "safetyNotes": "Control weights carefully on chest.",
    "alternatives": [
      "Skull Crushers",
      "JM Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii (Lateral Head Focus)"
    ]
  },
  {
    "id": "barbell-back-squat",
    "name": "Barbell Back Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Quadriceps",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Squat",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Barbell resting firmly on upper trapezius. Feet shoulder-width apart, toes turned outward 15-30 degrees. Chest high, core braced.",
    "instructions": "Hinge hips back and bend knees outward tracking over toes. Descend until hip crease is parallel with or below knees. Drive forcefully through midfoot to return to standing.",
    "technique": "Maintain neutral spine and rigid abdominal brace via Valsalva maneuver throughout descent and ascent.",
    "breathing": "Deep diaphragmatic breath at top; hold brace down and up; exhale at standing lockout.",
    "commonMistakes": [
      "Knees caving inward (valgus collapse)",
      "Heels lifting off floor",
      "Rounding lumbar spine (\"butt wink\")"
    ],
    "safetyNotes": "Always squat inside a power rack with safety spotter arms set at appropriate depth.",
    "alternatives": [
      "Front Squat",
      "Goblet Squat",
      "Hack Squat"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "5-8",
    "recommendedRest": 180,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "front-squat",
    "name": "Front Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Upper Back",
      "Core",
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Quadriceps",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Squat",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Rest bar across anterior deltoids and clavicles using clean grip (fingertips under bar, elbows held high) or cross-arm grip.",
    "instructions": "Squat down keeping torso strictly vertical. Descend to full depth, then drive straight up leading with elbows.",
    "technique": "Vertical torso mechanics shift immense overload directly onto quadriceps and upper spinal erectors.",
    "breathing": "Inhale deep into belly at top; brace throughout; exhale at top.",
    "commonMistakes": [
      "Dropping elbows, which causes bar to roll forward off shoulders",
      "Excessive forward hip hinge"
    ],
    "safetyNotes": "Dump bar forward onto safety pins if balance fails.",
    "alternatives": [
      "Barbell Back Squat",
      "Goblet Squat",
      "Zercher Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-8",
    "recommendedRest": 120,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps (Rectus Femoris, Vastus Lateralis)",
      "Core"
    ]
  },
  {
    "id": "goblet-squat",
    "name": "Goblet Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Dumbbell",
    "category": "Quadriceps",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Squat",
    "startingPosition": "Hold single dumbbell or kettlebell vertically against sternum, cupping upper weight with both palms, elbows tucked.",
    "instructions": "Squat down between knees keeping chest high and elbows inside knees at bottom. Stand up driving through whole foot.",
    "technique": "Superb squat teaching movement that naturally enforces an upright torso and deep mobility.",
    "breathing": "Inhale descending; exhale driving upward.",
    "commonMistakes": [
      "Allowing dumbbell to pull torso forward",
      "Knees collapsing inward"
    ],
    "safetyNotes": "Ideal for beginners and rehabilitation.",
    "alternatives": [
      "Front Squat",
      "Barbell Back Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "hack-squat",
    "name": "Hack Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Weight Machines",
    "category": "Quadriceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Squat",
    "startingPosition": "Position shoulders under pads on 45-degree hack squat machine, back flat against pad, feet shoulder-width on platform.",
    "instructions": "Release safety handles. Squat down until knees reach 90 degrees or below. Drive through platform to return to top without locking knees.",
    "technique": "Back support eliminates spinal shear, allowing ruthless quad overload and high rep intensity.",
    "breathing": "Inhale lowering down; exhale pressing up.",
    "commonMistakes": [
      "Heels coming off footplate",
      "Hyperextending knees at top"
    ],
    "safetyNotes": "Always keep safety catches in reach.",
    "alternatives": [
      "Barbell Back Squat",
      "Leg Press (45-Degree)"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps (Vastus Medialis / Teardrop & Lateralis)"
    ]
  },
  {
    "id": "leg-press-45-degree",
    "name": "Leg Press (45-Degree)",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Calves"
    ],
    "equipment": "Weight Machines",
    "category": "Quadriceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Carriage Extension",
    "isLegPress45": true,
    "startingPosition": "Sit in 45-degree leg press machine with back and hips firmly against backrest. Feet shoulder-width apart in center of platform. Disengage safety levers.",
    "instructions": "Lower sled with control until knees reach 90 degrees without lower back peeling off pad. Push through midfoot and heels to drive sled back up. Stop just short of complete knee lockout.",
    "technique": "Special Calculation Rule: Sled base weight is strictly excluded (sled = 0 kg / 0 lbs). Total calculated lifting weight includes loaded plates only.",
    "breathing": "Inhale deep into abdomen descending; exhale forcefully driving sled upward.",
    "commonMistakes": [
      "Hyperextending and locking out knees at top (severe joint injury hazard)",
      "Allowing lower back to curl off seat at bottom",
      "Quarter reps with ego weight"
    ],
    "safetyNotes": "Keep hands on safety side handles. Never place hands on knees during press.",
    "alternatives": [
      "Horizontal Leg Press",
      "Hack Squat",
      "Barbell Back Squat"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "8-15",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps"
    ]
  },
  {
    "id": "horizontal-leg-press",
    "name": "Horizontal Leg Press",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Weight Machines",
    "category": "Quadriceps",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Carriage Extension",
    "startingPosition": "Sit in seated horizontal leg press machine with feet flat on platform at shoulder width.",
    "instructions": "Push platform until legs are extended without locking knees. Slowly lower weight back until knees form 90 degrees.",
    "technique": "Standard pin-loaded or sled system with horizontal trajectory.",
    "breathing": "Exhale pressing; inhale returning.",
    "commonMistakes": [
      "Knee lockout",
      "Rounding hips"
    ],
    "safetyNotes": "Adjust backrest angle for comfortable hip flexion.",
    "alternatives": [
      "Leg Press (45-Degree)",
      "Goblet Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "leg-extension",
    "name": "Leg Extension",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Rectus Femoris"
    ],
    "equipment": "Weight Machines",
    "category": "Quadriceps",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Knee Extension",
    "startingPosition": "Sit on machine with back against pad, roller pad resting snugly on lower shins just above ankles. Align knee joint with machine pivot axis.",
    "instructions": "Extend legs upward until legs are straight, forcefully contracting quadriceps at peak for 1 second. Lower weight under controlled 3-second cadence.",
    "technique": "Directly isolates all four quad heads with zero hip hinge involvement.",
    "breathing": "Exhale extending up; inhale lowering down.",
    "commonMistakes": [
      "Kicking legs up using momentum",
      "Allowing weight stack to slam between reps"
    ],
    "safetyNotes": "Do not hyperextend knees at top if you experience patellar tracking discomfort.",
    "alternatives": [
      "Sissy Squats",
      "Goblet Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps (Rectus Femoris Isolation)"
    ]
  },
  {
    "id": "walking-lunges",
    "name": "Walking Lunges",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "equipment": "Dumbbell",
    "category": "Quadriceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Lunge",
    "startingPosition": "Stand tall holding dumbbells at sides or with bodyweight.",
    "instructions": "Take a long stride forward. Lower hips until back knee hovers 1 inch above floor, front thigh parallel to floor. Drive through front heel to step directly into next forward stride.",
    "technique": "Keep torso upright and front knee tracking directly over toes, avoiding lateral wobble.",
    "breathing": "Inhale descending; exhale rising into next step.",
    "commonMistakes": [
      "Short strides causing knee to push excessively past toes",
      "Banging back knee on floor"
    ],
    "safetyNotes": "Maintain pelvic alignment.",
    "alternatives": [
      "Reverse Lunges",
      "Bulgarian Split Squats"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12 per leg",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "reverse-lunges",
    "name": "Reverse Lunges",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Dumbbell",
    "category": "Quadriceps",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Lunge",
    "startingPosition": "Stand tall holding dumbbells with feet together.",
    "instructions": "Step one foot backward, lowering hips until front thigh is parallel to floor. Push through front heel to return to standing position.",
    "technique": "Gentler on patellar tendon than forward lunges because front shin stays more vertical.",
    "breathing": "Inhale stepping back; exhale pushing up.",
    "commonMistakes": [
      "Dragging back foot"
    ],
    "safetyNotes": "Superior choice for lifters with knee sensitivity.",
    "alternatives": [
      "Walking Lunges",
      "Bulgarian Split Squats"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12 per leg",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "bulgarian-split-squats",
    "name": "Bulgarian Split Squats",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Adductors"
    ],
    "equipment": "Dumbbell",
    "category": "Quadriceps",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Lunge",
    "startingPosition": "Stand 2 feet in front of a flat bench. Place top of rear foot on bench pad, holding dumbbells at sides.",
    "instructions": "Descend until front thigh is parallel to floor and rear knee hovers 1-2 inches above ground. Drive through front heel to return to top.",
    "technique": "Torso upright focuses on quadriceps; slight forward torso lean shifts focus to glutes.",
    "breathing": "Inhale down; exhale driving up.",
    "commonMistakes": [
      "Hopping front foot during set",
      "Pushing off rear foot instead of loading front leg"
    ],
    "safetyNotes": "Test foot distance without weights first to establish balance.",
    "alternatives": [
      "Reverse Lunges",
      "Step-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12 each leg",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "step-ups",
    "name": "Step-ups",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "equipment": "Dumbbell",
    "category": "Quadriceps",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Lunge",
    "startingPosition": "Stand in front of a sturdy plyo box or bench (knee height) holding dumbbells.",
    "instructions": "Place entire front foot on box. Drive through heel to elevate body to standing on box without pushing off bottom foot. Lower with control.",
    "technique": "Minimize push-off from the trailing floor foot to ensure lead leg does all the work.",
    "breathing": "Exhale stepping up; inhale stepping down.",
    "commonMistakes": [
      "Pushing off rear calf"
    ],
    "safetyNotes": "Ensure stepping platform is rock-solid and stable.",
    "alternatives": [
      "Bulgarian Split Squats",
      "Reverse Lunges"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12 per leg",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "sissy-squats",
    "name": "Sissy Squats",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Rectus Femoris",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Quadriceps",
    "difficulty": "Advanced",
    "type": "Isolation",
    "movementPattern": "Knee Extension",
    "startingPosition": "Secure feet inside sissy squat machine pad, or hold onto support post with bodyweight.",
    "instructions": "Lean torso back in line with thighs while pushing knees forward and bending deeply. Drive through toes and balls of feet to return to standing.",
    "technique": "Creates extreme loaded stretch on rectus femoris and patellar tendon.",
    "breathing": "Inhale descending back; exhale driving forward to standing.",
    "commonMistakes": [
      "Bending at hips instead of knees"
    ],
    "safetyNotes": "Start with bodyweight to build tendon tolerance.",
    "alternatives": [
      "Leg Extension",
      "Hack Squat"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps (Extreme Knee Flexion Tension)"
    ]
  },
  {
    "id": "zercher-squat",
    "name": "Zercher Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Upper Back",
      "Core",
      "Glutes",
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Quadriceps",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Squat",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Cradle barbell in crooks of elbows against chest, hands clasped together, feet shoulder-width.",
    "instructions": "Squat down between knees keeping chest proud and upright. Touch elbows to thighs at parallel depth, then stand up.",
    "technique": "Tremendous anterior loading forces extreme core and quad activation.",
    "breathing": "Inhale deep and brace before descent; exhale at top.",
    "commonMistakes": [
      "Rounding upper thoracic spine"
    ],
    "safetyNotes": "Wear long sleeves or use bar pad for arm comfort.",
    "alternatives": [
      "Front Squat",
      "Goblet Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-8",
    "recommendedRest": 120,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Upper Back",
      "Core"
    ]
  },
  {
    "id": "belt-squat",
    "name": "Belt Squat",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Weight Machines",
    "category": "Quadriceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Squat",
    "startingPosition": "Attach dip belt around hips connected to low cable machine or dedicated belt squat platform.",
    "instructions": "Squat down deeply with upright posture. Push through feet to standing.",
    "technique": "Completely unloads the spine and shoulders while delivering 100% of the load directly to the pelvis and legs.",
    "breathing": "Inhale down; exhale up.",
    "commonMistakes": [
      "Leaning too far back"
    ],
    "safetyNotes": "Gold standard for squatting with back or shoulder injuries.",
    "alternatives": [
      "Hack Squat",
      "Goblet Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps Isolation (Zero Spinal Loading)"
    ]
  },
  {
    "id": "stiff-legged-deadlift",
    "name": "Stiff-Legged Deadlift",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Barbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall with bar in hands, knees nearly straight with minimal soft bend.",
    "instructions": "Hinge forward at hips keeping knees completely locked in minimal bend. Lower bar towards tops of feet until hamstrings reach extreme stretch, then pull through glutes to standing.",
    "technique": "Differs from RDL by keeping hips higher and bar starting directly from floor or extreme stretch.",
    "breathing": "Inhale down; exhale up.",
    "commonMistakes": [
      "Rounding back to reach floor",
      "Bending knees into standard deadlift"
    ],
    "safetyNotes": "Only go as low as hamstring flexibility allows with flat spine.",
    "alternatives": [
      "Romanian Deadlift",
      "Good Mornings"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (Biceps Femoris, Semitendinosus)",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "lying-leg-curl",
    "name": "Lying Leg Curl",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Weight Machines",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Knee Flexion",
    "startingPosition": "Lie face down on machine with roller pad positioned just below calves against Achilles tendons. Grasp handles.",
    "instructions": "Curl roller pad up towards glutes by flexing knees. Hold peak contraction 1 second, then lower under 3-second control.",
    "technique": "Keep hips pressed firmly down against pad; do not allow lower back to arch upward during curl.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Hips lifting off the bench during the squeeze",
      "Kicking weights up rapidly"
    ],
    "safetyNotes": "Align knee joints with pivot point of machine.",
    "alternatives": [
      "Seated Leg Curl",
      "Nordic Hamstring Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (All Three Heads)"
    ]
  },
  {
    "id": "seated-leg-curl",
    "name": "Seated Leg Curl",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Weight Machines",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Knee Flexion",
    "startingPosition": "Sit in machine with back against pad, thigh stabilizer pad locked down firmly over quads. Roller pad on back of lower shins.",
    "instructions": "Flex knees driving heels down and back under seat. Squeeze hamstrings hard, then slowly allow legs to return to extended stretch.",
    "technique": "Seated hip flexion stretches hamstrings at the pelvis, leading to superior hypertrophy compared to lying curls.",
    "breathing": "Exhale curling down; inhale returning up.",
    "commonMistakes": [
      "Thigh pad not locked down tightly",
      "Slouching"
    ],
    "safetyNotes": "Maintain controlled cadence on return.",
    "alternatives": [
      "Lying Leg Curl",
      "Romanian Deadlift"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (Lengthened Hip Flexion Position)"
    ]
  },
  {
    "id": "standing-single-leg-curl",
    "name": "Standing Single-Leg Curl",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Weight Machines",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Knee Flexion",
    "startingPosition": "Stand facing machine with front of thigh against pad and roller behind lower shin of one leg.",
    "instructions": "Curl heel upward towards glute. Squeeze, then lower slowly. Complete reps on both sides.",
    "technique": "Eliminates left-right strength discrepancies.",
    "breathing": "Exhale curling; inhale lowering.",
    "commonMistakes": [
      "Arching back"
    ],
    "safetyNotes": "Keep torso still.",
    "alternatives": [
      "Lying Leg Curl",
      "Seated Leg Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15 each",
    "recommendedRest": 60,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (Unilateral Focus)"
    ]
  },
  {
    "id": "nordic-hamstring-curl",
    "name": "Nordic Hamstring Curl",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Calves",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Hamstrings & Glutes",
    "difficulty": "Advanced",
    "type": "Isolation",
    "movementPattern": "Knee Flexion",
    "startingPosition": "Kneel on pad with ankles securely anchored under barbell or held firmly by a partner. Torso straight.",
    "instructions": "Slowly lower body forward towards floor maintaining straight line from knees to head, resisting solely with hamstrings. Catch self with hands on floor, push off lightly to return.",
    "technique": "Peak eccentric hamstring strength builder, proven in sports science to dramatically reduce hamstring tears.",
    "breathing": "Inhale lowering under control; exhale pushing back.",
    "commonMistakes": [
      "Bending at hips into a hinge instead of resisting with knees"
    ],
    "safetyNotes": "Use hands on floor to brake descent smoothly.",
    "alternatives": [
      "Glute Ham Raise",
      "Lying Leg Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "5-8",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings (Eccentric Overload)"
    ]
  },
  {
    "id": "good-mornings",
    "name": "Good Mornings",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Spinal Erectors",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Rest barbell across upper back as in back squat. Stand with soft knees and chest high.",
    "instructions": "Hinge hips backward allowing torso to lean forward towards parallel to floor while keeping spine rigidly flat. Drive hips forward to return to standing.",
    "technique": "Pure posterior chain hinge. Keep weight light to moderate.",
    "breathing": "Inhale hinging down; exhale standing up.",
    "commonMistakes": [
      "Rounding back",
      "Squatting with knees"
    ],
    "safetyNotes": "Never perform to technical failure.",
    "alternatives": [
      "Romanian Deadlift",
      "Back Extensions"
    ],
    "recommendedSets": "3",
    "recommendedReps": "8-10",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings",
      "Erector Spinae",
      "Glutes"
    ]
  },
  {
    "id": "hip-thrust",
    "name": "Hip Thrust",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hip Extension",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Sit on floor with upper back against flat bench. Roll padded barbell over hips. Feet flat on floor, shoulder-width apart.",
    "instructions": "Drive through heels to extend hips upward until thighs and torso form a straight horizontal line parallel to floor, shins vertical. Squeeze glutes intensely for 2 seconds at top, lower with control.",
    "technique": "Keep chin tucked looking forward, not up at ceiling, to maintain posterior pelvic tilt.",
    "breathing": "Inhale lowering hips; exhale driving hips upward.",
    "commonMistakes": [
      "Hyperextending lumbar spine instead of extending hips",
      "Feet placed too far forward or back"
    ],
    "safetyNotes": "Always use a thick barbell pad or foam roll across hip bones.",
    "alternatives": [
      "Barbell Glute Bridge",
      "Cable Pull-Through"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus",
      "Gluteus Medius"
    ]
  },
  {
    "id": "barbell-glute-bridge",
    "name": "Barbell Glute Bridge",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Hip Extension",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on floor with knees bent and feet flat. Position padded barbell across hips.",
    "instructions": "Drive heels into floor to bridge hips up until knees, hips, and shoulders align. Squeeze glutes for 2 seconds, lower slowly.",
    "technique": "Floor limit prevents hyperextension, making it ideal for pure glute recruitment.",
    "breathing": "Exhale bridging up; inhale lowering.",
    "commonMistakes": [
      "Pushing through toes rather than heels"
    ],
    "safetyNotes": "Pad the bar adequately.",
    "alternatives": [
      "Hip Thrust",
      "Cable Glute Kickback"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus"
    ]
  },
  {
    "id": "cable-glute-kickback",
    "name": "Cable Glute Kickback",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Cable Machine",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Hip Extension",
    "startingPosition": "Attach ankle cuff to low pulley. Face machine holding upright support bar, slight forward torso lean.",
    "instructions": "Extend working leg straight back and slightly outward in a 45-degree angle. Squeeze glute firmly at full extension, return under control.",
    "technique": "Do not arch lower back; movement must come entirely from hip extension.",
    "breathing": "Exhale kicking back; inhale returning.",
    "commonMistakes": [
      "Swinging torso back and forth",
      "Arching lumbar spine"
    ],
    "safetyNotes": "Use light weight with strict mind-muscle contraction.",
    "alternatives": [
      "Hip Thrust",
      "Hyperextensions"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15 each",
    "recommendedRest": 60,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus (Upper Division)"
    ]
  },
  {
    "id": "hyperextensions",
    "name": "Hyperextensions",
    "muscle": "Back",
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Weight Machines",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Hinge",
    "startingPosition": "Position on 45-degree bench with pad set just below hip crease, toes turned slightly out.",
    "instructions": "Round upper back slightly, hinge at hips to descend, then squeeze glutes hard to bring torso in line with legs.",
    "technique": "Rounding upper back and turning toes out de-emphasizes erectors and maximizes glute isolation.",
    "breathing": "Inhale down; exhale rising.",
    "commonMistakes": [
      "Arching back backwards past straight alignment"
    ],
    "safetyNotes": "Control tempo.",
    "alternatives": [
      "Back Extensions",
      "Romanian Deadlift"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lower Back",
    "subgroups": [
      "Lower Back"
    ],
    "primaryMuscles": [
      "Lower Erector Spinae",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "glute-ham-raise",
    "name": "Glute Ham Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Calves",
      "Spinal Erectors"
    ],
    "equipment": "Weight Machines",
    "category": "Hamstrings & Glutes",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Knee Flexion & Hip Extension",
    "startingPosition": "Position on GHD apparatus with thighs on round pad and feet secured between rollers.",
    "instructions": "Lower body horizontally until parallel to floor, then pull with hamstrings and glutes to curl torso up to upright vertical.",
    "technique": "Simultaneously trains both functions of the hamstrings (hip extension and knee flexion).",
    "breathing": "Inhale lowering; exhale curling up.",
    "commonMistakes": [
      "Breaking at hips rather than curling with knees"
    ],
    "safetyNotes": "Use band assistance if needed.",
    "alternatives": [
      "Nordic Hamstring Curl",
      "Lying Leg Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "6-10",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings",
      "Gluteus Maximus",
      "Calves"
    ]
  },
  {
    "id": "cable-pull-through",
    "name": "Cable Pull-Through",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Cable Machine",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Hinge",
    "startingPosition": "Straddle low pulley with rope attachment facing away from machine. Walk forward 3 steps.",
    "instructions": "Hinge at hips pushing buttocks backward between legs. Snap hips forward to standing, squeezing glutes tightly at top.",
    "technique": "Teaches perfect hip hinge mechanics with horizontal cable resistance vector.",
    "breathing": "Inhale hinging back; exhale snapping forward.",
    "commonMistakes": [
      "Squatting instead of hinging"
    ],
    "safetyNotes": "Maintain flat spine.",
    "alternatives": [
      "Kettlebell Swing",
      "Romanian Deadlift"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ]
  },
  {
    "id": "dumbbell-romanian-deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Lower Back",
      "Forearms"
    ],
    "equipment": "Dumbbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hinge",
    "startingPosition": "Hold dumbbells in front of thighs with palms facing body, feet hip-width.",
    "instructions": "Hinge hips backward skimming dumbbells down front of shins until hamstrings are fully stretched. Drive hips forward to standing.",
    "technique": "Allows natural hand trajectory that accommodates individual shoulder and hip anatomy.",
    "breathing": "Inhale down; exhale up.",
    "commonMistakes": [
      "Rounding back"
    ],
    "safetyNotes": "Keep weights close to legs.",
    "alternatives": [
      "Romanian Deadlift",
      "Stiff-Legged Deadlift"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings",
      "Gluteus Maximus"
    ]
  },
  {
    "id": "frog-pumps",
    "name": "Frog Pumps",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Adductors"
    ],
    "equipment": "Bodyweight",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Hip Extension",
    "startingPosition": "Lie on back, soles of feet pressed together with knees flared outward (butterfly position).",
    "instructions": "Bridge hips up driving soles of feet together. Squeeze glutes at peak for 1 second, lower tap floor, and repeat in high reps.",
    "technique": "External hip rotation directly isolates gluteus maximus without hamstring involvement.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Short half reps"
    ],
    "safetyNotes": "Great as a burnout or activation finisher.",
    "alternatives": [
      "Barbell Glute Bridge",
      "Hip Thrust"
    ],
    "recommendedSets": "3",
    "recommendedReps": "20-30",
    "recommendedRest": 45,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus"
    ]
  },
  {
    "id": "standing-calf-raise",
    "name": "Standing Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Weight Machines",
    "category": "Calves",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Place balls of feet on block with heels hanging off. Shoulder pads resting on shoulders, knees straight but not hyperextended.",
    "instructions": "Lower heels down into deep stretch for 2 seconds. Drive upward onto big toes as high as possible, squeezing calves intensely for 2 seconds at peak.",
    "technique": "Pause at bottom to dissipate Achilles tendon bounce, forcing gastrocnemius muscle to perform actual work.",
    "breathing": "Exhale pressing up; inhale descending into stretch.",
    "commonMistakes": [
      "Bouncing rapidly without pausing in stretch",
      "Bending knees"
    ],
    "safetyNotes": "Keep balls of feet firmly planted.",
    "alternatives": [
      "Leg Press Calf Raise",
      "Seated Calf Raise"
    ],
    "recommendedSets": "4",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ]
  },
  {
    "id": "seated-calf-raise",
    "name": "Seated Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "equipment": "Weight Machines",
    "category": "Calves",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Sit with thigh pad locked over lower thighs, balls of feet on platform, heels hanging over edge.",
    "instructions": "Lower heels deeply into full stretch. Press through toes to full contraction, pausing 1 second at top.",
    "technique": "With knees bent at 90 degrees, gastrocnemius is inactive, isolating the deep soleus muscle underneath.",
    "breathing": "Exhale pressing up; inhale lowering.",
    "commonMistakes": [
      "Bouncing weights rapidly"
    ],
    "safetyNotes": "Release safety bar smoothly.",
    "alternatives": [
      "Standing Calf Raise",
      "Donkey Calf Raise"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-20",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Soleus"
    ]
  },
  {
    "id": "leg-press-calf-raise",
    "name": "Leg Press Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Weight Machines",
    "category": "Calves",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Sit in leg press machine, place balls of feet on bottom edge of platform with heels hanging free. Knees straight with soft unlock.",
    "instructions": "Push platform into plantarflexion extending ankles. Lower platform back allowing heels to stretch deeply past toes.",
    "technique": "Allows heavy overloading with complete spinal safety.",
    "breathing": "Exhale pressing forward; inhale stretching back.",
    "commonMistakes": [
      "Feet slipping off edge",
      "Bending knees during movement"
    ],
    "safetyNotes": "Ensure safety stops are engaged on the leg press sled.",
    "alternatives": [
      "Standing Calf Raise",
      "Donkey Calf Raise"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Gastrocnemius"
    ]
  },
  {
    "id": "donkey-calf-raise",
    "name": "Donkey Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Weight Machines",
    "category": "Calves",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Hinge forward 90 degrees at hips resting elbows on support pad, padded lever resting across lower hips, balls of feet on block.",
    "instructions": "Lower heels into deep stretch, then elevate onto toes to full peak contraction.",
    "technique": "Hip flexion stretches gastrocnemius at knee and pelvis, producing immense calf stimulation.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Bouncing without pause"
    ],
    "safetyNotes": "Maintain flat lower back.",
    "alternatives": [
      "Standing Calf Raise",
      "Leg Press Calf Raise"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Gastrocnemius (Lengthened Stretch)"
    ]
  },
  {
    "id": "single-leg-calf-raise",
    "name": "Single-Leg Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Ankle Stabilizers"
    ],
    "equipment": "Dumbbell",
    "category": "Calves",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Stand on one foot on edge of step holding dumbbell in same-side hand, opposite hand balancing on wall.",
    "instructions": "Lower heel into full stretch, then press up high onto big toe for 2-second squeeze.",
    "technique": "Fixes unilateral calf imbalances and strengthens ankle stabilizing ligaments.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Short range of motion"
    ],
    "safetyNotes": "Keep balance hand steady.",
    "alternatives": [
      "Standing Calf Raise",
      "Seated Calf Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15 each",
    "recommendedRest": 45,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ]
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Leg Raise",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Forearms"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Advanced",
    "type": "Isolation",
    "movementPattern": "Posterior Pelvic Tilt",
    "startingPosition": "Hang from pull-up bar with overhand grip, legs straight, core braced.",
    "instructions": "Raise straight legs up until toes touch or reach bar height, curling pelvis upward toward ribs. Lower under strict control without swinging.",
    "technique": "Must tilt pelvis upward at top; raising legs solely at hips only works hip flexors, not rectus abdominis.",
    "breathing": "Exhale raising legs; inhale lowering down.",
    "commonMistakes": [
      "Swinging body back and forth for momentum",
      "Failing to curl pelvis"
    ],
    "safetyNotes": "Perform hanging knee raises if straight legs cause swing.",
    "alternatives": [
      "Captain's Chair Leg Raise",
      "Ab Wheel Rollout"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 60,
    "subgroup": "Lower Abs",
    "subgroups": [
      "Lower Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Lower Region)",
      "Hip Flexors"
    ]
  },
  {
    "id": "captains-chair-leg-raise",
    "name": "Captain's Chair Leg Raise",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Weight Machines",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Posterior Pelvic Tilt",
    "startingPosition": "Mount captain's chair with forearms on pads, back supported firmly against pad, legs hanging.",
    "instructions": "Lift legs or knees up towards chest while curling pelvis forward. Squeeze abs, lower smoothly.",
    "technique": "Forearm support eliminates grip fatigue, allowing concentrated core contraction.",
    "breathing": "Exhale raising; inhale lowering.",
    "commonMistakes": [
      "Using momentum to kick legs"
    ],
    "safetyNotes": "Keep shoulders depressed away from ears.",
    "alternatives": [
      "Hanging Leg Raise",
      "Decline Crunch"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lower Abs",
    "subgroups": [
      "Lower Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Lower)",
      "Iliopsoas"
    ]
  },
  {
    "id": "cable-crunch",
    "name": "Cable Crunch",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Cable Machine",
    "category": "Abs & Core",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Spinal Flexion",
    "startingPosition": "Kneel in front of high cable with rope attachment held behind neck at ears, hips high.",
    "instructions": "Flex spine bringing elbows down toward knees, curling ribcage down to pelvis. Squeeze abs hard, then slowly return to neutral.",
    "technique": "Hips must remain stationary; do not sit back onto calves. All motion must come from spine flexion.",
    "breathing": "Exhale crunching down; inhale returning up.",
    "commonMistakes": [
      "Sitting back onto heels turning it into a hip hinge"
    ],
    "safetyNotes": "Keep hands glued to ears throughout.",
    "alternatives": [
      "Decline Crunch",
      "Ab Wheel Rollout"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Upper Abs",
    "subgroups": [
      "Upper Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Upper Region)"
    ]
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Lats",
      "Shoulders",
      "Lower Back"
    ],
    "equipment": "Other Gym Equipment",
    "category": "Abs & Core",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Anti-Extension",
    "startingPosition": "Kneel on mat with hands gripping ab wheel handles directly beneath shoulders.",
    "instructions": "Roll wheel forward extending body into a straight line hovering just above floor. Contract abs to pull wheel back under shoulders.",
    "technique": "Maintain slight hollow-body posterior pelvic tilt. Never let lower back hyperextend or sag downward.",
    "breathing": "Inhale rolling out; exhale contracting back.",
    "commonMistakes": [
      "Sagging lower back causing spinal hyperextension",
      "Pulling back with hips first"
    ],
    "safetyNotes": "Stop rollout distance before lower back begins to arch.",
    "alternatives": [
      "Plank",
      "Hanging Leg Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "8-12",
    "recommendedRest": 75,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Rectus Abdominis"
    ]
  },
  {
    "id": "plank",
    "name": "Plank",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Anti-Extension",
    "startingPosition": "Rest on forearms and balls of feet. Elbows directly under shoulders, body forming a straight plank from head to heels.",
    "instructions": "Brace abdominal wall as if preparing for a punch. Squeeze glutes and quads. Hold static position for targeted duration.",
    "technique": "Actively pull elbows towards toes (RKC plank cue) to maximize neuromuscular abdominal recruitment.",
    "breathing": "Steady rhythmic diaphragmatic breathing while maintaining abdominal tension.",
    "commonMistakes": [
      "Hips sagging toward floor",
      "Piking hips too high in air"
    ],
    "safetyNotes": "Discontinue set when hips begin to sag.",
    "alternatives": [
      "Side Plank",
      "Ab Wheel Rollout"
    ],
    "recommendedSets": "3",
    "recommendedReps": "45-60s",
    "recommendedRest": 45,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Multifidus",
      "Internal Obliques"
    ]
  },
  {
    "id": "side-plank",
    "name": "Side Plank",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Gluteus Medius",
      "Quadratus Lumborum"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Anti-Lateral Flexion",
    "startingPosition": "Lie on side with elbow directly beneath shoulder, feet stacked or staggered.",
    "instructions": "Lift hips off floor until body forms a straight diagonal line. Hold rigid posture, then switch sides.",
    "technique": "Key exercise for quadratus lumborum (QL) and lateral core resilience.",
    "breathing": "Controlled breathing.",
    "commonMistakes": [
      "Hips dropping downward",
      "Rotating chest forward toward floor"
    ],
    "safetyNotes": "Keep neck aligned with spine.",
    "alternatives": [
      "Pallof Press",
      "Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "30-45s each",
    "recommendedRest": 45,
    "subgroup": "Obliques",
    "subgroups": [
      "Obliques"
    ],
    "primaryMuscles": [
      "Internal and External Obliques",
      "Quadratus Lumborum"
    ]
  },
  {
    "id": "decline-crunch",
    "name": "Decline Crunch",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Weight Machines",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Spinal Flexion",
    "startingPosition": "Hook ankles under pads on decline bench. Cross hands over chest.",
    "instructions": "Curl ribcage forward toward pelvis contracting abs. Squeeze at top, lower slowly to 3/4 depth to maintain constant tension.",
    "technique": "Focus on curling spine rather than pivoting at hips.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Pulling neck with hands"
    ],
    "safetyNotes": "Hold weight plate across chest to progress resistance.",
    "alternatives": [
      "Cable Crunch",
      "Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20",
    "recommendedRest": 45,
    "subgroup": "Upper Abs",
    "subgroups": [
      "Upper Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis"
    ]
  },
  {
    "id": "russian-twist",
    "name": "Russian Twist",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Hip Flexors"
    ],
    "equipment": "Dumbbell",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Rotation",
    "startingPosition": "Sit on floor with knees bent, feet elevated slightly, torso leaned back 45 degrees holding weight with both hands.",
    "instructions": "Rotate torso smoothly side to side, bringing weight beside hips on each side while keeping lower body stable.",
    "technique": "Rotate from thoracic spine and ribcage, not just moving arms.",
    "breathing": "Exhale on each twist.",
    "commonMistakes": [
      "Slouching lower back",
      "Only moving arms without rotating torso"
    ],
    "safetyNotes": "Keep feet on floor if lower back feels strained.",
    "alternatives": [
      "Woodchoppers",
      "Pallof Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20 total",
    "recommendedRest": 45,
    "subgroup": "Obliques",
    "subgroups": [
      "Obliques"
    ],
    "primaryMuscles": [
      "External Obliques",
      "Internal Obliques",
      "Rotational Core"
    ]
  },
  {
    "id": "hanging-knee-raise",
    "name": "Hanging Knee Raise",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Forearms"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Posterior Pelvic Tilt",
    "startingPosition": "Hang from pull-up bar with overhand grip, arms straight.",
    "instructions": "Pull knees up towards chest, curling pelvis forward and upward. Lower with control.",
    "technique": "Easier progression towards full hanging straight leg raise.",
    "breathing": "Exhale raising knees; inhale lowering.",
    "commonMistakes": [
      "Swinging body back and forth"
    ],
    "safetyNotes": "Control the eccentric descent.",
    "alternatives": [
      "Hanging Leg Raise",
      "Captain's Chair Leg Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lower Abs",
    "subgroups": [
      "Lower Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Lower)"
    ]
  },
  {
    "id": "woodchoppers",
    "name": "Woodchoppers",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Shoulders"
    ],
    "equipment": "Cable Machine",
    "category": "Abs & Core",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Rotation",
    "startingPosition": "Set high cable pulley. Stand sideways to machine, grasp handle with both hands above shoulder.",
    "instructions": "Rotate torso diagonally downward across body towards opposite knee, pivoting back foot. Return slowly.",
    "technique": "Trains athletic rotational power across transverse plane.",
    "breathing": "Exhale chopping down; inhale returning.",
    "commonMistakes": [
      "Bending arms instead of rotating core"
    ],
    "safetyNotes": "Keep hips and knees soft.",
    "alternatives": [
      "Russian Twist",
      "Pallof Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12 each",
    "recommendedRest": 60,
    "subgroup": "Obliques",
    "subgroups": [
      "Obliques"
    ],
    "primaryMuscles": [
      "Obliques",
      "Transverse Abdominis"
    ]
  },
  {
    "id": "deadbug",
    "name": "Deadbug",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Deep Stabilizers"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Anti-Extension",
    "startingPosition": "Lie flat on back with arms pointing straight up and knees bent at 90 degrees above hips.",
    "instructions": "Press lower back flat against floor. Slowly extend right arm overhead and left leg straight towards floor simultaneously. Return and alternate.",
    "technique": "Lower back must remain glued to floor with zero gap throughout movement.",
    "breathing": "Exhale extending limbs; inhale returning.",
    "commonMistakes": [
      "Allowing lower back to arch off floor"
    ],
    "safetyNotes": "Essential core coordination and spinal rehab drill.",
    "alternatives": [
      "Bird Dog",
      "Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10 each side",
    "recommendedRest": 45,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Anterior Core Stabilizers"
    ]
  },
  {
    "id": "dragon-flag",
    "name": "Dragon Flag",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Lats",
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Anti-Extension",
    "startingPosition": "Lie on flat bench gripping edge of bench behind head tightly.",
    "instructions": "Point body in a straight line from feet to shoulders, elevate whole body into air supported only by upper back/scapulae. Lower rigid body slowly towards bench without bending hips, then pull back up.",
    "technique": "Bruce Lee signature core exercise; demands elite abdominal strength.",
    "breathing": "Inhale lowering under control; exhale pulling up.",
    "commonMistakes": [
      "Bending at hips"
    ],
    "safetyNotes": "Only attempt after mastering hanging leg raises and rollouts.",
    "alternatives": [
      "Ab Wheel Rollout",
      "Hanging Leg Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "4-8",
    "recommendedRest": 90,
    "subgroup": "Lower Abs",
    "subgroups": [
      "Lower Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Full Tension)",
      "Deep Stabilizers"
    ]
  },
  {
    "id": "bird-dog",
    "name": "Bird Dog",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Glutes",
      "Lower Back"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Anti-Rotation",
    "startingPosition": "Start on all fours with hands under shoulders, knees under hips.",
    "instructions": "Simultaneously extend right arm forward and left leg straight back until parallel to floor. Hold 2 seconds, return and alternate.",
    "technique": "Core stays stable without tilting pelvis or arching spine.",
    "breathing": "Exhale extending; inhale returning.",
    "commonMistakes": [
      "Pelvic rotation"
    ],
    "safetyNotes": "McGill Big 3 spine health drill.",
    "alternatives": [
      "Deadbug",
      "Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10 each side",
    "recommendedRest": 45,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Multifidus",
      "Erector Spinae",
      "Deep Core"
    ]
  },
  {
    "id": "pallof-press",
    "name": "Pallof Press",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Cable Machine",
    "category": "Abs & Core",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Anti-Rotation",
    "startingPosition": "Stand perpendicular to chest-height cable. Hold handle at sternum with both hands.",
    "instructions": "Press handle straight forward in front of chest resisting lateral pull of cable. Hold 2 seconds, return to chest.",
    "technique": "Pure anti-rotation challenge for internal and external obliques.",
    "breathing": "Exhale pressing forward; inhale returning.",
    "commonMistakes": [
      "Letting cable twist torso"
    ],
    "safetyNotes": "Keep knees soft and glutes clamped.",
    "alternatives": [
      "Side Plank",
      "Woodchoppers"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12 each side",
    "recommendedRest": 45,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Anti-Rotational Core"
    ]
  },
  {
    "id": "barbell-wrist-curl",
    "name": "Barbell Wrist Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Grip"
    ],
    "equipment": "Barbell",
    "category": "Forearms",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Wrist Flexion",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Sit on bench resting forearms on thighs with wrists hanging off knees, palms facing up holding barbell.",
    "instructions": "Allow bar to roll down into fingertips, then curl fingers and wrists upward as high as possible. Squeeze flexors at top, lower slowly.",
    "technique": "Strict forearm flexion without lifting forearms off thighs.",
    "breathing": "Exhale curling up; inhale unrolling.",
    "commonMistakes": [
      "Lifting forearms off legs"
    ],
    "safetyNotes": "Do not use excessive weight to protect delicate wrist ligaments.",
    "alternatives": [
      "Dumbbell Wrist Curl",
      "Reverse Wrist Curl"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-20",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Wrist Flexors",
      "Brachioradialis"
    ]
  },
  {
    "id": "reverse-wrist-curl",
    "name": "Reverse Wrist Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearm Extensors"
    ],
    "equipment": "Barbell",
    "category": "Forearms",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Wrist Extension",
    "defaultBarbell": 10,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Rest forearms on thighs with palms facing down (overhand grip) holding barbell.",
    "instructions": "Extend wrists upward raising knuckles towards ceiling. Squeeze extensors at top, lower slowly.",
    "technique": "Critical for balancing flexor-extensor tension and preventing tennis elbow.",
    "breathing": "Exhale extending; inhale lowering.",
    "commonMistakes": [
      "Using too heavy weight"
    ],
    "safetyNotes": "Light weight with high reps is paramount here.",
    "alternatives": [
      "Reverse Barbell Curl",
      "Barbell Wrist Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Wrist Extensors",
      "Brachioradialis"
    ]
  },
  {
    "id": "dumbbell-wrist-curl",
    "name": "Dumbbell Wrist Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Grip"
    ],
    "equipment": "Dumbbell",
    "category": "Forearms",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Wrist Flexion",
    "startingPosition": "Forearm resting on bench holding dumbbell with palm up.",
    "instructions": "Curl wrist upward to full flexion, lower smoothly to full extension.",
    "technique": "Allows independent wrist tracking and unilateral balance.",
    "breathing": "Exhale curling; inhale lowering.",
    "commonMistakes": [
      "Jerking weight"
    ],
    "safetyNotes": "Keep wrist stable.",
    "alternatives": [
      "Barbell Wrist Curl",
      "Plate Pinch"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15 each",
    "recommendedRest": 45,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Wrist Flexors"
    ]
  },
  {
    "id": "farmers-walk",
    "name": "Farmer's Walk",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Trapezius",
      "Core",
      "Glutes",
      "Calves"
    ],
    "equipment": "Dumbbell",
    "category": "Forearms",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Loaded Carry",
    "startingPosition": "Stand between two heavy dumbbells, kettlebells, or farmer handles. Deadlift weights up to standing tall.",
    "instructions": "Walk forward in smooth, deliberate heel-to-toe steps with chest proud, shoulders pulled back, and core braced. Walk for distance or time.",
    "technique": "Tremendous crushing grip strength, trap development, and functional core stability.",
    "breathing": "Short, rhythmic breaths while maintaining continuous core brace.",
    "commonMistakes": [
      "Slouching shoulders forward",
      "Taking wild uncontrolled running strides"
    ],
    "safetyNotes": "Lower weights safely using hip hinge when terminating set.",
    "alternatives": [
      "Dead Hang",
      "Plate Pinch"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "40-60 meters",
    "recommendedRest": 90,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Forearms & Grip",
      "Trapezius",
      "Core"
    ]
  },
  {
    "id": "plate-pinch",
    "name": "Plate Pinch",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Thumb Flexors",
      "Grip"
    ],
    "equipment": "Weight Plates / Bodyweight",
    "category": "Forearms",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Pinch Grip",
    "startingPosition": "Stand holding two smooth weight plates pinched together between fingers and thumb (smooth sides facing outward).",
    "instructions": "Deadlift plates off floor and stand tall. Hold static pinch grip for maximum targeted time, then lower safely.",
    "technique": "Directly builds pinch grip strength, targeting thenar muscles and deep finger flexors.",
    "breathing": "Steady breathing.",
    "commonMistakes": [
      "Using ribbed plate sides to cheat pinch"
    ],
    "safetyNotes": "Keep toes clear of plate drop zone.",
    "alternatives": [
      "Farmer's Walk",
      "Dead Hang"
    ],
    "recommendedSets": "3",
    "recommendedReps": "20-40s hold",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Finger Flexors",
      "Adductor Pollicis",
      "Forearms"
    ]
  },
  {
    "id": "dead-hang",
    "name": "Dead Hang",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Lats",
      "Shoulder Capsule",
      "Grip"
    ],
    "equipment": "Bodyweight",
    "category": "Forearms",
    "difficulty": "Beginner",
    "type": "Isometric",
    "movementPattern": "Static Hang",
    "startingPosition": "Grasp pull-up bar with overhand shoulder-width grip. Step off box and hang completely free with arms fully extended.",
    "instructions": "Relax spine and allow gravity to decompress vertebrae while maintaining a vice-like crushing grip on bar. Hold for time.",
    "technique": "Unmatched grip endurance builder and phenomenal shoulder capsule decompression tool.",
    "breathing": "Deep relaxing diaphragmatic breathing.",
    "commonMistakes": [
      "Shrugging shoulders into ears tensely"
    ],
    "safetyNotes": "Step off safely to prevent sudden landing shock.",
    "alternatives": [
      "Farmer's Walk",
      "Plate Pinch"
    ],
    "recommendedSets": "3",
    "recommendedReps": "45-90s",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Forearm Flexors",
      "Shoulder Girdle",
      "Lats"
    ]
  },
  {
    "id": "reverse-barbell-curl",
    "name": "Reverse Barbell Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "equipment": "Barbell",
    "category": "Forearms",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall holding straight barbell with overhand grip at shoulder-width.",
    "instructions": "Curl bar up keeping wrists locked straight. Squeeze forearm tops at apex, lower with 3-second cadence.",
    "technique": "Overhand grip shifts maximum strain onto brachioradialis and forearm extensor bellies.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Bending wrists backward"
    ],
    "safetyNotes": "Use manageable weight to protect wrist tendons.",
    "alternatives": [
      "Reverse Curl",
      "Hammer Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Brachioradialis",
      "Brachialis"
    ]
  },
  {
    "id": "clean-and-press",
    "name": "Clean and Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Shoulders",
      "Back",
      "Quadriceps",
      "Glutes",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Full Body & Conditioning",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Olympic Lift",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand with bar over midfoot. Grip bar in clean stance, hips low, chest up, spine locked.",
    "instructions": "Explosively pull bar from floor, extend hips and shrug dynamically, catch bar on shoulders in front rack position. Re-brace and press bar overhead to lockout.",
    "technique": "Combines full-body triple extension power with overhead pressing strength.",
    "breathing": "Inhale on floor; exhale on clean; inhale re-brace; exhale overhead press.",
    "commonMistakes": [
      "Muscling bar with arms instead of driving with hips and legs"
    ],
    "safetyNotes": "Use bumper plates and lifting platform.",
    "alternatives": [
      "Power Clean",
      "Thrusters"
    ],
    "recommendedSets": "4-5",
    "recommendedReps": "3-5",
    "recommendedRest": 120,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Full Body Deltoid-Leg Chain"
    ]
  },
  {
    "id": "power-clean",
    "name": "Power Clean",
    "muscle": "Back",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Back",
      "Trapezius",
      "Calves"
    ],
    "equipment": "Barbell",
    "category": "Full Body & Conditioning",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Olympic Lift",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Deadlift stance over bar. Hook grip or firm overhand grip.",
    "instructions": "Pull bar from floor, execute explosive second pull when bar reaches mid-thigh (violent hip/knee extension), jump under and catch bar on front deltoids with elbows high in partial quarter squat.",
    "technique": "Premier athletic developer of explosive rate of force development (RFD).",
    "breathing": "Inhale at setup; explosive exhale on catch.",
    "commonMistakes": [
      "Catching with low elbows",
      "Pulling with arms before hip extension"
    ],
    "safetyNotes": "Practice with light PVC/empty bar first.",
    "alternatives": [
      "Clean and Press",
      "Kettlebell Swing"
    ],
    "recommendedSets": "4-5",
    "recommendedReps": "3-5",
    "recommendedRest": 120,
    "subgroup": "Traps (Trapezius)",
    "subgroups": [
      "Traps (Trapezius)"
    ],
    "primaryMuscles": [
      "Posterior Chain",
      "Trapezius",
      "Hamstrings"
    ]
  },
  {
    "id": "snatch",
    "name": "Snatch",
    "muscle": "Back",
    "secondaryMuscles": [
      "Shoulders",
      "Back",
      "Legs",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Full Body & Conditioning",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Olympic Lift",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Wide collar-to-collar snatch grip over barbell, hips set low, chest high.",
    "instructions": "Pull bar in single fluid continuous trajectory from floor directly overhead to full arm lockout while dropping into a deep squat beneath bar. Stand up.",
    "technique": "The most technically sophisticated athletic lift in human sports.",
    "breathing": "Inhale at setup; explosive brace; exhale upon standing.",
    "commonMistakes": [
      "Letting bar loop out far from body"
    ],
    "safetyNotes": "Must learn how to safely drop bar forward and backward.",
    "alternatives": [
      "Power Clean",
      "Clean and Press"
    ],
    "recommendedSets": "4-5",
    "recommendedReps": "2-3",
    "recommendedRest": 180,
    "subgroup": "Traps (Trapezius)",
    "subgroups": [
      "Traps (Trapezius)"
    ],
    "primaryMuscles": [
      "Full Posterior Chain",
      "Upper Trapezius",
      "Shoulders"
    ]
  },
  {
    "id": "kettlebell-swing",
    "name": "Kettlebell Swing",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Lower Back",
      "Core",
      "Forearms"
    ],
    "equipment": "Kettlebells",
    "category": "Full Body & Conditioning",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Hinge",
    "startingPosition": "Stand with feet shoulder-width, kettlebell on floor 1 foot in front of you.",
    "instructions": "Hinge at hips, hike kettlebell back between legs like a football center. Snap hips forward violently driving kettlebell to chest height purely with hip power.",
    "technique": "Arms act as ropes; all power generates from glute and hamstring hip snap.",
    "breathing": "Inhale hiking back; explosive exhale snapping hips through.",
    "commonMistakes": [
      "Squatting instead of hinging",
      "Lifting bell with shoulders"
    ],
    "safetyNotes": "Maintain flat neutral spine throughout.",
    "alternatives": [
      "Cable Pull-Through",
      "Conventional Deadlift"
    ],
    "recommendedSets": "3-5",
    "recommendedReps": "15-20",
    "recommendedRest": 60,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings",
      "Gluteus Maximus",
      "Erector Spinae"
    ]
  },
  {
    "id": "thrusters",
    "name": "Thrusters",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Quadriceps",
      "Shoulders",
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Full Body & Conditioning",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Compound Squat-Press",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Hold barbell in front rack position, feet shoulder-width apart.",
    "instructions": "Descend into a full front squat. Drive upward out of squat dynamically, transferring lower-body momentum directly into an overhead barbell press in one fluid motion.",
    "technique": "Unrelenting cardiovascular and full-body metabolic conditioning exercise.",
    "breathing": "Inhale descending into squat; exhale explosively pressing overhead.",
    "commonMistakes": [
      "Pausing between squat and press",
      "Pressing before hips fully extend"
    ],
    "safetyNotes": "Keep heels grounded during squat.",
    "alternatives": [
      "Clean and Press",
      "Goblet Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Anterior Deltoids",
      "Core"
    ]
  },
  {
    "id": "medicine-ball-slam",
    "name": "Medicine Ball Slam",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Lats",
      "Core",
      "Shoulders",
      "Legs"
    ],
    "equipment": "Medicine Ball",
    "category": "Full Body & Conditioning",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Explosive Slam",
    "startingPosition": "Stand tall holding non-bouncing slam ball overhead with arms fully extended.",
    "instructions": "Explosively slam ball straight down into floor between feet by forcefully flexing core and driving with lats. Catch ball off bounce and repeat.",
    "technique": "Triple flexion explosive power movement with zero eccentric joint stress.",
    "breathing": "Inhale raising overhead; forceful exhale on slam.",
    "commonMistakes": [
      "Bending back instead of using whole body"
    ],
    "safetyNotes": "Use dedicated non-bouncing slam balls to avoid facial rebounds.",
    "alternatives": [
      "Battle Ropes",
      "Burpees"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Upper Abs",
    "subgroups": [
      "Upper Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis",
      "Lats",
      "Shoulders"
    ]
  },
  {
    "id": "burpees",
    "name": "Burpees",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Chest",
      "Quadriceps",
      "Core",
      "Cardio"
    ],
    "equipment": "Bodyweight",
    "category": "Full Body & Conditioning",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Full Body Calisthenic",
    "startingPosition": "Stand tall with feet shoulder-width.",
    "instructions": "Drop hands to floor, jump feet back into push-up plank, lower chest to floor. Push up, jump feet back to hands, and jump explosively into air with hands overhead.",
    "technique": "Maintain smooth continuous pacing without breaking rhythm.",
    "breathing": "Rhythmic continuous breathing.",
    "commonMistakes": [
      "Sagging lower back in push-up phase"
    ],
    "safetyNotes": "Step back instead of jumping if knees or lower back are sensitive.",
    "alternatives": [
      "Thrusters",
      "Medicine Ball Slam"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-20",
    "recommendedRest": 60,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Pectorals",
      "Cardiovascular Chain"
    ]
  },
  {
    "id": "battle-ropes",
    "name": "Battle Ropes",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Shoulders",
      "Arms",
      "Core",
      "Cardio"
    ],
    "equipment": "Battle Ropes",
    "category": "Full Body & Conditioning",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Wave Oscillation",
    "startingPosition": "Hold rope ends with neutral grip, half-squat athletic stance, chest proud.",
    "instructions": "Create alternating or simultaneous explosive waves by whipping handles rapidly up and down for targeted duration.",
    "technique": "Keep core clamped and knees soft; drive waves all the way to anchor point.",
    "breathing": "Short continuous rhythmic breathing.",
    "commonMistakes": [
      "Standing straight up",
      "Using arms without core involvement"
    ],
    "safetyNotes": "Maintain solid athletic base.",
    "alternatives": [
      "Medicine Ball Slam",
      "Burpees"
    ],
    "recommendedSets": "4",
    "recommendedReps": "30-45s",
    "recommendedRest": 45,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids",
      "Core",
      "Forearms"
    ]
  },
  {
    "id": "tire-flip",
    "name": "Tire Flip",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Legs",
      "Back",
      "Shoulders",
      "Grip"
    ],
    "equipment": "Other Gym Equipment",
    "category": "Full Body & Conditioning",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Strongman Flip",
    "startingPosition": "Stand with chest against heavy tractor tire. Drop hips into deep deadlift stance, hands cupping bottom tread.",
    "instructions": "Drive forcefully with legs and hips at 45 degrees, pop tire up with knee assist, transition hands to push position, and shove tire over.",
    "technique": "Do not curl tire with arms; drive forward through chest and legs.",
    "breathing": "Inhale before lift; explosive exhale on drive.",
    "commonMistakes": [
      "Rounding back like a bicep curl"
    ],
    "safetyNotes": "Wear shoes with aggressive traction.",
    "alternatives": [
      "Sled Push",
      "Power Clean"
    ],
    "recommendedSets": "3",
    "recommendedReps": "6-8 flips",
    "recommendedRest": 90,
    "subgroup": "Glutes",
    "subgroups": [
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae"
    ]
  },
  {
    "id": "sled-push",
    "name": "Sled Push",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Glutes",
      "Core"
    ],
    "equipment": "Weight Plates / Bodyweight",
    "category": "Full Body & Conditioning",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Loaded Locomotive Drive",
    "startingPosition": "Grip vertical poles of Prowler or sled, arms locked or bent, torso at 45-degree angle.",
    "instructions": "Drive aggressively forward taking powerful marching strides, pushing balls of feet into turf.",
    "technique": "Unmatched concentric-only quad burner with zero eccentric soreness or joint impact.",
    "breathing": "Continuous rhythmic breathing.",
    "commonMistakes": [
      "Standing too vertical",
      "Taking tiny shuffling steps"
    ],
    "safetyNotes": "Ideal for knee rehabilitation and anaerobic capacity.",
    "alternatives": [
      "Sled Pull",
      "Farmer's Walk"
    ],
    "recommendedSets": "4-5",
    "recommendedReps": "25-40 meters",
    "recommendedRest": 90,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Quadriceps",
      "Calves",
      "Glutes"
    ]
  },
  {
    "id": "sled-pull",
    "name": "Sled Pull",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes",
      "Quads",
      "Back"
    ],
    "equipment": "Weight Plates / Bodyweight",
    "category": "Full Body & Conditioning",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Loaded Locomotive Drive",
    "startingPosition": "Attach waist harness or grasp handles facing away from or towards sled.",
    "instructions": "March backward or forward under continuous tension pulling loaded sled.",
    "technique": "Backward sled walking is renowned for strengthening knees, VMO, and patellar tendons.",
    "breathing": "Steady breathing.",
    "commonMistakes": [
      "Jerking rope instead of smooth strides"
    ],
    "safetyNotes": "Maintain upright posture.",
    "alternatives": [
      "Sled Push",
      "Farmer's Walk"
    ],
    "recommendedSets": "4",
    "recommendedReps": "30-50 meters",
    "recommendedRest": 90,
    "subgroup": "Hamstrings",
    "subgroups": [
      "Hamstrings"
    ],
    "primaryMuscles": [
      "Hamstrings",
      "Glutes",
      "Erector Spinae"
    ]
  },
  {
    "id": "barbell-floor-press",
    "name": "Barbell Floor Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on floor inside power rack. Unrack barbell positioned over mid-chest, knees bent with feet flat.",
    "instructions": "Lower bar until triceps touch floor gently. Pause 1 second to eliminate stretch reflex, then press upward forcefully to lockout.",
    "technique": "Floor stop limits shoulder hyperextension, heavily emphasizing mid-range pectoral power and tricep lockout.",
    "breathing": "Inhale lowering; exhale pressing up.",
    "commonMistakes": [
      "Bouncing triceps off floor"
    ],
    "safetyNotes": "Set rack pins so you can re-rack safely.",
    "alternatives": [
      "Flat Barbell Bench Press",
      "Close-Grip Bench Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "6-8",
    "recommendedRest": 90,
    "subgroup": "Middle Chest",
    "subgroups": [
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Mid)",
      "Triceps Brachii"
    ]
  },
  {
    "id": "landmine-press",
    "name": "Landmine Press",
    "muscle": "Chest",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "category": "Chest",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Incline Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand or kneel facing landmine base. Hold end of barbell with one or both hands at upper chest.",
    "instructions": "Press barbell upward and forward along natural arc. Squeeze upper chest and front delt, lower with control.",
    "technique": "Angled arc is extremely shoulder-friendly while heavily stimulating the clavicular upper pectoral fibers.",
    "breathing": "Exhale pressing forward; inhale lowering.",
    "commonMistakes": [
      "Over-arching lower back"
    ],
    "safetyNotes": "Brace core firmly.",
    "alternatives": [
      "Incline Dumbbell Press",
      "Low-to-High Cable Fly"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Upper Chest",
    "subgroups": [
      "Upper Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Upper)",
      "Anterior Deltoid"
    ]
  },
  {
    "id": "meadows-row",
    "name": "Meadows Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand perpendicular to a loaded landmine bar. Stagger feet, hinge hips, and grip thick bar sleeve with overhand grip.",
    "instructions": "Row bar up driving elbow high and out. Squeeze lower lats and teres major, lower to full lat stretch.",
    "technique": "John Meadows legendary creation for building extreme lower lat width and upper back thickness.",
    "breathing": "Exhale rowing up; inhale lowering.",
    "commonMistakes": [
      "Twisting spine excessively"
    ],
    "safetyNotes": "Use lifting straps on heavy sets.",
    "alternatives": [
      "Single-Arm Dumbbell Row",
      "T-Bar Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10 each",
    "recommendedRest": 75,
    "subgroup": "Upper Back",
    "subgroups": [
      "Upper Back"
    ],
    "primaryMuscles": [
      "Rhomboids",
      "Latissimus Dorsi"
    ]
  },
  {
    "id": "seal-row",
    "name": "Seal Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Rhomboids",
      "Rear Delts",
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie face down on elevated horizontal bench, barbell resting beneath bench.",
    "instructions": "Pull barbell up until it touches underside of bench, retracting scapulae fully. Lower under strict control.",
    "technique": "Elevated bench completely eliminates leg and lumbar momentum, providing 100% pure back isolation.",
    "breathing": "Exhale pulling up; inhale lowering.",
    "commonMistakes": [
      "Short half reps"
    ],
    "safetyNotes": "Ensure bench is properly elevated and stable.",
    "alternatives": [
      "Chest-Supported Row",
      "Barbell Row"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-12",
    "recommendedRest": 90,
    "subgroup": "Upper Back",
    "subgroups": [
      "Upper Back"
    ],
    "primaryMuscles": [
      "Upper Trapezius",
      "Rhomboids",
      "Rear Deltoids"
    ]
  },
  {
    "id": "inverted-row",
    "name": "Inverted Row",
    "muscle": "Back",
    "secondaryMuscles": [
      "Biceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "category": "Back",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Pull",
    "startingPosition": "Lie under barbell set at waist height inside rack. Grasp bar with overhand grip wider than shoulders, body in straight plank with heels on floor.",
    "instructions": "Pull chest up to touch bar keeping body straight as a board. Lower under control to full arm hang.",
    "technique": "Horizontal bodyweight pull that perfectly balances push-up volume for postural alignment.",
    "breathing": "Exhale pulling up; inhale lowering.",
    "commonMistakes": [
      "Sagging hips",
      "Poking chin forward"
    ],
    "safetyNotes": "Ensure bar is firmly racked in J-cups.",
    "alternatives": [
      "Seated Cable Row",
      "Pull-ups"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-15",
    "recommendedRest": 60,
    "subgroup": "Upper Back",
    "subgroups": [
      "Upper Back"
    ],
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ]
  },
  {
    "id": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "muscle": "Back",
    "secondaryMuscles": [
      "Chest",
      "Triceps Long Head",
      "Serratus Anterior"
    ],
    "equipment": "Dumbbell",
    "category": "Back",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Vertical Pull",
    "startingPosition": "Lie perpendicular across flat bench with only upper back and neck supported, hips lowered slightly, holding dumbbell with both hands over chest.",
    "instructions": "With soft elbow unlock, lower dumbbell in an arc over and behind head until full lat and ribcage stretch. Pull back over chest contracting lats.",
    "technique": "Classic golden-era movement that expands ribcage cavity and develops serratus anterior and lat width.",
    "breathing": "Inhale deeply expanding ribcage on descent; exhale pulling over.",
    "commonMistakes": [
      "Bending elbows into tricep extension",
      "Lifting hips too high"
    ],
    "safetyNotes": "Do not overstretch if you have shoulder instability.",
    "alternatives": [
      "Straight-Arm Pulldown",
      "Cable Pullover"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-14",
    "recommendedRest": 60,
    "subgroup": "Lats (Latissimus Dorsi)",
    "subgroups": [
      "Lats (Latissimus Dorsi)"
    ],
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Pectoralis Minor",
      "Serratus"
    ]
  },
  {
    "id": "behind-the-neck-press",
    "name": "Behind-the-Neck Press",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Shoulders",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Vertical Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Sit upright with barbell resting across upper traps with wide grip.",
    "instructions": "Press bar vertically overhead to full extension. Lower with extreme control back to ear level.",
    "technique": "Places tremendous load on lateral and rear deltoid heads. Requires excellent shoulder mobility.",
    "breathing": "Inhale down; exhale pressing overhead.",
    "commonMistakes": [
      "Lowering too deep below ears",
      "Banging cervical spine"
    ],
    "safetyNotes": "Only perform if you have full external shoulder rotation mobility.",
    "alternatives": [
      "Standing Barbell Shoulder Press",
      "Arnold Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "8-10",
    "recommendedRest": 90,
    "subgroup": "Front Delts (Anterior Deltoids)",
    "subgroups": [
      "Front Delts (Anterior Deltoids)"
    ],
    "primaryMuscles": [
      "Anterior Deltoids",
      "Lateral Deltoids"
    ]
  },
  {
    "id": "lu-raises",
    "name": "Lu Raises (Full ROM Lateral Raise)",
    "muscle": "Shoulders",
    "secondaryMuscles": [
      "Trapezius",
      "Serratus Anterior"
    ],
    "equipment": "Weight Plates / Bodyweight",
    "category": "Shoulders",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Full ROM Abduction",
    "startingPosition": "Stand tall holding light change plates at sides.",
    "instructions": "Raise plates out to sides in full circular arc all the way overhead until plates touch at top. Lower smoothly.",
    "technique": "Olympic weightlifting movement popularized by Lu Xiaojun; strengthens upward scapular rotators and full deltoid capacity.",
    "breathing": "Inhale raising overhead; exhale lowering.",
    "commonMistakes": [
      "Using heavy weights"
    ],
    "safetyNotes": "Keep weights strictly under 5kg to maintain flawless mechanics.",
    "alternatives": [
      "Dumbbell Lateral Raise",
      "Cable Lateral Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 45,
    "subgroup": "Side Delts (Lateral Deltoids)",
    "subgroups": [
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Lateral Deltoids",
      "Serratus Anterior",
      "Traps"
    ]
  },
  {
    "id": "drag-curl",
    "name": "Drag Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand tall holding barbell with underhand shoulder-width grip.",
    "instructions": "Pull elbows straight back and up while dragging bar directly up the surface of torso to mid-chest. Squeeze biceps, drag back down.",
    "technique": "Elbow retraction eliminates front deltoid involvement, placing pure isolation on the bicep belly.",
    "breathing": "Exhale pulling up; inhale lowering.",
    "commonMistakes": [
      "Letting bar drift away from torso"
    ],
    "safetyNotes": "Keep bar in contact with clothing.",
    "alternatives": [
      "Barbell Curl",
      "Preacher Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Biceps Long Head",
    "subgroups": [
      "Biceps Long Head"
    ],
    "primaryMuscles": [
      "Biceps Brachii (Long Head)"
    ]
  },
  {
    "id": "zottman-curl",
    "name": "Zottman Curl",
    "muscle": "Biceps",
    "secondaryMuscles": [
      "Forearms",
      "Brachioradialis"
    ],
    "equipment": "Dumbbell",
    "category": "Biceps",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Bicep Curl",
    "startingPosition": "Stand holding dumbbells with palms facing forward.",
    "instructions": "Curl dumbbells up with supinated grip. At top, rotate wrists 180 degrees so palms face down (pronated), and lower slowly. Rotate back at bottom.",
    "technique": "Concentric phase overloads biceps; eccentric phase severely overloads forearm extensors and brachioradialis.",
    "breathing": "Exhale curling up; inhale lowering down.",
    "commonMistakes": [
      "Rotating wrists during the curl rather than at top"
    ],
    "safetyNotes": "Moderate weight is essential.",
    "alternatives": [
      "Reverse Curl",
      "Hammer Curl"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60,
    "subgroup": "Brachioradialis",
    "subgroups": [
      "Brachioradialis"
    ],
    "primaryMuscles": [
      "Biceps Brachii",
      "Brachioradialis"
    ]
  },
  {
    "id": "diamond-push-ups",
    "name": "Diamond Push-ups",
    "muscle": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "category": "Triceps",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Push-up plank position with index fingers and thumbs touching directly under chest to form a diamond shape.",
    "instructions": "Lower chest to touch diamond with control, keeping elbows tucked close to sides. Push through palms to lockout.",
    "technique": "Supreme bodyweight tricep builder that also torches inner chest.",
    "breathing": "Inhale down; exhale pushing up.",
    "commonMistakes": [
      "Flaring elbows 90 degrees outward",
      "Sagging hips"
    ],
    "safetyNotes": "Spread hands slightly if wrists feel excessive compression.",
    "alternatives": [
      "Close-Grip Bench Press",
      "Bench Dips"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60,
    "subgroup": "Lateral Head",
    "subgroups": [
      "Lateral Head"
    ],
    "primaryMuscles": [
      "Triceps Brachii",
      "Inner Pectorals"
    ]
  },
  {
    "id": "curtsy-lunge",
    "name": "Curtsy Lunge",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Gluteus Medius",
      "Quadriceps"
    ],
    "equipment": "Dumbbell",
    "category": "Hamstrings & Glutes",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Lunge",
    "startingPosition": "Stand tall holding dumbbells at sides.",
    "instructions": "Step one leg back and diagonally across behind the other leg as if curtsying. Lower hips until front thigh is parallel. Drive up to standing.",
    "technique": "Diagonal vector targets gluteus medius and outer hip abductors.",
    "breathing": "Inhale stepping back; exhale pushing up.",
    "commonMistakes": [
      "Front knee twisting inward"
    ],
    "safetyNotes": "Keep hips square.",
    "alternatives": [
      "Reverse Lunges",
      "Bulgarian Split Squats"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12 each",
    "recommendedRest": 60,
    "subgroup": "Abductors (Outer Hip)",
    "subgroups": [
      "Abductors (Outer Hip)"
    ],
    "primaryMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae",
      "Adductors"
    ]
  },
  {
    "id": "deficit-deadlift",
    "name": "Deficit Deadlift",
    "muscle": "Back",
    "secondaryMuscles": [
      "Hamstrings & Glutes",
      "Quadriceps"
    ],
    "equipment": "Barbell",
    "category": "Back",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Hinge",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Stand on a 1 to 2-inch platform or weight plate with barbell over midfoot.",
    "instructions": "Hinge down deeper into deadlift grip. Drive through floor to standing lockout.",
    "technique": "Increased range of motion builds monstrous leg drive off the floor.",
    "breathing": "Inhale setup; brace; exhale lockout.",
    "commonMistakes": [
      "Platform too high causing rounded spine"
    ],
    "safetyNotes": "Keep deficit under 2 inches.",
    "alternatives": [
      "Conventional Deadlift",
      "Rack Pull"
    ],
    "recommendedSets": "3",
    "recommendedReps": "4-6",
    "recommendedRest": 150,
    "subgroup": "Spinal Erectors",
    "subgroups": [
      "Spinal Erectors"
    ],
    "primaryMuscles": [
      "Erector Spinae",
      "Hamstrings",
      "Quadriceps"
    ]
  },
  {
    "id": "seated-dumbbell-calf-raise",
    "name": "Seated Dumbbell Calf Raise",
    "muscle": "Legs",
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Dumbbell",
    "category": "Calves",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Plantarflexion",
    "startingPosition": "Sit on bench, balls of feet elevated on block, heavy dumbbell resting vertically on knees.",
    "instructions": "Lower heels into deep stretch, then elevate high onto toes holding top squeeze.",
    "technique": "Accessible soleus developer that can be done anywhere with standard dumbbells.",
    "breathing": "Exhale up; inhale down.",
    "commonMistakes": [
      "Bouncing weights"
    ],
    "safetyNotes": "Place pad or towel under dumbbell on knees for comfort.",
    "alternatives": [
      "Seated Calf Raise",
      "Standing Calf Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20",
    "recommendedRest": 45,
    "subgroup": "Quadriceps",
    "subgroups": [
      "Quadriceps"
    ],
    "primaryMuscles": [
      "Soleus"
    ]
  },
  {
    "id": "v-ups",
    "name": "V-Ups",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Spinal Flexion",
    "startingPosition": "Lie flat on back with arms extended overhead and legs straight.",
    "instructions": "Simultaneously lift torso and straight legs, folding body into a V-shape to touch toes at apex. Lower under control.",
    "technique": "Integrates both upper and lower abdominal flexion simultaneously.",
    "breathing": "Exhale folding into V; inhale lowering.",
    "commonMistakes": [
      "Bending knees excessively"
    ],
    "safetyNotes": "Keep lower back safe with controlled descent.",
    "alternatives": [
      "Hanging Leg Raise",
      "Deadbug"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 45,
    "subgroup": "Lower Abs",
    "subgroups": [
      "Lower Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ]
  },
  {
    "id": "hollow-body-hold",
    "name": "Hollow Body Hold",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Quadriceps"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Intermediate",
    "type": "Isometric",
    "movementPattern": "Anti-Extension",
    "startingPosition": "Lie flat on back. Press lower back firmly into floor with zero daylight.",
    "instructions": "Lift shoulders and straight legs 6 inches off floor, arms extended overhead. Maintain rigid banana curve hold.",
    "technique": "Gymnastic foundation drill for absolute anterior core tension.",
    "breathing": "Short shallow breaths while maintaining hollow shape.",
    "commonMistakes": [
      "Lower back arching off floor"
    ],
    "safetyNotes": "Tuck knees to chest if lower back leaves floor.",
    "alternatives": [
      "Plank",
      "Deadbug"
    ],
    "recommendedSets": "3",
    "recommendedReps": "30-45s",
    "recommendedRest": 45,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Rectus Abdominis"
    ]
  },
  {
    "id": "hanging-windshield-wipers",
    "name": "Hanging Windshield Wipers",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Lats",
      "Forearms"
    ],
    "equipment": "Bodyweight",
    "category": "Abs & Core",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Rotational Flexion",
    "startingPosition": "Hang from pull-up bar, raise straight legs to bar height into an inverted L-hang.",
    "instructions": "Rotate legs side to side in a windshield wiper arc without swinging torso.",
    "technique": "Elite rotational and lateral core power movement.",
    "breathing": "Rhythmic breathing.",
    "commonMistakes": [
      "Dropping legs below parallel"
    ],
    "safetyNotes": "Requires high grip and shoulder strength.",
    "alternatives": [
      "Russian Twist",
      "Hanging Leg Raise"
    ],
    "recommendedSets": "3",
    "recommendedReps": "8-10 total",
    "recommendedRest": 90,
    "subgroup": "Obliques",
    "subgroups": [
      "Obliques"
    ],
    "primaryMuscles": [
      "Obliques (Rotational Control)",
      "Hip Flexors"
    ]
  },
  {
    "id": "suitcase-carry",
    "name": "Suitcase Carry",
    "muscle": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Trapezius",
      "Core"
    ],
    "equipment": "Dumbbell",
    "category": "Forearms",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Loaded Carry",
    "startingPosition": "Stand tall holding a heavy dumbbell in one hand only, like a suitcase.",
    "instructions": "Walk forward maintaining strictly vertical posture, actively resisting the lateral pull of the weight. Switch sides.",
    "technique": "Unilateral loaded carry that destroys obliques, QL, and asymmetric grip.",
    "breathing": "Steady rhythmic breathing.",
    "commonMistakes": [
      "Leaning sideways toward or away from the weight"
    ],
    "safetyNotes": "Keep shoulders level.",
    "alternatives": [
      "Farmer's Walk",
      "Side Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "30-40m each",
    "recommendedRest": 60,
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Quadratus Lumborum",
      "Obliques",
      "Grip"
    ]
  },
  {
    "id": "cable-crossover-adduction",
    "name": "Cable Crossover (Inner Chest Squeeze)",
    "muscle": "Chest",
    "subgroup": "Inner Chest",
    "subgroups": [
      "Inner Chest",
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Sternal Head - Medial Border)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Coracobrachialis"
    ],
    "equipment": "Cable Machine",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Adduction",
    "startingPosition": "Stand centered between two pulleys set at chest height. Take a staggered stance, bend forward slightly at the hips, keeping elbows softly flexed.",
    "instructions": "Drive handles inward along a circular hugging arc until hands cross past one another at midline. Alternate which hand crosses over top each rep. Squeeze the inner pectorals hard for 2 seconds at peak contraction before opening back slowly.",
    "technique": "Keep wrists firm and elbows fixed in a slight angle. Do not allow shoulders to roll forward as hands cross.",
    "breathing": "Inhale as arms open into a deep stretch; exhale as hands cross into peak inner contraction.",
    "commonMistakes": [
      "Bending elbows excessively turning into a press",
      "Shrugging shoulders up toward ears",
      "Swinging torso to build momentum"
    ],
    "safetyNotes": "Do not hyperextend shoulders backward past the torso plane under heavy tension.",
    "alternatives": [
      "Pec Deck",
      "Close-Grip Hex Press",
      "Svend Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "close-grip-dumbbell-hex-press",
    "name": "Close-Grip Dumbbell Hex Press",
    "muscle": "Chest",
    "subgroup": "Inner Chest",
    "subgroups": [
      "Inner Chest",
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Medial Sternal Fibers)"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Lie flat on a bench holding two dumbbells pressed tightly together along their inner flat surfaces directly over your sternum.",
    "instructions": "Squeeze the dumbbells forcefully together against one another while lowering them to touch your mid-chest. Press upward smoothly while maintaining constant, maximum inward isometric pressure between the weights throughout the entire range of motion.",
    "technique": "The inward crushing pressure is what fires the inner chest; simply holding them close without squeezing yields little stimulus.",
    "breathing": "Inhale on descent; exhale pushing upward while squeezing dumbbells together.",
    "commonMistakes": [
      "Allowing dumbbells to separate during pressing",
      "Relaxing the inward squeezing pressure",
      "Bouncing weights off ribs"
    ],
    "safetyNotes": "Keep wrists locked straight to prevent dumbbells from slipping or twisting.",
    "alternatives": [
      "Pec Deck",
      "Cable Crossover",
      "Floor Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 75
  },
  {
    "id": "svend-press",
    "name": "Standing Svend Press",
    "muscle": "Chest",
    "subgroup": "Inner Chest",
    "subgroups": [
      "Inner Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Inner Cleavage / Medial Fibers)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Core"
    ],
    "equipment": "Plate-loaded Machines",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Isometric Push",
    "startingPosition": "Stand tall with core braced holding two 5 kg / 10 lb weight plates pinched together between the palms of your hands at center chest height.",
    "instructions": "Pinch the plates together with maximum palm force. Slowly extend your arms straight forward until elbows are nearly locked, holding peak inner pectoral contraction for 2 full seconds. Retract under continuous squeezing tension back to chest.",
    "technique": "Keep shoulders depressed and shoulder blades pinned down. The harder you pinch the plates, the harder your inner pecs fire.",
    "breathing": "Inhale as plates return to chest; exhale as you push forward into max contraction.",
    "commonMistakes": [
      "Failing to pinch plates hard enough",
      "Dropping elbows down toward ribs",
      "Leaning back to cheat"
    ],
    "safetyNotes": "Use light plates (2.5 to 5 kg). Heavy weight ruins the squeeze mechanic.",
    "alternatives": [
      "Pec Deck",
      "Hex Press",
      "Cable Crossover"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "wide-grip-barbell-bench-press",
    "name": "Wide-Grip Barbell Bench Press",
    "muscle": "Chest",
    "subgroup": "Outer Chest",
    "subgroups": [
      "Outer Chest",
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Outer Humeral Insertion Border)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps Brachii"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Lie flat on the bench with feet planted. Take a wide grip approximately 3 to 4 inches wider than your normal bench press grip (forearms flared outward at bottom).",
    "instructions": "Unrack bar under strict control. Lower bar slowly to the sternum feeling an intense horizontal stretch across the outer chest borders. Press dynamically upward to 90% lockout without losing scapular retraction.",
    "technique": "Do not flare elbows to 90 degrees; tuck them slightly at 70 degrees to protect the rotator cuff while maximizing outer pectoral stretch.",
    "breathing": "Inhale deep into diaphragm during descent; exhale pressing past sticking point.",
    "commonMistakes": [
      "Gripping excessively wide causing wrist shear",
      "Bouncing off chest",
      "Flaring elbows excessively"
    ],
    "safetyNotes": "Avoid if you have pre-existing shoulder impingement. Maintain strict controlled tempo.",
    "alternatives": [
      "Deep Dumbbell Fly",
      "Deficit Push-ups",
      "Flat Barbell Bench Press"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10",
    "recommendedRest": 90
  },
  {
    "id": "deep-dumbbell-fly-stretch",
    "name": "Deep Cambered Dumbbell Fly",
    "muscle": "Chest",
    "subgroup": "Outer Chest",
    "subgroups": [
      "Outer Chest",
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Outer Border)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Biceps (Short Head Tendon)"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Fly",
    "startingPosition": "Lie flat on a narrow bench holding moderate dumbbells above your chest with palms facing each other and elbows softly bent.",
    "instructions": "Lower weights laterally in a wide arcing motion until your elbows descend slightly below bench height, achieving a deep outer pectoral stretch. Pause 1 second in the stretched position, then pull arms inward following the same wide arc back up.",
    "technique": "Keep the bend in your elbows completely static throughout. Emphasize the bottom stretch where muscle hypertrophy signaling is greatest.",
    "breathing": "Inhale expanding chest during deep descent; exhale pulling weights inward.",
    "commonMistakes": [
      "Over-bending elbows turning it into a press",
      "Dropping weights too fast without control",
      "Excessive hyperextension injuring front shoulder"
    ],
    "safetyNotes": "Use conservative weights to prioritize loaded stretch over raw poundage.",
    "alternatives": [
      "Cable Chest Fly",
      "Wide-Grip Bench Press",
      "Deficit Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "10-12",
    "recommendedRest": 75
  },
  {
    "id": "deficit-push-ups",
    "name": "Deficit Push-ups (Deep Stretch)",
    "muscle": "Chest",
    "subgroup": "Outer Chest",
    "subgroups": [
      "Outer Chest",
      "Middle Chest"
    ],
    "primaryMuscles": [
      "Pectoralis Major (Outer Stretch Border)"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoids",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Horizontal Push",
    "startingPosition": "Place hands on two elevated platforms (dumbbells, push-up bars, or weight plates) slightly wider than shoulder-width. Feet on floor with rigid core.",
    "instructions": "Lower your torso down between the elevation blocks until your chest descends 2 to 3 inches below hand level, generating an intense deep stretch across the outer pectorals. Drive explosively back up to plank position.",
    "technique": "Lock glutes and abs to avoid lumbar sagging. Pause 1 full second at the bottom deficit.",
    "breathing": "Inhale lowering deep into deficit; exhale driving upward.",
    "commonMistakes": [
      "Sagging hips or piking buttocks",
      "Cutting range of motion short",
      "Letting head drop forward"
    ],
    "safetyNotes": "Ensure elevation blocks are sturdy and cannot slip outward under load.",
    "alternatives": [
      "Deep Dumbbell Fly",
      "Chest Dips",
      "Push-ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "cable-external-rotation",
    "name": "Cable External Rotation",
    "muscle": "Shoulders",
    "subgroup": "Rotator Cuff",
    "subgroups": [
      "Rotator Cuff"
    ],
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "equipment": "Cable Machine",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Rotator Cuff Rotation",
    "startingPosition": "Set pulley at elbow height. Stand sideways to the cable tower. Grip handle with your outside hand, elbow bent at 90 degrees and pinned snugly against your side (a rolled towel under elbow is optimal).",
    "instructions": "Keeping elbow pinned to your side, rotate your forearm outward away from the cable stack as far as comfortable without twisting your torso. Squeeze external rotators for 1 second, then control back to stomach.",
    "technique": "Do not let elbow flare away from torso. Movement is pure axial rotation of the humerus.",
    "breathing": "Exhale rotating outward; inhale returning inward.",
    "commonMistakes": [
      "Using momentum from hips or spine",
      "Allowing elbow to drift away from side",
      "Using excessive weight causing deltoid takeover"
    ],
    "safetyNotes": "Use very light weight (2.5 to 5 kg). The rotator cuff consists of small stabilizing muscles.",
    "alternatives": [
      "Dumbbell External Rotation",
      "Face Pulls",
      "Cuban Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20",
    "recommendedRest": 45
  },
  {
    "id": "dumbbell-external-rotation",
    "name": "Side-Lying Dumbbell External Rotation",
    "muscle": "Shoulders",
    "subgroup": "Rotator Cuff",
    "subgroups": [
      "Rotator Cuff"
    ],
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Rotator Cuff Rotation",
    "startingPosition": "Lie on your side on a flat bench or floor. Hold a light dumbbell in your top hand with elbow bent at 90 degrees and rested on your top hip.",
    "instructions": "Rotate your forearm upward towards the ceiling against gravity while keeping your elbow pinned to your hip. Pause at top, then lower under 3-second control back to horizontal.",
    "technique": "Keep neck neutral. Do not roll body backward as you rotate the dumbbell upward.",
    "breathing": "Exhale rotating dumbbell upward; inhale lowering slowly.",
    "commonMistakes": [
      "Rolling torso backward to lift weight",
      "Lifting elbow off hip pad",
      "Using too heavy a dumbbell"
    ],
    "safetyNotes": "A 2 to 5 kg dumbbell is sufficient for optimal rotator cuff stimulus.",
    "alternatives": [
      "Cable External Rotation",
      "Cuban Press",
      "Face Pulls"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 45
  },
  {
    "id": "cuban-press",
    "name": "Dumbbell Cuban Press",
    "muscle": "Shoulders",
    "subgroup": "Rotator Cuff",
    "subgroups": [
      "Rotator Cuff",
      "Side Delts (Lateral Deltoids)"
    ],
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Trapezius",
      "Supraspinatus"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Shoulder Complex Rotation",
    "startingPosition": "Stand tall holding light dumbbells at thighs with overhand grip.",
    "instructions": "Perform an upright row until upper arms are parallel to floor with elbows high. Rotate forearms upward until weights are overhead in standard press position. Press dumbbells overhead to full extension. Reverse the sequence with strict cadence.",
    "technique": "Keep movement smooth and segmented: Row -> Rotate -> Press. Master each transition.",
    "breathing": "Inhale at bottom; exhale rotating and pressing overhead.",
    "commonMistakes": [
      "Rushing through rotational phase",
      "Arching lower back on overhead press",
      "Using heavy weights compromising shoulder capsule"
    ],
    "safetyNotes": "Superb prehab movement. Always perform with light, manageable dumbbells.",
    "alternatives": [
      "Face Pulls",
      "External Rotation",
      "Arnold Press"
    ],
    "recommendedSets": "3",
    "recommendedReps": "10-12",
    "recommendedRest": 60
  },
  {
    "id": "cable-rear-delt-cross-fly",
    "name": "Crossed Cable Rear Delt Fly",
    "muscle": "Shoulders",
    "subgroup": "Rear Delts (Posterior Deltoids)",
    "subgroups": [
      "Rear Delts (Posterior Deltoids)"
    ],
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Infraspinatus",
      "Middle Trapezius"
    ],
    "equipment": "Cable Machine",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Horizontal Abduction",
    "startingPosition": "Set dual cables at eye level with no attachments (hold cable carabiners directly). Stand centered, cross arms to grab left cable with right hand and right cable with left hand.",
    "instructions": "Keeping arms almost straight with elbows unlocked, pull cables out and back in a wide horizontal arc. Squeeze rear deltoids intensely at peak extension, avoiding excessive scapular pinching. Return slowly to cross in front.",
    "technique": "Think about pulling knuckles outward to side walls rather than pinching shoulder blades backward.",
    "breathing": "Exhale pulling cables out and backward; inhale returning across.",
    "commonMistakes": [
      "Using too much back momentum",
      "Bending elbows like a row",
      "Shrugging traps up toward ears"
    ],
    "safetyNotes": "Keep wrist straight and align cable line of pull directly with posterior deltoid fibers.",
    "alternatives": [
      "Rear Delt Fly",
      "Reverse Pec Deck",
      "Face Pulls"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "machine-adductor",
    "name": "Seated Machine Hip Adduction",
    "muscle": "Legs",
    "subgroup": "Adductors (Inner Thigh)",
    "subgroups": [
      "Adductors (Inner Thigh)"
    ],
    "primaryMuscles": [
      "Adductor Magnus",
      "Adductor Longus",
      "Gracilis"
    ],
    "secondaryMuscles": [
      "Pectineus",
      "Sartorius"
    ],
    "equipment": "Weight Machines",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Hip Adduction",
    "startingPosition": "Sit upright with back firmly against pad. Adjust knee pads outward to a comfortable, deep groin stretch position.",
    "instructions": "Smoothly squeeze your knees and thighs inward together against the pads until they touch at center. Hold peak inner thigh contraction for 2 seconds, then return under controlled 3-second cadence to the stretched starting point.",
    "technique": "Do not let weights slam between reps. Maintain an upright posture without rocking torso forward.",
    "breathing": "Exhale squeezing legs together; inhale opening under control into stretch.",
    "commonMistakes": [
      "Allowing weights to crash down at outer limit",
      "Using momentum or bouncing thighs inward",
      "Arching lower back off pad"
    ],
    "safetyNotes": "Do not force starting width beyond your hip mobility to prevent groin strain.",
    "alternatives": [
      "Copenhagen Plank",
      "Cable Hip Adduction",
      "Sumo Squat"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "cable-hip-adduction",
    "name": "Standing Cable Hip Adduction",
    "muscle": "Legs",
    "subgroup": "Adductors (Inner Thigh)",
    "subgroups": [
      "Adductors (Inner Thigh)"
    ],
    "primaryMuscles": [
      "Adductor Magnus",
      "Adductor Brevis",
      "Gracilis"
    ],
    "secondaryMuscles": [
      "Core Stabilizers",
      "Gluteus Medius (Support Leg)"
    ],
    "equipment": "Cable Machine",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Hip Adduction",
    "startingPosition": "Attach ankle cuff to low pulley and secure around ankle closest to machine. Stand sideways holding tower for balance, working leg slightly abducted.",
    "instructions": "Pull working leg across the front of your body toward the opposite side, contracting inner thigh muscles hard at the crossing point. Pause 1 second, then control weight back to initial stretch.",
    "technique": "Keep hips square to the front. Do not rotate pelvis to assist the movement.",
    "breathing": "Exhale pulling leg across midline; inhale returning outward.",
    "commonMistakes": [
      "Twisting torso to heave weight",
      "Swinging leg without muscular control",
      "Bending working knee excessively"
    ],
    "safetyNotes": "Start light to build stability in the standing hip and groin.",
    "alternatives": [
      "Machine Adductor",
      "Copenhagen Plank",
      "Sumo Squat"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "copenhagen-plank",
    "name": "Copenhagen Plank (Inner Thigh & Core)",
    "muscle": "Legs",
    "subgroup": "Adductors (Inner Thigh)",
    "subgroups": [
      "Adductors (Inner Thigh)",
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Adductor Longus",
      "Adductor Magnus"
    ],
    "secondaryMuscles": [
      "Internal & External Obliques",
      "Transverse Abdominis",
      "Gluteus Medius"
    ],
    "equipment": "Bench",
    "difficulty": "Advanced",
    "type": "Isolation",
    "movementPattern": "Isometric Hip Adduction",
    "startingPosition": "Set up in a side plank position with top foot rested on a bench and bottom leg suspended underneath the bench, supporting bodyweight on forearm.",
    "instructions": "Lift your hips and bottom leg so your body forms a rigid diagonal line from head to heels supported solely by your forearm on floor and top foot on bench. Hold position statically.",
    "technique": "Do not let hips sag toward floor or rotate forward. Engage inner thigh and obliques continuously.",
    "breathing": "Maintain steady diaphragmatic breathing while bracing core and groin.",
    "commonMistakes": [
      "Hips dropping out of alignment",
      "Resting knee instead of foot/ankle on bench (easier regression)",
      "Holding breath"
    ],
    "safetyNotes": "Regress to knee on bench if ankle lever generates knee discomfort.",
    "alternatives": [
      "Machine Adductor",
      "Cable Hip Adduction",
      "Side Plank"
    ],
    "recommendedSets": "3",
    "recommendedReps": "30-45s",
    "recommendedRest": 60
  },
  {
    "id": "sumo-squat",
    "name": "Wide-Stance Barbell Sumo Squat",
    "muscle": "Legs",
    "subgroup": "Adductors (Inner Thigh)",
    "subgroups": [
      "Adductors (Inner Thigh)",
      "Quadriceps",
      "Glutes"
    ],
    "primaryMuscles": [
      "Adductor Magnus",
      "Gluteus Maximus",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Erector Spinae"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "type": "Compound",
    "movementPattern": "Squat",
    "defaultBarbell": 20,
    "defaultBarbellUnit": "KG",
    "startingPosition": "Rack barbell across upper traps. Take a wide stance (1.5 to 2 times shoulder-width) with toes angled outward at 35 to 45 degrees.",
    "instructions": "Push knees out wide in line with your toes and descend under control until thighs are parallel to the floor, feeling an intense inner thigh stretch. Drive straight up through heels contracting adductors and glutes.",
    "technique": "Knees must track strictly over toes; do not allow knees to cave inward during the ascent.",
    "breathing": "Inhale deep into abdomen on way down; exhale driving through floor.",
    "commonMistakes": [
      "Knees caving inward (valgus collapse)",
      "Leaning torso excessively forward",
      "Stance too narrow for sumo mechanics"
    ],
    "safetyNotes": "Ensure hip mobility permits wide toe angle before loading heavy weight.",
    "alternatives": [
      "Goblet Squat",
      "Barbell Back Squat",
      "Leg Press (45-Degree)"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "8-10",
    "recommendedRest": 90
  },
  {
    "id": "machine-abductor",
    "name": "Seated Machine Hip Abduction",
    "muscle": "Legs",
    "subgroup": "Abductors (Outer Hip)",
    "subgroups": [
      "Abductors (Outer Hip)",
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Medius",
      "Gluteus Minimus",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Piriformis",
      "Upper Gluteus Maximus"
    ],
    "equipment": "Weight Machines",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Hip Abduction",
    "startingPosition": "Sit upright with back against pad and outer knees against the resistance pads. Set starting width narrow.",
    "instructions": "Push knees outward against the pads as wide as possible, feeling a deep burn in the upper outer glutes and hips. Hold peak contraction for 2 seconds, then slowly return over 3 seconds.",
    "technique": "Keep hips pinned down. You can lean slightly forward from hips to shift greater tension onto gluteus medius.",
    "breathing": "Exhale driving knees outward; inhale closing smoothly.",
    "commonMistakes": [
      "Using momentum or jerking weights",
      "Lifting buttocks off the seat",
      "Dropping resistance quickly without controlling negative"
    ],
    "safetyNotes": "Superb hip stabilizer builder; great for knee and lower back injury prevention.",
    "alternatives": [
      "Lateral Band Walk",
      "Cable Hip Abduction",
      "Curtsy Lunge"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-20",
    "recommendedRest": 60
  },
  {
    "id": "cable-hip-abduction",
    "name": "Standing Cable Hip Abduction",
    "muscle": "Legs",
    "subgroup": "Abductors (Outer Hip)",
    "subgroups": [
      "Abductors (Outer Hip)"
    ],
    "primaryMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Gluteus Minimus",
      "Core"
    ],
    "equipment": "Cable Machine",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Hip Abduction",
    "startingPosition": "Secure ankle cuff to low pulley and attach to far ankle. Stand sideways holding cable tower for balance.",
    "instructions": "Keeping leg straight and toes pointed forward (not turned outward), lift leg laterally away from body as high as comfortable. Squeeze outer hip for 1 second, then lower under control.",
    "technique": "Keep working foot pointing directly forward to maintain isolation on gluteus medius rather than hip flexors.",
    "breathing": "Exhale lifting leg outward; inhale lowering slowly.",
    "commonMistakes": [
      "Tilting torso to compensate for weak hip",
      "Rotating toes upward turning into hip flexion",
      "Swinging leg quickly"
    ],
    "safetyNotes": "Maintain steady core brace on supporting leg to protect lower back.",
    "alternatives": [
      "Machine Abductor",
      "Lateral Band Walk",
      "Curtsy Lunge"
    ],
    "recommendedSets": "3",
    "recommendedReps": "12-15",
    "recommendedRest": 60
  },
  {
    "id": "lateral-band-walk",
    "name": "Lateral Resistance Band Walk",
    "muscle": "Legs",
    "subgroup": "Abductors (Outer Hip)",
    "subgroups": [
      "Abductors (Outer Hip)",
      "Glutes"
    ],
    "primaryMuscles": [
      "Gluteus Medius",
      "Gluteus Minimus"
    ],
    "secondaryMuscles": [
      "Tensor Fasciae Latae",
      "Quadriceps"
    ],
    "equipment": "Resistance Bands",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Lateral Locomotion",
    "startingPosition": "Place a mini resistance loop band around your shins or above knees. Stand with feet hip-width apart in a quarter squat with knees slightly bent and chest tall.",
    "instructions": "Step laterally to the right against band resistance, then follow with left foot keeping band under constant tension. Complete 10 to 15 paces right, then reverse and step left.",
    "technique": "Do not let feet come all the way together; maintain continuous outward tension on the band throughout the entire drill.",
    "breathing": "Breathe naturally and rhythmically while bracing core.",
    "commonMistakes": [
      "Allowing knees to cave inward",
      "Standing straight up instead of keeping athletic quarter squat",
      "Dragging trailing foot passively"
    ],
    "safetyNotes": "Excellent warm-up and activation exercise before heavy squatting or deadlifting.",
    "alternatives": [
      "Machine Abductor",
      "Cable Hip Abduction",
      "Curtsy Lunge"
    ],
    "recommendedSets": "3",
    "recommendedReps": "15-20 steps/dir",
    "recommendedRest": 45
  },
  {
    "id": "floor-crunches",
    "name": "Standard Floor Crunches",
    "muscle": "Abs",
    "subgroup": "Upper Abs",
    "subgroups": [
      "Upper Abs"
    ],
    "primaryMuscles": [
      "Rectus Abdominis (Upper Region)"
    ],
    "secondaryMuscles": [
      "Transverse Abdominis"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "type": "Isolation",
    "movementPattern": "Trunk Flexion",
    "startingPosition": "Lie face up on mat with knees bent at 90 degrees and feet flat on floor. Rest fingertips lightly behind ears or across chest.",
    "instructions": "Press your lower back firmly into the floor. Contract your upper abs to curl your head, neck, and shoulder blades 2 to 3 inches off the ground toward your pelvis. Squeeze hard at the peak for 1 second, then lower under control without resting shoulder blades flat.",
    "technique": "Do not yank your neck with hands. Imagine holding an apple beneath your chin at all times.",
    "breathing": "Exhale forcefully at peak crunch; inhale lowering back down.",
    "commonMistakes": [
      "Pulling on neck with hands",
      "Lifting lower back off the floor (turning into hip flexor sit-up)",
      "Rushing repetitions without squeezing"
    ],
    "safetyNotes": "Keep lower back glued to the floor throughout the entire movement.",
    "alternatives": [
      "Cable Crunch",
      "Decline Crunch",
      "V-Ups"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-20",
    "recommendedRest": 45
  },
  {
    "id": "bicycle-crunches",
    "name": "Bicycle Crunches (Cross-Body Core)",
    "muscle": "Abs",
    "subgroup": "Obliques",
    "subgroups": [
      "Obliques",
      "Upper Abs"
    ],
    "primaryMuscles": [
      "Internal Obliques",
      "External Obliques",
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Iliopsoas",
      "Transverse Abdominis"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "type": "Compound",
    "movementPattern": "Trunk Rotation and Flexion",
    "startingPosition": "Lie on back with hands behind head, shoulder blades elevated, and legs lifted with knees at 90 degrees.",
    "instructions": "Extend your right leg straight out while simultaneously rotating your right shoulder and armpit toward your left knee. Pause 1 second at peak twist, then smoothly alternate sides in a continuous bicycling rhythm.",
    "technique": "Lead with the shoulder and armpit, not just the elbow, to ensure full rotational torso engagement.",
    "breathing": "Exhale on each cross-body contraction; inhale through the center transition.",
    "commonMistakes": [
      "Flapping elbows back and forth without torso rotation",
      "Yanking head and straining cervical spine",
      "Moving legs too fast without controlled cadence"
    ],
    "safetyNotes": "Perform at a controlled 2-second per rep tempo for maximum muscle activation.",
    "alternatives": [
      "Russian Twist",
      "Woodchoppers",
      "Side Plank"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "15-20 each",
    "recommendedRest": 45
  },
  {
    "id": "stomach-vacuum",
    "name": "Transverse Abdominis Stomach Vacuum",
    "muscle": "Abs",
    "subgroup": "Deep Core / Transverse Abdominis",
    "subgroups": [
      "Deep Core / Transverse Abdominis"
    ],
    "primaryMuscles": [
      "Transverse Abdominis",
      "Pelvic Floor"
    ],
    "secondaryMuscles": [
      "Internal Obliques",
      "Diaphragm"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "type": "Isolation",
    "movementPattern": "Core Isometric Compression",
    "startingPosition": "Stand with hands resting on knees, or kneel on all fours. Exhale all air completely out of your lungs.",
    "instructions": "Without inhaling, forcefully pull your navel inward toward your spine as hard and deep as possible, creating a hollow cavern in your abdomen. Hold this maximum inward compression for 15 to 20 seconds while taking shallow controlled breaths.",
    "technique": "Focus on the deep internal belt of muscle pulling the waistline inward.",
    "breathing": "Fully exhale before initiating; hold isometric compression.",
    "commonMistakes": [
      "Holding air in lungs instead of exhaling first",
      "Simply tensing abs outward instead of pulling navel to spine",
      "Releasing the contraction too quickly"
    ],
    "safetyNotes": "Do not perform immediately after heavy meals. Best practiced in morning.",
    "alternatives": [
      "Plank",
      "Deadbug",
      "Ab Wheel Rollout"
    ],
    "recommendedSets": "3-4",
    "recommendedReps": "20-30s hold",
    "recommendedRest": 45
  }
,
  {
  "id": "smith-machine-flat-bench-press",
  "name": "Smith Machine Flat Bench Press",
  "muscle": "Chest",
  "subgroup": "Middle Chest",
  "subgroups": [
    "Middle Chest"
  ],
  "primaryMuscles": [
    "Sternal Pectoralis Major"
  ],
  "secondaryMuscles": [
    "Anterior Deltoids",
    "Triceps Brachii"
  ],
  "equipment": "Smith Machine",
  "difficulty": "Beginner",
  "type": "Compound",
  "movementPattern": "Horizontal Push",
  "startingPosition": "Lie flat on bench positioned directly under the Smith machine barbell. Rotate bar to unhook from safety latches.",
  "instructions": "Lower bar in a controlled path to your mid-chest. Press upward smoothly without locking out elbows aggressively at the top.",
  "technique": "Take advantage of the fixed rail path to maximize chest tension without stabilizer fatigue.",
  "breathing": "Inhale lowering to chest; exhale pressing upward.",
  "commonMistakes": [
    "Bouncing bar off chest",
    "Flaring elbows 90 degrees outward"
  ],
  "safetyNotes": "Always engage safety stop pins at chest level.",
  "alternatives": [
    "Flat Barbell Bench Press",
    "Machine Chest Press"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "8-12",
  "recommendedRest": 90
},
  {
  "id": "neutral-grip-dumbbell-press",
  "name": "Neutral-Grip Dumbbell Press",
  "muscle": "Chest",
  "subgroup": "Middle Chest",
  "subgroups": [
    "Middle Chest"
  ],
  "primaryMuscles": [
    "Sternal Pectoralis Major"
  ],
  "secondaryMuscles": [
    "Anterior Deltoids",
    "Triceps Brachii"
  ],
  "equipment": "Dumbbells",
  "difficulty": "Beginner",
  "type": "Compound",
  "movementPattern": "Horizontal Push",
  "startingPosition": "Lie flat on bench with dumbbells held with palms facing inward toward each other (neutral grip).",
  "instructions": "Lower dumbbells while keeping elbows tucked close to ribcage. Press back up powerfully while squeezing chest together.",
  "technique": "Palms facing inward protects the rotator cuff and increases triceps and sternal chest recruitment.",
  "breathing": "Inhale down; exhale pressing up.",
  "commonMistakes": [
    "Letting elbows drift wide",
    "Arching back excessively"
  ],
  "safetyNotes": "Safely bring weights to knees before sitting up.",
  "alternatives": [
    "Flat Dumbbell Press",
    "Close-Grip Bench Press"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "10-12",
  "recommendedRest": 90
},
  {
  "id": "converging-chest-press-machine",
  "name": "Converging Chest Press Machine",
  "muscle": "Chest",
  "subgroup": "Middle Chest",
  "subgroups": [
    "Middle Chest"
  ],
  "primaryMuscles": [
    "Sternal Pectoralis Major"
  ],
  "secondaryMuscles": [
    "Anterior Deltoids",
    "Triceps Brachii"
  ],
  "equipment": "Selectorized Machines",
  "difficulty": "Beginner",
  "type": "Compound",
  "movementPattern": "Horizontal Push",
  "startingPosition": "Adjust seat so handles align with mid-chest. Plant feet firmly and press back firmly against pad.",
  "instructions": "Press handles forward along converging arc until arms are extended. Slowly return to deep stretch.",
  "technique": "The converging path matches natural pectoral fiber alignment for peak peak contraction.",
  "breathing": "Exhale forward; inhale back.",
  "commonMistakes": [
    "Allowing shoulders to roll forward at full extension"
  ],
  "safetyNotes": "Adjust weight stack pin securely before pressing.",
  "alternatives": [
    "Machine Chest Press",
    "Cable Chest Fly"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "10-15",
  "recommendedRest": 60
},
  {
  "id": "isometric-pushup-hold",
  "name": "Isometric Push-up Hold (Mid-Point)",
  "muscle": "Chest",
  "subgroup": "Middle Chest",
  "subgroups": [
    "Middle Chest"
  ],
  "primaryMuscles": [
    "Sternal Pectoralis Major",
    "Core"
  ],
  "secondaryMuscles": [
    "Anterior Deltoids",
    "Triceps Brachii"
  ],
  "equipment": "Bodyweight",
  "difficulty": "Intermediate",
  "type": "Compound",
  "movementPattern": "Horizontal Push",
  "startingPosition": "Begin in standard push-up position with hands slightly wider than shoulders and core locked.",
  "instructions": "Lower yourself to mid-point (elbows at 90 degrees) and hold rigidly for target duration without sagging.",
  "technique": "Keep glutes squeezed and neck neutral throughout hold.",
  "breathing": "Maintain controlled diaphragmatic breathing while holding.",
  "commonMistakes": [
    "Sagging hips",
    "Lifting head up"
  ],
  "safetyNotes": "Drop to knees if form deteriorates.",
  "alternatives": [
    "Push-ups",
    "Plank"
  ],
  "recommendedSets": "3",
  "recommendedReps": "20-40s hold",
  "recommendedRest": 60
},
  {
  "id": "barbell-pin-press",
  "name": "Barbell Pin Press (Chest Level)",
  "muscle": "Chest",
  "subgroup": "Middle Chest",
  "subgroups": [
    "Middle Chest"
  ],
  "primaryMuscles": [
    "Sternal Pectoralis Major",
    "Triceps Brachii"
  ],
  "secondaryMuscles": [
    "Anterior Deltoids"
  ],
  "equipment": "Barbell",
  "difficulty": "Advanced",
  "type": "Compound",
  "movementPattern": "Horizontal Push",
  "startingPosition": "Set power rack safety pins 2-3 inches above chest. Lie flat under bar with barbell resting on pins.",
  "instructions": "From a dead-stop on the pins, press bar explosively upward to full extension. Lower back under control to rest on pins.",
  "technique": "Eliminates stretch-reflex to build pure concentric starting strength.",
  "breathing": "Brace core and inhale before pressing; exhale on ascent.",
  "commonMistakes": [
    "Bouncing bar off pins",
    "Uneven push"
  ],
  "safetyNotes": "Ensure both safety pins are at identical height.",
  "alternatives": [
    "Flat Barbell Bench Press",
    "Floor Press"
  ],
  "recommendedSets": "4",
  "recommendedReps": "4-6",
  "recommendedRest": 120
},
  {
  "id": "lean-away-cable-lateral-raise",
  "name": "Lean-Away Cable Lateral Raise",
  "muscle": "Shoulders",
  "subgroup": "Side Delts (Lateral Deltoids)",
  "subgroups": [
    "Side Delts (Lateral Deltoids)"
  ],
  "primaryMuscles": [
    "Lateral Deltoids"
  ],
  "secondaryMuscles": [
    "Supraspinatus",
    "Trapezius"
  ],
  "equipment": "Cable Machine",
  "difficulty": "Intermediate",
  "type": "Isolation",
  "movementPattern": "Vertical Push",
  "startingPosition": "Hold low cable handle in outer hand, holding cable tower post with inner hand and leaning outward at a 15-20 degree angle.",
  "instructions": "Raise arm outward to shoulder level leading with elbow. Pause briefly at the top and lower with a controlled 3-second negative.",
  "technique": "The lean-away angle places peak tension on lateral deltoid at initial portion of movement.",
  "breathing": "Exhale raising arm; inhale lowering.",
  "commonMistakes": [
    "Swinging torso",
    "Shrugging trap"
  ],
  "safetyNotes": "Keep wrist neutral and do not swing weight.",
  "alternatives": [
    "Cable Lateral Raise",
    "Dumbbell Lateral Raise"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "12-15",
  "recommendedRest": 60
},
  {
  "id": "incline-prone-rear-delt-raise",
  "name": "Incline Prone Dumbbell Rear Delt Raise",
  "muscle": "Shoulders",
  "subgroup": "Rear Delts (Posterior Deltoids)",
  "subgroups": [
    "Rear Delts (Posterior Deltoids)"
  ],
  "primaryMuscles": [
    "Posterior Deltoids"
  ],
  "secondaryMuscles": [
    "Infraspinatus",
    "Rhomboids"
  ],
  "equipment": "Dumbbells",
  "difficulty": "Intermediate",
  "type": "Isolation",
  "movementPattern": "Horizontal Pull",
  "startingPosition": "Lie chest-down on a 30-degree incline bench holding light dumbbells hanging toward floor.",
  "instructions": "Raise dumbbells outward in a wide sweeping arc keeping elbows slightly bent. Squeeze rear delts at top.",
  "technique": "Chest support prevents hip momentum and isolates the posterior delts.",
  "breathing": "Exhale raising outward; inhale lowering.",
  "commonMistakes": [
    "Using heavy weights and turning into row",
    "Shrugging traps"
  ],
  "safetyNotes": "Focus on mind-muscle connection rather than load.",
  "alternatives": [
    "Rear Delt Fly",
    "Face Pulls"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "12-15",
  "recommendedRest": 60
},
  {
  "id": "kettlebell-bottoms-up-press",
  "name": "Kettlebell Bottoms-Up Shoulder Press",
  "muscle": "Shoulders",
  "subgroup": "Rotator Cuff",
  "subgroups": [
    "Rotator Cuff"
  ],
  "primaryMuscles": [
    "Rotator Cuff (Supraspinatus/Infraspinatus)",
    "Anterior Deltoids"
  ],
  "secondaryMuscles": [
    "Forearms",
    "Core"
  ],
  "equipment": "Kettlebells",
  "difficulty": "Advanced",
  "type": "Compound",
  "movementPattern": "Vertical Push",
  "startingPosition": "Hold kettlebell inverted so heavy bell is balanced directly above handle at shoulder height.",
  "instructions": "Maintain grip crush and press kettlebell overhead without letting bell tilt or flip. Lower slowly.",
  "technique": "Extreme stability demand activates all four rotator cuff stabilizers reflexively.",
  "breathing": "Inhale at shoulder; exhale pressing up.",
  "commonMistakes": [
    "Losing vertical wrist alignment",
    "Rushing tempo"
  ],
  "safetyNotes": "Start with very light kettlebell to avoid drop.",
  "alternatives": [
    "Standing Barbell Shoulder Press",
    "Dumbbell Cuban Press"
  ],
  "recommendedSets": "3",
  "recommendedReps": "6-8",
  "recommendedRest": 90
},
  {
  "id": "barbell-box-squat",
  "name": "Barbell Box Squat",
  "muscle": "Legs",
  "subgroup": "Quadriceps",
  "subgroups": [
    "Quadriceps"
  ],
  "primaryMuscles": [
    "Quadriceps",
    "Gluteus Maximus"
  ],
  "secondaryMuscles": [
    "Hamstrings",
    "Spinal Erectors"
  ],
  "equipment": "Barbell",
  "difficulty": "Intermediate",
  "type": "Compound",
  "movementPattern": "Squat",
  "startingPosition": "Position a box behind you at parallel height. Unrack bar across upper back and step back.",
  "instructions": "Squat down by pushing hips back until seated on box for 1 second without rocking. Drive through feet to stand.",
  "technique": "Do not collapse on box; maintain full core tension throughout pause.",
  "breathing": "Inhale descending; exhale driving upward.",
  "commonMistakes": [
    "Bouncing off box",
    "Relaxing spinal erectors when seated"
  ],
  "safetyNotes": "Always use safety pins set just below box height.",
  "alternatives": [
    "Barbell Back Squat",
    "Front Squat"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "6-8",
  "recommendedRest": 120
},
  {
  "id": "single-leg-barbell-hip-thrust",
  "name": "Single-Leg Barbell Hip Thrust",
  "muscle": "Legs",
  "subgroup": "Glutes",
  "subgroups": [
    "Glutes"
  ],
  "primaryMuscles": [
    "Gluteus Maximus",
    "Gluteus Medius"
  ],
  "secondaryMuscles": [
    "Hamstrings",
    "Core"
  ],
  "equipment": "Barbell",
  "difficulty": "Intermediate",
  "type": "Isolation",
  "movementPattern": "Hinge",
  "startingPosition": "Upper back against bench with padded bar on hips. Plant one foot and lift opposite leg.",
  "instructions": "Drive through planted heel to extend hips upward until torso is parallel to floor. Squeeze working glute hard.",
  "technique": "Keeps pelvis level and cures bilateral glute imbalances.",
  "breathing": "Exhale at top extension; inhale lowering.",
  "commonMistakes": [
    "Tilting pelvis to one side",
    "Overextending lumbar spine"
  ],
  "safetyNotes": "Use thick barbell foam pad on hip crease.",
  "alternatives": [
    "Hip Thrust",
    "Barbell Glute Bridge"
  ],
  "recommendedSets": "3",
  "recommendedReps": "8-12 per leg",
  "recommendedRest": 90
},
  {
  "id": "kettlebell-sumo-deadlift-glutes",
  "name": "Kettlebell Sumo Deadlift (Glute Focus)",
  "muscle": "Legs",
  "subgroup": "Glutes",
  "subgroups": [
    "Glutes"
  ],
  "primaryMuscles": [
    "Gluteus Maximus",
    "Adductor Magnus"
  ],
  "secondaryMuscles": [
    "Hamstrings",
    "Quadriceps"
  ],
  "equipment": "Kettlebells",
  "difficulty": "Beginner",
  "type": "Compound",
  "movementPattern": "Hinge",
  "startingPosition": "Stand wide in sumo stance with toes pointed out at 45 degrees over kettlebell.",
  "instructions": "Hinge at hips, grasp kettlebell handle with both hands, and drive through heels to stand, powerfully locking glutes.",
  "technique": "Wide stance emphasizes gluteus maximus and inner adductor recruitment.",
  "breathing": "Inhale down; exhale standing up.",
  "commonMistakes": [
    "Rounding back",
    "Squatting with knees caving in"
  ],
  "safetyNotes": "Keep chest lifted and spine neutral.",
  "alternatives": [
    "Sumo Squat",
    "Conventional Deadlift"
  ],
  "recommendedSets": "3-4",
  "recommendedReps": "10-12",
  "recommendedRest": 60
},
  {
  "id": "banded-lateral-monster-walk",
  "name": "Banded Lateral Monster Walk",
  "muscle": "Legs",
  "subgroup": "Glutes",
  "subgroups": [
    "Glutes"
  ],
  "primaryMuscles": [
    "Gluteus Medius",
    "Gluteus Maximus"
  ],
  "secondaryMuscles": [
    "Tensor Fasciae Latae",
    "Quadriceps"
  ],
  "equipment": "Resistance Bands",
  "difficulty": "Beginner",
  "type": "Isolation",
  "movementPattern": "Lunge",
  "startingPosition": "Place resistance mini-band around knees or ankles. Assume quarter-squat athletic stance.",
  "instructions": "Take deliberate lateral steps to side while maintaining continuous outward band tension and knee alignment.",
  "technique": "Keep feet parallel and do not drag trailing foot.",
  "breathing": "Breathe rhythmically during lateral march.",
  "commonMistakes": [
    "Allowing knees to cave inward",
    "Standing upright"
  ],
  "safetyNotes": "Choose band resistance that allows smooth steps without knee valgus.",
  "alternatives": [
    "Lateral Resistance Band Walk",
    "Seated Machine Hip Abduction"
  ],
  "recommendedSets": "3",
  "recommendedReps": "15-20 steps each direction",
  "recommendedRest": 45
},
  {
  "id": "swiss-ball-crunch",
  "name": "Swiss Ball Crunch",
  "muscle": "Abs",
  "subgroup": "Upper Abs",
  "subgroups": [
    "Upper Abs"
  ],
  "primaryMuscles": [
    "Rectus Abdominis (Upper)"
  ],
  "secondaryMuscles": [
    "Obliques"
  ],
  "equipment": "Bodyweight",
  "difficulty": "Beginner",
  "type": "Isolation",
  "movementPattern": "Isolation Pull",
  "startingPosition": "Lie with lower-to-mid back contoured over stability ball. Plant feet wide on floor and place hands behind head.",
  "instructions": "Allow spine to gently extend backward over curvature of ball, then crunch forward curling ribcage toward pelvis.",
  "technique": "The ball allows extended range of motion compared to floor crunches for deeper abdominal stretch.",
  "breathing": "Inhale in extended stretch; exhale curling forward.",
  "commonMistakes": [
    "Yanking neck with hands",
    "Rolling hips on ball instead of curling spine"
  ],
  "safetyNotes": "Maintain stable foot footing on non-slip mat.",
  "alternatives": [
    "Standard Floor Crunches",
    "Cable Crunch"
  ],
  "recommendedSets": "3",
  "recommendedReps": "15-20",
  "recommendedRest": 45
},
  {
  "id": "half-kneeling-pallof-press-raise",
  "name": "Half-Kneeling Pallof Press with Overhead Raise",
  "muscle": "Abs",
  "subgroup": "Deep Core / Transverse Abdominis",
  "subgroups": [
    "Deep Core / Transverse Abdominis"
  ],
  "primaryMuscles": [
    "Transverse Abdominis",
    "Internal Obliques"
  ],
  "secondaryMuscles": [
    "Glutes",
    "Serratus Anterior"
  ],
  "equipment": "Cable Machine",
  "difficulty": "Intermediate",
  "type": "Compound",
  "movementPattern": "Isolation Push",
  "startingPosition": "Half-kneel perpendicular to cable machine with inside knee down. Hold cable handle at sternum with both hands.",
  "instructions": "Press cable straight out from chest, raise hands overhead while resisting cable pull, lower to chest level, and return.",
  "technique": "Triple-anti core demand: anti-rotation, anti-extension, and anti-lateral flexion simultaneously.",
  "breathing": "Exhale pressing and raising overhead; inhale returning.",
  "commonMistakes": [
    "Arching lower back on overhead raise",
    "Twisting toward cable tower"
  ],
  "safetyNotes": "Squeeze back glute tightly to lock pelvis in place.",
  "alternatives": [
    "Pallof Press",
    "Plank"
  ],
  "recommendedSets": "3",
  "recommendedReps": "8-10 per side",
  "recommendedRest": 60
}
];

export const PREBUILT_WORKOUT_PROGRAMS = [
  // 1. Beginner Full Body
  {
    id: 'prog-1-beginner-full-body',
    title: 'Beginner Full Body Foundation',
    durationDays: 3,
    level: 'Beginner',
    description: 'A 3-day full body routine focusing on fundamental multi-joint compound movement patterns, motor learning, and joint resilience.',
    splitType: 'Full Body (3 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Full Body A',
        exercises: [
          { name: 'Goblet Squat', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Flat Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Lateral Raise', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '45s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Full Body B',
        exercises: [
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Machine Chest Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Standing Calf Raise', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Deadbug', sets: 3, reps: '10 each', rest: '45s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Full Body C',
        exercises: [
          { name: 'Leg Press (45-Degree)', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Curl', sets: 3, reps: '12', rest: '45s' },
          { name: 'Tricep Rope Pushdown', sets: 3, reps: '12', rest: '45s' }
        ]
      }
    ]
  },

  // 2. Intermediate Full Body
  {
    id: 'prog-2-intermediate-full-body',
    title: 'Intermediate Full Body Progression',
    durationDays: 3,
    level: 'Intermediate',
    description: 'Higher volume 3-day alternating full body system balancing barbell compounds with targeted hypertrophy work.',
    splitType: 'Full Body (3-4 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Heavy Compounds & Posterior',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Seated Calf Raise', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Hanging Knee Raise', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Hinge, Vertical Press & Pull',
        exercises: [
          { name: 'Conventional Deadlift', sets: 3, reps: '5', rest: '180s' },
          { name: 'Standing Barbell Shoulder Press', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Pull-ups', sets: 4, reps: '6-10', rest: '90s' },
          { name: 'Lying Leg Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Hypertrophy & Unilateral',
        exercises: [
          { name: 'Leg Press (45-Degree)', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Chest-Supported Row', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'EZ-Bar Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s' }
        ]
      }
    ]
  },

  // 3. Upper / Lower Split
  {
    id: 'prog-3-upper-lower-split',
    title: 'Upper / Lower Hypertrophy Split',
    durationDays: 4,
    level: 'Intermediate',
    description: 'High-efficiency 4-day split training each muscle group twice weekly with optimal volume distribution and recovery.',
    splitType: 'Upper / Lower (4 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Upper Power',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '5-8', rest: '120s' },
          { name: 'Barbell Row', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Standing Barbell Shoulder Press', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Close-Grip Lat Pulldown', sets: 3, reps: '8-10', rest: '75s' },
          { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Lower Power',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Leg Press (45-Degree)', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Upper Hypertrophy',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s' },
          { name: 'Seated Cable Row', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s' },
          { name: 'Tricep Rope Pushdown', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Lower Hypertrophy',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Hip Thrust', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each', rest: '75s' },
          { name: 'Lying Leg Curl', sets: 4, reps: '10-14', rest: '60s' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10-12', rest: '60s' }
        ]
      }
    ]
  },

  // 4. Push / Pull / Legs (PPL)
  {
    id: 'prog-4-push-pull-legs',
    title: 'Push / Pull / Legs (PPL)',
    durationDays: 6,
    level: 'Advanced',
    description: 'Premier 6-day split grouping synergistic muscle groups for maximum training density, frequency, and progressive overload.',
    splitType: 'Push / Pull / Legs (6 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Push A (Chest & Delts)',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Standing Barbell Shoulder Press', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Tricep Rope Pushdown', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Pull A (Back & Biceps)',
        exercises: [
          { name: 'Conventional Deadlift', sets: 3, reps: '5', rest: '180s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Barbell Row', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s' },
          { name: 'Barbell Curl', sets: 3, reps: '8-10', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Legs A (Quad Focus)',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Leg Press (45-Degree)', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Push B (Incline & Triceps)',
        exercises: [
          { name: 'Incline Barbell Bench Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Dips', sets: 3, reps: '8-12', rest: '90s' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Cable Chest Fly', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 5,
        name: 'Day 5 – Pull B (Lats & Traps)',
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Chest-Supported Row', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Hammer Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Shrugs', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 6,
        name: 'Day 6 – Legs B (Hamstrings & Glutes)',
        exercises: [
          { name: 'Stiff-Legged Deadlift', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Hip Thrust', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Walking Lunges', sets: 3, reps: '10-12 each', rest: '75s' },
          { name: 'Seated Leg Curl', sets: 3, reps: '10-14', rest: '60s' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '10-12', rest: '60s' }
        ]
      }
    ]
  },

  // 5. Bro Split (5-Day Body Part Split)
  {
    id: 'prog-5-bro-split',
    title: 'Bro Split (5-Day Body Part Split)',
    durationDays: 5,
    level: 'Intermediate',
    description: 'Classic bodybuilding methodology dedicating an entire session to a single muscle group for maximum local metabolic pump and volume.',
    splitType: 'Body Part Split (5 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Chest Day',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Pec Deck', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Chest Dips', sets: 3, reps: '8-12', rest: '75s' },
          { name: 'Cable Chest Fly', sets: 3, reps: '15', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Back Day',
        exercises: [
          { name: 'Conventional Deadlift', sets: 3, reps: '5', rest: '180s' },
          { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Back Extensions', sets: 3, reps: '15', rest: '45s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Shoulder Day',
        exercises: [
          { name: 'Standing Barbell Shoulder Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Dumbbell Lateral Raise', sets: 5, reps: '12-15', rest: '60s' },
          { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'Reverse Pec Deck', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Barbell Shrugs', sets: 4, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Leg Day',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Leg Press (45-Degree)', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 5,
        name: 'Day 5 – Arm Day (Biceps & Triceps)',
        exercises: [
          { name: 'Close-Grip Bench Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Barbell Curl', sets: 4, reps: '8-10', rest: '75s' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Hammer Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Tricep Rope Pushdown', sets: 3, reps: '12-15', rest: '60s' }
        ]
      }
    ]
  },

  // 6. Strength Training (Powerlifting Focus)
  {
    id: 'prog-6-strength-powerlifting',
    title: 'Strength Training (Powerlifting Focus)',
    durationDays: 4,
    level: 'Advanced',
    description: 'Linear periodization focusing on the Big 3 lifts (Squat, Bench Press, Deadlift) with specialized accessory work for maximum neuromuscular force.',
    splitType: 'Powerlifting (4 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Heavy Squat & Core',
        exercises: [
          { name: 'Barbell Back Squat', sets: 5, reps: '3-5', rest: '180s' },
          { name: 'Pause Back Squats', sets: 3, reps: '4-6', rest: '120s' },
          { name: 'Leg Press (45-Degree)', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Ab Wheel Rollout', sets: 4, reps: '8-10', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Heavy Bench & Lockout',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 5, reps: '3-5', rest: '180s' },
          { name: 'Close-Grip Bench Press', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Barbell Row', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Heavy Deadlift & Posterior',
        exercises: [
          { name: 'Conventional Deadlift', sets: 4, reps: '3-5', rest: '180s' },
          { name: 'Rack Pull', sets: 3, reps: '4-6', rest: '150s' },
          { name: 'Barbell Shrugs', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Volume Bench & Shoulder Overload',
        exercises: [
          { name: 'Standing Barbell Shoulder Press', sets: 4, reps: '5-6', rest: '120s' },
          { name: 'Incline Barbell Bench Press', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Pull-ups', sets: 4, reps: '6-8', rest: '90s' },
          { name: "Farmer's Walk", sets: 3, reps: '40m', rest: '90s' }
        ]
      }
    ]
  },

  // 7. Hypertrophy (Muscle Building Focus)
  {
    id: 'prog-7-hypertrophy-muscle-building',
    title: 'Hypertrophy (Muscle Building Focus)',
    durationDays: 5,
    level: 'Intermediate',
    description: 'Volume-dense routine engineered around scientific hypertrophy principles: high mechanical tension, metabolic stress, and muscle damage in 8-15 rep ranges.',
    splitType: 'Hypertrophy Split (5 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Upper Torso Hypertrophy',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Pec Deck', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: '45s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Quad & Calf Hypertrophy',
        exercises: [
          { name: 'Leg Press (45-Degree)', sets: 4, reps: '10-14', rest: '90s' },
          { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Leg Extension', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s' },
          { name: 'Standing Calf Raise', sets: 5, reps: '12-15', rest: '45s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Shoulder & Arm Hypertrophy',
        exercises: [
          { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: '8-12', rest: '75s' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'EZ-Bar Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Hammer Curl', sets: 3, reps: '10-12', rest: '45s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Posterior Chain Hypertrophy',
        exercises: [
          { name: 'Romanian Deadlift', sets: 4, reps: '8-12', rest: '90s' },
          { name: 'Hip Thrust', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Seated Leg Curl', sets: 4, reps: '10-14', rest: '60s' },
          { name: 'Face Pulls', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Seated Calf Raise', sets: 4, reps: '15', rest: '45s' }
        ]
      },
      {
        dayNumber: 5,
        name: 'Day 5 – Metabolic Pump Finisher',
        exercises: [
          { name: 'Flat Dumbbell Press', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Single-Arm Lat Pulldown', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Cable Chest Fly', sets: 3, reps: '15', rest: '45s' },
          { name: 'Tricep Rope Pushdown', sets: 3, reps: '15', rest: '45s' },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '12', rest: '45s' }
        ]
      }
    ]
  },

  // 8. Dumbbell-Only Workout Program
  {
    id: 'prog-8-dumbbell-only',
    title: 'Dumbbell-Only Complete Program',
    durationDays: 3,
    level: 'Beginner',
    description: 'Designed for home gym enthusiasts or minimalist facilities with only dumbbell pairs. Covers every major movement plane.',
    splitType: 'Dumbbell Split (3-4 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Dumbbell Push',
        exercises: [
          { name: 'Flat Dumbbell Press', sets: 4, reps: '8-12', rest: '75s' },
          { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: '8-12', rest: '75s' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'Overhead Dumbbell Tricep Extension', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Dumbbell Pull',
        exercises: [
          { name: 'Single-Arm Dumbbell Row', sets: 4, reps: '8-12', rest: '75s' },
          { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Rear Delt Fly', sets: 3, reps: '12-15', rest: '45s' },
          { name: 'Alternating Dumbbell Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Dumbbell Shrugs', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Dumbbell Legs & Core',
        exercises: [
          { name: 'Goblet Squat', sets: 4, reps: '10-15', rest: '75s' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each', rest: '75s' },
          { name: 'Walking Lunges', sets: 3, reps: '10 each', rest: '60s' },
          { name: 'Single-Leg Calf Raise', sets: 3, reps: '15', rest: '45s' },
          { name: 'Russian Twist', sets: 3, reps: '20', rest: '45s' }
        ]
      }
    ]
  },

  // 9. Machine-Only Workout Program
  {
    id: 'prog-9-machine-only',
    title: 'Machine-Only Joint-Friendly Program',
    durationDays: 3,
    level: 'Beginner',
    description: 'Safe, low-axial loading program utilizing guided weight machines to build strength and hypertrophy with minimal joint shear.',
    splitType: 'Machine Circuit (3 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Machine Upper Body',
        exercises: [
          { name: 'Machine Chest Press', sets: 4, reps: '10-12', rest: '60s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12', rest: '60s' },
          { name: 'Machine Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Machine Row', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Pec Deck', sets: 3, reps: '12-15', rest: '45s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Machine Lower Body',
        exercises: [
          { name: 'Leg Press (45-Degree)', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Leg Extension', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Seated Leg Curl', sets: 4, reps: '10-14', rest: '60s' },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rest: '45s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Machine Arms & Core',
        exercises: [
          { name: 'Straight-Bar Cable Pushdown', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'Cable Curl', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'Machine Preacher Curl', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Cable Crunch', sets: 4, reps: '12-15', rest: '45s' },
          { name: "Captain's Chair Leg Raise", sets: 3, reps: '12-15', rest: '45s' }
        ]
      }
    ]
  },

  // 10. Home Workout (Minimal Equipment)
  {
    id: 'prog-10-home-minimal',
    title: 'Home Workout (Minimal Equipment)',
    durationDays: 3,
    level: 'Beginner',
    description: 'Requires only floor space, resistance bands, or basic furniture. Ideal for travel or busy schedules.',
    splitType: 'Home Routine (3 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Upper Body & Push',
        exercises: [
          { name: 'Push-ups', sets: 4, reps: '15-20', rest: '60s' },
          { name: 'Bench Dips', sets: 3, reps: '12-15', rest: '45s' },
          { name: 'Plank', sets: 3, reps: '60s', rest: '45s' },
          { name: 'Burpees', sets: 3, reps: '10', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Lower Body Mobility',
        exercises: [
          { name: 'Walking Lunges', sets: 4, reps: '15 each', rest: '60s' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each', rest: '60s' },
          { name: 'Single-Leg Calf Raise', sets: 4, reps: '15 each', rest: '45s' },
          { name: 'Deadbug', sets: 3, reps: '12 each', rest: '30s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Full Body Ignition',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 'Max', rest: '60s' },
          { name: 'Step-ups', sets: 3, reps: '15 each', rest: '45s' },
          { name: 'Russian Twist', sets: 3, reps: '20', rest: '30s' },
          { name: 'Side Plank', sets: 3, reps: '30s each', rest: '30s' }
        ]
      }
    ]
  },

  // 11. Bodyweight / Calisthenics Program
  {
    id: 'prog-11-calisthenics',
    title: 'Bodyweight / Calisthenics Mastery',
    durationDays: 4,
    level: 'Intermediate',
    description: 'Strict bodyweight training system developing extraordinary relative strength, gymnastic control, and muscle definition.',
    splitType: 'Calisthenics (4 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Pull Mastery',
        exercises: [
          { name: 'Pull-ups', sets: 5, reps: '5-10', rest: '90s' },
          { name: 'Chin-ups', sets: 4, reps: '6-8', rest: '90s' },
          { name: 'Dead Hang', sets: 3, reps: '60s', rest: '60s' },
          { name: 'Hanging Leg Raise', sets: 4, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Push Mastery',
        exercises: [
          { name: 'Chest Dips', sets: 4, reps: '8-12', rest: '90s' },
          { name: 'Push-ups', sets: 4, reps: '20-25', rest: '60s' },
          { name: 'Bench Dips', sets: 3, reps: '15', rest: '45s' },
          { name: 'Dragon Flag', sets: 3, reps: '6-8', rest: '90s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Calisthenics Legs & Core',
        exercises: [
          { name: 'Bulgarian Split Squats', sets: 4, reps: '12 each', rest: '60s' },
          { name: 'Sissy Squats', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Nordic Hamstring Curl', sets: 3, reps: '6-8', rest: '90s' },
          { name: 'Ab Wheel Rollout', sets: 4, reps: '10-12', rest: '60s' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 – Dynamic Conditioning',
        exercises: [
          { name: 'Pull-ups', sets: 3, reps: 'Max', rest: '90s' },
          { name: 'Chest Dips', sets: 3, reps: 'Max', rest: '90s' },
          { name: 'Burpees', sets: 4, reps: '15', rest: '60s' },
          { name: 'Plank', sets: 3, reps: '60s', rest: '45s' }
        ]
      }
    ]
  },

  // 12. General Fitness & Conditioning Program
  {
    id: 'prog-12-general-fitness',
    title: 'General Fitness & Conditioning',
    durationDays: 3,
    level: 'Beginner',
    description: 'Hybrid endurance, strength, and cardiovascular health program balancing strength exercises with kettlebells and sled intervals.',
    splitType: 'Hybrid Conditioning (3 Days/Week)',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 – Strength & Kettlebell Engine',
        exercises: [
          { name: 'Goblet Squat', sets: 3, reps: '12', rest: '60s' },
          { name: 'Flat Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Kettlebell Swing', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Medicine Ball Slam', sets: 3, reps: '15', rest: '45s' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 – Locomotive Engine & Back',
        exercises: [
          { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '75s' },
          { name: 'Wide-Grip Lat Pulldown', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Sled Push', sets: 4, reps: '30m', rest: '60s' },
          { name: "Farmer's Walk", sets: 3, reps: '40m', rest: '60s' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 – Metabolic Threshold',
        exercises: [
          { name: 'Thrusters', sets: 4, reps: '10', rest: '75s' },
          { name: 'Battle Ropes', sets: 4, reps: '30s', rest: '45s' },
          { name: 'Burpees', sets: 3, reps: '12', rest: '45s' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' }
        ]
      }
    ]
  }
];
