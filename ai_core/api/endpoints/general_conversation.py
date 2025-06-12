from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas import ChatbotRequest, ChatbotResponse, ErrorResponse

from ai_chat.models.kor_learning import KorLearningChatModels
import json
from typing import Generator

router = APIRouter()

@router.post(
    "/chat_response",
    response_model=str,
    responses={500: {"model": ErrorResponse}},
)
def request_chatbot(request: ChatbotRequest):
    print(f"[API INPUT] /chat_response: {request.dict()}", flush=True)  # Log input
    try:
        model = KorLearningChatModels(
            user_id=request.user_id,
            session_id=request.session_id
        )
        response = model.chat(request.message, request.history, request.language)
        return StreamingResponse(
            iter([response["response"]]),
            media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail= f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )

@router.post(
    "/chat_stream",
    response_model=str,
    responses={500: {"model": ErrorResponse}},
)
def request_chatbot_stream(request: ChatbotRequest):
    print(f"[API INPUT] /chat_stream: {request.dict()}", flush=True)  # Log input
    try:
        model = KorLearningChatModels(
            user_id=request.user_id,
            session_id=request.session_id
        )
        def generate_response() -> Generator[str, None, None]:
            try:
                for chunk in model.chat_stream(request.message, request.history, request.language):
                    data = {
                        "content": chunk,
                        "done": False
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                final_data = {"content": "", "done": True}
                yield f"data: {json.dumps(final_data)}\n\n"
            except Exception as e:
                error_data = {
                    "error": str(e),
                    "done": True
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        return StreamingResponse(
            generate_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong, retry again later or contact support. Error: {str(e)}"
        )