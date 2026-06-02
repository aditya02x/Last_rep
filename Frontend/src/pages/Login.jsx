import React, { useState } from "react";
import { loginUser } from "../services/authservices";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ← don't forget the styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Fix 1: initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      console.log("SUCCESS:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("ERROR:", error.response ? error.response.data : error.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Fix 2 */}
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Sign in to continue your fitness journey
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Login
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
  );
};

export default Login;