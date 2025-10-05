import { MessageSquare, Search, Plus, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function QueriesPanel() {
  const [keyword, setKeyword] = useState('')
  const [sentiment, setSentiment] = useState('all')
  const [source, setSource] = useState('all')
  const [timeRange, setTimeRange] = useState('24hours')
  const [isRunning, setIsRunning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  
  const [queries, setQueries] = useState([
    {
      id: 1,
      query: 'Show all negative mentions about "customer service" in the last 24 hours',
      results: 23,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      query: 'Find positive feedback mentioning "fast delivery"',
      results: 45,
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      query: 'Critical alerts from Twitter in the past week',
      results: 8,
      timestamp: '1 day ago'
    },
  ])

  const handleRunQuery = () => {
    setIsRunning(true)
    setShowSuccess(false)
    
    // Simulate query execution
    setTimeout(() => {
      const count = Math.floor(Math.random() * 50) + 10
      setResultCount(count)
      setIsRunning(false)
      setShowSuccess(true)
      
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const handleSaveQuery = () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword to save the query')
      return
    }
    
    const newQuery = {
      id: queries.length + 1,
      query: `Find ${sentiment !== 'all' ? sentiment : 'all'} mentions about "${keyword}" from ${source !== 'all' ? source : 'all sources'} in ${timeRange}`,
      results: Math.floor(Math.random() * 50) + 10,
      timestamp: 'just now'
    }
    
    setQueries([newQuery, ...queries])
    setShowSaveSuccess(true)
    
    // Clear form after saving
    setKeyword('')
    setSentiment('all')
    setSource('all')
    setTimeRange('24hours')
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const handleRunSavedQuery = (query: any) => {
    setIsRunning(true)
    setTimeout(() => {
      setResultCount(query.results)
      setIsRunning(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Custom Queries</h2>
        <p className="text-slate-600">Search and filter sentiment data with custom queries</p>
      </div>

      {/* New Query Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Build a Query</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Keywords</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., customer service, delivery, bug"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sentiment</label>
              <select 
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
              <select 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
                <option value="reviews">Reviews</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Query executed! Found {resultCount} results</span>
            </div>
          )}

          {showSaveSuccess && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Query saved successfully! Check "Recent Queries" below.</span>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRunQuery}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                isRunning
                  ? 'bg-slate-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>{isRunning ? 'Running...' : 'Run Query'}</span>
            </button>
            <button 
              onClick={handleSaveQuery}
              disabled={!keyword.trim()}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                !keyword.trim()
                  ? 'border border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Save Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Queries */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Queries</h3>
        <div className="space-y-3">
          {queries.map((query) => (
            <div key={query.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-slate-900">{query.query}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {query.timestamp}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {query.results} results
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRunSavedQuery(query)}
                  className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Run Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Query Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'All critical alerts this week',
            'Positive mentions about features',
            'Customer service complaints',
            'Product quality feedback',
            'Delivery-related mentions',
            'Price sensitivity analysis'
          ].map((template, idx) => (
            <button
              key={idx}
              className="text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <p className="text-sm font-medium text-slate-700">{template}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
