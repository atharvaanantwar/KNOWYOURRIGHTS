#pipelines/mcq_generation/generator.py
import json
import time


class MCQGenerator:
    def __init__(self, llm, max_retries=3):
        self.llm = llm
        self.max_retries = max_retries

    def _extract_json(self, text):
        try:
            start = text.find("{")
            end = text.rfind("}") + 1
            return json.loads(text[start:end])
        except:
            return None

    def generate(self, prompt):

        for attempt in range(self.max_retries + 1):
            try:
                response = self.llm.generate(prompt)

                try:
                    data = json.loads(response)
                except:
                    data = self._extract_json(response)

                if data and "options" in data:
                    return data

                raise ValueError("Invalid MCQ format")

            except Exception as e:
                print(f"⚠️ Attempt {attempt+1} failed: {e}")
                time.sleep(2 ** attempt)

        return None