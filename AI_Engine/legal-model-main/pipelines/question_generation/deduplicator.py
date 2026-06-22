# pipelines/question_generation/deduplicator.py
import re


class Deduplicator:
    def __init__(self, embedder, vectordb, threshold=0.85):
        self.embedder = embedder
        self.vectordb = vectordb
        self.threshold = threshold

        self.seen_texts = set()

    # ---------------- NORMALIZATION ---------------- #

    def normalize(self, text):
        text = text.lower().strip()
        text = re.sub(r"[^\w\s]", "", text)
        return text

    # ---------------- HELPER FOR MATCH_PAIR ---------------- #

    def _build_match_pair_text(self, pairs):
        """
        Convert match pairs into a comparable string
        """
        parts = []
        for p in pairs:
            left = p.get("left", "")
            right = p.get("right", "")
            parts.append(f"{left} - {right}")
        return " | ".join(parts)

    # ---------------- DUPLICATE CHECK ---------------- #

    def is_duplicate(self, question):

        if isinstance(question, dict):
            q_type = question.get("type")
            q_difficulty = question.get("difficulty")

            # 🔥 HANDLE MATCH_PAIR
            if q_type == "match_pair":
                pairs = question.get("pairs", [])
                q_text = self._build_match_pair_text(pairs)
            else:
                q_text = question.get("question", "")

        else:
            q_text = question
            q_type = None
            q_difficulty = None

        if not q_text or not isinstance(q_text, str):
            return False

        # -------- STEP 1: Exact match -------- #
        q_norm = self.normalize(q_text)

        if q_norm in self.seen_texts:
            return True

        # -------- STEP 2: Embed -------- #
        try:
            emb = self.embedder.embed(q_text)
        except Exception as e:
            print(f"⚠️ Embedding error: {e}")
            return False

        # -------- STEP 3: Search in Qdrant -------- #
        try:
            results = self.vectordb.search(emb, k=3)
        except Exception as e:
            print(f"⚠️ Vector DB search error: {e}")
            results = []

        for r in results:
            score = getattr(r, "score", None)
            payload = getattr(r, "payload", {})

            if (
                score is not None
                and score >= self.threshold
                and payload.get("type") == q_type
            ):
                return True

        # -------- STEP 4: Store -------- #
        try:
            self.vectordb.add(
                vector=emb,
                payload={
                    "question": q_text,
                    "type": q_type,
                    "difficulty": q_difficulty
                }
            )
        except Exception as e:
            print(f"⚠️ Vector DB insert error: {e}")

        self.seen_texts.add(q_norm)

        return False

    # ---------------- BULK FILTER ---------------- #

    def filter_questions(self, questions):
        unique_questions = []

        for q in questions:

            if isinstance(q, dict):
                q_type = q.get("type")

                if q_type == "match_pair":
                    q_text = self._build_match_pair_text(q.get("pairs", []))
                else:
                    q_text = q.get("question", "")
            else:
                q_text = q

            if not q_text or not isinstance(q_text, str):
                continue

            if not self.is_duplicate(q):
                unique_questions.append(q)

        return unique_questions