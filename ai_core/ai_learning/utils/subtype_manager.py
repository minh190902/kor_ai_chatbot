import json
import random
from typing import Dict, List, Any, Optional
from pathlib import Path

class SubtypeManager:
    """Manages subtype configurations loaded from JSON file"""
    
    def __init__(self, config_path: str = "config/ai_topik.json"):
        self.config_path = Path(__file__).parent.parent / config_path
        self._config_data = None
        self._load_config()
    
    def _load_config(self):
        """Load subtype configuration from JSON file"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                self._config_data = json.load(f)[0]  # Get first item from array
        except FileNotFoundError:
            raise FileNotFoundError(f"Config file not found: {self.config_path}")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in config file: {self.config_path}")
    
    def get_subtypes_for_type(self, type_name: str, level: str = None) -> List[Dict[str, Any]]:
        """Get all subtypes for a given type, optionally filtered by level"""
        if type_name not in self._config_data:
            return []
        
        subtypes = self._config_data[type_name]
        
        if level:
            # Filter by applicable levels
            filtered_subtypes = []
            for subtype in subtypes:
                if level in subtype.get("applicable_levels", []):
                    filtered_subtypes.append(subtype)
            return filtered_subtypes
        
        return subtypes
    
    def select_random_subtype(self, type_name: str, level: str) -> Optional[Dict[str, Any]]:
        """Randomly select a subtype for given type and level"""
        available_subtypes = self.get_subtypes_for_type(type_name, level)
        
        if not available_subtypes:
            return None
        
        return random.choice(available_subtypes)
    
    def get_subtype_info(self, type_name: str, subtype_name: str) -> Optional[Dict[str, Any]]:
        """Get specific subtype information"""
        subtypes = self.get_subtypes_for_type(type_name)
        
        for subtype in subtypes:
            if subtype.get("subtype") == subtype_name:
                return subtype
        
        return None
    
    def generate_subtype_context(self, subtype_info: Dict[str, Any]) -> str:
        """Generate context prompt for a specific subtype"""
        if not subtype_info:
            return ""
        
        pattern_type = subtype_info.get("pattern_type", "")
        format_rules = subtype_info.get("format_rules", {})
        description = subtype_info.get("description", "")
        
        context = f"""
        # SUBTYPE-SPECIFIC REQUIREMENTS:
        Subtype: {subtype_info.get('subtype', '')}
        Description: {description}
        Pattern Type: {pattern_type}
        
        ## Format Rules:
        - PASSAGE: {format_rules.get('passage', 'Must be appropriate for subtype')}
        - QUESTION: {format_rules.get('question', 'Must match subtype requirements')}
        - CHOICES: {format_rules.get('choices', 'Must provide appropriate options')}
        
        ## Critical Consistency Requirements:
        """
        
        # Add pattern-specific rules
        if pattern_type == "underlined":
            context += """
        - The passage MUST contain exactly ONE underlined word/phrase using <u>word/phrase</u> tags
        - The question MUST ask specifically about the underlined part's meaning
        - Choices MUST include one correct synonym and three clearly different distractors
        - Explanation MUST reference the exact underlined word/phrase
        """
        elif pattern_type == "blank_fill":
            context += """
        - The passage/question MUST contain exactly ONE blank marked as ___
        - The question MUST ask what fits in the blank
        - Choices MUST include one contextually correct answer and three plausible distractors
        - Explanation MUST justify why the correct choice fits the specific blank
        """
        elif pattern_type == "main_idea":
            context += """
        - The passage MUST be a complete text with a clear central message
        - The question MUST ask for the main idea or central theme
        - Choices MUST include one correct main idea and three partial/off-topic ideas
        - Explanation MUST explain why the choice represents the central theme
        """
        elif pattern_type == "true_false_match":
            context += """
        - The passage MUST contain clear factual information
        - The question MUST ask which statement matches the content
        - Choices MUST include one correct match and three with varying degrees of distortion
        - Explanation MUST explain the factual basis for the correct answer
        """
        
        context += """
        
        ENSURE PERFECT CONSISTENCY: All components (passage, question, choices, explanation) must be perfectly aligned with these subtype requirements.
        """
        
        return context.strip()

# Global instance
subtype_manager = SubtypeManager()
