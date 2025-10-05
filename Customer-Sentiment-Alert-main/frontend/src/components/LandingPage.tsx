import { 
    Activity, 
    Zap, 
    TrendingUp, 
    MessageSquare, 
    BarChart3, 
    Bell,
    Download,
    Volume2,
    Brain,
    Shield,
    ArrowRight,
    CheckCircle2
  } from 'lucide-react'
  
  interface LandingPageProps {
    onEnterDashboard: () => void
  }
  
  export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* The Animated Background Blobs section has been removed */}
  
        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">SentiGuard</span>
              </div>
              <button
                onClick={onEnterDashboard}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          </header>
  
          {/* Hero Content */}
          <section className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-md backdrop-blur-sm border border-white/50">
                <Zap className="h-4 w-4" />
                <span>Real-time AI-Powered Sentiment Monitoring</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Never Miss a Customer
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Crisis
                </span>
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {' '}Again
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
                SentiGuard monitors customer sentiment across social media, reviews, and support tickets in real-time, 
                alerting your team before negative feedback becomes a PR disaster.
              </p>
  
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={onEnterDashboard}
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg flex items-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  <span>Try Live Demo</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
  
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">80%</div>
                  <div className="text-sm font-semibold text-slate-700 mt-2">Faster Response</div>
                </div>
                <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">94%</div>
                  <div className="text-sm font-semibold text-slate-700 mt-2">Accuracy</div>
                </div>
                <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm font-semibold text-slate-700 mt-2">Monitoring</div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Features Grid */}
          <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Powerful Features for Modern Teams
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to monitor, analyze, and respond to customer sentiment in real-time
              </p>
            </div>
  
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Brain className="h-8 w-8" />}
                title="AI-Powered Analysis"
                description="Advanced NLP with DistilBERT and RoBERTa models for 94% accurate sentiment classification and emotion detection"
                color="blue"
              />
              
              <FeatureCard
                icon={<Bell className="h-8 w-8" />}
                title="Smart Alerts"
                description="Severity-based alerting (Critical → Low) with AI-generated response suggestions for immediate action"
                color="red"
              />
              
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Real-time Dashboard"
                description="Live sentiment trends, interactive charts, and instant updates via WebSocket for up-to-the-second insights"
                color="green"
              />
              
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="Multi-Source Monitoring"
                description="Track sentiment across Twitter, Reddit, reviews, and support tickets from one unified dashboard"
                color="purple"
              />
              
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Word Cloud Analysis"
                description="Instantly identify what customers are complaining about with visual keyword extraction from negative feedback"
                color="orange"
              />
              
              <FeatureCard
                icon={<Volume2 className="h-8 w-8" />}
                title="Voice Alerts"
                description="Browser-based voice notifications for critical alerts - perfect for busy support teams on the go"
                color="indigo"
              />
              
              <FeatureCard
                icon={<Download className="h-8 w-8" />}
                title="Export Reports"
                description="Generate executive summaries, CSV exports, and JSON data for stakeholders with one click"
                color="teal"
              />
              
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Crisis Simulation"
                description="Demo mode with realistic data and crisis scenarios - perfect for training and presentations"
                color="yellow"
              />
              
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Production Ready"
                description="Scalable architecture with FastAPI backend, async processing, and enterprise-grade reliability"
                color="slate"
              />
            </div>
          </section>
  
          {/* How It Works */}
          <section className="container mx-auto px-4 py-20">
            <div className="backdrop-blur-sm bg-white/50 rounded-3xl p-12 border border-white/50">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-slate-600">
                  From data collection to actionable insights in milliseconds
                </p>
              </div>
  
              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <Step
                  number="1"
                  title="Monitor"
                  description="Collect mentions from social media, reviews, and support tickets"
                />
                <Step
                  number="2"
                  title="Analyze"
                  description="AI models process text for sentiment and emotion in real-time"
                />
                <Step
                  number="3"
                  title="Alert"
                  description="Smart alerts notify teams of negative sentiment spikes"
                />
                <Step
                  number="4"
                  title="Respond"
                  description="AI suggests responses for immediate customer engagement"
                />
              </div>
            </div>
          </section>
  
          {/* CTA Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Customer Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                See SentiGuard in action with our live demo dashboard
              </p>
              <button
                onClick={onEnterDashboard}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-lg flex items-center space-x-2 mx-auto shadow-lg"
              >
                <span>Launch Live Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </section>
  
          {/* Footer */}
          <footer className="container mx-auto px-4 py-8 text-center text-slate-600 border-t border-slate-200">
            <p>© 2025 SentiGuard. Built for Excellence.</p>
          </footer>
        </div>
      </div>
    )
  }
  
  interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
    color: string
  }
  
  function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      teal: 'bg-teal-100 text-teal-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      slate: 'bg-slate-100 text-slate-600',
    }
  
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
        <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    )
  }
  
  interface StepProps {
    number: string
    title: string
    description: string
  }
  
  function Step({ number, title, description }: StepProps) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl mb-4">
          {number}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    )
  }