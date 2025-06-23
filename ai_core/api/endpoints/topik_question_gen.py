from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import TopikQuestionGenRequest, TopikQuestionGenResponse, ErrorResponse

from ai_learning.crew import AILearningCrew

router = APIRouter()
topik_question_gen_crew = AILearningCrew()
@router.post(
    "/response",
    response_model=TopikQuestionGenResponse,
    responses={500: {"model": ErrorResponse}},
)
def topik_question_gen(request: TopikQuestionGenRequest):
    try:
        state = {
            "model_provider": request.model_provider,
            "model_id": request.model_id,
            "temperature": request.temperature,
            "level": request.level,
            "type": request.type,
            "subtype": request.subtype,
            "topic": request.topic,
            "language": request.language,
        }
        questions = topik_question_gen_crew.topik_question_kickoff(inputs=state)
        return {
            "user_id": request.user_id,
            "topik_questions": questions
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )


