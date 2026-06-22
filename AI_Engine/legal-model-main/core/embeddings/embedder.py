from sentence_transformers import SentenceTransformer


class Embedder:
    def __init__(self, model_name="BAAI/bge-base-en-v1.5"):
        print("🔄 Loading embedding model...")
        self.model = SentenceTransformer(model_name)

    def preprocess(self, text):
        return text.strip().lower()

    def embed(self, text):
        text = self.preprocess(text)
        return self.model.encode(text, normalize_embeddings=True)

    def embed_batch(self, texts):
        texts = [self.preprocess(t) for t in texts]
        return self.model.encode(texts, normalize_embeddings=True)