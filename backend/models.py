from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from backend.config import DATABASE_URL

Base = declarative_base()

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # {"A": "option1", "B": "option2", ...}
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    domain = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    xp_reward = Column(Integer, default=10)
    legal_reference = Column(Text)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    total_xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    completed_scenarios = relationship("CompletedScenario", back_populates="user")
    xp_history = relationship("XPHistory", back_populates="user")

class CompletedScenario(Base):
    __tablename__ = "completed_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scenario_id = Column(Integer)  # ID from questions table
    domain = Column(String)
    correct = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="completed_scenarios")

class XPHistory(Base):
    __tablename__ = "xp_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scenario_id = Column(Integer)
    domain = Column(String)
    base_xp = Column(Integer)
    streak_bonus = Column(Integer)
    total_earned = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="xp_history")

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()