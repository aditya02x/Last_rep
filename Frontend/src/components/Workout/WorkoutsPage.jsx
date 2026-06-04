import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkouts, createWorkout } from '../../services/workout.js'
import { Plus, Dumbbell, ChevronRight, X, Trash2 } from 'lucide-react'

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [creating, setCreating] = useState(false);

  const SUGGESTIONS = [
    'Push Day', 'Pull Day', 'Leg Day', 'Upper Body',
    'Lower Body', 'Full Body', 'Chest & Triceps',
    'Back & Biceps', 'Shoulders', 'Arms', 'Core'
  ]

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleCreate = async () => {
    if (!workoutName.trim()) return;
    try {
      setCreating(true);
      // create with empty exercises first, user adds them on next page
      const data = await createWorkout({
        workoutName: workoutName.trim(),
        exercises: [{ exerciseName: 'placeholder', sets: 1, reps: 1, weight: 0 }]
      });
      setShowModal(false);
      setWorkoutName('');
      navigate(`/workouts/${data.workout._id}/log`);
    } catch (error) {
      console.error('Failed to create workout:', error);
    } finally {
      setCreating(false);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 86400) return 'today';
    if (diff < 172800) return 'yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div
      className="min-h-screen bg-[#0a0f1c] px-4 pt-6 pb-28"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Your</p>
          <h1 className="text-white text-2xl font-bold">Workouts</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-2xl bg-[#a3e635] flex items-center justify-center hover:bg-[#bef264] active:scale-95 transition-all"
        >
          <Plus size={20} className="text-black" strokeWidth={2.5} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1c2333] rounded-2xl p-4 animate-pulse">
              <div className="h-5 w-32 bg-white/10 rounded mb-2" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && workouts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center">
            <Dumbbell size={28} className="text-[#a3e635]" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg mb-1">No workouts yet</p>
            <p className="text-gray-500 text-sm">Tap + to create your first workout</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#a3e635] text-black font-bold px-6 py-3 rounded-2xl hover:bg-[#bef264] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Create Workout
          </button>
        </div>
      )}

      {/* Workout list */}
      {!loading && workouts.length > 0 && (
        <div className="flex flex-col gap-3">
          {workouts.map((workout) => (
            <button
              key={workout._id}
              onClick={() => navigate(`/workouts/${workout._id}/log`)}
              className="bg-[#1c2333] rounded-2xl p-4 flex items-center gap-4 border border-white/[0.05] hover:border-[#a3e635]/20 active:scale-[0.99] transition-all text-left w-full"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Dumbbell size={20} className="text-[#a3e635]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">
                  {workout.workoutName}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {workout.exercises?.length || 0} exercises · {timeAgo(workout.createdAt)}
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-600 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Create Workout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end">
          <div
            className="w-full bg-[#111827] rounded-t-3xl p-6 border-t border-white/[0.08]"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-lg font-bold">New Workout</h2>
              <button
                onClick={() => { setShowModal(false); setWorkoutName(''); }}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Workout name..."
              autoFocus
              className="w-full bg-black/30 text-white text-base rounded-2xl px-4 py-3.5 outline-none border border-white/5 placeholder:text-gray-600 focus:border-[#a3e635]/40 transition-all mb-4"
            />

            {/* Quick suggestions */}
            <p className="text-gray-500 text-[11px] uppercase tracking-widest mb-2">Quick select</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setWorkoutName(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    workoutName === s
                      ? 'bg-[#a3e635] text-black border-[#a3e635]'
                      : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:border-[#a3e635]/30 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Create button */}
            <button
              onClick={handleCreate}
              disabled={!workoutName.trim() || creating}
              className="w-full bg-[#a3e635] text-black font-bold text-base py-4 rounded-2xl hover:bg-[#bef264] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating…' : 'Create & Log Exercises →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutsPage