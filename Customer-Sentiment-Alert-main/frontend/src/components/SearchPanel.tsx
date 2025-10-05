import { Search, Filter, Calendar, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  const allMockResults = [
    // Twitter
    {
      id: 1,
      text: "Your customer service is absolutely terrible. Been waiting for 3 hours with no response!",
      author: "frustrated_customer",
      source: "twitter",
      sentiment: "negative",
      score: -0.85,
      date: "2 hours ago",
      timestamp: Date.now() - 2 * 60 * 60 * 1000
    },
    {
      id: 2,
      text: "Just tried your new feature and it's incredible! Best update ever! 🎉",
      author: "tech_enthusiast",
      source: "twitter",
      sentiment: "positive",
      score: 0.95,
      date: "3 hours ago",
      timestamp: Date.now() - 3 * 60 * 60 * 1000
    },
    {
      id: 3,
      text: "The app keeps crashing on my phone. Really frustrating experience.",
      author: "mobile_user",
      source: "twitter",
      sentiment: "negative",
      score: -0.68,
      date: "5 hours ago",
      timestamp: Date.now() - 5 * 60 * 60 * 1000
    },
    // Reddit
    {
      id: 4,
      text: "Has anyone else had issues with the payment system? Mine failed twice today.",
      author: "reddit_user_123",
      source: "reddit",
      sentiment: "negative",
      score: -0.55,
      date: "1 hour ago",
      timestamp: Date.now() - 1 * 60 * 60 * 1000
    },
    {
      id: 5,
      text: "I've been using this for 6 months now and it's been absolutely fantastic. Highly recommend!",
      author: "long_time_user",
      source: "reddit",
      sentiment: "positive",
      score: 0.88,
      date: "4 hours ago",
      timestamp: Date.now() - 4 * 60 * 60 * 1000
    },
    {
      id: 6,
      text: "The interface is okay, nothing special but gets the job done.",
      author: "casual_reviewer",
      source: "reddit",
      sentiment: "neutral",
      score: 0.15,
      date: "6 hours ago",
      timestamp: Date.now() - 6 * 60 * 60 * 1000
    },
    // Reviews
    {
      id: 7,
      text: "The delivery was 2 weeks late and the package arrived damaged.",
      author: "angry_user",
      source: "review",
      sentiment: "negative",
      score: -0.72,
      date: "8 hours ago",
      timestamp: Date.now() - 8 * 60 * 60 * 1000
    },
    {
      id: 8,
      text: "Amazing product! Exceeded all my expectations. Highly recommend!",
      author: "happy_buyer",
      source: "review",
      sentiment: "positive",
      score: 0.92,
      date: "1 day ago",
      timestamp: Date.now() - 24 * 60 * 60 * 1000
    },
    {
      id: 9,
      text: "Good quality but a bit overpriced for what you get.",
      author: "value_shopper",
      source: "review",
      sentiment: "neutral",
      score: 0.25,
      date: "2 days ago",
      timestamp: Date.now() - 48 * 60 * 60 * 1000
    },
    // Support
    {
      id: 10,
      text: "Support team was very helpful and resolved my issue quickly!",
      author: "satisfied_customer",
      source: "support",
      sentiment: "positive",
      score: 0.85,
      date: "30 minutes ago",
      timestamp: Date.now() - 30 * 60 * 1000
    },
    {
      id: 11,
      text: "Still waiting for a response to my ticket from 3 days ago...",
      author: "waiting_user",
      source: "support",
      sentiment: "negative",
      score: -0.62,
      date: "3 days ago",
      timestamp: Date.now() - 72 * 60 * 60 * 1000
    }
  ]

  const handleSearch = () => {
    setIsSearching(true)
    setHasSearched(true)
    
    // Simulate search with filters
    setTimeout(() => {
      let filtered = allMockResults
      
      // Apply search query filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(result => 
          result.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply source filter
      if (selectedSource !== 'all') {
        filtered = filtered.filter(result => result.source === selectedSource)
      }
      
      // Apply sentiment filter
      if (selectedSentiment !== 'all') {
        filtered = filtered.filter(result => result.sentiment === selectedSentiment)
      }
      
      // Apply date range filter
      const now = Date.now()
      if (dateRange === '24h') {
        filtered = filtered.filter(result => now - result.timestamp < 24 * 60 * 60 * 1000)
      } else if (dateRange === '7d') {
        filtered = filtered.filter(result => now - result.timestamp < 7 * 24 * 60 * 60 * 1000)
      } else if (dateRange === '30d') {
        filtered = filtered.filter(result => now - result.timestamp < 30 * 24 * 60 * 60 * 1000)
      }
      
      setSearchResults(filtered)
      setIsSearching(false)
    }, 1000)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setHasSearched(false)
    setSelectedSource('all')
    setSelectedSentiment('all')
    setDateRange('all')
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedSource !== 'all') count++
    if (selectedSentiment !== 'all') count++
    if (dateRange !== 'all') count++
    return count
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Search Sentiments</h2>
        <p className="text-slate-600">Search through all customer feedback and mentions</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by keyword, author, or source..."
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isSearching
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || getActiveFilterCount() > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">
              Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {getActiveFilterCount() > 0 && (
            <button 
              onClick={() => {
                setSelectedSource('all')
                setSelectedSentiment('all')
                setDateRange('all')
                if (hasSearched) handleSearch()
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Sources</option>
                  <option value="twitter">Twitter</option>
                  <option value="reddit">Reddit</option>
                  <option value="review">Reviews</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sentiment</label>
                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {!hasSearched ? (
          <div className="p-12 text-center">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Start Searching</h3>
            <p className="text-slate-500">Enter keywords to search through customer feedback</p>
          </div>
        ) : isSearching ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Searching...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Results Found</h3>
            <p className="text-slate-500">Try different keywords or filters</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </h3>
              <button 
                onClick={handleClearSearch}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Search
              </button>
            </div>
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-600">@{result.author}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{result.date}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      result.sentiment === 'positive' 
                        ? 'bg-green-100 text-green-700'
                        : result.sentiment === 'negative'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {result.sentiment} ({result.score.toFixed(2)})
                    </span>
                  </div>
                  <p className="text-slate-700 mb-2">{result.text}</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded capitalize">
                      {result.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
