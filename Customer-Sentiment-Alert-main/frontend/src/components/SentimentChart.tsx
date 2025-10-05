import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { format } from 'date-fns'
import type { SentimentRecord } from '../App'

interface SentimentChartProps {
  sentiments: SentimentRecord[]
}

export default function SentimentChart({ sentiments }: SentimentChartProps) {
  const chartData = useMemo(() => {
    // Group sentiments by 5-minute intervals
    const grouped = new Map<string, { scores: number[]; count: number }>()

    sentiments.forEach((sentiment) => {
      const date = new Date(sentiment.created_at)
      const roundedTime = new Date(
        Math.floor(date.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000)
      )
      const key = roundedTime.toISOString()

      if (!grouped.has(key)) {
        grouped.set(key, { scores: [], count: 0 })
      }

      const entry = grouped.get(key)!
      entry.scores.push(sentiment.sentiment_score)
      entry.count++
    })

    // Convert to chart data
    const data = Array.from(grouped.entries())
      .map(([time, { scores, count }]) => ({
        time,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        count,
        positive: scores.filter((s) => s > 0.1).length,
        negative: scores.filter((s) => s < -0.1).length,
        neutral: scores.filter((s) => s >= -0.1 && s <= 0.1).length,
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(-20) // Last 20 data points

    return data
  }, [sentiments])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Sentiment Trend (Last Hour)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => format(new Date(time), 'HH:mm')}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis
            domain={[-1, 1]}
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="avgScore"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorScore)"
            name="Avg Sentiment"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Distribution Chart */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          Sentiment Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Positive"
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.6}
              name="Neutral"
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
              name="Negative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
      <p className="text-sm font-medium text-slate-900 mb-2">
        {format(new Date(label), 'HH:mm:ss')}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value.toFixed(2)}</span>
        </p>
      ))}
    </div>
  )
}
