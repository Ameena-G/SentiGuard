import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  getSentiments: async (limit = 50, source?: string) => {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (source) params.append('source', source)
    const response = await apiClient.get(`/sentiments?${params}`)
    return response.data
  },

  getStats: async (hours = 24) => {
    const response = await apiClient.get(`/sentiments/stats?hours=${hours}`)
    return response.data
  },

  getAlerts: async (limit = 20, resolved?: boolean) => {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (resolved !== undefined) params.append('resolved', resolved.toString())
    const response = await apiClient.get(`/alerts?${params}`)
    return response.data
  },

  resolveAlert: async (alertId: number) => {
    const response = await apiClient.post(`/alerts/${alertId}/resolve`)
    return response.data
  },

  analyzeText: async (text: string, source = 'manual', author = 'anonymous') => {
    const response = await apiClient.post('/analyze', { text, source, author })
    return response.data
  },

  triggerCrisis: async () => {
    const response = await apiClient.post('/demo/crisis')
    return response.data
  },
}
