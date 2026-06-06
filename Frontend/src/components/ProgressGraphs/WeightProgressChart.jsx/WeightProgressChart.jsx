import React, { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from "recharts";
import { getWeightHistory } from '../../services/Weightservices.js'
import { TrendingDown, TrendingUp } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a2335] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-gray-400 text-xs mb-0.5">{label}</p>
        <p className="text-[#a3e635] font-bold text-sm">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

const WeightProgressChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'week' | 'month' | 'all'

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
      const monthAgo = new Date(now - 30 * 24 *
  const first = filtered[0]?.weight;
  const last = filtered[filtered.length - 1]?.weight;
  const diff = first && last ? (last - first).toFixed(1) : null;
  const trending = diff !== null && parseFloat(diff) < 0;

  if (loading) {
    return (
      <div className="bg-[#111827] rounded-3xl p-5 border border-white/[0.05] animate-pulse">
        <div className="h-5 w-36 bg-white/10 rounded mb-4" />
        <div className="h-56 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#111827] rounded-3xl p-5 border border-white/[0.05]">
        <h3 className="text-white font-bold text-lg mb-2">Weight Progress</h3>
        <p className="text-gray-500 text-sm">No weight data yet. Start logging your weight!</p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#111827] rounded-3xl p-5 border border-white/[0.05]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">Weight Progress</h3>
          {diff !== null && (
            <div className="flex items-center gap-1 mt-0.5">
              {trending
                ? <TrendingDown size={13} className="text-[#a3e635]" />
                : <TrendingUp size={13} className="text-red-400" />
              }
              <span className={`text-xs font-semibold ${trending ? 'text-[#a3e635]' : 'text-red-400'}`}>
                {diff > 0 ? '+' : ''}{diff} kg
              </span>
              <span className="text-gray-600 text-xs">in this period</span>
            </div>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {['week', 'month', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all capitalize ${
                filter === f
                  ? 'bg-[#a3e635] text-black border-[#a3e635]'
                  : 'bg-white/[0.03] text-gray-500 border-white/[0.06] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#1e2a3a" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4b5563', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#a3e635"
              strokeWidth={2.5}
              dot={{ fill: '#a3e635', r: 3, strokeWidth: 0 }}
              activeDot={{ fill: '#a3e635', r: 5, strokeWidth: 2, stroke: '#0a0f1c' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Min / Max / Avg summary */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: 'Start', value: first },
          { label: 'Current', value: last },
          { label: 'Lowest', value: filtered.length ? Math.min(...filtered.map(d => d.weight)) : '--' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-black/20 rounded-xl px-3 py-2 text-center border border-white/[0.04]">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-white text-sm font-bold tabular-nums">
              {value}<span className="text-gray-600 text-[10px] ml-0.5">kg</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightProgressChart;