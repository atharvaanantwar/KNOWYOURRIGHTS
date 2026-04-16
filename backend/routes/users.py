from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models import User, CompletedScenario, XPHistory, get_db
from backend.schema.mcq import UserStats, CompletedScenarioCreate, XPHistoryCreate, UserProgress
from typing import List

router = APIRouter()

# For now, using user_id = 1 (single user)
USER_ID = 1

@router.get("/stats", response_model=UserStats)
def get_user_stats(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == USER_ID).first()
    if not user:
        # Create user if doesn't exist
        user = User(id=USER_ID, total_xp=0, level=1, streak=0)
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserStats(
        total_xp=user.total_xp,
        level=user.level,
        streak=user.streak
    )

@router.put("/stats")
def update_user_stats(stats: UserStats, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == USER_ID).first()
    if not user:
        user = User(id=USER_ID)
        db.add(user)

    user.total_xp = stats.total_xp
    user.level = stats.level
    user.streak = stats.streak
    db.commit()
    return {"message": "Stats updated"}

@router.post("/completed-scenarios")
def add_completed_scenario(scenario: CompletedScenarioCreate, db: Session = Depends(get_db)):
    db_scenario = CompletedScenario(
        user_id=USER_ID,
        scenario_id=scenario.scenario_id,
        domain=scenario.domain,
        correct=scenario.correct
    )
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

@router.get("/completed-scenarios")
def get_completed_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(CompletedScenario).filter(CompletedScenario.user_id == USER_ID).all()
    return [{"id": s.scenario_id, "domain": s.domain, "correct": s.correct, "timestamp": s.timestamp} for s in scenarios]

@router.post("/xp-history")
def add_xp_entry(xp_entry: XPHistoryCreate, db: Session = Depends(get_db)):
    db_entry = XPHistory(
        user_id=USER_ID,
        scenario_id=xp_entry.scenario_id,
        domain=xp_entry.domain,
        base_xp=xp_entry.base_xp,
        streak_bonus=xp_entry.streak_bonus,
        total_earned=xp_entry.total_earned
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/xp-history")
def get_xp_history(db: Session = Depends(get_db)):
    history = db.query(XPHistory).filter(XPHistory.user_id == USER_ID).all()
    return [{
        "id": h.id,
        "scenario_id": h.scenario_id,
        "domain": h.domain,
        "base_xp": h.base_xp,
        "streak_bonus": h.streak_bonus,
        "total_earned": h.total_earned,
        "timestamp": h.timestamp
    } for h in history]

@router.get("/progress", response_model=UserProgress)
def get_user_progress(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == USER_ID).first()
    if not user:
        user = User(id=USER_ID, total_xp=0, level=1, streak=0)
        db.add(user)
        db.commit()
        db.refresh(user)

    completed_scenarios = get_completed_scenarios(db)
    xp_history = get_xp_history(db)

    return UserProgress(
        user_stats=UserStats(
            total_xp=user.total_xp,
            level=user.level,
            streak=user.streak
        ),
        completed_scenarios=completed_scenarios,
        xp_history=xp_history
    )