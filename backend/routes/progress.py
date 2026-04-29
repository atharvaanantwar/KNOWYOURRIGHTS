from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from storage import repo
from models.models import UserProgress

router = APIRouter(prefix="/progress", tags=["Progress"])


# =========================
# GET ALL PROGRESS (USER)
# =========================
@router.get("/")
def get_all_progress(user_id: str, db: Session = Depends(get_db)):
    progress = repo.get_user_progress(db, user_id)

    if not progress:
        return []

    response = []

    for p in progress:
        accuracy = 0
        if p.questions_attempted > 0:
            accuracy = round((p.correct_answers / p.questions_attempted) * 100, 2)

        response.append({
            "domain": p.domain,
            "current_difficulty": p.current_difficulty,
            "questions_attempted": p.questions_attempted,
            "correct_answers": p.correct_answers,
            "accuracy": accuracy,
            "xp": p.xp,
            "level": p.level,
            "streak": p.streak,
            "last_played_at": p.last_played_at
        })

    return response


# =========================
# GET PROGRESS BY DOMAIN
# =========================
@router.get("/topic/{domain}")
def get_progress_by_domain(
    domain: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.domain == domain
    ).first()

    if not progress:
        raise HTTPException(status_code=404, detail="No progress found for this domain")

    accuracy = 0
    if progress.questions_attempted > 0:
        accuracy = round(
            (progress.correct_answers / progress.questions_attempted) * 100, 2
        )

    return {
        "domain": progress.domain,
        "current_difficulty": progress.current_difficulty,
        "questions_attempted": progress.questions_attempted,
        "correct_answers": progress.correct_answers,
        "accuracy": accuracy,
        "xp": progress.xp,
        "level": progress.level,
        "streak": progress.streak,
        "last_played_at": progress.last_played_at
    }


# =========================
# COMPAT ROUTE (frontend support)
# =========================
@router.get("/api/user/progress")
def get_progress_compat(user_id: str, db: Session = Depends(get_db)):
    return repo.get_user_progress(db, user_id)