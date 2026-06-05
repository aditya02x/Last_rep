import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkout, getWorkoutById, getWorkoutLastSession, updateWorkout } from '../../services/workout.js'
import { ChevronLeft, Save, Dumbbell, Minus, Plus, Trash2, X, Activity, TrendingUp } from 'lucide-react'

const SUGGESTIONS = [
  'Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Squat', 'Deadlift',
  'Pull Up', 'Shoulder Press', 'Bicep Curl', 'Tricep Dip', 'Leg Press',
  'Lat Pulldown', 'Romanian Deadlift', 'Cable Row', 'Face Pull', 'Hip Thrust',
  'Calf Raise', 'Plank', 'Dumbbell Row', 'Chest Dip', 'Lateral Raise'
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
          data.workout.exercises.forEach((e) => fetchLastSession(e._id, e.exerciseName))
        }
      } catch (err) {
        console.error('Failed to fetch workout:', err)
      }
    }
    if (id) fetchWorkout()
  }, [id])

  const fetchLastSession = async (exId, exerciseName) => {
    try {
      const data = await getWorkoutLastSession(exerciseName)
      setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, lastSession: data } : ex))
    } catch {}
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

  const adjustSet = (exId, setId, field, delta) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exId ? {
        ...ex,
        sets: ex.sets.map(s =>
          s.id === setId ? { ...s, [field]: Math.max(0, +(s[field] + delta).toFixed(2)) } : s
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

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalVolume = exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0), 0
  )

  const handleSave = async () => {
    const valid = exercises.every(ex => ex.exerciseName.trim() && ex.sets.length > 0)
    if (!valid) return alert('Please fill all exercise names')
    try {
      setSaving(true)
      const payload = {
        exercises: exercises.map(({ exerciseName, sets }) => ({
          exerciseName,
          sets: sets.map(({ weight, reps }) => ({ weight: Number(weight), reps: Number(reps) }))
        }))
      }
      if (id) await updateWorkout(id, payload)
      else await createWorkout({ workoutName, ...payload })
      navigate('/workouts')
    } catch (err) {
      console.error('Failed to save workout:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#0a0f1c] pb-36 relative overflow-hidden"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[420px] h-[420px] rounded-full bg-[#a3e635]/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-40 -right-32 w-[380px] h-[380px] rounded-full bg-[#a3e635]/5 blur-[120px]" />

      {/* Header */}
      <div className="relative sticky top-0 z-30 backdrop-blur-xl bg-[#0a0f1c]/70 border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <button
            onClick={() => navigate('/workouts')}
            className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] active:scale-95 transition"
          >
            <ChevronLeft size={20} className="text-gray-300" />
          </button>
          <div className="text-center">
            <p className="text-[#a3e635]/80 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
              {workoutName || 'Session'}
            </p>
            <h1 className="text-white text-lg font-bold leading-tight tracking-tight">
              {id ? 'Edit Workout' : 'New Workout'}
            </h1>
          </div>
          <div className="w-10 h-10" />
        </div>

        {/* Stats strip */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2">
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Exercises</p>
            <p className="text-white text-base font-bold tabular-nums leading-tight">{exercises.length}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-2">
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Sets</p>
            <p className="text-white text-base font-bold tabular-nums leading-tight">{totalSets}</p>
          </div>
          <div className="bg-[#a3e635]/[0.07] border border-[#a3e635]/20 rounded-xl px-3 py-2">
            <p className="text-[#a3e635]/70 text-[9px] font-bold uppercase tracking-wider">Volume</p>
            <p className="text-[#a3e635] text-base font-bold tabular-nums leading-tight">
              {totalVolume.toLocaleString()}<span className="text-[10px] ml-0.5 opacity-70">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="relative px-4 pt-5 flex flex-col gap-4">
        {exercises.map((ex, exIndex) => (
          <div
            key={ex.id}
            className="bg-gradient-to-b from-[#131c30] to-[#0f1626] rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl shadow-black/40"
          >
            {/* Exercise header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/[0.04]">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#a3e635]/20 to-[#a3e635]/5 border border-[#a3e635]/25 flex items-center justify-center">
                  <Dumbbell size={18} className="text-[#a3e635]" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-md bg-[#0a0f1c] border border-white/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-gray-400 tabular-nums">{exIndex + 1}</span>
                </div>
              </div>
              <div className="flex-1 relative min-w-0">
                <input
                  value={ex.exerciseName}
                  onChange={(e) => handleNameChange(ex.id, e.target.value)}
                  onFocus={() => ex.exerciseName.length > 0 && setActiveInput(ex.id)}
                  onBlur={() => setTimeout(() => setActiveInput(null), 150)}
                  placeholder="Exercise name"
                  className="w-full bg-transparent text-white text-base font-bold outline-none placeholder:text-gray-600 tracking-tight"
                />
                {activeInput === ex.id && suggestions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-[#161f33] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    {suggestions.slice(0, 5).map(s => (
                      <button
                        key={s}
                        onMouseDown={() => selectSuggestion(ex.id, s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-colors border-b border-white/[0.04] last:border-b-0"
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
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Last session */}
            <div className="mx-4 mt-3 bg-black/40 border border-white/[0.04] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <TrendingUp size={11} className="text-gray-500" />
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em]">Last</span>
              </div>
              <span className="text-gray-300 text-xs tabular-nums font-medium truncate text-right">
                {ex.lastSession?.exercise?.sets?.length > 0
                  ? ex.lastSession.exercise.sets.map((s, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-gray-700 mx-1.5">·</span>}
                        <span className="text-white">{s.weight}</span>
                        <span className="text-gray-600">kg×</span>
                        <span className="text-white">{s.reps}</span>
                      </span>
                    ))
                  : <span className="text-gray-600">No previous data</span>
                }
              </span>
            </div>

            {/* Sets table header */}
            <div className="grid grid-cols-[36px_1fr_1fr_32px] gap-2 px-4 mt-4 mb-2">
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest text-center">#</p>
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest text-center">Weight</p>
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest text-center">Reps</p>
              <div />
            </div>

            {/* Set rows */}
            <div className="px-4 flex flex-col gap-2 mb-3">
              {ex.sets.map((set, setIndex) => (
                <div key={set.id} className="grid grid-cols-[36px_1fr_1fr_32px] gap-2 items-center group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#a3e635]/15 to-[#a3e635]/5 border border-[#a3e635]/20 flex items-center justify-center">
                    <span className="text-[#a3e635] text-xs font-bold tabular-nums">{setIndex + 1}</span>
                  </div>

                  {/* Weight stepper */}
                  <div className="bg-black/50 border border-white/[0.06] rounded-xl flex items-center justify-between pl-1 pr-1 py-1 hover:border-white/[0.12] transition">
                    <button
                      onClick={() => adjustSet(ex.id, set.id, 'weight', -2.5)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#a3e635] hover:bg-[#a3e635]/10 active:scale-90 transition"
                    >
                      <Minus size={13} strokeWidth={2.8} />
                    </button>
                    <span className="text-white text-sm font-bold tabular-nums">
                      {set.weight}
                      <span className="text-gray-600 text-[10px] ml-0.5 font-medium">kg</span>
                    </span>
                    <button
                      onClick={() => adjustSet(ex.id, set.id, 'weight', 2.5)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#a3e635] hover:bg-[#a3e635]/10 active:scale-90 transition"
                    >
                      <Plus size={13} strokeWidth={2.8} />
                    </button>
                  </div>

                  {/* Reps stepper */}
                  <div className="bg-black/50 border border-white/[0.06] rounded-xl flex items-center justify-between pl-1 pr-1 py-1 hover:border-white/[0.12] transition">
                    <button
                      onClick={() => adjustSet(ex.id, set.id, 'reps', -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#a3e635] hover:bg-[#a3e635]/10 active:scale-90 transition"
                    >
                      <Minus size={13} strokeWidth={2.8} />
                    </button>
                    <span className="text-white text-sm font-bold tabular-nums">{set.reps}</span>
                    <button
                      onClick={() => adjustSet(ex.id, set.id, 'reps', 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#a3e635] hover:bg-[#a3e635]/10 active:scale-90 transition"
                    >
                      <Plus size={13} strokeWidth={2.8} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeSet(ex.id, set.id)}
                    disabled={ex.sets.length === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(ex.id)}
              className="w-full border-t border-white/[0.05] py-3 flex items-center justify-center gap-1.5 text-gray-500 hover:text-[#a3e635] hover:bg-[#a3e635]/[0.04] transition-all"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-wider">Add Set</span>
            </button>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="w-full border-2 border-dashed border-white/10 rounded-2xl py-5 flex items-center justify-center gap-2 text-gray-500 hover:text-[#a3e635] hover:border-[#a3e635]/40 hover:bg-[#a3e635]/[0.03] transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-[#a3e635]/15 flex items-center justify-center transition">
            <Plus size={15} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Add Exercise</span>
        </button>
      </div>

      {/* Fixed bottom save */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-5 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/95 to-transparent">
        <button
          onClick={handleSave}
          disabled={saving}
          className="relative w-full bg-[#a3e635] text-black font-bold text-base py-4 rounded-2xl hover:bg-[#bef264] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_32px_-4px_rgba(163,230,53,0.45)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
          {saving ? (
            <>
              <Activity size={18} strokeWidth={2.5} className="animate-pulse" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Save size={18} strokeWidth={2.8} />
              <span className="tracking-wide">Save Workout</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default WorkoutLogPage
