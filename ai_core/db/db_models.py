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

class UserStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class MessageRole(PyEnum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

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

    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")

class ChatSession(Base):
    __tablename__ = 'chat_sessions'
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    llm_context = Column(JSONB, default=dict)
    session_metrics = Column(JSONB, default=dict)
    # Nếu có metadata, đổi tên thành session_metadata

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = 'messages'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(PG_UUID(as_uuid=True), ForeignKey('chat_sessions.id'), nullable=False, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    level = Column(String, nullable=True)
    message_metadata = Column(JSONB, default=dict)

    session = relationship("ChatSession", back_populates="messages")

# Indexes (tùy chọn, tối ưu truy vấn)
Index('ix_messages_session_timestamp', Message.session_id, Message.timestamp)