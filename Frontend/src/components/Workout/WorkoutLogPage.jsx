import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkout, getWorkoutById, getWorkoutLastSession } from '../../services/workout.js'
import {
  ChevronLeft, Save, Dumbbell, Minus, Plus, Trash2, X
} from 'lucide-react'

const SUGGESTIONS = [
  'Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Squat', 'Deadlift',
  'Pull Up', 'Shoulder Press', 'Bicep Curl', 'Tricep Dip', 'Leg Press',
  'Lat Pulldown', 'Romanian Deadlift', 'Cable Row', 'Face Pull', 'Hip Thrust'
]

const emptySet = () => ({ id: Date.now() + Math.random(), weight: 0, reps: 0 })

const emptyExercise = () => ({
  id: Date.now() + Math.random(),
  exerciseName: '',
  sets: [emptySet()],
  lastSession: null,
})

const WorkoutLogPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState([emptyExercise()])
  const [activeInput, setActiveInput] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id)
        setWorkoutName(data.workout.workoutName)
        if (data.workout.exercises?.length) {
          setExercises(
            data.workout.exercises.map((e) => ({
              id: e._id,
              exerciseName: e.exerciseName,
              sets: e.sets.map(s => ({ id: s._id, weight: s.weight, reps: s.reps })),
              lastSession: null,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to fetch workout:', err)
      }
    }
    if (id) fetchWorkout()
  }, [id])

  // fetch last session when exercise name is selected
  const fetchLastSession = async (exId, exerciseName) => {
    try {
      const data = await getWorkoutLastSession(exerciseName)
      setExercises(prev => prev.map(ex =>
        ex.id === exId ? { ...ex, lastSession: data } : ex
      ))
    } catch {
      // no last session — fine
    }
  }

  const handleNameChange = (exId, value) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, exerciseName: value } : ex))
    setSuggestions(value.length > 0
      ? SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
      : []
    )
    setActiveInput(exId)
  }

  const selectSuggestion = (exId, name) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, exerciseName: name } : ex))
    setSuggestions([])
    setActiveInput(null)
    fetchLastSession(exId, name)
  }

  // adjust weight or reps for a specific set
  const adjustSet = (exId, setId, field, delta) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exId ? {
        ...ex,
        sets: ex.sets.map(s =>
          s.id === setId
            ? { ...s, [field]: Math.max(0, +(s[field] + delta).toFixed(2)) }
            : s
        )
      } : ex
    ))
  }

  const addSet = (exId) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exId ? { ...ex, sets: [...ex.sets, emptySet()] } : ex
    ))
  }

  const removeSet = (exId, setId) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exId
        ? { ...ex, sets: ex.sets.length > 1 ? ex.sets.filter(s => s.id !== setId) : ex.sets }
        : ex
    ))
  }

  const addExercise = () => setExercises(prev => [...prev, emptyExercise()])

  const removeExercise = (exId) => {
    if (exercises.length === 1) return
    setExercises(prev => prev.filter(ex => ex.id !== exId))
  }

  const handleSave = async () => {
    const valid = exercises.every(ex => ex.exerciseName.trim() && ex.sets.length > 0)
    if (!valid) return alert('Please fill all exercise names')
    try {
      setSaving(true)
      await createWorkout({
        workoutName,
        exercises: exercises.map(({ exerciseName, sets }) => ({
          exerciseName,
          sets: sets.map(({ weight, reps }) => ({
            weight: Number(weight),
            reps: Number(reps),
          }))
        }))
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
      className="min-h-screen bg-[#0a0f1c] pb-32"
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

        <div className="text-center">
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
            {/* Exercise name row */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-[#a3e635]" />
              </div>
              <div className="flex-1 relative">
                <input
                  value={ex.exerciseName}
                  onChange={(e) => handleNameChange(ex.id, e.target.value)}
                  onFocus={() => ex.exerciseName.length > 0 && setActiveInput(ex.id)}
                  onBlur={() => setTimeout(() => setActiveInput(null), 150)}
                  placeholder="Exercise name"
                  className="w-full bg-transparent text-white text-base font-bold outline-none placeholder:text-gray-600"
                />
                {/* Autocomplete */}
                {activeInput === ex.id && suggestions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1a2335] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {suggestions.slice(0, 5).map(s => (
                      <button
                        key={s}
                        onMouseDown={() => selectSuggestion(ex.id, s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeExercise(ex.id)}
                disabled={exercises.length === 1}
                className="text-gray-600 hover:text-red-400 transition disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Last session */}
            {ex.lastSession?.exercise && (
              <div className="mx-4 mb-3 bg-black/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Last Session
                </span>
                <span className="text-gray-300 text-xs tabular-nums font-medium">
                  {ex.lastSession.exercise.sets.map((s, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-gray-600 mx-1">·</span>}
                      {s.weight}kg×{s.reps}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {/* Sets table header */}
            <div className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 px-4 mb-1">
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">Set</p>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">Weight</p>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">Reps</p>
              <div />
            </div>

            {/* Each set row */}
            <div className="px-4 flex flex-col gap-2 mb-3">
              {ex.sets.map((set, setIndex) => (
                <div key={set.id} className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 items-center">
                  {/* Set number */}
                  <div className="w-7 h-7 rounded-lg bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center">
                    <span className="text-[#a3e635] text-[11px] font-bold">{setIndex + 1}</span>
                  </div>

                  {/* Weight stepper */}
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl flex items-center justify-between px-2.5 py-2">
                    <button onClick={() => adjustSet(ex.id, set.id, 'weight', -2.5)}
                      className="text-gray-500 hover:text-[#a3e635] active:scale-90 transition">
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span className="text-white text-sm font-bold tabular-nums">
                      {set.weight}<span className="text-gray-600 text-[10px] ml-0.5">kg</span>
                    </span>
                    <button onClick={() => adjustSet(ex.id, set.id, 'weight', 2.5)}
                      className="text-gray-500 hover:text-[#a3e635] active:scale-90 transition">
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Reps stepper */}
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl flex items-center justify-between px-2.5 py-2">
                    <button onClick={() => adjustSet(ex.id, set.id, 'reps', -1)}
                      className="text-gray-500 hover:text-[#a3e635] active:scale-90 transition">
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span className="text-white text-sm font-bold tabular-nums">{set.reps}</span>
                    <button onClick={() => adjustSet(ex.id, set.id, 'reps', 1)}
                      className="text-gray-500 hover:text-[#a3e635] active:scale-90 transition">
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Remove set */}
                  <button
                    onClick={() => removeSet(ex.id, set.id)}
                    disabled={ex.sets.length === 1}
                    className="text-gray-700 hover:text-red-400 transition disabled:opacity-20 flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add set button */}
            <button
              onClick={() => addSet(ex.id)}
              className="w-full border-t border-white/[0.05] py-3 flex items-center justify-center gap-1.5 text-gray-600 hover:text-[#a3e635] hover:bg-[#a3e635]/5 transition-all"
            >
              <Plus size={14} />
              <span className="text-xs font-semibold">Add Set</span>
            </button>
          </div>
        ))}

        {/* Add exercise */}
        <button
          onClick={addExercise}
          className="w-full border border-dashed border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 text-gray-500 hover:text-[#a3e635] hover:border-[#a3e635]/30 transition-all"
        >
          <Plus size={16} />
          <span className="text-sm font-semibold">Add Exercise</span>
        </button>
      </div>

      {/* Fixed save button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-[#0a0f1c]/90 backdrop-blur-md border-t border-white/[0.06]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#a3e635] text-black font-bold text-base py-4 rounded-2xl hover:bg-[#bef264] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Save size={20} strokeWidth={2.5} />
          {saving ? 'Saving…' : 'Save Workout'}
        </button>
      </div>
    </div>
  )
}

export default WorkoutLogPage