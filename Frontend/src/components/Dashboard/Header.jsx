import React from 'react'

const Header = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-gray-400 text-sm">
          {today}
        </p>

        <h1 className="text-3xl font-bold text-white">
          Hi, Aditya 👋
        </h1>
      </div>

      <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center">
        <span className="text-[#a3e635] font-bold">
          A
        </span>
      </div>
    </div>
  )
}

export default Header
