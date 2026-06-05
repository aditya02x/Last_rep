import React from 'react'
import { Home, Dumbbell, TrendingUp, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { label: 'Progress', icon: TrendingUp, path: '/progress' },
    { label: 'Profile', icon: User, path: '/profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1c] border-t border-white/[0.06] px-6 py-3 flex items-center justify-between z-50">
      {tabs.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95"
          >
            {/* Icon container — filled circle for active */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              isActive
                ? 'bg-[#a3e635]'
                : 'bg-transparent'
            }`}>
              <Icon
                size={20}
                className={isActive ? 'text-black' : 'text-gray-500'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </div>
            <span className={`text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#a3e635]' : 'text-gray-600'
            }`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default Footer