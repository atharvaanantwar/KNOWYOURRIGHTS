from core.embeddings.embedder import Embedder
from core.vectordb.vectordb import VectorDB
import json 

def load_chunks_from_json(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    chunks = []
    for item in data:
        chunks.append({
            "text": item["text"],
            "metadata": item["metadata"]
        })

    return chunks
def generate_act_name(metadata):

    if metadata.get("act_name"):
        return metadata["act_name"]

    filename = metadata.get("document_name", "")

    return (
        filename.replace(".md", "")
        .replace(".pdf", "")
        .replace("_", " ")
        .title()
    )

def build_enriched_text(text, metadata):

    act_name = generate_act_name(metadata)

    chapter = metadata.get("chapter", "")
    chapter_title = metadata.get("chapter_title", "")

    section = metadata.get("section", "")
    section_title = metadata.get("section_title", "")

    return f"""
Legal Document: {act_name}

Chapter: {chapter}
{chapter_title}

Section Reference: Section {section}: {section_title}

{text}
""".strip()

def main():
    print("🚀 Ingesting chunks into VectorDB...\n")

    # 1) Load & chunk markdown
    chunks = load_chunks_from_json("Data/interim/chunks_output.json")

    enriched_chunks = []

    for i, chunk in enumerate(chunks):

        text = chunk["text"]
        metadata = chunk["metadata"]

        if not text.strip():
            continue

        act_name = generate_act_name(metadata)

        metadata["act_name"] = act_name

        section = metadata.get("section", "")
        section_title = metadata.get("section_title", "")

        if section:
            metadata["section_reference"] = (
                f"Section {section}: {section_title}"
            )

        enriched_text = build_enriched_text(
            text,
            metadata
        )

        enriched_chunks.append({
            "text": enriched_text,
            "metadata": {
                **metadata,
                "chunk_id": i
            }
        })

    # Pretty print first 3 chunks
    print(json.dumps(
        enriched_chunks[:3],
        indent=2,
        ensure_ascii=False
    ))

    # Optional: save to file
    with open(
        "Data/interim/enriched_chunks.json",
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            enriched_chunks,
            f,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"\n✅ Saved {len(enriched_chunks)} enriched chunks to "
        f"Data/interim/enriched_chunks.json"
    )


    print(f"📄 Total chunks: {len(chunks)}")

    # 2) Init embedder
    embedder = Embedder()

    # 3) Init VectorDB (RAG collection)
    vectordb = VectorDB(
        collection_name="legal_chunks",
        db_location="Data/qdrant_db"
    )

    if vectordb.collection_exists():
        print("⚠️ Collection exists. Deleting and rebuilding...")
        vectordb.client.delete_collection(vectordb.collection_name)
    
    vectordb.recreate_collection()
    
    # 4) Prepare data
    vectors, texts, metadatas = [], [], []

    for i, chunk in enumerate(chunks):
        text = chunk["text"]
        metadata = chunk["metadata"]

        title = metadata.get("section_title", "")
        combined = f"{title}. {text}"

        if not text:
            continue

        emb = embedder.embed(f"passage: {combined}")

        vectors.append(emb)
        texts.append(text)
        metadatas.append({
            **metadata,
            "chunk_id": i
        })

    # 5) Insert into Qdrant
    vectordb.insert(vectors, texts, metadatas)

    print("\n✅ Ingestion complete!")


if __name__ == "__main__":
    main()