#!/usr/bin/env python3
import sys
sys.path.insert(0, 'backend')

from backend.models import SessionLocal, Question, User

session = SessionLocal()

# Check tables exist
questions = session.query(Question).all()
print(f"✓ Questions in database: {len(questions)}")
for q in questions:
    print(f"  - {q.question[:50]}...")

users = session.query(User).all()
print(f"\n✓ Users in database: {len(users)}")

session.close()
print("\n✓ Database initialization verified!")
