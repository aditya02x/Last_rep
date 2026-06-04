import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkout, getWorkoutById } from '../../services/workout.js'
import {
  ChevronLeft, Save, Dumbbell, Minus, Plus, Trash2,
  Home, TrendingUp, User
} from 'lucide-react'

const SUGGESTIONS = [
  'Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Squat', 'Deadlift',
  'Pull Up', 'Shoulder Press', 'Bicep Curl', 'Tricep Dip', 'Leg Press',
  'Lat Pulldown', 'Romanian Deadlift', 'Cable Row', 'Face Pull', 'Hip Thrust'
]

const emptyExercise = () => ({
  id: Date.now() + Math.random(),
  exerciseName: '',
  weight: 0,
  reps: 0,
  sets: 0,
  lastSession: null,
})

const Stepper = ({ label, value, unit, onDec, onInc }) => (
  <div className="flex-1">
    <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em] text-center mb-2">
      {label}
    </p>
    <div className="bg-black/40 border border-white/[0.06] rounded-2xl flex items-center justify-between px-3 py-3">
      <button
        onClick={onDec}
        className="text-gray-400 hover:text-[#a3e635] active:scale-90 transition"
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <div className="flex items-baseline gap-0.5 tabular-nums">
        <span className="text-white text-lg font-bold leading-none">{value}</span>
        {unit && <span className="text-gray-500 text-[10px] font-medium">{unit}</span>}
      </div>
      <button
        onClick={onInc}
        className="text-gray-400 hover:text-[#a3e635] active:scale-90 transition"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  </div>
)

const WorkoutLogPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [workoutName, setWorkoutName] = useState('Push Day')
  const [exercises, setExercises] = useState([
    { id: 1, exerciseName: 'Bench Press', weight: 60, reps: 8, sets: 3,
      lastSession: { weight: 60, reps: 8, sets: 3 } },
    { id: 2, exerciseName: 'Incline Dumbbell Press', weight: 22.5, reps: 10, sets: 3,
      lastSession: { weight: 22.5, reps: 10, sets: 3 } },
    { id: 3, exerciseName: 'Cable Fly', weight: 15, reps: 12, sets: 3,
      lastSession: { weight: 15, reps: 12, sets: 3 } },
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id)
        setWorkoutName(data.workout.workoutName)
        if (data.workout.exercises?.length) {
          setExercises(
            data.workout.exercises.map((e, i) => ({
              id: e._id || i,
              exerciseName: e.exerciseName,
              weight: e.weight ?? 0,
              reps: e.reps ?? 0,
              sets: e.sets ?? 0,
              lastSession: e.lastSession || { weight: e.weight, reps: e.reps, sets: e.sets },
            }))
          )
        }
      } catch (err) {
        console.error('Failed to fetch workout:', err)
      }
    }
    if (id) fetchWorkout()
  }, [id])

  const adjust = (exId, field, delta) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exId
          ? { ...ex, [field]: Math.max(0, +(ex[field] + delta).toFixed(2)) }
          : ex
      )
    )
  }

  const removeExercise = (exId) => {
    if (exercises.length === 1) return
    setExercises(prev => prev.filter(ex => ex.id !== exId))
  }

  const addExercise = () => setExercises(prev => [...prev, emptyExercise()])

  const handleSave = async () => {
    try {
      setSaving(true)
      await createWorkout({
        workoutName,
        exercises: exercises.map(({ exerciseName, sets, reps, weight }) => ({
          exerciseName, sets: Number(sets), reps: Number(reps), weight: Number(weight),
        })),
      })
      navigate('/workouts')
    } catch (err) {
      console.error('Failed to save workout:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#0a0f1c] pb-24"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-5">
        <button
          onClick={() => navigate('/workouts')}
          className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] active:scale-95 transition"
        >
          <ChevronLeft size={20} className="text-gray-400" />
        </button>

        <div className="text-center -mt-0.5">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-[0.25em] mb-0.5">
            {workoutName}
          </p>
          <h1 className="text-white text-lg font-bold leading-tight">New Workout</h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-11 h-11 rounded-full bg-[#a3e635] flex items-center justify-center hover:bg-[#bef264] active:scale-95 transition disabled:opacity-50 shadow-lg shadow-[#a3e635]/20"
        >
          <Save size={18} className="text-black" strokeWidth={2.5} />
        </button>
      </div>

      {/* Exercise cards */}
      <div className="px-4 flex flex-col gap-4">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-[#111827] rounded-2xl border border-white/[0.05] overflow-hidden"
          >
            {/* Title row */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-[#a3e635]" />
              </div>
              <input
                value={ex.exerciseName}
                onChange={(e) =>
                  setExercises(prev =>
                    prev.map(x => x.id === ex.id ? { ...x, exerciseName: e.target.value } : x)
                  )
                }
                placeholder="Exercise name"
                className="flex-1 bg-transparent text-white text-base font-bold outline-none placeholder:text-gray-600"
              />
              <button
                onClick={() => removeExercise(ex.id)}
                disabled={exercises.length === 1}
                className="text-gray-600 hover:text-red-400 transition disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Last session row */}
            {ex.lastSession && (
              <div className="mx-4 mb-4 bg-black/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Last Session
                </span>
                <span className="text-white text-sm tabular-nums">
                  <span className="font-bold">{ex.lastSession.weight}</span>
                  <span className="text-gray-500 text-[11px] ml-0.5">kg</span>
                  <span className="text-gray-500 mx-1.5">×</span>
                  <span className="font-bold">{ex.lastSession.reps}</span>
                  <span className="text-gray-500 mx-1.5">×</span>
                  <span className="font-bold">{ex.lastSession.sets}</span>
                </span>
              </div>
            )}

            {/* Steppers */}
            <div className="px-4 pb-4 flex gap-2">
              <Stepper
                label="Weight"
                value={ex.weight}
                unit="kg"
                onDec={() => adjust(ex.id, 'weight', -2.5)}
                onInc={() => adjust(ex.id, 'weight', 2.5)}
              />
              <Stepper
                label="Reps"
                value={ex.reps}
                onDec={() => adjust(ex.id, 'reps', -1)}
                onInc={() => adjust(ex.id, 'reps', 1)}
              />
              <Stepper
                label="Sets"
                value={ex.sets}
                onDec={() => adjust(ex.id, 'sets', -1)}
                onInc={() => adjust(ex.id, 'sets', 1)}
              />
            </div>
          </div>
        ))}

        {/* Add exercise */}
        <button
          onClick={addExercise}
          className="w-full border border-dashed border-white/10 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-gray-500 hover:text-[#a3e635] hover:border-[#a3e635]/30 transition-all"
        >
          <Plus size={16} />
          <span className="text-sm font-semibold">Add Exercise</span>
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0f1c]/95 backdrop-blur border-t border-white/[0.05] px-4 py-3 flex items-center justify-around">
        {[
          { icon: Home, label: 'Home', path: '/' },
          { icon: Dumbbell, label: 'Workouts', path: '/workouts', active: true },
          { icon: TrendingUp, label: 'Progress', path: '/progress' },
          { icon: User, label: 'Profile', path: '/profile' },
        ].map(({ icon: Icon, label, path, active }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 transition ${
              active ? 'text-[#a3e635]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
      </nav>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-[#0a0f1c]/90 backdrop-blur-md border-t border-white/[0.06]">
  <button
    onClick={handleSave}
    disabled={saving}
    className="w-full bg-[#a3e635] text-black font-bold text-base py-4 rounded-2xl hover:bg-[#bef264] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_-4px_rgba(163,230,53,0.5)]"
  >
    <Save size={20} strokeWidth={2.5} />
    {saving ? 'Saving…' : 'Save Workout'}
  </button>
</div>
    </div>
    
  )
}

export default WorkoutLogPage
