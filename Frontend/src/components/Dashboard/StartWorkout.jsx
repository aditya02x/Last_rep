import React from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const StartWorkout = () => {
    const navigate = useNavigate();
  return (
    <div>
      <button
  onClick={() => navigate('/workouts')}
  className="w-full bg-[#a3e635] text-black font-bold text-base py-4 rounded-2xl hover:bg-[#bef264] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
>
  <Plus size={20} />
  Start a Workout 
</button>
    </div>
  )
}

export default StartWorkout
