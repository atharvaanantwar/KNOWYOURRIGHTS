from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Question(BaseModel):
    id: Optional[int] = None
    question: str
    options: dict  # {"A": "option1", "B": "option2", ...}
    correct_answer: str
    explanation: str
    domain: str
    difficulty: str
    xp_reward: Optional[int] = 10
    legal_reference: Optional[str] = None

class UserStats(BaseModel):
    total_xp: int
    level: int
    streak: int

class CompletedScenarioCreate(BaseModel):
    scenario_id: int
    domain: str
    correct: bool

class XPHistoryCreate(BaseModel):
    scenario_id: int
    domain: str
    base_xp: int
    streak_bonus: int
    total_earned: int

class UserProgress(BaseModel):
    user_stats: UserStats
    completed_scenarios: List[dict]
    xp_history: List[dict]