import { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Sidebar from './components/Sidebar'
import SearchPanel from './components/SearchPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import ReportsPanel from './components/ReportsPanel'
import QueriesPanel from './components/QueriesPanel'
import TrendsPanel from './components/TrendsPanel'
import AlertSettingsPanel from './components/AlertSettingsPanel'
import UsersPanel from './components/UsersPanel'
import SettingsPanel from './components/SettingsPanel'
import { useWebSocket } from './hooks/useWebSocket'
import { useVoiceAlerts } from './hooks/useVoiceAlerts'
import { api } from './lib/api'
import { AlertCircle } from 'lucide-react'

export interface SentimentRecord {
  id: number
  source: string
  source_id: string
  text: string
  sentiment_score: number
  sentiment_label: string
  confidence: number
  emotions: Record<string, number>
  author: string
  created_at: string
  processed_at: string
}

export interface Alert {
  id: number
  severity: string
  title: string
  message: string
  sentiment_record_id: number
  suggested_response: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

export interface Stats {
  total: number
  positive: number
  negative: number
  neutral: number
  average_score: number
  by_source: Record<string, { count: number; avg_score: number }>
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'app'>('landing')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userData, setUserData] = useState<{ name: string; email: string; role: string } | null>(null)
  const [sentiments, setSentiments] = useState<SentimentRecord[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const lastStatsUpdateRef = useRef(0)

  const { isConnected, lastMessage } = useWebSocket('ws://localhost:8000/ws')
  const { announceAlert, testVoice } = useVoiceAlerts({ enabled: voiceEnabled })

  const handleToggleVoice = () => {
    const newState = !voiceEnabled
    setVoiceEnabled(newState)
    
    if (newState) {
      testVoice()
    }
  }

  const handleEnterDashboard = () => {
    setCurrentView('login')
  }

  const handleLogin = (user: { name: string; email: string; role: string }) => {
    setUserData(user)
    setCurrentView('app')
  }

  const handleRegister = (user: { name: string; email: string; role: string }) => {
    setUserData(user)
    setCurrentView('app')
  }

  const handleLogout = () => {
    setUserData(null)
    setCurrentView('landing')
    setActiveTab('dashboard')
  }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [sentimentsData, alertsData, statsData] = await Promise.all([
          api.getSentiments(50),
          api.getAlerts(20),
          api.getStats(24),
        ])
        setSentiments(sentimentsData)
        setAlerts(alertsData)
        setStats(statsData)
        setError(null)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load data. Make sure the backend is running on port 8000.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    if (lastMessage.type === 'sentiment') {
      const newSentiment = lastMessage.data
      setSentiments((prev) => {
        // Check if this sentiment already exists
        const exists = prev.some(s => s.id === newSentiment.id)
        if (exists) return prev
        
        // Add new sentiment and keep only last 100
        return [newSentiment, ...prev].slice(0, 100)
      })
      
      // Throttle stats refresh - only update every 5 seconds
      const now = Date.now()
      if (now - lastStatsUpdateRef.current > 5000) {
        lastStatsUpdateRef.current = now
        api.getStats(24).then(setStats).catch(err => console.error('Failed to refresh stats:', err))
      }
    } else if (lastMessage.type === 'alert') {
      const newAlert = lastMessage.data
      setAlerts((prev) => {
        // Check if this alert already exists
        const exists = prev.some(a => a.id === newAlert.id)
        if (exists) return prev
        
        return [newAlert, ...prev]
      })
      
      // Announce alert via voice if enabled
      if (voiceEnabled) {
        announceAlert(newAlert.severity, newAlert.id)
      }
    }
  }, [lastMessage, voiceEnabled, announceAlert])

  const handleResolveAlert = async (alertId: number) => {
    try {
      await api.resolveAlert(alertId)
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_resolved: true } : alert
        )
      )
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  const handleTriggerCrisis = async () => {
    try {
      await api.triggerCrisis()
    } catch (err) {
      console.error('Failed to trigger crisis:', err)
    }
  }

  // Show landing page first
  if (currentView === 'landing') {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />
  }

  // Show login page
  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />
  }

  // Show register page
  if (currentView === 'register') {
    return <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SentiGuard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Connection Error</h2>
          <p className="text-muted-foreground text-center mb-4">{error}</p>
          <div className="bg-muted p-4 rounded-md text-sm">
            <p className="font-semibold mb-2">Quick Fix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Navigate to backend folder</li>
              <li>Run: <code className="bg-slate-200 px-1 rounded">python app.py</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userName={userData?.name}
        userRole={userData?.role}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            sentiments={sentiments}
            alerts={alerts}
            stats={stats}
            isConnected={isConnected}
            voiceEnabled={voiceEnabled}
            onToggleVoice={handleToggleVoice}
            onResolveAlert={handleResolveAlert}
            onTriggerCrisis={handleTriggerCrisis}
          />
        )}
        
        {activeTab === 'search' && (
          <div className="p-8">
            <SearchPanel />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="p-8">
            <AnalyticsPanel sentiments={sentiments} stats={stats} />
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="p-8">
            <ReportsPanel />
          </div>
        )}
        
        {activeTab === 'queries' && (
          <div className="p-8">
            <QueriesPanel />
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div className="p-8">
            <TrendsPanel />
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div className="p-8">
            <AlertSettingsPanel />
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="p-8">
            <UsersPanel />
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-8">
            <SettingsPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
