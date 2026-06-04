import React, { useEffect, useState } from 'react'
import { getWorkouts } from '../../services/workout.js'
import { Dumbbell, ChevronRight, Clock, Flame } from 'lucide-react'

const LastWorkoutCard = () => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        if (data?.workouts && data.workouts.length > 0) {
          setWorkout(data.workouts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const totalSets = workout?.exercises?.reduce((acc, ex) => acc + (ex.sets || 0), 0) || 0;

  const topSet = workout?.exercises?.reduce((max, ex) =>
    (ex.weight || 0) > (max?.weight || 0) ? ex : max, null
  );

  // 1. LOADING SKELETON STATE (Matches the structural shape of the card)
  if (loading) {
    return (
      <div className="w-full rounded-3xl p-6 border border-zinc-800/50 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 w-28 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-12 bg-zinc-800 rounded-lg" />
        </div>
        <div className="h-8 w-3/4 bg-zinc-800 rounded-xl mb-3" />
        <div className="h-4 w-1/2 bg-zinc-800 rounded-lg mb-6" />
        <div className="h-14 w-full bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!workout) {
    return (
      <div className="group relative overflow-hidden rounded-3xl p-6 border border-zinc-800/60 bg-gradient-to-br from-zinc-900/50 via-zinc-950/70 to-black/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Dumbbell size={22} className="text-lime-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.15em]">Last Workout</p>
            <p className="text-zinc-300 text-sm font-medium mt-0.5">No training sessions logged yet</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE DATA STATE
  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-6 border border-zinc-800/80 bg-gradient-to-br from-zinc-900/40 via-zinc-950/60 to-black/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-lime-500/30 hover:shadow-lime-500/[0.02]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Dynamic ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-52 w-52 rounded-full bg-lime-500/[0.06] blur-3xl group-hover:bg-lime-500/[0.09] transition-colors duration-500" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

      {/* Header Row */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center">
            <Dumbbell size={15} className="text-lime-400" />
          </div>
          <span className="text-lime-400 text-[11px] font-extrabold uppercase tracking-[0.2em]">
            Last Workout
          </span>
        </div>
        
        <button className="flex items-center gap-1 text-zinc-400 hover:text-lime-400 transition-colors group/btn text-xs font-semibold bg-zinc-900/60 hover:bg-zinc-800/80 py-1.5 px-3 rounded-full border border-zinc-800/80">
          <span>Details</span>
          <ChevronRight size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Workout Name & Meta Stats */}
      <div className="relative mb-5">
        <h2 className="text-white text-2xl font-bold tracking-tight leading-tight mb-2 group-hover:text-lime-50/90 transition-colors">
          {workout.workoutName}
        </h2>
        
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-zinc-400 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-zinc-900/40 px-2 py-0.5 rounded-md border border-zinc-800/30">
            <Clock size={13} className="text-zinc-500" />
            <span className="text-zinc-300">{timeAgo(workout.createdAt)}</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-zinc-300">{workout.exercises?.length || 0} exercises</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-300">{totalSets} sets</span>
        </div>
      </div>

      {/* Top Set Highlight Section */}
      {topSet && (
        <div className="relative flex items-center gap-3.5 rounded-2xl p-3.5 mb-5 border border-lime-500/10 bg-gradient-to-r from-lime-500/[0.03] to-transparent">
          <div className="w-8 h-8 rounded-xl bg-lime-500/10 flex items-center justify-center shrink-0">
            <Flame size={16} className="text-lime-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Top PR Set</p>
            <p className="text-zinc-200 text-sm font-semibold truncate flex items-center justify-between">
              <span className="truncate">{topSet.exerciseName}</span>
              <span
                className="text-lime-400 ml-3 font-bold tabular-nums tracking-wide bg-lime-950/30 border border-lime-500/10 px-2 py-0.5 rounded-lg text-xs"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {topSet.weight}kg {topSet.reps ? `× ${topSet.reps}` : ''}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Exercise Sub-pills */}
      <div className="relative flex flex-wrap gap-1.5">
        {workout.exercises?.slice(0, 4).map((ex, i) => (
          <span
            key={i}
            className="text-[11px] font-medium text-zinc-300 bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/80 px-2.5 py-1 rounded-lg transition-colors cursor-default"
          >
            {ex.exerciseName}
          </span>
        ))}
        {workout.exercises?.length > 4 && (
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-900/30 border border-zinc-800/40 px-2.5 py-1 rounded-lg">
            +{workout.exercises.length - 4} more
          </span>
        )}
      </div>
    </div>
  )
}

export default LastWorkoutCard;