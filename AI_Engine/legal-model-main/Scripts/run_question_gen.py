from core.database.database import QuestionDB

from pipelines.ingestion.chunker import MarkdownChunker

import time

from pipelines.question_generation.question_pipeline import QuestionPipeline
from pipelines.question_generation.generator import QuestionGenerator
from pipelines.question_generation.deduplicator import Deduplicator

from core.llm.mistral_client import MistralClient
from core.embeddings.embedder import Embedder
from core.vectordb.vectordb import VectorDB


BATCH_SIZE = 10

# 🔥 CHANGE THIS TO "mcq" OR "true_false" OR "match_pair"
MODE = "mcq"   # mcq / true_false / match_pair


def main():
    print(f"🚀 Starting {MODE.upper()} Question Generation Pipeline...\n")

    # ---------------- LOAD DATA ---------------- #

    print("📄 Loading and chunking markdown files...")
    chunker = MarkdownChunker()
    chunks = chunker.load_and_chunk_all_md("Data/markdown")

    print(f"✅ Loaded {len(chunks)} chunks\n")

    # ---------------- INITIALIZE COMPONENTS ---------------- #

    print("🔧 Initializing components...")

    llm = MistralClient(api_key="GIwJcL7e5XZLEHvlW6hP3xdPwp4BI6cH") 

    generator = QuestionGenerator(llm)
    embedder = Embedder()

    vectordb = VectorDB(
        collection_name="questions_db",
        db_location="Data/qdrant_db"
    )

    deduplicator = Deduplicator(embedder, vectordb)

    # 🔥 SEPARATE STORAGE BASED ON MODE
    if MODE == "mcq":
        db_path = "Data/question_db/mcq_questions.json"

    elif MODE == "true_false":
        db_path = "Data/question_db/true_false_questions.json"

    elif MODE == "match_pair":
        db_path = "Data/question_db/match_pair_questions.json"

    else:
        raise ValueError("Invalid MODE. Use 'mcq', 'true_false', or 'match_pair'.")

    db = QuestionDB(file_path=db_path)

    # 🔥 PASS MODE TO PIPELINE
    pipeline = QuestionPipeline(generator, deduplicator, db, mode=MODE)

    print("✅ Initialization complete\n")

    # ---------------- RUN PIPELINE ---------------- #

    print(f"🧠 Generating {MODE.upper()} questions...\n")

    all_questions = []

    for i in range(0, len(chunks), BATCH_SIZE):

        batch_chunks = chunks[i:i + BATCH_SIZE]

        print(f"\n🔄 Processing batch {i//BATCH_SIZE + 1} ({len(batch_chunks)} chunks)...")

        formatted_chunks = [
            {
                "text": c.page_content,
                "metadata": c.metadata
            }
            for c in batch_chunks
        ]

        questions = pipeline.run(formatted_chunks)
        all_questions.extend(questions)

        print(f"✅ Total questions so far: {len(all_questions)}")

        time.sleep(2)

    print(f"\n🎉 {MODE.upper()} Question generation completed!")
    print(f"📊 Total unique questions generated: {len(all_questions)}")

    # ---------------- SAMPLE OUTPUT ---------------- #

    print("\n🔎 Sample Questions:\n")

    for i, q in enumerate(all_questions[:5], 1):
        difficulty = q.get("difficulty", "medium")

        if MODE == "true_false":
            print(f"{i}. {q['question']}  ({difficulty} | Answer: {q.get('answer')})")

        elif MODE == "match_pair":
            print(f"{i}. MATCH THE PAIRS ({difficulty})")
            for pair in q.get("pairs", []):
                print(f"   - {pair['left']}  ↔  {pair['right']}")

        else:  # MCQ
            print(f"{i}. {q['question']}  ({q['type']} | {difficulty})")


if __name__ == "__main__":
    main()