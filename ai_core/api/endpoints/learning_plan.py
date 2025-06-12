from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import LearningRequest, LearningResponse, ErrorResponse

from ai_learning.crew import AILearningCrew
import json
from typing import Generator

router = APIRouter()
learning_plan_crew = AILearningCrew()

@router.post(
    "/planning_response",
    response_model=LearningResponse,
    responses={500: {"model": ErrorResponse}},
)
def learning_plan(request: LearningRequest):
    try:
        state = {
            "model_provider": request.model_provider,
            "model_id": request.model_id,
            "temperature": request.temperature,
            "self_assessment": request.self_assessment,
            "user_goals": request.user_goals,
            "period": request.period,
            "weekly_study_hours": request.weekly_study_hours
        }
        planning = learning_plan_crew.planning_kickoff(inputs=state)
        return {
            "user_id": request.user_id,
            "learning_plan": planning
        }
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail= f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )