from pipelines.ingestion.pdf_to_md import PdfToMarkdown
from pipelines.ingestion.chunker import MarkdownChunker



class Pipeline:

    def __init__(self):
        self.pdf = PdfToMarkdown(
            input_folder="Data/processed",
            output_folder="Data/markdown"
        )
        self.chunker = MarkdownChunker()
        

    def run(self):

        # ---------------- STEP 1 ---------------- #
        print("\n🚀 STEP 1: PDF → Markdown")
        self.pdf.processPDFs()

        # ---------------- STEP 2 ---------------- #
        print("\n🚀 STEP 2: Markdown → Chunks")
        chunks = self.chunker.load_and_chunk_all_md(
            "Data/markdown"
        )

        print(f"🔥 Total chunks: {len(chunks)}")

        # OPTIONAL: Save chunks (your original functions preserved)
        self.chunker.save_chunks_to_txt(chunks)
        self.chunker.save_chunks_to_json(chunks)



if __name__ == "__main__":
    Pipeline().run()