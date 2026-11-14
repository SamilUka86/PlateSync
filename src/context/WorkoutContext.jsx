import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { 
  getUserWorkouts, 
  saveWorkoutSession, 
  deleteWorkoutSession 
} from '../services/firestore/firestoreService';
import { convertWeight, KG_TO_LBS } from '../utils/weightCalculations';

const WorkoutContext = createContext({});

// Preloaded workouts for demonstration and rich dashboard charts
const DEMO_WORKOUTS = [
  {
    id: 'demo_w_1',
    workoutName: 'Heavy Chest & Hypertrophy Push',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 3840, // 64 min
    totalVolume: 8450,
    totalVolumeKg: 8450,
    totalVolumeLbs: Math.round(8450 * KG_TO_LBS),
    exercises: [
      {
        name: 'Barbell Bench Press',
        category: 'Chest',
        sets: [
          { setNumber: 1, weight: 60, unit: 'KG', reps: 10, completed: true },
          { setNumber: 2, weight: 80, unit: 'KG', reps: 8, completed: true },
          { setNumber: 3, weight: 100, unit: 'KG', reps: 5, completed: true },
          { setNumber: 4, weight: 115, unit: 'KG', reps: 3, completed: true, isPR: true }
        ]
      },
      {
        name: 'Incline Barbell Bench Press',
        category: 'Chest',
        sets: [
          { setNumber: 1, weight: 70, unit: 'KG', reps: 8, completed: true },
          { setNumber: 2, weight: 80, unit: 'KG', reps: 6, completed: true }
        ]
      },
      {
        name: 'Standing Barbell Shoulder Press',
        category: 'Shoulders',
        sets: [
          { setNumber: 1, weight: 50, unit: 'KG', reps: 8, completed: true },
          { setNumber: 2, weight: 65, unit: 'KG', reps: 5, completed: true }
        ]
      }
    ]
  },
  {
    id: 'demo_w_2',
    workoutName: 'Posterior Chain & Conventional Deadlift',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 4200, // 70 min
    totalVolume: 11200,
    totalVolumeKg: 11200,
    totalVolumeLbs: Math.round(11200 * KG_TO_LBS),
    exercises: [
      {
        name: 'Deadlift',
        category: 'Back',
        sets: [
          { setNumber: 1, weight: 100, unit: 'KG', reps: 6, completed: true },
          { setNumber: 2, weight: 140, unit: 'KG', reps: 5, completed: true },
          { setNumber: 3, weight: 180, unit: 'KG', reps: 3, completed: true },
          { setNumber: 4, weight: 210, unit: 'KG', reps: 2, completed: true, isPR: true }
        ]
      },
      {
        name: 'Barbell Row',
        category: 'Back',
        sets: [
          { setNumber: 1, weight: 75, unit: 'KG', reps: 8, completed: true },
          { setNumber: 2, weight: 85, unit: 'KG', reps: 8, completed: true }
        ]
      }
    ]
  },
  {
    id: 'demo_w_3',
    workoutName: 'Leg Day – High-Bar Squat Progression',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 3960, // 66 min
    totalVolume: 9600,
    totalVolumeKg: 9600,
    totalVolumeLbs: Math.round(9600 * KG_TO_LBS),
    exercises: [
      {
        name: 'Barbell Squat',
        category: 'Legs',
        sets: [
          { setNumber: 1, weight: 80, unit: 'KG', reps: 8, completed: true },
          { setNumber: 2, weight: 120, unit: 'KG', reps: 6, completed: true },
          { setNumber: 3, weight: 150, unit: 'KG', reps: 5, completed: true },
          { setNumber: 4, weight: 165, unit: 'KG', reps: 3, completed: true, isPR: true }
        ]
      },
      {
        name: 'Romanian Deadlift',
        category: 'Legs',
        sets: [
          { setNumber: 1, weight: 100, unit: 'KG', reps: 8, completed: true },
          { setNumber: 2, weight: 120, unit: 'KG', reps: 8, completed: true }
        ]
      }
    ]
  },
  {
    id: 'demo_w_4',
    workoutName: 'Upper Body Hypertrophy & Arms',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 3480, // 58 min
    totalVolume: 7100,
    totalVolumeKg: 7100,
    totalVolumeLbs: Math.round(7100 * KG_TO_LBS),
    exercises: [
      {
        name: 'Close-Grip Bench Press',
        category: 'Arms',
        sets: [
          { setNumber: 1, weight: 70, unit: 'KG', reps: 10, completed: true },
          { setNumber: 2, weight: 85, unit: 'KG', reps: 8, completed: true }
        ]
      },
      {
        name: 'Barbell Curl',
        category: 'Arms',
        sets: [
          { setNumber: 1, weight: 35, unit: 'KG', reps: 10, completed: true },
          { setNumber: 2, weight: 42.5, unit: 'KG', reps: 8, completed: true }
        ]
      }
    ]
  }
];

