import sys
sys.path.insert(0, '.')
from db import SessionLocal
from models.models import Question

db = SessionLocal()

keywords = ['women', 'woman', 'female', 'dowry', 'maternity', 'sexual harassment',
            'domestic violence', 'posh', 'gender', 'bride', 'wife', 'cruelty']

print("=== Searching for women's law related questions ===\n")
total = 0
for kw in keywords:
    count = db.query(Question).filter(Question.question_text.ilike(f'%{kw}%')).count()
    if count > 0:
        print(f'  "{kw}": {count} questions')
        total += count

print(f'\nTotal keyword matches: {total}')

# Also check domains
print('\n=== All distinct domains ===')
domains = db.query(Question.domain).distinct().all()
for d in domains:
    print(f'  {d[0]}')

# Sample
from sqlalchemy import or_
qs = db.query(Question).filter(
    or_(
        Question.question_text.ilike('%women%'),
        Question.question_text.ilike('%woman%'),
        Question.question_text.ilike('%dowry%'),
        Question.question_text.ilike('%domestic violence%'),
    )
).limit(5).all()

if qs:
    print('\n=== Sample matches ===')
    for q in qs:
        print(f'  [{q.question_type} | {q.domain}] {q.question_text[:150]}')
else:
    print('\nNo women-related questions found in the database.')

db.close()
