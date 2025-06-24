from typing import List

from crewai import Task, Agent
from crewai.project import CrewBase, crew, task

from .schemas.response_model import (
    PreInput
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
    # Learning Plan Tasks
    # ---------------------------------------------------------------------    
    def end2end_tasks(self, agent: Agent) -> Task:
        """
        Initialize all tasks for the end-to-end learning process
        """
        return Task(
            config=self.tasks_config['end2end_task'],
            agent=agent,
            output_file=f"output/end2end_tasks.xml",
        )
    
    # ---------------------------------------------------------------------
    # Vocab Expansion Tasks
    # ---------------------------------------------------------------------
    def vocab_expansion_task(self, agent: Agent) -> Task:
        """
        Example task that can be customized
        """
        return Task(
            config=self.tasks_config['vocab_expansion_task'],
            agent=agent,
            output_file=f"output/vocab.xml"
        )
        
    # ---------------------------------------------------------------------
    # TOPIK generation tasks
    # ---------------------------------------------------------------------
    def topik_preprocessing_task(self, agent: Agent) -> Task:
        """
        Example task that can be customized
        """        
        return Task(
            config=self.tasks_config['topik_preprocessing_task'],
            agent=agent,
            output_pydantic=PreInput
        )
    
    def topik_question_task(self, agent: Agent, task_list: list[Task]=None, subtype_context: str = "") -> Task:
        """
        Question generation task with dynamic subtype context
        """
        # Create base task config
        base_config = self.tasks_config['topik_question_task'].copy()
        
        # Inject subtype-specific context into the description
        if subtype_context:
            # Insert subtype context after the guidelines section
            description_parts = base_config['description'].split('# [XML STRUCTURE DEFINITION]')
            enhanced_description = (
                description_parts[0] + 
                f"\n\n{subtype_context}\n\n" +
                '# [XML STRUCTURE DEFINITION]' + 
                description_parts[1] if len(description_parts) > 1 else ""
            )
            base_config['description'] = enhanced_description
        
        return Task(
            config=base_config,
            agent=agent,
            context=task_list,
            output_file=f"output/topik.xml"
        )