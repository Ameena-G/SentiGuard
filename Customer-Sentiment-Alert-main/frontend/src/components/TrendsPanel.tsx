import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState } from 'react'

export default function TrendsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisweek')
  
  // Generate data based on selected period
  const getWeeklyTrend = () => {
    const days = selectedPeriod === 'thisweek' ? 7 : selectedPeriod === 'lastweek' ? 7 : 30
    const dayLabels = selectedPeriod === 'lastmonth' 
      ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    return Array.from({ length: days }, (_, i) => ({
      day: dayLabels[i] || `Day ${i + 1}`,
      positive: Math.floor(Math.random() * 50) + 30,
      negative: Math.floor(Math.random() * 30) + 10,
      neutral: Math.floor(Math.random() * 20) + 15,
    }))
  }
  
  const weeklyTrend = getWeeklyTrend()

  const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    sentiment: (Math.random() * 2 - 1).toFixed(2),
  }))

  const trendingTopics = [
    { topic: 'Customer Service', change: +15, sentiment: 'improving' },
    { topic: 'Product Quality', change: -8, sentiment: 'declining' },
    { topic: 'Delivery Speed', change: +22, sentiment: 'improving' },
    { topic: 'Pricing', change: -12, sentiment: 'declining' },
    { topic: 'Features', change: +5, sentiment: 'stable' },
    { topic: 'Support Response', change: +18, sentiment: 'improving' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sentiment Trends</h2>
        <p className="text-slate-600">Track sentiment changes over time</p>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedPeriod === 'thisweek' ? 'This Week' : selectedPeriod === 'lastweek' ? 'Last Week' : 'Last Month'} Sentiment Trend
          </h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="thisweek">This Week</option>
              <option value="lastweek">Last Week</option>
              <option value="lastmonth">Last Month</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Trending Topics</h3>
        <div className="space-y-3">
          {trendingTopics.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                {item.sentiment === 'improving' && (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {item.sentiment === 'declining' && (
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                )}
                {item.sentiment === 'stable' && (
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Minus className="h-5 w-5 text-slate-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{item.topic}</p>
                  <p className="text-sm text-slate-500 capitalize">{item.sentiment}</p>
                </div>
              </div>
              <div className={`text-lg font-bold ${
                item.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Sentiment Score */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">30-Day Sentiment Score</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="sentiment" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
