from storage.repo import save_question

mcq = {
    "question": "A consumer buys a defective blender. Which consumer right applies?",
    "options": [
        "Right to safety",
        "Right to profit",
        "Right to taxation",
        "Right to export"
    ],
    "answer": "A"
}

save_question(mcq)

print("Question saved successfully!")