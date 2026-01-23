import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5001/api"

# Sample data for generating random events
RSO_DATA = [
    {"name": "Tech Innovation Club", "description": "Exploring cutting-edge technology and innovation"},
    {"name": "Career Development Society", "description": "Helping students build successful careers"},
    {"name": "Arts & Culture Collective", "description": "Celebrating creativity and cultural expression"},
    {"name": "Sports & Recreation Club", "description": "Promoting fitness and athletic activities"},
]

TITLE_TEMPLATES = [
    "{adj} {topic} Workshop",
    "{topic} Networking Night",
    "Introduction to {topic}",
    "{adj} {topic} Conference",
    "{topic} Career Fair",
    "{topic} Hackathon",
    "{topic} Panel Discussion",
    "Meet & Greet: {topic} Professionals",
    "{topic} Study Session",
    "{adj} {topic} Showcase",
    "{topic} Competition",
    "Alumni Talk: {topic}",
    "{topic} Social Mixer",
    "{adj} {topic} Bootcamp",
    "{topic} Open House",
]

ADJECTIVES = ["Annual", "Weekly", "Spring", "Fall", "Virtual", "In-Person", "Beginner", "Advanced", "Interactive", "Exclusive"]

TOPICS = ["AI/ML", "Web Development", "Data Science", "Product Design", "Finance", "Consulting",
          "Art", "Music", "Photography", "Basketball", "Soccer", "Yoga", "Entrepreneurship",
          "Public Speaking", "Resume Building", "Interview Prep", "Research", "Sustainability"]

DESCRIPTIONS = [
    "Join us for an exciting session where you'll learn practical skills and connect with like-minded peers.",
    "Don't miss this opportunity to expand your knowledge and network with industry professionals.",
    "Whether you're a beginner or experienced, this event has something for everyone.",
    "Come prepared to learn, share ideas, and have fun with our vibrant community.",
    "This hands-on session will give you real-world experience and valuable insights.",
    "Connect with mentors, make new friends, and discover new opportunities.",
    "An engaging event designed to help you grow personally and professionally.",
    "Experience an interactive session with expert speakers and practical activities.",
    "Perfect for students looking to explore new interests and build their skills.",
    "A must-attend event for anyone passionate about making an impact.",
]

LOCATIONS = [
    "HUB Ballroom",
    "Kane Hall 130",
    "Paccar Hall 291",
    "Mary Gates Hall 241",
    "Odegaard Library 220",
    "Engineering Building 105",
    "Suzzallo Library",
    "IMA Gym",
    "Red Square",
    "Husky Union Building",
    "CSE2 Building",
    "Foster School of Business",
    "Allen Library",
    "Meany Hall",
    "The HUB Game Room",
]

TAGS = [
    "technology", "career", "social", "sports", "arts", "workshop", "networking",
    "coding", "design", "business", "health", "music", "photography", "gaming",
    "research", "volunteer", "cultural", "academic", "professional", "fitness",
    "entrepreneurship", "leadership", "community", "creative", "beginner-friendly"
]


def create_rsos():
    """Create RSOs and return their IDs"""
    print("=" * 60)
    print("Creating RSOs...")
    print("=" * 60)

    rso_ids = []
    for rso in RSO_DATA:
        response = requests.post(
            f"{BASE_URL}/rsos/",
            json={**rso, "is_verified": True},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            rso_data = response.json()
            rso_ids.append(rso_data["id"])
            print(f"  Created: {rso['name']} (ID: {rso_data['id'][:8]}...)")
        else:
            print(f"  Failed to create {rso['name']}: {response.status_code}")

    print(f"\nTotal RSOs created: {len(rso_ids)}")
    return rso_ids


def generate_random_event(rso_ids):
    """Generate a random event"""
    adj = random.choice(ADJECTIVES)
    topic = random.choice(TOPICS)
    title_template = random.choice(TITLE_TEMPLATES)
    title = title_template.format(adj=adj, topic=topic)

    # Generate date: 70% upcoming, 30% past
    if random.random() < 0.7:
        # Upcoming: 1-30 days from now
        days_offset = random.randint(1, 30)
    else:
        # Past: 1-14 days ago
        days_offset = -random.randint(1, 14)

    event_date = datetime.now() + timedelta(days=days_offset)
    # Random hour between 9 AM and 8 PM
    event_date = event_date.replace(hour=random.randint(9, 20), minute=random.choice([0, 15, 30, 45]))

    # Select 2-4 random tags
    num_tags = random.randint(2, 4)
    event_tags = random.sample(TAGS, num_tags)

    return {
        "rso_id": random.choice(rso_ids),
        "title": title,
        "description": random.choice(DESCRIPTIONS),
        "date_time": event_date.isoformat(),
        "location": random.choice(LOCATIONS),
        "tags": event_tags
    }


def create_events(rso_ids, count=20):
    """Create random events"""
    print("\n" + "=" * 60)
    print(f"Creating {count} random events...")
    print("=" * 60)

    success_count = 0
    failed_count = 0

    for i in range(count):
        event = generate_random_event(rso_ids)

        response = requests.post(
            f"{BASE_URL}/events/",
            json=event,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            success_count += 1
            event_data = response.json()
            date_str = datetime.fromisoformat(event["date_time"]).strftime("%b %d, %Y")
            print(f"  [{i+1:2d}] Created: {event['title'][:40]:<40} | {date_str}")
        else:
            failed_count += 1
            print(f"  [{i+1:2d}] FAILED: {event['title'][:40]} - {response.status_code}")
            try:
                print(f"       Error: {response.json().get('error', 'Unknown error')[:60]}")
            except:
                pass

    return success_count, failed_count


def main():
    print("\n" + "=" * 60)
    print("   TEST DATA GENERATOR")
    print("=" * 60)

    # Step 1: Create RSOs
    rso_ids = create_rsos()

    if not rso_ids:
        print("\nNo RSOs created. Cannot create events.")
        return

    # Step 2: Create Events
    success, failed = create_events(rso_ids, count=20)

    # Summary
    print("\n" + "=" * 60)
    print("   SUMMARY")
    print("=" * 60)
    print(f"  RSOs created:     {len(rso_ids)}")
    print(f"  Events created:   {success}")
    print(f"  Events failed:    {failed}")
    print(f"  Success rate:     {success/(success+failed)*100:.1f}%")
    print("=" * 60)

    # Verify by fetching upcoming events
    print("\nVerifying: Fetching upcoming events...")
    response = requests.get(f"{BASE_URL}/events/upcoming?limit=5")
    if response.status_code == 200:
        events = response.json()
        print(f"  Found {len(events)} upcoming events in database")
        if events:
            print("\n  Sample events:")
            for event in events[:3]:
                print(f"    - {event['title'][:50]}")
    else:
        print(f"  Failed to fetch events: {response.status_code}")


if __name__ == "__main__":
    main()
