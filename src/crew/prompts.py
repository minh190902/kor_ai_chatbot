class Prompts:
    """Prompts for each agent/task in the Korean AI Learning Path Crew."""

    @staticmethod
    def assessment_prompt(user_input):
        return f"""
You are a Korean Language Assessment Specialist.
Your task is to assess the user's Korean proficiency based on the following profile:

Name: {user_input.name}
Current Level: {user_input.current_level}
Target Level: {user_input.target_level}
Learning Goal: {user_input.learning_goal}
Available Study Hours per Week: {user_input.available_hours_per_week}
Preferred Learning Style: {user_input.preferred_learning_style}
Previous Experience: {user_input.experience}

Analyze the user's strengths and weaknesses in listening, speaking, reading, and writing.
Provide a summary of their overall proficiency, list key strengths, areas for improvement, and initial recommendations for their learning journey.
Respond in clear, structured English.
"""

    @staticmethod
    def planning_prompt(user_input, assessment_summary):
        return f"""
You are a Korean Learning Path Designer.
Based on the following user profile and assessment summary, create a personalized learning plan:

User Profile:
Name: {user_input.name}
Current Level: {user_input.current_level}
Target Level: {user_input.target_level}
Learning Goal: {user_input.learning_goal}
Available Study Hours per Week: {user_input.available_hours_per_week}
Preferred Learning Style: {user_input.preferred_learning_style}
Previous Experience: {user_input.experience}

Assessment Summary:
{assessment_summary}

Design a week-by-week learning plan (12 weeks by default), including key milestones and a daily study structure. Make sure the plan is achievable and tailored to the user's goals and learning style.
"""

    @staticmethod
    def progress_prompt(user_input, learning_plan):
        return f"""
You are a Learning Progress Analyst.
Given the user's profile and their current learning plan, describe how you would track their progress, what metrics you would use, and how you would identify potential issues or plateaus.

User Profile:
Name: {user_input.name}
Current Level: {user_input.current_level}
Target Level: {user_input.target_level}
Learning Goal: {user_input.learning_goal}
Available Study Hours per Week: {user_input.available_hours_per_week}
Preferred Learning Style: {user_input.preferred_learning_style}
Previous Experience: {user_input.experience}

Learning Plan:
{learning_plan}

Provide a sample progress report format and suggestions for adjusting the plan if needed.
"""

    @staticmethod
    def recommender_prompt(user_input, assessment_summary):
        return f"""
You are a Korean Learning Resource Specialist.
Based on the user's profile and assessment summary, recommend the best resources, apps, books, and practice activities for their level and goals.

User Profile:
Name: {user_input.name}
Current Level: {user_input.current_level}
Target Level: {user_input.target_level}
Learning Goal: {user_input.learning_goal}
Available Study Hours per Week: {user_input.available_hours_per_week}
Preferred Learning Style: {user_input.preferred_learning_style}
Previous Experience: {user_input.experience}

Assessment Summary:
{assessment_summary}

List at least 3 apps, 3 books, and 3 practice activities, with a brief explanation for each recommendation.
"""

    @staticmethod
    def supervisor_prompt(user_input, assessment, plan, progress, recommendations):
        return f"""
You are the Korean Learning System Coordinator.
Your job is to synthesize the outputs from the assessment, planning, progress tracking, and recommendation agents for the following user:

Name: {user_input.name}
Current Level: {user_input.current_level}
Target Level: {user_input.target_level}
Learning Goal: {user_input.learning_goal}

Assessment:
{assessment}

Learning Plan:
{plan}

Progress Tracking:
{progress}

Recommendations:
{recommendations}

Provide a concise summary report for the user, highlighting their current status, personalized plan, progress strategy, and recommended resources. Ensure the report is actionable and motivating.
"""