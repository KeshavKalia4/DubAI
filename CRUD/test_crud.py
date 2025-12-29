from user_service import UserService
from tag_service import TagService
from event_service import EventService
from chat_service import ChatService
from follow_service import FollowService
from rso_service import RSOService

def test_user_workflow():
    print("=== Testing User Workflow ===")
    
    # Create user
    user = UserService.create_user(
        netid="testuser",
        name="Test User",
        email="test@uw.edu"
    )
    print(f"✅ Created user: {user['netid']}")
    
    # Complete onboarding
    UserService.complete_onboarding(
        netid="testuser",
        major="Computer Science",
        year="Sophomore",
        selected_tags=["engineering", "robotics", "volunteering"]
    )
    print(f"✅ Completed onboarding")
    
    # Get user with tags
    user_profile = UserService.get_user_with_tags("testuser")
    print(f"✅ User has {len(user_profile['tags'])} tags")
    for tag in user_profile['tags']:
        print(f"   - {tag['tag_name']}: {tag['confidence']}")

def test_chat_workflow():
    print("\n=== Testing Chat Workflow ===")
    
    # Create first conversation
    conv1 = ChatService.create_conversation(
        user_netid="testuser",
        messages=[
            {'role': 'user', 'content': 'What engineering clubs are there?'},
            {'role': 'assistant', 'content': 'Here are some engineering clubs at UW...'}
        ],
        detected_tags=['engineering', 'clubs']
    )
    print(f"✅ Created conversation 1: {conv1['id']}")
    
    # Create second conversation
    conv2 = ChatService.create_conversation(
        user_netid="testuser",
        messages=[
            {'role': 'user', 'content': 'Tell me about volunteering opportunities'},
            {'role': 'assistant', 'content': 'There are many volunteering options...'}
        ],
        detected_tags=['volunteering']
    )
    print(f"✅ Created conversation 2: {conv2['id']}")
    
    # Get conversation context
    context = ChatService.get_conversation_context("testuser")
    print(f"✅ Retrieved conversation context ({len(context)} chars)")

def test_event_workflow():
    print("\n=== Testing Event Workflow ===")
    
    # Create RSO first
    rso = RSOService.create_rso(
        name="UW Robotics Club",
        description="Building robots!",
        is_verified=True
    )
    print(f"✅ Created RSO: {rso['name']}")
    
    # Create event
    from datetime import datetime, timedelta
    future_date = (datetime.utcnow() + timedelta(days=3)).isoformat()
    
    event = EventService.create_event(
        rso_id=rso['id'],
        title="Robotics Workshop",
        description="Learn to build robots",
        date_time=future_date,
        location="CSE 405",
        tags=["engineering", "robotics", "hands-on"]
    )
    print(f"✅ Created event: {event['title']}")
    
    # RSVP to event
    EventService.rsvp_event("testuser", event['id'])
    print(f"✅ RSVP'd to event")
    
    # Get personalized feed
    feed = EventService.get_personalized_feed("testuser")
    print(f"✅ Got personalized feed: {len(feed)} events")

def test_follow_workflow():
    print("\n=== Testing Follow Workflow ===")
    
    # Create another user
    UserService.create_user("alice", "Alice Wang", "alice@uw.edu")
    
    # Follow user
    FollowService.follow_user("testuser", "alice")
    print(f"✅ Followed user: alice")
    
    # Follow RSO
    rso = RSOService.get_rso_by_name("UW Robotics Club")
    FollowService.follow_rso("testuser", rso['id'])
    print(f"✅ Followed RSO: {rso['name']}")
    
    # Get follower counts
    follower_count = FollowService.get_follower_count("testuser")
    following_count = FollowService.get_following_count("testuser")
    print(f"✅ Followers: {follower_count}, Following: {following_count}")

if __name__ == "__main__":
    test_user_workflow()
    test_chat_workflow()
    test_event_workflow()
    test_follow_workflow()
    print("\n🎉 All tests complete!")