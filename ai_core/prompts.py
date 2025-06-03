from typing import Dict, List

class Prompts:
    """
    A class to hold various prompts used in the application.
    """
    def __init__(self):
        pass 
    
    def build_prompt(self, history: List[Dict[str, str]], new_message: str) -> str:
        prompt = "You are a helpful Korean language tutor. Continue the conversation below:\n"
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            prompt += f"{role}: {msg['content']}\n"
        prompt += f"User: {new_message}\nAssistant:"
        return prompt