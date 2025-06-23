from typing import Optional, List, Dict
from pydantic import BaseModel

class BaseResponse(BaseModel):
    """Base respponse scheme for all API responses."""
    user_id: str
    status: Optional[str] = "Success"
    
class ChatbotResponse(BaseResponse):
    """Response scheme for chatbot interactions"""
    conversation_id: str
    message: str
    history: List[Dict]
    
class LearningResponse(BaseResponse):
    """Response scheme for learning interactions"""
    learning_plan: str
    
class VocabExpansionResponse(BaseResponse):
    """Response scheme for vocabulary expansion"""
    vocab_expansion: str
    
class TopikQuestionGenResponse(BaseResponse):
    """Response scheme for TOPIK generation"""
    topik_questions: str
   