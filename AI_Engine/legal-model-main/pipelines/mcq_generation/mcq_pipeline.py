# pipelines/mcq_generation/mcq_pipeline.py

from pipelines.mcq_generation.prompt_builder import build_mcq_prompt
from pipelines.Retrival.Re_ranking import ReRanker
from pipelines.mcq_generation.validate_mcq import validate_mcq


class MCQPipeline:
    def __init__(self, generator, vectordb, embedder):
        self.generator = generator
        self.vectordb = vectordb
        self.embedder = embedder

        self.reranker = ReRanker()

    def run(self, questions):

        mcqs = []

        for q in questions:

            metadata = q.get("metadata", {})
            act_name = metadata.get("act_name")

            # ---------------- STEP 1: Embed Question ---------------- #

            query_vec = self.embedder.embed(
                f"query: {q['question']}"
            )

            # ---------------- STEP 2: Retrieve Chunks ---------------- #

            results = self.vectordb.search(
                query_vec,
                k=15
            )

            # ---------------- STEP 3: Act Filtering ---------------- #

            if act_name:

                filtered_results = []

                for r in results:

                    payload_act = (
                        r.payload.get("act_name")
                        or r.payload.get("metadata", {}).get("act_name")
                    )

                    if payload_act == act_name:
                        filtered_results.append(r)

                results = filtered_results

            if not results:
                print(
                    f"❌ No matching chunks found for Act: {act_name}"
                )
                continue

            # ---------------- STEP 4: Re-rank ---------------- #

            pairs = [
                (
                    q["question"],
                    r.payload.get("text", "")
                )
                for r in results
            ]

            scores = self.reranker.model.predict(pairs)

            ranked = sorted(
                zip(results, scores),
                key=lambda x: x[1],
                reverse=True
            )

            # ---------------- STEP 5: Take Best Chunks ---------------- #

            top_results = [
                r
                for r, score in ranked
                if score > 0.6
            ][:3]

            # fallback if all scores are low
            if not top_results:
                top_results = [r for r, _ in ranked[:3]]

            # ---------------- STEP 6: Build Context ---------------- #

            context = "\n\n".join(
                r.payload.get("text", "")
                for r in top_results
            )

            # ---------------- STEP 7: Build Prompt ---------------- #

            prompt = build_mcq_prompt(
                q,
                context,
                metadata
            )

            # ---------------- STEP 8: Generate MCQ ---------------- #

            try:
                result = self.generator.generate(prompt)

            except Exception as e:
                print(
                    f"❌ MCQ Generation Error: {e}"
                )
                continue

            # ---------------- STEP 9: Validate ---------------- #

            if not result:
                continue

            if not validate_mcq(result):
                print(
                    f"❌ Invalid MCQ: "
                    f"{q['question'][:60]}"
                )
                continue

            # ---------------- STEP 10: Preserve Metadata ---------------- #

            result["type"] = q.get("type")
            result["difficulty"] = q.get("difficulty")

            result["metadata"] = metadata

            result["source"] = metadata.get("source")
            result["act_name"] = metadata.get("act_name")
            result["section"] = metadata.get("section")
            result["section_title"] = metadata.get("section_title")
            result["chapter_title"] = metadata.get("chapter_title")

            mcqs.append(result)

        return mcqs