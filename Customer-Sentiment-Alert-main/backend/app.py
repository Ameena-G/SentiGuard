from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
import logging
import random
from datetime import datetime, timedelta
from typing import List, Dict
from sqlalchemy.orm import Session

from config import settings
from models.database import init_db, get_session_maker, SentimentRecord, Alert
from services.nlp_service import get_nlp_service
from services.alert_service import get_alert_service
from services.demo_data import get_demo_generator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
engine = init_db(settings.database_url)
SessionLocal = get_session_maker(engine)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")

manager = ConnectionManager()

# Background task for demo data generation
async def demo_data_task():
    """Generate demo data periodically for hackathon presentation"""
    nlp_service = get_nlp_service()
    alert_service = get_alert_service()
    demo_generator = get_demo_generator()
    
    await asyncio.sleep(5)  # Wait for startup
    
    while True:
        try:
            # Generate a demo mention every 10-30 seconds
            await asyncio.sleep(random.randint(10, 30))
            
            mention = demo_generator.generate_demo_mention()
            
            # Analyze sentiment
            sentiment = nlp_service.analyze_sentiment(mention['text'])
            
            # Save to database
            db = SessionLocal()
            try:
                # Check if this source_id already exists to prevent duplicates
                existing = db.query(SentimentRecord).filter(
                    SentimentRecord.source_id == mention['source_id']
                ).first()
                
                if existing:
                    db.close()
                    continue
                
                record = SentimentRecord(
                    source=mention['source'],
                    source_id=mention['source_id'],
                    text=mention['text'],
                    sentiment_score=sentiment['score'],
                    sentiment_label=sentiment['label'],
                    confidence=sentiment['confidence'],
                    emotions=json.dumps(sentiment['emotions']),
                    author=mention['author'],
                    created_at=mention['created_at']
                )
                db.add(record)
                db.commit()
                db.refresh(record)
                
                # Check if alert needed
                recent_records = db.query(SentimentRecord).filter(
                    SentimentRecord.created_at >= datetime.utcnow() - timedelta(minutes=15)
                ).all()
                recent_scores = [r.sentiment_score for r in recent_records]
                
                should_alert, severity = alert_service.should_create_alert(
                    sentiment['score'], recent_scores
                )
                
                if should_alert:
                    alert_msg = alert_service.create_alert_message(
                        severity, mention['text'], mention['source'],
                        mention['author'], sentiment['score']
                    )
                    
                    suggested_response = nlp_service.generate_response_suggestion(
                        mention['text'], sentiment['score']
                    )
                    
                    alert = Alert(
                        severity=severity,
                        title=alert_msg['title'],
                        message=alert_msg['message'],
                        sentiment_record_id=record.id,
                        suggested_response=suggested_response
                    )
                    db.add(alert)
                    db.commit()
                    db.refresh(alert)
                    
                    # Broadcast alert
                    await manager.broadcast({
                        'type': 'alert',
                        'data': alert.to_dict()
                    })
                
                # Broadcast new sentiment
                await manager.broadcast({
                    'type': 'sentiment',
                    'data': record.to_dict()
                })
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error in demo data task: {e}")

import random

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SentiGuard API...")
    
    # Start background task for demo data
    task = asyncio.create_task(demo_data_task())
    
    yield
    
    # Shutdown
    logger.info("Shutting down SentiGuard API...")
    task.cancel()

