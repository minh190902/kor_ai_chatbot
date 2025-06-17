from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import LearningRequest, LearningResponse, ErrorResponse

from ai_learning.crew import AILearningCrew
from db.pg_db import create_learning_plan, update_learning_plan, get_learning_plan_by_user

router = APIRouter()
learning_plan_crew = AILearningCrew()

@router.post(
    "/planning_response",
    response_model=LearningResponse,
    responses={500: {"model": ErrorResponse}},
)
def learning_plan(request: LearningRequest):
    try:
        plan_id = create_learning_plan(request.user_id)
        state = {
            "plan_id": plan_id,
            "model_provider": request.model_provider,
            "model_id": request.model_id,
            "temperature": request.temperature,
            "self_assessment": request.self_assessment,
            "user_goals": request.user_goals,
            "period": request.period,
            "weekly_study_hours": request.weekly_study_hours,
            "language": request.language,
        }
        planning = learning_plan_crew.end2end_plan_kickoff(inputs=state)
        return {
            "user_id": request.user_id,
            "learning_plan": planning
        }
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail= f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )