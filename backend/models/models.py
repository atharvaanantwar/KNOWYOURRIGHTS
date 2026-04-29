from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from db import Base


# =========================
# USERS TABLE
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# QUESTIONS TABLE
# =========================
class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # CORE GAME FILTERING
    question_type = Column(String, nullable=False)   # tf / mcq / match
    domain = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False)     # 1 = easy, 2 = medium, 3 = hard

    question_text = Column(Text, nullable=False)

    # Answers
    answer = Column(Boolean, nullable=True)          # TF
    options = Column(JSON, nullable=True)            # MCQ
    correct_answer = Column(String, nullable=True)
    explanation = Column(Text, nullable=True)

    pairs = Column(JSON, nullable=True)              # Match
    correct_pairs = Column(JSON, nullable=True)

    # Optional metadata
    extra_metadata = Column(JSON, nullable=True)

    content_hash = Column(String, unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# USER PROGRESS TABLE
# =========================
class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    domain = Column(String, nullable=False)

    current_difficulty = Column(Integer, default=1)

    questions_attempted = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)

    total_score = Column(Integer, default=0)
    xp = Column(Integer, default=0)

    streak = Column(Integer, default=0)
    level = Column(Integer, default=1)

    last_played_at = Column(DateTime, default=datetime.utcnow)


# =========================
# USER QUESTION HISTORY (NEW)
# =========================
class UserQuestionHistory(Base):
    __tablename__ = "user_question_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)

    is_correct = Column(Boolean)
    selected_answer = Column(JSON, nullable=True)  # works for MCQ + match

    attempted_at = Column(DateTime, default=datetime.utcnow)


# =========================
# USER BADGES TABLE
# =========================
class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    badge_name = Column(String, nullable=False)

    unlocked_at = Column(DateTime, default=datetime.utcnow)