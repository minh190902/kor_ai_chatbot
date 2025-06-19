import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, DateTime, Text, BigInteger, Integer, Enum, Boolean, JSON, ForeignKey, func, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

Base = declarative_base()

# -------------------- ENUMS --------------------
class UserStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class MessageRole(PyEnum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

# -------------------- USER --------------------
class User(Base):
    __tablename__ = 'users'
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    user_metadata = Column(JSONB, default=dict)
    role = Column(String(50), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    login_count = Column(Integer, default=0)
    last_plan_id = Column(PG_UUID(as_uuid=True), ForeignKey('learning_plans.plan_id'), nullable=True)

    chat_sessions = relationship(
        "ChatSession",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    learning_plans = relationship(
        "LearningPlan",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys='LearningPlan.user_id'
    )
    vocab_expansions = relationship(
        "VocabExpansion",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys='VocabExpansion.user_id'
    )
    last_plan = relationship(
        "LearningPlan",
        foreign_keys=[last_plan_id],
        uselist=False
    )

# -------------------- CHAT SESSION --------------------
class ChatSession(Base):
    __tablename__ = 'chat_sessions'
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    llm_context = Column(JSONB, default=dict)
    session_metadata = Column(JSONB, default=dict)
    session_metrics = Column(JSONB, default=dict)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")

# -------------------- MESSAGE --------------------
class Message(Base):
    __tablename__ = 'messages'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    conversation_id = Column(PG_UUID(as_uuid=True), ForeignKey('chat_sessions.id'), nullable=False, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    level = Column(String, nullable=True)
    message_metadata = Column(JSONB, default=dict)
    is_read = Column(Boolean, default=False)
    reply_to_message_id = Column(BigInteger, ForeignKey('messages.id'), nullable=True)
    sentiment_score = Column(Integer, nullable=True)

    session = relationship("ChatSession", back_populates="messages")
    replies = relationship("Message", remote_side=[id])

# -------------------- LEARNING PLAN --------------------
class LearningPlan(Base):
    __tablename__ = "learning_plans"
    plan_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    overview = Column(Text, nullable=True)
    status = Column(String, default="processing")  # processing, done, failed
    learning_plan = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_accessed = Column(DateTime(timezone=True), nullable=True)

    user = relationship(
        "User",
        back_populates="learning_plans",
        foreign_keys=[user_id]
    )
    
class StudyPlanContent(Base):
    __tablename__ = "study_plan_content"
    study_plan_id = Column(PG_UUID(as_uuid=True), ForeignKey('learning_plans.plan_id'), primary_key=True)
    content_json = Column(JSONB, nullable=False)
    content_hash = Column(String(64), nullable=True)

    study_plan = relationship("LearningPlan", backref="content", uselist=False)

# -------------------- VOCABULARY --------------------
class VocabExpansion(Base):
    __tablename__ = "vocab_expansions"
    vocab_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    user_word = Column(String(255), nullable=False)
    xml_response = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship(
        "User",
        back_populates="vocab_expansions",
        foreign_keys=[user_id]
    )


# -------------------- INDEXES --------------------
Index('ix_messages_conversation_timestamp', Message.conversation_id, Message.timestamp)
Index('ix_learning_plan_user_status', LearningPlan.user_id, LearningPlan.status)
Index('ix_user_email', User.email)
Index('ix_user_username', User.username)