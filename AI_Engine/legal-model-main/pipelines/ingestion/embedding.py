from sentence_transformers import SentenceTransformer

# ✅ Load BGE-base model
embedding_model = SentenceTransformer("BAAI/bge-base-en-v1.5")

# IMPORTANT for BGE
def embed_texts(texts):
    return embedding_model.encode(
        texts,
        normalize_embeddings=True
    )

texts = [chunk.page_content for chunk in chunks]
metadatas = [chunk.metadata for chunk in chunks]

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# ✅ In-memory DB (easy for now)
client = QdrantClient(":memory:")

collection_name = "legal_rag"

client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(
        size=768,  # BGE-base dimension
        distance=Distance.COSINE
    )
)


from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# ✅ In-memory DB (easy for now)
client = QdrantClient(":memory:")

collection_name = "legal_rag"

client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(
        size=768,  # BGE-base dimension
        distance=Distance.COSINE
    )
)