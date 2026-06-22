import os
import re
import pymupdf4llm


# ---------------- CLEANER CLASS ---------------- #

class MarkdownCleaner:

    def remove_index_md(self, text):
        if not text:
            return ""

        pattern = r'ARRANGEMENT OF SECTIONS.*?ACT NO\.\s*\d+\s*OF\s*\d+'
        return re.sub(pattern, '', text, flags=re.DOTALL | re.IGNORECASE)

    def fix_chapters(self, text: str) -> str:
        return re.sub(
            r'CHAPTER\s+([IVXLC]+)\s*\n\s*([A-Z\s]+)',
            r'## CHAPTER \1 - \2',
            text
        )

    def fix_split_chapters(self, text: str) -> str:
        return re.sub(
            r'## CHAPTER\s+([IVXLC]+)\n##\s*(.+)',
            r'## CHAPTER \1 - \2',
            text
        )

    def normalize_sections(self, text: str) -> str:

        # **1. Title** → Section
        text = re.sub(
            r'\*\*\s*(\d+)\.\s*(.*?)\*\*',
            r'## Section \1: \2',
            text
        )

        # 1. Title → Section
        text = re.sub(
            r'\n\s*(\d+)\.\s*([A-Za-z ,()\-\[\]]+)',
            r'\n## Section \1: \2',
            text
        )

        return text

    def remove_md_noise(self, text):
        text = re.sub(r'==>.*?<==', '', text)   # images
        text = re.sub(r'>\s*\d+\..*', '', text) # footnotes
        text = re.sub(r'\*{2,}', '', text)      # ****
        return text

    def clean_section_titles(self, text):
        return re.sub(
            r'(## Section \d+: [^\n]+)',
            lambda m: m.group(1).split('—')[0],
            text
        )

    def remove_page_numbers(self, text: str) -> str:
        return re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    def normalize_text(self, text: str) -> str:
        text = re.sub(r'\n{2,}', '\n\n', text)
        return text.strip()

    def clean(self, md_text: str) -> str:
        """Main cleaning pipeline"""

        if not md_text:
            return ""

        md_text = self.remove_index_md(md_text)

        md_text = self.fix_chapters(md_text)
        md_text = self.fix_split_chapters(md_text)

        md_text = self.normalize_sections(md_text)

        md_text = self.remove_md_noise(md_text)
        md_text = self.clean_section_titles(md_text)

        md_text = self.remove_page_numbers(md_text)
        md_text = self.normalize_text(md_text)

        return md_text


# ---------------- PROCESSOR CLASS ---------------- #

class PDFProcessor:

    def __init__(self, cleaner: MarkdownCleaner):
        self.cleaner = cleaner

    def convert_pdf_to_md(self, pdf_path: str) -> str:
        try:
            return pymupdf4llm.to_markdown(pdf_path)
        except Exception as e:
            print(f"❌ Error converting PDF: {pdf_path} → {e}")
            return ""

    def process(self, pdf_path: str) -> str:
        md_text = self.convert_pdf_to_md(pdf_path)

        if not md_text:
            return ""

        return self.cleaner.clean(md_text)


# ---------------- MAIN RUNNER CLASS ---------------- #

class PdfToMarkdown:

    def __init__(self, input_folder: str, output_folder: str):
        self.input_folder = input_folder
        self.output_folder = output_folder

        self.cleaner = MarkdownCleaner()
        self.processor = PDFProcessor(self.cleaner)

        os.makedirs(self.output_folder, exist_ok=True)

    def processPDFs(self):

        if not os.path.exists(self.input_folder):
            raise FileNotFoundError(f"❌ Input folder not found: {self.input_folder}")

        files = os.listdir(self.input_folder)

        if not files:
            print("⚠️ No files found in input folder")
            return

        for file in files:

            if not file.lower().endswith(".pdf"):
                continue

            pdf_path = os.path.join(self.input_folder, file)
            md_filename = file.replace(".pdf", ".md")
            md_path = os.path.join(self.output_folder, md_filename)

            if os.path.exists(md_path):
                print(f"⏭️ Skipping (already exists): {md_filename}")
                continue

            print(f"\n📄 Processing: {file}")

            try:
                md_text = self.processor.process(pdf_path)

                if not md_text.strip():
                    print(f"⚠️ Skipped (empty output): {file}")
                    continue

                with open(md_path, "w", encoding="utf-8") as f:
                    f.write(md_text)

                print(f"✅ Saved: {md_filename}")

            except Exception as e:
                print(f"❌ Error processing {file}: {e}")