from typing import List

from crewai import Task, Agent
from crewai.project import CrewBase, crew, task

from .schemas.response_model import (
    LearningPlan, 
    CurriculumPlanResponse, 
    TimelineResponse,
    ScheduleOptimizationResponse, 
    GoalAnalysisResponse
)

@CrewBase
class Tasks:
    tasks_config = 'config/tasks.yaml'
    
    def __init__(self) -> None:
        pass
    
    # ---------------------------------------------------------------------
    # Assessment Tasks
    # ---------------------------------------------------------------------
    def skill_assessment_task(self, agent: Agent) -> Task:
        """
        Korean skill assessment task (analyze test results, self-assessment, learning history)
        """
        return Task(
            config=self.tasks_config['skill_assessment_task'],
            agent=agent,
        )

    # ---------------------------------------------------------------------
    # Goal Analysis Task
    # ---------------------------------------------------------------------
    def goal_analysis_task(self, agent: Agent) -> Task:
        """
        Analyze and structure user goals using SMART criteria
        """
        return Task(
            config=self.tasks_config['goal_analysis_task'],
            agent=agent,
            output_file=f"output/goal_analysis_output.txt",
            output_pydantic=GoalAnalysisResponse
        )

    # ---------------------------------------------------------------------
    # Curriculum Planning Task
    # ---------------------------------------------------------------------
    def curriculum_planning_task(self, agent: Agent) -> Task:
        """
        Design personalized curriculum based on assessment and goals
        """
        return Task(
            config=self.tasks_config['curriculum_planning_task'],
            agent=agent,
            output_file=f"output/curriculum_planning_output.txt",
            output_pydantic=CurriculumPlanResponse
        )
        
    # ---------------------------------------------------------------------
    # Timeline Task
    # ---------------------------------------------------------------------
    def timeline_task(self, agent: Agent) -> Task:
        """
        Create a detailed timeline with phases and objectives
        """
        return Task(
            config=self.tasks_config['timeline_task'],
            agent=agent,
            output_file=f"output/timeline_response.txt",
            output_pydantic=TimelineResponse
        )

    # ---------------------------------------------------------------------
    # Schedule Optimization Task
    # ---------------------------------------------------------------------
    def schedule_optimization_task(self, agent: Agent) -> Task:
        """
        Optimize study schedule with Pomodoro and spaced repetition
        """
        return Task(
            config=self.tasks_config['schedule_optimization_task'],
            agent=agent,
            output_file=f"output/schedule_optimization_output.txt",
            output_pydantic=ScheduleOptimizationResponse
        )

    # ---------------------------------------------------------------------
    # Planning Task (Comprehensive Plan)
    # ---------------------------------------------------------------------
    def planning_task(self, agent: Agent) -> Task:
        """
        Integrate all components into a comprehensive, actionable learning plan
        """
        return Task(
            config=self.tasks_config['planning_task'],
            agent=agent,
            output_file=f"output/planning_output.txt",
            output_pydantic=LearningPlan
        )

    # ---------------------------------------------------------------------
    # XML Structure Task
    # ---------------------------------------------------------------------
    def xml_structure_task(self, agent: Agent) -> Task:
        """
        Convert the learning plan into a well-structured XML format
        """
        return Task(
            config=self.tasks_config['xml_structure_task'],
            agent=agent,
            output_file=f"output/xml_structure_output.xml",
        )