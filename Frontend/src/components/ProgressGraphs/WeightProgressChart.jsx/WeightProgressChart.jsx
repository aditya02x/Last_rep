import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { getWeightHistory } from '../../../services/Weightservices.js';
import { TrendingDown, TrendingUp, Scale } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 backdrop-blur-md rounded-xl px-3 py-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        <p className="text-slate-400 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-[#a3e635] font-bold text-sm tracking-tight">
          {payload[0].value} <span className="text-xs font-normal text-slate-400">kg</span>
        </p>
      </div>
    );
  }
  return null;
};

const WeightProgressChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getWeightHistory();
        const formatted = (res.weights || []).map(w => ({
          weight: w.weight,
          date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rawDate: new Date(w.date),
        }));
        setData(formatted);
      } catch (err) {
        console.error('Failed to fetch weight history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filterData = () => {
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return data.filter(d => d.rawDate >= weekAgo);
    }
    if (filter === 'month') {
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      return data.filter(d => d.rawDate >= monthAgo);
    }
    return data;
  };

  const filtered = filterData();
  const first = filtered[0]?.weight;
  const last = filtered[filtered.length - 1]?.weight;
  const diff = first && last ? (last - first).toFixed(1) : null;
  const trending = diff !== null && parseFloat(diff) < 0;

  if (loading) {
    return (
      <div className="bg-[#0f172a] rounded-3xl p-6 border border-slate-800/60 animate-pulse shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-800 rounded-lg" />
            <div className="h-4 w-20 bg-slate-800/60 rounded-md" />
          </div>
          <div className="h-7 w-40 bg-slate-800 rounded-lg" />
        </div>
        <div className="h-56 bg-slate-800/30 rounded-2xl border border-slate-800/20" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-800/60 text-center shadow-xl flex flex-col items-center justify-center min-h-[320px]">
        <div className="p-4 bg-slate-800/40 rounded-2xl text-slate-400 mb-4 border border-slate-700/30">
          <Scale size={28} className="opacity-80" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-1 tracking-tight">No weight data yet</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          Start logging your daily weight measurements to visually track your fitness journey trends.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-b from-[#0f172a] to-[#0b0f19] rounded-3xl p-6 border border-slate-800/60 shadow-xl"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg tracking-tight leading-tight">Weight Progress</h3>
          {diff !== null && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-semibold ${
                trending ? 'bg-[#a3e635]/10 text-[#a3e635]' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {trending ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                <span>{diff > 0 ? '+' : ''}{diff} kg</span>
              </div>
              <span className="text-slate-500 text-xs font-medium">this period</span>
            </div>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800/50">
          {['week', 'month', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all capitalize duration-200 ${
                filter === f
                  ? 'bg-[#a3e635] text-black shadow-md shadow-[#a3e635]/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 w-full -ml-4 pr-2">
        <ResponsiveContainer width="100%" height="100%">
          {/* Changed to AreaChart for that modern subtle gradient effect */}
          <AreaChart data={filtered} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3e635" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#a3e635" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.4} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 1', 'dataMax + 1']}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#a3e635"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#weightGradient)"
              dot={{ fill: '#0f172a', stroke: '#a3e635', strokeWidth: 2, r: 3 }}
              activeDot={{ fill: '#a3e635', r: 5, strokeWidth: 3, stroke: '#0f172a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Min / Max / Avg summary */}
      <div className="grid grid-cols-3 gap-2.5 mt-6">
        {[
          { label: 'Start', value: first },
          { label: 'Current', value: last },
          { label: 'Lowest', value: filtered.length ? Math.min(...filtered.map(d => d.weight)) : '--' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-900/40 rounded-2xl px-4 py-2.5 border border-slate-800/40 hover:border-slate-800 transition-colors duration-200">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-white text-base font-bold tracking-tight tabular-nums">
              {value}
              {value !== '--' && <span className="text-slate-500 text-xs font-normal ml-0.5">kg</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightProgressChart;