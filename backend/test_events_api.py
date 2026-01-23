import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5001/api"

def test_events_api():
    print("=" * 60)
    print("STEP 1: Creating a new RSO first")
    print("=" * 60)

    rso_data = {
        "name": "Tech Innovation Club",
        "description": "A student organization focused on technology and innovation",
        "is_verified": True
    }

    print(f"\nPOST {BASE_URL}/rsos/")
    print(f"Request body:\n{json.dumps(rso_data, indent=2)}")

    response = requests.post(
        f"{BASE_URL}/rsos/",
        json=rso_data,
        headers={"Content-Type": "application/json"}
    )

    print(f"\nStatus Code: {response.status_code}")
    rso_response = response.json()
    print(f"Response:\n{json.dumps(rso_response, indent=2)}")

    # Get the RSO ID from the response
    rso_id = rso_response.get('id')
    if not rso_id:
        print("\nFailed to create RSO. Exiting.")
        return

    print("\n" + "=" * 60)
    print("STEP 2: Creating a new event with the RSO ID")
    print("=" * 60)

    event_data = {
        "rso_id": rso_id,
        "title": "Tech Workshop: Introduction to AI",
        "description": "Join us for an exciting workshop on artificial intelligence fundamentals. Learn about machine learning, neural networks, and hands-on coding exercises.",
        "date_time": (datetime.now() + timedelta(days=7)).isoformat(),
        "location": "Engineering Building Room 101",
        "tags": ["technology", "workshop", "AI", "coding"]
    }

    print(f"\nPOST {BASE_URL}/events/")
    print(f"Request body:\n{json.dumps(event_data, indent=2)}")

    response = requests.post(
        f"{BASE_URL}/events/",
        json=event_data,
        headers={"Content-Type": "application/json"}
    )

    print(f"\nStatus Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}")

    print("\n" + "=" * 60)
    print("STEP 3: Getting upcoming events")
    print("=" * 60)
    print(f"\nGET {BASE_URL}/events/upcoming")

    response = requests.get(f"{BASE_URL}/events/upcoming")

    print(f"\nStatus Code: {response.status_code}")
    events = response.json()
    print(f"Number of upcoming events: {len(events)}")
    print(f"\nUpcoming events:\n{json.dumps(events, indent=2)}")

if __name__ == "__main__":
    test_events_api()
