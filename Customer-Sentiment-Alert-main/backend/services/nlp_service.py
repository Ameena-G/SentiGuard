from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from textblob import TextBlob
import torch
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class NLPService:
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        logger.info(f"Initializing NLP models on device: {'GPU' if self.device == 0 else 'CPU'}")
        
        # Primary sentiment model (fast and accurate)
        try:
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=self.device
            )
            logger.info("Loaded DistilBERT sentiment model")
        except Exception as e:
            logger.warning(f"Failed to load transformer model: {e}. Falling back to TextBlob only.")
            self.sentiment_analyzer = None
        
        # Emotion detection model
        try:
            self.emotion_analyzer = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                device=self.device,
                top_k=None
            )
            logger.info("Loaded emotion detection model")
        except Exception as e:
            logger.warning(f"Failed to load emotion model: {e}")
            self.emotion_analyzer = None
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment of text using multiple methods
        Returns: {
            'score': float (-1 to 1),
            'label': str (positive/negative/neutral),
            'confidence': float (0 to 1),
            'emotions': dict
        }
        """
        if not text or len(text.strip()) == 0:
            return self._empty_result()
        
        # Truncate very long texts
        text = text[:512]
        
        # Method 1: Transformer model
        transformer_score = None
        transformer_confidence = 0.5
        
        if self.sentiment_analyzer:
            try:
                result = self.sentiment_analyzer(text)[0]
                label = result['label'].lower()
                confidence = result['score']
                
                # Convert to -1 to 1 scale
                if label == 'positive':
                    transformer_score = confidence
                elif label == 'negative':
                    transformer_score = -confidence
                else:
                    transformer_score = 0
                
                transformer_confidence = confidence
            except Exception as e:
                logger.error(f"Transformer analysis failed: {e}")
        
        # Method 2: TextBlob (backup and validation)
        try:
            blob = TextBlob(text)
            textblob_score = blob.sentiment.polarity  # -1 to 1
        except Exception as e:
            logger.error(f"TextBlob analysis failed: {e}")
            textblob_score = 0
        
        # Combine scores (weighted average)
        if transformer_score is not None:
            final_score = 0.7 * transformer_score + 0.3 * textblob_score
            confidence = transformer_confidence
        else:
            final_score = textblob_score
            confidence = 0.6  # Lower confidence for TextBlob only
        
        # Determine label
        if final_score > 0.1:
            label = "positive"
        elif final_score < -0.1:
            label = "negative"
        else:
            label = "neutral"
        
        # Emotion analysis
        emotions = self._analyze_emotions(text)
        
        return {
            'score': round(final_score, 3),
            'label': label,
            'confidence': round(confidence, 3),
            'emotions': emotions
        }
    
    def _analyze_emotions(self, text: str) -> Dict[str, float]:
        """Detect emotions in text"""
        if not self.emotion_analyzer:
            return {}
        
        try:
            results = self.emotion_analyzer(text[:512])[0]
            emotions = {item['label']: round(item['score'], 3) for item in results}
            return emotions
        except Exception as e:
            logger.error(f"Emotion analysis failed: {e}")
            return {}
    
    def _empty_result(self) -> Dict:
        return {
            'score': 0.0,
            'label': 'neutral',
            'confidence': 0.0,
            'emotions': {}
        }
    
    def generate_response_suggestion(self, text: str, sentiment_score: float) -> str:
        """Generate suggested response based on sentiment"""
        if sentiment_score >= -0.3:
            return "Thank you for your feedback! We appreciate you taking the time to share your thoughts with us."
        
        # Negative sentiment - more empathetic response
        suggestions = [
            "We sincerely apologize for your experience. ",
            "We understand your frustration and we're here to help. ",
            "Thank you for bringing this to our attention. "
        ]
        
        # Check for specific issues
        text_lower = text.lower()
        if any(word in text_lower for word in ['bug', 'error', 'broken', 'not working']):
            suggestions.append("Our technical team is investigating this issue. We'll keep you updated on the progress.")
        elif any(word in text_lower for word in ['support', 'help', 'service']):
            suggestions.append("We'd like to connect you with our support team immediately to resolve this.")
        elif any(word in text_lower for word in ['refund', 'money', 'charge']):
            suggestions.append("We're reviewing your account and will process this request as a priority.")
        else:
            suggestions.append("We'd love to make this right. Could you please DM us with more details?")
        
        return "".join(suggestions)


# Singleton instance
_nlp_service = None

def get_nlp_service() -> NLPService:
    global _nlp_service
    if _nlp_service is None:
        _nlp_service = NLPService()
    return _nlp_service
