from typing import Optional, List, Dict
from pydantic import BaseModel

class BaseResponse(BaseModel):
    """Base respponse scheme for all API responses."""
    user_id: str
    session_id: str
    status: Optional[str] = "Success"
    
class ChatbotResponse(BaseResponse):
    """Response scheme for chatbot interactions"""
    message: str
    history: List[Dict]
   