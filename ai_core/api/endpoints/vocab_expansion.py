from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import VocabExpansionRequest, VocabExpansionResponse, ErrorResponse

from ai_learning.crew import AILearningCrew
from db.pg_db import create_vocab_expansion

router = APIRouter()
vocab_expansion_crew = AILearningCrew()

@router.post(
    "/vocab_expansion_response",
    response_model=VocabExpansionResponse,
    responses={500: {"model": ErrorResponse}},
)
def vocab_expansion(request: VocabExpansionRequest):
    try:
        # vocab_id = create_vocab_expansion(request.user_id, request.user_word)
        state = {
            # "vocab_id": vocab_id,
            "user_word": request.user_word,
            "model_provider": request.model_provider,
            "model_id": request.model_id,
            "temperature": request.temperature,
            "language": request.language,
        }
        expansion = vocab_expansion_crew.vocab_expansion_kickoff(inputs=state)
        return {
            "user_id": request.user_id,
            "vocab_expansion": expansion
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )