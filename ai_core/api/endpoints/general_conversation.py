from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import ChatbotRequest, ChatbotResponse, ErrorResponse

from models.kor_learning import KorLearningModels

router = APIRouter()

@router.post(
    "/chat_response",
    response_model=str,
    responses={500: {"model": ErrorResponse}},
)
def request_chatbot(request: ChatbotRequest):
    try:
        model = KorLearningModels(
            user_id=request.user_id,
            sesstion_id=request.session_id
        )
        response = model.chat(request.message, request.history)
        return StreamingResponse(
            iter([response["response"]]),
            media_type="text/plain"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail= f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )