def validate_mcq(result):
    try:
        # must be dict
        if not isinstance(result, dict):
            return False

        # required keys
        required_keys = {"question", "options", "correct_answer", "explanation"}
        if not required_keys.issubset(result.keys()):
            return False

        # options must be dict with A-D
        if not isinstance(result.get("options"), dict):
            return False

        if set(result["options"].keys()) != {"A", "B", "C", "D"}:
            return False

        # correct answer must be A/B/C/D
        if result.get("correct_answer") not in {"A", "B", "C", "D"}:
            return False

        return True

    except Exception:
        return False