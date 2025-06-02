from crewai import Agent
from crewai.project import CrewBase

from langchain_openai import ChatOpenAI
from config.settings import settings

class Agents:
    # agents_config = 'prompts/agents.yaml'
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.DEFAULT_MODEL,
            api_key=settings.OPENAI_API_KEY
        )

    def assessment_agent(self):
        return Agent(
            role="Korean Language Assessment Specialist",
            goal="Accurately assess Korean language proficiency and identify learning needs",
            backstory="""You are an expert Korean language teacher with 15+ years of experience 
            in assessing students' Korean proficiency. You specialize in TOPIK preparation and 
            can quickly identify students' strengths and weaknesses across all four skills: 
            listening, speaking, reading, and writing.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def planning_agent(self):
        return Agent(
            role="Korean Learning Path Designer",
            goal="Create personalized Korean learning plans that are achievable and effective",
            backstory="""You are a curriculum designer specializing in Korean language education.
            You have deep knowledge of Korean grammar progression, vocabulary building, and 
            cultural context. You excel at creating structured learning paths that adapt to 
            individual needs and goals.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def progress_tracker_agent(self):
        return Agent(
            role="Learning Progress Analyst",
            goal="Monitor and analyze learning progress to optimize study plans",
            backstory="""You are a data-driven education analyst who specializes in tracking 
            language learning progress. You excel at identifying patterns in learning behavior 
            and predicting potential roadblocks before they become problems.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def recommender_agent(self):
        return Agent(
            role="Korean Learning Resource Specialist",
            goal="Recommend the best Korean learning resources and activities",
            backstory="""You are a Korean learning resource expert who knows all the best 
            materials, apps, books, videos, and practice methods for Korean language learning. 
            You stay updated with the latest Korean learning trends and technologies.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
    def supervisor_agent(self):
        return Agent(
            role="Korean Learning System Coordinator",
            goal="Coordinate all agents to provide the best Korean learning experience",
            backstory="""You are the master coordinator of a Korean learning system. You 
            oversee the assessment, planning, tracking, and recommendation processes to ensure 
            they work together seamlessly for optimal learning outcomes.""",
            verbose=True,
            allow_delegation=True,
            llm=self.llm
        )