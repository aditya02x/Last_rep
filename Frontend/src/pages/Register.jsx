import React, { useState } from "react";
import {registerUser} from '../services/authservices';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [name,setName ]= useState("")
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const data = await registerUser({
        name,
        email,
        password
      })
      toast.success("Registration success
  }


  return (


     <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Sign in to continue your fitness journey
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="name"
            placeholder="Name"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 text-white outline-none focus:border-[#a3e635]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 text-white outline-none focus:border-[#a3e635]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 text-white outline-none focus:border-[#a3e635]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#a3e635] text-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?
          <a href="/register" className="text-[#a3e635] hover:underline ml-1">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
