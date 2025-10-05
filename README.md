# SentiGuard - Real-Time Customer Sentiment Monitoring Platform

> **AI-Powered Sentiment Analysis with Crisis Detection & Voice Alerts**

**SentiGuard** is an enterprise-grade real-time sentiment monitoring platform that analyzes customer feedback from multiple sources (Twitter, Reddit, Reviews, Support) and provides instant alerts when negative sentiment spikes are detected. Built with AI/NLP, it helps businesses prevent PR crises before they escalate.

---

## Key Features

### 🎯 Core Capabilities
- **Real-Time Sentiment Analysis** - Instant AI-powered classification using DistilBERT
- **Multi-Source Monitoring** - Twitter, Reddit, Reviews, Support Tickets
- **Smart Alert System** - Threshold-based notifications with 3 severity levels
- **Voice Alerts** - Browser-based voice notifications for critical alerts
- **Live Dashboard** - WebSocket-powered real-time updates (no refresh needed)
- **Crisis Simulation** - Demo button to test alert system

### 📊 Advanced Analytics
- **Interactive Charts** - Sentiment trends, source breakdown, hourly patterns
- **Word Cloud** - Visual representation of trending topics
- **Emotion Detection** - Joy, anger, sadness, fear analysis
- **Historical Tracking** - 24-hour sentiment score visualization

### 🔍 Search & Filtering
- **Advanced Search** - Keyword-based search with filters
- **Source Filter** - Filter by Twitter, Reddit, Reviews, Support
- **Sentiment Filter** - Filter by Positive, Negative, Neutral
- **Date Range Filter** - Last 24h, 7 days, 30 days, All time

### 📈 Professional Features
- **Custom Queries** - Build and save complex search queries
- **Report Generation** - Export reports in PDF, CSV, JSON, Excel
- **Trends Analysis** - Time-based sentiment tracking with filters
- **User Management** - Role-based access control (Admin, Manager, Analyst, Viewer)
- **Alert Settings** - Configure email, Slack, voice notifications

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+

### 🔧 Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py

```

### 🔧 Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
### Tech Stack

## Frontend:

- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-time**: Socket.io Client

## Backend:

- **Framework**: FastAPI (Python)
- **NLP Models**:
       DistilBERT (Sentiment Analysis)
       Emotion Detection Model
- **Database**: SQLite 
- **Real-time**: Socket.io Server
- **API**: RESTful + WebSocket

### 📂 Folder Structure

```
sentiguard/
├── backend/
│   ├── app.py                 # Main FastAPI application
│   ├── models/
│   │   └── database.py        # Database models
│   ├── services/
│   │   ├── nlp_service.py     # NLP/AI service
│   │   ├── alert_service.py   # Alert detection
│   │   └── demo_data.py       # Demo data generator
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SearchPanel.tsx
│   │   │   ├── AnalyticsPanel.tsx
│   │   │   ├── ReportsPanel.tsx
│   │   │   ├── QueriesPanel.tsx
│   │   │   ├── TrendsPanel.tsx
│   │   │   ├── AlertSettingsPanel.tsx
│   │   │   ├── UsersPanel.tsx
│   │   │   └── SettingsPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   └── useVoiceAlerts.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

### License:

This project is licensed under the MIT License - see the LICENSE file for details.
