import sqlite3

conn = sqlite3.connect("quiz.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    answer TEXT
)
""")

conn.commit()

def save_question(mcq):

    cursor.execute("""
    INSERT INTO questions (question, option_a, option_b, option_c, option_d, answer)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        mcq["question"],
        mcq["options"][0],
        mcq["options"][1],
        mcq["options"][2],
        mcq["options"][3],
        mcq["answer"]
    ))

    conn.commit()