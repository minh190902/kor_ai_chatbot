# ai_core/models/kor_learning.py
from typing import Dict, Any, Generator, Iterator
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.callbacks.base import BaseCallbackHandler

from ai_chat.prompts import Prompts
from config.settings import settings

class StreamingCallbackHandler(BaseCallbackHandler):
    """Custom callback handler để capture streaming tokens"""
    
    def __init__(self):
        self.tokens = []
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Called when a new token is generated"""
        self.tokens.append(token)
        
    def get_tokens(self) -> list:
        return self.tokens
        
    def clear_tokens(self):
        self.tokens = []

class KorLearningChatModels:
    def __init__(self, user_id: str, conversation_id: str):
        self.user_id = user_id
        self.conversation_id = conversation_id
        
        # Initialize components
        self.llm = self._initialize_llm()
        self.streaming_llm = self._initialize_streaming_llm()
        self.prompt = Prompts()
    
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the language model for non-streaming"""
        return ChatOpenAI(
            model=settings.DEFAULT_MODEL,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY
        )
    
    def _initialize_streaming_llm(self) -> ChatOpenAI:
        """Initialize the language model for streaming"""
        return ChatOpenAI(
            model=settings.DEFAULT_MODEL,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY,
            streaming=True
        )
        
    def chat(self, message: str, history: list[Dict], language: str) -> Dict[str, Any]:
        """Non-streaming chat method"""
        # Build prompt with history
        prompt = self.prompt.build_prompt(history, message, language)
        # Get response from LLM
        response_obj = self.llm.invoke(prompt)
        response = getattr(response_obj, "content", str(response_obj))

        return {
            "response": response,
            "success": True
        }
    
    def chat_stream(self, message: str, history: list[Dict], language: str) -> Generator[str, None, None]:
        """Streaming chat method"""
        try:
            # Build prompt with history
            prompt = self.prompt.build_prompt(history, message, language)
            
            # Create callback handler
            # callback = StreamingCallbackHandler()
            
            # # Get streaming response from LLM
            # response_obj = self.streaming_llm.invoke(
            #     prompt, 
            #     callbacks=[callback]
            # )
            
            # Yield tokens as they become available
            # Note: OpenAI's streaming works differently, we need to use their streaming API
            for chunk in self._stream_openai_response(prompt):
                yield chunk
                
        except Exception as e:
            yield f"Error: {str(e)}"
    
    def _stream_openai_response(self, prompt: str) -> Generator[str, None, None]:
        """Stream response using OpenAI's streaming API directly"""
        try:            
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            stream = client.chat.completions.create(
                model=settings.DEFAULT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                stream=True,
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            yield f"Streaming error: {str(e)}"
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get comprehensive learning statistics"""
        return {"stats": "placeholder"}