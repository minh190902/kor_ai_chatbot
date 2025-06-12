from crewai import Agent, LLM
from crewai.project import CrewBase, agent, crew, task

from langchain_openai import ChatOpenAI

from model_provider_manager import provider_config, llm_key_manager

@CrewBase
class Agents:
    agents_config = 'config/agents.yaml'
    
    def __init__(self) -> None:
        pass

    def get_client(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ):
        """
        Initialize client using ChatOpenAI
        """
        config = provider_config.get_provider_config(
            provider=model_provider,
            secret_manager=llm_key_manager
        )
        model_id = model_id if model_id else config["default_model"]
        
        client = ChatOpenAI(
            model=model_id,
            base_url=config["base_url"],
            api_key=config["api_key"],
            **{k: v for k, v in kwargs.items() if k not in ["model"]}
        )
        return client
    
    def get_llm(
        self, 
        model_provider: str = "openai", 
        model_id: str = None, 
        temperature: int = 0.5, 
        repeat_penalty: int = 1.1,
        **kwargs
    ) -> LLM:
        """
        Initialize llm using LLM                                                                                                                                                                 
        Params:
        - model_id: ID for a specific LLM
        """
        config = provider_config.get_provider_config(
            provider=model_provider,
            secret_manager=llm_key_manager
        )
        model_id = model_id if model_id else config["default_model"]
        
        return LLM(
            model=f"{model_provider}/{model_id}",  # Model ID
            api_key=config["api_key"],
            **{k: v for k, v in kwargs.items() if k not in ["model"]},
        )
        
    # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    #                                                           Initial Assessment
    # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    def skill_assessment_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize assessment agent
        """        
        return Agent(
            config=self.agents_config["skill_assessment_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
    
    def goal_analysis_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize goal analysis agent
        """
        return Agent(
            config=self.agents_config["goal_analysis_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
        
    def timeline_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize timeline agent
        """
        return Agent(
            config=self.agents_config["timeline_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
        
    # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    #                                                           Planning Agents
    # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    def curriculum_planning_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize planning agent
        """
        return Agent(
            config=self.agents_config["curriculum_planning_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
    
    def schedule_optimization_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize schedule optimization agent
        """
        return Agent(
            config=self.agents_config["schedule_optimization_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
        
    def planning_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize planning agent
        """
        return Agent(
            config=self.agents_config["planning_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
    
    def xml_structure_agent(
        self,
        model_provider: str = "openai",
        model_id: str = None,
        **kwargs
    ) -> Agent:
        """
        Initialize XML structure agent
        """
        return Agent(
            config=self.agents_config["xml_structure_agent"],
            llm=self.get_llm(
                model_provider, 
                model_id, 
                **kwargs
            ),
        )
        
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # #                                                           Progress Tracker Agents
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # def progress_tracker_agent(
    #     self,
    #     model_provider: str = "openai",
    #     model_id: str = None,
    #     **kwargs
    # ) -> Agent:
    #     """
    #     Initialize progress agent
    #     """
    #     return Agent(
    #         config=self.agents_config["progress_tracker_agent"],
    #         llm=self.get_llm(
    #             model_provider, 
    #             model_id, 
    #             **kwargs
    #         ),
    #     )
        
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # #                                                           Recommendation Agents
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # def recommendation_agent(
    #     self,
    #     model_provider: str = "openai",
    #     model_id: str = None,
    #     **kwargs
    # ) -> Agent:
    #     """
    #     Initialize recommendation agent
    #     """
    #     return Agent(
    #         config=self.agents_config["recommendation_agent"],
    #         llm=self.get_llm(
    #             model_provider, 
    #             model_id, 
    #             **kwargs
    #         ),
    #     )
        
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # #                                                           Calendar Agents
    # # ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    # def calendar_agent(
    #     self,
    #     model_provider: str = "openai",
    #     model_id: str = None,
    #     **kwargs
    # ) -> Agent:
    #     """
    #     Initialize calendar agent
    #     """
    #     return Agent(
    #         config=self.agents_config["calendar_agent"],
    #         llm=self.get_llm(
    #             model_provider, 
    #             model_id, 
    #             **kwargs
    #         ),
    #     )