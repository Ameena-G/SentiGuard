from sqlalchemy import Column, Integer, String, Float, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()


class SentimentRecord(Base):
    __tablename__ = "sentiment_records"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), index=True)  # twitter, reddit, review, support
    source_id = Column(String(200), unique=True, index=True)
    text = Column(Text)
    sentiment_score = Column(Float)  # -1 to 1
    sentiment_label = Column(String(20))  # positive, negative, neutral
    confidence = Column(Float)
    emotions = Column(Text)  # JSON string of emotions
    author = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    processed_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "source_id": self.source_id,
            "text": self.text,
            "sentiment_score": self.sentiment_score,
            "sentiment_label": self.sentiment_label,
            "confidence": self.confidence,
            "emotions": json.loads(self.emotions) if self.emotions else {},
            "author": self.author,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "processed_at": self.processed_at.isoformat() if self.processed_at else None,
        }


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String(20))  # low, medium, high, critical
    title = Column(String(200))
    message = Column(Text)
    sentiment_record_id = Column(Integer, index=True)
    suggested_response = Column(Text)
    is_resolved = Column(Integer, default=0)  # 0 = false, 1 = true
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "severity": self.severity,
            "title": self.title,
            "message": self.message,
            "sentiment_record_id": self.sentiment_record_id,
            "suggested_response": self.suggested_response,
            "is_resolved": bool(self.is_resolved),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
        }


# Database initialization
def init_db(database_url: str):
    engine = create_engine(
        database_url.replace("+aiosqlite", ""),
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {}
    )
    Base.metadata.create_all(bind=engine)
    return engine


def get_session_maker(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)
