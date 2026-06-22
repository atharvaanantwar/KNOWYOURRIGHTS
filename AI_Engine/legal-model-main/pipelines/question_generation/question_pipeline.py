# pipelines/question_generation/question_pipeline.py

import time

from pipelines.question_generation.prompt_builder import build_question_prompt


class QuestionPipeline:
    def __init__(self, generator, deduplicator, db, mode="mcq"):
        self.generator = generator
        self.deduplicator = deduplicator
        self.db = db
        self.mode = mode

    # ---------------- SIZE CHECK ---------------- #

    def is_small_chunk(self, text, limit=1200):
        return len(text.split()) < limit

    # ---------------- SPLIT LARGE CHUNK ---------------- #

    def split_large_chunk(self, text, max_words=800):
        words = text.split()
        parts = []

        for i in range(0, len(words), max_words):
            part = " ".join(words[i:i + max_words])
            parts.append(part)

        return parts

    # ---------------- SLIDING WINDOW ---------------- #

    def sliding_window(self, parts, window_size=2, overlap=1):
        windows = []
        i = 0

        while i < len(parts):
            window = parts[i:i + window_size]
            windows.append(" ".join(window))

            i += (window_size - overlap)

            if window_size - overlap <= 0:
                break

        return windows

    # ---------------- MAIN PIPELINE ---------------- #

    def run(self, chunks):

        all_questions = []

        for chunk in chunks:
            text = chunk["text"]
            metadata = chunk.get("metadata", {})

            # -------- STEP 1: Context Strategy -------- #

            if self.is_small_chunk(text):
                contexts = [text]
                metadata = chunk.get("metadata", {})
            else:
                parts = self.split_large_chunk(text)
                contexts = self.sliding_window(parts, window_size=2, overlap=1)

            # -------- STEP 2: Generate -------- #

            for context in contexts:

                # 🔥 PROMPT SWITCH
                if self.mode == "mcq":
                        prompt = build_question_prompt(
                            context=context,
                            metadata=metadata
                        )

                elif self.mode == "true_false":
                    from pipelines.question_generation.prompt_builder import build_true_false_prompt
                    prompt = build_true_false_prompt(
                        context=context,
                        metadata=metadata
)

                elif self.mode == "match_pair":
                    from pipelines.question_generation.prompt_builder import build_match_pair_prompt
                    prompt = build_match_pair_prompt(
                        context=context,
                        metadata=metadata
                    )

                else:
                    raise ValueError(f"Invalid mode: {self.mode}")

                try:
                    questions = self.generator.generate(prompt)
                except Exception as e:
                    print(f"❌ LLM Error: {e}")
                    continue

                time.sleep(1)

                # -------- STEP 3: Process Output -------- #

                for q_obj in questions:

                    # ================= MATCH_PAIR ================= #
                    if isinstance(q_obj, dict) and q_obj.get("type") == "match_pair":

                        pairs = q_obj.get("pairs", [])
                        correct_pairs = q_obj.get("correct_pairs", {})
                        q_difficulty = q_obj.get("difficulty", "medium")

                        if not pairs or not correct_pairs:
                            continue

                        # 🔥 dedup check
                        if self.deduplicator.is_duplicate({
                            "type": "match_pair",
                            "pairs": pairs,
                            "difficulty": q_difficulty
                        }):
                            continue
                        

                        if metadata.get("section") and metadata.get("section_title"):
                            metadata["section_reference"] = (
                                f"Section {metadata['section']}: "
                                f"{metadata['section_title']}"
                            )
                            
                        question_obj = {
                            "type": "match_pair",
                            "pairs": pairs,
                            "correct_pairs": correct_pairs,
                            "difficulty": q_difficulty,
                            "used": False,
                            "metadata": metadata
                        }

                        self.db.add_question(question_obj)
                        all_questions.append(question_obj)

                        continue  # skip MCQ/T-F logic

                    # ================= MCQ + TRUE/FALSE ================= #

                    if isinstance(q_obj, dict):
                        q_text = q_obj.get("question", "")
                        q_type = q_obj.get("type", "scenario")
                        q_difficulty = q_obj.get("difficulty", "medium")
                        q_answer = q_obj.get("answer", None)

                        if q_difficulty not in ["easy", "medium", "hard"]:
                            q_difficulty = "medium"

                    else:
                        q_text = q_obj
                        q_type = "scenario"
                        q_difficulty = "medium"
                        q_answer = None

                    if not q_text or not isinstance(q_text, str):
                        continue

                    # 🔥 dedup check
                    if self.deduplicator.is_duplicate({
                        "question": q_text,
                        "type": q_type,
                        "difficulty": q_difficulty
                    }):
                        continue

                    question_obj = {
                        "question": q_text,
                        "type": q_type,
                        "difficulty": q_difficulty,
                        "used": False,
                        "metadata": metadata
                    }

                    # 🔥 ONLY for True/False
                    if self.mode == "true_false":
                        if isinstance(q_answer, bool):
                            question_obj["answer"] = q_answer
                        else:
                            continue

                    self.db.add_question(question_obj)
                    all_questions.append(question_obj)

        return all_questions