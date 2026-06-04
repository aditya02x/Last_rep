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
        // already sorted by createdAt -1, so first one is latest
        if (data.workouts && data.workouts.length > 0) {
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
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // total sets across all exercises
  const totalSets = workout?.exercises?.reduce((acc, ex) => acc + ex.sets, 0);

  // top set = highest weight exercise
  const topSet = workout?.exercises?.reduce((max, ex) =>
    ex.weight > (max?.weight || 0) ? ex : max, null
  );

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/5 bg-gradient-to-br from-[#161e2e]/80 via-[#111827]/80 to-[#0b1120]/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" />
          <p className="text-gray-400 text-sm">Loading last workout…</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/[0.06] bg-gradient-to-br from-[#1a2335]/90 via-[#111827]/90 to-[#0a0f1c]/90">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center">
            <Dumbbell size={20} className="text-[#a3e635]" />
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em]">Last Workout</p>
            <p className="text-gray-400 text-sm mt-0.5">No workouts logged yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/[0.06] bg-gradient-to-br from-[#1a2335]/90 via-[#111827]/90 to-[#0a0f1c]/90 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-[#a3e635]/20 active:scale-[0.99]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-[#a3e635]/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Label + arrow */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#a3e635]/15 border border-[#a3e635]/25 flex items-center justify-center">
            <Dumbbell size={14} className="text-[#a3e635]" />
          </div>
          <p className="text-[#a3e635] text-[10px] font-bold uppercase tracking-[0.25em]">
            Last Workout
          </p>
        </div>
        <div className="flex items-center gap-1 text-gray-500 hover:text-[#a3e635] transition-colors cursor-pointer">
          <span className="text-xs font-medium">Details</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Workout name + time */}
      <div className="relative mb-4">
        <h2 className="text-white text-2xl font-bold leading-tight mb-1">
          {workout.workoutName}
        </h2>
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{timeAgo(workout.createdAt)}</span>
          </div>
          <span>•</span>
          <span>{workout.exercises.length} exercises</span>
          <span>•</span>
          <span>{totalSets} sets</span>
        </div>
      </div>

      {/* Top set highlight */}
      {topSet && (
        <div className="relative flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 border border-[#a3e635]/15 bg-[#a3e635]/5">
          <Flame size={16} className="text-[#a3e635] shrink-0" />
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Top Set</p>
            <p className="text-white text-sm font-semibold">
              {topSet.exerciseName}
              <span
                className="text-[#a3e635] ml-2 tabular-nums"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {topSet.weight}kg × {topSet.reps}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Exercise pills */}
      <div className="relative flex flex-wrap gap-2">
        {workout.exercises.slice(0, 4).map((ex, i) => (
          <span
            key={i}
            className="text-xs text-gray-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full"
          >
            {ex.exerciseName}
          </span>
        ))}
        {workout.exercises.length > 4 && (
          <span className="text-xs text-gray-500 bg-white/[0.03] border border-white/[0.05] px-3 py-1 rounded-full">
            +{workout.exercises.length - 4} more
          </span>
        )}
      </div>
    </div>
  )
}

export default LastWorkoutCard