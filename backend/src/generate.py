from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env (needed for OPENAI_API_KEY)
load_dotenv()

client = OpenAI()

def generate(user_query, retrieved_docs):
    context = "\n\n".join([
        f"Event: {doc['event_name']}\nClub: {doc['club']}\nTime: {doc['time']}\nLocation: {doc['location']}\nDescription: {doc['description']}"
        for doc in retrieved_docs
    ])
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # or "gpt-4" for better quality
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""Here are relevant UW campus events:

{context}

Question: {user_query}"""
            }
        ]
    )
    return response.choices[0].message.content