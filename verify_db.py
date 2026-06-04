#!/usr/bin/env python3
import sys
import os
from dotenv import load_dotenv

# Load database environment variables from backend/.env
dotenv_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
load_dotenv(dotenv_path)

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from db import SessionLocal
from models.models import Question, User

session = SessionLocal()

try:
    # Check tables exist and query questions
    questions = session.query(Question).all()
    print(f"[OK] Questions in database: {len(questions)}")
    for q in questions:
        print(f"  - {q.question_text[:50]}...")

    users = session.query(User).all()
    print(f"\n[OK] Users in database: {len(users)}")
    print("\n[OK] Database initialization verified!")
except Exception as e:
    print(f"[ERROR] Error verifying database: {e}")
finally:
    session.close()

