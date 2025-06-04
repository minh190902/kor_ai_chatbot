from typing import Dict, Any

from langchain_openai import ChatOpenAI

from prompts import Prompts
from config.settings import settings

class KorLearningModels:
    def __init__(self, user_id: str, sesstion_id: str):
        self.user_id = user_id
        self.sesstion_id = sesstion_id
        
        # Initialize components
        self.llm = self._initialize_llm()
        self.prompt = Prompts()
    
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the language model"""
        return ChatOpenAI(
            model=settings.DEFAULT_MODEL,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY
        )
        
    def chat(self, message: str, history: list[Dict]) -> Dict[str, Any]:
        # Build prompt with history
        prompt = self.prompt.build_prompt(history, message)
        # Get response from LLM
        response_obj = self.llm.invoke(prompt)
        response = getattr(response_obj, "content", str(response_obj))

        return {
            "response": response,
            "success": True
        }
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get comprehensive learning statistics"""
        return self.progress_tracker.get_detailed_stats()