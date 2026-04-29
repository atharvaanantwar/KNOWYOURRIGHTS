from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

# Engine is the actual connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# SessionLocal is a factory — each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class all SQLAlchemy models will inherit from
Base = declarative_base()


def get_db():
    """
    FastAPI dependency — gives each route its own DB session.
    Automatically closes the session when the request is done.

    Usage in any route:
        from database import get_db
        from sqlalchemy.orm import Session
        from fastapi import Depends

        @router.get("/something")
        def my_route(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
