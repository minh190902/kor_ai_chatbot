from typing import Dict, Any

from langchain_openai import ChatOpenAI
from langchain.callbacks.base import BaseCallbackHandler

from prompts import Prompts
from db.user_memory import UserMemory
from utils.progress_tracker import ProgressTracker
from config.settings import settings

class KoreanLearningCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for Korean learning progress tracking"""
    
    def __init__(self, progress_tracker: ProgressTracker):
        self.progress_tracker = progress_tracker
    
    def on_tool_start(self, serialized: Dict[str, Any], input_str: str, **kwargs):
        """Track tool usage for progress"""
        tool_name = serialized.get("name", "unknown")
        self.progress_tracker.track_tool_usage(tool_name, input_str)
    
    def on_tool_end(self, output: str, **kwargs):
        """Track successful tool completion"""
        self.progress_tracker.track_success()



class KorLearningModels:
    def __init__(self, user_id: str, sesstion_id: str, level: str = "beginner"):
        self.user_id = user_id
        self.sesstion_id = sesstion_id
        self.level = level
        self.user_memory = UserMemory(user_id=user_id, session_id=sesstion_id)
        
        # Initialize components
        self.llm = self._initialize_llm()
        self.prompt = Prompts()
        self.progress_tracker = ProgressTracker(user_id)
        self.callback_handler = KoreanLearningCallbackHandler(self.progress_tracker)
    
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the language model"""
        return ChatOpenAI(
            model=settings.DEFAULT_MODEL,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY
        )
        
    def chat(self, message: str) -> Dict[str, Any]:
        # Load conversation history
        history = self.user_memory.load_conversation() or []
        # Build prompt with history
        prompt = self.prompt.build_prompt(history, message)
        # Get response from LLM
        response_obj = self.llm.invoke(prompt)
        response = getattr(response_obj, "content", str(response_obj))
        # Save user and assistant messages
        self.user_memory.save_message("user", message)
        self.user_memory.save_message("assistant", response)
        # Trả về đúng định dạng cho Gradio
        return {
            "response": response,
            "success": True
        }
        
    def update_level(self, new_level: str):
        """Update user's learning level"""
        if new_level in settings.SUPPORTED_LEVELS:
            self.level = new_level
            self.progress_tracker.update_level(new_level)
            
            # Reinitialize tools with new level
            self.tools = self._initialize_tools()
            # self.agent = self._initialize_agent()
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get comprehensive learning statistics"""
        return self.progress_tracker.get_detailed_stats()
    
    def reset_conversation(self):
        """Reset conversation memory"""
        user_memory = UserMemory(self.user_id)
        user_memory.clear_conversation()