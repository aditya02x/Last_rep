import React from 'react'
import Header from '../components/Dashboard/Header' 
import WeightCard from '../components/Dashboard/Weight' // adjust path if needed
 // adjust path if needed
import LastWorkout from '../components/Dashboard/LastWorkout' // adjust path if needed

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
      <Header />
      <WeightCard />
      <LastWorkout />


      {/* rest of your dashboard content goes here */}
    </div>
  )
}

export default Dashboard