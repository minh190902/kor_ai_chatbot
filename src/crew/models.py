from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class UserProfile(BaseModel):
    name: str
    current_level: str
    target_level: str
    learning_goal: str
    available_hours_per_week: int
    preferred_learning_style: str
    experience: Optional[str] = ""
    target_completion_date: Optional[datetime] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    
class AssessmentResult(BaseModel):
    listening_score: int
    speaking_score: int
    reading_score: int
    writing_score: int
    overall_level: str
    strengths: List[str]
    weaknesses: List[str]
    
class LearningPlan(BaseModel):
    user_id: str
    plan_id: str
    weekly_schedule: Dict
    milestones: List[Dict]
    resources: List[Dict]
    estimated_completion: datetime
    created_at: datetime