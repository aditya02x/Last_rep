import React from 'react'
import WorkoutsPage from '../components/Workout/WorkoutsPage'
import WorkoutLogPage from '../components/Workout/WorkoutLogPage'

const Workout = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
      <WorkoutLogPage />
      <WorkoutsPage />
    </div>
  )
}

export default Workout
