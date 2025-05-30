from crewai import Task

class Tasks:
    def __init__(self):
        pass

    def assessment_task(self, agent=None):
        return Task(
            description="Assess the user's Korean proficiency based on input information and identify strengths and weaknesses.",
            expected_output="A report summarizing overall proficiency, strengths, weaknesses, and initial recommendations.",
            agent=agent
        )

    def planning_task(self, agent=None):
        return Task(
            description="Create a personalized learning plan based on the assessment results and the user's goals.",
            expected_output="A detailed weekly learning plan, key milestones, and daily study structure.",
            agent=agent
        )

    def progress_task(self, agent=None):
        return Task(
            description="Track learning progress, analyze study data, and detect potential issues.",
            expected_output="A progress report, skill statistics, and suggestions for plan adjustments if needed.",
            agent=agent
        )

    def recommender_task(self, agent=None):
        return Task(
            description="Recommend resources, apps, books, and practice activities suitable for the user's level and goals.",
            expected_output="A personalized list of resources, apps, books, and practice activities.",
            agent=agent
        )

    def supervisor_task(self, agent=None):
        return Task(
            description="Coordinate all agents, synthesize results, and ensure an optimal learning experience.",
            expected_output="A summary report including assessment, plan, progress, and resource recommendations.",
            agent=agent
        )