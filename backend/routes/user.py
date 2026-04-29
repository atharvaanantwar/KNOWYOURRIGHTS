from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.models import UserProgress

router = APIRouter(prefix="/api/user", tags=["User"])

# =========================
# UPDATE USER STATS
# =========================
@router.put("/stats")
def update_user_stats(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db)
):
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.domain == payload.get("domain", "global")
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            domain=payload.get("domain", "global")
        )
        db.add(progress)

    progress.xp = payload.get("total_xp", progress.xp or 0)
    progress.level = payload.get("level", progress.level or 1)
    progress.streak = payload.get("streak", progress.streak or 0)

    db.commit()
    db.refresh(progress)

    return {"status": "updated"}


# =========================
# ADD COMPLETED SCENARIO
# =========================
@router.post("/completed-scenarios")
def add_completed_scenario(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db)
):
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.domain == payload["domain"]
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            domain=payload["domain"],
            questions_attempted=0,
            correct_answers=0,
            xp=0,
            level=1,
            streak=0
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)

    # 🔥 FIX: handle None values
    progress.questions_attempted = (progress.questions_attempted or 0) + 1

    if payload["correct"]:
        progress.correct_answers = (progress.correct_answers or 0) + 1

    db.commit()

    return {"status": "recorded"}

# =========================
# XP HISTORY (OPTIONAL)
# =========================
@router.post("/xp-history")
def add_xp_entry(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db)
):
    # For now just acknowledge (no table yet)
    return {"status": "xp logged"}


# =========================
# GET USER PROGRESS
# =========================
@router.get("/progress")
def get_progress(
    user_id: str,
    db: Session = Depends(get_db)
):
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).all()

    return {
        "progress": [
            {
                "domain": p.domain,
                "xp": p.xp,
                "level": p.level,
                "streak": p.streak,
                "questions_attempted": p.questions_attempted,
                "correct_answers": p.correct_answers
            }
            for p in progress
        ]
    }