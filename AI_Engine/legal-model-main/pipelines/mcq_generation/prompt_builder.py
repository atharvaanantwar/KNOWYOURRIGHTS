#pipelines/mcq_generation/prompt_builder.py
def build_mcq_prompt(question_obj, context, metadata=None):

    question = question_obj["question"]
    difficulty = question_obj.get("difficulty", "medium")

    section_info = ""

    if metadata:
        act_name = metadata.get("act_name", "")
        section = metadata.get("section", "")
        title = metadata.get("section_title", "")
        chapter = metadata.get("chapter_title", "")

        section_info = f"""
Legal Context Information:
- Act Name: {act_name}
- Chapter: {chapter}
- Section: {section}
- Section Title: {title}
"""
        
        context = f"""
Act Name: {act_name}
Chapter: {chapter}
Section: {section}
Section Title: {title}

{context}
"""

    return f"""
You are an expert legal MCQ generator for a quiz game.

Use ONLY the provided context.

{section_info}

# ACT ISOLATION RULE

Generate options ONLY from the Act specified above.

Do NOT use:
❌ concepts from other Acts
❌ authorities from other Acts
❌ remedies from other Acts
❌ procedures from other Acts

All options must belong to the same Act and same legal domain.

Context:
{context}

Question:
{question}

Difficulty: {difficulty}

Instructions:
- Generate exactly 4 options (A-D)
- Only ONE correct answer
- Use simple, clear language suitable for fast quiz gameplay

🔥 CRITICAL RULES:
- ALL 4 options must be equally plausible
- Avoid generic or obviously wrong options
- At least 2 incorrect options must be partially correct but subtly wrong
- Options must be close enough that elimination is difficult
- Keep options similar in length and structure
- Avoid long sentences (max ~15-18 words per option)

- Do NOT rely on obvious keywords to reveal the answer
- Do NOT make the correct option noticeably more detailed than others

🎯 DIFFICULTY CONTROL:
- easy → 1-2 options clearly weaker
- medium → all options plausible, 1 clearly correct
- hard → multiple options appear correct, only subtle distinction

🔥 LEGAL QUALITY RULES:
- Distractors must come from related legal concepts
- Avoid absurd or obviously incorrect choices
- Authority questions → use competing authorities
- Jurisdiction questions → use competing forums
- Definition questions → use borderline interpretations
- Procedure questions → use realistic procedural alternatives

📌 FORMAT:
- Return options as dictionary (A, B, C, D)
- correct_answer must be ONLY the key (A/B/C/D)

📌 EXPLANATION:
- Clearly justify the correct answer
- Briefly explain why each incorrect option is wrong

Output (JSON):
{{
  "question": "...",
  "options": {{
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  }},
  "correct_answer": "A",
  "explanation": "..."
}}
"""