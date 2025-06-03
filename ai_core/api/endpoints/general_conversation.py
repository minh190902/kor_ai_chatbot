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
        state = {
            "user_id": request.user_id,
            "session_id": request.session_id,
            "message": request.message,
            "history": request.history,
            "level": request.level
        }
        model = KorLearningModels(
            user_id=state["user_id"],
            sesstion_id=state["session_id"],
            level=state["level"]
        )
        response = model.chat(state["message"])
        return StreamingResponse(
            iter([response["response"]]),
            media_type="text/plain"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail= f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )