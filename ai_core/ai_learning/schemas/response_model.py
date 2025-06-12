from typing import List

from pydantic import BaseModel, Field

# --------------------------------------
# --- Goal Analysis Response Model ---
class GoalSubItem(BaseModel):
    sub_goal: str = Field(..., description="A specific actionable sub-goal")

class GoalHierarchyItem(BaseModel):
    goal: str = Field(..., description="Main goal")
    priority: float = Field(..., description="Priority weight (max 1.0)")
    feasibility: str = Field(..., description="Feasibility note for the goal")
    sub_goals: List[str] = Field(..., description="List of actionable sub-goals")

class GoalAnalysisResponse(BaseModel):
    goal_hierarchy: List[GoalHierarchyItem] = Field(..., description="List of main goals with details")
    feedback: str = Field(..., description="Feedback and suggestions for clarification or adjustment")


# --------------------------------------
# --- Curriculum Plan Response Model ---
class CurriculumItem(BaseModel):
    topic: str = Field(..., description="Curriculum topic")
    sequence: int = Field(..., description="Order in the curriculum")
    dependencies: List[str] = Field(..., description="List of prerequisite topics")

class CurriculumPlanResponse(BaseModel):
    curriculum: List[CurriculumItem] = Field(..., description="List of curriculum topics with dependencies and order")
    milestones: List[str] = Field(..., description="List of curriculum milestones")
    

# --------------------------------------
# --- Schedule Optimization Response Model ---
class DailyScheduleItem(BaseModel):
    day: str = Field(..., description="Day of the week")
    time: str = Field(..., description="Duration for the day's study")
    focus: str = Field(..., description="Focus area for the day")
    activities: List[str] = Field(..., description="List of activities for the day")

class ScheduleOptimizationResponse(BaseModel):
    schedule: List[DailyScheduleItem] = Field(..., description="Schedule details including daily and weekly summary")
    pomodoro_plan: List[dict] = Field(..., description="List of Pomodoro blocks")
    spaced_repetition_plan: List[dict] = Field(..., description="List of spaced repetition blocks")
    cognitive_load_notes: str = Field(..., description="Notes on cognitive load balancing")


# --------------------------------------
# --- Timeline Phase Model ---
class TimelinePhase(BaseModel):
    name: str = Field(..., description="Name of the phase, include period")
    objective: str = Field(..., description="Objective of the phase")
    plan: List[str] = Field(..., description="Plan items for the phase")
    
class TimelineResponse(BaseModel):
    phases: List[TimelinePhase] = Field(..., description="List of timeline phases with objectives and plans")

# --------------------------------------
# --- Learning Plan Response Model ---
class WeeklyPlanItem(BaseModel):
    name: str = Field(..., description="Day of the week")
    time: str = Field(..., description="Duration for the day's study")
    focus: str = Field(..., description="Focus area for the day")
    activity: List[str] = Field(..., description="List of activities for the day")

class LearningStrategies(BaseModel):
    listening: List[str] = Field(..., description="Strategies for listening skill")
    reading: List[str] = Field(..., description="Strategies for reading skill")
    writing: List[str] = Field(..., description="Strategies for writing skill")
    speaking: List[str] = Field(..., description="Strategies for speaking skill")
    vocabulary: List[str] = Field(..., description="Strategies for vocabulary")
    grammar: List[str] = Field(..., description="Strategies for grammar")

class RecommendedResources(BaseModel):
    textbooks: List[str] = Field(..., description="Recommended textbooks")
    online_resources: List[str] = Field(..., description="Recommended online resources")
    apps: List[str] = Field(..., description="Recommended apps")
    practice_tests: List[str] = Field(..., description="Recommended practice tests")

class LearningPlan(BaseModel):
    title: str = Field(..., description="Title of the learning plan")
    overview: str = Field(..., description="Overview of the learning plan")
    weekly_plan: List[WeeklyPlanItem] = Field(..., description="Weekly plan items")
    learning_strategies: LearningStrategies = Field(..., description="Learning strategies for each skill")
    recommended_resources: RecommendedResources = Field(..., description="Recommended resources")
    timeline: List[TimelinePhase] = Field(..., description="Timeline phases")
    tips: List[str] = Field(..., description="Actionable tips for success")

