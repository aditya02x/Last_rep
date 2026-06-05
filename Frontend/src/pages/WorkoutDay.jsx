import React from 'react'
import WorkoutsPage from '../components/Workout/WorkoutsPage'
import Footer from '../components/Dashboard/Footer' // adjust path if needed


const WorkoutDay = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
      <WorkoutsPage />
      <Footer/>

    </div>
  )
}

export default WorkoutDay
