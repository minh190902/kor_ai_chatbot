"""
Progress tracking utility for Korean Learning Chatbot
"""
from typing import Dict, Any, List
from datetime import datetime

class ProgressTracker:
    """Tracks user learning progress, tool usage, and achievements."""

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.tool_usage = {}
        self.achievements = []
        self.level = "beginner"
        self.conversation_count = 0
        self.study_sessions = []
        self.last_activity = None

    def track_tool_usage(self, tool_name: str, input_str: str):
        """Track usage of a learning tool."""
        self.tool_usage.setdefault(tool_name, 0)
        self.tool_usage[tool_name] += 1
        self.last_activity = datetime.now()

    def track_success(self):
        """Track successful completion of a learning activity."""
        # For demonstration, add a simple achievement
        achievement = {
            "timestamp": datetime.now().isoformat(),
            "description": "Successfully completed a learning activity!"
        }
        self.achievements.append(achievement)

    def update_level(self, new_level: str):
        """Update the user's learning level."""
        self.level = new_level

    def get_progress_summary(self) -> Dict[str, Any]:
        """Return a summary of the user's progress."""
        return {
            "total_conversations": self.conversation_count,
            "today_study_time": self._get_today_study_time(),
            "current_level": self.level,
            "tool_usage": self.tool_usage,
            "recent_achievements": self.achievements[-3:],
        }

    def get_detailed_stats(self) -> Dict[str, Any]:
        """Return detailed learning statistics."""
        return {
            "user_id": self.user_id,
            "level": self.level,
            "tool_usage": self.tool_usage,
            "achievements": self.achievements,
            "conversation_count": self.conversation_count,
            "study_sessions": self.study_sessions,
            "last_activity": self.last_activity,
        }

    def increment_conversation(self):
        """Increment the conversation count."""
        self.conversation_count += 1
        self.last_activity = datetime.now()

    def add_study_session(self, minutes: int):
        """Add a study session duration."""
        self.study_sessions.append({
            "date": datetime.now().date().isoformat(),
            "minutes": minutes
        })

    def _get_today_study_time(self) -> int:
        """Calculate today's total study time in minutes."""
        today = datetime.now().date().isoformat()
        return sum(
            session["minutes"] for session in self.study_sessions
            if session["date"] == today
        )