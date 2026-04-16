#!/usr/bin/env python3
import backend.models as models
from backend.models import Base, engine, SessionLocal
from backend.models import Question

def init_database():
    print("Tables before:", Base.metadata.tables.keys())
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def populate_sample_data():
    session = SessionLocal()

    # Check if data already exists
    try:
        if session.query(Question).count() > 0:
            print("Sample data already exists!")
            session.close()
            return
    except Exception as e:
        print(f"Note: Could not check existing data: {e}")
        print("Proceeding to populate sample data...")

    # Sample questions
    sample_questions = [
        {
            "question": "What is Rahul's legal right when his smartphone stops working within 3 days?",
            "options": {
                "A": "He has no rights since electronics are non-returnable",
                "B": "He can demand a replacement or refund within 7 days",
                "C": "He must accept the loss and buy a new phone",
                "D": "He can only get store credit, not a refund"
            },
            "correct_answer": "B",
            "explanation": "Under the Consumer Protection Act 2019, consumers have the right to seek redressal against unfair trade practices. For defective products, consumers can demand replacement, refund, or compensation within a reasonable timeframe.",
            "domain": "Consumer Rights",
            "difficulty": "easy",
            "xp_reward": 10,
            "legal_reference": "Consumer Protection Act 2019 - Section 2(47)"
        },
        {
            "question": "Is it legally valid for a restaurant to add a mandatory 10% service charge without informing customers?",
            "options": {
                "A": "Yes, restaurants can charge whatever they want",
                "B": "No, service charge must be voluntary and clearly displayed",
                "C": "Only if mentioned in the menu",
                "D": "Yes, but customers can refuse to pay it"
            },
            "correct_answer": "B",
            "explanation": "Service charge is voluntary and cannot be forced upon consumers. The Consumer Affairs Ministry has clarified that customers can refuse to pay service charge if they are not satisfied with the service.",
            "domain": "Consumer Rights",
            "difficulty": "medium",
            "xp_reward": 25,
            "legal_reference": "Consumer Protection Act 2019 - Unfair Trade Practice"
        },
        {
            "question": "What does the law say about overtime compensation?",
            "options": {
                "A": "Employers can demand overtime without extra pay",
                "B": "Overtime must be paid at double the normal rate",
                "C": "Employees cannot refuse overtime work",
                "D": "Overtime is only applicable to factory workers"
            },
            "correct_answer": "B",
            "explanation": "Under labor laws, any work beyond normal working hours must be compensated at overtime rates, typically double the ordinary wage. Employees cannot be forced to work overtime, and refusal is not grounds for termination.",
            "domain": "Labor Law",
            "difficulty": "medium",
            "xp_reward": 25,
            "legal_reference": "Factories Act 1948 / Shops and Establishments Act"
        }
    ]

    for q_data in sample_questions:
        question = Question(**q_data)
        session.add(question)

    session.commit()
    print(f"Added {len(sample_questions)} sample questions!")
    session.close()

if __name__ == "__main__":
    init_database()
    populate_sample_data()