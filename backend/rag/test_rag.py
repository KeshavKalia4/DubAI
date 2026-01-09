import json
from pathlib import Path

from rag.generate import generate

BASE_DIR = Path(__file__).resolve().parent
PROCESSED_PATH = BASE_DIR / "data" / "processed" / "events_embedded.json"


def main():
    # Load your mock events with embeddings
    with PROCESSED_PATH.open("r", encoding="utf-8") as f:
        events = json.load(f)

    # Use a small subset and drop the embedding field (not needed for the LLM)
    retrieved_docs = []
    for e in events[:5]:  # take first 5 for testing
        retrieved_docs.append(
            {
                "event_name": e["event_name"],
                "club": e["club"],
                "time": e["time"],
                "location": e["location"],
                "description": e["description"],
            }
        )

    # Ask a question about these events
    user_query = "Does UW Punjabi Club have any events coming up?"

    answer = generate(user_query, retrieved_docs)
    print("\n=== Question ===")
    print(user_query)
    print("\n=== Answer from OpenAI ===")
    print(answer)


if __name__ == "__main__":
    # Run from backend directory: python -m rag.test_rag
    main()
