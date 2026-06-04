from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from uuid import UUID

from db import get_db
from storage import repo
from models.models import Question

router = APIRouter(prefix="/questions", tags=["Questions"])


# =========================
# HELPER: Shuffle MCQ (SAFE)
# =========================
def shuffle_mcq(question: Question):
    options = question.options.copy()
    items = list(options.items())
    random.shuffle(items)

    new_options = {}
    answer_map = {}

    for idx, (key, value) in enumerate(items):
        new_key = chr(65 + idx)  # A, B, C, D
        new_options[new_key] = value
        answer_map[new_key] = key  # map shuffled → original

    return new_options, answer_map


# =========================
# HELPER: Shuffle Match
# =========================
def shuffle_match(question: Question):
    pairs = question.pairs.copy()

    left = [p["left"] for p in pairs]
    right = [p["right"] for p in pairs]

    random.shuffle(right)

    return left, right


# =========================
# GET QUESTIONS
# =========================
@router.get("/")
def get_questions(
    user_id: str,
    domain: str,
    difficulty: int,
    limit: int = 5,
    db: Session = Depends(get_db)   # ✅ FIXED
):
    questions = repo.get_unseen_questions(
        db, user_id, domain, difficulty, limit
    )

    if not questions:
        return []

    response = []

    for q in questions:
        data = {
            "id": str(q.id),
            "type": q.question_type,
            "question": q.question_text
        }

        if q.question_type == "mcq":
            options, answer_map = shuffle_mcq(q)
            data["options"] = options
            data["answer_map"] = answer_map  # ✅ IMPORTANT

        elif q.question_type == "tf":
            data["options"] = {"A": "True", "B": "False"}

        elif q.question_type == "match":
            data["pairs"] = q.pairs

        response.append(data)

    return response


# =========================
# GET SINGLE QUESTION
# =========================
@router.get("/{question_id}")
def get_question(question_id: str, db: Session = Depends(get_db)):
    q = repo.get_question_by_id(db, question_id)

    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    data = {
        "id": str(q.id),
        "type": q.question_type,
        "question": q.question_text
    }

    if q.question_type == "mcq":
        options, answer_map = shuffle_mcq(q)
        data["options"] = options
        data["answer_map"] = answer_map

    elif q.question_type == "tf":
        data["options"] = {"A": "True", "B": "False"}

    elif q.question_type == "match":
        data["pairs"] = q.pairs

    return data


# =========================
# SUBMIT ANSWER
# =========================
@router.post("/{question_id}/answer")
def submit_answer(
    question_id: str,
    user_id: UUID,
    body: dict,
    db: Session = Depends(get_db)
):
    q = repo.get_question_by_id(db, question_id)

    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    if "selected_answer" not in body:
        raise HTTPException(status_code=400, detail="selected_answer required")

    selected_answer = body["selected_answer"]

    # 🔥 HANDLE MCQ SHUFFLE CORRECTLY
    if q.question_type == "mcq":
        answer_map = body.get("answer_map", {})
        original_answer = answer_map.get(selected_answer)
        selected_answer = original_answer

    is_correct = repo.record_attempt(
        db,
        user_id,
        q,
        selected_answer
    )

    response = {
        "correct": is_correct
    }

    # return correct answer
    if q.question_type == "mcq":
        response["correct_answer"] = q.correct_answer
        response["explanation"] = q.explanation

    elif q.question_type == "tf":
        response["correct_answer"] = q.answer

    elif q.question_type == "match":
        response["correct_answer"] = q.correct_pairs

    return response


# =========================
# GET DOMAINS
# =========================
@router.get("/topics")
def get_domains(db: Session = Depends(get_db)):
    domains = db.query(Question.domain).distinct().all()
    return [d[0] for d in domains]