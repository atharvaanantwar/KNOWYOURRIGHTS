import json
import time


class QuestionGenerator:
    def __init__(self, llm, max_retries=3):
        self.llm = llm
        self.max_retries = max_retries

    # ---------------- CLEAN RESPONSE ---------------- #

    def _extract_json(self, text):
        try:
            # 🔥 remove markdown ```json ```
            if "```" in text:
                text = text.strip()

                # remove starting ```json or ```
                text = text.replace("```json", "").replace("```", "").strip()

            # 🔥 Try direct JSON load first
            try:
                return json.loads(text)
            except:
                pass

            # 🔥 Extract JSON object {}
            start_obj = text.find("{")
            end_obj = text.rfind("}") + 1

            if start_obj != -1 and end_obj != 0:
                json_str = text[start_obj:end_obj]
                return json.loads(json_str)

            # 🔥 Extract JSON array []
            start_arr = text.find("[")
            end_arr = text.rfind("]") + 1

            if start_arr != -1 and end_arr != 0:
                json_str = text[start_arr:end_arr]
                return json.loads(json_str)

            return None

        except Exception:
            return None

    # ---------------- VALIDATE OUTPUT ---------------- #

    def _validate_questions(self, questions):
        """
        Supports:
        - MCQ (list)
        - True/False (list)
        - Match Pair (single dict)
        """

        # 🔥 MATCH_PAIR (single dict case)
        # 🔥 RELAXED MATCH_PAIR VALIDATION
        if isinstance(questions, dict):
            q_type = questions.get("type")

            if q_type == "match_pair":
                pairs = questions.get("pairs", [])
                correct_pairs = questions.get("correct_pairs", {})
                difficulty = questions.get("difficulty", "medium")

                # 🔥 allow even partial valid output
                if isinstance(pairs, list) and len(pairs) >= 2:

                    # auto-fix correct_pairs if missing
                    if not isinstance(correct_pairs, dict) or not correct_pairs:
                        correct_pairs = {
                            p.get("left"): p.get("right")
                            for p in pairs if "left" in p and "right" in p
                        }

                    return [{
                        "type": "match_pair",
                        "pairs": pairs[:4],  # limit to 4
                        "correct_pairs": correct_pairs,
                        "difficulty": difficulty
                    }]

            return []

        # 🔥 EXISTING LOGIC (MCQ + T/F)
        if not isinstance(questions, list):
            return []

        cleaned = []

        for q in questions:

            # ---------------- DICT FORMAT ---------------- #
            if isinstance(q, dict):
                question_text = q.get("question", "").strip()
                q_type = q.get("type", "").strip()
                q_difficulty = q.get("difficulty", "medium").strip()
                q_answer = q.get("answer", None)

                # validate difficulty
                if q_difficulty not in ["easy", "medium", "hard"]:
                    q_difficulty = "medium"

                # ---------------- TRUE/FALSE ---------------- #
                if q_type == "true_false":
                    if len(question_text) > 10 and isinstance(q_answer, bool):
                        cleaned.append({
                            "question": question_text,
                            "type": "true_false",
                            "difficulty": q_difficulty,
                            "answer": q_answer
                        })

                # ---------------- MCQ ---------------- #
                elif q_type in ["scenario", "factual", "definition", "authority"]:
                    if len(question_text) > 10:
                        cleaned.append({
                            "question": question_text,
                            "type": q_type,
                            "difficulty": q_difficulty
                        })

            # ---------------- STRING FALLBACK ---------------- #
            elif isinstance(q, str):
                q = q.strip()

                if len(q) > 10:
                    cleaned.append({
                        "question": q,
                        "type": "scenario",
                        "difficulty": "medium"
                    })

        return cleaned

    # ---------------- MAIN GENERATE ---------------- #

    def generate(self, prompt):

        for attempt in range(self.max_retries + 1):

            try:
                response = self.llm.generate(prompt)

                # print("🔍 RAW LLM RESPONSE:", response)

                if not response:
                    raise ValueError("Empty response from LLM")

                # Step 1: direct JSON
                try:
                    questions = json.loads(response)
                except:
                    questions = self._extract_json(response)

                # Step 2: validate
                questions = self._validate_questions(questions)

                if questions:
                    return questions

                else:
                    raise ValueError("Invalid or empty question list")

            except Exception as e:
                print(f"⚠️ Attempt {attempt+1} failed: {e}")

                wait_time = 2 ** attempt
                print(f"⏳ Waiting {wait_time}s before retry...")
                time.sleep(wait_time)

        print("❌ Failed to generate valid questions after retries")
        return []