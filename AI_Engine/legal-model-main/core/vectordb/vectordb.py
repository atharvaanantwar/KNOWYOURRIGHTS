# # core/vector_db/vectordb.py

# import uuid
# import os
# from qdrant_client import QdrantClient
# from qdrant_client.models import Distance, VectorParams, PointStruct


# class VectorDB:
#     def __init__(self, collection_name="legal_rag", db_location="Data/qdrant_db", dim=768):
#         # 🔥 Ensure folder exists
#         os.makedirs(db_location, exist_ok=True)

#         # 🔥 Local mode
#         self.client = QdrantClient(path=db_location)

#         self.collection_name = collection_name
#         self.dim = dim

#         self._create_collection()

#     # ---------------- CREATE COLLECTION ---------------- #

#     def _create_collection(self):
#         # 🔥 UPDATED: do NOT recreate every time (preserve data)
#         existing_collections = [c.name for c in self.client.get_collections().collections]

#         if self.collection_name not in existing_collections:
#             self.client.create_collection(
#                 collection_name=self.collection_name,
#                 vectors_config=VectorParams(
#                     size=self.dim,
#                     distance=Distance.COSINE
#                 )
#             )

#     # ---------------- HELPER ---------------- #

#     def _to_list(self, vector):
#         """
#         Ensure vector is list (handles numpy / torch / list)
#         """
#         return vector.tolist() if hasattr(vector, "tolist") else vector

#     # ---------------- INSERT (BULK - for RAG) ---------------- #

#     def insert(self, vectors, texts, metadatas):
#         points = []

#         for vector, text, meta in zip(vectors, texts, metadatas):
#             points.append(
#                 PointStruct(
#                     id=str(uuid.uuid4()),
#                     vector=self._to_list(vector),
#                     payload={
#                         "text": text,
#                         **meta
#                     }
#                 )
#             )

#         self.client.upsert(
#             collection_name=self.collection_name,
#             points=points
#         )

#     # ---------------- ADD SINGLE (for dedup) ---------------- #

#     def add(self, vector, payload):
#         """
#         Add single question (used by Deduplicator)
#         """
#         point = PointStruct(
#             id=str(uuid.uuid4()),
#             vector=self._to_list(vector),
#             payload=payload
#         )

#         self.client.upsert(
#             collection_name=self.collection_name,
#             points=[point]
#         )

#     # ---------------- SEARCH (DEDUP USE CASE) ---------------- #

#     def search(self, query_vector, k=5):
#         """
#         Returns full results WITH scores (needed for dedup)
#         """
#         results = self.client.query_points(
#             collection_name=self.collection_name,
#             query=self._to_list(query_vector),
#             limit=k
#         )

#         return results.points

#     # ---------------- SEARCH PAYLOAD ONLY (RAG USE CASE) ---------------- #

#     def search_payload(self, query_vector, k=5):
#         results = self.search(query_vector, k)
#         return [hit.payload for hit in results]

#     # ---------------- FILTER SEARCH ---------------- #

#     def search_with_filter(self, query_vector, filter_condition, k=5):
#         results = self.client.query_points(
#             collection_name=self.collection_name,
#             query=self._to_list(query_vector),
#             limit=k,
#             query_filter=filter_condition
#         )

#         return results.points# core/vector_db/vectordb.py

import uuid
import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


class VectorDB:
    def __init__(self, collection_name="legal_rag", db_location="Data/qdrant_db", dim=768):
        # 🔥 Ensure folder exists
        os.makedirs(db_location, exist_ok=True)

        # 🔥 Local mode
        self.client = QdrantClient(path=db_location)

        self.collection_name = collection_name
        self.dim = dim

        self._create_collection()

    # ---------------- CREATE COLLECTION ---------------- #

    def _create_collection(self):
        try:
            self.client.get_collection(self.collection_name)
            print(f"⚠️ Collection '{self.collection_name}' already exists.")
        except:
            print(f"🆕 Creating collection '{self.collection_name}'...")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.dim,
                    distance=Distance.COSINE
                )
            )

    def recreate_collection(self):
        try:
            self.client.delete_collection(self.collection_name)
        except:
            pass

        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(
                size=self.dim,
                distance=Distance.COSINE
            )
        )

    # ---------------- HELPER ---------------- #

    def _to_list(self, vector):
        """
        Ensure vector is list (handles numpy / torch / list)
        """
        return vector.tolist() if hasattr(vector, "tolist") else vector

    # ---------------- INSERT (BULK - for RAG) ---------------- #

    def insert(self, vectors, texts, metadatas):
        points = []

        for vector, text, meta in zip(vectors, texts, metadatas):
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=self._to_list(vector),
                    payload={
                        "text": text,
                        **meta
                    }
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    # ---------------- ADD SINGLE (for dedup) ---------------- #

    def add(self, vector, payload):
        """
        Add single question (used by Deduplicator)
        """
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=self._to_list(vector),
            payload=payload
        )

        self.client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )

    # ---------------- SEARCH (DEDUP USE CASE) ---------------- #

    def search(self, query_vector, k=5):
        """
        Returns full results WITH scores (needed for dedup)
        """
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=self._to_list(query_vector),
            limit=k
        )

        return results.points

    # ---------------- SEARCH PAYLOAD ONLY (RAG USE CASE) ---------------- #

    def search_payload(self, query_vector, k=5):
        results = self.search(query_vector, k)
        return [hit.payload for hit in results]

    # ---------------- FILTER SEARCH ---------------- #

    def search_with_filter(self, query_vector, filter_condition, k=5):
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=self._to_list(query_vector),
            limit=k,
            query_filter=filter_condition
        )

        return results.points
    
    def collection_exists(self):
        collections = self.client.get_collections().collections
        return any(c.name == self.collection_name for c in collections)