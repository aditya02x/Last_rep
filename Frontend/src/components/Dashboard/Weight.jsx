

import React, { useEffect, useState } from 'react'
import { getWeightHistory, addWeight } from '../../services/Weightservices.js'
import { getProfile } from '../../services/authservices.js'

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
        setStartWeight(w[0].weight);
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
      await fetchData();
    } catch (error) {
      console.error('Failed to log weight:', error);
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/5 bg-gradient-to-br from-[#161e2e]/80 via-[#111827]/80 to-[#0b1120]/80 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
        style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" />
          <p className="text-gray-400 text-sm tracking-wide">Loading weight data…</p>
        </div>
      </div>
    );
  }

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const kgSinceStart = startWeight && currentWeight ? (currentWeight - startWeight).toFixed(1) : null;
  const kgToGoal = goalWeight && currentWeight ? Math.abs(currentWeight - goalWeight).toFixed(1) : null;

  const progress = startWeight && goalWeight && currentWeight && startWeight !== goalWeight
    ? Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100))
    : 0;

  const losing = kgSinceStart !== null && parseFloat(kgSinceStart) < 0;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/[0.06] bg-gradient-to-br from-[#1a2335]/90 via-[#111827]/90 to-[#0a0f1c]/90 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-[#a3e635]/20"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[#a3e635]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />
      {/* Top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header labels */}
      <div className="relative flex justify-between items-center mb-3">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
          Current Weight
        </p>
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
          Goal
        </p>
      </div>

      {/* Weight numbers */}
      <div className="relative flex justify-between items-end mb-5">
        <div>
          {currentWeight ? (
            <p
              className="text-white text-5xl font-bold leading-none tracking-tight tabular-nums"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              {currentWeight}
              <span className="text-gray-500 text-base font-medium ml-1.5 tracking-normal">kg</span>
            </p>
          ) : (
            <p className="text-gray-500 text-sm italic">No weight logged yet</p>
          )}
        </div>
        <div>
          <p
            className="text-gray-300 text-3xl font-semibold leading-none tracking-tight tabular-nums"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {goalWeight ?? '--'}
            <span className="text-gray-500 text-sm font-medium ml-1 tracking-normal">kg</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2 mb-4 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.03]">
        <div
          className="relative h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-[#bef264] shadow-[0_0_12px_rgba(163,230,53,0.5)]"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="relative flex justify-between items-center text-sm mb-5">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums ${
              losing
                ? 'text-[#a3e635] bg-[#a3e635]/10 border border-[#a3e635]/20'
                : 'text-red-300 bg-red-500/10 border border-red-500/20'
            }`}
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {losing ? '↓' : '↑'} {kgSinceStart !== null ? `${Math.abs(parseFloat(kgSinceStart))} kg` : '--'}
          </span>
          <span className="text-gray-500 text-xs">since start</span>
        </div>
        <span
          className="text-gray-400 text-xs tabular-nums"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {kgToGoal !== null ? `${kgToGoal} kg to goal` : '--'}
        </span>
      </div>

      {/* Input row */}
      <div className="relative flex gap-2">
        <div className="flex-1 relative group">
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Log today's weight"
            className="w-full bg-black/30 text-white text-sm rounded-xl pl-3 pr-10 py-2.5 outline-none border border-white/5 placeholder:text-gray-600 focus:border-[#a3e635]/40 focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(163,230,53,0.08)] transition-all duration-300 tabular-nums"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-medium pointer-events-none">
            kg
          </span>
        </div>
        <button
          onClick={handleAddWeight}
          disabled={logging || !newWeight}
          className="relative overflow-hidden bg-gradient-to-b from-[#bef264] to-[#a3e635] text-black font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(163,230,53,0.5)] hover:shadow-[0_6px_24px_-4px_rgba(163,230,53,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
        >
          <span className="relative z-10 tracking-wide">{logging ? '…' : 'Log'}</span>
          <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  )
}

export default WeightCard