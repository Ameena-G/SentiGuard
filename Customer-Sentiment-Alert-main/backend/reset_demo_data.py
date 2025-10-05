"""
Reset and populate database with demo data distributed across 24 hours
Run this before your hackathon demo for best results
"""
import os
import sys
from datetime import datetime, timedelta
import random
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from config import settings
from models.database import init_db, get_session_maker, SentimentRecord, Alert
from services.nlp_service import get_nlp_service
from services.demo_data import get_demo_generator

def reset_and_populate():
    print("🚀 Resetting database and generating demo data...")
    
    # Initialize
    engine = init_db(settings.database_url)
    SessionLocal = get_session_maker(engine)
    db = SessionLocal()
    
    try:
        # Clear existing data
        print("📊 Clearing existing data...")
        db.query(Alert).delete()
        db.query(SentimentRecord).delete()
        db.commit()
        
        # Generate new data
        nlp_service = get_nlp_service()
        demo_generator = get_demo_generator()
        
        print("✨ Generating 50 sentiments distributed across 24 hours...")
        
        for i in range(50):
            # Generate mention with distributed timestamp
            mention = demo_generator.generate_demo_mention()
            
            # Analyze sentiment
            sentiment = nlp_service.analyze_sentiment(mention['text'])
            
            # Create record
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
            
            if (i + 1) % 10 == 0:
                print(f"  ✓ Generated {i + 1}/50 sentiments...")
        
        db.commit()
        print("✅ Successfully generated 50 sentiments!")
        print("📈 Data is now distributed across all 24 hours")
        print("\n🎉 Ready for hackathon demo!")
        print("\nNext steps:")
        print("1. Start backend: python app.py")
        print("2. Start frontend: npm run dev")
        print("3. Open http://localhost:3000")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_populate()
