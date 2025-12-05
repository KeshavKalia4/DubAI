//Api Contract
export interface ChatResponse {
    response: string;
    sources?: Array<{title: string, url: string}>;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
    //We need to replace this later.
    await new Promise(resolve => setTimeout(resolve, 1000)); //simulating a network delay

    return {
        response: `Mock response to: "${message}". This will be replaced with RAG backend!`,
    };

    // Phase 2: Real API (uncomment when backend ready!)
    // const res = await fetch('http://localhost:8000/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // });
    // return res.json();
}