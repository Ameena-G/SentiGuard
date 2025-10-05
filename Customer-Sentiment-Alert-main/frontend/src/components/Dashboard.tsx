import { useState } from 'react'
import { Activity, AlertTriangle, TrendingUp, Zap, Download, Volume2, VolumeX } from 'lucide-react'
import SentimentChart from './SentimentChart'
import AlertPanel from './AlertPanel'
import SourceMonitor from './SourceMonitor'
import InsightsPanel from './InsightsPanel'
import type { SentimentRecord, Alert, Stats } from '../App'
import { exportAsJSON, exportAsCSV, exportSummaryReport } from '../lib/exportReport'

interface DashboardProps {
  sentiments: SentimentRecord[]
  alerts: Alert[]
  stats: Stats | null
  isConnected: boolean
  voiceEnabled: boolean
  onToggleVoice: () => void
  onResolveAlert: (alertId: number) => void
  onTriggerCrisis: () => void
}

export default function Dashboard({
  sentiments,
  alerts,
  stats,
  isConnected,
  voiceEnabled,
  onToggleVoice,
  onResolveAlert,
  onTriggerCrisis,
}: DashboardProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleExport = (format: 'json' | 'csv' | 'summary') => {
    const reportData = {
      sentiments,
      alerts,
      stats,
      generatedAt: new Date().toISOString()
    }

    switch (format) {
      case 'json':
        exportAsJSON(reportData)
        break
      case 'csv':
        exportAsCSV(reportData)
        break
      case 'summary':
        exportSummaryReport(reportData)
        break
    }

    setShowExportMenu(false)
  }

  const filteredSentiments = selectedSource
    ? sentiments.filter((s) => s.source === selectedSource)
    : sentiments

  const unresolvedAlerts = alerts.filter((a) => !a.is_resolved)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SentiGuard</h1>
                <p className="text-sm text-slate-600">
                  Real-time Customer Sentiment Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-slate-600">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              
              {/* Voice Alerts Toggle */}
              <button
                onClick={onToggleVoice}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2 ${
                  voiceEnabled 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={voiceEnabled ? 'Voice alerts enabled' : 'Voice alerts disabled'}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="hidden sm:inline">Voice</span>
              </button>

              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      onClick={() => handleExport('summary')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      📄 Summary Report (.txt)
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      📊 CSV Export
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      💾 JSON Data
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onTriggerCrisis}
                className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                🚨 Crisis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Mentions"
            value={stats?.total || 0}
            icon={<Activity className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            title="Positive"
            value={stats?.positive || 0}
            icon={<TrendingUp className="h-5 w-5" />}
            color="green"
            percentage={stats ? Math.round((stats.positive / stats.total) * 100) : 0}
          />
          <StatCard
            title="Negative"
            value={stats?.negative || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="red"
            percentage={stats ? Math.round((stats.negative / stats.total) * 100) : 0}
          />
          <StatCard
            title="Active Alerts"
            value={unresolvedAlerts.length}
            icon={<Zap className="h-5 w-5" />}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Feed */}
          <div className="lg:col-span-2 space-y-6">
            <SentimentChart sentiments={sentiments} />
            <SourceMonitor
              sentiments={filteredSentiments}
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
            />
          </div>

          {/* Right Column - Alerts and Insights */}
          <div className="space-y-6">
            <AlertPanel alerts={unresolvedAlerts} onResolve={onResolveAlert} />
            <InsightsPanel sentiments={sentiments} stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'orange'
  percentage?: number
}

function StatCard({ title, value, icon, color, percentage }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {percentage !== undefined && (
          <span className="text-sm text-slate-500">({percentage}%)</span>
        )}
      </div>
    </div>
  )
}
