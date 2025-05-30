from db.db_models import Message, MessageRole, ChatSession, User
from db.db_config import get_db_session
from datetime import datetime
import uuid

class UserMemory:
    def __init__(self, user_id: str, session_id: str):
        self.user_id = user_id
        self.session_id = session_id

    def load_conversation(self, limit: int = 20):
        """Lấy lịch sử hội thoại theo session, đúng thứ tự."""
        with get_db_session() as session:
            messages = (
                session.query(Message)
                .filter(Message.session_id == self.session_id)
                .order_by(Message.timestamp)
                .limit(limit)
                .all()
            )
            return [
                {"role": msg.role.value, "content": msg.content, "timestamp": msg.timestamp}
                for msg in messages
            ]
            
    def ensure_session(self):
        """Đảm bảo user và session tồn tại, nếu không thì tạo mới."""
        with get_db_session() as session:
            # Đảm bảo user tồn tại
            user = session.query(User).filter_by(id=self.user_id).first()
            if not user:
                user = User(id=self.user_id, username=f"user_{self.user_id}")
                session.add(user)
                session.commit()
            # Đảm bảo session tồn tại
            chat_session = None
            if self.session_id:
                chat_session = session.query(ChatSession).filter_by(id=self.session_id).first()
            if not chat_session:
                new_session = ChatSession(
                    id=self.session_id or str(uuid.uuid4()),
                    user_id=self.user_id,
                    started_at=datetime.now(),
                    is_active=True
                )
                session.add(new_session)
                session.commit()
                self.session_id = new_session.id

    def save_message(self, role: str, content: str, level: str = None):
        """Lưu một tin nhắn mới vào database."""
        self.ensure_session()
        with get_db_session() as session:
            msg = Message(
                session_id=self.session_id,
                role=MessageRole(role),
                content=content,
                timestamp=datetime.now(),
                level=level
            )
            session.add(msg)
            session.commit()

    def clear_conversation(self):
        """Xóa toàn bộ hội thoại của session."""
        with get_db_session() as session:
            session.query(Message).filter(Message.session_id == self.session_id).delete()