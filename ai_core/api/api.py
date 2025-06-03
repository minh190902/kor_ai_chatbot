from fastapi import FastAPI
from .endpoints import general_conversation

summary = "Korean Learning API"

description = """
This API provides endpoints for Korean language learning, including general conversation, assessment, planning, progress tracking, and resource recommendations. It is designed to assist users in their Korean language learning journey by providing personalized interactions and resources.
"""

tags_metadata = [
    {
        "name": "Korean Learning Chatbot",
        "description": "Endpoints for Korean language learning chatbot conversation",
    }
]

api = FastAPI(
    title = "KOREAN LEARNING API",
    summary=summary,
    vẻsion="1.0",
    openapi_tags=tags_metadata,
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

api.include_router(
    general_conversation.router,
    prefix="/chatbot",
    tags=["Korean Learning Chatbot"],
)