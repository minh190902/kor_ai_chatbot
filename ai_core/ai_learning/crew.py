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

from .agents import Agents
from .tasks import Tasks

class AILearningCrew:
    def __init__(self) -> None:
        # Init agents and tasks
        self.agents = Agents()
        self.tasks = Tasks()

    def planning_kickoff(self, inputs: Dict[str, Any]):
        """
        Kickoff full multi-agent planning process
        """
        # Initialize Agents
        goal_analysis_agent = self.agents.goal_analysis_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        curriculum_planning_agent = self.agents.curriculum_planning_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        timeline_agent = self.agents.timeline_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        schedule_optimization_agent = self.agents.schedule_optimization_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        planning_agent = self.agents.planning_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )
        xml_structure_agent = self.agents.xml_structure_agent(
            model_provider=inputs["model_provider"],
            model_id=inputs["model_id"],
            temperature=0,
        )

        # Initialize Tasks
        goal_analysis_task = self.tasks.goal_analysis_task(goal_analysis_agent)
        curriculum_planning_task = self.tasks.curriculum_planning_task(curriculum_planning_agent)
        schedule_optimization_task = self.tasks.schedule_optimization_task(schedule_optimization_agent)
        timeline_task = self.tasks.timeline_task(timeline_agent)
        planning_task = self.tasks.planning_task(planning_agent)
        xml_structure_task = self.tasks.xml_structure_task(xml_structure_agent)

        assessment_crew = Crew(
            name="Goal Analysis and Curriculum Planning Crew",
            agents=[goal_analysis_agent, curriculum_planning_agent],
            tasks=[goal_analysis_task, curriculum_planning_task],
            verbose=True,
        )
        
        planning_crew = Crew(
            name="Schedule Planning Crew",
            agents=[schedule_optimization_agent],
            tasks=[schedule_optimization_task],
            verbose=True,
        )
        
        timeline_crew = Crew(
            name="Timeline Crew",
            agents=[timeline_agent],
            tasks=[timeline_task],
            verbose=True,
        )
        
        exec_crew = Crew(
            name="Korean AI Learning Crew",
            agents=[
                planning_agent,
                xml_structure_agent,
            ],
            tasks=[
                planning_task,
                xml_structure_task,
            ],
            verbose=True,
        )

        assessment_result = assessment_crew.kickoff(inputs=inputs)
        if not assessment_result:
            raise Exception("Assessment crew failed to complete tasks")

        planning_inputs = {
            "weekly_study_hours": inputs["weekly_study_hours"],
            "period": inputs["period"],
            "curriculum_plan": curriculum_planning_task.output.raw,
        }
        async def run_async_planning_crews():
            """Parallel run for followup question and structure planning"""
            plan = planning_crew.kickoff_async(inputs=planning_inputs)
            timeline = timeline_crew.kickoff_async(inputs=planning_inputs)
            results = await asyncio.gather(timeline, plan)
            return results
        
        first_results = asyncio.run(run_async_planning_crews())

        exec_inputs = {
            "curriculum_plan": curriculum_planning_task.output.raw,
            "schedule_plan": schedule_optimization_task.output.raw,
            "timeline_plan": timeline_task.output.raw,
        }
        exec_result = exec_crew.kickoff(inputs=exec_inputs)
        if not exec_result:
            raise Exception("Execution crew failed to complete tasks")

        return exec_result.raw
    
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