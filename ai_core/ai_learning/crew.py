import os
import asyncio

import re
import time
import ast
import ast
import json
from typing import Iterator, AsyncGenerator, Dict, Any

from crewai import Crew, Process
from crewai.task import TaskOutput

from db.pg_db import update_learning_plan, update_vocab_expansion
from db.subtype_manager import SubtypeManagerDB
from db.db_config import SessionLocal


from .agents import Agents
from .tasks import Tasks

class AILearningCrew:
    def __init__(self) -> None:
        # Init agents and tasks
        self.agents = Agents()
        self.tasks = Tasks()
    
    def end2end_plan_kickoff(self, inputs: Dict[str, Any]) -> str:
        """
        Run full end-to-end planning process
        """
        # Initialize Agents
        end2end_agent = self.agents.end2end_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        
        # Initialize Tasks
        end2end_task = self.tasks.end2end_tasks(end2end_agent)
        end2end_crew = Crew(
            name="End-to-End Learning Planning Crew",
            agents=[end2end_agent],
            tasks=[end2end_task],
            verbose=True,
        )
        # Kickoff the crew
        input_crew = {
            "self_assessment": inputs["self_assessment"],
            "user_goals": inputs["user_goals"],
            "period": inputs["period"],
            "weekly_study_hours": inputs["weekly_study_hours"],
            "language": inputs["language"],
        }
        end2end_result = end2end_crew.kickoff(inputs=input_crew)
        update_learning_plan(inputs["plan_id"], learning_plan=end2end_result.raw, status="Success")
        if not end2end_result:
            raise Exception("End-to-end crew failed to complete tasks")
        
        return end2end_result.raw
    
    def vocab_expansion_kickoff(self, inputs: Dict[str, Any]) -> str:
        """
        Run full end-to-end vocabulary expansion process
        """
        # Initialize Agents
        vocab_expansion_agent = self.agents.vocab_expansion_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        
        # Initialize Tasks
        vocab_expansion_task = self.tasks.vocab_expansion_task(vocab_expansion_agent)
        vocab_crew = Crew(
            name="End-to-End Vocab Expansion Crew",
            agents=[vocab_expansion_agent],
            tasks=[vocab_expansion_task],
            verbose=True,
        )
        # Kickoff the crew
        input_crew = {
            "user_word": inputs["user_word"],
            "language": inputs["language"],
        }
        vocab_result = vocab_crew.kickoff(inputs=input_crew)
        # update_vocab_expansion(vocab_id=inputs["vocab_id"], xml_response=vocab_result.raw, status="Success")
        if not vocab_result:
            raise Exception("Vocabulary expansion crew failed to complete tasks ")
        
        return vocab_result.raw
    
    def topik_question_kickoff(self, inputs: Dict[str, Any]) -> str:
        """
        Run full end-to-end planning process with dynamic subtype handling
        """
        # Initialize Agents
        topik_question_agent = self.agents.topik_question_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )

        session = SessionLocal()
        subtype_manager = SubtypeManagerDB(session)
        selected_subtype_info = subtype_manager.get_subtype_detail(inputs["type"], inputs["subtype"])
        subtype_context = subtype_manager.generate_subtype_context(selected_subtype_info) if selected_subtype_info else ""
        session.close()
        
        # Initialize Tasks
        preprocess_task = self.tasks.topik_preprocessing_task(topik_question_agent)
        topik_question_task = self.tasks.topik_question_task(
            topik_question_agent, 
            task_list=[preprocess_task],
            subtype_context=subtype_context
        )
        
        # Create and run crew
        end2end_crew = Crew(
            name="End-to-End TOPIK Question Generation Crew",
            agents=[topik_question_agent],
            tasks=[preprocess_task, topik_question_task],
            verbose=True,
        )
        
        end2end_result = end2end_crew.kickoff(inputs=inputs,)
        if not end2end_result:
            raise Exception("End-to-end crew failed to complete tasks")
        
        return end2end_result.raw