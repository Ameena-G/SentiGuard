import { TrendingDown, TrendingUp, Minus, Target } from 'lucide-react'
import type { SentimentRecord, Stats } from '../App'

interface InsightsPanelProps {
  sentiments: SentimentRecord[]
  stats: Stats | null
}

export default function InsightsPanel({ sentiments, stats }: InsightsPanelProps) {
  const recentSentiments = sentiments.slice(0, 20)
  const avgScore = stats?.average_score || 0

  // Calculate trend
  const firstHalf = recentSentiments.slice(10, 20)
  const secondHalf = recentSentiments.slice(0, 10)
  const firstHalfAvg =
    firstHalf.reduce((sum, s) => sum + s.sentiment_score, 0) / (firstHalf.length || 1)
  const secondHalfAvg =
    secondHalf.reduce((sum, s) => sum + s.sentiment_score, 0) / (secondHalf.length || 1)
  const trend = secondHalfAvg - firstHalfAvg

  // Top emotions
  const emotionCounts = new Map<string, number>()
  recentSentiments.forEach((s) => {
    if (s.emotions) {
      Object.entries(s.emotions).forEach(([emotion, score]) => {
        emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + score)
      })
    }
  })
  const topEmotions = Array.from(emotionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Most active sources
  const sourceCounts = new Map<string, number>()
  recentSentiments.forEach((s) => {
    sourceCounts.set(s.source, (sourceCounts.get(s.source) || 0) + 1)
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Insights</h2>

      <div className="space-y-4">
        {/* Overall Sentiment */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Overall Sentiment</span>
            {trend > 0.05 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : trend < -0.05 ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <Minus className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {avgScore > 0 ? '+' : ''}
              {avgScore.toFixed(2)}
            </span>
            <span className="text-sm text-slate-600">
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}{' '}
              {Math.abs(trend * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {avgScore > 0.3
              ? '🎉 Customers are very happy!'
              : avgScore > 0
              ? '😊 Generally positive sentiment'
              : avgScore > -0.3
              ? '😐 Mixed sentiment detected'
              : '⚠️ Negative sentiment spike - action needed!'}
          </p>
        </div>

        {/* Top Emotions */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">Top Emotions</h3>
          <div className="space-y-2">
            {topEmotions.map(([emotion, score]) => (
              <div key={emotion}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize text-slate-600">{emotion}</span>
                  <span className="text-slate-500">{score.toFixed(1)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${Math.min((score / topEmotions[0][1]) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Activity */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">Source Activity</h3>
          <div className="space-y-2">
            {Array.from(sourceCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-slate-600">{source}</span>
                  <span className="text-sm font-semibold text-slate-900">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Target className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-900 mb-1">
                Recommendation
              </h3>
              <p className="text-xs text-amber-700">
                {avgScore < -0.2
                  ? 'Immediate action required. Reach out to negative customers and address concerns.'
                  : avgScore < 0
                  ? 'Monitor closely. Consider proactive outreach to neutral customers.'
                  : 'Keep up the good work! Share positive feedback with the team.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 mb-1">Positive Rate</div>
            <div className="text-lg font-bold text-green-700">
              {stats ? Math.round((stats.positive / stats.total) * 100) : 0}%
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xs text-red-600 mb-1">Negative Rate</div>
            <div className="text-lg font-bold text-red-700">
              {stats ? Math.round((stats.negative / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
