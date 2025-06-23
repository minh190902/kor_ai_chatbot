from typing import Optional, List, Dict
from pydantic import BaseModel

class BaseRequest(BaseModel):
    """Base request schema for all API requests."""
    user_id: str
    model_provider: Optional[str] = "openai"
    model_id: Optional[str] = "gpt-4o-mini"
    temperature: Optional[float] = 0.7
    
class ChatbotRequest(BaseRequest):
    """Request schema for chatbot interactions."""
    conversation_id: str
    message: str
    language: str
    history: List[Dict]
    
class LearningRequest(BaseRequest):
    """Request schema for learning interactions."""
    self_assessment: str
    user_goals: str
    period: str
    weekly_study_hours: int
    language: str
    
class VocabExpansionRequest(BaseRequest):
    """Request schema for vocabulary expansion."""
    user_word: str
    language: str
    
class TopikQuestionGenRequest(BaseRequest):
    """Request schema for TOPIK generation."""
    level: str
    type: str
    subtype: str
    topic: str
    language: str