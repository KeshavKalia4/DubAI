import { apiClient, API_ENDPOINTS } from './api';

export interface ChatResponse {
  response: string;
  sources?: Array<{ title: string; url: string }>;
  events_count?: number;
}

interface AiChatRequest {
  message: string;
  user_netid?: string;
}

export async function sendChatMessage(
  message: string,
  userNetid?: string
): Promise<ChatResponse> {
  try {
    const requestData: AiChatRequest = {
      message,
    };

    if (userNetid) {
      requestData.user_netid = userNetid;
    }

    const response = await apiClient.post<ChatResponse>(
      API_ENDPOINTS.chatAi,
      requestData
    );

    return response;
  } catch (error) {
    console.error('Chat API error:', error);

    // Fallback response on error
    return {
      response: "I'm having trouble connecting to the server. Please try again in a moment.",
    };
  }
}
