import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Load events from JSON
with open("data/raw/mock_uw_events.json", "r") as f:
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

# Save to processed folder
with open("data/processed/events_embedded.json", "w") as f:
    json.dump(embedded_events, f)

print(f"✓ Saved {len(embedded_events)} embedded events to data/processed/events_embedded.json")
