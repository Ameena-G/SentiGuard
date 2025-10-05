"""
Demo data generator for hackathon presentation
Simulates realistic customer feedback from various sources
"""
import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Set


class DemoDataGenerator:
    def __init__(self):
        # Track used author+text combinations globally
        self.used_pairs: Set[str] = set()
        
        self.demo_tweets = [
            # Negative
            "Your customer service is absolutely terrible. Been waiting for 3 hours with no response! #frustrated",
            "This product broke after just 2 days. What a waste of money! Not recommending to anyone.",
            "Worst experience ever. The app keeps crashing and support is ignoring my emails. 😡",
            "I want my money back! This is not what was advertised. Feeling scammed.",
            "How hard is it to fix a simple bug? This has been broken for weeks now!",
            "The delivery was 2 weeks late and the package arrived damaged. No apology from support.",
            "Tried to cancel my subscription but they keep charging me. This is fraud!",
            "The new update deleted all my data. Years of work gone! No backup option?!",
            "Your chatbot is useless. Just keeps giving me automated responses. Need a real person!",
            "Paid premium price for basic features. Competitors offer way more for less money.",
            
            # Neutral
            "Just tried the new feature. It's okay, nothing special but works as expected.",
            "Customer service responded after 24 hours. Issue is being looked into.",
            "The product does what it says. Could be better but it's acceptable.",
            "Received my order today. Packaging was fine, product seems decent.",
            "Interface takes some getting used to. Not intuitive but manageable once you learn it.",
            
            # Positive
            "Absolutely love this product! Best purchase I've made this year! ⭐⭐⭐⭐⭐",
            "Customer support was amazing! They resolved my issue in minutes. Thank you!",
            "This is exactly what I needed. Great quality and fast shipping! Highly recommend! 🎉",
            "Been using this for a month now and it's fantastic. Worth every penny!",
            "The team really listens to feedback. Just saw they added the feature I requested! 💯",
            "Impressed with the attention to detail. Every feature works flawlessly!",
            "Best investment for my business. ROI was positive within the first week!",
        ]
        
        self.demo_reddit_posts = [
            # Negative
            "Anyone else having issues with their service? Mine has been down all day and support is MIA.",
            "PSA: Don't waste your money on this. Quality is terrible and they won't refund.",
            "Really disappointed with the recent update. They removed features people actually used.",
            "The mobile app is a joke. Crashes every time I try to login. Desktop version barely works too.",
            "Been a customer for 3 years but switching to competitors. They don't value loyal users.",
            "Documentation is outdated and support team has no clue how their own product works.",
            
            # Neutral
            "Has anyone tried the new version? Curious about the changes before updating.",
            "Looking for alternatives. This works but wondering if there's something better.",
            "Mixed feelings about this. Some features are great, others need serious work.",
            
            # Positive
            "Just want to say this company has the best customer service I've experienced!",
            "This product changed my workflow completely. Can't imagine going back!",
            "Shoutout to the dev team - the latest update is incredible! 🚀",
            "Finally a company that actually cares about user feedback. Keep it up!",
        ]
        
        self.demo_reviews = [
            # Negative
            "1/5 stars. Product arrived damaged and customer service was unhelpful. Very disappointed.",
            "Would give 0 stars if I could. Complete waste of money. Save yourself the trouble.",
            "2/5 - Misleading marketing. Product doesn't do half of what they claim it does.",
            "1/5 - Terrible build quality. Feels cheap and flimsy. Returned it immediately.",
            "0/5 if possible. Hidden fees everywhere. Total cost was double what they advertised.",
            
            # Neutral  
            "3/5 stars. It's okay for the price. Nothing amazing but gets the job done.",
            "3/5 - Average product. Works but nothing special compared to competitors.",
            
            # Positive
            "5/5! Exceeded my expectations. Great quality and amazing support team!",
            "Best product in its category. Highly recommend to everyone! ⭐⭐⭐⭐⭐",
            "5/5 stars! Game changer for my daily routine. Can't live without it now!",
            "Perfect! Exactly as described. Fast shipping and excellent packaging too!",
        ]
        
        self.authors = [
            "john_doe", "sarah_smith", "tech_guru_99", "frustrated_customer",
            "happy_buyer", "review_master", "product_fan", "angry_user",
            "satisfied_client", "first_time_buyer", "loyal_customer", "skeptical_shopper"
        ]
    
    def generate_demo_mention(self) -> Dict:
        """Generate a single demo mention ensuring no author posts same text twice"""
        max_attempts = 100
        
        for _ in range(max_attempts):
            # Randomly select source and author
            source = random.choice(["twitter", "reddit", "review", "support"])
            author = random.choice(self.authors)
            
            # Get available texts for this source
            if source == "twitter":
                available_texts = self.demo_tweets
            elif source == "reddit":
                available_texts = self.demo_reddit_posts
            elif source == "review":
                available_texts = self.demo_reviews
            else:  # support
                available_texts = self.demo_tweets + self.demo_reddit_posts
            
            # Try to find a text this author hasn't used
            random.shuffle(available_texts := available_texts.copy())
            
            for text in available_texts:
                pair_key = f"{author}||{text}"
                
                if pair_key not in self.used_pairs:
                    # Found unused combination!
                    self.used_pairs.add(pair_key)
                    
                    # Auto-cleanup if too many stored (prevent memory issues)
                    if len(self.used_pairs) > 500:
                        # Keep only recent half
                        self.used_pairs = set(list(self.used_pairs)[-250:])
                    
                    # Generate truly unique ID
                    unique_id = str(uuid.uuid4())[:8]
                    source_id = f"{source}_{author}_{unique_id}"
                    
                    # Distribute timestamps across last 24 hours for better analytics
                    hours_ago = random.randint(0, 23)
                    minutes_ago = random.randint(0, 59)
                    created_time = datetime.utcnow() - timedelta(hours=hours_ago, minutes=minutes_ago)
                    
                    return {
                        "source": source,
                        "source_id": source_id,
                        "text": text,
                        "author": author,
                        "created_at": created_time
                    }
        
        # If we somehow exhaust all combinations, clear cache and retry
        self.used_pairs.clear()
        return self.generate_demo_mention()
    
    def generate_batch(self, count: int = 10) -> List[Dict]:
        """Generate multiple demo mentions"""
        return [self.generate_demo_mention() for _ in range(count)]
    
    def generate_crisis_scenario(self) -> List[Dict]:
        """Generate a crisis scenario with multiple negative mentions"""
        crisis_texts = [
            "URGENT: Major security breach! My account was compromised! 🚨",
            "This is unacceptable! Data leak affecting thousands of users!",
            "Everyone is reporting the same issue. This is a disaster!",
            "How is this company still in business? Absolute nightmare!",
            "Class action lawsuit incoming. This is criminal negligence!",
        ]
        
        mentions = []
        base_time = datetime.utcnow()
        used_authors = random.sample(self.authors, min(len(crisis_texts), len(self.authors)))
        
        for i, (text, author) in enumerate(zip(crisis_texts, used_authors)):
            source = random.choice(["twitter", "reddit"])
            unique_id = str(uuid.uuid4())[:8]
            source_id = f"{source}_crisis_{author}_{unique_id}"
            
            # Mark as used
            pair_key = f"{author}||{text}"
            self.used_pairs.add(pair_key)
            
            mentions.append({
                "source": source,
                "source_id": source_id,
                "text": text,
                "author": author,
                "created_at": base_time - timedelta(minutes=i*2)
            })
        
        return mentions


# Singleton instance
_demo_generator = None

def get_demo_generator() -> DemoDataGenerator:
    global _demo_generator
    if _demo_generator is None:
        _demo_generator = DemoDataGenerator()
    return _demo_generator
