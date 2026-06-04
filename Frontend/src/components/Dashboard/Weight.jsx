import React, { useEffect, useState } from 'react'
import { getWeightHistory, addWeight } from '../../services/Weightservices.js'
import { getProfile } from '../../services/authservices.js'
import { Scale, Target, TrendingDown, TrendingUp } from 'lucide-react'

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
      if (w.length > 0) setStartWeight(w[0].weight);
    } catch (error) {
      console.error('Failed to fetch weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddWeight = async () => {
    if (!newWeight) return;
    try {
      setLogging(true);
      await addWeight({ weight: parseFloat(newWeight) });
      setNewWeight('');
      await fetchData();
    } catch (error) {
      console.error('Failed to log weight:', error);
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1c2333] rounded-2xl p-5 mb-4 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-3" />
        <div className="h-10 w-40 bg-white/10 rounded mb-4" />
        <div className="h-2 w-full bg-white/10 rounded-full mb-3" />
        <div className="h-4 w-full bg-white/10 rounded" />
      </div>
    );
  }

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const kgSinceStart = startWeight && currentWeight
    ? (currentWeight - startWeight).toFixed(1) : null;
  const kgToGoal = goalWeight && currentWeight
    ? Math.abs(currentWeight - goalWeight).toFixed(1) : null;
  const weightIncreased = kgSinceStart !== null && parseFloat(kgSinceStart) > 0;

  const progress = startWeight && goalWeight && currentWeight && startWeight !== goalWeight
    ? Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100))
    : 0;

  return (
    <div className="bg-[#1c2333] rounded-2xl p-5 mb-4">

      {/* Top labels with icons */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          <Scale size={13} className="text-[#a3e635]" />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            Current Weight
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Target size={13} className="text-gray-400" />
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            Goal
          </p>
        </div>
      </div>

      {/* Big numbers */}
      <div className="flex justify-between items-end mb-4">
        <p className="text-white text-5xl font-bold leading-none">
          {currentWeight ?? '--'}
          <span className="text-gray-400 text-lg font-medium ml-1">kg</span>
        </p>
        <p className="text-white text-3xl font-bold leading-none">
          {goalWeight ?? '--'}
          <span className="text-gray-400 text-base font-medium ml-1">kg</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700/50 rounded-full h-2 mb-3">
        <div
          className="bg-[#a3e635] h-2 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          {weightIncreased
            ? <TrendingUp size={14} className="text-red-400" />
            : <TrendingDown size={14} className="text-[#a3e635]" />
          }
          <p className={`text-sm font-semibold ${weightIncreased ? 'text-red-400' : 'text-[#a3e635]'}`}>
            {kgSinceStart !== null
              ? `${parseFloat(kgSinceStart) > 0 ? '+' : ''}${kgSinceStart} kg`
              : '--'}
            <span className="text-gray-500 font-normal ml-1">since start</span>
          </p>
        </div>
        <p className="text-gray-400 text-sm">
          {kgToGoal !== null ? `${kgToGoal} kg to goal` : '--'}
        </p>
      </div>

      {/* Log weight input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Log today's weight (kg)"
          className="flex-1 bg-black/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-white/5 placeholder:text-gray-600 focus:border-[#a3e635]/40 transition-all"
        />
        <button
          onClick={handleAddWeight}
          disabled={logging || !newWeight}
          className="bg-[#a3e635] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#bef264] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {logging ? '…' : 'Log'}
        </button>
      </div>

    </div>
  )
}

export default WeightCard