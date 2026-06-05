import React from 'react'
import UpdateProfile from '../components/Profile/UpdateProfile'
import Footer from '../components/Dashboard/Footer' // adjust path if needed

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#000000] p-6">
      <UpdateProfile />
      <Footer/>
      
    </div>
  )
}

export default ProfilePage
