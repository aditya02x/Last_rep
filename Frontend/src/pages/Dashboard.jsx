import React from 'react'
import Header from '../components/Dashboard/Header' 
import WeightCard from '../components/Dashboard/Weight' // adjust path if needed
 // adjust path if needed
import LastWorkoutCard from '../components/Dashboard/LastWorkoutCard' // adjust path if needed
import StarWorkout from '../components/Dashboard/StartWorkout' // adjust path if needed
import Footer from '../components/Dashboard/Footer' // adjust path if needed

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
      <Header />
      <WeightCard />
      <LastWorkoutCard />
      <StarWorkout/>
      <Footer/>


      {/* rest of your dashboard content goes here */}
    </div>
  )
}

export default Dashboard