# Create FastAPI app
app = FastAPI(
    title="SentiGuard API",
    description="Real-time Customer Sentiment Monitoring System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# REST API Endpoints

@app.get("/")
async def root():
    return {
        "message": "SentiGuard API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/sentiments")
async def get_sentiments(
    limit: int = 50,
    source: str = None,
    db: Session = Depends(get_db)
):
    """Get recent sentiment records"""
    query = db.query(SentimentRecord).order_by(SentimentRecord.created_at.desc())
    
    if source:
        query = query.filter(SentimentRecord.source == source)
    
    records = query.limit(limit).all()
    return [record.to_dict() for record in records]

@app.get("/api/sentiments/stats")
async def get_sentiment_stats(
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Get sentiment statistics"""
    since = datetime.utcnow() - timedelta(hours=hours)
    records = db.query(SentimentRecord).filter(
        SentimentRecord.created_at >= since
    ).all()
    
    if not records:
        return {
            "total": 0,
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "average_score": 0,
            "by_source": {}
        }
    
    total = len(records)
    positive = sum(1 for r in records if r.sentiment_label == "positive")
    negative = sum(1 for r in records if r.sentiment_label == "negative")
    neutral = sum(1 for r in records if r.sentiment_label == "neutral")
    avg_score = sum(r.sentiment_score for r in records) / total
    
    # By source
    by_source = {}
    for record in records:
        if record.source not in by_source:
            by_source[record.source] = {"count": 0, "avg_score": 0, "scores": []}
        by_source[record.source]["count"] += 1
        by_source[record.source]["scores"].append(record.sentiment_score)
    
    for source in by_source:
        scores = by_source[source]["scores"]
        by_source[source]["avg_score"] = sum(scores) / len(scores)
        del by_source[source]["scores"]
    
    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "average_score": round(avg_score, 3),
        "by_source": by_source
    }

@app.get("/api/alerts")
async def get_alerts(
    limit: int = 20,
    resolved: bool = None,
    db: Session = Depends(get_db)
):
    """Get alerts"""
    query = db.query(Alert).order_by(Alert.created_at.desc())
    
    if resolved is not None:
        query = query.filter(Alert.is_resolved == (1 if resolved else 0))
    
    alerts = query.limit(limit).all()
    return [alert.to_dict() for alert in alerts]

@app.post("/api/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    """Mark an alert as resolved"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_resolved = 1
    alert.resolved_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Alert resolved", "alert": alert.to_dict()}

@app.post("/api/analyze")
async def analyze_text(data: dict, db: Session = Depends(get_db)):
    """Manually analyze text"""
    text = data.get("text", "")
    source = data.get("source", "manual")
    author = data.get("author", "anonymous")
    
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    nlp_service = get_nlp_service()
    sentiment = nlp_service.analyze_sentiment(text)
    
    # Save to database
    record = SentimentRecord(
        source=source,
        source_id=f"{source}_{datetime.utcnow().timestamp()}",
        text=text,
        sentiment_score=sentiment['score'],
        sentiment_label=sentiment['label'],
        confidence=sentiment['confidence'],
        emotions=json.dumps(sentiment['emotions']),
        author=author
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    # Broadcast
    await manager.broadcast({
        'type': 'sentiment',
        'data': record.to_dict()
    })
    
    return record.to_dict()

@app.post("/api/demo/crisis")
async def trigger_crisis_demo(db: Session = Depends(get_db)):
    """Trigger a crisis scenario for demo purposes"""
    demo_generator = get_demo_generator()
    nlp_service = get_nlp_service()
    alert_service = get_alert_service()
    
    crisis_mentions = demo_generator.generate_crisis_scenario()
    results = []
    
    for mention in crisis_mentions:
        sentiment = nlp_service.analyze_sentiment(mention['text'])
        
        record = SentimentRecord(
            source=mention['source'],
            source_id=f"{mention['source']}_{datetime.utcnow().timestamp()}_{random.random()}",
            text=mention['text'],
            sentiment_score=sentiment['score'],
            sentiment_label=sentiment['label'],
            confidence=sentiment['confidence'],
            emotions=json.dumps(sentiment['emotions']),
            author=mention['author'],
            created_at=mention['created_at']
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        # Create alert
        alert_msg = alert_service.create_alert_message(
            "critical", mention['text'], mention['source'],
            mention['author'], sentiment['score']
        )
        
        alert = Alert(
            severity="critical",
            title=alert_msg['title'],
            message=alert_msg['message'],
            sentiment_record_id=record.id,
            suggested_response=nlp_service.generate_response_suggestion(
                mention['text'], sentiment['score']
            )
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        
        # Broadcast
        await manager.broadcast({'type': 'sentiment', 'data': record.to_dict()})
        await manager.broadcast({'type': 'alert', 'data': alert.to_dict()})
        
        results.append(record.to_dict())
        
        await asyncio.sleep(0.5)  # Stagger the broadcasts
    
    return {"message": "Crisis scenario triggered", "count": len(results)}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back for heartbeat
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
