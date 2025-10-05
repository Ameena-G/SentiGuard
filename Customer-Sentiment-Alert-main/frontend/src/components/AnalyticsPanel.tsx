import { BarChart3, TrendingUp, TrendingDown, Activity, PieChart } from 'lucide-react'
import { SentimentRecord, Stats } from '../App'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts'
import { useMemo } from 'react'

interface AnalyticsPanelProps {
  sentiments: SentimentRecord[]
  stats: Stats | null
}

export default function AnalyticsPanel({ sentiments, stats }: AnalyticsPanelProps) {
  // Calculate sentiment distribution (memoized to prevent re-renders)
  const sentimentDistribution = useMemo(() => [
    { name: 'Positive', value: stats?.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: stats?.neutral || 0, color: '#6b7280' },
    { name: 'Negative', value: stats?.negative || 0, color: '#ef4444' },
  ], [stats])

  // Calculate source breakdown (memoized)
  const sourceData = useMemo(() => 
    stats?.by_source 
      ? Object.entries(stats.by_source).map(([source, data]) => ({
          source: source.charAt(0).toUpperCase() + source.slice(1),
          count: data.count,
          avgScore: data.avg_score
        }))
      : []
  , [stats])

  // Calculate hourly distribution from actual sentiments (memoized)
  const hourlyData = useMemo(() => {
    const hourCounts: { [key: number]: number } = {}
    
    // Initialize all hours with 0
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0
    }
    
    // Count sentiments by hour
    sentiments.forEach(sentiment => {
      const date = new Date(sentiment.created_at)
      const hour = date.getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    
    // Convert to array format for chart - format like "0:00", "1:00", etc.
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: hourCounts[i] || 0
    }))
  }, [sentiments])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h2>
        <p className="text-slate-600">Comprehensive sentiment analysis and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Mentions"
          value={stats?.total || 0}
          icon={<Activity className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Positive Rate"
          value={`${stats ? Math.round((stats.positive / stats.total) * 100) : 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Negative Rate"
          value={`${stats ? Math.round((stats.negative / stats.total) * 100) : 0}%`}
          icon={<TrendingDown className="h-6 w-6" />}
          color="red"
        />
        <MetricCard
          title="Avg Sentiment"
          value={stats?.average_score.toFixed(2) || '0.00'}
          icon={<BarChart3 className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={sentimentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Source Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">24-Hour Activity Pattern</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
            <Bar 
              dataKey="count" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Keywords */}
      <TopKeywords sentiments={sentiments} />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'purple'
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

// Top Keywords Component with memoized data
function TopKeywords({ sentiments }: { sentiments: SentimentRecord[] }) {
  const keywordCounts = useMemo(() => {
    // Define keywords to search for
    const keywordMap = {
      'customer service': ['customer', 'service'],
      'product quality': ['product', 'quality'],
      'delivery': ['delivery', 'shipping'],
      'support': ['support', 'help'],
      'price': ['price', 'cost', 'expensive'],
      'features': ['feature', 'functionality'],
      'update': ['update', 'upgrade'],
      'bug': ['bug', 'issue', 'problem', 'error']
    }
    
    const counts: { [key: string]: number } = {}
    
    // Count occurrences
    Object.entries(keywordMap).forEach(([displayName, keywords]) => {
      counts[displayName] = sentiments.filter(s => {
        const text = s.text.toLowerCase()
        return keywords.some(kw => text.includes(kw))
      }).length
    })
    
    // Return in specific order for display
    return [
      { keyword: 'customer service', count: counts['customer service'] || 0 },
      { keyword: 'product quality', count: counts['product quality'] || 0 },
      { keyword: 'delivery', count: counts['delivery'] || 0 },
      { keyword: 'support', count: counts['support'] || 0 },
      { keyword: 'price', count: counts['price'] || 0 },
      { keyword: 'features', count: counts['features'] || 0 },
      { keyword: 'update', count: counts['update'] || 0 },
      { keyword: 'bug', count: counts['bug'] || 0 }
    ]
  }, [sentiments])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Mentioned Keywords</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {keywordCounts.map((item, idx) => (
          <div key={idx} className="text-center">
            <p className="text-sm font-medium text-slate-600 mb-2">{item.keyword}</p>
            <p className="text-3xl font-bold text-blue-600">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
