import json
import os


class QuestionDB:
    def __init__(self, file_path="data/questions.json"):
        self.file_path = file_path
        self._ensure_file()

    def _ensure_file(self):
        # 🔥 REQUIRED FIX: create folder if it doesn't exist
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

        if not os.path.exists(self.file_path):
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data):
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    # ---------------- CRUD ---------------- #

    def add_question(self, question_obj):
        # 🔥 NEW: ensure difficulty exists (fallback safety)
        if "difficulty" not in question_obj:
            question_obj["difficulty"] = "medium"

        data = self._read()
        data.append(question_obj)
        self._write(data)

    def get_all_questions(self):
        return self._read()

    def get_unused_questions(self):
        return [q for q in self._read() if not q.get("used", False)]

    def mark_used(self, question_id):
        data = self._read()
        for q in data:
            if q.get("id") == question_id:  # 🔥 safer access
                q["used"] = True
        self._write(data)

    # ---------------- NEW HELPERS (OPTIONAL BUT USEFUL) ---------------- #

    def get_by_difficulty(self, level):
        """
        Get questions by difficulty: easy / medium / hard
        """
        return [q for q in self._read() if q.get("difficulty") == level]

    def get_by_type(self, q_type):
        """
        Get questions by type: scenario / factual / definition / authority
        """
        return [q for q in self._read() if q.get("type") == q_type]