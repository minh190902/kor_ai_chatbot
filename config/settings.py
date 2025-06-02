"""
Configuration settings for Korean Learning Chatbot
"""
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

class Settings:
    """Application settings configuration"""
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database Configuration
    # DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:1234@localhost:5432/postgres")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:1234@db:5432/postgres")
    VECTOR_DB_PATH: str = os.getenv("VECTOR_DB_PATH", "./data/vector_db")

    # Model Configuration
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "gpt-4o-mini")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "1000"))
    
    # Korean Learning Configuration
    DEFAULT_LEVEL: str = os.getenv("DEFAULT_LEVEL", "beginner")
    SUPPORTED_LEVELS: list = ["beginner", "intermediate", "advanced"]
    # TOPIK Levels
    TOPIK_LEVELS = {
        "Beginner": {"level": 1, "description": "Basic Korean"},
        "Elementary": {"level": 2, "description": "Elementary Korean"},
        "Intermediate": {"level": 3, "description": "Intermediate Korean"},
        "Upper-Intermediate": {"level": 4, "description": "Upper-Intermediate Korean"},
        "Advanced": {"level": 5, "description": "Advanced Korean"},
        "Proficient": {"level": 6, "description": "Near-native Korean"}
    }
    
    # Learning Goals
    LEARNING_GOALS = [
        "TOPIK Test Preparation",
        "Business Korean",
        "Travel Korean", 
        "Academic Korean",
        "Conversational Korean",
        "Korean Drama/Media Understanding"
    ]
    
    # Memory Configuration
    MEMORY_BUFFER_SIZE: int = int(os.getenv("MEMORY_BUFFER_SIZE", "10"))
    SESSION_TIMEOUT: int = int(os.getenv("SESSION_TIMEOUT", "3600"))  # 1 hour
    
    # UI Configuration
    GRADIO_THEME: str = os.getenv("GRADIO_THEME", "default")
    GRADIO_PORT: int = int(os.getenv("GRADIO_PORT", "7860"))
    GRADIO_HOST: str = os.getenv("GRADIO_HOST", "127.0.0.1")
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "korean_chatbot.log")
    
    # Data Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    GRAMMAR_RULES_DIR: Path = DATA_DIR / "grammar_rules"
    VOCABULARY_DIR: Path = DATA_DIR / "vocabulary"
    CULTURE_DIR: Path = DATA_DIR / "cultural_context"
    
    @classmethod
    def validate_settings(cls) -> bool:
        """Validate required settings"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required")
        
        # Create necessary directories
        # cls.DATA_DIR.mkdir(exist_ok=True)
        # cls.GRAMMAR_RULES_DIR.mkdir(exist_ok=True)
        # cls.VOCABULARY_DIR.mkdir(exist_ok=True)
        # cls.CULTURE_DIR.mkdir(exist_ok=True)
        
        return True

settings = Settings()

# Validate settings on import
settings.validate_settings()