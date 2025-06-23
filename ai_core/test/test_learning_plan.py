import os, sys
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from dotenv import load_dotenv
load_dotenv(".env", override=True)

from ai_learning.crew import AILearningCrew
import time

print("Starting AI Learning Crew...")
start_time = time.time()
crew = AILearningCrew()
inputs = {
    "model_provider": "openai",
    "model_id": "gpt-4o-mini",
    "temperature": 0.5,
    "self_assessment": "Beginner",
    "user_goals": "Topik 6",
    "period": "1 year",
    "weekly_study_hours": 10
}

# Run the planning kickoff
results = crew.end2end_plan_kickoff(inputs)
print(results)
print("AI Learning Crew planning completed successfully. Tasks executed in {:.2f} seconds.".format(time.time() - start_time))
    