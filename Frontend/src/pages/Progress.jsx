import React from 'react'
import Footer from '../components/Dashboard/Footer' // adjust path if needed
import WeightProgressChart from '../components/ProgressGraphs/WeightProgressChart.jsx/WeightProgressChart' // adjust path if needed
const Progress = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
        <WeightProgressChart />
     
        <Footer/>
    </div>
  )
}

export default Progress
