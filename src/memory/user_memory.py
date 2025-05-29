from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.now)

engine = create_engine("sqlite:///chatbot.db")
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

class UserMemory:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def load_conversation(self):
        session = Session()
        messages = session.query(ChatMessage).filter_by(user_id=self.user_id).order_by(ChatMessage.timestamp).all()
        session.close()
        return [{"role": m.role, "content": m.content} for m in messages]

    def save_message(self, role: str, content: str):
        session = Session()
        msg = ChatMessage(user_id=self.user_id, role=role, content=content)
        session.add(msg)
        session.commit()
        session.close()

    def clear_conversation(self):
        session = Session()
        session.query(ChatMessage).filter_by(user_id=self.user_id).delete()
        session.commit()
        session.close()