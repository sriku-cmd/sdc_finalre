import pypdf
import sys

def extract_text(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    print("Starting extraction...")
    try:
        text = extract_text("Social Media Platform.pdf")
        print("Extraction complete. Length:", len(text))
        with open("pdf_content.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Written to file.")
    except Exception as e:
        print("Error:", e)