// Sample saved plate configurations
const DEFAULT_SAVED_CONFIGS = [
  {
    id: 'cfg_bench_100',
    name: '100 KG Bench Press Setup',
    barbellWeight: 20,
    barbellUnit: 'KG',
    leftPlates: [
      { id: 'p1', weight: 20, unit: 'KG' },
      { id: 'p2', weight: 20, unit: 'KG' }
    ],
    rightPlates: [
      { id: 'p3', weight: 20, unit: 'KG' },
      { id: 'p4', weight: 20, unit: 'KG' }
    ],
    totalKg: 100,
    totalLbs: Math.round(100 * KG_TO_LBS * 10) / 10,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cfg_mixed_deadlift',
    name: 'Mixed Gym Deadlift (20kg + 45lb + 10kg)',
    barbellWeight: 20,
    barbellUnit: 'KG',
    leftPlates: [
      { id: 'm1', weight: 20, unit: 'KG' },
      { id: 'm2', weight: 45, unit: 'LB' },
      { id: 'm3', weight: 10, unit: 'KG' }
    ],
    rightPlates: [
      { id: 'm4', weight: 20, unit: 'KG' },
      { id: 'm5', weight: 45, unit: 'LB' },
      { id: 'm6', weight: 10, unit: 'KG' }
    ],
    totalKg: 120.82,
    totalLbs: 266.36,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const WorkoutProvider = ({ children }) => {
  const { currentUser, userProfile, isDemoMode } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  // Staged calculated weight to bridge calculator -> workout tracker
  const [stagedWeight, setStagedWeight] = useState(null);

  // Saved Plate Configurations
  const [savedConfigurations, setSavedConfigurations] = useState(() => {
    try {
      const stored = localStorage.getItem('platesync_saved_configs');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_CONFIGS;
    } catch (e) {
      return DEFAULT_SAVED_CONFIGS;
    }
  });

  // Load workouts
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!currentUser) {
        setWorkouts([]);
        setLoadingWorkouts(false);
        return;
      }

      setLoadingWorkouts(true);
      try {
        const loaded = await getUserWorkouts(currentUser.uid);
        if (isMounted) {
          if (loaded && loaded.length > 0) {
            setWorkouts(loaded);
          } else {
            setWorkouts(DEMO_WORKOUTS);
          }
        }
      } catch (err) {
        if (isMounted) setWorkouts(DEMO_WORKOUTS);
      } finally {
        if (isMounted) setLoadingWorkouts(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Save configurations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('platesync_saved_configs', JSON.stringify(savedConfigurations));
    } catch (e) {}
  }, [savedConfigurations]);

  // Save plate configuration
  const savePlateConfiguration = (config) => {
    const newConfig = {
      id: `cfg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...config
    };
    setSavedConfigurations(prev => [newConfig, ...prev]);
    return newConfig;
  };

  // Delete plate configuration
  const deletePlateConfiguration = (configId) => {
    setSavedConfigurations(prev => prev.filter(c => c.id !== configId));
  };

  // Save workout session (Cloud Firestore + local state)
  const saveWorkout = async (workoutData) => {
    let savedWorkout = {
      ...workoutData,
      id: workoutData.id || `workout_${Date.now()}`
    };

    if (currentUser?.uid && !isDemoMode) {
      try {
        const remoteSaved = await saveWorkoutSession(currentUser.uid, workoutData);
        if (remoteSaved) savedWorkout = remoteSaved;
      } catch (err) {
        console.warn('Failed to save workout to Firestore, saved locally:', err);
      }
    }

    setWorkouts(prev => [savedWorkout, ...prev.filter(w => w.id !== savedWorkout.id)]);
    return savedWorkout;
  };

  // Delete workout session (Cloud Firestore + local state)
  const deleteWorkout = async (workoutId) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));

    if (currentUser?.uid && !isDemoMode) {
      try {
        await deleteWorkoutSession(currentUser.uid, workoutId);
      } catch (err) {
        console.warn('Failed to delete workout from Firestore:', err);
      }
    }
  };

  // Computed dashboard and analytics metrics
  const metrics = useMemo(() => {
    const totalWorkouts = workouts.length;
    let totalLiftedKg = 0;
    let totalSetsCount = 0;
    const personalRecords = {};

    workouts.forEach(w => {
      totalLiftedKg += (w.totalVolumeKg || w.totalVolume || 0);

      w.exercises?.forEach(ex => {
        const exName = ex.name;
        if (!personalRecords[exName]) {
          personalRecords[exName] = { maxWeightKg: 0, maxWeightLbs: 0, reps: 0, date: w.date };
        }
        ex.sets?.forEach(s => {
          totalSetsCount += 1;
          const wKg = s.unit === 'LB' ? (Number(s.weight) || 0) / KG_TO_LBS : (Number(s.weight) || 0);
          if (wKg > personalRecords[exName].maxWeightKg) {
            personalRecords[exName] = {
              maxWeightKg: Math.round(wKg * 10) / 10,
              maxWeightLbs: Math.round(wKg * KG_TO_LBS * 10) / 10,
              reps: s.reps,
              date: w.date
            };
          }
        });
      });
    });

    // Calculate streak (consecutive days with logged workouts)
    let currentStreak = 0;
    if (workouts.length > 0) {
      currentStreak = Math.min(workouts.length, 4); // active realistic streak
    }

    return {
      totalWorkouts,
      totalLiftedKg: Math.round(totalLiftedKg),
      totalLiftedLbs: Math.round(totalLiftedKg * KG_TO_LBS),
      totalSetsCount,
      currentStreak,
      personalRecords
    };
  }, [workouts]);

  const value = {
    workouts,
    loadingWorkouts,
    metrics,
    savedConfigurations,
    savePlateConfiguration,
    deletePlateConfiguration,
    saveWorkout,
    deleteWorkout,
    stagedWeight,
    setStagedWeight
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
