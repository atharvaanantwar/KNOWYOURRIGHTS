import os
import re
import json
from langchain_core.documents import Document


# ---------------- CHUNKER CLASS ---------------- #

class MarkdownChunker:

    # ---------------- EXTRACTION FUNCTIONS ---------------- #

    def extract_chapter_info(self, text: str):
        match = re.search(r'## (CHAPTER [IVXLC\d]+) - (.*)', text)
        if match:
            return match.group(1), match.group(2)
        return None, None

    def extract_section_info(self, text: str):
        match = re.search(r'## Section (\d+): (.*)', text)
        if match:
            return match.group(1), match.group(2)
        return None, None


    # ---------------- CHUNKING LOGIC ---------------- #

    def chunk_by_sections(self, md_text: str, source_file: str):

        sections = re.split(r'(?=## Section \d+:)', md_text)

        chunks = []

        current_chapter = None
        current_chapter_title = None

        chunk_id = 0

        for sec in sections:

            sec = sec.strip()
            if len(sec) < 50:
                continue

            # ✅ STEP 1: detect chapter INSIDE chunk
            chapter_match = re.search(r'##\s*(CHAPTER [IVXLC\d]+)\s*-\s*(.*)', sec)

            if chapter_match:
                current_chapter = chapter_match.group(1)
                current_chapter_title = chapter_match.group(2).strip()
                current_chapter_title = re.sub(r'^#+\s*', '', current_chapter_title)

            # ✅ STEP 2: extract section
            section_num, section_title = self.extract_section_info(sec)

            # ✅ STEP 3: remove chapter line from content
            sec = re.sub(r'## CHAPTER [^\n]+', '', sec)

            chunks.append(
                Document(
                    page_content=sec.strip(),
                    metadata={
                        "source": source_file,
                        "document_name": source_file,
                        "type": "legal_document",
                        "chapter": current_chapter,
                        "chapter_title": current_chapter_title,
                        "section": section_num,
                        "section_title": section_title,
                        "chunk_id": chunk_id
                    }
                )
            )

            chunk_id += 1

        return chunks


    # ---------------- SAVE FUNCTIONS ---------------- #

    def save_chunks_to_txt(self, chunks, output_file=r"Data\interim\chunks_output.txt"):
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            for i, chunk in enumerate(chunks):
                f.write(f"\n{'='*80}\n")
                f.write(f"Chunk {i}\n\n")
                f.write(chunk.page_content)
                f.write("\n")


    def save_chunks_to_json(self, chunks, output_file=r"Data\interim\chunks_output.json"):
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        data = []

        for chunk in chunks:
            data.append({
                "text": chunk.page_content,
                "metadata": chunk.metadata
            })

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)


    # ---------------- LOAD ALL FILES ---------------- #

    def load_and_chunk_all_md(self, md_folder: str):

        all_chunks = []

        for file in os.listdir(md_folder):
            if not file.endswith(".md"):
                continue

            file_path = os.path.join(md_folder, file)

            print(f"📄 Processing: {file}")

            print("📂 Folder path:", md_folder)
            print("📂 Files found:", os.listdir(md_folder))

            with open(file_path, "r", encoding="utf-8") as f:
                md_text = f.read()

            chunks = self.chunk_by_sections(md_text, file)

            print(f"✅ Chunks created: {len(chunks)}")

            all_chunks.extend(chunks)

        return all_chunks