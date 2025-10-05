import { Settings, Globe, Palette, Database, Key, Shield, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    dataRetention: '90',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      console.log('Settings saved:', settings)
      
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const handleExportData = () => {
    const data = JSON.stringify({ settings, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sentiguard_data_export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      alert('Data deletion initiated. This is a demo - no data was actually deleted.')
    }
  }

  const handleRegenerateKey = () => {
    if (confirm('Regenerate API key? Your old key will stop working.')) {
      alert('New API key generated: sk_live_' + Math.random().toString(36).substring(7))
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setSettings({ ...settings, theme: newTheme })
    
    // Apply theme immediately
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      alert('Dark mode enabled! (Demo - full dark mode styling would be applied in production)')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
      alert('Light mode enabled!')
    } else {
      alert('Auto mode enabled! Theme will match your system preferences.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600">Configure application preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          General
        </h3>
        <div className="space-y-4">
          <SettingRow
            icon={<Globe className="h-5 w-5" />}
            label="Language"
            description="Choose your preferred language"
          >
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={<Palette className="h-5 w-5" />}
            label="Theme"
            description="Select your display theme"
          >
            <select
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={<Globe className="h-5 w-5" />}
            label="Timezone"
            description="Set your local timezone"
          >
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="IST">India Standard Time</option>
            </select>
          </SettingRow>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          Data & Privacy
        </h3>
        <div className="space-y-4">
          <SettingRow
            icon={<Database className="h-5 w-5" />}
            label="Data Retention"
            description="How long to keep sentiment data"
          >
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">1 Year</option>
            </select>
          </SettingRow>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-slate-900">Export Data</p>
                <p className="text-sm text-slate-600">Download all your data</p>
              </div>
            </div>
            <button 
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Delete All Data</p>
                <p className="text-sm text-red-600">Permanently remove all sentiment data</p>
              </div>
            </div>
            <button 
              onClick={handleDeleteData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* API & Integrations */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Key className="h-5 w-5 mr-2 text-blue-600" />
          API & Integrations
        </h3>
        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-slate-900">API Key</p>
              <button 
                onClick={handleRegenerateKey}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Regenerate
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded font-mono text-sm text-slate-600 break-all">
              sk_live_51HxYz2SIxyz...
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-slate-900">Connected Integrations</p>
            {[
              { name: 'Slack', status: 'Connected', color: 'green' },
              { name: 'Email', status: 'Connected', color: 'green' },
              { name: 'Webhook', status: 'Not Connected', color: 'slate' },
            ].map((integration, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{integration.name}</span>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  integration.color === 'green' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isSaving
              ? 'bg-slate-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

interface SettingRowProps {
  icon: React.ReactNode
  label: string
  description: string
  children: React.ReactNode
}

function SettingRow({ icon, label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
      <div className="flex items-center space-x-3 flex-1">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  )
}
