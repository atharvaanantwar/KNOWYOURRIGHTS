from sqlalchemy.orm import Session
from sqlalchemy import func
from models.models import Question, UserProgress, UserQuestionHistory
import random


# =========================
# GET QUESTIONS (WITH FILTER)
# =========================
def get_questions(db: Session, domain: str, difficulty: int, limit: int = 10):
    return db.query(Question).filter(
        Question.domain == domain,
        Question.difficulty == difficulty
    ).limit(limit).all()


# =========================
# GET UNSEEN QUESTIONS (IMPORTANT)
# =========================
def get_unseen_questions(db: Session, user_id, domain: str, difficulty: int, limit: int = 10):
    subquery = db.query(UserQuestionHistory.question_id).filter(
        UserQuestionHistory.user_id == user_id
    )

    questions = db.query(Question).filter(
        Question.domain == domain,
        Question.difficulty == difficulty,
        ~Question.id.in_(subquery)
    ).all()

    random.shuffle(questions)

    return questions[:limit]


# =========================
# GET SINGLE QUESTION
# =========================
def get_question_by_id(db: Session, question_id):
    return db.query(Question).filter(Question.id == question_id).first()


# =========================
# RECORD ATTEMPT
# =========================
def record_attempt(db: Session, user_id, question: Question, selected_answer):

    # check correctness
    is_correct = False

    if question.question_type == "tf":
        is_correct = (selected_answer == question.answer)

    elif question.question_type == "mcq":
        is_correct = (selected_answer == question.correct_answer)

    elif question.question_type == "match":
        is_correct = (selected_answer == question.correct_pairs)

    # store history
    history = UserQuestionHistory(
        user_id=user_id,
        question_id=question.id,
        is_correct=is_correct,
        selected_answer=selected_answer
    )

    db.add(history)

    # update progress
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.domain == question.domain
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            domain=question.domain,
            questions_attempted=0,
            correct_answers=0,
            xp=0,
            level=1,
            streak=0
        )
        db.add(progress)
        db.flush()

    progress.questions_attempted = progress.questions_attempted or 0
    progress.correct_answers = progress.correct_answers or 0
    progress.xp = progress.xp or 0

    progress.questions_attempted += 1

    if is_correct:
        progress.correct_answers += 1
        progress.xp += 10
    else:
        progress.xp += 2

    db.commit()

    return is_correct


# =========================
# GET USER PROGRESS
# =========================
def get_user_progress(db: Session, user_id):
    return db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).all()