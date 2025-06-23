from typing import List, Optional

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


# --------------------------------------
# --- Study Plan Response Model ---
class ActivityItem(BaseModel):
    item: str = Field(..., description="Describes each individual activity")

class DayPlan(BaseModel):
    name: str = Field(..., description="Day of the week", alias="name")
    time: str = Field(..., description="Duration for the day's study", alias="time")
    focus: str = Field(..., description="Core learning objective for that day")
    activity: List[ActivityItem] = Field(..., description="List of activities for the day")

class SkillStrategy(BaseModel):
    item: List[str] = Field(..., description="Describes each specific strategy for that skill")

class LearningStrategies(BaseModel):
    listening: SkillStrategy = Field(..., description="Strategies for listening skill")
    reading: SkillStrategy = Field(..., description="Strategies for reading skill")
    writing: SkillStrategy = Field(..., description="Strategies for writing skill")
    speaking: SkillStrategy = Field(..., description="Strategies for speaking skill")
    vocabulary: SkillStrategy = Field(..., description="Strategies for vocabulary")
    grammar: SkillStrategy = Field(..., description="Strategies for grammar")

class ResourceCategory(BaseModel):
    item: List[str] = Field(..., description="Describes each individual resource")

class RecommendedResources(BaseModel):
    textbooks: ResourceCategory = Field(..., description="Recommended textbooks")
    online_resources: ResourceCategory = Field(..., description="Recommended online resources")
    apps: ResourceCategory = Field(..., description="Recommended apps")
    practice_tests: ResourceCategory = Field(..., description="Recommended practice tests")

class PhasePlan(BaseModel):
    item: List[str] = Field(..., description="Describes each individual plan item")

class TimelinePhase(BaseModel):
    name: str = Field(..., description="Name of the phase (period)", alias="name")
    objective: str = Field(..., description="Objective for that phase")
    plan: PhasePlan = Field(..., description="Detailed plan for that phase")

class LearningPlanResponse(BaseModel):
    title: str = Field(..., description="Overall title of the study plan")
    overview: str = Field(..., description="General overview of the study plan")
    weekly_plan: List[DayPlan] = Field(..., description="Weekly study schedule")
    learning_strategies: LearningStrategies = Field(..., description="Learning strategies by skill area")
    recommended_resources: RecommendedResources = Field(..., description="Recommended learning materials")
    timeline: List[TimelinePhase] = Field(..., description="Milestones and goals over a period")
    tips: List[str] = Field(..., description="Additional advice for successful learning")

# --------------------------------------
# --- Vocabulary Expansion Response Model ---
class RequestInfo(BaseModel):
    original_input: str = Field(..., description="User's raw input")
    corrected_input: Optional[str] = Field(None, description="Corrected input if typo was found")

class ExampleItem(BaseModel):
    ko: str = Field(..., description="Example sentence in Korean")
    translation: Optional[str] = Field(None, description="Translation of the example sentence")

class WordInfo(BaseModel):
    level: str = Field(..., description="Word level: Beginner, Intermediate, Advanced")
    type: str = Field(..., description="Part of speech (품사)")
    word: str = Field(..., description="Standard form of the word")
    pronunciation: Optional[str] = Field(None, description="Phonetic pronunciation")
    definition_ko: str = Field(..., alias="definition_ko", description="Definition in Korean")
    definition_user: Optional[str] = Field(None, description="Definition in user's language")
    synonyms: Optional[List[str]] = Field(None, description="List of synonyms")
    antonyms: Optional[List[str]] = Field(None, description="List of antonyms")
    examples: List[ExampleItem] = Field(..., description="List of example sentences")
    etymology: Optional[str] = Field(None, description="Etymology or Hanja origin")
    related_expressions: Optional[List[str]] = Field(None, description="Related idioms or expressions")

class VocabularyExpansion(BaseModel):
    request: RequestInfo = Field(..., description="Request information")
    word_info: WordInfo = Field(..., description="Detailed word information")
    
    
# --------------------------------------
# --- TOPIK Preprocessing Input Model ---
class PreInput(BaseModel):
    level: str = Field(..., description="TOPIK Level(e.g., '초급')")
    type: str = Field(..., description="TOPIK type (e.g., '읽기', '문법 등')")
    subtype: Optional[str] = Field(None, description="TOPIK subtype (optional)")
    topic: Optional[str] = Field(None, description="Specific topic for the question (optional)")
    topic_details: Optional[str] = Field(None, description="Detailed topic description (optional)")

