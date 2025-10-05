import { useMemo } from 'react'
import type { SentimentRecord } from '../App'

interface WordCloudProps {
  sentiments: SentimentRecord[]
}

export default function WordCloud({ sentiments }: WordCloudProps) {
  const wordFrequency = useMemo(() => {
    // Filter only negative sentiments
    const negativeSentiments = sentiments.filter(s => s.sentiment_score < -0.1)
    
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
      'its', 'our', 'their', 'me', 'him', 'them', 'us', 'am', 'not', 'just'
    ])

    const wordCount = new Map<string, number>()

    negativeSentiments.forEach(sentiment => {
      // Extract words from text
      const words = sentiment.text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word))

      words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1)
      })
    })

    // Convert to array and sort by frequency
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20) // Top 20 words
  }, [sentiments])

  const maxCount = wordFrequency[0]?.[1] || 1

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        🔍 Negative Feedback Keywords
      </h2>
      
      {wordFrequency.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600">No negative mentions yet</p>
          <p className="text-xs text-slate-400 mt-1">Keywords will appear here</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {wordFrequency.map(([word, count]) => {
            const size = Math.max(12, Math.min(32, (count / maxCount) * 32))
            const opacity = 0.5 + (count / maxCount) * 0.5
            
            return (
              <div
                key={word}
                className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                style={{
                  fontSize: `${size}px`,
                  opacity: opacity,
                }}
                title={`Mentioned ${count} times`}
              >
                <span className="font-semibold text-red-700">{word}</span>
                <span className="ml-1 text-xs text-red-500">({count})</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          💡 <span className="font-medium">Insight:</span> Larger words appear more frequently in negative feedback
        </p>
      </div>
    </div>
  )
}
