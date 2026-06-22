from core.llm.mistral_client import MistralClient
from core.database.database import QuestionDB
from core.embeddings.embedder import Embedder
from core.vectordb.vectordb import VectorDB

from pipelines.mcq_generation.generator import MCQGenerator
from pipelines.mcq_generation.mcq_pipeline import MCQPipeline

import json 
import time

BATCH_SIZE = 10

def main():

    print("🚀 Starting MCQ Generation...\n")

    db = QuestionDB(file_path="Data/question_db/mcq_questions.json")
    questions = db.get_all_questions()

    print(f"Loaded {len(questions)} questions")

    print(f"Generating MCQs for {len(questions[:10])} questions...")

    # ✅ LLM
    llm = MistralClient(api_key="GIwJcL7e5XZLEHvlW6hP3xdPwp4BI6cH") 
    generator = MCQGenerator(llm)

    # ✅ ADD THESE (NEW)
    embedder = Embedder()
    vectordb = VectorDB(
        collection_name="legal_chunks",
        db_location="Data/qdrant_db"
    )

    # ✅ FIXED PIPELINE INIT
    pipeline = MCQPipeline(generator, vectordb, embedder)

    all_mcqs = []

    for i in range(0, len(questions), BATCH_SIZE):

        batch = questions[i:i + BATCH_SIZE]

        print(f"\n🔄 Processing batch {i//BATCH_SIZE + 1} ({len(batch)} questions)...")

        mcqs = pipeline.run(batch)

        all_mcqs.extend(mcqs)

        with open("Data\\question_db\\mcqs_output.json", "w", encoding="utf-8") as f:
            json.dump(all_mcqs, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved {len(all_mcqs)} MCQs so far")

        time.sleep(2)
    
    print("\n🎯 MCQ Generation Complete!")



if __name__ == "__main__":
    main()
    