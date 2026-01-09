import json
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
RAW_EVENTS_PATH = BASE_DIR / "data" / "raw" / "mock_uw_events.json"
PROCESSED_PATH = BASE_DIR / "data" / "processed" / "events_embedded.json"

# Load events from JSON
with RAW_EVENTS_PATH.open("r", encoding="utf-8") as f:
    events = json.load(f)

# Generate text strings for embedding
texts = []
for event in events:
    text = f"{event['event_name']} by {event['club']}. {event['description']} Location: {event['location']}. Time: {event['time']}."
    texts.append(text)

# OpenAI embeddings
client = OpenAI()

response = client.embeddings.create(
    input=texts,
    model="text-embedding-3-small"
)

# Combine events with their embeddings
embedded_events = []
for i, embedding_data in enumerate(response.data):
    embedded_events.append({
        **events[i],
        "embedding": embedding_data.embedding
    })

# Ensure output directory exists
PROCESSED_PATH.parent.mkdir(parents=True, exist_ok=True)

# Save to processed folder
with PROCESSED_PATH.open("w", encoding="utf-8") as f:
    json.dump(embedded_events, f)

print(f"✓ Saved {len(embedded_events)} embedded events to {PROCESSED_PATH}")
