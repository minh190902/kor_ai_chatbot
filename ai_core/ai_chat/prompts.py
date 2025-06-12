from typing import Dict, List
import re

class Prompts:
    """
    A class to hold various prompts used in the application.
    """
    def __init__(self):
        pass 
    
    def build_prompt(self, history: List[Dict[str, str]], new_message: str, language: str) -> str:
        prompt = f"""You are a helpful Korean language tutor. 
                Remember to always respond in {language} language.
                Continue the conversation below:\n"""
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            prompt += f"{role}: {msg['content']}\n"
        prompt += f"User: {new_message}\nAssistant:"
        return prompt