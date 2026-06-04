"""
Re-tag existing women-related questions from consumer_law → women_rights
Uses keywords already present in the question text.
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import or_
from db import SessionLocal
from models.models import Question

db = SessionLocal()

# Keywords that identify women-related questions
keywords = [
    'women', 'woman', 'female', 'dowry', 'maternity', 'sexual harassment',
    'domestic violence', 'posh', 'gender', 'bride', 'wife', 'cruelty',
    'Protection Officer', 'protection order', 'shared household',
    'aggrieved person', 'respondent', 'service provider',
    'shelter home', 'medical facility',
]

# Build OR filter
filters = [Question.question_text.ilike(f'%{kw}%') for kw in keywords]

# Find matching questions
matches = db.query(Question).filter(or_(*filters)).all()

print(f"Found {len(matches)} women-related questions in the database.\n")

# Show sample
for i, q in enumerate(matches[:5]):
    print(f"  [{q.question_type}] {q.question_text[:100]}...")
print()

# Re-tag domain
count = 0
for q in matches:
    q.domain = "women_rights"
    count += 1

db.commit()
print(f"✅ Re-tagged {count} questions from 'consumer_law' → 'women_rights'")

# Verify
from collections import Counter
all_domains = db.query(Question.domain).all()
domain_counts = Counter([d[0] for d in all_domains])
print(f"\n=== Updated domain counts ===")
for domain, cnt in domain_counts.items():
    print(f"  {domain}: {cnt}")

db.close()
