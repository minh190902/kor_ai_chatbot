from typing import Optional, List, Dict
from pydantic import BaseModel

class BaseRequest(BaseModel):
    """Base request schema for all API requests."""
    user_id: str
    session_id: str
    
class ChatbotRequest(BaseRequest):
    """Request schema for chatbot interactions."""
    message: str
    history: List[Dict]