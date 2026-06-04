import React, { useEffect, useState } from 'react'
import { getProfile } from '../../services/authservices.js'

const goalConfig = {
  muscle_gain: {
    label: 'Muscle Gain',
    icon: '💪',
    color: '#a3e635',
    description: 'Build lean muscle mass',
  },
  weight_loss: {
    label: 'Weight Loss',
    icon: '🔥',
    color: '#f97316',
    description: 'Burn fat & lose weight',
  },
  maintain: {
    label: 'Maintain Weight',
    icon: '⚖️',
    color: '#22d3ee',
    description: 'Stay at current weight',
  },
}

const activityConfig = {
  beginner: { label: 'Beginner', level: 1, max: 4 },
  intermediate: { label: 'Intermediate', level: 2, max: 4 },
  advanced: { label: 'Advanced', level: 3, max: 4 },
  athlete: { label: 'Athlete', level: 4, max: 4 },
}

const GoalProgressCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/5 bg-gradient-to-br from-[#161e2e]/80 via-[#111827]/80 to-[#0b1120]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" />
          <p className="text-gray-400 text-sm tracking-wide">Loading goal data…</p>
        </div>
      </div>
    );
  }

  const goal = goalConfig[profile?.goal] || { label: profile?.goal, icon: '🎯', color: '#a3e635', description: '' };
  const activity = activityConfig[profile?.activityLevel] || { label: profile?.activityLevel, level: 1, max: 4 };

  const weightDiff = profile?.goalWeight && profile?.currentWeight
    ? (profile.goalWeight - profile.currentWeight).toFixed(1)
    : null;

  const bmi = profile?.height && profile?.currentWeight
    ? (profile.currentWeight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : null;

  const bmiLabel = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    : null;

  const bmiColor = bmi
    ? bmi < 18.5 ? '#22d3ee' : bmi < 25 ? '#a3e635' : bmi < 30 ? '#f97316' : '#ef4444'
    : '#a3e635';

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 mb-4 border border-white/[0.06] bg-gradient-to-br from-[#1a2335]/90 via-[#111827]/90 to-[#0a0f1c]/90 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-[#a3e635]/20"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: `${goal.color}15` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Goal badge */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg"
            style={{ backgroundColor: `${goal.color}20`, border: `1px solid ${goal.color}30` }}
          >
            {goal.icon}
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5">
              Current Goal
            </p>
            <p className="text-white text-base font-bold">{goal.label}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border"
          style={{ color: goal.color, backgroundColor: `${goal.color}15`, borderColor: `${goal.color}30` }}
        >
          Active
        </span>
      </div>

      {/* Weight to goal */}
      {weightDiff !== null && (
        <div
          className="relative flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 border"
          style={{ backgroundColor: `${goal.color}08`, borderColor: `${goal.color}20` }}
        >
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Weight to goal</p>
            <p
              className="text-lg font-bold tabular-nums"
              style={{ color: goal.color, fontFamily: '"JetBrains Mono", monospace' }}
            >
              {Math.abs(weightDiff)} kg {parseFloat(weightDiff) > 0 ? 'to gain' : 'to lose'}
            </p>
          </div>
        </div>
      )}

      {/* Stats row — BMI + Height */}
      <div className="relative grid grid-cols-2 gap-3 mb-4">
        {/* BMI */}
        <div className="rounded-2xl px-4 py-3 border border-white/[0.05] bg-white/[0.03]">
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">BMI</p>
          <p
            className="text-2xl font-bold tabular-nums"
            style={{ color: bmiColor, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {bmi ?? '--'}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{bmiLabel ?? ''}</p>
        </div>

        {/* Height */}
        <div className="rounded-2xl px-4 py-3 border border-white/[0.05] bg-white/[0.03]">
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">Height</p>
          <p
            className="text-2xl font-bold tabular-nums text-white"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {profile?.height ?? '--'}
            <span className="text-gray-500 text-sm font-medium ml-1">cm</span>
          </p>
          <p className="text-gray-500 text-xs mt-0.5">Age {profile?.age ?? '--'}</p>
        </div>
      </div>

      {/* Activity level */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em]">Activity Level</p>
          <span className="text-[#a3e635] text-xs font-semibold">{activity.label}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: activity.max }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i < activity.level ? '#a3e635' : 'rgba(255,255,255,0.06)',
                boxShadow: i < activity.level ? '0 0 8px rgba(163,230,53,0.4)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GoalProgressCard