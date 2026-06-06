import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../../services/authservices.js'

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const name = user?.name || 'User';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-gray-400 text-sm">{today}</p>
        <h1 className="text-3xl font-bold text-white">
          Hi, {name} 👋
        </h1>
      </div>

      <div
        onClick={() => navigate('/profile')}
        className="w-12 h-12 rounded-full bg-[#a3e635]/20 flex items-center justify-center cursor-pointer hover:bg-[#a3e635]/30 transition"
      >
        <span className="text-[#a3e635] font-bold">{initial}</span>
      </div>
    </div>
  )
}

export default Header