from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from config import settings

logger = logging.getLogger(__name__)


class AlertService:
    def __init__(self):
        self.negative_threshold = settings.negative_threshold
        self.critical_threshold = settings.critical_threshold
        self.alert_window = timedelta(minutes=settings.alert_window_minutes)
    
    def should_create_alert(self, sentiment_score: float, recent_sentiments: List[float]) -> tuple[bool, str]:
        """
        Determine if an alert should be created based on sentiment
        Returns: (should_alert, severity)
        """
        # Critical: Single very negative mention
        if sentiment_score <= self.critical_threshold:
            return True, "critical"
        
        # High: Negative mention
        if sentiment_score <= self.negative_threshold:
            # Check if there's a trend of negative sentiment
            if len(recent_sentiments) >= 3:
                recent_avg = sum(recent_sentiments[-5:]) / min(len(recent_sentiments), 5)
                if recent_avg <= self.negative_threshold:
                    return True, "high"
            return True, "medium"
        
        # Medium: Multiple slightly negative mentions
        if len(recent_sentiments) >= 5:
            recent_avg = sum(recent_sentiments[-10:]) / min(len(recent_sentiments), 10)
            if recent_avg <= 0.4:
                return True, "low"
        
        return False, "none"
    
    def create_alert_message(
        self,
        severity: str,
        text: str,
        source: str,
        author: str,
        sentiment_score: float
    ) -> Dict:
        """Create alert message with context"""
        severity_emojis = {
            "critical": "🚨",
            "high": "⚠️",
            "medium": "⚡",
            "low": "📊"
        }
        
        title = f"{severity_emojis.get(severity, '📢')} {severity.upper()} Sentiment Alert"
        
        message = (
            f"Detected {severity} negative sentiment from {source}\n"
            f"Author: @{author}\n"
            f"Sentiment Score: {sentiment_score:.2f}\n"
            f"Message: {text[:200]}{'...' if len(text) > 200 else ''}"
        )
        
        return {
            "severity": severity,
            "title": title,
            "message": message
        }
    
    def calculate_sentiment_trend(self, sentiments: List[Dict]) -> Dict:
        """Calculate sentiment trends over time"""
        if not sentiments:
            return {
                "average": 0,
                "trend": "stable",
                "change_percent": 0
            }
        
        scores = [s['sentiment_score'] for s in sentiments]
        average = sum(scores) / len(scores)
        
        # Compare first half vs second half
        if len(scores) >= 4:
            mid = len(scores) // 2
            first_half_avg = sum(scores[:mid]) / mid
            second_half_avg = sum(scores[mid:]) / (len(scores) - mid)
            change = second_half_avg - first_half_avg
            change_percent = (change / abs(first_half_avg)) * 100 if first_half_avg != 0 else 0
            
            if change_percent > 10:
                trend = "improving"
            elif change_percent < -10:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"
            change_percent = 0
        
        return {
            "average": round(average, 3),
            "trend": trend,
            "change_percent": round(change_percent, 1)
        }
    
    def get_priority_score(self, sentiment_score: float, emotions: Dict) -> int:
        """Calculate priority score (0-100) for sorting alerts"""
        base_score = int((1 - (sentiment_score + 1) / 2) * 100)  # Convert -1..1 to 100..0
        
        # Boost priority for certain emotions
        emotion_boost = 0
        if emotions:
            if emotions.get('anger', 0) > 0.5:
                emotion_boost += 20
            if emotions.get('disgust', 0) > 0.5:
                emotion_boost += 15
            if emotions.get('fear', 0) > 0.5:
                emotion_boost += 10
        
        return min(base_score + emotion_boost, 100)


# Singleton instance
_alert_service = None

def get_alert_service() -> AlertService:
    global _alert_service
    if _alert_service is None:
        _alert_service = AlertService()
    return _alert_service
