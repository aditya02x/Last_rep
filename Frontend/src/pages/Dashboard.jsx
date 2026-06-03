import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data.dashboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Weight */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
          <h2 className="text-gray-400 text-sm">Current Weight</h2>
          <p className="text-4xl font-bold text-[#a3e635] mt-2">
            {dashboard.currentWeight || "--"} kg
          </p>
        </div>

        {/* Goal Weight */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
          <h2 className="text-gray-400 text-sm">Goal Weight</h2>
          <p className="text-4xl font-bold text-white mt-2">
            {dashboard.goalWeight || "--"} kg
          </p>
        </div>

        {/* Total Workouts */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
          <h2 className="text-gray-400 text-sm">Total Workouts</h2>
          <p className="text-4xl font-bold text-white mt-2">
            {dashboard.totalWorkouts || 0}
          </p>
        </div>

        {/* Recent Workout */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
          <h2 className="text-gray-400 text-sm">Recent Workout</h2>
          <p className="text-2xl font-semibold text-white mt-2">
            {dashboard.recentWorkout || "No workouts yet"}
          </p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-8">
        <button className="bg-[#a3e635] text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;