import os
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import Engine
from typing import Generator
from .db_models import Base
from config.settings import settings

# DB_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:1234@localhost:5432/postgres")
engine: Engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def init_db():
    Base.metadata.create_all(bind=engine)

@contextmanager
def get_db_session() -> Generator:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
        
if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")