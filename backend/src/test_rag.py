import json

from generate import generate


def main():
    # Load your mock events with embeddings
    # NOTE: This path assumes you run this file from the backend/src directory:
    #   cd backend/src
    #   python test_rag.py
    with open("data/processed/events_embedded.json", "r") as f:
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
    main()


