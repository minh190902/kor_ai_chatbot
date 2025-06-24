from .db_config import init_db, SessionLocal
from .seeders import seed_topik_question_types

if __name__ == "__main__":
    init_db()  # Tạo bảng
    print("Database initialized successfully.")
    session = SessionLocal()
    seed_topik_question_types(session)
    session.close()