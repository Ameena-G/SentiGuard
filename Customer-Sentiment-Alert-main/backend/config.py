from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    twitter_bearer_token: Optional[str] = None
    twitter_api_key: Optional[str] = None
    twitter_api_secret: Optional[str] = None
    
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    reddit_user_agent: str = "SentiGuard/1.0"
    
    # Application
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Alert Thresholds
    negative_threshold: float = 0.3
    critical_threshold: float = 0.2
    alert_window_minutes: int = 15
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./sentiguard.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
