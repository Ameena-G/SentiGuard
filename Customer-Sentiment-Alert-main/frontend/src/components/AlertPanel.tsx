import { CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Alert } from '../App'

interface AlertPanelProps {
  alerts: Alert[]
  onResolve: (alertId: number) => void
}

export default function AlertPanel({ alerts, onResolve }: AlertPanelProps) {
  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Active Alerts</h2>
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No active alerts</p>
            <p className="text-xs text-slate-400 mt-1">All clear! 🎉</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onResolve={onResolve} />
          ))
        )}
      </div>
    </div>
  )
}

function AlertCard({ alert, onResolve }: { alert: Alert; onResolve: (id: number) => void }) {
  const severityColors = {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200',
  }

  const severityIcons = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: '📊',
  }

  return (
    <div
      className={`border rounded-lg p-4 ${
        severityColors[alert.severity as keyof typeof severityColors]
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {severityIcons[alert.severity as keyof typeof severityIcons]}
          </span>
          <span className="text-xs font-semibold uppercase text-slate-600">
            {alert.severity}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
        </div>
      </div>

      <h3 className="font-medium text-slate-900 text-sm mb-2">{alert.title}</h3>
      <p className="text-xs text-slate-600 mb-3 line-clamp-3">{alert.message}</p>

      {alert.suggested_response && (
        <div className="bg-white/50 rounded p-2 mb-3">
          <p className="text-xs font-medium text-slate-700 mb-1">Suggested Response:</p>
          <p className="text-xs text-slate-600 italic">{alert.suggested_response}</p>
        </div>
      )}

      <button
        onClick={() => onResolve(alert.id)}
        className="w-full bg-slate-900 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
      >
        Mark as Resolved
      </button>
    </div>
  )
}
