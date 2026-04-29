"""
Utility functions for parsing and cleaning text from PDF chunks.
Used during the Qdrant loading process to clean up raw model output.
"""

import re
from typing import Optional


def clean_text(text: str) -> str:
    """
    Remove extra whitespace, newlines, and special characters
    from raw PDF-extracted text.
    """
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)   # collapse multiple spaces/newlines
    text = text.strip()
    return text


def validate_question_payload(payload: dict) -> bool:
    """
    Check that a Qdrant payload has all required fields before inserting into DB.
    Returns True if valid, False if any required field is missing or empty.

    Call this inside load_questions.py before each insert.
    """
    required_fields = ["question_text", "correct_answer", "topic", "difficulty", "question_type"]

    for field in required_fields:
        if not payload.get(field):
            print(f"  Skipping question — missing field: '{field}'")
            return False

    valid_types = ["mcq", "tf"]
    if payload["question_type"] not in valid_types:
        print(f"  Skipping question — invalid question_type: '{payload['question_type']}'")
        return False

    valid_difficulties = ["easy", "medium", "hard"]
    if payload["difficulty"] not in valid_difficulties:
        print(f"  Skipping question — invalid difficulty: '{payload['difficulty']}'")
        return False

    # MCQ must have options
    if payload["question_type"] == "mcq":
        options = payload.get("options")
        if not options or len(options) < 2:
            print(f"  Skipping MCQ question — missing or insufficient options")
            return False

    return True


def normalize_difficulty(raw: str) -> Optional[str]:
    """
    Normalize difficulty strings from the model to our expected values.
    Handles variations like 'Easy', 'EASY', 'easy level' etc.
    """
    raw = raw.lower().strip()
    if "easy" in raw:
        return "easy"
    if "medium" in raw or "moderate" in raw:
        return "medium"
    if "hard" in raw or "difficult" in raw:
        return "hard"
    return None


def normalize_question_type(raw: str) -> Optional[str]:
    """
    Normalize question type strings from the model.
    Handles variations like 'MCQ', 'multiple choice', 'true/false', 'T/F' etc.
    """
    raw = raw.lower().strip()
    if "mcq" in raw or "multiple" in raw or "choice" in raw:
        return "mcq"
    if "true" in raw or "false" in raw or "tf" in raw or "t/f" in raw:
        return "tf"
    return None
