from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.config import DATABASE_URL

from backend.models import get_db, Question as DBQuestion
from backend.schema.mcq import Question
from backend.routes.users import router as user_router

app = FastAPI(title="Legal Quiz API")

# CORS middleware (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user routes
app.include_router(user_router, prefix="/api/user", tags=["user"])

# Root route
@app.get("/")
def home():
    return {"message": "Legal Quiz API running 🚀"}


# Get questions API
@app.get("/questions", response_model=List[Question])
def get_questions(
    domain: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DBQuestion)

    # Apply filters
    if domain:
        query = query.filter(DBQuestion.domain == domain)

    if difficulty:
        query = query.filter(DBQuestion.difficulty == difficulty)

    questions = query.all()

    # Convert DB objects → Pydantic schema
    result = []
    for q in questions:
        result.append(Question(
            id=q.id,
            question=q.question,
            options=q.options,
            correct_answer=q.correct_answer,
            explanation=q.explanation,
            domain=q.domain,
            difficulty=q.difficulty,
            xp_reward=q.xp_reward,
            legal_reference=q.legal_reference
        ))

    return result