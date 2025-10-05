import { Bell, Volume2, Mail, MessageSquare, Settings as SettingsIcon, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function AlertSettingsPanel() {
  const [settings, setSettings] = useState({
    voiceAlerts: true,
    emailNotifications: false,
    slackIntegration: false,
    criticalThreshold: -0.7,
    highThreshold: -0.5,
    mediumThreshold: -0.3,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [slackWebhook, setSlackWebhook] = useState('')
  const [showEmailSetup, setShowEmailSetup] = useState(false)
  const [showSlackSetup, setShowSlackSetup] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      console.log('Alert settings saved:', settings)
      
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const handleEmailToggle = (enabled: boolean) => {
    if (enabled && !emailAddress) {
      setShowEmailSetup(true)
    } else {
      setSettings({ ...settings, emailNotifications: enabled })
    }
  }

  const handleEmailSetup = () => {
    if (emailAddress) {
      setSettings({ ...settings, emailNotifications: true })
      setShowEmailSetup(false)
      alert(`Email notifications enabled for: ${emailAddress}`)
    }
  }

  const handleSlackToggle = (enabled: boolean) => {
    if (enabled && !slackWebhook) {
      setShowSlackSetup(true)
    } else {
      setSettings({ ...settings, slackIntegration: enabled })
    }
  }

  const handleSlackSetup = () => {
    if (slackWebhook) {
      setSettings({ ...settings, slackIntegration: true })
      setShowSlackSetup(false)
      alert('Slack integration enabled successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Alert Settings</h2>
        <p className="text-slate-600">Configure how and when you receive alerts</p>
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <ToggleSetting
            icon={<Volume2 className="h-5 w-5" />}
            title="Voice Alerts"
            description="Browser-based voice notifications for critical alerts"
            enabled={settings.voiceAlerts}
            onChange={(val) => setSettings({ ...settings, voiceAlerts: val })}
          />
          <ToggleSetting
            icon={<Mail className="h-5 w-5" />}
            title="Email Notifications"
            description="Receive alerts via email"
            enabled={settings.emailNotifications}
            onChange={handleEmailToggle}
          />
          {showEmailSetup && (
            <div className="ml-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Enter your email address:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleEmailSetup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Enable
                </button>
                <button
                  onClick={() => setShowEmailSetup(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <ToggleSetting
            icon={<MessageSquare className="h-5 w-5" />}
            title="Slack Integration"
            description="Send alerts to Slack channel"
            enabled={settings.slackIntegration}
            onChange={handleSlackToggle}
          />
          {showSlackSetup && (
            <div className="ml-12 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Enter Slack Webhook URL:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSlackSetup}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowSlackSetup(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Alert Thresholds</h3>
        <p className="text-sm text-slate-600 mb-6">
          Set sentiment score thresholds for different alert levels
        </p>
        <div className="space-y-6">
          <ThresholdSlider
            label="Critical Alert"
            value={settings.criticalThreshold}
            onChange={(val) => setSettings({ ...settings, criticalThreshold: val })}
            color="red"
          />
          <ThresholdSlider
            label="High Priority"
            value={settings.highThreshold}
            onChange={(val) => setSettings({ ...settings, highThreshold: val })}
            color="orange"
          />
          <ThresholdSlider
            label="Medium Priority"
            value={settings.mediumThreshold}
            onChange={(val) => setSettings({ ...settings, mediumThreshold: val })}
            color="yellow"
          />
        </div>
      </div>

      {/* Alert Rules */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Alert Rules</h3>
        <div className="space-y-3">
          {[
            'Alert when negative sentiment spike detected',
            'Alert for mentions containing specific keywords',
            'Alert when sentiment drops below threshold',
            'Alert for high-volume negative feedback',
          ].map((rule, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">{rule}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-medium">Alert settings saved successfully!</span>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
            isSaving
              ? 'bg-slate-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}

interface ToggleSettingProps {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}

function ToggleSetting({ icon, title, description, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )
}

interface ThresholdSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  color: 'red' | 'orange' | 'yellow'
}

function ThresholdSlider({ label, value, onChange, color }: ThresholdSliderProps) {
  const colorClasses = {
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    yellow: 'bg-yellow-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-slate-900">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min="-1"
        max="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colorClasses[color]}`}
      />
    </div>
  )
}
