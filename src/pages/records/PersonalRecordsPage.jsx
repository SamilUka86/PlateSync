import React, { useEffect } from 'react';
import { Trophy, Award, Flame, Dumbbell, Calendar, ArrowUpRight } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { KG_TO_LBS } from '../../utils/weightCalculations';

export const PersonalRecordsPage = () => {
  const { metrics } = useWorkout();
  const { userProfile } = useAuth();
  const preferredUnit = userProfile?.preferredUnit || 'KG';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const prEntries = Object.entries(metrics.personalRecords || {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-midnight-card border border-midnight-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-gold shadow-[0_0_12px_rgba(245,196,81,0.5)]" />
            <span className="text-[10px] uppercase font-black text-neon-gold tracking-wider">
              All-Time Personal Records & Strength Milestones
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Personal Records (PRs)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gold-standard benchmark lifts detected automatically from your completed workouts.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-midnight-bg border border-neon-gold/30 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Records</span>
          <span className="text-xl font-black font-mono text-neon-gold">
            {prEntries.length} PRs
          </span>
        </div>
      </div>

      {/* PR Cards Grid */}
      {prEntries.length === 0 ? (
        <div className="p-16 text-center bg-midnight-card border border-midnight-border rounded-3xl space-y-3">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Personal Records established yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log your sets in the Workout Tracker and your heaviest successful working sets will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prEntries.map(([name, pr]) => {
            const dateStr = new Date(pr.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={name}
                className="p-5 rounded-2xl bg-midnight-card border border-midnight-border hover:border-neon-gold/40 transition group space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center text-neon-gold">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-neon-gold/10 text-neon-gold border border-neon-gold/30 text-[10px] font-black font-mono">
                    OFFICIAL PR
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-neon-gold transition truncate">
                    {name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {pr.reps} repetition peak set
                  </p>
                </div>

                <div className="pt-2 border-t border-midnight-border flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black font-mono text-white">
                      {preferredUnit === 'LB' ? `${pr.maxWeightLbs} LB` : `${pr.maxWeightKg} KG`}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      {preferredUnit === 'LB' ? `(${pr.maxWeightKg} KG)` : `(${pr.maxWeightLbs} LB)`}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {dateStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
