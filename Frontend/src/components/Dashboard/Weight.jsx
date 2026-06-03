import React, { useEffect, useState } from 'react'
import { getWeightHistory, addWeight } from '../api/api.js'
import { getProfile } from '../api/api.js'

const WeightCard = () => {
  const [weights, setWeights] = useState([]);
  const [goalWeight, setGoalWeight] = useState(null);
  const [startWeight, setStartWeight] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  const fetchData = async () => {
    try {
      const [profileData, weightData] = await Promise.all([
        getProfile(),
        getWeightHistory()
      ]);

      setGoalWeight(profileData.goalWeight);

      const w = weightData.weights || [];
      setWeights(w);

      if (w.length > 0) {
        setStartWeight(w[0].weight); // first logged weight = start
      }
    } catch (error) {
      console.error('Failed to fetch weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWeight = async () => {
    if (!newWeight) return;
    try {
      setLogging(true);
      await addWeight({ weight: parseFloat(newWeight) });
      setNewWeight('');
      await fetchData(); // refresh card
    } catch (error) {
      console.error('Failed to log weight:', error);
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-sm">Loading weight data...</p>
      </div>
    );
  }

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const kgSinceStart = startWeight && currentWeight ? (currentWeight - startWeight).toFixed(1) : null;
  const kgToGoal = goalWeight && currentWeight ? Math.abs(currentWeight - goalWeight).toFixed(1) : null;

  // progress from start toward goal
  const progress = startWeight && goalWeight && currentWeight && startWeight !== goalWeight
    ? Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100))
    : 0;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">

      {/* Top labels */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Current Weight</p>
        <p className="text-gray-400 text-xs uppercase tracking-widest">Goal</p>
      </div>

      {/* Weight numbers */}
      <div className="flex justify-between items-end mb-4">
        <div>
          {currentWeight ? (
            <p className="text-white text-4xl font-bold">
              {currentWeight}
              <span className="text-gray-400 text-lg ml-1">kg</span>
            </p>
          ) : (
            <p className="text-gray-500 text-sm">No weight logged yet</p>
          )}
        </div>
        <div>
          <p className="text-white text-3xl font-bold">
            {goalWeight ?? '--'}
            <span className="text-gray-400 text-lg ml-1">kg</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div
          className="bg-[#a3e635] h-2 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom stats */}
      <div className="flex justify-between text-sm mb-4">
        <span>
          <span className={`font-semibold ${kgSinceStart < 0 ? 'text-[#a3e635]' : 'text-red-400'}`}>
            {kgSinceStart !== null ? `${kgSinceStart > 0 ? '+' : ''}${kgSinceStart} kg` : '--'}
          </span>
          <span className="text-gray-500 ml-1">since start</span>
        </span>
        <span className="text-gray-400">
          {kgToGoal !== null ? `${kgToGoal} kg to goal` : '--'}
        </span>
      </div>

      {/* Log new weight input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Log today's weight (kg)"
          className="flex-1 bg-gray-800 text-white text-sm rounded-xl px-3 py-2 outline-none border border-gray-700 focus:border-[#a3e635] transition"
        />
        <button
          onClick={handleAddWeight}
          disabled={logging || !newWeight}
          className="bg-[#a3e635] text-black font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#bef264] transition disabled:opacity-50"
        >
          {logging ? '...' : 'Log'}
        </button>
      </div>

    </div>
  )
}

export default WeightCard