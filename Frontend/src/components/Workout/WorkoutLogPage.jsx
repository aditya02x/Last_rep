import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWorkout, getWorkoutById, getWorkoutLastSession } from '../../services/workout.js'
import { ChevronLeft, Plus, Minus, Save, Dumbbell } from 'lucide-react'

const SUGGESTIONS = [
  'Bench Press', 'Squat', 'Deadlift', 'Pull Up', 'Push Up',
  'Shoulder Press', 'Bicep Curl', 'Tricep Dip', 'Leg Press',
  'Lat Pulldown', 'Romanian Deadlift', 'Incline Bench Press',
  'Incline Dumbbell Press', 'Cable Row', 'Cable Fly', 'Face Pull',
  'Hip Thrust', 'Calf Raise', 'Plank', 'Dumbbell Row'
]

const emptyExercise = () => ({
  id: Date.now() + Math.random(),
  exerciseName: '',
  weight: 20,
  reps: 8,
  sets: 3,
  lastSession: null,
})

const StepperControl = ({ label, value, unit, onIncrease, onDecrease, step = 1 }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        className="w-9 h-9 rounded-full bg-[#0a0f1c] flex items-center justify-center text-white hover:bg-[#a3e635]/10 active:scale-95 transition-all border border-white/5"
      >
        <Minus size={14} />
      </button>
      <span className="text-white text-2xl font-bold tabular-nums w-14 text-center"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        {value}
        {unit && <span className="text-gray-500 text-sm font-medium ml-0.5">{unit}</span>}
      </span>
      <button
        onClick={onIncrease}
        className="w-9 h-9 rounded-full bg-[#0a0f1c] flex items-center justify-center text-white hover:bg-[#a3e635]/10 active:scale-95 transition-all border border-white/5"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
)

const WorkoutLogPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [activeInput, setActiveInput] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id);
        setWorkoutName(data.workout.workoutName);
      } catch (error) {
        console.error('Failed to fetch workout:', error);
      }
    };
    if (id) fetchWorkout();
  }, [id]);

  const fetchLastSession = async (exId, exerciseName) => {
    try {
      const data = await getWorkoutLastSession(exerciseName);
      setExercises(prev => prev.map(ex =>
        ex.id === exId ? { ...ex, lastSession: data } : ex
      ));
    } catch {
      // no last session found — that's fine
    }
  };

  const handleNameChange = (exId, value) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, exerciseName: value } : ex));
    setSuggestions(value.length > 0
      ? SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
      : []
    );
    setActiveInput(exId);
  };

  const selectSuggestion = (exId, name) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, exerciseName: name } : ex));
    setSuggestions([]);
    setActiveInput(null);
    fetchLastSession(exId, name);
  };

  const adjust = (exId, field, delta, min = 0) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exId
        ? { ...ex, [field]: Math.max(min, parseFloat((ex[field] + delta).toFixed(1))) }
        : ex
    ));
  };

  const addExercise = () => setExercises(prev => [...prev, emptyExercise()]);

  const handleSave = async () => {
    const valid = exercises.every(ex => ex.exerciseName.trim());
    if (!valid) return alert('Please enter a name for all exercises');
    try {
      setSaving(true);
      await createWorkout({
        workoutName,
        exercises: exercises.map(({ exerciseName, sets, reps, weight }) => ({
          exerciseName,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight),
        }))
      });
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0f1c] pb-32"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/workouts')}
          className="w-9 h-9 rounded-full bg-[#1c2333] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em]">
            {workoutName}
          </p>
          <h1 className="text-white text-lg font-bold">New Workout</h1>
        </div>

        {/* Save button — green circle top right like screenshot */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-11 h-11 rounded-full bg-[#a3e635] flex items-center justify-center hover:bg-[#bef264] active:scale-95 transition-all disabled:opacity-40 shadow-[0_4px_20px_-4px_rgba(163,230,53,0.6)]"
        >
          <Save size={18} className="text-black" strokeWidth={2.5} />
        </button>
      </div>

      {/* Exercise cards */}
      <div className="px-4 flex flex-col gap-4">
        {exercises.map((ex, index) => (
          <div
            key={ex.id}
            className="bg-[#1c2333] rounded-2xl overflow-hidden border border-white/[0.05]"
          >
            {/* Exercise name row */}
            <div className="flex items-center gap-3 p-4 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-[#a3e635]" />
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={ex.exerciseName}
                  onChange={(e) => handleNameChange(ex.id, e.target.value)}
                  onFocus={() => ex.exerciseName.length > 0 && setActiveInput(ex.id)}
                  onBlur={() => setTimeout(() => setActiveInput(null), 150)}
                  placeholder="Exercise name"
                  className="w-full bg-transparent text-white text-lg font-bold outline-none placeholder:text-gray-600"
                />
                {/* Suggestions */}
                {activeInput === ex.id && suggestions.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#111827] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
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
            </div>

            {/* Last session bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-t border-b border-white/[0.04]">
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                Last Session
              </p>
              <p className="text-gray-400 text-xs font-semibold tabular-nums"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {ex.lastSession
                  ? `${ex.lastSession.exercise?.weight}kg × ${ex.lastSession.exercise?.reps} × ${ex.lastSession.exercise?.sets}`
                  : '—'
                }
              </p>
            </div>

            {/* Steppers */}
            <div className="grid grid-cols-3 divide-x divide-white/[0.05] px-2 py-4">
              <StepperControl
                label="Weight"
                value={ex.weight}
                unit="kg"
                onDecrease={() => adjust(ex.id, 'weight', -2.5, 0)}
                onIncrease={() => adjust(ex.id, 'weight', 2.5)}
              />
              <StepperControl
                label="Reps"
                value={ex.reps}
                onDecrease={() => adjust(ex.id, 'reps', -1, 1)}
                onIncrease={() => adjust(ex.id, 'reps', 1)}
              />
              <StepperControl
                label="Sets"
                value={ex.sets}
                onDecrease={() => adjust(ex.id, 'sets', -1, 1)}
                onIncrease={() => adjust(ex.id, 'sets', 1)}
              />
            </div>
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
    </div>
  )
}

export default WorkoutLogPage