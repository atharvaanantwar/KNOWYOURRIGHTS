import re

def parse_mcq(text: str):

    question_match = re.search(r"Question:\s*(.*)", text, re.DOTALL)

    option_a = re.search(r"A\)\s*(.*)", text)
    option_b = re.search(r"B\)\s*(.*)", text)
    option_c = re.search(r"C\)\s*(.*)", text)
    option_d = re.search(r"D\)\s*(.*)", text)

    answer_match = re.search(r"Correct Answer:\s*([A-D])", text)

    if not all([question_match, option_a, option_b, option_c, option_d, answer_match]):
        raise ValueError("Invalid MCQ format")

    question = question_match.group(1).split("A)")[0].strip()

    options = [
        option_a.group(1).strip(),
        option_b.group(1).strip(),
        option_c.group(1).strip(),
        option_d.group(1).strip()
    ]

    answer = answer_match.group(1)

    return {
        "question": question,
        "options": options,
        "answer": answer
    }