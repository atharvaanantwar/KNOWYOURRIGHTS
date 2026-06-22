import json
import hashlib
from sqlalchemy.exc import IntegrityError

from db import SessionLocal
from models.models import Question


# =========================
# UTILS
# =========================
def generate_hash(text: str):
    return hashlib.sha256(text.encode()).hexdigest()


def map_difficulty(level: str):
    return {
        "easy": 1,
        "medium": 2,
        "hard": 3
    }[level.lower()]


def map_type(t):
    if t == "true_false":
        return "tf"
    elif t == "match_pair":
        return "match"
    else:
        # everything else is MCQ
        return "mcq"


# =========================
# LOADER
# =========================
def load_file(filepath, db, domain_name):
    import os
    if not os.path.exists(filepath):
        print(f"⚠️ File not found: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    inserted = 0
    skipped = 0

    for q in data:
        try:
            q_type = map_type(q["type"])
            difficulty = map_difficulty(q["difficulty"])
            question_text = q.get("question", "Match the following")

            # 🔐 content hash (important)
            if q_type == "match":
                hash_input = json.dumps(q["pairs"], sort_keys=True)
            else:
                hash_input = question_text

            content_hash = generate_hash(hash_input)

            # 🧱 Base object
            question = Question(
                question_type=q_type,
                domain=domain_name,
                difficulty=difficulty,
                question_text=question_text,
                extra_metadata=q.get("metadata"),
                content_hash=content_hash
            )

            # =========================
            # TYPE-SPECIFIC LOGIC
            # =========================
            if q_type == "tf":
                question.answer = q["answer"]
                question.explanation = q.get("explanation")

            elif q_type == "mcq":
                question.options = q.get("options")

                # handle different keys
                question.correct_answer = (
                    q.get("correct_answer") or q.get("answer")
                )

                question.explanation = q.get("explanation")

            elif q_type == "match":
                question.pairs = q["pairs"]
                question.correct_pairs = q["correct_pairs"]
                question.explanation = q.get("explanation")

            # =========================
            db.add(question)
            db.commit()
            inserted += 1

        except IntegrityError:
            db.rollback()
            # Update domain if it changed
            existing = db.query(Question).filter_by(content_hash=content_hash).first()
            if existing and existing.domain != domain_name:
                existing.domain = domain_name
                db.commit()
            skipped += 1

        except Exception as e:
            db.rollback()
            print(f"❌ Error: {e}")
            skipped += 1

    print(f"📁 {filepath} → Inserted: {inserted}, Skipped: {skipped}")


# =========================
# MAIN
# =========================
def main():
    db = SessionLocal()

    print("🚀 Loading questions...")

    load_file("data/consumer_rights_tf.json", db, "consumer_law")
    load_file("data/consumer_rights_mcq.json", db, "consumer_law")
    load_file("data/consumer_rights_match_pair.json", db, "consumer_law")

    load_file("data/women_safety_tf.json", db, "women_safety")
    load_file("data/women_safety_mcq.json", db, "women_safety")
    load_file("data/women_safety_match_pair.json", db, "women_safety")

    db.close()

    print("✅ Done loading questions!")


if __name__ == "__main__":
    main()
