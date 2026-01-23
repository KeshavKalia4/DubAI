/**
 * Chat API Service
 *
 * Handles all chat/conversation-related API calls including:
 * - Conversation management
 * - Message appending
 * - User conversation history
 */

import { api } from './client';
import type { BackendConversation, BackendMessage } from '@/types';

export interface CreateConversationRequest {
  user_netid: string;
  messages: BackendMessage[];
  detected_tags?: string[];
}

export interface AppendMessagesRequest {
  new_messages: BackendMessage[];
  detected_tags?: string[];
}

export interface ConversationContextResponse {
  context: string;
}

export interface AiChatRequest {
  message: string;
  user_netid?: string;
}

export interface AiChatResponse {
  response: string;
  events_count: number;
}

// Longer timeout for AI chat (30 seconds)
const AI_CHAT_TIMEOUT = 30000;

export const chatApi = {
  /**
   * Send a message to the AI chat endpoint
   * Uses a longer timeout since OpenAI can take time to respond
   */
  sendAiMessage: (data: AiChatRequest) =>
    api.post<AiChatResponse>('/chats/ai', data, { timeout: AI_CHAT_TIMEOUT }),

  /**
   * Create a new conversation
   */
  create: (data: CreateConversationRequest) =>
    api.post<BackendConversation>('/chats/', data),

  /**
   * Append messages to an existing conversation
   */
  appendMessages: (conversationId: string, data: AppendMessagesRequest) =>
    api.post<BackendConversation>(`/chats/${conversationId}/messages`, data),

  /**
   * Get a conversation by ID
   */
  get: (conversationId: string) =>
    api.get<BackendConversation>(`/chats/${conversationId}`),

  /**
   * Get messages for a conversation
   */
  getMessages: (conversationId: string) =>
    api.get<BackendMessage[]>(`/chats/${conversationId}/messages`),

  /**
   * Get all conversations for a user
   */
  getUserConversations: (userNetid: string) =>
    api.get<BackendConversation[]>(`/chats/user/${userNetid}`),

  /**
   * Get conversation context for LLM (formatted history)
   */
  getConversationContext: (userNetid: string) =>
    api.get<ConversationContextResponse>(`/chats/user/${userNetid}/context`),

  /**
   * Delete a conversation
   */
  delete: (conversationId: string) =>
    api.delete<{ success: boolean }>(`/chats/${conversationId}`),

  /**
   * Clear all conversations for a user
   */
  clearUserConversations: (userNetid: string) =>
    api.delete<{ success: boolean }>(`/chats/user/${userNetid}`),
};
