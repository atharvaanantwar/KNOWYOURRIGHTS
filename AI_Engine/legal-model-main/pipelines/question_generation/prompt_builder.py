# pipelines/question_generation/prompt_builder.py

def build_question_prompt(context: str, metadata: dict = None):

    section_info = ""
    difficulty_hint = ""
    is_definition = False

    # Prevent UnboundLocalError
    section = ""
    title = ""
    chapter = ""
    act_name = ""

    if metadata:
        section = metadata.get("section", "")
        title = metadata.get("section_title", "")
        chapter = metadata.get("chapter_title", "")
        act_name = metadata.get("act_name", "")

        if section or title or chapter:
            section_info = f"""
Section Information:
- Chapter: {chapter}
- Section: {section}
- Title: {title}
- Act Name: {act_name}
"""

        # 🔥 Difficulty hint generation
        hard_keywords = [
            "jurisdiction",
            "appeal",
            "power",
            "authority",
            "procedure",
            "investigation",
            "commercial",
            "liability",
            "exception",
            "mediation"
        ]

        if title and any(
            keyword in title.lower()
            for keyword in hard_keywords
        ):
            difficulty_hint = """
This section commonly produces MEDIUM or HARD questions.

Do NOT default to EASY.

If the question involves:
- exceptions
- jurisdiction
- powers of authorities
- investigations
- procedural requirements
- commercial-use distinctions

prefer MEDIUM or HARD difficulty.
"""

        # 🔥 Definition detection
        definition_titles = [
            "definitions",
            "consumer",
            "complaint",
            "goods",
            "service",
            "product",
            "advertisement",
            "manufacturer",
            "seller",
            "consumer rights"
        ]

        if title and any(
            keyword in title.lower()
            for keyword in definition_titles
        ):
            is_definition = True

    definition_instruction = ""

    if is_definition:
        definition_instruction = """
Special Instruction for Definition Sections:

Generate questions that test:

✔ whether a person qualifies under the definition
✔ whether a product qualifies under the definition
✔ whether an activity falls inside or outside the definition
✔ exceptions to the definition
✔ borderline cases

Avoid:
❌ asking the definition directly
❌ asking "What is a consumer?"
❌ asking "Define complaint"
"""
    return f"""
You are an expert legal quiz generator.

Your task is to generate HIGH-QUALITY, MCQ-ready questions strictly from the given legal context.

{section_info}

{difficulty_hint}


# METADATA AWARENESS

The current section being processed is:

Questions MUST be traceable directly to:

Section Reference:
Section {section}: {title}

When referring to a legal provision, use the complete section reference.

Good:
"According to Section 1: Short title, extent, commencement and application..."

Bad:
"According to Section 1..."

The ideal answer should be obtainable from this section alone.

{definition_instruction}

# 🔥 CORE GOAL
- Scenario-based questions are the MOST IMPORTANT
- Maintain HIGH realism and legal applicability

# QUESTION COUNT

Generate 3 HIGH-QUALITY questions whenever possible.

Preferred:
- 1 EASY
- 1 MEDIUM
- 1 HARD

Minimum:
- 3 questions

Return fewer only when the context genuinely lacks enough unique legal concepts.


Never generate fewer than 2 questions unless the section contains no meaningful legal content.

If no meaningful question can be generated:
return []

# 🔥 TYPE RULE (QUALITY FIRST)



Question types may include:

- scenario
- factual
- definition
- authority

SCENARIO REQUIREMENT:

Generate scenario questions whenever the section naturally supports them.

Preferred distribution:

- 1–2 scenario questions
- Remaining questions may be factual, authority, or definition questions

Do NOT force scenario questions when the section is primarily:

- powers
- appointments
- jurisdiction
- procedures
- meetings
- administrative provisions
- commissions
- councils

In such sections, authority and procedural questions are preferred.

FALLBACK:

If meaningful scenarios cannot be generated:

✔ generate factual questions
✔ generate authority questions
✔ generate applied-definition questions

STRICT:

- Do NOT generate multiple questions testing exactly the same concept.
- Each question must test a different aspect of the section.
- Avoid trivial recall questions whenever an applied question is possible.
- Do NOT return fewer than 2 questions unless the context is unusable.

# 🔥 TYPE DEFINITIONS
- "scenario": real-life situation + legal decision
- "factual": specific law-based question (non-trivial)
- "definition": conceptual understanding (prefer applied form)
- Authority questions should test:
✔ jurisdiction
✔ powers
✔ appointments
✔ investigations
✔ regulatory functions

# 🔥 SCENARIO QUALITY RULES (VERY STRICT)
- MUST include a person (e.g., Chetna, Atharva, Anjali, Arya)
- MUST describe a real-world situation (not theoretical)
- MUST involve an action/event (buying, hiring, advertising, etc.)
- MUST end with a legal decision, remedy, or applicability question

- Avoid repetitive patterns:
  ❌ "X buys product → defect → can they complain?"

- Ensure:
  ✔ Each scenario tests a DIFFERENT concept  
  ✔ Include edge cases or tricky interpretations where possible  
  ✔ Include incomplete/misleading info to test reasoning  
  ✔ Whenever mentioning section and title, use the full reference (e.g., "Section 1: Short title, extent, commencement and application")

# 🔥 REPETITION CONTROL (VERY IMPORTANT)

Avoid repeatedly using:

❌ defective product
❌ damaged goods
❌ seller refuses replacement
❌ warranty dispute
❌ product malfunction

Do not generate multiple questions using the same scenario pattern.

Use varied contexts:

✔ advertisements
✔ services
✔ online platforms
✔ commercial use
✔ authorities
✔ procedures
✔ jurisdiction
✔ investigations
✔ councils
✔ product liability
✔ consumer status
✔ unfair trade practices
✔ misleading claims
✔ product recalls
✔ regulatory powers
✔ appointments and qualifications
✔ meetings and procedures
✔ consumer councils
✔ e-commerce disputes

Prefer concepts that have not already appeared in earlier questions.

# 🔥 CONCEPT COVERAGE RULE

Within a single chunk:

- Every question must test a DIFFERENT legal concept.
- Do NOT generate multiple questions that merely rephrase the same rule.
- Prefer breadth over paraphrasing.

Bad:
Q1 Consumer definition
Q2 Another consumer definition scenario
Q3 Another consumer definition scenario

Good:
Q1 Consumer qualification
Q2 Commercial-use exception
Q3 Beneficiary of service
Q4 Online transaction inclusion
Q5 Borderline consumer case

When generating 2–3 questions:

✔ Cover different legal aspects from the chunk whenever possible
✔ Prefer distinct provisions, exceptions, powers, procedures, rights, liabilities, or definitions
✔ Avoid creating multiple questions that test the same sentence in different wording

# 🔥 DIFFICULTY CLASSIFICATION (LEGAL CONTEXT AWARE)

Classify each question based on reasoning complexity, NOT length.

🟢 EASY:
- Direct application of a single legal concept
- No ambiguity in facts
- Answer can be identified quickly from one rule
- No conflict or exception involved

Examples:
- Simple defect/service issue
- Basic consumer rights violation

---

🟡 MEDIUM:
- Requires interpretation of facts
- May involve 2 related concepts
- Slight ambiguity or incomplete information
- Requires applying law to a realistic situation

Examples:
- Consumer vs commercial use distinction
- Misleading advertisement with context
- Service deficiency vs defect confusion

---

🔴 HARD:
- Involves edge cases, exceptions, or conflicting rules
- Requires multi-step reasoning
- May include misleading or partial information
- Requires careful legal judgment

Examples:
- Contract clauses vs consumer rights
- Liability involving multiple parties
- Exceptions to general definitions

---

# 🔥 DIFFICULTY BALANCING RULE

Do NOT default to "medium".

Choose the true difficulty of the question.

Follow the distribution rule defined below.

If the section contains:
✔ exceptions
✔ jurisdiction issues
✔ overlapping authorities
✔ procedural conflicts
✔ commercial-use distinctions
✔ multiple conditions

Prefer MEDIUM or HARD.

Do not downgrade difficult questions to medium.

---

🔥 SELF-CONTAINED QUESTION RULE

Every question must be understandable without seeing the original legal document.

Never use:
- this Act
- the Act
- this law
- the legislation
- the authority

Instead:
- use the actual Act name when relevant
- use the full authority name when relevant

Bad:
"under this Act"

Good:
"under the Consumer Protection Act, 2019"
---

# 🔥 DIFFICULTY SIGNALS (USE THESE HINTS)

Increase difficulty if question includes:
- "contract", "liability", "exception", "misleading", "commercial use"
- multiple parties involved
- conflicting claims

Decrease difficulty if:
- single action + single rule
- obvious violation or outcome

---
# 🔥 DISTRIBUTION RULE (STRICT)

For every generated set:

EXACTLY:

- 1 EASY
- 1 MEDIUM
- 1 HARD

If only 2 questions are generated:

- 1 EASY
- 1 MEDIUM


Difficulty must be intentionally assigned.

Do NOT classify all questions as medium.

The HARD question should preferably involve:

✔ exceptions
✔ jurisdiction
✔ procedural requirements
✔ commercial-purpose distinctions
✔ multiple conditions
✔ overlapping authorities
✔ product liability
✔ appeals
✔ limitation periods
✔ misleading facts requiring careful legal reasoning

The EASY questions should be direct applications of a single legal rule.

The MEDIUM questions should require interpretation of facts and realistic legal application.

Ensure every generated set contains a visible progression from EASY → MEDIUM → HARD.

# 🔥 QUESTION DESIGN RULES
- Use simple, plain English
- Avoid legal jargon unless needed
- Avoid YES/NO questions
- Prefer:
  ✔ "What is the most appropriate remedy?"
  ✔ "Which legal provision applies?"
  ✔ "What right does the consumer have?"

- Each question must be:
  ✔ self-contained  
  ✔ unambiguous  
  ✔ MCQ-ready (clear correct answer)

# 🔥 STRICT CONSTRAINTS
- Use ONLY the provided context
- Do NOT add external legal knowledge
- Do NOT copy text directly
- Do NOT repeat concepts

# 🔥 BAD EXAMPLES (DO NOT GENERATE)
- What is a consumer?
- Define complaint
- What is unfair trade practice?

# 🔥 GOOD EXAMPLE
- Raj purchases a mobile phone for personal use, but it stops working within a week. What remedy is most appropriate under the Act?

# 🔥 FINAL VALIDATION (MANDATORY)

Before output:

- Scenario questions are NOT automatically medium.

  A scenario involving:
  ✔ jurisdiction
  ✔ exceptions
  ✔ procedural requirements
  ✔ competing authorities

  should be classified as HARD.
- Ensure scenario questions are meaningful, diverse, and non-repetitive
- Ensure no dominance of trivial, definition-only, or recall-based questions
- Ensure all rules (type, difficulty, quality) are followed
- Ensure difficulty levels are reasonably distributed (not all same)

If any condition is violated:
→ Regenerate the entire output

# 🔥 OUTPUT FORMAT (STRICT JSON ONLY)

[
  {{
    "question": "...",
    "type": "scenario",
    "difficulty": "easy"
  }},
  {{
    "question": "...",
    "type": "factual",
    "difficulty": "easy"
  }},
  {{
    "question": "...",
    "type": "definition",
    "difficulty": "medium"
  }},
  {{
    "question": "...",
    "type": "authority",
    "difficulty": "medium"
  }},
  {{
    "question": "...",
    "type": "scenario",
    "difficulty": "hard"
  }}
]

- Output MUST be valid JSON
- Do NOT include explanations
- Do NOT include numbering
- Do NOT include any text outside JSON

Context:
{context}
"""

