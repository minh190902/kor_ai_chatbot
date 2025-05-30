from crewai import Agent, Crew, Process
from langchain_openai import ChatOpenAI
from config.settings import settings
from .agents import Agents
from .tasks import Tasks

class KoreanAILearningPath:
    def __init__(self):
        # Khởi tạo các agent từ class LearningPathAI
        self.agents = Agents()
        self.tasks = Tasks()

    def run(self, user_info: dict):
        """Create the multi-agent crew"""
        ## Init Agents
        assessment_agent = self.agents.assessment_agent()
        planning_agent = self.agents.planning_agent()
        progress_agent = self.agents.progress_tracker_agent()
        recommender_agent = self.agents.recommender_agent()
        supervisor_agent = self.agents.supervisor_agent()
        
        ## Init Tasks
        assessment_task = self.tasks.assessment_task(assessment_agent)
        planning_task = self.tasks.planning_task(planning_agent)
        progress_task = self.tasks.progress_task(progress_agent)
        recommender_task = self.tasks.recommender_task(recommender_agent)
        supervisor_task = self.tasks.supervisor_task(supervisor_agent)
        
        crew = Crew(
            agents=[
                assessment_agent,
                planning_agent,
                progress_agent,
                recommender_agent,
                supervisor_agent
            ],
            tasks=[
                assessment_task,
                planning_task,
                progress_task,
                recommender_task,
                supervisor_task
            ],
            process=Process.sequential,
            verbose=True
        )
        result = crew.kickoff(inputs=user_info)
        return result
