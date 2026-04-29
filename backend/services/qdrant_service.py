"""
Handles all communication with the Qdrant vector store.
Call these functions from load_questions.py to pull questions into PostgreSQL.

Qdrant is running locally at localhost:6333
Collection name is set in .env as QDRANT_COLLECTION
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from typing import List, Optional
from config import QDRANT_HOST, QDRANT_PORT, QDRANT_COLLECTION


def get_qdrant_client() -> QdrantClient:
    """Create and return a Qdrant client connected to local instance."""
    return QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)


def fetch_all_questions(limit: int = 1000) -> List[dict]:
    client = get_qdrant_client()

    all_points = []
    next_page = None

    while True:
        results, next_page = client.scroll(
            collection_name=QDRANT_COLLECTION,
            limit=limit,
            with_payload=True,
            with_vectors=False,
            offset=next_page
        )

        all_points.extend(results)

        if next_page is None:
            break

    questions = []

    for point in all_points:
        payload = point.payload

        questions.append({
            "topic":          payload.get("topic", "general"),
            "difficulty":     payload.get("difficulty", "medium"),
            "question_type":  payload.get("question_type", "mcq"),
            "question_text":  payload.get("question_text", ""),
            "options":        payload.get("options"),
            "correct_answer": payload.get("correct_answer", ""),
            "feedback":       payload.get("feedback"),
            "source_chunk":   payload.get("source_chunk"),
        })

    return questions


def fetch_questions_by_topic(topic: str, limit: int = 100) -> List[dict]:
    """
    Fetch questions from Qdrant filtered by a specific topic.
    Useful if you want to load one topic at a time.
    """
    client = get_qdrant_client()

    results, _ = client.scroll(
        collection_name=QDRANT_COLLECTION,
        scroll_filter=Filter(
            must=[FieldCondition(key="topic", match=MatchValue(value=topic))]
        ),
        limit=limit,
        with_payload=True,
        with_vectors=False
    )

    return [point.payload for point in results]


def check_connection() -> bool:
    """
    Quick health check — returns True if Qdrant is reachable.
    Run this first before any loading script.
    """
    try:
        client = get_qdrant_client()
        client.get_collections()
        return True
    except Exception as e:
        print(f"Qdrant connection failed: {e}")
        return False
