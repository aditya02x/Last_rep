import React from 'react'

const GoalProgress = () => {
  return (
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10">
      <p className="text-[#a3e635] text-sm font-semibold">
        GOAL PROGRESS
      </p>

      <h2 className="text-3xl font-bold text-white mt-2">
        {progressPercentage}%
      </h2>

      <p className="text-gray-400 mt-1">
        {remainingWeight} kg remaining
      </p>

      <div className="w-full h-3 bg-[#0f172a] rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-[#a3e635] rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default GoalProgress
