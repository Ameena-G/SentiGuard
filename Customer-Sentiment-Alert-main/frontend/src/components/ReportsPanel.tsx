import { FileText, Download, Calendar, Filter, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function ReportsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [reportType, setReportType] = useState('summary')
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Trigger download
      const reportName = `${reportType}_report_${selectedPeriod}.${format}`
      console.log(`Generating report: ${reportName}`)
      
      // Create a mock download
      const element = document.createElement('a')
      const content = `SentiGuard Report\nType: ${reportType}\nPeriod: ${selectedPeriod}\nGenerated: ${new Date().toISOString()}`
      const file = new Blob([content], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = reportName
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 2000)
  }

  const handleDownloadReport = (reportName: string) => {
    // Simulate download
    const element = document.createElement('a')
    const content = `SentiGuard Report: ${reportName}\nDownloaded: ${new Date().toISOString()}`
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = reportName.replace(/\s+/g, '_') + '.pdf'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const reports = [
    {
      id: 1,
      name: 'Weekly Sentiment Summary',
      description: 'Comprehensive overview of sentiment trends over the past week',
      date: '2025-10-03',
      type: 'Summary',
      status: 'Ready'
    },
    {
      id: 2,
      name: 'Critical Alerts Report',
      description: 'All critical alerts and their resolution status',
      date: '2025-10-02',
      type: 'Alerts',
      status: 'Ready'
    },
    {
      id: 3,
      name: 'Source Performance Analysis',
      description: 'Breakdown of sentiment by source (Twitter, Reddit, etc.)',
      date: '2025-10-01',
      type: 'Analytics',
      status: 'Ready'
    },
    {
      id: 4,
      name: 'Monthly Executive Summary',
      description: 'High-level overview for stakeholders',
      date: '2025-09-30',
      type: 'Executive',
      status: 'Ready'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Reports</h2>
        <p className="text-slate-600">Generate and download sentiment analysis reports</p>
      </div>

      {/* Generate New Report */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Analytics</option>
              <option value="alerts">Alert History</option>
              <option value="executive">Executive Summary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        </div>
        
        {showSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Report generated successfully!</span>
          </div>
        )}
        
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`mt-4 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
            isGenerating 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Reports</h3>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-slate-900">{report.name}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.date}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 rounded">
                      {report.type}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadReport(report.name)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
