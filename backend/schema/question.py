from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# ── Request schemas (what the API receives) ─────────────────────────────────

class QuestionFilter(BaseModel):
    """Used as query params: GET /questions?topic=x&difficulty=y&limit=10"""
    topic:      Optional[str] = None
    difficulty: Optional[str] = None  # easy / medium / hard
    limit:      Optional[int] = 10


# ── Response schemas (what the API returns) ─────────────────────────────────

class QuestionOut(BaseModel):
    """
    Shape of a single question returned to the frontend.
    feedback is excluded here — it's only sent after the user answers.
    """
    id:            UUID
    topic:         str
    difficulty:    str
    question_type: str           # mcq / tf
    question_text: str
    options:       Optional[List[str]] = None   # None for T/F questions
    created_at:    datetime

    class Config:
        from_attributes = True  # allows converting SQLAlchemy model directly to this schema


class FeedbackOut(BaseModel):
    """Returned by GET /feedback/{question_id} after user submits an answer."""
    question_id:   UUID
    correct_answer: str
    feedback:      Optional[str] = None

    class Config:
        from_attributes = True


class TopicOut(BaseModel):
    """Single topic returned in the topics list."""
    topic: str


# ── Progress schemas ─────────────────────────────────────────────────────────

class ProgressOut(BaseModel):
    """Full progress record for a user on a topic."""
    id:             UUID
    user_id:        UUID
    topic:          str
    questions_seen: int
    correct_count:  int
    total_score:    int
    xp:             int
    streak:         int
    level:          int
    last_played_at: Optional[datetime] = None

    class Config:
        from_attributes = True
