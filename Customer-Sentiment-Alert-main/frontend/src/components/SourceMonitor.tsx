import { Twitter, MessageCircle, Star, Mail, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { SentimentRecord } from '../App'

interface SourceMonitorProps {
  sentiments: SentimentRecord[]
  selectedSource: string | null
  onSourceChange: (source: string | null) => void
}

export default function SourceMonitor({
  sentiments,
  selectedSource,
  onSourceChange,
}: SourceMonitorProps) {
  const sources = ['twitter', 'reddit', 'review', 'support']

  const sourceIcons = {
    twitter: <Twitter className="h-4 w-4" />,
    reddit: <MessageCircle className="h-4 w-4" />,
    review: <Star className="h-4 w-4" />,
    support: <Mail className="h-4 w-4" />,
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Live Sentiment Feed</h2>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedSource || 'all'}
            onChange={(e) => {
              const value = e.target.value
              onSourceChange(value === 'all' ? null : value)
            }}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
          >
            <option value="all">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {sentiments.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No sentiments found</p>
            <p className="text-slate-400 text-sm mt-1">
              {selectedSource 
                ? `No ${selectedSource} posts available yet` 
                : 'Waiting for data...'}
            </p>
          </div>
        ) : (
          sentiments.slice(0, 20).map((sentiment) => (
            <SentimentCard
              key={sentiment.id}
              sentiment={sentiment}
              icon={sourceIcons[sentiment.source as keyof typeof sourceIcons]}
            />
          ))
        )}
      </div>
    </div>
  )
}

function SentimentCard({
  sentiment,
  icon,
}: {
  sentiment: SentimentRecord
  icon: React.ReactNode
}) {
  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'border-l-green-500 bg-green-50'
    if (score < -0.1) return 'border-l-red-500 bg-red-50'
    return 'border-l-slate-400 bg-slate-50'
  }

  const getSentimentEmoji = (label: string) => {
    if (label === 'positive') return '😊'
    if (label === 'negative') return '😞'
    return '😐'
  }

  return (
    <div
      className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getSentimentColor(
        sentiment.sentiment_score
      )}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="text-slate-600">{icon}</div>
          <span className="text-xs font-medium text-slate-600">
            @{sentiment.author}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(sentiment.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getSentimentEmoji(sentiment.sentiment_label)}</span>
          <span
            className={`text-xs font-semibold ${
              sentiment.sentiment_score > 0.1
                ? 'text-green-600'
                : sentiment.sentiment_score < -0.1
                ? 'text-red-600'
                : 'text-slate-600'
            }`}
          >
            {sentiment.sentiment_score.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-2">{sentiment.text}</p>

      {sentiment.emotions && Object.keys(sentiment.emotions).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(sentiment.emotions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([emotion, score]) => (
              <span
                key={emotion}
                className="text-xs bg-white px-2 py-1 rounded-full border border-slate-200"
              >
                {emotion}: {(score * 100).toFixed(0)}%
              </span>
            ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 capitalize">
          Source: {sentiment.source}
        </span>
        <span className="text-xs text-slate-400">
          Confidence: {(sentiment.confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
