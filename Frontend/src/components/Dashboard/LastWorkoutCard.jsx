import React, { useEffect, useState } from 'react'
import { getWorkouts } from '../../services/workout.js'
import { Dumbbell, ChevronRight } from 'lucide-react'

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

  const topSet = workout?.exercises?.reduce((max, ex) =>
    (ex.weight || 0) > (max?.weight || 0) ? ex : max, null
  );

  // LOADING
  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-28 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-16 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-3 w-1/2 bg-white/10 rounded-lg" />
            <div className="h-3 w-2/3 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // EMPTY
  if (!workout) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-base font-bold">Last workout</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
            <Dumbbell size={22} className="text-[#a3e635]" />
          </div>
          <p className="text-gray-500 text-sm">No workouts logged yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-base font-bold">Last workout</p>
        <span className="text-gray-400 text-sm cursor-pointer hover:text-[#a3e635] transition-colors">
          History →
        </span>
      </div>

      {/* Card — single row like your screenshot */}
      <div className="bg-[#111827] rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border hover:border-[#a3e635]/20 transition-all active:scale-[0.99]">

        {/* Left — dumbbell icon */}
        <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
          <Dumbbell size={22} className="text-[#a3e635]" />
        </div>

        {/* Middle — workout info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-base font-bold leading-tight">
            {workout.workoutName}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {timeAgo(workout.createdAt)} · {workout.exercises?.length || 0} exercises
          </p>
          {topSet && (
            <p className="text-[#a3e635] text-xs mt-1 font-medium truncate">
              Top set · {topSet.exerciseName} · {topSet.weight}kg × {topSet.reps}
            </p>
          )}
        </div>

        {/* Right — arrow */}
        <ChevronRight size={18} className="text-gray-500 shrink-0" />
      </div>
    </div>
  )
}

export default LastWorkoutCard