def build_true_false_prompt(context: str, metadata: dict = None):
    section_info = ""

    if metadata:
        act_name = metadata.get("act_name", "")
        section = metadata.get("section", "")
        title = metadata.get("section_title", "")
        chapter = metadata.get("chapter_title", "")

        if act_name or section or title or chapter:
            section_info = f"""
Legal Context Information:
- Act Name: {act_name}
- Chapter: {chapter}
- Section: {section}
- Section Title: {title}
"""

            # Add metadata directly into context
            context = f"""
Act Name: {act_name}
Chapter: {chapter}
Section: {section}
Section Title: {title}

{context}
"""

    return f"""
You are an expert legal educator creating True/False questions from a legal document.

Your task is to generate HIGH-QUALITY True/False statements STRICTLY from the provided legal context.

LEGAL CONTEXT:
{section_info}

SOURCE TEXT:
{context}

# QUESTION COUNT

Generate EXACTLY 2 True/False questions.

If the chunk does not contain enough information for 2 meaningful questions:

* Generate 1 question.
* Never invent legal concepts.

# SOURCE TRACEABILITY RULE

Every statement must be answerable using ONLY the provided chunk.

Before generating a statement, ask:

"Can this statement be verified directly from the provided text?"

If NO:
Do NOT generate it.

The source text is the ONLY authority.

# LEGAL ACCURACY RULE

* Use ONLY information explicitly stated in the context.
* Do NOT use external legal knowledge.
* Do NOT introduce legal concepts not present in the chunk.
* Do NOT combine concepts from different sections.
* Do NOT hallucinate penalties, procedures, rights, authorities, or remedies.

# TRUE/FALSE DESIGN RULES

Generate:

* 1 TRUE statement
* 1 FALSE statement

The FALSE statement must be:

✔ realistic
✔ legally plausible
✔ based on a modification of the actual rule

Avoid:

❌ absurd statements
❌ obviously wrong statements
❌ statements unrelated to the context

Good FALSE example:

Actual rule:
"The Commission may order replacement of goods."

False statement:
"The Commission may only order monetary compensation and cannot order replacement."

Bad FALSE example:

"The Commission may regulate international trade."

# CONCEPT COVERAGE RULE

If generating 2 questions:

* Each question must test a DIFFERENT concept.
* Do not simply rephrase the same rule.

Examples:

Good:
Q1 Powers of Authority
Q2 Qualification Requirement

Bad:
Q1 Authority can investigate.
Q2 Authority has power to investigate.

# DIFFICULTY RULE

Question 1:

* EASY

Question 2:

* MEDIUM

If the chunk contains:

* exceptions
* jurisdiction
* appeals
* limitation periods
* liability
* procedural requirements

Question 2 may be HARD instead of MEDIUM.

# EXPLANATION RULE

Every question MUST include an explanation.

The explanation must:

* Explain why the statement is TRUE or FALSE.
* Reference the legal rule found in the chunk.
* Be 1–3 sentences.
* Use simple language.
* Not rely on external legal knowledge.

# OUTPUT FORMAT (STRICT JSON ONLY)

[
{{
"statement": "Statement text",
"answer": true,
"difficulty": "easy",
"explanation": "Explanation based only on the provided context."
}},
{{
"statement": "Statement text",
"answer": false,
"difficulty": "medium",
"explanation": "Explanation based only on the provided context."
}}
]

* Output MUST be valid JSON.
* Do NOT include markdown.
* Do NOT include numbering.
* Do NOT include text outside JSON.

"""
# 🔥 NEW (match_pair)
def build_match_pair_prompt(
    context: str,
    metadata: dict = None
):

    section_info = ""

    if metadata:
        act_name = metadata.get("act_name", "")
        section = metadata.get("section", "")
        title = metadata.get("section_title", "")
        chapter = metadata.get("chapter_title", "")

        if act_name or section or title or chapter:
            section_info = f"""
Legal Context Information:
- Act Name: {act_name}
- Chapter: {chapter}
- Section: {section}
- Section Title: {title}
"""

            # Add metadata directly into context
            context = f"""
Act Name: {act_name}
Chapter: {chapter}
Section: {section}
Section Title: {title}

{context}
"""

    return f"""
You are an expert legal quiz generator.

Generate a MATCH-THE-PAIR question from the given context.

# 🔥 LANGUAGE RULE (VERY IMPORTANT)

- Use SIMPLE, everyday English
- Assume the user has NO legal background
- Avoid complex legal jargon

- Keep phrases:
  ✔ short
  ✔ clear
  ✔ easy to match quickly

# RULES

- If you cannot generate 2 good pairs, generate at least 1 valid pairs
- Each pair must be clearly correct and unambiguous

# 🔥 MAKE IT GAME-LEVEL QUALITY

- Do NOT create direct or obvious pairs
- Make at least 2 pairs slightly confusing or similar

- Example of GOOD pairs:
  ✔ "Defect" vs "Deficiency"
  ✔ "Manufacturer" vs "Product seller"

- Avoid simple factual pairs like:
  ❌ "Year → 2019"
  ❌ "Act → Law"

- Make options competitive:
  ✔ meanings should overlap slightly
  ✔ require thinking to match correctly

- Ensure that if the right side is shuffled, matching is not obvious

# FORMAT

- Left side: terms, concepts, or short scenarios
- Right side: definitions, meanings, or outcomes

# OUTPUT FORMAT (STRICT JSON)

{{
  "type": "match_pair",
  "pairs": [
    {{"left": "Term 1", "right": "Meaning 1"}},
    {{"left": "Term 2", "right": "Meaning 2"}},
    {{"left": "Term 3", "right": "Meaning 3"}},
    {{"left": "Term 4", "right": "Meaning 4"}}
  ],
  "correct_pairs": {{
    "Term 1": "Meaning 1",
    "Term 2": "Meaning 2",
    "Term 3": "Meaning 3",
    "Term 4": "Meaning 4"
  }},
  "difficulty": "easy|medium|hard"
}}

# IMPORTANT

- "pairs" should contain the correct matches
- "correct_pairs" must map left → right exactly
- Do NOT include long explanations
- Output ONLY JSON

Context:
{context}
"""